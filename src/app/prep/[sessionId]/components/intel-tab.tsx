"use client";

import { useState } from "react";
import { ClipboardList, Briefcase, Target, Star } from "lucide-react";
import type { EmpresaInfo } from "@/lib/types";

function getSectionIcon(iconType: string) {
  const iconProps = "w-7 h-7";
  switch (iconType) {
    case "clipboard":
      return <ClipboardList className={iconProps} />;
    case "briefcase":
      return <Briefcase className={iconProps} />;
    case "target":
      return <Target className={iconProps} />;
    case "star":
      return <Star className={iconProps} />;
    default:
      return null;
  }
}

export function IntelTab({ empresa }: { empresa: EmpresaInfo }) {
  const [expanded, setExpanded] = useState<string | null>("resumen");

  const sections = [
    {
      id: "resumen",
      title: "Resumen Ejecutivo",
      icon: "clipboard",
      color: "from-teal/20 to-teal/5",
      content: empresa.descripcion,
    },
    {
      id: "modelo",
      title: "Modelo de Negocio",
      icon: "briefcase",
      color: "from-blue/20 to-blue/5",
      content: empresa.modelo,
    },
    {
      id: "mercado",
      title: "Mercado Target",
      icon: "target",
      color: "from-green/20 to-green/5",
      content: empresa.mercado,
    },
    {
      id: "cultura",
      title: "Cultura & Valores",
      icon: "star",
      color: "from-amber/20 to-amber/5",
      content: empresa.cultura,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="animate-fade-in-up">
        <div className="mb-6">
          <p className="section-label text-teal/60 mb-2">Empresa</p>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-[1.1] text-text">
            {empresa.nombre}
          </h1>
        </div>
        <p className="text-base text-text-muted leading-relaxed font-light max-w-2xl">
          {empresa.descripcion.slice(0, 200)}...
        </p>
      </div>

      {/* Main sections */}
      <div className="space-y-4 animate-fade-in-up delay-100">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() =>
              setExpanded(expanded === section.id ? null : section.id)
            }
            className={`w-full group relative p-6 rounded-xl transition-all duration-300 text-left overflow-hidden border ${
              expanded === section.id
                ? "bg-gradient-to-br " + section.color + " border-teal/30 shadow-lg shadow-teal/10"
                : "bg-surface border-teal/20 hover:border-teal/40 hover:shadow-lg hover:shadow-teal/10"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

            <div className="flex items-start gap-4">
              <div className="text-teal flex-shrink-0 mt-1">{getSectionIcon(section.icon)}</div>
              <div className="flex-1">
                <h3 className="font-black text-lg tracking-tight text-text">
                  {section.title}
                </h3>
                {expanded !== section.id && (
                  <p className="text-sm text-text-muted mt-1 line-clamp-2">
                    {section.content.slice(0, 100)}...
                  </p>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-teal flex-shrink-0 transition-transform duration-300 ${
                  expanded === section.id ? "rotate-180" : ""
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

            {expanded === section.id && (
              <p className="text-text-muted text-sm leading-relaxed pt-4 mt-4 border-t border-teal/10 animate-fade-in">
                {section.content}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Productos */}
      {empresa.producto && empresa.producto.length > 0 && (
        <div className="animate-fade-in-up delay-200">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M12 9a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
            Productos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {empresa.producto.map((prod, idx) => (
              <div
                key={idx}
                className="group relative p-5 bg-gradient-to-br from-blue/10 to-blue/5 border border-blue/20 rounded-xl hover:border-blue/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
                <p className="font-bold text-blue mb-2">{prod.nombre}</p>
                <p className="text-sm text-text-muted leading-relaxed">
                  {prod.detalle}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fundadores */}
      {empresa.fundadores && empresa.fundadores.length > 0 && (
        <div className="animate-fade-in-up delay-300">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            Fundadores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {empresa.fundadores.map((fund, idx) => (
              <div
                key={idx}
                className="group relative p-5 bg-gradient-to-br from-green/10 to-green/5 border border-green/20 rounded-xl hover:border-green/40 transition-all duration-300 hover:shadow-lg hover:shadow-green/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
                <p className="font-bold text-green mb-1">{fund.nombre}</p>
                <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">
                  {fund.rol}
                </p>
                <p className="text-sm text-text-muted leading-relaxed">
                  {fund.background}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pain Points & Diferenciales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up delay-400">
        {empresa.painPoints && empresa.painPoints.length > 0 && (
          <div className="bg-gradient-to-br from-red/10 to-red/5 border border-red/20 rounded-xl p-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-red/80 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Pain Points
            </h3>
            <ul className="space-y-2">
              {empresa.painPoints.map((point, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 text-sm text-text-muted group hover:text-text transition-colors"
                >
                  <span className="text-red mt-0.5 flex-shrink-0">✦</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {empresa.diferenciales && empresa.diferenciales.length > 0 && (
          <div className="bg-gradient-to-br from-amber/10 to-amber/5 border border-amber/20 rounded-xl p-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-amber/80 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Diferenciales
            </h3>
            <ul className="space-y-2">
              {empresa.diferenciales.map((diff, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 text-sm text-text-muted group hover:text-text transition-colors"
                >
                  <span className="text-amber mt-0.5 flex-shrink-0">✦</span>
                  <span>{diff}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Datos relevantes */}
      {empresa.datosRelevantes && empresa.datosRelevantes.length > 0 && (
        <div className="animate-fade-in-up delay-500 bg-gradient-to-br from-teal/5 to-transparent border border-teal/20 rounded-xl p-6">
          <h3 className="text-sm font-mono uppercase tracking-widest text-teal/60 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Datos Clave
          </h3>
          <div className="space-y-2">
            {empresa.datosRelevantes.map((dato, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 text-sm text-text-muted hover:text-text transition-colors group"
              >
                <span className="text-teal mt-0.5 group-hover:scale-125 transition-transform">
                  →
                </span>
                <span>{dato}</span>
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

        .delay-500 {
          animation-delay: 500ms;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
