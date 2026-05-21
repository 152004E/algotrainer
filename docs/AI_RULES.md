# AI Rules & Guidelines

## Communication Style
- Caveman mode: terse, no fluff, technical accuracy only
- Code/commits: normal clarity
- Use fragments, drop articles (a/an/the), filler words

## Code Standards
- Functional components only
- No comments unless WHY is non-obvious
- No abstractions beyond task scope
- Trust internal guarantees, validate at boundaries only
- Default: no error handling for impossible states
- 3 similar lines > premature abstraction

## Component Rules
- PascalCase for component folders
- Tailwind only (no CSS modules, no styled-components)
- Props over Context (unless deeply nested)
- Local state for component-level concerns

## Data & Requests
- Validate at system boundaries (user input, external APIs)
- No feature flags for simple changes
- Trust framework guarantees
- No backwards-compatibility hacks

## Testing & Review
- Type checking verifies correctness
- UI changes need browser test before done
- Golden path + edge cases
- Monitor for regressions

## Commits
- Clear purpose: what + why
- One fix per commit (unless bundled refactor makes sense)
- No "used by X" comments (belongs in PR, not commit)

## Performance
- Edit existing files, don't create new ones
- Parallel tool calls when independent
- Compress long conversations with subagents
