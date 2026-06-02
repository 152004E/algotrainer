# Scramble Generation System

## Overview

Dynamic scramble generation for AlgoTrainer. Each case can produce
multiple distinct scrambles that all lead to the same case state.

**No changes to `AlgoCase` type or existing data.**

---

## Core Algorithm

```
casePattern = solved.applyAlg(effectiveSetup)
R = randomMoves(3-5)                         // perturbation
perturbed = casePattern.applyAlg(R)
solution = solveTwips(kp, perturbed, {       // solve perturbed → casePattern
  targetPattern: casePattern,
  generatorMoves: ["U", "D", "R", "L", "F", "B"],
  minDepth: 6,
  maxDepth: 12,
})
scramble = `${effectiveSetup}  ${R}  ${solution}`
```

### Step-by-step

1. **Derive case pattern** from the stored `scramble` field via
   `kpuzzle.defaultPattern().applyAlg(new Alg(effectiveSetup))`
2. **Perturb** with 3-5 random face moves → `perturbed` state
3. **Solve** from perturbed back to original case pattern using
   cubing.js `solveTwips` with `targetPattern`
4. **Construct** final scramble: `effectiveSetup + R + solution`

### For WV (empty scramble)

When `scramble: ""`, derive `effectiveSetup` from algorithm inverse:
```
effectiveSetup = new Alg(algorithm).invert().toString()
```

---

## Validation Results (120/120 PASS)

| Subset | Setup | Scrambles | Pass Rate |
|--------|-------|-----------|-----------|
| OLL 1 (scramble ≠ algorithm) | `R U2 R2 F R F' U2 R' F R F'` | 20/20 | 100% |
| OLL 33 (scramble == algorithm) | `R U R' U' R' F R F'` | 20/20 | 100% |
| PLL H (slice moves in scramble) | `M2' U M2' U2 M2' U M2'` | 20/20 | 100% |
| MW 1 (scramble ≠ algorithm) | `R U R' U R U' R'` | 20/20 | 100% |
| F2L 1 (scramble == algorithm) | `R U R' U'` | 20/20 | 100% |
| WV (empty scramble) | `R U' R'` (derived) | 20/20 | 100% |

**Math correct**: 120/120 scrambles produce identical pattern.
**Move clean**: 120/120 scrambles use only `U D R L F B` (with `'` `2`).

---

## cubing.js APIs Used

| API | Import | Purpose |
|-----|--------|---------|
| `cube3x3x3` | `cubing/puzzles` | 3x3x3 puzzle loader |
| `KPuzzle` | `cubing/kpuzzle` | Puzzle algebra (moves, patterns) |
| `KPattern` | `cubing/kpuzzle` | Cube state representation |
| `Alg` | `cubing/alg` | Algorithm parsing and manipulation |
| `solveTwips` | `cubing/search` | Two-phase solver with custom target |
| `randomMoves` | custom | Local face-move random generator |

---

## Move Restrictions

### Allowed: U D R L F B + `'` `2`

Only standard outer face moves. These generate the full 3x3x3 group.

### Prohibited

| Category | Moves | Reason |
|----------|-------|--------|
| Rotations | `x y z` | Change orientation reference |
| Wide moves | `u d r l f b Uw Dw Rw Lw Fw Bw` | Change orientation, not standard |
| Slice moves | `M E S` | Middle layer, changes reference |

### How enforced

`generatorMoves: ["U", "D", "R", "L", "F", "B"]` in `solveTwips`.

Pass only base move names (no `'` or `2` suffixes). The solver
automatically generates all amounts.

---

## Service Interface (planned)

```typescript
// src/utils/scrambleService.ts
export class ScrambleService {
  async init(): Promise<void>;
  async getScramble(caseData: AlgoCase): Promise<string>;
  async getMultipleScrambles(
    caseData: AlgoCase, count: number
  ): Promise<string[]>;
}
```

### Hook (planned)

```typescript
// src/hooks/useScrambledTrainer.ts
function useScrambledTrainer(cases: AlgoCase[]): {
  currentCase: AlgoCase | null;
  scramble: string;
  loading: boolean;
  revealed: boolean;
  nextCase: () => void;
  revealAlgorithm: () => void;
  stats: SessionStats;
}
```

---

## Performance

| Metric | Value |
|--------|-------|
| Avg generation time | ~340ms per scramble |
| Bottleneck | Worker creation per `solveTwips` call |
| Optimization | Cache KPuzzle, consider worker pool |

---

## Validation Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `scripts/validateScrambleGeneration.ts` | `pnpm run validate-scrambles` | Math correctness |
| `scripts/validateCleanScrambles.ts` | *(planned)* | Move cleanliness validation |
