"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import SessionCard from "@/components/session-card";

interface Session {
  id: string;
  name?: string | null;
  companyUrl?: string | null;
  createdAt: string;
  fitScore?: number | null;
  simulacroStatus?: string | null;
  status?: string | null;
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/sessions");
        const result = await res.json();

        if (!res.ok) {
          setError(result.error || "Error al cargar sesiones");
          return;
        }

        setSessions(result.data || []);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Error al cargar sesiones");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleDeleteSession = (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  };

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10 lg:py-16">
        {/* Header */}
        <div className="mb-16 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">
            <div className="flex-1">
              <div className="inline-block mb-4">
                <span className="section-label text-teal/60 px-3 py-1.5 rounded-full bg-teal/5 border border-teal/20">
                  Tus Sesiones
                </span>
              </div>
              <h1 className="text-6xl sm:text-7xl font-black tracking-tighter leading-[1.05] text-text mb-6">
                Mi Historial
              </h1>
              <p className="text-lg text-text-muted max-w-2xl leading-relaxed font-light">
                Revisa todas tus entrevistas practicadas, resultados y progreso en tu preparación
              </p>
            </div>
            <Link href="/prep" className="lg:self-start">
              <Button size="lg" className="gap-3">
                Nueva entrevista
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center">
                <div className="w-14 h-14 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
              </div>
              <div>
                <p className="text-text-muted text-base">Cargando tus sesiones...</p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="animate-fade-in-up">
            <div className="relative overflow-hidden rounded-2xl border border-red/30">
              <div className="absolute inset-0 bg-gradient-to-br from-red/15 via-red/5 to-transparent blur-xl" />
              <div className="relative bg-gradient-to-br from-red/8 to-surface/50 backdrop-blur-sm p-8">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-8 h-8 text-red flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-red font-black text-lg mb-2">Error al cargar</p>
                    <p className="text-text-muted text-sm leading-relaxed">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="animate-fade-in-up">
            <div className="relative overflow-hidden rounded-3xl border border-teal/30">
              <div className="absolute inset-0 bg-gradient-to-br from-teal/20 via-teal/5 to-transparent blur-3xl" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal/10 rounded-full blur-3xl -z-10" />

              <div className="relative bg-gradient-to-br from-surface/80 via-surface to-teal/5 backdrop-blur-sm p-20 text-center">
                <div className="mb-6 flex justify-center">
                  <FileText className="w-20 h-20 text-teal inline-block animate-bounce" style={{ animationDuration: "2s" }} />
                </div>
                <h3 className="text-4xl font-black text-text mb-4 tracking-tight">
                  Sin entrevistas aún
                </h3>
                <p className="text-lg text-text-muted mb-10 max-w-xl mx-auto leading-relaxed font-light">
                  Comienza a practicar tus entrevistas ahora y mejora tu desempeño en cada conversación
                </p>
                <Link href="/prep">
                  <Button size="lg" className="gap-3">
                    Crear primera entrevista
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-teal/10">
              <div>
                <p className="text-xs text-text-muted font-mono uppercase tracking-widest">
                  Total de sesiones
                </p>
                <p className="text-2xl font-black text-text mt-1">
                  {sessions.length} sesión{sessions.length !== 1 ? "es" : ""}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-text-muted font-mono uppercase tracking-widest">
                    Evaluadas
                  </p>
                  <p className="text-2xl font-black text-green mt-1">
                    {sessions.filter((s) => s.fitScore).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session, idx) => (
                <div
                  key={session.id}
                  className={`animate-fade-in-up transition-all duration-300 ${
                    deletingIds.has(session.id) ? "opacity-0 scale-95 pointer-events-none" : ""
                  }`}
                  style={{ animationDelay: `${idx * 75}ms` }}
                >
                  <SessionCard
                    id={session.id}
                    name={session.name}
                    companyUrl={session.companyUrl}
                    createdAt={session.createdAt}
                    fitScore={session.fitScore}
                    simulacroStatus={session.simulacroStatus}
                    onDelete={handleDeleteSession}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
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
            opacity: 0;
          }

          .delay-1000 {
            animation-delay: 1000ms;
          }
        `}</style>
      </main>
    </>
  );
}
