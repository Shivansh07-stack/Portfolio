import { NextResponse } from 'next/server';
import { KNOWLEDGE_BASE } from '../../../../lib/knowledge-base';

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const STREAM_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`;

function sanitizeHistory(history: any[]) {
  if (!Array.isArray(history)) return [];
  const trimmed = history.slice(-10);
  const firstUserIndex = trimmed.findIndex((t) => t.role === 'user');
  return firstUserIndex === -1 ? [] : trimmed.slice(firstUserIndex);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string' || message.length > 1000) {
      return NextResponse.json({ error: 'Invalid message.' }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Server misconfigured: missing GEMINI_API_KEY.' }, { status: 500 });
    }

    const contents = sanitizeHistory(history).map((t) => ({
      role: t.role,
      parts: [{ text: t.text }],
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const upstream = await fetch(`${STREAM_URL}&key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: KNOWLEDGE_BASE }] },
        contents,
        generationConfig: { temperature: 0.6, maxOutputTokens: 500 },
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => '');
      console.error('Gemini stream error:', upstream.status, errText);
      return NextResponse.json({ error: 'Upstream model error.' }, { status: 502 });
    }

    let buffer = '';
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const value = decoder.decode(chunk, { stream: true });
        buffer += value;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const jsonStr = line.slice(5).trim();
          if (!jsonStr) continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const chunkText = parsed?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
            if (chunkText) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunkText })}\n\n`));
            }
          } catch {
            // ignore partial/non-JSON lines
          }
        }
      },
      flush(controller) {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      }
    });

    return new Response(upstream.body.pipeThrough(transformStream), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    console.error('Neural interface stream error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
