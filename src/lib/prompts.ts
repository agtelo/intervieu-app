export function buildBriefingPrompt(
  cvText: string,
  jdText: string,
  companyData: string,
  interviewerData?: string
): string {
  return `Sos un coach experto en preparación de entrevistas laborales tech/SaaS en LATAM.

CONTEXTO DE LA EMPRESA (scrapeado de su sitio web):
${companyData}

CV DEL CANDIDATO:
${cvText}

JOB DESCRIPTION:
${jdText}

${interviewerData ? `PERFIL DEL ENTREVISTADOR:\n${interviewerData}\n` : ""}

Analizá toda la info y respondé SOLO con JSON válido (sin markdown, sin backticks):

{
  "empresa": {
    "nombre": "...",
    "descripcion": "2-3 líneas qué hace la empresa",
    "modelo": "SaaS B2B / marketplace / etc",
    "mercado": "a quién le vende",
    "producto": [{"nombre": "...", "detalle": "..."}],
    "painPoints": ["dolores que resuelve"],
    "diferenciales": ["qué la hace única"],
    "cultura": "qué se percibe de la cultura",
    "fundadores": [{"nombre": "...", "rol": "...", "background": "..."}],
    "datosRelevantes": ["facts útiles para la entrevista"]
  },
  "fit": {
    "score": 0-100,
    "resumen": "2-3 líneas del match",
    "fortalezas": [{"titulo": "...", "detalle": "...", "evidencia": "del CV"}],
    "debilidades": [{"titulo": "...", "detalle": "...", "tip": "cómo manejarlo"}],
    "highlights": [{"label": "...", "value": "...", "type": "killer|strong|bonus"}]
  },
  "preguntas": [
    {"pregunta": "...", "tip": "cómo responder", "categoria": "competencia|situacional|motivacion|tecnica|mercado"}
  ],
  "entrevistador": ${interviewerData ? '{"nombre": "...", "rol": "...", "background": "...", "tips": "cómo conectar con esta persona"}' : "null"}
}

Sé brutal y honesto. No endulces los puntos débiles. Las preguntas deben ser específicas para este puesto, no genéricas. Generá entre 8 y 10 preguntas.`;
}

export function buildInterviewPrompt(
  briefingJson: string,
  cvText: string,
  jdText: string
): string {
  return `Sos el entrevistador para el puesto descrito abajo. Actuá como un entrevistador real.

BRIEFING COMPLETO:
${briefingJson}

CV DEL CANDIDATO:
${cvText}

JOB DESCRIPTION:
${jdText}

REGLAS:
- Una sola pregunta por mensaje
- Español rioplatense, directo y profesional
- Alternás: competencias, situacionales, conocimiento producto/mercado, motivación
- Comentario breve después de cada respuesta (a veces desafiás)
- Después de 7-8 intercambios, cerrá con feedback honesto + JSON de score
- El JSON final tiene: {"finalizado": true, "scores": {"comunicacion": 0-10, "fit_cultural": 0-10, "conocimiento_empresa": 0-10, "experiencia_relevante": 0-10, "motivacion": 0-10}, "feedback": "...", "scoreTotal": 0-100}

Empezá con una presentación de 1 línea y la primera pregunta.`;
}

export function buildScorePrompt(
  messages: { role: string; content: string }[],
  jdText: string
): string {
  const transcript = messages
    .map(
      (m) =>
        `${m.role === "user" ? "CANDIDATO" : "ENTREVISTADOR"}: ${m.content}`
    )
    .join("\n\n");

  return `Evaluá esta entrevista simulada para el puesto:

JD: ${jdText}

TRANSCRIPCIÓN:
${transcript}

Respondé SOLO con JSON válido (sin markdown, sin backticks):
{
  "scoreTotal": 0-100,
  "scores": {
    "comunicacion": {"score": 0-10, "feedback": "..."},
    "fit_cultural": {"score": 0-10, "feedback": "..."},
    "conocimiento_empresa": {"score": 0-10, "feedback": "..."},
    "experiencia_relevante": {"score": 0-10, "feedback": "..."},
    "motivacion": {"score": 0-10, "feedback": "..."},
    "manejo_objeciones": {"score": 0-10, "feedback": "..."}
  },
  "mejorMomento": "cita textual del mejor momento del candidato",
  "areasMejora": ["..."],
  "veredicto": "contratado | segunda_ronda | no_avanza",
  "consejo": "1 consejo concreto para mejorar"
}`;
}

export function buildCompanySummaryPrompt(scrapedContent: string): string {
  return `Extraé info clave de esta empresa para preparar una entrevista laboral. El contenido fue scrapeado de su sitio web.

CONTENIDO SCRAPEADO:
${scrapedContent}

Respondé con un resumen estructurado que incluya: nombre de la empresa, qué hace, producto principal, mercado objetivo, equipo/fundadores si aparecen, cultura percibida, diferenciadores. Sé conciso y enfocado en lo que sería útil para un candidato preparándose para una entrevista.`;
}

export function buildPersonSearchPrompt(
  email?: string,
  linkedin?: string,
  company?: string,
  role?: string
): string {
  const identifiers = [email, linkedin, company, role].filter(Boolean);
  return `Buscá información profesional pública de esta persona:
${email ? `Email: ${email}` : ""}
${linkedin ? `LinkedIn: ${linkedin}` : ""}
${company ? `Empresa: ${company}` : ""}
${role ? `Cargo: ${role}` : ""}

Devolvé un resumen con: nombre completo, cargo actual, empresa, background profesional, educación, publicaciones o charlas recientes si las hay. Si no encontrás suficiente info, decilo claramente.`;
}
