"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();

  // Determinar si mostrar botón atrás
  const showBackButton = pathname.startsWith("/prep/") || pathname.includes("/prep/");

  return (
    <header className="border-b border-border bg-surface/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-surface-hover rounded-lg transition-colors hover:text-text text-lg cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              title="Atrás"
              aria-label="Volver atrás"
            >
              ←
            </button>
          )}
          <Link href="/" className="font-bold text-lg text-text hover:text-teal transition-colors flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded">
            <span className="font-black text-teal">u</span>
            intervU
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-3 hover:bg-surface-hover rounded-lg transition-colors"
              title="Dashboard"
              aria-label="Ver mis sesiones"
            >
              <svg
                className="w-5 h-5 text-text-muted hover:text-text transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </Link>
            <Link
              href="/prep"
              className="p-3 hover:bg-surface-hover rounded-lg transition-colors"
              title="Nueva entrevista"
              aria-label="Crear nueva entrevista"
            >
              <svg
                className="w-5 h-5 text-text-muted hover:text-text transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
