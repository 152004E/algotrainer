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
- `useEffect` sobre `selectedAlg` → genera scramble si `id.startsWith("oll-")` (todos los 57 OLLs)
- `handleNewScramble` genera nuevo scramble sobre el mismo caso
- Pasa `dynamicScramble` + `onNewScramble` al modal

### `AlgorithmModal.tsx`

- Props: `dynamicScramble?`, `onNewScramble?`
- `setupAlg = dynamicScramble ?? invert(alg.algorithm)` (fallback)
- Botón "🔄 Nuevo Scramble" solo visible si `onNewScramble` está definido
- Disponible para los 57 OLLs

---

## OLL PLL Variation

A partir de la estrategia validada en OLL 33 y OLL 45, se extendió la variación PLL a los 57 casos OLL.

### Estrategia

```
target = solved.applyAlg(pllAleatorio).applyAlg(invert(OLL))
```

Donde `pllAleatorio` es uno de los 22 PLLs definidos (skip + 21 PLLs estándar).

### Implementación

En `scrambleService.ts`, un único bloque genérico `if (c.id.startsWith("oll-"))`:

1. Selecciona un PLL aleatorio uniforme entre los 22
2. Construye el target: `solved.applyAlg(pll).applyAlg(invert(OLL))`
3. Aplica center correction si es necesario
4. El resto del flujo (perturbación, solver, simplificación, rejection guard) es idéntico

### Restricciones

- **Sin AUF** — no se añaden movimientos U al final
- **Sin rotaciones** — no se usan `x y z`
- **Sin M/E/S** — los PLLs usan solo `U D R L F B`
- **Sin wide moves** — los PLLs usan solo moves de cara simple
- **Máximo 20 movimientos** — si el scramble generado excede 20, se regenera
- **Scrambles limpios** — validados contra `^[UDFRLBy'2 ]+$`

### Casos cubiertos

| Grupo | OLLs | Estado |
|-------|------|--------|
| Knight shapes | 13, 14, 15, 16 | ✓ |
| T shapes | 33, 45 | ✓ |
| C shapes | 34, 46 | ✓ |
| Big Lightning | 39, 40 | ✓ |
| I shapes | 51, 52, 55, 56 | ✓ |
| Resto (dots, L, line, P, W, fish, square, Sune, etc.) | 1-12, 17-32, 35-38, 41-44, 47-50, 53-54, 57 | ✓ |

### AlgorithmCategory (New Scramble)

En `AlgorithmCategory.tsx`, la condición para activar el botón "Nuevo Scramble" se simplificó a:

```typescript
selectedAlg?.id.startsWith("oll-")
```

Esto habilita la generación dinámica de scrambles y el botón "New Scramble" para los 57 OLLs.

---

## Validation

### Pre-existing scripts

| Script | Propósito |
|--------|-----------|
| `scripts/validateCleanScrambles.ts` | OLL 33 — 500 scrambles: orientation, clean, redundancy, length |
| `scripts/validateCleanScramblesOLL34.ts` | OLL 34 — 500 scrambles (mismos checks) |
| `scripts/validateCleanScramblesOLL46.ts` | OLL 46 — 500 scrambles |
| `scripts/validateCleanScramblesOLL51.ts` | OLL 51 — 500 scrambles |
| `scripts/validateCleanScramblesOLL52.ts` | OLL 52 — 500 scrambles |
| `scripts/validateCleanScramblesOLL55.ts` | OLL 55 — 500 scrambles |
| `scripts/validateCleanScramblesOLL56.ts` | OLL 56 — 500 scrambles |
| `scripts/validateScrambleDiversity.ts` | OLL 33 — uniqueness, suffix diversity |
| `scripts/validateScrambleGeneration.ts` | General — 5 subsets, 20 iteraciones c/u |

### Verificación de PLLs

Para cada OLL con variación PLL, se verificó que los 22 PLLs producen:
- Parse correcto (cubing.js `new Alg`)
- Moves legales (solo `U D R L F B` + `'` `2`)
- Orientación OLL correcta después de aplicar `pll + invert(OLL)`
- Estado PLL distinto después de aplicar el algoritmo OLL

### Fase de validación (500 scrambles × 6 casos)

| OLL | Orient correct | Redundant pairs | Over 20 | Failures | Distinct PLLs | Avg len |
|-----|---------------|----------------|---------|----------|---------------|---------|
| 13  | 500/500 | 0 | 0 | 0 | 21/22 | 18.8 |
| 14  | 500/500 | 0 | 0 | 0 | 21/22 | 18.7 |
| 15  | 500/500 | 0 | 0 | 0 | 21/22 | 18.9 |
| 16  | 500/500 | 0 | 0 | 0 | 21/22 | 18.8 |
| 39  | 500/500 | 0 | 0 | 0 | 21/22 | 18.6 |
| 40  | 500/500 | 0 | 0 | 0 | 21/22 | 18.7 |
| **33** (ref) | 500/500 | 0 | 0 | 0 | 21/22 | 18.5 |
| **34** (ref) | 500/500 | 0 | 0 | 0 | 21/22 | 18.5 |
| **46** (ref) | 500/500 | 0 | 0 | 0 | 21/22 | 18.5 |
| **51** (ref) | 500/500 | 0 | 0 | 0 | 21/22 | 18.5 |

Resultado: **57/57 OLLs funcionando con variación PLL, 0 regresiones.**

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
| PLL variation: `target = solved.applyAlg(pll).applyAlg(invert(OLL))` | Genera scrambles que preservan la orientación OLL pero terminan en PLLs variados |
| Sin AUF en PLL variation | Mantener consistencia con el flujo normal; el PLL resultante debe ser reconocible sin ajuste U |
| Un solo bloque genérico `if (c.id.startsWith("oll-"))` | Reemplaza 7 bloques duplicados; misma lógica, menos código |
| 22 PLLs (skip + 21 estándar) | Cubre todos los casos PLL posibles; skip permite que ocasionalmente el OLL resuelva el cubo |
