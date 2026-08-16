# 03 — Summer Variation (SV)

- **Prioridad:** Media
- **Estado:** pendiente

## Contexto

**Summer Variation (SV)** es el complemento de Winter Variation (WV):

- En WV el par F2L está **conectado** y se inserta mientras se orientan las
  esquinas de la LL.
- En SV el par está **separado** (y se inserta con `R U R'`) orientando también
  las esquinas de la LL.
- Set de **27 casos** (sin contar espejos; 54 con espejos).
- Es un set de "last slot": útil como complemento de WV y para ZZ/Petrus
  (mantiene aristas orientadas).

## Qué hay que hacer

- [ ] Crear `src/data/SVCases.ts` (27 casos canónicos diestros, `id: "sv-01"…`).
- [ ] Usar la misma regla que WV: `scramble: ""` y derivar del
      `invert(algorithm)` en runtime (confirmar con verificación).
- [ ] Agregar la categoría `slug: "sv"` al catálogo (`algorithmCatalog.ts`)
      con icono y filtros.
- [ ] Registrar en `dataMap` de `src/pages/algorithms/AlgorithmCategory.tsx`.
- [ ] Script de validación (estilo `verifyWVCases.ts`): scramble genera el caso,
      algoritmo resuelve, EO ✓.
- [ ] Verificar que no colisione con el set de WV (mismo engine de
      `scrambleService`).
- [ ] Espejos zurdos al final (ver `06-espejo-a-todos.md`).

## Cómo / Diseño

- Fuentes recomendadas: speedsolving wiki (Summer Variation), alg.cubing.net,
  Chèster Lian (proponente 2009).
- Ojo con la identificación: los casos WV/SV se distinguen por la **posición del
  par** — documentar bien en `description`/`recognition` de cada caso.

## Criterios de aceptación

- [ ] 27 casos SV válidos y verificados (scramble → caso, algoritmo → resolución).
- [ ] Categoría visible en `/algorithms` y consumible en el trainer.
- [ ] Casos canónicos; espejos derivados con `mirrorAlgorithm()`.