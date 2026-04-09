# intrevieu

AI-powered interview preparation app. Upload your CV and job description, get company intelligence, match analysis, likely questions, and a live interview simulation powered by Claude.

## 🎯 What It Does

intrevieu analyzes your profile against a job opportunity and prepares you with:

1. **Company Intel** – Scrapes company website, extracts key info (product, market, culture, founders)
2. **Fit Analysis** – Matches your background against job requirements with score breakdown
3. **Likely Questions** – Generates 8-10 probable interview questions with tips
4. **Interviewer Profile** – Searches and profiles the actual interviewer (optional)
5. **Live Simulacro** – AI conducts a realistic interview, gives feedback per competency

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript (strict mode)
- **UI**: Tailwind CSS 4 + shadcn/ui (dark theme)
- **AI**: Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Database**: Prisma 7 + SQLite (via `@libsql/client`)
- **PDF Parsing**: `pdf-parse` (PDFParse class)
- **Web Scraping**: `cheerio` + native `fetch`
- **Real-time**: Server-Sent Events (SSE) for chat streaming
- **Monitoring**: Vercel Analytics + Speed Insights
- **Typography**: DM Sans (body) + JetBrains Mono (code/labels)
- **Deploy**: Vercel

## 📋 Prerequisites

- Node.js 18+ with npm
- ANTHROPIC_API_KEY from [console.anthropic.com](https://console.anthropic.com)

## 🚀 Quick Start

1. **Clone and install**
   ```bash
   git clone <repo>
   cd interview-ninja
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   Add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. **Set up database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
app/
├── page.tsx                    # Landing page
├── prep/
│   ├── page.tsx                # Interview prep form
│   └── [sessionId]/
│       ├── page.tsx            # 5-tab dashboard
│       └── components/
│           ├── intel-tab.tsx   # Company intelligence
│           ├── fit-tab.tsx     # Candidate-job fit analysis
│           ├── questions-tab.tsx   # Likely interview questions
│           ├── interviewer-tab.tsx # Interviewer profile
│           └── simulacro-tab.tsx   # Live AI interview sim
└── api/
    ├── sessions/route.ts       # Create session
    ├── parse-cv/route.ts       # Extract CV text
    ├── scrape/route.ts         # Scrape company website
    ├── search-person/route.ts  # Find interviewer profile
    ├── generate/route.ts       # Generate interview briefing
    ├── chat/route.ts           # Streaming chat responses
    └── score/route.ts          # Final interview score

lib/
├── types.ts                    # TypeScript interfaces
├── prompts.ts                  # Claude system prompts
├── db.ts                       # Prisma + libsql setup
├── scraper.ts                  # Web scraping logic
├── pdf-parser.ts               # PDF text extraction
└── person-search.ts            # Interviewer search

components/
├── ui/                         # shadcn/ui components
├── file-upload.tsx             # Drag & drop file input
├── processing-loader.tsx       # Step-by-step progress
├── score-gauge.tsx             # SVG animated score gauge
├── question-card.tsx           # Expandable question display
└── app-header.tsx              # Navigation header
```

## 🎮 User Flow

### 1. Interview Prep Form (`/prep`)
Upload or paste:
- **CV** (PDF or plain text) – required
- **Job Description** (PDF or text) – required
- **Company URL** – required
- **Interviewer Email** (optional)
- **Interviewer LinkedIn** (optional)

Form validates client-side, submits to create a session.

### 2. Processing Pipeline
System executes these steps sequentially with progress display:
1. Parse CV → extract text
2. Scrape company site → homepage, /about, /pricing
3. Search interviewer → Claude + web search
4. Generate briefing → compile all intel into JSON
5. Save to database → redirect to dashboard

### 3. Dashboard (`/prep/[sessionId]`)

Five tabs for comprehensive prep:

- **Intel**: Company profile (product, market, culture, founding, key facts)
- **Fit**: Match score (0-100) with strengths/weaknesses + improvement tips
- **Preguntas**: 8-10 probable questions with tips per question
- **Entrevistador**: Interviewer profile (if found) + connection tips
- **Simulacro**: Live AI interview with adaptive questioning + final score

### 4. Simulacro (Live Interview)
- AI interviewer asks questions based on your CV, JD, company context
- You respond in real-time
- 7-8 question turns
- Final score breakdown by competency
- Feedback on strengths and areas to improve

## 📡 API Endpoints

All responses follow `{ data: T | null, error: string | null }` format.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/sessions` | POST | Create interview session |
| `/api/parse-cv` | POST | Extract text from CV (PDF/TXT) |
| `/api/scrape` | POST | Scrape company website |
| `/api/search-person` | POST | Find interviewer profile |
| `/api/generate` | POST | Generate interview briefing JSON |
| `/api/chat` | POST | Stream interview questions/answers (SSE) |
| `/api/score` | POST | Calculate final interview score |

## 🎨 Design System

**Dark theme** (Zinc-950 base):
- Background: `#0a0a0c`
- Surface (cards): `#111114`
- Border: `#1e1e24`
- Text: `#e8e8ec`
- Accent: `#6c5ce7` (violet)

**Responsive**:
- Mobile-first approach
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)
- Tabs on mobile, sidebar on desktop

## 🚀 Deployment

Deploy to Vercel in one click:

```bash
vercel deploy
```

Or manual setup:
1. Push to GitHub
2. Connect repo to Vercel
3. Add `ANTHROPIC_API_KEY` to environment
4. Deploy

The app uses Vercel Analytics and Speed Insights automatically.

## 🔧 Configuration

### Environment Variables

Create `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=file:./prisma/dev.db
```

### Database

Uses SQLite with Prisma via libsql adapter. To migrate to PostgreSQL/Supabase:

1. Update `prisma/schema.prisma` datasource
2. Run `npx prisma migrate deploy`
3. Update `DATABASE_URL` in `.env.local`

## 📚 Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript
```

## ⚠️ Troubleshooting

**PDF parsing fails**
- PDF file may be corrupted or encrypted
- Fallback: manually paste CV text into textarea

**Company scraping returns empty**
- Not all websites have `/about` or `/pricing` pages
- Manual review recommended before interview

**Interviewer not found**
- May require more specific search info (full name + company)
- Profile tab is optional—proceed without it

**Rate limiting**
- Max 5 sessions per IP per 24 hours (no authentication required)

**Database connection error**
- Ensure `DATABASE_URL` points to valid SQLite file
- Run `npx prisma migrate dev` to initialize

## 🗺️ Roadmap

**Completed**
- ✅ Core interview prep pipeline
- ✅ Live AI simulacro with streaming
- ✅ Company scraping + intelligence
- ✅ Score breakdown by competency
- ✅ Mobile-responsive dark theme

**In Progress**
- 🚧 Session management (view/delete past interviews)
- 🚧 Export interview results as PDF
- 🚧 Multi-language support

**Coming Soon**
- 📅 Interview scheduling integration
- 📅 Video interview simulation (Synthesia API)
- 📅 Team billing + workspace sharing
- 📅 Interview recording + playback
- 📅 Supabase auth + teams
- 📅 Analytics dashboard

## 📄 License

MIT

## 👤 Author

Built with ❤️ by Alan Telo

---

**Quick links**: [Issues](https://github.com/alantelo/interview-ninja/issues) | [Discussions](https://github.com/alantelo/interview-ninja/discussions)
