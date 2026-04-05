"use client";

import { BookOpen, Lightbulb, Zap, MessageCircle } from "lucide-react";
import type { EntrevistadorInfo } from "@/lib/types";

export function InterviewerTab({ entrevistador }: { entrevistador: EntrevistadorInfo }) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile Header */}
      <div className="animate-fade-in-up">
        <p className="section-label text-teal/60 mb-2">Tu Entrevistador</p>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tighter mb-4">
          {entrevistador.nombre}
        </h1>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/10 border border-teal/30">
          <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          <span className="text-sm font-semibold text-teal">
            {entrevistador.rol}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up delay-100">
        {/* Background Card */}
        <div className="group relative p-8 bg-gradient-to-br from-blue/10 to-blue/5 border border-blue/20 rounded-2xl hover:border-blue/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
          <div className="flex items-start gap-4 mb-4">
            <BookOpen className="w-8 h-8 text-blue flex-shrink-0" />
            <div>
              <p className="section-label text-blue/60">Background</p>
              <h3 className="text-lg font-black mt-1">Experiencia</h3>
            </div>
          </div>
          <p className="text-base text-text-muted leading-relaxed">
            {entrevistador.background}
          </p>
        </div>

        {/* Tips Card */}
        <div className="group relative p-8 bg-gradient-to-br from-green/10 to-green/5 border border-green/20 rounded-2xl hover:border-green/40 transition-all duration-300 hover:shadow-xl hover:shadow-green/10">
          <div className="absolute inset-0 bg-gradient-to-r from-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
          <div className="flex items-start gap-4 mb-4">
            <Lightbulb className="w-8 h-8 text-green flex-shrink-0" />
            <div>
              <p className="section-label text-green/60">Estrategia</p>
              <h3 className="text-lg font-black mt-1">Conexión</h3>
            </div>
          </div>
          <p className="text-base text-text-muted leading-relaxed">
            {entrevistador.tips}
          </p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="animate-fade-in-up delay-200">
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-teal" />
          Puntos Clave
        </h2>
        <div className="grid gap-3">
          <div className="p-4 rounded-lg bg-gradient-to-r from-teal/10 to-transparent border border-teal/20 flex items-start gap-3">
            <span className="text-lg flex-shrink-0">→</span>
            <div>
              <p className="font-semibold text-sm mb-1">Rol y Responsabilidades</p>
              <p className="text-xs text-text-muted">
                Como {entrevistador.rol}, busca personas que puedan contribuir significativamente
              </p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-r from-green/10 to-transparent border border-green/20 flex items-start gap-3">
            <span className="text-lg flex-shrink-0">✓</span>
            <div>
              <p className="font-semibold text-sm mb-1">Lo que Valora</p>
              <p className="text-xs text-text-muted">
                Busca candidatos con tu perfil que compartan la visión de la empresa
              </p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-r from-amber/10 to-transparent border border-amber/20 flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm mb-1">Enfoque de Entrevista</p>
              <p className="text-xs text-text-muted">
                Prepárate para preguntas técnicas, culturales y de motivación específicas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className="animate-fade-in-up delay-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal/20 to-transparent rounded-2xl blur-2xl" />
        <div className="relative p-8 bg-gradient-to-br from-surface via-surface/95 to-teal/5 border border-teal/30 rounded-2xl">
          <div className="flex items-start gap-4">
            <Zap className="w-8 h-8 text-teal flex-shrink-0" />
            <div>
              <h3 className="text-lg font-black mb-3 text-text">Recomendación Final</h3>
              <p className="text-text-muted leading-relaxed">
                Este entrevistador tiene la responsabilidad de evaluar tu fit con la empresa.
                Muestra sinceridad, curiosidad sobre el rol y alineación con los valores de la compañía.
                Haz preguntas que demuestren tu interés genuino en el crecimiento mutuo.
              </p>
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
      `}</style>
    </div>
  );
}
