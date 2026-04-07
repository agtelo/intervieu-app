"use client";

import { Zap, Trophy, Sparkles } from "lucide-react";
import type { FitAnalysis } from "@/lib/types";

function getHighlightIcon(type: string) {
  const iconProps = "w-6 h-6";
  switch (type) {
    case "killer":
      return <Zap className={iconProps} />;
    case "strong":
      return <Trophy className={iconProps} />;
    default:
      return <Sparkles className={iconProps} />;
  }
}

export function FitTab({ fit }: { fit: FitAnalysis }) {  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "text-green";
    if (score >= 60) return "text-amber";
    return "text-red";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excelente";
    if (score >= 80) return "Muy bueno";
    if (score >= 70) return "Bueno";
    if (score >= 60) return "Aceptable";
    return "Necesita mejora";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-2">
          Análisis de Fit
        </h1>
        <p className="text-text-muted">
          Tu compatibilidad con el puesto y la empresa
        </p>
      </div>

      {/* Score Card - Enhanced */}
      <div className="animate-fade-in-up delay-100">
        <div className="relative group">
          {/* Glow background */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal/30 via-teal/10 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-300" />

          <div className="relative bg-gradient-to-br from-surface via-surface/95 to-teal/5 border border-teal/30 rounded-3xl p-10 sm:p-16 text-center hover:shadow-2xl hover:shadow-teal/15 transition-all duration-300 group">
            <p className="section-label text-teal/60 mb-6">Score de Compatibilidad</p>

            {/* Circular progress */}
            <div className="flex justify-center mb-8 relative">
              <svg
                className="w-48 h-48 -rotate-90 drop-shadow-lg"
                viewBox="0 0 200 200"
              >
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-border"
                />
                {/* Progress circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={`${(fit.score / 100) * 565.5} 565.5`}
                  strokeLinecap="round"
                  className={`${getScoreBgColor(fit.score)} transition-all duration-1500 drop-shadow-md`}
                  style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
                />
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className={`text-7xl sm:text-8xl font-black ${getScoreBgColor(fit.score)} mb-1`}>
                  {fit.score}
                </p>
                <p className="text-xs text-text-muted font-mono uppercase tracking-widest">
                  /100
                </p>
              </div>
            </div>

            {/* Score interpretation */}
            <div className="mb-4">
              <p className={`text-xl font-black ${getScoreBgColor(fit.score)} mb-3`}>
                {getScoreLabel(fit.score)}
              </p>
              <p className="text-base text-text-muted leading-relaxed font-light">
                {fit.resumen}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-8 pt-6 border-t border-teal/10">
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1500 rounded-full ${
                    fit.score >= 80
                      ? "bg-gradient-to-r from-green via-green to-green/60"
                      : fit.score >= 60
                        ? "bg-gradient-to-r from-amber via-amber to-amber/60"
                        : "bg-gradient-to-r from-red via-red to-red/60"
                  }`}
                  style={{ width: `${fit.score}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      {fit.highlights && fit.highlights.length > 0 && (
        <div className="animate-fade-in-up delay-200">
          <h2 className="text-lg font-black mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Highlights
          </h2>
          <div className="grid gap-3">
            {fit.highlights.map((highlight, idx) => {
              const bgColor =
                highlight.type === "killer"
                  ? "from-red/15 to-red/5"
                  : highlight.type === "strong"
                    ? "from-green/15 to-green/5"
                    : "from-amber/15 to-amber/5";

              const borderColor =
                highlight.type === "killer"
                  ? "border-red/30"
                  : highlight.type === "strong"
                    ? "border-green/30"
                    : "border-amber/30";

              const iconColor =
                highlight.type === "killer"
                  ? "text-red"
                  : highlight.type === "strong"
                    ? "text-green"
                    : "text-amber";

              return (
                <div
                  key={idx}
                  className={`group relative p-4 rounded-xl border transition-all duration-300 hover:shadow-lg bg-gradient-to-br ${bgColor} ${borderColor} ${
                    highlight.type === "killer"
                      ? "hover:border-red hover:shadow-red/20"
                      : highlight.type === "strong"
                        ? "hover:border-green hover:shadow-green/20"
                        : "hover:border-amber hover:shadow-amber/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`${iconColor} flex-shrink-0`}>{getHighlightIcon(highlight.type)}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">
                        {highlight.label}
                      </p>
                      <p className="text-sm text-text-muted">
                        {highlight.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fortalezas */}
      {fit.fortalezas && fit.fortalezas.length > 0 && (
        <div className="animate-fade-in-up delay-300">
          <h2 className="text-lg font-black mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Fortalezas
          </h2>
          <div className="grid gap-4">
            {fit.fortalezas.map((fort, idx) => (
              <div
                key={idx}
                className="group relative p-5 bg-gradient-to-br from-green/10 to-green/5 border border-green/20 rounded-xl hover:border-green/40 transition-all duration-300 hover:shadow-lg hover:shadow-green/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
                <p className="font-black text-green mb-2 flex items-center gap-2">
                  <span>→</span> {fort.titulo}
                </p>
                <p className="text-sm text-text-muted mb-3 leading-relaxed">
                  {fort.detalle}
                </p>
                <div className="text-xs text-green/70 font-mono italic border-t border-green/10 pt-2 flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>{fort.evidencia}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debilidades */}
      {fit.debilidades && fit.debilidades.length > 0 && (
        <div className="animate-fade-in-up delay-400">
          <h2 className="text-lg font-black mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Áreas de Mejora
          </h2>
          <div className="grid gap-4">
            {fit.debilidades.map((deb, idx) => (
              <div
                key={idx}
                className="group relative p-5 bg-gradient-to-br from-amber/10 to-amber/5 border border-amber/20 rounded-xl hover:border-amber/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
                <p className="font-black text-amber mb-2 flex items-center gap-2">
                  <span>!</span> {deb.titulo}
                </p>
                <p className="text-sm text-text-muted mb-3 leading-relaxed">
                  {deb.detalle}
                </p>
                <div className="bg-amber/10 border border-amber/20 rounded-lg p-3 text-xs text-amber/80">
                  <div className="flex items-center gap-1.5 font-semibold mb-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01" />
                    </svg>
                    <span>Estrategia:</span>
                  </div>
                  <p>{deb.tip}</p>
                </div>
              </div>
            ))}
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

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
}
