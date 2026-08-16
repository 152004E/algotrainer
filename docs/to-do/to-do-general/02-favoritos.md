# 02 — Favoritos (casos en aprendizaje) + sesiones multi-categoría

- **Prioridad:** Alta
- **Estado:** pendiente

> Nota del ticket: *"agregar a general un espacio para favoritos — son lo que me
> estoy aprendiendo — y poder usarlos en una sesión para practicar esos. Acá se
> pueden combinar categorías: puedo hacer OLL + WV + PLL y eso se pone en una
> sola sesión para tenerlos ahí y practicar."*

## Contexto

El usuario quiere:

1. Un espacio de **favoritos**: los casos que está **aprendiendo**
   (su "worklist" personal de casos).
2. Poder armar una **sesión mixta** combinando **casos de distintas
   categorías** (ej. `oll-27` + `wv-05` + `pll-12` en una sola sesión) para
   practicarlos juntos.

Esto engancha directo con:

- `to-do-trainer/07-sesiones.md` — sesiones que aceptan listas arbitrarias.
- `to-do-trainer/02-consumir-algoritmos.md` — el trainer con una fuente única de casos.

## Qué hay que hacer

- [ ] **Espacio de favoritos** (UI + gestión):
      - Marcar/desmarcar un caso como favorito (desde la ruta `/algorithms` y/o
        desde el trainer, botón "★").
      - Vista "Mis favoritos" (listado agrupado por categoría).
- [ ] **Armar sesiones mixtas desde favoritos**:
      - "Nueva sesión → a partir de favoritos" (selección de casos por categoría).
      - Ejemplo concreto: sesión "OLL+WV+PLL" que practique justo esos casos.
- [ ] Persistencia: favoritos en localStorage y en el **CSV** de export/import
      (Tarea 5 de trainer) para poder respaldarlos/migrarlos.
- [ ] El trainer acepta `AlgoCase[]` arbitrario (no solo un subset entero).

## Cómo / Diseño — decisión abierta

Dos formas posibles de guardar "favorito" (decidir en implementación):

- **Opción A**: flag en `AlgoCase` (`favorite?: boolean`) — simple, pero mezcla
  "el dato" con "mi progreso personal".
- **Opción B**: lista separada de `caseIds` favoritos (por perfil/sesión) en el
  CSV/localStorage — más limpio, permite reordenar y añadir notas.

Recomendación inicial: **Opción B** (los datos del catálogo quedan puros y los
favoritos son del usuario).

## Criterios de aceptación

- [ ] Marco casos de OLL/WV/PLL como favoritos.
- [ ] Creo una sesión mixta con esos favoritos y la practico.
- [ ] Los favoritos sobreviven a recargar y se exportan/importan por CSV.