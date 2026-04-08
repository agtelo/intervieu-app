"use client";

import { useState, useEffect, useRef } from "react";
import { Mic2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="flex flex-col bg-background h-full lg:rounded-2xl lg:border lg:border-teal/20 lg:h-[600px] animate-fade-in overflow-hidden">
      {/* Error announcements for screen readers */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {messages.find(m => m.content.includes("Lo siento")) && "Error: " + messages.find(m => m.content.includes("Lo siento"))?.content}
      </div>

      {/* Header - Fixed */}
      <div className="flex-shrink-0 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 border-b border-teal/20 bg-gradient-to-r from-surface/80 via-surface/60 to-teal/5 backdrop-blur-sm">
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <Mic2 className="w-8 sm:w-10 h-8 sm:h-10 text-teal mt-1 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text leading-tight">
              Simulacro en Vivo
            </h1>
            <p className="text-xs text-text-muted font-mono uppercase tracking-widest mt-1 sm:mt-2 truncate">
              {briefing.empresa.nombre}
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-light">
          Practicando con un entrevistador IA adaptado a tu perfil
        </p>
      </div>

      {/* Messages - Scrollable with styled scrollbar */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8 space-y-3 sm:space-y-4 messages-scroll">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"} animate-fade-in w-full`}>
            <article
              role="article"
              aria-label={msg.role === "assistant" ? "Respuesta del entrevistador" : "Tu respuesta"}
              className={`w-full max-w-full sm:max-w-lg lg:max-w-2xl px-4 sm:px-6 py-4 rounded-2xl transition-all duration-300 ${
                msg.role === "assistant"
                  ? "bg-surface border border-teal/20 text-text shadow-md shadow-teal/5 hover:shadow-lg hover:shadow-teal/20"
                  : "bg-gradient-to-r from-teal to-teal/90 text-white shadow-lg shadow-teal/30 hover:shadow-xl hover:shadow-teal/40"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-light break-words">
                {msg.content}
              </p>
            </article>
          </div>
        ))}

        {loading && (
          <div
            className="flex justify-start w-full"
            role="status"
            aria-live="polite"
            aria-label="Esperando respuesta del entrevistador"
          >
            <div className="bg-surface border border-teal/20 px-6 py-4 rounded-2xl shadow-md shadow-teal/5">
              <div className="flex gap-2 items-center">
                <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                <div
                  className="w-2 h-2 rounded-full bg-teal animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-teal animate-pulse"
                  style={{ animationDelay: "0.4s" }}
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
        className="flex-shrink-0 p-3 sm:p-5 lg:p-8 border-t border-teal/20 bg-gradient-to-t from-surface/95 via-surface/60 to-teal/5 backdrop-blur-sm"
      >
        <div className="flex gap-2 sm:gap-3 items-end">
          <div className="flex-1 min-w-0">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
              placeholder="Tu respuesta aquí..."
              disabled={loading}
              aria-label="Campo de respuesta para el entrevistador"
              className="max-h-36 resize-none font-light text-sm"
              rows={1}
            />
            <p className="text-xs text-text-muted mt-2 font-light hidden sm:block">
              Presiona Enter para enviar · Shift+Enter para nueva línea
            </p>
          </div>
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            size="icon"
            className="flex-shrink-0 h-10 w-10 sm:h-auto sm:w-auto"
            title="Enviar respuesta (Enter)"
            aria-label="Enviar respuesta"
          >
            <Check className="w-4 sm:w-5 h-4 sm:h-5" />
          </Button>
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

        /* Styled scrollbar for messages */
        .messages-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .messages-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .messages-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(20, 184, 166, 0.4);
          border-radius: 3px;
          transition: background-color 0.2s ease;
        }
        .messages-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(20, 184, 166, 0.6);
        }

        /* Firefox scrollbar */
        .messages-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(20, 184, 166, 0.4) transparent;
        }
        .messages-scroll:hover {
          scrollbar-color: rgba(20, 184, 166, 0.6) transparent;
        }

        /* Input textarea scrollbar - even more minimal */
        .input-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .input-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .input-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(20, 184, 166, 0.3);
          border-radius: 2px;
        }
        .input-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(20, 184, 166, 0.5);
        }

        .input-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(20, 184, 166, 0.3) transparent;
        }
        .input-scroll:hover {
          scrollbar-color: rgba(20, 184, 166, 0.5) transparent;
        }
      `}</style>
    </div>
  );
}
