export interface Session {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "processing" | "ready" | "error";
  cvText: string | null;
  cvFileName: string | null;
  jdText: string | null;
  companyUrl: string | null;
  interviewerEmail: string | null;
  interviewerLinkedin: string | null;
  interviewerRole: string | null;
  companyData: string | null;
  interviewerData: string | null;
  briefing: string | null;
  fitScore: number | null;
  chatMessages: string | null;
  simulacroScore: string | null;
}

export interface Producto {
  nombre: string;
  detalle: string;
}

export interface Fundador {
  nombre: string;
  rol: string;
  background: string;
}

export interface EmpresaInfo {
  nombre: string;
  descripcion: string;
  modelo: string;
  mercado: string;
  producto: Producto[];
  painPoints: string[];
  diferenciales: string[];
  cultura: string;
  fundadores: Fundador[];
  datosRelevantes: string[];
}

export interface Highlight {
  label: string;
  value: string;
  type: "killer" | "strong" | "bonus";
}

export interface Fortaleza {
  titulo: string;
  detalle: string;
  evidencia: string;
}

export interface Debilidad {
  titulo: string;
  detalle: string;
  tip: string;
}

export interface FitAnalysis {
  score: number;
  resumen: string;
  fortalezas: Fortaleza[];
  debilidades: Debilidad[];
  highlights: Highlight[];
}

export interface Pregunta {
  pregunta: string;
  tip: string;
  categoria:
    | "competencia"
    | "situacional"
    | "motivacion"
    | "tecnica"
    | "mercado";
}

export interface EntrevistadorInfo {
  nombre: string;
  rol: string;
  background: string;
  tips: string;
}

export interface BriefingResult {
  empresa: EmpresaInfo;
  fit: FitAnalysis;
  preguntas: Pregunta[];
  entrevistador: EntrevistadorInfo | null;
}

export interface ScoreCategory {
  score: number;
  feedback: string;
}

export interface ScoreResult {
  scoreTotal: number;
  scores: {
    comunicacion: ScoreCategory;
    fit_cultural: ScoreCategory;
    conocimiento_empresa: ScoreCategory;
    experiencia_relevante: ScoreCategory;
    motivacion: ScoreCategory;
    manejo_objeciones: ScoreCategory;
  };
  mejorMomento: string;
  areasMejora: string[];
  veredicto: "contratado" | "segunda_ronda" | "no_avanza";
  consejo: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
