# intrevieu

Aplicación de preparación para entrevistas laborales potenciada por IA. Carga tu CV y descripción del puesto, obtén inteligencia sobre la empresa, análisis de ajuste, preguntas probables y un simulacro de entrevista en vivo.

## Que es intrevieu

Analiza tu perfil contra una oportunidad laboral y te prepara con:

1. **Inteligencia Empresarial** - Raspado del sitio web de la empresa, extrae información clave (producto, mercado, cultura, fundadores)
2. **Análisis de Ajuste** - Compara tu experiencia con los requisitos del puesto, desglose de puntuación
3. **Preguntas Probables** - Genera 8-10 preguntas esperadas de entrevista con consejos
4. **Perfil del Entrevistador** - Busca y perfila al entrevistador (opcional)
5. **Simulacro en Vivo** - La IA realiza una entrevista realista, da retroalimentación por competencia

## Stack Tecnologico

- **Framework**: Next.js 16 (App Router) + TypeScript estricto
- **UI**: Tailwind CSS 4 + shadcn/ui (tema oscuro)
- **IA**: Groq API (modelo llama-3.3-70b-versatile)
- **BD**: PostgreSQL + Supabase (cliente postgres)
- **ORM**: Prisma 7
- **Autenticación**: Clerk
- **Scraping**: cheerio + fetch nativa
- **PDF**: pdf-parse
- **Monitoreo**: Vercel Analytics + Speed Insights
- **Tipografia**: DM Sans (cuerpo) + JetBrains Mono (código/etiquetas)
- **Deploy**: Vercel

## Requisitos Previos

- Node.js 18+
- GROQ_API_KEY de https://console.groq.com
- DATABASE_URL de Supabase PostgreSQL

## Inicio Rapido

1. Clonar e instalar

```bash
git clone <repo>
cd interview-ninja
npm install
```

2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Agregar en .env.local:

```
GROQ_API_KEY=gsk_...
DATABASE_URL=postgresql://user:password@host:5432/db
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

3. Configurar base de datos

```bash
npx prisma generate
npx prisma migrate dev
```

4. Ejecutar servidor de desarrollo

```bash
npm run dev
```

Abrir http://localhost:3000

## Estructura del Proyecto

```
app/
├── page.tsx                         Landing
├── prep/
│   ├── page.tsx                     Formulario de preparacion
│   └── [sessionId]/
│       ├── page.tsx                 Dashboard (5 tabs)
│       └── components/
│           ├── intel-tab.tsx        Inteligencia empresarial
│           ├── fit-tab.tsx          Analisis de ajuste
│           ├── questions-tab.tsx    Preguntas probables
│           ├── interviewer-tab.tsx  Perfil entrevistador
│           └── simulacro-tab.tsx    Simulacro en vivo
└── api/
    ├── sessions/route.ts           Crear sesion
    ├── parse-cv/route.ts           Extraer texto CV
    ├── scrape/route.ts             Raspar sitio empresa
    ├── search-person/route.ts      Buscar perfil entrevistador
    ├── generate/route.ts           Generar briefing
    ├── chat/route.ts               Respuestas streaming
    └── score/route.ts              Calificar entrevista

lib/
├── types.ts                        Interfaces TypeScript
├── prompts.ts                      Prompts del sistema
├── groq.ts                         Cliente Groq
├── supabase.ts                     Cliente Supabase
├── db.ts                           Conexion PostgreSQL
├── scraper.ts                      Logica de raspado
├── pdf-parser.ts                   Extraccion PDF
└── person-search.ts                Busqueda entrevistador

components/
├── ui/                             Componentes shadcn/ui
├── file-upload.tsx                 Carga arrastrable
├── processing-loader.tsx           Indicador progreso
├── score-gauge.tsx                 Grafico puntuacion
├── question-card.tsx               Tarjeta pregunta
└── app-header.tsx                  Encabezado navegacion
```

## Flujo del Usuario

### 1. Formulario de Preparacion (/prep)

Carga o pega:
- CV (PDF o texto) - requerido
- Descripcion del puesto (PDF o texto) - requerida
- URL de la empresa - requerida
- Email del entrevistador (opcional)
- LinkedIn del entrevistador (opcional)

Valida en cliente, envia a crear sesion.

### 2. Pipeline de Procesamiento

Ejecuta en secuencia con indicador de progreso:
1. Parsear CV - extraer texto
2. Raspar empresa - homepage, /about, /pricing
3. Buscar entrevistador - Groq + busqueda web
4. Generar briefing - compilar inteligencia en JSON
5. Guardar en BD - redirigir a dashboard

### 3. Dashboard (/prep/[sessionId])

Cinco tabs de preparacion:

- **Intel**: Perfil empresa (producto, mercado, cultura, fundacion, hechos clave)
- **Fit**: Puntuacion ajuste (0-100) con fortalezas/debilidades + consejos
- **Preguntas**: 8-10 preguntas probables con consejos por pregunta
- **Entrevistador**: Perfil entrevistador (si existe) + consejos conexion
- **Simulacro**: Entrevista IA en vivo con puntuacion final

### 4. Simulacro (Entrevista en Vivo)

- Entrevistador IA hace preguntas segun CV, JD, contexto empresa
- Respondes en tiempo real
- 7-8 rondas de preguntas
- Puntuacion final desglosado por competencia
- Retroalimentacion fortalezas y areas mejora

## Rutas API

Todas responden en formato { data: T | null, error: string | null }

| Ruta | Metodo | Proposito |
|------|--------|-----------|
| /api/sessions | POST | Crear sesion entrevista |
| /api/parse-cv | POST | Extraer texto CV (PDF/TXT) |
| /api/scrape | POST | Raspar sitio empresa |
| /api/search-person | POST | Buscar perfil entrevistador |
| /api/generate | POST | Generar briefing JSON entrevista |
| /api/chat | POST | Stream preguntas/respuestas (SSE) |
| /api/score | POST | Calcular puntuacion final entrevista |

## Sistema de Diseno

Tema oscuro (base Zinc-950):
- Fondo: #0a0a0c
- Superficie (tarjetas): #111114
- Borde: #1e1e24
- Texto: #e8e8ec
- Acento: #6c5ce7 (violeta)

Responsive:
- Mobile-first
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)
- Tabs en mobile, sidebar en desktop

## Configuracion

### Variables de Entorno

Crear .env.local:

```
GROQ_API_KEY=gsk_...
DATABASE_URL=postgresql://user:password@host/db
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NODE_ENV=development
```

### Base de Datos

Usa PostgreSQL con Prisma. Para cambiar a otra BD:

1. Actualizar datasource en prisma/schema.prisma
2. Ejecutar npx prisma migrate deploy
3. Actualizar DATABASE_URL en .env.local

## Scripts

```bash
npm run dev            Servidor desarrollo
npm run build          Build produccion
npm run start          Servidor produccion
npm run lint           Ejecutar ESLint
```

## Solucion de Problemas

**PDF falla al parsear**
- PDF puede estar corrompido o encriptado
- Alternativa: pega manualmente texto CV en textarea

**Empresa raspada vacia**
- No todas webs tienen /about o /pricing
- Revisar manualmente antes entrevista

**Entrevistador no encontrado**
- Puede requerir info mas especifica (nombre completo + empresa)
- Tab perfil es opcional - continua sin el

**Error conexion BD**
- Verifica DATABASE_URL apunte a PostgreSQL valida
- Ejecuta npx prisma migrate dev para inicializar

## Hoja de Ruta

Completado
- Completado: Pipeline core preparacion entrevista
- Completado: Simulacro en vivo streaming
- Completado: Raspado empresa + inteligencia
- Completado: Desglose puntuacion por competencia
- Completado: Tema oscuro responsive mobile

En Progreso
- En Progreso: Gestor sesiones (ver/eliminar entrevistas pasadas)
- En Progreso: Exportar resultados entrevista a PDF
- En Progreso: Soporte multiidioma

Proximamente
- Programador entrevistas integrado
- Simulacro video (Synthesia API)
- Facturacion equipos + comparticion workspace
- Grabacion y reproduccion entrevista
- Autenticacion Supabase + equipos
- Dashboard analitica

## Licencia

MIT

## Autor

Construido por Alan Telo

---

Links: Problemas | Discusiones
