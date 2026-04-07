"use client";

import Link from "next/link";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface SessionCardProps {
  id: string;
  name?: string | null;
  companyUrl?: string | null;
  createdAt: Date | string;
  fitScore?: number | null;
  simulacroStatus?: string | null;
  onDelete?: (id: string) => void;
}

export default function SessionCard({
  id,
  name,
  companyUrl,
  createdAt,
  fitScore,
  simulacroStatus,
  onDelete,
}: SessionCardProps) {
  const [deleteStage, setDeleteStage] = useState<"idle" | "confirming" | "deleting">("idle");

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (deleteStage === "idle") {
      setDeleteStage("confirming");
      return;
    }

    if (deleteStage === "confirming") {
      setDeleteStage("deleting");
      try {
        const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
        const result = await res.json();
        if (!res.ok) {
          console.error("Delete failed:", result.error);
          setDeleteStage("confirming");
          return;
        }
        onDelete?.(id);
      } catch (err) {
        console.error("Delete error:", err);
        setDeleteStage("confirming");
      }
    }
  };

  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Extract company domain from URL
  const getCompanyName = () => {
    if (name) return name;
    if (companyUrl) {
      try {
        const url = new URL(companyUrl);
        return url.hostname.replace("www.", "");
      } catch {
        return companyUrl;
      }
    }
    return "Entrevista";
  };

  const getSimulacroStatusLabel = () => {
    if (simulacroStatus === "completed") return "✓ Completado";
    if (simulacroStatus === "in_progress") return "⟳ En progreso";
    return "○ Pendiente";
  };

  const getSimulacroStatusColor = () => {
    if (simulacroStatus === "completed") return "text-green bg-green/10";
    if (simulacroStatus === "in_progress") return "text-amber bg-amber/10";
    return "text-text-muted bg-text-dim/10";
  };

  const getSimulacroStatusBorder = () => {
    if (simulacroStatus === "completed") return "border-green/20";
    if (simulacroStatus === "in_progress") return "border-amber/20";
    return "border-text-dim/20";
  };

  return (
    <Link href={`/prep/${id}`} className="group h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-2xl">
      <div className="relative overflow-hidden rounded-2xl h-full transition-all duration-300 hover:shadow-2xl hover:shadow-teal/20 border border-teal/20 hover:border-teal/50 bg-surface/80 hover:bg-surface/95 cursor-pointer backdrop-blur-sm group-hover:backdrop-blur group-hover:bg-gradient-to-br group-hover:from-surface group-hover:to-teal/8">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

        {/* Accent glow on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-teal/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-20 blur-xl" />

        <div className="p-6 h-full flex flex-col gap-4 relative z-10">
          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              onBlur={() => { if (deleteStage === "confirming") setDeleteStage("idle"); }}
              disabled={deleteStage === "deleting"}
              aria-label={deleteStage === "confirming" ? "Confirmar eliminación" : "Eliminar sesión"}
              className={`
                absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                text-xs font-bold uppercase tracking-widest
                transition-all duration-200 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                ${deleteStage === "idle"
                  ? "opacity-0 group-hover:opacity-100 bg-surface/80 border border-border text-text-muted hover:bg-red/10 hover:border-red/30 hover:text-red"
                  : "opacity-100 bg-red/10 border border-red/40 text-red hover:bg-red/20"
                }
              `}
            >
              {deleteStage === "deleting" ? (
                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              {deleteStage === "confirming" && <span>Confirmar</span>}
              {deleteStage === "deleting" && <span>Eliminando...</span>}
            </button>
          )}

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black text-text truncate group-hover:text-teal transition-colors duration-300" title={getCompanyName()}>
                {getCompanyName()}
              </h3>
              <p className="text-xs text-text-muted/70 mt-2 font-mono uppercase tracking-widest">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Score section */}
          <div className="py-5 border-t border-b border-teal/15 bg-gradient-to-r from-teal/5 to-transparent">
            {fitScore !== null && fitScore !== undefined ? (
              <div>
                <p className="text-xs text-text-muted/60 font-mono uppercase tracking-widest mb-3">
                  Fit Score
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl md:text-4xl font-black text-teal">
                    {fitScore}
                  </p>
                  <span className="text-xs text-text-muted/50 font-mono">/100</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <p className="text-2xl mb-1.5 text-text-dim">—</p>
                  <p className="text-xs text-text-muted/60 font-medium">Sin evaluar aún</p>
                </div>
              </div>
            )}
          </div>

          {/* Status badge */}
          <div className="mt-auto pt-2">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${getSimulacroStatusColor()} ${getSimulacroStatusBorder()} group-hover:border-opacity-100 group-hover:shadow-lg`}
            >
              {getSimulacroStatusLabel()}
            </div>
          </div>
        </div>
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
      `}</style>
    </Link>
  );
}
