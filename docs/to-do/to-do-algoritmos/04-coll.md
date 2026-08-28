# 04 — COLL (Corners of the Last Layer)

- **Prioridad:** Media
- **Estado:** pendiente

## Contexto

La categoría **COLL** ya existe en el catálogo
(`src/data/algorithmCatalog.ts`, `slug: "coll"`, count: **42**) pero **no tiene
dataset**:

```ts
// src/pages/algorithms/AlgorithmCategory.tsx
const dataMap: Record<string, AlgoCase[]> = {
  ...
  coll: [],   // ← vacío
  zbll: [],
};
```

Resultado: `/algorithms/coll` muestra una página vacía ("Ningún algoritmo
coincide...") y COLL no está disponible en el trainer.

- COLL = orienta **y** permuta las esquinas en un solo algoritmo (aristas
  orientadas). Set completo: **42 casos** (24 sin contar espejos).
- No confundir con CLL (2x2): CLL resuelve esquinas + PLL en otro paso; COLL
  deja solo PLL de aristas (Ua/Ub/H/Z) o PLL skip.

## Qué hay que hacer

- [ ] Crear `src/data/COLLCases.ts` con **42 casos** (`id: "coll-01"…`).
- [ ] Clasificar por grupo (Sune / Anti-Sune / T / U / L / Pi / H) en
      `shapeGroup` para que funcionen los filtros del catálogo.
- [ ] Agregar filtros de COLL al catálogo (dificultad y/o grupo).
- [ ] Validar con script (scramble → caso, algoritmo → resultado COLL).
- [ ] Poblar `coll` en `dataMap` de `AlgorithmCategory.tsx`.
- [ ] Espejos zurdos al final (ver `06-espejo-a-todos.md`).

## Cómo / Diseño

- Fuentes: alg.cubing.net, algdb.net, J Perm COLL, speedcube.quest.
- Muchos algs COLL usan `r`/`l`/`M`/`x`/`y` (wide/slice/rotaciones) → revisar
  cómo los maneja `mirrorAlgorithm.ts` y `scrambleService.ts` (hoy limitado a
  face moves). Puede requerir ampliar la simplificación / manejo de wide.

## Criterios de aceptación

- [ ] 42 casos COLL válidos; la página `/algorithms/coll` ya no está vacía.
- [ ] Filtros por grupo funcionan.
- [ ] COLL disponible para entrenar en el trainer.