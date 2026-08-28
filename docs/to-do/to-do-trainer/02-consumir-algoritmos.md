# 02 — El trainer tiene que consumir los algoritmos de la ruta `/algorithms`

- **Prioridad:** Alta
- **Estado:** pendiente

## Contexto

Hoy la app tiene **dos fuentes** para decidir qué casos existen:

1. La ruta `/algorithms/:slug` usa `dataMap` (`src/pages/algorithms/AlgorithmCategory.tsx`)
   que mapea slug → dataset:
   ```ts
   const dataMap: Record<string, AlgoCase[]> = {
     f2l: f2lCases, oll: OLLCases, pll: PLLCases, wv: WVCases, mw: MWCases,
     coll: [],   // ← sin dataset todavía
     zbll: [],   // ← sin dataset todavía
   };
   ```
2. El trainer usa **imports directos** por página y pestañas hardcodeadas
   (`src/Components/trainer/TrainerTabs.tsx`):
   ```ts
   const tabs = [F2L, OLL, PLL, WV, MW];
   ```

Consecuencias:

- Si se agrega un subset nuevo al catálogo (COLL, SV, BLE…), el entrenador no lo
  ve hasta tocar `TrainerTabs.tsx` a mano.
- Los counts del catálogo están desincronizados con los datasets:
  - F2L: catálogo `41` vs dataset `42`.
  - MW: catálogo `32` vs dataset `41`.
- `coll` y `zbll` ya figuran como categorías en `/algorithms` pero muestran
  **página vacía** (sin dataset).

## Qué hay que hacer

- [ ] Crear una **fuente única de casos** consumible por el trainer y por
      `/algorithms` (arrancar del patrón `dataMap`).
- [ ] Hacer que las pestañas/selector del trainer se generen a partir del
      catálogo (`algorithmCategories`) y **no** hardcodeadas.
- [ ] Sincronizar `count` del catálogo con el largo real de cada dataset
      (mejor: calcularlo en vez de hardcodear).
- [ ] Que todo subset del catálogo tenga su dataset (o quede marcado como
      "próximamente" en vez de mostrar página vacía).
- [ ] Mantener un solo `AlgoCase[]` por subset (nada de copias).

## Cómo / Diseño

- Propuesta mínima: extraer `dataMap` a `src/data/caseRegistry.ts` (o similar)
  y que tanto `AlgorithmCategory.tsx` como el trainer lo importen.
- El trainer debería poder recibir una lista de casos **por slug** (o una lista
  arbitraria) para alimentar los modos y las sesiones.
- Idioma de los IDs sigue la convención: `wv-01`, `oll-27`, `sv-12`, `coll-33`…

## Criterios de aceptación

- [ ] Agregar un subset nuevo al catálogo hace que aparezca en el trainer sin
      tocar código de tabs.
- [ ] `/algorithms` y el trainer muestran exactamente los mismos casos.
- [ ] Counts del catálogo reflejan los datasets reales.