"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export const MindChat = () => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("mindChatHistory");

    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        setMessages([
          {
            role: "ai",
            text: "Ask me anything about my experience, projects, or how I solved specific data challenges.",
          },
        ]);
      }
    } else {
      setMessages([
        {
          role: "ai",
          text: "Ask me anything about my experience, projects, or how I solved specific data challenges.",
        },
      ]);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      sessionStorage.setItem("mindChatHistory", JSON.stringify(messages));
    }

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, isLoaded]);

  const handleSend = async (text?: string) => {
    const userMsg = typeof text === "string" ? text.trim() : input.trim();

    if (!userMsg) return;

    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(
        "http://localhost:3001/api/neural-interface/stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMsg,
            history: messages.slice(1).map((m) => ({
              role: m.role === "ai" ? "model" : "user",
              text: m.text,
            })),
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Network error");
      }

      setMessages((prev) => [...prev, { role: "ai", text: "" }]);
      setIsTyping(false);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      let done = false;

      while (reader && !done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6);

              if (dataStr.trim() === "[DONE]") break;

              try {
                const parsed = JSON.parse(dataStr);

                if (parsed.text) {
                  setMessages((prev) => {
                    const newMessages = [...prev];

                    newMessages[newMessages.length - 1] = {
                      ...newMessages[newMessages.length - 1],
                      text:
                        newMessages[newMessages.length - 1].text + parsed.text,
                    };

                    return newMessages;
                  });
                }
              } catch {
                // Ignore partial JSON chunks
              }
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Neural link offline or rate limited. Please ensure the backend is running and you have remaining API quota.",
        },
      ]);

      setIsTyping(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-[600px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <span className="animate-pulse">Initializing Neural Link...</span>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] flex-col rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="border-b border-white/10 p-6">
        <h3 className="flex items-center gap-2 font-bold">
          <Bot className="h-5 w-5 text-blue-400" />
          Neural Interface
        </h3>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 space-y-4 overflow-y-auto p-6 scroll-smooth"
      >
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-gray-200"
              }`}
            >
              {m.role === "user" ? (
                m.text
              ) : (
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/50">
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-1 rounded-2xl bg-white/10 px-4 py-3 text-sm text-gray-200">
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="border-t border-white/5 bg-white/5 p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => handleSend("What's a hard bug you fixed?")}
            className="rounded-full border border-white/5 bg-white/10 px-4 py-2.5 text-xs text-gray-300 transition-colors hover:bg-white/20"
          >
            What's a hard bug you fixed?
          </button>

          <button
            onClick={() => handleSend("What's your ML stack?")}
            className="rounded-full border border-white/5 bg-white/10 px-4 py-2.5 text-xs text-gray-300 transition-colors hover:bg-white/20"
          >
            What's your ML stack?
          </button>
        </div>

        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            placeholder="Inquire the mind..."
            className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            disabled={isTyping}
          />

          <button
            onClick={() => handleSend()}
            disabled={isTyping}
            className="absolute right-2 top-1.5 p-2 text-gray-400 transition-colors hover:text-white disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
