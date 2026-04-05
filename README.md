# Interview Ninja

App de preparación de entrevistas laborales con IA. Subí tu CV, la descripción del puesto y datos de la empresa. La IA investiga, analiza el fit y te ofrece un simulacro de entrevista personalizado.

## Features

- 📄 **Parse CV & JD** — Soporta PDF y texto plano
- 🔍 **Intel de la empresa** — Scrapea automáticamente el sitio web
- 📊 **Análisis de fit** — Score + fortalezas/debilidades personalizadas
- ❓ **Preguntas probables** — 8-10 preguntas generadas por IA basadas en tu perfil
- 👤 **Perfil del entrevistador** — Búsqueda automática de info pública
- 💬 **Simulacro en tiempo real** — Chat streaming con IA que actúa como entrevistador
- 🎯 **Scoring + feedback** — Evaluación honesta de tu desempeño

## Tech Stack

- **Framework**: Next.js 16 + TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui (dark theme)
- **IA**: Anthropic Claude API (claude-sonnet-4-20250514)
- **BD**: Prisma + SQLite (local), migrable a Postgres
- **PDF**: pdf-parse
- **Scraping**: cheerio + fetch

## Arrancar

### 1. Obtener API key

Necesitás una clave de Anthropic. Obtené la tuya gratis en:
https://console.anthropic.com/

### 2. Configurar .env.local

```bash
cp .env.local.example .env.local
```

Edita `.env.local` y reemplaza `YOUR_KEY_HERE` con tu clave:

```env
ANTHROPIC_API_KEY=sk-ant-tu-clave-aqui-xyzabc...
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Inicializar BD

```bash
npx prisma db push
npx prisma generate
```

### 5. Correr dev server

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

## Flujo de uso

1. **Landing** — Clickeá "Preparar entrevista"
2. **Formulario** — Subi CV, pega o carga JD, ingresá URL empresa, datos del entrevistador (opcional)
3. **Processing** — La IA scrapea, analiza y genera briefing (30-60 segundos)
4. **Dashboard** — 5 tabs:
   - **Intel**: Info de la empresa
   - **Fit**: Score + análisis detallado
   - **Preguntas**: Tips para cada pregunta probable
   - **Entrevistador**: Perfil encontrado
   - **Simulacro**: Practicá con IA
5. **Resultados**: Score, feedback, veredicto

## Estructura

```
app/
├── page.tsx              # Landing
├── prep/page.tsx         # Formulario
├── prep/[sessionId]/     # Dashboard
├── api/                  # Todas las rutas API
├── layout.tsx            # Root layout
└── globals.css           # Diseño + variables CSS

components/
├── file-upload.tsx       # Drag & drop
├── processing-loader.tsx # Progress steps
├── score-gauge.tsx       # Gauge visual
├── question-card.tsx     # Card pregunta
└── ui/                   # shadcn/ui

lib/
├── types.ts              # TypeScript types
├── prompts.ts            # Prompts de Claude
├── db.ts                 # Prisma client
├── scraper.ts            # Web scraping
├── pdf-parser.ts         # PDF parsing
└── person-search.ts      # Búsqueda entrevistador
```

## Roadmap

- [ ] Rate limiting (5 sesiones/día sin auth)
- [ ] Clerk auth (login social)
- [ ] Supabase/Postgres para producción
- [ ] Firecrawl API fallback
- [ ] Export resultados (PDF)
- [ ] Historial de sesiones
- [ ] Deploy a Vercel

## Errores comunes

**Error: "Can't find module '@anthropic-ai/sdk'"**
```bash
npm install @anthropic-ai/sdk
```

**Error: "API key not found"**
- Verificá que `.env.local` existe en la raíz
- Que tiene `ANTHROPIC_API_KEY=sk-ant-...`
- Restart del dev server después de cambiar .env

**Error: "Can't parse PDF"**
- Probá pegando el texto directamente en el textarea
- Asegurate que el PDF no esté encriptado

## Develop

```bash
npm run dev        # Dev server (http://localhost:3000)
npm run build      # Next.js build
npm run start      # Start prod build
npm run lint       # ESLint
```

## Deploy

### Vercel (recomendado)

```bash
npx vercel
```

Configura en Vercel:
- Environment variable: `ANTHROPIC_API_KEY`
- Database: Supabase Postgres

### Manual

Cualquier hosting que soporte Node.js 18+:

```bash
npm run build
npm run start
```

## License

MIT

## Soporte

Reportá bugs en https://github.com/anthropics/claude-code/issues
