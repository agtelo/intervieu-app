"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import { ProcessingLoader } from "@/components/processing-loader";
import { AppHeader } from "@/components/app-header";

interface ProcessingStep {
  label: string;
  status: "pending" | "loading" | "done" | "error";
}

export default function PrepPage() {
  const router = useRouter();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [companyUrl, setCompanyUrl] = useState("");
  const [interviewerEmail, setInterviewerEmail] = useState("");
  const [interviewerLinkedin, setInterviewerLinkedin] = useState("");
  const [interviewerRole, setInterviewerRole] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [steps, setSteps] = useState<ProcessingStep[]>([]);

  const updateStep = (index: number, status: ProcessingStep["status"]) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, status } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!cvFile) {
      setError("Subi tu CV para continuar.");
      return;
    }
    if (!jdText && !jdFile) {
      setError("Pega o subi la descripcion del puesto.");
      return;
    }
    if (!companyUrl) {
      setError("Ingresa la URL del sitio de la empresa.");
      return;
    }

    // Add https:// if not present
    let normalizedUrl = companyUrl;
    if (!/^https?:\/\//.test(normalizedUrl)) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    setIsProcessing(true);
    const initialSteps: ProcessingStep[] = [
      { label: "Parseando tu CV...", status: "pending" },
      { label: "Investigando la empresa...", status: "pending" },
      { label: "Buscando al entrevistador...", status: "pending" },
      { label: "Generando tu briefing...", status: "pending" },
    ];

    // Remove interviewer step if no data
    if (!interviewerEmail && !interviewerLinkedin) {
      initialSteps.splice(2, 1);
    }

    setSteps(initialSteps);

    try {
      // Step 1: Create session & parse CV
      updateStep(0, "loading");

      const formData = new FormData();
      formData.append("cv", cvFile);

      // If JD is a file, read its text
      let finalJdText = jdText;
      if (jdFile) {
        if (jdFile.type === "application/pdf") {
          const jdBuffer = await jdFile.arrayBuffer();
          const jdBase64 = Buffer.from(jdBuffer).toString("base64");
          const jdRes = await fetch("/api/parse-cv", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file: jdBase64 }),
          });
          const jdData = await jdRes.json();
          if (jdData.error) throw new Error(jdData.error);
          finalJdText = jdData.data.text;
        } else {
          finalJdText = await jdFile.text();
        }
      }

      // Parse CV
      const cvBuffer = await cvFile.arrayBuffer();
      const cvBase64 = btoa(
        new Uint8Array(cvBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      let cvText: string;
      if (cvFile.type === "application/pdf") {
        const cvRes = await fetch("/api/parse-cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: cvBase64 }),
        });
        const cvData = await cvRes.json();
        if (cvData.error) throw new Error(cvData.error);
        cvText = cvData.data.text;
      } else {
        cvText = await cvFile.text();
      }

      // Create session
      const sessionRes = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText,
          cvFileName: cvFile.name,
          jdText: finalJdText,
          companyUrl: normalizedUrl,
          interviewerEmail: interviewerEmail || undefined,
          interviewerLinkedin: interviewerLinkedin || undefined,
          interviewerRole: interviewerRole || undefined,
        }),
      });
      const sessionData = await sessionRes.json();
      if (sessionData.error) throw new Error(sessionData.error);

      const sessionId = sessionData.data.id;
      updateStep(0, "done");

      // Step 2: Scrape company
      const scrapeStepIdx = 1;
      updateStep(scrapeStepIdx, "loading");
      const scrapeRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl, sessionId }),
      });
      const scrapeData = await scrapeRes.json();
      if (scrapeData.error) throw new Error(scrapeData.error);
      updateStep(scrapeStepIdx, "done");

      // Step 3: Search interviewer (optional)
      const hasInterviewer = interviewerEmail || interviewerLinkedin;
      if (hasInterviewer) {
        const interviewerStepIdx = 2;
        updateStep(interviewerStepIdx, "loading");
        const searchRes = await fetch("/api/search-person", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: interviewerEmail || undefined,
            linkedin: interviewerLinkedin || undefined,
            company: normalizedUrl,
            role: interviewerRole || undefined,
            sessionId,
          }),
        });
        const searchData = await searchRes.json();
        if (searchData.error) {
          updateStep(interviewerStepIdx, "error");
        } else {
          updateStep(interviewerStepIdx, "done");
        }
      }

      // Step 4: Generate briefing
      const generateStepIdx = hasInterviewer ? 3 : 2;
      updateStep(generateStepIdx, "loading");
      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const generateData = await generateRes.json();
      if (generateData.error) throw new Error(generateData.error);
      updateStep(generateStepIdx, "done");

      // Redirect to dashboard
      router.push(`/prep/${sessionId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Algo salio mal. Intenta de nuevo."
      );
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <main className="flex-1 flex flex-col">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center px-5 py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-text mb-2">
              Preparando tu briefing
            </h2>
            <p className="text-text-muted text-sm mb-8">
              Esto puede tomar unos segundos...
            </p>
            <ProcessingLoader steps={steps} />
            {error && (
              <p className="text-red text-sm mt-6">{error}</p>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden">
      <AppHeader />

      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="flex-1 px-5 py-10 lg:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-12 animate-fade-in-up">
            <div className="inline-block mb-4">
              <span className="section-label text-teal/60 px-3 py-1.5 rounded-full bg-teal/5 border border-teal/20">
                Preparación
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-[1.1] text-text mb-6">
              Prepara tu
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-teal via-teal to-teal/60 bg-clip-text text-transparent">
                  entrevista
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal/40 to-transparent" />
              </span>
            </h1>
            <p className="text-lg text-text-muted max-w-2xl leading-relaxed font-light">
              Subi tus documentos y datos para generar tu briefing personalizado
            </p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CV */}
          <div>
            <label className="section-label block mb-3">
              CV del candidato *
            </label>
            <FileUpload
              accept=".pdf,.txt"
              label="Arrastra tu CV aca o hace click para subir"
              onFileSelect={setCvFile}
              fileName={cvFile?.name}
            />
          </div>

          {/* JD */}
          <div>
            <label className="section-label block mb-3">
              Job Description *
            </label>
            <div className="gap-md flex flex-col">
              <textarea
                value={jdText}
                onChange={(e) => {
                  setJdText(e.target.value);
                  if (e.target.value) setJdFile(null);
                }}
                placeholder="Pega la descripcion del puesto aca..."
                rows={6}
                className="textarea-base focus-ring"
              />
              <div className="text-center text-text-dim text-xs">o</div>
              <FileUpload
                accept=".pdf,.txt"
                label="Subi la JD como archivo"
                onFileSelect={(file) => {
                  setJdFile(file);
                  setJdText("");
                }}
                fileName={jdFile?.name}
              />
            </div>
          </div>

          {/* Company URL */}
          <div>
            <label className="section-label block mb-3">
              URL de la empresa *
            </label>
            <input
              type="text"
              value={companyUrl}
              onChange={(e) => setCompanyUrl(e.target.value)}
              placeholder="empresa.com"
              className="input-base focus-ring"
            />
          </div>

          {/* Interviewer section */}
          <div className="relative overflow-hidden rounded-2xl border border-teal/20 bg-gradient-to-br from-teal/8 via-surface to-surface/95 p-6 animate-fade-in-up delay-100">
            <div className="absolute inset-0 bg-gradient-to-br from-teal/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10" />

            <div className="mb-6">
              <span className="section-label text-teal/60">Entrevistador</span>
              <span className="text-text-muted text-xs ml-3">(opcional)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div>
                <label className="text-sm text-text-muted block mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={interviewerEmail}
                  onChange={(e) => setInterviewerEmail(e.target.value)}
                  placeholder="nombre@empresa.com"
                  className="input-base focus-ring"
                />
              </div>
              <div>
                <label className="text-sm text-text-muted block mb-1.5">
                  LinkedIn
                </label>
                <input
                  type="text"
                  value={interviewerLinkedin}
                  onChange={(e) => setInterviewerLinkedin(e.target.value)}
                  placeholder="linkedin.com/in/..."
                  className="input-base focus-ring"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1.5">
                Cargo
              </label>
              <input
                type="text"
                value={interviewerRole}
                onChange={(e) => setInterviewerRole(e.target.value)}
                placeholder="Ej: Head of Sales, CTO, HR Manager"
                className="input-base focus-ring"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="animate-fade-in-up relative overflow-hidden rounded-2xl border border-red/30">
              <div className="absolute inset-0 bg-gradient-to-br from-red/15 via-red/5 to-transparent blur-xl" />
              <div className="relative bg-gradient-to-br from-red/8 to-surface/50 backdrop-blur-sm p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red font-black text-sm mb-1">Error</p>
                    <p className="text-text-muted text-sm leading-relaxed">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isProcessing}
            className="group relative w-full btn-primary-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed focus:focus-ring animate-fade-in-up delay-100"
          >
            <span className="relative z-10">
              Analizar y preparar briefing
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-300" />
          </button>
        </form>
        </div>
      </div>
    </main>
  );
}
