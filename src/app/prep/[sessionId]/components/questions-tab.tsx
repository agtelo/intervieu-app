"use client";

import { useState } from "react";
import { Briefcase, Film, Rocket, Settings, TrendingUp } from "lucide-react";
import type { Pregunta } from "@/lib/types";

const categoriaConfig = {
  competencia: { icon: "briefcase", label: "Competencia", color: "teal" },
  situacional: { icon: "film", label: "Situacional", color: "blue" },
  motivacion: { icon: "rocket", label: "Motivación", color: "green" },
  tecnica: { icon: "cog", label: "Técnica", color: "amber" },
  mercado: { icon: "trending", label: "Mercado", color: "red" },
};

const colorTextMap: Record<string, string> = {
  teal: "text-teal",
  blue: "text-blue",
  green: "text-green",
  amber: "text-amber",
  red: "text-red",
};

function getCategoryIcon(iconType: string) {
  const iconProps = "w-6 h-6";
  switch (iconType) {
    case "briefcase":
      return <Briefcase className={iconProps} />;
    case "film":
      return <Film className={iconProps} />;
    case "rocket":
      return <Rocket className={iconProps} />;
    case "cog":
      return <Settings className={iconProps} />;
    case "trending":
      return <TrendingUp className={iconProps} />;
    default:
      return null;
  }
}

export function QuestionsTab({ preguntas }: { preguntas: Pregunta[] }) {
  const [expanded, setExpanded] = useState<number | null>(0);

  const groupedByCategory = preguntas.reduce((acc, p, idx) => {
    const cat = p.categoria;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ ...p, idx });
    return acc;
  }, {} as Record<string, (Pregunta & { idx: number })[]>);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-2">
          Preguntas Probables
        </h1>
        <p className="text-text-muted">
          {preguntas.length} preguntas • Preparadas específicamente para ti
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 animate-fade-in-up delay-100">
        {Object.entries(categoriaConfig).map(([cat, config]) => {
          const count = groupedByCategory[cat as keyof typeof categoriaConfig]?.length || 0;
          if (count === 0) return null;
          const colorClass =
            config.color === "teal"
              ? "border-teal/20 bg-teal/5 text-teal"
              : config.color === "blue"
                ? "border-blue/20 bg-blue/5 text-blue"
                : config.color === "green"
                  ? "border-green/20 bg-green/5 text-green"
                  : config.color === "amber"
                    ? "border-amber/20 bg-amber/5 text-amber"
                    : "border-red/20 bg-red/5 text-red";

          return (
            <div
              key={cat}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border ${colorClass} transition-all duration-300 hover:shadow-lg`}
            >
              <div className={`mb-1 ${colorTextMap[config.color]}`}>{getCategoryIcon(config.icon)}</div>
              <span className="text-xs font-bold text-center leading-tight">
                {config.label}
              </span>
              <span className="text-lg font-black mt-1">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Questions by category */}
      <div className="space-y-10 animate-fade-in-up delay-200">
        {Object.entries(groupedByCategory).map(([category, items], catIdx) => {
          const config = categoriaConfig[category as keyof typeof categoriaConfig];
          if (!config) return null;

          const colorClass =
            config.color === "teal"
              ? "border-teal/20 hover:border-teal/40 shadow-teal/10"
              : config.color === "blue"
                ? "border-blue/20 hover:border-blue/40 shadow-blue/10"
                : config.color === "green"
                  ? "border-green/20 hover:border-green/40 shadow-green/10"
                  : config.color === "amber"
                    ? "border-amber/20 hover:border-amber/40 shadow-amber/10"
                    : "border-red/20 hover:border-red/40 shadow-red/10";

          const bgColor =
            config.color === "teal"
              ? "from-teal/10"
              : config.color === "blue"
                ? "from-blue/10"
                : config.color === "green"
                  ? "from-green/10"
                  : config.color === "amber"
                    ? "from-amber/10"
                    : "from-red/10";

          return (
            <div key={category}>
              <div className="flex items-center gap-3 mb-5">
                <div className={colorTextMap[config.color]}>{getCategoryIcon(config.icon)}</div>
                <div>
                  <h2 className="text-xl font-black">{config.label}</h2>
                  <p className="text-xs text-text-muted font-mono">
                    {items.length} pregunta{items.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {items.map((pregunta, itemIdx) => (
                  <button
                    key={pregunta.idx}
                    onClick={() =>
                      setExpanded(expanded === pregunta.idx ? null : pregunta.idx)
                    }
                    className={`w-full group relative p-5 rounded-lg transition-all duration-300 text-left overflow-hidden border ${colorClass} ${
                      expanded === pregunta.idx
                        ? `bg-gradient-to-br ${bgColor} to-transparent`
                        : "bg-surface hover:shadow-lg"
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${bgColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 rounded-lg`} />

                    <div className="flex items-start gap-4">
                      <span className="text-sm font-mono font-bold text-text-muted flex-shrink-0 bg-text-dim/20 rounded px-2 py-1">
                        {String(itemIdx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text leading-relaxed">
                          {pregunta.pregunta}
                        </p>
                      </div>
                      <svg
                        className={`w-5 h-5 ${colorTextMap[config.color]} flex-shrink-0 transition-transform duration-300 ${
                          expanded === pregunta.idx ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>

                    {expanded === pregunta.idx && (
                      <div className="mt-4 pt-4 border-t border-current border-opacity-10 space-y-3 animate-fade-in">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01" />
                            </svg>
                            <p className="text-xs font-bold uppercase tracking-widest text-text-muted">
                              Tip Estratégico
                            </p>
                          </div>
                          <p className="text-sm text-text-muted leading-relaxed">
                            {pregunta.tip}
                          </p>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

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

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}
