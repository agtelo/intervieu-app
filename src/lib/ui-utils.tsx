/**
 * Consolidated UI utilities for colors, icons, and labels
 * Prevents duplication across components
 */

import { Zap, Trophy, Sparkles, AlertCircle, Check, HelpCircle } from "lucide-react";
import type React from "react";

// Score color utilities
export const getScoreBgColor = (score: number): string => {
  if (score >= 80) return "text-green";
  if (score >= 60) return "text-amber";
  return "text-red";
};

export const getScoreLabel = (score: number): string => {
  if (score >= 90) return "Excelente";
  if (score >= 80) return "Muy bueno";
  if (score >= 70) return "Bueno";
  if (score >= 60) return "Aceptable";
  return "Necesita mejora";
};

// Icon utilities
const ICON_PROPS = "w-6 h-6";

export const getHighlightIcon = (type: string): React.ReactNode => {
  switch (type) {
    case "killer":
      return <Zap className={ICON_PROPS} />;
    case "strong":
      return <Trophy className={ICON_PROPS} />;
    default:
      return <Sparkles className={ICON_PROPS} />;
  }
};

// Question category colors and icons
export const QUESTION_CATEGORY_CONFIG = {
  competencia: {
    label: "Competencia",
    bgColor: "bg-blue/10",
    textColor: "text-blue",
    icon: <Check className="w-4 h-4" />,
  },
  cultura: {
    label: "Cultura",
    bgColor: "bg-teal/10",
    textColor: "text-teal",
    icon: <HelpCircle className="w-4 h-4" />,
  },
  motivacion: {
    label: "Motivación",
    bgColor: "bg-amber/10",
    textColor: "text-amber",
    icon: <AlertCircle className="w-4 h-4" />,
  },
} as const;

export const getCategoryConfig = (category: string) => {
  return (
    QUESTION_CATEGORY_CONFIG[category as keyof typeof QUESTION_CATEGORY_CONFIG] ||
    QUESTION_CATEGORY_CONFIG.competencia
  );
};

// Simulacro status utilities
export const SIMULACRO_STATUS_CONFIG = {
  notStarted: {
    label: "No iniciado",
    color: "text-text-muted",
    bgColor: "bg-surface",
  },
  inProgress: {
    label: "En progreso",
    color: "text-blue",
    bgColor: "bg-blue/10",
  },
  completed: {
    label: "Completado",
    color: "text-green",
    bgColor: "bg-green/10",
  },
} as const;

export const getSimulacroStatusConfig = (status: string) => {
  return (
    SIMULACRO_STATUS_CONFIG[status as keyof typeof SIMULACRO_STATUS_CONFIG] ||
    SIMULACRO_STATUS_CONFIG.notStarted
  );
};
