# To-Do / Workboard

Espacio de trabajo para organizar las tareas pendientes y lo que se va
alimentando. Está pensado para que **Elian** y Emerson coordinemos qué
se va a hacer, en qué orden y con qué criterios de aceptación.

## Cómo está organizado

```
docs/to-do/
├── README.md                  ← este índice
├── to-do-trainer/             ← todo lo que tiene que hacer el trainer
├── to-do-algoritmos/          ← todo lo que tiene que hacer la base de algoritmos
└── to-do-general/             ← todo lo demás (favoritos, deuda técnica, UI/UX, ideas)
```

Cada carpeta tiene:

- Un **README** con el índice priorizado de tareas (checkboxes).
- Un archivo `NN-*.md` **por tarea**, con:
  - **Contexto** → estado actual del código y dónde tocar.
  - **Qué hay que hacer** → checklist.
  - **Cómo / Diseño** → referencias (csTimer, WCA) y decisiones.
  - **Criterios de aceptación** → cómo saber que quedó bien.

## Reglas del proyecto (recordatorio)

- **npm nunca**: solo `pnpm`.
- **Los commits los hace el usuario**: cuando una tarea esté lista,
  el agente avisa "listo para commitear" y el usuario hace el commit.
- **Regla de espejos**: todo subset (WV, MW, OLL, PLL) tiene casos a la
  derecha y a la izquierda; los datos guardan el canónico diestro y la
  variante zurda se deriva con `mirrorAlgorithm()`.
- La documentación de `docs/*.md` tiende a desactualizarse; la fuente
  de verdad es la regla de dominio + el código.

## Cómo marcar una tarea

Cada tarea se marca en dos lugares:

1. En el README de su carpeta (`- [ ]` → `- [x]`).
2. En el propio archivo de la tarea (`Estado:`).

## Verificación de código

Comandos útiles para aceptar una tarea:

```bash
pnpm run lint
pnpm run build            # tsc -b + vite build
pnpm run verify-wv
pnpm run verify-interactive-solve
pnpm run validate-scrambles
pnpm run validate-clean-scrambles
```