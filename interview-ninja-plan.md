# Interview Ninja — Plan Técnico Completo

> App de preparación de entrevistas con IA. El usuario sube su CV, la JD, y datos del entrevistador. La app investiga la empresa, analiza el fit, genera preguntas probables y ofrece un simulacro con IA.

---

## 1. Visión del producto

**Input del usuario:**
- CV (PDF o texto)
- Job Description (PDF, texto o URL)
- URL del sitio web de la empresa
- Email o LinkedIn del entrevistador (opcional)
- Cargo del entrevistador (opcional)

**Output de la app:**
1. **Intel Briefing** — Resumen de la empresa (producto, mercado, cultura, fundadores) scrapeado automáticamente
2. **Fit Análisis** — Score de compatibilidad, fortalezas, debilidades con tips
3. **Preguntas Probables** — 8-10 preguntas personalizadas con tips de respuesta
4. **Perfil del Entrevistador** — Info pública encontrada sobre la persona
5. **Simulacro** — Chat interactivo donde la IA actúa como entrevistador

---

## 2. Stack técnico

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | **Next.js 14** (App Router) | SSR, API routes, deploy fácil en Vercel |
| Estilos | **Tailwind CSS** + **shadcn/ui** | Rápido, consistente, componentes accesibles |
| IA | **Anthropic Claude API** (claude-sonnet-4-20250514) | Análisis, briefing, simulacro |
| PDF parsing | **pdf-parse** (Node) | Extraer texto de CVs y JDs |
| Web scraping | **Firecrawl API** (o cheerio + fetch como fallback) | Scrapear sitio de la empresa |
| Búsqueda web | **Anthropic web_search tool** (vía API) | Buscar info del entrevistador y empresa |
| Base de datos | **Prisma + SQLite** (dev) → **Supabase/Postgres** (prod) | Guardar sesiones y resultados |
| Auth | **Clerk** (opcional para MVP) | Login social rápido |
| Deploy | **Vercel** | Zero config con Next.js |
| Estado | **Zustand** o React Context | Estado de la sesión de preparación |

---

## 3. Arquitectura y flujo de datos

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│                                                     │
│  Landing → Upload Form → Processing → Dashboard     │
│     ↓          ↓              ↓           ↓         │
│            [CV + JD +     [Loading +   [Intel |     │
│             URL + email]   progress]    Fit |       │
│                                        Q&A |       │
│                                        Sim]        │
└────────────────────┬────────────────────────────────┘
                     │ API Calls
                     ▼
┌─────────────────────────────────────────────────────┐
│                   BACKEND (API Routes)               │
│                                                     │
│  /api/sessions        → CRUD de sesiones            │
│  /api/parse-cv        → PDF → texto (pdf-parse)     │
│  /api/scrape-company  → URL → contenido empresa     │
│  /api/search-person   → email/nombre → perfil       │
│  /api/generate-brief  → Claude: briefing + fit      │
│  /api/chat            → Claude: simulacro streaming  │
│  /api/score           → Claude: evaluación final     │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              SERVICIOS EXTERNOS                      │
│                                                     │
│  Anthropic API ──── Claude (análisis + chat)         │
│  Firecrawl / fetch ─ Scraping del sitio empresa     │
│  Anthropic web_search ─ Info del entrevistador      │
│  Prisma + DB ─────── Persistencia de sesiones       │
└─────────────────────────────────────────────────────┘
```

---

## 4. Estructura de carpetas

```
interview-ninja/
├── app/
│   ├── layout.tsx                    # Root layout + providers + fonts
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Tailwind + CSS variables
│   │
│   ├── prep/
│   │   ├── page.tsx                  # Formulario: subir CV + JD + datos
│   │   └── [sessionId]/
│   │       ├── page.tsx              # Dashboard principal (tabs)
│   │       ├── loading.tsx           # Skeleton mientras carga
│   │       └── components/
│   │           ├── intel-tab.tsx     # Tab: Intel de la empresa
│   │           ├── fit-tab.tsx       # Tab: Fit análisis
│   │           ├── questions-tab.tsx # Tab: Preguntas probables
│   │           ├── interviewer-tab.tsx # Tab: Perfil entrevistador
│   │           └── simulacro-tab.tsx # Tab: Chat simulacro
│   │
│   └── api/
│       ├── sessions/
│       │   ├── route.ts             # POST: crear sesión
│       │   └── [id]/route.ts        # GET: obtener sesión
│       ├── parse-cv/
│       │   └── route.ts             # POST: PDF → texto
│       ├── scrape/
│       │   └── route.ts             # POST: scrapear URL empresa
│       ├── search-person/
│       │   └── route.ts             # POST: buscar entrevistador
│       ├── generate/
│       │   └── route.ts             # POST: generar briefing completo
│       ├── chat/
│       │   └── route.ts             # POST: simulacro streaming
│       └── score/
│           └── route.ts             # POST: evaluar simulacro
│
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── file-upload.tsx              # Drag & drop para CV/JD
│   ├── processing-loader.tsx        # Animación de progreso
│   ├── score-gauge.tsx              # Gauge visual del fit score
│   ├── chat-interface.tsx           # Chat del simulacro
│   └── question-card.tsx            # Card expandible de pregunta
│
├── lib/
│   ├── prompts.ts                   # Todos los prompts de Claude
│   ├── scraper.ts                   # Lógica de scraping
│   ├── pdf-parser.ts                # Wrapper de pdf-parse
│   ├── person-search.ts             # Búsqueda de entrevistador
│   ├── types.ts                     # TypeScript types
│   ├── utils.ts                     # Helpers
│   └── db.ts                        # Prisma client
│
├── prisma/
│   └── schema.prisma                # Modelo de datos
│
├── public/                          # Assets estáticos
├── .env.local                       # API keys
├── AGENTS.md                        # Instrucciones para Claude Code
├── CLAUDE.md                        # Design system
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. Modelo de datos (Prisma)

```prisma
model Session {
  id              String   @id @default(cuid())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  status          String   @default("draft") // draft | processing | ready | error

  // Inputs
  cvText          String?
  cvFileName      String?
  jdText          String?
  companyUrl      String?
  interviewerEmail String?
  interviewerLinkedin String?
  interviewerRole String?

  // Processed data
  companyData     String?  // JSON: scraped company info
  interviewerData String?  // JSON: found interviewer info
  briefing        String?  // JSON: full briefing result
  fitScore        Int?

  // Simulacro
  chatMessages    String?  // JSON: array of messages
  simulacroScore  String?  // JSON: score breakdown
}
```

---

## 6. Prompts de IA (lib/prompts.ts)

### 6.1 Briefing + Fit Analysis

```typescript
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
  "entrevistador": {
    "nombre": "...",
    "rol": "...",
    "background": "...",
    "tips": "cómo conectar con esta persona"
  }
}

Sé brutal y honesto. No endulces los puntos débiles. Las preguntas deben ser específicas para este puesto, no genéricas.`;
}
```

### 6.2 Simulacro

```typescript
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
```

### 6.3 Score final

```typescript
export function buildScorePrompt(
  messages: { role: string; content: string }[],
  jdText: string
): string {
  const transcript = messages.map(m =>
    `${m.role === "user" ? "CANDIDATO" : "ENTREVISTADOR"}: ${m.content}`
  ).join("\n\n");

  return `Evaluá esta entrevista simulada para el puesto:

JD: ${jdText}

TRANSCRIPCIÓN:
${transcript}

Respondé SOLO con JSON:
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
```

---

## 7. API Routes clave

### 7.1 POST /api/scrape

```typescript
// Scrapea el sitio de la empresa y extrae info relevante
// Opción A: Firecrawl API (recomendado, mejor extracción)
// Opción B: fetch + cheerio (gratis, más limitado)

export async function POST(req: Request) {
  const { url } = await req.json();

  // 1. Scrapear página principal
  const mainPage = await scrapeUrl(url);

  // 2. Buscar y scrapear páginas clave (/about, /pricing, /team, /blog)
  const aboutPage = await scrapeUrl(`${url}/about`).catch(() => null);
  const pricingPage = await scrapeUrl(`${url}/pricing`).catch(() => null);

  // 3. Condensar con Claude
  const summary = await claude.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: `Extraé info clave de esta empresa para preparar una entrevista:\n\n${mainPage}\n\n${aboutPage || ""}\n\n${pricingPage || ""}\n\nJSON con: nombre, qué hace, producto, mercado, equipo, cultura, diferencial.`
    }]
  });

  return Response.json({ data: summary });
}
```

### 7.2 POST /api/search-person

```typescript
// Busca info pública del entrevistador usando web search
export async function POST(req: Request) {
  const { email, name, company, role } = await req.json();

  // Usar Claude con web_search tool
  const result = await claude.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages: [{
      role: "user",
      content: `Buscá información profesional pública de: ${name || email}
      ${company ? `Empresa: ${company}` : ""}
      ${role ? `Cargo: ${role}` : ""}
      Devolvé: nombre completo, cargo, empresa, background profesional, educación, publicaciones o charlas recientes.`
    }]
  });

  return Response.json({ data: result });
}
```

### 7.3 POST /api/chat (streaming)

```typescript
// Simulacro de entrevista con streaming
export async function POST(req: Request) {
  const { messages, systemPrompt } = await req.json();

  const stream = await claude.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: systemPrompt,
    messages,
  });

  return new Response(stream.toReadableStream(), {
    headers: { "Content-Type": "text/event-stream" },
  });
}
```

---

## 8. Flujo del usuario (paso a paso)

```
1. LANDING
   └─→ CTA "Preparar entrevista"

2. FORMULARIO (/prep)
   ├─→ Subir CV (drag & drop, PDF/TXT)
   ├─→ Pegar o subir JD (texto o PDF)
   ├─→ URL del sitio de la empresa
   ├─→ Email o LinkedIn del entrevistador (opcional)
   └─→ Cargo del entrevistador (opcional)
       └─→ Click "Analizar"

3. PROCESAMIENTO (loading screen con progreso)
   ├─→ Step 1: "Parseando tu CV..." (pdf-parse)
   ├─→ Step 2: "Investigando la empresa..." (scrape)
   ├─→ Step 3: "Buscando al entrevistador..." (web search)
   ├─→ Step 4: "Generando tu briefing..." (Claude)
   └─→ Redirige a dashboard cuando termina

4. DASHBOARD (/prep/[sessionId])
   ├─→ Tab "Intel" — Info de la empresa
   ├─→ Tab "Fit" — Score + fortalezas + debilidades
   ├─→ Tab "Preguntas" — 8-10 preguntas con tips
   ├─→ Tab "Entrevistador" — Perfil encontrado
   └─→ Tab "Simulacro" — Chat con IA
       └─→ Al terminar: Score + feedback + veredicto
```

---

## 9. Roadmap de implementación

### Fase 1: Fundación (Día 1-2)
- [ ] `npx create-next-app@latest interview-ninja`
- [ ] Configurar Tailwind + shadcn/ui
- [ ] Prisma + SQLite schema
- [ ] Variables de entorno (.env.local)
- [ ] Layout base + landing page
- [ ] Componente FileUpload (drag & drop)

### Fase 2: Core Pipeline (Día 3-5)
- [ ] API: /api/parse-cv (pdf-parse)
- [ ] API: /api/scrape (fetch + cheerio o Firecrawl)
- [ ] API: /api/generate (Claude briefing)
- [ ] API: /api/search-person (Claude + web_search)
- [ ] Formulario completo (/prep)
- [ ] Processing screen con progress steps
- [ ] Crear sesión en DB y orquestar pipeline

### Fase 3: Dashboard (Día 6-8)
- [ ] Dashboard con tabs (/prep/[sessionId])
- [ ] Intel tab (info empresa)
- [ ] Fit tab (score gauge + fortalezas/debilidades)
- [ ] Questions tab (cards expandibles)
- [ ] Interviewer tab (perfil)
- [ ] Responsive mobile-first

### Fase 4: Simulacro (Día 9-10)
- [ ] API: /api/chat (streaming)
- [ ] Chat interface con streaming
- [ ] Detección de fin de entrevista
- [ ] API: /api/score
- [ ] Pantalla de resultados post-simulacro

### Fase 5: Polish + Deploy (Día 11-12)
- [ ] Error handling robusto
- [ ] Loading states y skeletons
- [ ] SEO + meta tags
- [ ] Deploy a Vercel
- [ ] README con instrucciones
- [ ] (Opcional) Auth con Clerk

---

## 10. Variables de entorno

```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-...

# Opcional: Firecrawl para mejor scraping
FIRECRAWL_API_KEY=fc-...

# Database (Supabase en prod)
DATABASE_URL="file:./dev.db"

# Opcional: Clerk auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

---

## 11. Comandos para arrancar

```bash
# 1. Crear proyecto
npx create-next-app@latest interview-ninja --typescript --tailwind --eslint --app --src-dir=false

# 2. Instalar dependencias
cd interview-ninja
npm install @anthropic-ai/sdk pdf-parse prisma @prisma/client zustand

# 3. shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card badge tabs input textarea dialog progress

# 4. Prisma
npx prisma init --datasource-provider sqlite
# Copiar schema.prisma del paso 5
npx prisma db push

# 5. Crear .env.local con tu ANTHROPIC_API_KEY

# 6. Correr
npm run dev
```

---

## 12. AGENTS.md (para Claude Code)

```markdown
# Interview Ninja — Instrucciones para Claude Code

## Qué es
App Next.js 14 para preparar entrevistas laborales con IA. El usuario sube CV + JD + URL empresa + datos del entrevistador. La app scrapea, analiza y genera un briefing completo + simulacro.

## Stack
- Next.js 14 (App Router), TypeScript estricto
- Tailwind CSS + shadcn/ui (dark theme por defecto)
- Anthropic Claude API (claude-sonnet-4-20250514)
- Prisma + SQLite (dev)
- pdf-parse para CVs

## Convenciones
- Español en UI, inglés en código
- Archivos: kebab-case
- Componentes: PascalCase
- API responses: siempre { data, error }
- Errores: try/catch con mensajes claros al usuario
- Mobile-first responsive

## Diseño
- Dark theme: bg-zinc-950, surfaces bg-zinc-900, borders zinc-800
- Accent: violet-500 (#6c5ce7)
- Font: DM Sans (display) + JetBrains Mono (data/labels)
- Cards con border sutil, sin sombras
- Badges/Pills para categorías
- Score gauge SVG animado para fit score

## Flujo principal
1. Landing → /prep (formulario)
2. /prep → submit → crear sesión → procesar pipeline
3. Pipeline: parse CV → scrape empresa → search entrevistador → generate briefing
4. Redirige a /prep/[id] (dashboard con tabs)
5. Tab simulacro: chat streaming con Claude
```

---

## 13. Consideraciones técnicas

### Scraping
- **Firecrawl** (recomendado): API que scrapea y limpia HTML a markdown. $1/1000 páginas.
- **Fallback**: `fetch` + `cheerio`. Gratis pero peor extracción. Algunos sitios bloquean.
- Scrapear: homepage, /about, /pricing, /team, /blog (intentar, no fallar si no existe).

### Búsqueda del entrevistador
- LinkedIn bloquea scraping directo. Usar Claude con `web_search` tool para buscar info pública.
- Buscar por: "nombre + empresa + cargo" o "email + LinkedIn".
- No prometer resultados: a veces no hay info pública suficiente.

### Límites de la API
- Claude Sonnet: ~$3/M input tokens, ~$15/M output tokens.
- Para portfolio/gratis: poner rate limiting (ej: 5 sesiones/día sin auth).
- Considerar caching de scraping (mismo URL = mismo resultado por 24hs).

### Streaming del simulacro
- Usar `@anthropic-ai/sdk` con `.stream()`.
- Devolver como `ReadableStream` desde la API route.
- En el frontend: `fetch` + `getReader()` para consumir chunks.
