# Data Structures & Formats

## Core Types

### AlgoCase
Represents a single algorithm case.

```ts
interface AlgoCase {
  id: string;                    // Unique ID: "wv-01", "oll-27", etc.
  name: string;                  // Display name: "WV 1", "OLL 27 (Dot)", etc.
  subset: "WV" | "MW" | "OLL" | "PLL" | "F2L";
  difficulty: "Easy" | "Medium" | "Hard";
  scramble: string;              // Cube scramble notation: "R U R' U'"
  algorithm: string;             // Solution: "(R U R' U') (R' F R2 U')"
  description?: string;          // Optional pattern name: "L-shape"
  imageUrl?: string;             // Optional diagram URL (legacy)
  edgeGroup?: string;            // Edge orientation group for OLL/PLL
  shapeGroup?: string;           // Visual shape category
  alternatives?: string[];       // Alternative algorithm variants
  recognition?: string;          // Recognition tips
  fingertricks?: string;         // Finger trick notation
  corners?: number;              // Number of oriented corners
  shape?: string;                // Shape ID for filtering
  aliases?: string[];            // Alternative names
  usedIn?: string;               // Method/subset this appears in
  optimalMoves?: string;         // Optimal move count (HTM)
  notes?: string;                // Additional notes
  ergonomicPairId?: string;      // ID of the left/right mirror pair
  isCanonicalVariantSource?: boolean;  // Source of mirrored variants
}
```

---

### Parejas Ergonómicas (Ergonomic Pairs)

Many OLL cases are left/right mirror images of each other. Two cases linked by `ergonomicPairId` form an **ergonomic pair** — learning one lets you derive the other by mirroring.

**Rules**:
- The pair is bidirectional: OLL 47 has `ergonomicPairId: "oll-48"`, OLL 48 has `ergonomicPairId: "oll-47"`.
- One case is designated **canonical variant source** (`isCanonicalVariantSource: true`). Its `alternatives[]` list is the master list.
- When resolving alternatives for the paired case (which lacks its own `alternatives[]`), the canonical source's alternatives are **mirror-transformed** via `mirrorAlgorithm()`.

**Resolution logic** (`src/utils/resolveVariants.ts`):

```
resolveAlternatives(case, allCases):
  1. If case has alternatives[] → use directly
  2. If case has ergonomicPairId → find pair, if pair is canonical source → mirror its alternatives
  3. Otherwise → empty
```

**Mirror mapping** (`src/utils/mirrorAlgorithm.ts`):
`R ↔ L'`, `U ↔ U'`, `F ↔ F'`, `r ↔ l'`, `M ↔ M'`, etc.

**Current pairs in OLL:**

| Caso A | Caso B | Shape Group |
|--------|--------|-------------|
| OLL 3 | OLL 4 | Dot (1 corner) |
| OLL 13 | OLL 14 | Knight |
| OLL 15 | OLL 16 | Knight |
| OLL 26 | OLL 27 | Anti-Sune / Sune |
| OLL 29 | OLL 30 | Awkward |
| OLL 31 | OLL 32 | P Shapes |
| OLL 36 | OLL 38 | W Shapes |
| OLL 41 | OLL 42 | Awkward |
| OLL 43 | OLL 44 | P Shapes |
| OLL 47 | OLL 48 | L Shapes |

---

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
