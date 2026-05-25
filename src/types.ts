export interface AlgoCase {
  id: string;
  name: string;
  subset: "WV" | "MW" | "OLL" | "PLL" | "F2L";
  difficulty: "Easy" | "Medium" | "Hard";
  scramble: string;
  algorithm: string;
  description?: string;
  alternatives?: string[];
  recognition?: string;
  fingertricks?: string;
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
