# Interview Ninja — AGENTS.md

## Qué es
App Next.js 14 de preparación de entrevistas laborales con IA. El usuario sube su CV + Job Description + URL de la empresa + datos del entrevistador. La app scrapea el sitio, busca info del entrevistador, analiza el fit candidato-puesto, genera preguntas probables y ofrece un simulacro de entrevista con IA.

## Stack obligatorio
- **Framework**: Next.js 14 (App Router), TypeScript estricto
- **Estilos**: Tailwind CSS + shadcn/ui (dark theme)
- **IA**: Anthropic Claude API (`claude-sonnet-4-20250514`) via `@anthropic-ai/sdk`
- **PDF**: `pdf-parse` para extraer texto de CVs y JDs
- **DB**: Prisma + SQLite (dev), migrable a Postgres/Supabase
- **Estado**: Zustand para estado de sesión
- **Deploy**: Vercel

## Convenciones de código
- UI en español (rioplatense), código en inglés
- Archivos: kebab-case (`intel-tab.tsx`)
- Componentes: PascalCase (`IntelTab`)
- API responses: siempre `{ data: T | null, error: string | null }`
- Errores: try/catch, mensajes claros al usuario, nunca stack traces
- Mobile-first responsive (breakpoints: sm:640, md:768, lg:1024)
- Server Components por defecto, "use client" solo cuando hay interactividad

## Design system

### Colores (CSS variables en globals.css)
```
--bg: #0a0a0c (zinc-950)
--surface: #111114 (cards, inputs)
--surface-hover: #18181c
--border: #1e1e24
--border-light: #2a2a32
--text: #e8e8ec
--text-muted: #8a8a96
--text-dim: #5a5a66
--accent: #6c5ce7 (violet)
--accent-glow: rgba(108,92,231,0.15)
--green: #00b894
--amber: #fdcb6e
--red: #e17055
--blue: #74b9ff
```

### Tipografía
- Display/body: `DM Sans` (Google Fonts)
- Mono/labels/data: `JetBrains Mono` (Google Fonts)
- Headings: 600-700 weight, nunca más de 24px en móvil
- Body: 14px, line-height 1.6

### Componentes
- Cards: `bg-surface border border-border rounded-xl p-4`, sin sombras
- Badges/Pills: `rounded-full px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider`
- Buttons primary: `bg-accent text-white rounded-lg px-6 py-3 font-semibold`
- Inputs: `bg-surface border border-border rounded-lg px-4 py-3`
- Section labels: `font-mono text-xs uppercase tracking-widest text-muted`

### Layout
- Max-width contenido: `max-w-2xl mx-auto` en mobile, `max-w-5xl` en desktop con sidebar
- Padding global: `px-5 py-6`
- Gap entre cards: `gap-3`
- Dashboard: tabs en top (mobile), sidebar (desktop lg+)

## Estructura de archivos

```
app/
├── layout.tsx              # Fonts + providers + dark theme
├── page.tsx                # Landing
├── globals.css             # Tailwind + CSS vars
├── prep/
│   ├── page.tsx            # Formulario upload
│   └── [sessionId]/
│       ├── page.tsx        # Dashboard (tabs)
│       └── components/
│           ├── intel-tab.tsx
│           ├── fit-tab.tsx
│           ├── questions-tab.tsx
│           ├── interviewer-tab.tsx
│           └── simulacro-tab.tsx
└── api/
    ├── sessions/route.ts
    ├── parse-cv/route.ts
    ├── scrape/route.ts
    ├── search-person/route.ts
    ├── generate/route.ts
    ├── chat/route.ts
    └── score/route.ts

components/
├── ui/                     # shadcn
├── file-upload.tsx
├── processing-loader.tsx
├── score-gauge.tsx
├── chat-interface.tsx
└── question-card.tsx

lib/
├── prompts.ts              # Todos los system prompts
├── scraper.ts
├── pdf-parser.ts
├── person-search.ts
├── types.ts
├── utils.ts
└── db.ts

prisma/
└── schema.prisma
```

## Flujo principal

### 1. Formulario (/prep)
Campos:
- CV: drag & drop (PDF/TXT), obligatorio
- JD: textarea o drag & drop (PDF/TXT), obligatorio
- URL empresa: input URL, obligatorio
- Email entrevistador: input email, opcional
- LinkedIn entrevistador: input URL, opcional
- Cargo entrevistador: input text, opcional

Validación client-side. Al submit → POST /api/sessions → redirige a processing.

### 2. Pipeline de procesamiento
Ejecutar en secuencia (mostrar progreso step by step):

```
Step 1: Parse CV → pdf-parse → texto
Step 2: Scrape empresa → fetch homepage + /about + /pricing → condensar con Claude
Step 3: Search entrevistador → Claude + web_search tool
Step 4: Generate briefing → Claude con todo el contexto → JSON completo
Step 5: Guardar en DB → redirect a dashboard
```

### 3. Dashboard (/prep/[sessionId])
5 tabs:
- **Intel**: info empresa (producto, mercado, fundadores, cultura, datos clave)
- **Fit**: score gauge (SVG), highlights, fortalezas con evidencia, debilidades con tips
- **Preguntas**: 8-10 cards expandibles con pregunta + tip + categoría
- **Entrevistador**: perfil encontrado, tips de conexión
- **Simulacro**: chat streaming con Claude

### 4. Simulacro
- System prompt con todo el contexto (briefing + CV + JD)
- 7-8 turnos, una pregunta por mensaje
- Al finalizar: score por competencia + feedback + veredicto
- Mostrar resultados en UI bonita

## API Routes detalle

### POST /api/sessions
Input: FormData con CV file + JD text + URL + interviewer data
Output: `{ data: { id: string } }`
Acción: Crear sesión en DB, devolver ID

### POST /api/parse-cv
Input: `{ file: base64 string }`
Output: `{ data: { text: string } }`

### POST /api/scrape
Input: `{ url: string }`
Output: `{ data: { content: string, pages: string[] } }`
Acción: fetch homepage, /about, /pricing. Extraer texto con cheerio. Si falla, devolver lo que haya.

### POST /api/search-person
Input: `{ email?: string, linkedin?: string, company?: string, role?: string }`
Output: `{ data: { profile: string } }`
Acción: Claude con web_search tool

### POST /api/generate
Input: `{ sessionId: string }`
Output: `{ data: BriefingResult }`
Acción: Tomar datos de la sesión, llamar a Claude con prompt de briefing, guardar resultado

### POST /api/chat
Input: `{ messages: Message[], systemPrompt: string }`
Output: ReadableStream (SSE)
Acción: Claude streaming

### POST /api/score
Input: `{ messages: Message[], jdText: string }`
Output: `{ data: ScoreResult }`

## Reglas importantes
1. NUNCA hardcodear datos de empresa o candidato. Todo viene del pipeline.
2. Manejar errores de scraping gracefully (no toda empresa tiene /about).
3. El entrevistador es OPCIONAL. Si no hay datos, ocultar el tab.
4. Rate limiting: máximo 5 sesiones por IP por día (sin auth).
5. Cache scraping: mismo URL = mismo resultado por 24hs.
6. PDF parsing puede fallar: tener fallback a textarea manual.
7. Streaming del chat: usar ReadableStream, no polling.
8. Todo el state del simulacro se mantiene client-side hasta el score final.
