# Scramble Generation System

## Reglas fijas (no negociables)

1. **Only face moves**: `U D R L F B` + `'` `2` únicamente
   - Prohibido: rotaciones (`x y z`), wide moves (`u d r l f b`, `Uw`, `Rw`, etc.), slice moves (`M E S`)
   - Validado: 564/564 clean

2. **No dmove suffix**: nunca se añade D/D'/D2 al final
   - Causa desalineación visual del cubo
   - La diversidad viene de la perturbación (pert), no de rotar la capa D

3. **`getEffectiveSetup` siempre usa `invert(algorithm)`**, nunca `c.scramble`
   - Bug conocido: en OLL 33, `scramble === algorithm` (ambos son `R U R' U' R' F R F'`)
   - `invert(algorithm)` es la única fuente de verdad del setup

4. **Frente = Verde, Arriba = Blanco** (orientación WCA estándar)
   - Centers standard: `U=0 L=1 F=2 R=3 B=4 D=5`

5. **Full simplification via `simplifyMoves`** — elimina cualquier par consecutivo en la misma cara, con cascadeo automático

6. **AlgoCase type no se modifica** — cero migración de datos existentes

---

## Core Algorithm: Kociemba Composition

```
target = solved.applyAlg(getEffectiveSetup(c))
R = randomMoves(3-5)                          // perturbación
perturbed = target.applyAlg(R)
solution = solveMin2Phase(perturbed, solved)  // Kociemba: perturbed → solved
solvedToPerturbed = invert(solution)          // solved → perturbed
pertInverted = invert(R)                      // deshace perturbación

scramble = solvedToPerturbed + pertInverted    // concatenación
```

Notar que `solution ≈ invert(R) + solveMin2Phase(target)`, por tanto `solvedToPerturbed ≈ solvedToTarget + R` y la concatenación resultante es `solvedToTarget + R + invert(R)`. Sin simplificación, `R + invert(R)` sería identidad (mata diversidad). Usamos `simplifyMoves` que hace simplificación full con cascadeo, combinando/cancelando cualquier par consecutivo en la misma cara.

### Center correction

Cuando el target tiene centros no estándar (rotación y/y'/y2), se aplica correction:
```
correctedTarget = rawTarget.applyAlg(correction)   // raw → corrected
scramble = solvedToPerturbed + pertInverted + invert(correction)
```

Casos afectados: 16 casos F2L que tienen `y` o `y'` en centers.

### Full simplification via `simplifyMoves`

```typescript
function simplifyMoves(algStr: string): string
```

- Recorre todos los moves con un algoritmo tipo stack
- Cuando encuentra dos moves consecutivos con la misma cara base, los combina con `combineMoves`
- El cascadeo es natural: el resultado combinado se vuelve a apilar y se compara con el siguiente
- Garantiza 0 pares consecutivos en la misma cara en el scramble final

### Rejection guard

Si el scramble colapsa al base setup (muy improbable con boundary-only), regenera:

```typescript
if (scramble === normalize(getEffectiveSetup(c))) {
  return this.generateScramble(c);  // retry
}
```

---

## Perturbación (`randomMoves`)

- 3-5 movimientos aleatorios (cara + modificador)
- Caras consecutivas nunca se repiten
- Usa `U D R L F B` con modificadores `''` `'` `2`
- `randomMoves` → `pert` → `pertAlg` → `invert(pertAlg)` = `pertInverted`

---

## Componentes involucrados

### `scrambleService.ts` (singleton)

```typescript
class ScrambleService {
  async generateScramble(c: AlgoCase): Promise<string>
  async prewarm(cases: AlgoCase[]): Promise<void>
}
```

- Cachea `KPuzzle` y `target` por case
- `generateScramble` ejecuta Kociemba + simplificación boundary-only

### `AlgorithmCategory.tsx`

- Estado `dynamicScramble` (string | undefined)
- `useEffect` sobre `selectedAlg` → genera scramble si `id === "oll-33"`
- `handleNewScramble` genera nuevo scramble sobre el mismo caso
- Pasa `dynamicScramble` + `onNewScramble` al modal

### `AlgorithmModal.tsx`

- Props: `dynamicScramble?`, `onNewScramble?`
- `setupAlg = dynamicScramble ?? invert(alg.algorithm)` (fallback)
- Botón "🔄 Nuevo Scramble" solo visible si `onNewScramble` está definido
- Actualmente limitado a OLL 33 (controlled test)

---

## Validation

### `scripts/validateCleanScrambles.ts`

- OLL 33 (30 scrambles) — caso de prueba controlado
- Checks: U-layer correct, face-only moves, 0 redundant pairs
- Expect: 100% pattern, 100% clean, 0 redundant pairs

### `scripts/validateScrambleDiversity.ts`

- 100 scrambles OLL 33
- Checks: U-layer, unique strings, suffix diversity, D-equivalence, redundancy
- Expect: 100% unique, 0 D-equivalent, 0 redundant pairs

---

## Redundant pairs

Con `simplifyMoves` se garantizan 0 pares redundantes (consecutivos en la misma cara) en el scramble final. Cualquier `F2 F2`, `U U'`, `R R2`, etc. se combina o elimina automáticamente.

---

## Historial de decisiones

| Decisión | Motivo |
|----------|--------|
| Kociemba composition en vez de `solveTwips` | Solver óptimo determinístico, más rápido |
| `invert(algorithm)` siempre | Bug en datos OLL con `scramble === algorithm` |
| No dmove | Desalineación visual del cubo |
| Full simplification (`simplifyMoves`) | Elimina todo par consecutivo en misma cara; cascadeo natural vía stack. La diversidad se mantiene porque el solver Kociemba produce caminos distintos |
| Perturbación de 3-5 movimientos | Suficiente diversidad sin alargar demasiado el scramble |
