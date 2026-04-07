"use client";

import { useRef, useEffect, useState } from "react";
import { Mic2 } from "lucide-react";
import type { BriefingResult, Message } from "@/lib/types";

import type { ScoreResult } from "@/lib/types";

interface ResultState {
  isScoring: boolean;
  result: ScoreResult | null;
  error: string | null;
}

export function SimulacroTab({
  briefing,
  cvText,
  jdText
}: {
  briefing: BriefingResult;
  cvText: string;
  jdText: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: `Hola, bienvenido. Soy tu entrevistador para la posición en ${briefing.empresa.nombre}. He revisado tu perfil y vemos que tienes experiencia relevante. ¿Cuéntame un poco sobre ti y cómo llegaste hasta aquí?`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scoreState, setScoreState] = useState<ResultState>({ isScoring: false, result: null, error: null });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Contar turnos del entrevistador
  const interviewerTurns = messages.filter((m) => m.role === "assistant").length;
  const maxTurns = 7;
  const canFinalize = interviewerTurns >= maxTurns && !scoreState.result;

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // ~5 lines
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + "px";
    }
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: { preventDefault?: () => void } | React.KeyboardEvent<HTMLTextAreaElement>) => {
    e?.preventDefault?.();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userMessage },
    ]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: "user", content: userMessage },
          ],
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

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      const messageId = Date.now().toString();

      setMessages((prev) => [
        ...prev,
        { id: messageId, role: "assistant", content: "" },
      ]);

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value);
        const lines = buffer.split("\n");
        buffer = lines[lines.length - 1]; // Keep the last incomplete line

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.text) {
                assistantMessage += parsed.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === messageId
                      ? { ...msg, content: assistantMessage }
                      : msg
                  )
                );
              }
            } catch {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Error al procesar tu mensaje. Intenta de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFinalize = async () => {
    setScoreState({ isScoring: true, result: null, error: null });
    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          jdText: jdText,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setScoreState({ isScoring: false, result: null, error: result.error || "Error al calcular score" });
        return;
      }

      setScoreState({ isScoring: false, result: result.data, error: null });
    } catch (err) {
      console.error("Score error:", err);
      setScoreState({ isScoring: false, result: null, error: "Error al procesar evaluación" });
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background lg:relative lg:inset-auto lg:rounded-2xl lg:border lg:border-teal/20 lg:h-[600px] animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="px-5 py-6 sm:px-8 sm:py-8 border-b border-teal/20 bg-gradient-to-r from-surface/80 via-surface/60 to-teal/5 backdrop-blur-sm">
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

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-4 flex flex-col bg-gradient-to-b from-surface/30 to-surface/10 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      >
        {messages.map((msg: any) => (
          <div key={msg.id} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"} animate-fade-in w-full gap-2 sm:gap-3`}>
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-teal to-teal/70 flex items-center justify-center shadow-md shadow-teal/30">
                <span className="text-xs font-black text-white">E</span>
              </div>
            )}
            <div
              className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 sm:px-5 py-3 rounded-xl transition-all duration-200 ${
                msg.role === "assistant"
                  ? "bg-surface/70 border border-teal/30 text-text leading-relaxed shadow-sm shadow-teal/10"
                  : "bg-teal text-white shadow-md shadow-teal/40"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap font-light break-words">
                {msg.content}
              </p>
            </div>
            {msg.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-teal/80 to-teal/50 flex items-center justify-center shadow-md shadow-teal/40">
                <span className="text-xs font-black text-white">T</span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in w-full gap-2 sm:gap-3">
            <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-teal to-teal/70 flex items-center justify-center shadow-md shadow-teal/30">
              <span className="text-xs font-black text-white">E</span>
            </div>
            <div className="bg-surface/70 border border-teal/30 px-4 sm:px-5 py-3 rounded-xl flex items-center gap-1.5 shadow-sm shadow-teal/10">
              <div className="w-2 h-2 rounded-full bg-teal animate-wave" />
              <div
                className="w-2 h-2 rounded-full bg-teal animate-wave"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-teal animate-wave"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!scoreState.result && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex-shrink-0 p-4 sm:p-6 border-t border-teal/10 bg-gradient-to-t from-surface via-surface/90 to-surface/70 backdrop-blur-sm space-y-3"
        >
          {canFinalize && (
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={handleFinalize}
                disabled={scoreState.isScoring}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber/20 to-amber/15 border border-amber/40 text-amber hover:from-amber/30 hover:to-amber/25 hover:border-amber/60 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:shadow-amber/20"
              >
                {scoreState.isScoring ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Evaluando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Finalizar entrevista
                  </>
                )}
              </button>
            </div>
          )}
          <div className="flex gap-2 sm:gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu respuesta..."
              disabled={isLoading}
              rows={1}
              className="flex-1 px-4 sm:px-5 py-3 bg-surface/80 border border-border hover:border-teal/30 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/50 text-text placeholder:text-text-muted/60 disabled:opacity-50 transition-all duration-150 font-light resize-none overflow-hidden max-h-28 rounded-xl shadow-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-teal via-teal to-teal/70 text-white font-semibold flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-teal/60 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 relative overflow-hidden group"
              title="Enviar (Enter)"
            >
              {/* Shine effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-pulse" />

              {/* Checkmark icon */}
              <svg
                className="w-5 h-5 relative z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>
        </form>
      )}

      {/* Results Screen */}
      {scoreState.result && (
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="relative overflow-hidden rounded-2xl border border-teal/30 bg-gradient-to-br from-teal/10 via-surface to-teal/5">
              <div className="p-8 text-center">
                <p className="text-xs text-text-muted font-mono uppercase tracking-widest mb-4">Score Final</p>
                <p className="text-6xl font-black text-teal mb-2">{scoreState.result.scoreTotal}</p>
                <p className="text-sm text-text-muted">/100</p>
              </div>
            </div>

            {/* Veredicto */}
            <div className={`rounded-2xl border p-6 ${
              scoreState.result.veredicto === "contratado"
                ? "border-green/30 bg-green/5"
                : scoreState.result.veredicto === "segunda_ronda"
                  ? "border-amber/30 bg-amber/5"
                  : "border-red/30 bg-red/5"
            }`}>
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest mb-2">Veredicto</p>
              <p className={`text-xl font-black ${
                scoreState.result.veredicto === "contratado"
                  ? "text-green"
                  : scoreState.result.veredicto === "segunda_ronda"
                    ? "text-amber"
                    : "text-red"
              }`}>
                {scoreState.result.veredicto === "contratado"
                  ? "✓ Contratado"
                  : scoreState.result.veredicto === "segunda_ronda"
                    ? "⟳ Segunda ronda"
                    : "✗ No avanza"}
              </p>
            </div>

            {/* Mejor Momento */}
            <div className="rounded-2xl border border-teal/20 bg-surface/50 p-6">
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest mb-3">Mejor momento</p>
              <p className="text-sm text-text leading-relaxed">{scoreState.result.mejorMomento}</p>
            </div>

            {/* Áreas de mejora */}
            {scoreState.result.areasMejora.length > 0 && (
              <div className="rounded-2xl border border-amber/20 bg-amber/5 p-6">
                <p className="text-xs text-amber font-mono uppercase tracking-widest mb-3">Áreas de mejora</p>
                <ul className="space-y-2">
                  {scoreState.result.areasMejora.map((area, idx) => (
                    <li key={idx} className="text-sm text-text flex gap-2">
                      <span>•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Consejo */}
            <div className="rounded-2xl border border-teal/20 bg-teal/5 p-6">
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest mb-3">Consejo Final</p>
              <p className="text-sm text-text leading-relaxed">{scoreState.result.consejo}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {scoreState.error && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-md">
            <p className="text-lg font-bold text-red">{scoreState.error}</p>
            <button
              onClick={() => setScoreState({ isScoring: false, result: null, error: null })}
              className="px-4 py-2 rounded-lg bg-red/20 hover:bg-red/30 text-red font-semibold transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

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

        @keyframes wave {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeInUp 0.3s ease-out forwards;
        }

        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
