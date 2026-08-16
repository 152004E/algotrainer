# 03 — Mejorar tipografía + animaciones de scroll

- **Prioridad:** Media
- **Estado:** pendiente

> Nota del ticket: *"mejorar el font y meterle animaciones y animaciones de
> scroll que son la moda de ahora"*.

## Contexto

- La app usa Tailwind v4 (sin CSS modules) y tipografía por defecto del navegador
  en la mayoría de las pantallas.
- No hay animaciones de entrada/scroll: todo aparece estático.
- Stack actual: React 19 + Tailwind v4 + Vite. No hay librería de animación instalada.

## Qué hay que hacer

- [ ] **Tipografía**:
      - Elegir una fuente/roman (variable, p. ej. Inter / Manrope / Outfit /
        Space Grotesk) con buenos pesos para títulos y cuerpo.
      - Fuente **monospace** para algorimos/scrambles (hoy usa `font-mono`
        por defecto del navegador) — ver `ScrambleBox.tsx`, `AlgorithmBox.tsx`,
        `FeedbackPanel.tsx`.
      - Jerarquía tipográfica clara (h1/h2/body) en Home, `/algorithms`, trainer.
- [ ] **Animaciones sutiles**:
      - Hover/transiciones ya existen en varios botones → uniformizarlas.
      - Estados de loading (scramble generando) con skeleton suave (ya hay
        `animate-pulse` en `ScrambleBox`/`CubeViewer`).
- [ ] **Animaciones de scroll** (lo "de moda"):
      - Reveal on scroll (fade-up / slide-in) para secciones de Home
        (`src/Components/Home/*`) y cards de `/algorithms`.
      - Elegir implementación ligera:
        - **Opción A**: Intersection Observer + clases Tailwind (0 deps).
        - **Opción B**: librería (framer-motion / motion). Decidir en
          implementación — echarle un ojo al tamaño de bundle.
- [ ] Respetar `prefers-reduced-motion` (usuario sensible a animación).

## Cómo / Diseño

- Config de Tailwind v4 para fuentes (`vite.config.ts` usa `@tailwindcss/vite`;
  se define en `src/index.css` o `@theme`).
- Cargar fuentes desde Google Fonts en `index.html` (o self-host).

## Criterios de aceptación

- [ ] La app se ve con una identidad tipográfica clara (no "default browser font").
- [ ] Las secciones se revelan con scroll de forma sutil y sin lag.
- [ ] `prefers-reduced-motion` respetado (sin animaciones forzadas).