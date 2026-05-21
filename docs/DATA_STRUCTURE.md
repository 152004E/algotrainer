# Data Structures & Formats

## Core Types

### AlgoCase
Represents a single algorithm case.

```ts
interface AlgoCase {
  id: string;              // Unique ID: "wv-01", "oll-27", etc.
  name: string;            // Display name: "WV 1", "OLL 27 (Dot)", etc.
  subset: string;          // Category: "WV", "MW", "OLL", "PLL", "F2L"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  scramble: string;        // Cube scramble notation: "R U R' U'"
  algorithm: string;       // Solution: "(R U R' U') (R' F R2 U')"
  description?: string;    // Optional pattern name: "L-shape" 
  imageUrl?: string;       // Optional diagram URL
}
```

### SessionStats
Tracks user progress in current session.

```ts
interface SessionStats {
  totalCases: number;           // How many cases in the set
  casesPracticed: number;       // Cases done so far
  currentStreak: number;        // Consecutive successes
  longestStreak: number;        // Best streak this session
  totalTime: number;            // Milliseconds spent
  avgRecognitionTime: number;   // Avg time to recognize pattern
  caseHistory: CaseAttempt[];   // Log of attempts
}

interface CaseAttempt {
  caseId: string;
  revealedAt: number;    // ms from case start to reveal
  timestamp: number;
}
```

### TrainerState
Current state of the trainer.

```ts
interface TrainerState {
  currentCase: AlgoCase;
  caseIndex: number;        // 0-based position in shuffled array
  cases: AlgoCase[];        // All cases for this subset (shuffled)
  stats: SessionStats;
  revealed: boolean;        // Is algorithm showing?
  startTime: number;        // When case appeared (for timer)
}
```

---

## Dataset Files

### Structure: `src/data/[Subset]Cases.ts`

Each file exports default array of `AlgoCase[]`.

#### Example: `WVCases.ts`
```ts
const WVCases: AlgoCase[] = [
  {
    id: "wv-01",
    name: "WV 1",
    subset: "WV",
    difficulty: "Easy",
    scramble: "R U R' U'",
    algorithm: "(R U R' U') (R' F R2 U')",
    description: "Standard WV from closed slot",
  },
  {
    id: "wv-02",
    name: "WV 2",
    subset: "WV",
    difficulty: "Easy",
    scramble: "R2 U' R2 U",
    algorithm: "R U R' y' R' U R",
    description: "WV rotated",
  },
  // ... 25 more cases (27 total)
];

export default WVCases;
```

---

## Files That Need Data

| File | Cases | Status |
|------|-------|--------|
| `f2lCases.ts` | ~50 (pairs 1-50) | ⚠️ Empty |
| `WVCases.ts` | 27 | ⚠️ Empty |
| `MWCases.ts` | 41 | ⚠️ Empty |
| `OLLCases.ts` | 57 | ⚠️ Missing file |
| `PLLCases.ts` | 21 | ⚠️ Missing file |

---

## Hook: useTrainer

```ts
function useTrainer(cases: AlgoCase[]): {
  currentCase: AlgoCase;
  nextCase: () => void;
  prevCase: () => void;
  stats: SessionStats;
  revealed: boolean;
  toggleReveal: () => void;
  revealAlgorithm: () => void;
  recognitionTime: number;  // ms since case appeared
}
```

**Behavior**:
- Shuffles input cases on mount
- Cycles through with next/prev
- Tracks stats in session state
- Measures time from case display to reveal
- Reset on unmount (or per session)

---

## Storage (localStorage)

Optional persistence keys:

```ts
interface StorageKeys {
  'algotrainer:profile': {
    username?: string;
    theme: 'dark' | 'light';
    language: 'es' | 'en';
  };
  'algotrainer:sessions:[subset]': SessionStats;
  'algotrainer:customLists': CustomList[];
}

interface CustomList {
  id: string;
  name: string;
  subset: string;
  caseIds: string[];  // subset of full dataset
}
```

---

## API Ready (Future Backend)

Once backend added, these endpoints would handle data:

```
GET  /api/algorithms/[subset]     → AlgoCase[]
GET  /api/algorithms/[subset]/[id] → AlgoCase
POST /api/sessions                 → SessionStats
GET  /api/sessions/me              → SessionStats[]
POST /api/custom-lists             → CustomList
GET  /api/custom-lists/me          → CustomList[]
```

---

## Data Sources for Population

| Set | Source | Count |
|-----|--------|-------|
| F2L | alg.cubing.net or standard references | ~50 |
| Winter Variation | alg.cubing.net (ZBF2L) | 27 |
| Magic Wonderful (MW) | alg.cubing.net / speedcubing guides | 41 |
| OLL | alg.cubing.net (standard 2-look) | 57 |
| PLL | alg.cubing.net (standard) | 21 |

**Recommended**: Grab from alg.cubing.net algdb.net or official speedcubing documentation. Copy scrambles + algorithms, add difficulty estimates.
