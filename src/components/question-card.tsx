"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Pregunta } from "@/lib/types";

const categoryVariants: Record<string, any> = {
  competencia: "default",
  situacional: "secondary",
  motivacion: "outline",
  tecnica: "destructive",
  mercado: "secondary",
};

const categoryLabels: Record<string, string> = {
  competencia: "Competencia",
  situacional: "Situacional",
  motivacion: "Motivacion",
  tecnica: "Tecnica",
  mercado: "Mercado",
};

export function QuestionCard({
  pregunta,
  index,
}: {
  pregunta: Pregunta;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const variant = categoryVariants[pregunta.categoria] || categoryVariants.competencia;

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-surface/80 transition-colors cursor-pointer"
      >
        <span className="font-mono text-sm text-text-dim flex-shrink-0 mt-0.5">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-text text-sm font-medium leading-relaxed">
            {pregunta.pregunta}
          </p>
          <div className="mt-2">
            <Badge variant={variant} className="text-xs uppercase tracking-wider">
              {categoryLabels[pregunta.categoria] || pregunta.categoria}
            </Badge>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-text-dim flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pl-11 border-t border-border">
          <div className="bg-teal/5 border border-teal/10 rounded-lg p-3 mt-4">
            <p className="section-label mb-1">Tip</p>
            <p className="text-text-muted text-sm">{pregunta.tip}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
