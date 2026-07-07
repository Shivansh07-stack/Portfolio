// server.js
// Versatile version: streams replies (SSE) and reads persona/config from env vars so the
// same backend can power more than one chat widget if you ever want that.
//
// Install:  npm install express cors dotenv
// Run:      node server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { KNOWLEDGE_BASE } = require('./knowledge-base');

const app = express();
app.use(helmet());
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3002'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const STREAM_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`;

// --- rate limiting (per IP) ---
const requestLog = new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  const trimmed = history.slice(-10);
  const firstUserIndex = trimmed.findIndex(t => t.role === 'user');
  return firstUserIndex === -1 ? [] : trimmed.slice(firstUserIndex);
}

// --- Non-streaming endpoint (kept for simplicity / fallback clients) ---
app.post('/api/neural-interface', async (req, res) => {
  try {
    const ip = req.ip;
    if (isRateLimited(ip)) return res.status(429).json({ error: 'Too many requests, slow down a bit.' });

    const { message, history } = req.body;
    if (!message || typeof message !== 'string' || message.length > 1000) {
      return res.status(400).json({ error: 'Invalid message.' });
    }
    if (!GEMINI_API_KEY) return res.status(500).json({ error: 'Server misconfigured: missing GEMINI_API_KEY.' });

    const contents = sanitizeHistory(history)
      .map(t => ({ role: t.role, parts: [{ text: t.text }] }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const nonStreamUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(nonStreamUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: KNOWLEDGE_BASE }] },
        contents,
        generationConfig: { temperature: 0.6, maxOutputTokens: 400 },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      return res.status(502).json({ error: 'Upstream model error.' });
    }

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') ||
      "I'm not able to answer that right now — try rephrasing, or reach out to Shivansh directly.";
    return res.json({ reply });
  } catch (err) {
    console.error('Neural interface error:', err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
});

// --- Streaming endpoint (Server-Sent Events) — use this for a "typing" effect ---
app.post('/api/neural-interface/stream', async (req, res) => {
  try {
    const ip = req.ip;
    if (isRateLimited(ip)) return res.status(429).json({ error: 'Too many requests, slow down a bit.' });

    const { message, history } = req.body;
    if (!message || typeof message !== 'string' || message.length > 1000) {
      return res.status(400).json({ error: 'Invalid message.' });
    }
    if (!GEMINI_API_KEY) return res.status(500).json({ error: 'Server misconfigured: missing GEMINI_API_KEY.' });

    const contents = sanitizeHistory(history)
      .map(t => ({ role: t.role, parts: [{ text: t.text }] }));
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
      res.status(502).json({ error: 'Upstream model error.' });
      return;
    }

    // Set up SSE response to the browser
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Gemini SSE sends lines like: "data: {...}\n\n"
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep last partial line in buffer

      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const jsonStr = line.slice(5).trim();
        if (!jsonStr) continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const chunkText = parsed?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
          if (chunkText) {
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
          }
        } catch {
          // ignore partial/non-JSON lines
        }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Neural interface stream error:', err);
    if (!res.headersSent) res.status(500).json({ error: 'Something went wrong.' });
    else res.end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Neural Interface backend running on port ${PORT}`));
