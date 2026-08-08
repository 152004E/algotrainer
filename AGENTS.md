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
