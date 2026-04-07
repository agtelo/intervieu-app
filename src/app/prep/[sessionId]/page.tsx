"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Search, BarChart3, HelpCircle, User, Zap } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import type { Session, BriefingResult } from "@/lib/types";
import { IntelTab } from "./components/intel-tab";
import { FitTab } from "./components/fit-tab";
import { QuestionsTab } from "./components/questions-tab";
import { InterviewerTab } from "./components/interviewer-tab";
import { SimulacroTab } from "./components/simulacro-tab";

type TabId = "intel" | "fit" | "preguntas" | "entrevistador" | "simulacro";

interface TabConfig {
  id: TabId;
  label: string;
  icon: string;
}

export default function DashboardPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [session, setSession] = useState<Session | null>(null);
  const [briefing, setBriefing] = useState<BriefingResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("intel");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setSession(data.data);
        if (data.data.briefing) {
          setBriefing(JSON.parse(data.data.briefing));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar la sesion."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !session || !briefing) {
    return (
      <main className="flex-1 flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-red text-sm mb-4">
            {error || "No se encontro el briefing."}
          </p>
          <Link
            href="/prep"
            className="text-teal text-sm hover:underline"
          >
            Volver al formulario
          </Link>
        </div>
      </main>
    );
  }

  const hasInterviewer = briefing.entrevistador && briefing.entrevistador.nombre;

  const getTabIcon = (tabId: TabId) => {
    const iconProps = "w-4 h-4";
    switch (tabId) {
      case "intel":
        return <Search className={iconProps} />;
      case "fit":
        return <BarChart3 className={iconProps} />;
      case "preguntas":
        return <HelpCircle className={iconProps} />;
      case "entrevistador":
        return <User className={iconProps} />;
      case "simulacro":
        return <Zap className={iconProps} />;
    }
  };

  const tabs: TabConfig[] = [
    { id: "intel", label: "Intel", icon: "" },
    { id: "fit", label: "Fit", icon: "" },
    { id: "preguntas", label: "Preguntas", icon: "" },
    ...(hasInterviewer
      ? [{ id: "entrevistador" as TabId, label: "Entrevistador", icon: "" }]
      : []),
    { id: "simulacro", label: "Simulacro", icon: "" },
  ];

  return (
    <>
      <AppHeader />
      <main className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden border-b border-teal/20 overflow-x-auto snap-x snap-mandatory">
        <div className="flex px-5 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all duration-300 snap-start ${
                activeTab === tab.id
                  ? "border-teal text-teal shadow-lg shadow-teal/20"
                  : "border-transparent text-text-muted hover:text-text hover:border-teal/40"
              }`}
            >
              <span className="w-5 h-5 flex-shrink-0">{getTabIcon(tab.id)}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-64 border-r border-teal/20 p-6 gap-3 relative bg-gradient-to-b from-surface/80 to-surface/40">
        {/* Back button */}
        <Link
          href="/prep"
          className="flex items-center gap-2 text-text-muted text-sm hover:text-teal transition-all duration-300 mb-2 px-3 py-2 rounded-lg hover:bg-teal/10 group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">Nueva sesion</span>
        </Link>

        {/* Session info */}
        <div className="px-3 py-4 rounded-lg bg-teal/5 border border-teal/20 mb-2">
          <p className="text-xs font-mono uppercase tracking-widest text-teal/60 mb-1">
            Sesión
          </p>
          <p className="text-sm font-semibold text-text truncate">
            {briefing.empresa.nombre}
          </p>
        </div>

        <div className="section-label px-3 mb-4 text-teal/60">Modules</div>

        {/* Navigation */}
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-300 text-left group relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-teal/25 via-teal/15 to-transparent text-teal border border-teal/30 shadow-lg shadow-teal/10"
                    : "text-text-muted hover:text-text border border-transparent hover:bg-teal/8"
                }`}
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                <span className="w-6 h-6 flex-shrink-0">{getTabIcon(tab.id)}</span>
                <span className="flex-1">{tab.label}</span>
                {isActive && (
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-teal animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Score section */}
        {briefing.fit && (
          <div className="mt-auto pt-6 border-t border-teal/20">
            <p className="section-label px-3 mb-3 text-teal/60">Performance</p>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal/25 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-teal/10 via-surface to-surface border border-teal/30 rounded-xl p-4 text-center hover:shadow-lg hover:shadow-teal/10 transition-all duration-300">
                <p className="section-label mb-2 text-teal/60">Fit Score</p>
                <p className="font-mono text-4xl font-black text-teal mb-2">
                  {briefing.fit.score}
                </p>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 rounded-full ${
                      briefing.fit.score >= 80
                        ? "bg-gradient-to-r from-green to-green/60"
                        : briefing.fit.score >= 60
                          ? "bg-gradient-to-r from-amber to-amber/60"
                          : "bg-gradient-to-r from-red to-red/60"
                    }`}
                    style={{ width: `${briefing.fit.score}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Content */}
      <div className="flex-1 px-5 py-8 lg:px-8 lg:py-10 overflow-y-auto">
        <div className="max-w-2xl mx-auto lg:max-w-3xl">
          <div
            key={activeTab}
            className="animate-fade-in-up"
          >
            {activeTab === "intel" && <IntelTab empresa={briefing.empresa} />}
            {activeTab === "fit" && <FitTab fit={briefing.fit} />}
            {activeTab === "preguntas" && (
              <QuestionsTab preguntas={briefing.preguntas} />
            )}
            {activeTab === "entrevistador" && briefing.entrevistador && (
              <InterviewerTab entrevistador={briefing.entrevistador} />
            )}
            {activeTab === "simulacro" && session && (
              <SimulacroTab
                briefing={briefing}
                cvText={session.cvText || ""}
                jdText={session.jdText || ""}
              />
            )}
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

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
      </main>
    </>
  );
}
