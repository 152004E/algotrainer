export interface AlgoCase {
  id: string;
  name: string;
  subset: "WV" | "MW" | "OLL" | "PLL" | "F2L";
  difficulty: "Easy" | "Medium" | "Hard";
  scramble: string;
  algorithm: string;
  description?: string;
  edgeGroup?: string;
  shapeGroup?: string;
  alternatives?: string[];
  recognition?: string;
  fingertricks?: string;
  corners?: number;
  shape?: string;
  aliases?: string[];
  usedIn?: string;
  optimalMoves?: string;
  notes?: string;
  /**
   * ID del caso que forma la pareja ergonómica (left/right mirror).
   * Ej: OLL 47 ↔ OLL 48 comparten ergonomicPairId.
   */
  ergonomicPairId?: string;
  /**
   * Indica si este caso es la fuente canónica de variantes.
   * Si es true, sus `alternatives` se usarán para generar
   * las variantes de su pareja ergonómica mediante mirror.
   */
  isCanonicalVariantSource?: boolean;
}

export interface AlgorithmCategory {
  slug: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  lightGradient: string;
  count: number;
  filters: FilterOption[];
}

export interface FilterOption {
  key: string;
  label: string;
  values: string[];
  dependent?: DependentFilter;
}

export interface DependentFilter {
  key: string;
  label: string;
  options: Record<string, string[]>;
  labels: Record<string, Record<string, string>>;
}

export interface SessionStats {
  totalCases: number;
  casesPracticed: number;
  currentStreak: number;
  longestStreak: number;
  totalTime: number;
  avgRecognitionTime: number;
  caseHistory: CaseAttempt[];
}

export interface CaseAttempt {
  caseId: string;
  revealedAt: number;
  timestamp: number;
}

export interface TrainerState {
  currentCase: AlgoCase;
  caseIndex: number;
  cases: AlgoCase[];
  stats: SessionStats;
  revealed: boolean;
  startTime: number;
}
