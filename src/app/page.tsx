"use client";

import Link from "next/link";
import { Search, BarChart3, Mic2, ArrowRight } from "lucide-react";
import { AppHeader } from "@/components/app-header";

export default function Home() {

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <AppHeader />

      <section className="flex-1 flex items-center justify-center px-5 py-20 relative">
        {/* Gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl w-full">
          {/* Badge */}
          <div className="flex justify-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal/10 border border-teal/30 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-teal">
                Beta
              </span>
            </div>
          </div>

          {/* Main heading - Asymmetric layout */}
          <div className="mb-12 animate-fade-in-up delay-100">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[1.1] text-text mb-6">
              Llega preparado
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-teal via-teal to-teal/60 bg-clip-text text-transparent">
                  a cualquier
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal/40 to-transparent" />
              </span>
              <br />
              entrevista<span className="text-text/70">.</span>
            </h1>

            <p className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-2xl mb-8 font-light">
              Subí tu CV y la descripción del puesto. Nuestra IA investiga la
              empresa, analiza tu fit, genera preguntas probables y te ofrece un
              simulacro de entrevista realista.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex gap-4 mb-16 animate-fade-in-up delay-200">
            <Link
              href="/prep"
              className="group relative px-8 py-4 bg-teal text-white font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-teal/40 active:scale-95 flex items-center gap-3"
            >
              <span className="relative z-10">
                Comenzar ahora
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-300" />
            </Link>
          </div>

          {/* Features Grid - Asymmetric */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-fade-in-up delay-300">
            <FeatureCard
              icon="search"
              title="Intel Empresarial"
              description="Análisis profundo del sitio web, cultura y estructura de la empresa."
              accentColor="from-teal/20"
            />
            <FeatureCard
              icon="chart"
              title="Análisis de Fit"
              description="Score detallado de compatibilidad con fortalezas, debilidades y estrategia."
              accentColor="from-teal/30"
              featured
            />
            <FeatureCard
              icon="microphone"
              title="Simulacro Realista"
              description="Entrevistador IA que conoce tu perfil y adapta las preguntas."
              accentColor="from-teal/20"
            />
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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
          animation: fadeIn 0.6s ease-out forwards;
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

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  accentColor,
  featured = false,
}: {
  icon: string;
  title: string;
  description: string;
  accentColor: string;
  featured?: boolean;
}) {
  const getIconSVG = (iconType: string) => {
    const iconProps = "w-10 h-10";
    switch (iconType) {
      case "search":
        return <Search className={iconProps} />;
      case "chart":
        return <BarChart3 className={iconProps} />;
      case "microphone":
        return <Mic2 className={iconProps} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`group relative p-6 rounded-xl border transition-all duration-300 hover:shadow-xl hover:shadow-teal/10 ${
        featured
          ? "bg-gradient-to-br from-surface via-surface to-teal/5 border-teal/30 scale-100 md:scale-105"
          : "bg-surface border-border/50 hover:border-teal/30"
      }`}
    >
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${accentColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />

      <div className="text-teal mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {getIconSVG(icon)}
      </div>
      <h3 className="font-black text-lg text-text mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-text-muted leading-relaxed font-light">
        {description}
      </p>
    </div>
  );
}

