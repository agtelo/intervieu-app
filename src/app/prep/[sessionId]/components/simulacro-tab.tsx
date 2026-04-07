"use client";

import { useState, useEffect, useRef } from "react";
import { Mic2, Check } from "lucide-react";
import type { BriefingResult } from "@/lib/types";

export function SimulacroTab({
  sessionId,
  briefing,
  cvText,
  jdText
}: {
  sessionId: string;
  briefing: BriefingResult;
  cvText: string;
  jdText: string;
}) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting message
  useEffect(() => {
    const initialMessage = `Hola, bienvenido. Soy tu entrevistador para la posición en ${briefing.empresa.nombre}. He revisado tu perfil y estoy impresionado. Empecemos con la entrevista. ¿Podrías contarme acerca de tu experiencia más relevante para este rol?`;
    setMessages([{ role: "assistant", content: initialMessage }]);
  }, [briefing.empresa.nombre]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 140) + "px";
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          systemPrompt: `Eres un entrevistador profesional simulando una entrevista para ${briefing.empresa.nombre}.
          El candidato está aplicando para un puesto con la siguiente descripción:
          ${jdText.slice(0, 500)}

          CV del candidato:
          ${cvText.slice(0, 500)}

          Contexto adicional sobre la empresa:
          ${briefing.empresa.descripcion}

          Haz preguntas relevantes y proporciona feedback constructivo. Evalúa competencias, motivación y fit con la empresa.`,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      // Parse SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6);
              if (dataStr === "[DONE]") break;
              try {
                const data = JSON.parse(dataStr);
                if (data.text) {
                  fullText += data.text;
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: fullText }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Lo siento, hubo un error. Intenta de nuevo." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background lg:relative lg:inset-auto lg:rounded-2xl lg:border lg:border-teal/20 animate-fade-in overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 px-5 py-6 sm:px-8 sm:py-8 border-b border-teal/20 bg-gradient-to-r from-surface/80 via-surface/60 to-teal/5 backdrop-blur-sm">
        <div className="flex items-start gap-4 mb-4">
          <Mic2 className="w-10 h-10 text-teal mt-1 flex-shrink-0" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-text leading-tight">
              Simulacro en Vivo
            </h1>
            <p className="text-xs text-text-muted font-mono uppercase tracking-widest mt-2">
              {briefing.empresa.nombre}
            </p>
          </div>
        </div>
        <p className="text-sm text-text-muted leading-relaxed font-light">
          Practicando con un entrevistador IA adaptado a tu perfil
        </p>
      </div>

      {/* Messages - Scrollable with invisible scrollbar */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4 scrollbar-hidden">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"} animate-fade-in w-full`}>
            <div
              className={`w-full sm:max-w-2xl px-5 sm:px-6 py-4 rounded-2xl transition-all duration-300 ${
                msg.role === "assistant"
                  ? "bg-surface border border-teal/20 text-text shadow-md shadow-teal/5 hover:border-teal/40 hover:bg-surface/95"
                  : "bg-gradient-to-r from-teal to-teal/90 text-white shadow-lg shadow-teal/30"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-light break-words">
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start w-full">
            <div className="bg-surface border border-teal/20 px-6 py-4 rounded-2xl shadow-md shadow-teal/5">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-teal animate-bounce" />
                <div
                  className="w-2.5 h-2.5 rounded-full bg-teal animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2.5 h-2.5 rounded-full bg-teal animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed */}
      <form
        onSubmit={handleSubmit}
        className="flex-shrink-0 p-5 sm:p-8 border-t border-teal/20 bg-gradient-to-t from-surface/95 via-surface/60 to-teal/5 backdrop-blur-sm"
      >
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
            placeholder="Tu respuesta aquí... (Shift+Enter para nueva línea)"
            disabled={loading}
            className="flex-1 px-5 py-3 bg-surface border border-teal/20 rounded-xl focus:border-teal/50 focus:outline-none focus:ring-1 focus:ring-teal/20 text-text placeholder:text-text-muted disabled:opacity-50 transition-all duration-300 font-light resize-none max-h-36 overflow-y-auto scrollbar-hidden"
            rows={1}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="group relative flex-shrink-0 w-11 h-11 bg-gradient-to-r from-teal via-teal to-teal/70 text-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-teal/60 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:shadow-none disabled:hover:scale-100 flex items-center justify-center"
            title="Enviar respuesta (Enter)"
          >
            <Check className="w-5 h-5 relative z-10" />
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 disabled:hidden" />
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        /* Invisible scrollbar */
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
