# Package Manager Rules

This repository uses pnpm exclusively.

Always use:

- `pnpm install`
- `pnpm add`
- `pnpm remove`
- `pnpm run`

Never use:

- `npm`
- `yarn`

Important:

- Do not create `package-lock.json`
- Do not suggest npm commands
- Respect the existing `pnpm-lock.yaml`

# Commits

- **Solo el usuario hace commits.** El agente nunca debe ejecutar `git commit`,
  `git add`, `git push` ni crear PRs sin que el usuario lo pida explícitamente.
- Cuando el trabajo esté listo, el agente debe decir "listo para commitear" y
  dejar que el usuario haga el commit.

# Mirror Pairs — Regla de Dominio (NO re-explicar en cada chat)

- **Todo subset** (WV, MW, OLL, PLL) tiene **casos a la derecha** y **casos a la izquierda**.
  El software siempre funciona así. Los datos guardan el caso canónico (diestro); la variante
  zurda se deriva con `mirrorAlgorithm()` (`src/utils/mirrorAlgorithm.ts`).
- **WV**: los 27 casos actuales son los **diestros** (slot FR). Sus variantes zurdas son el mirror
  del mismo caso, no casos nuevos del dataset.
- **MW** (Magic Wonderful): es lo siguiente después de WV — **todo es con mirror**.
- La documentación de datos (docs/*.md) tiende a desactualizarse; la fuente de verdad es esta
  regla + el código.
