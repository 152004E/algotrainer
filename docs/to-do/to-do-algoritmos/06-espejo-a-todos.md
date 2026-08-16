# 06 — Espejo zurdo para todos los subsets

- **Prioridad:** Media
- **Estado:** pendiente

> Nota del ticket original: *"agregar el espejo a todos para poder hacerlo con
> dos manos, ya sea con la derecha o con la izquierda, y así poder consumirlo en
> el trainer"*.

## Contexto

Regla de dominio: todo subset (WV, MW, OLL, PLL) tiene casos a la derecha y a
la izquierda. Los datos guardan el canónico **diestro** y la variante **zurda**
se deriva con `mirrorAlgorithm()` (`src/utils/mirrorAlgorithm.ts`).

Hoy:

- `mirrorAlgorithm.ts` existe y tiene soporte de mapeo
  (`R ↔ L'`, `U ↔ U'`, `F ↔ F'`, `r ↔ l'`, `M ↔ M'`, etc.) y ya soporta
  segmentación (ver commit `91b5050`).
- OLL tiene **parejas ergonómicas** definidas (`ergonomicPairId`,
  `isCanonicalVariantSource`) resueltas por `resolveVariants.ts`.
- Los demás subsets (WV, MW, PLL, F2L, y los nuevos SV/COLL/BLE) **no** tienen
  parejas ni mangler.

Objetivo: poder practicar cualquier caso **con la mano derecha o con la
izquierda** desde el trainer.

## Qué hay que hacer

- [ ] Definir parejas ergonómicas para **todos** los subsets:
      - WV: los 27 rematiestros tienen su espejo.
      - MW, PLL, F2L, y nuevos SV/COLL/BLE.
- [ ] En datasets sin `alternatives`: marcar el canónico y derivar el espejo
      con `mirrorAlgorithm()` (sin guardar duplicados).
- [ ] Verificar que `mirrorAlgorithm()` cubre los movimientos usados por cada
      set (OLL/PLL usan face + a veces `M`/wide; COLL usa `r/l/x/y` →
      extender mapeo si hace falta).
- [ ] Script de consistencia (verde en la auditoría de csTimer):
      `mirrorAlgorithm(OLL 47) === OLL 48`, y análogos en cada subset.
- [ ] **Consumir en el trainer**: una opción "Mano: derecha / izquierda" por
      sesión que sirve las variantes zurdas on-the-fly (nunca duplicar datos).

## Cómo / Diseño

- El trainer recibe el caso diestro y, si la sesión es zurda, presenta
  `mirrorAlgorithm(case)` para scramble y verificación.
- `verifySolve`/`scrambleService` deben trabajar sobre la variante espejada.

## Criterios de aceptación

- [ ] Todo subset tiene pareja ergonómica consistente (script pasa).
- [ ] En el trainer puedo elegir mano derecha/izquierda y el cubo/scramble
      cambia correctamente.
- [ ] No hay duplicación de casos zurdos en los datos.