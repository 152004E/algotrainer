# Contributing Guide

## Getting Started

1. **Read the docs** in order:
   - `ARCHITECTURE.md` — project structure & routes
   - `DATA_STRUCTURE.md` — types & data shape
   - `PLAN.md` or `ROADMAP.md` — what needs doing
   - `CLAUDE.md` — AI context rules
   - `AI_RULES.md` — code style & patterns

2. **Install & run**:
   ```bash
   npm install
   npm run dev
   # Opens http://localhost:5173
   ```

3. **Check the plan**
   - Pick a task from `PLAN.md` Priority sections
   - Start with Priority 1 (bugs)

---

## Code Style

### General Rules
- Functional components only
- Tailwind utility classes (no CSS modules)
- No comments unless WHY is non-obvious
- Props over Context (keep it simple)
- One feature per commit

### Naming
- Components: PascalCase, in folders matching name
  ```
  Components/
    ├── Home/
    │   └── AlgorithmCard.tsx
    └── trainer/
        └── TrainerSidebar.tsx
  ```
- Constants: SCREAMING_SNAKE_CASE
- Variables/functions: camelCase
- Types/interfaces: PascalCase, prefix with `I` only if truly necessary

### Imports
- React imports from 'react'
- Router from 'react-router-dom'
- Icons from '@fortawesome/free-solid-svg-icons'
- Data from '../data/...'

### File Organization
```tsx
// 1. Imports (external, then local)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../GlobalComponents/Button';

// 2. Types/Interfaces
interface Props {
  value: string;
  onChange: (v: string) => void;
}

// 3. Component
export default function MyComponent({ value, onChange }: Props) {
  // logic
  return (...)
}
```

---

## Testing Before Commit

### UI Components
- [ ] Renders without errors
- [ ] Props update correctly
- [ ] Dark mode works
- [ ] Responsive (mobile/tablet/desktop)
- [ ] No unused imports

### Logic (Hooks, Utilities)
- [ ] TypeScript compiles (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Expected outputs for sample inputs

### Pages
- [ ] Route loads correctly
- [ ] Layout renders (no overlapping, proper spacing)
- [ ] Links navigate properly
- [ ] No broken images/icons

---

## Commit Message Format

Keep it clear and purposeful:

```
Fix WV trainer route mapping in App.tsx

Currently /trainer/wv incorrectly routes to MWTrainer.
Changed import to use WVTrainer instead.

Related: PLAN.md Priority 1
```

Or shorter for obvious fixes:
```
Add OLLCases dataset with 57 cases
```

**Don't include**:
- "used by X feature"
- Commit numbers or PR references
- "implements task #123"

These belong in the PR description, not the commit.

---

## Common Tasks

### Add a New Trainer Page
1. Create `pages/trainer/NewTrainer.tsx`
2. Import trainer data from `data/NewCases.ts`
3. Add route in `App.tsx`
4. Import on trainer home page or modal
5. Test route loads

### Populate Algorithm Data
1. Open `data/SetCases.ts`
2. Add `AlgoCase` objects to array
3. Ensure: id (unique), name, scramble, algorithm fields
4. Test: trainer page loads 5+ cases from dataset

### Implement a Hook
1. Create in `src/hooks/` (e.g., `useTrainer.ts`)
2. Export from `src/hooks/index.ts`
3. Add TypeScript types at top of file
4. Document expected behavior with JSDoc
5. Test in a page component

### Modify a Global Component
1. Edit `Components/GlobalComponents/[Component].tsx`
2. Check: both light & dark themes
3. Check: mobile responsive
4. Test in both MainLayout and TrainerLayout

---

## PR Checklist

Before submitting PR:

- [ ] Fixes issue in `PLAN.md` (reference it)
- [ ] Code follows style guide above
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds (no TS errors)
- [ ] Tested in browser (golden path + edge cases)
- [ ] No console errors/warnings
- [ ] Dark mode works (if UI)
- [ ] Mobile responsive (if UI)
- [ ] Commit messages are clear
- [ ] No dead code or console.log() left

---

## Asking for Help

- **Architecture questions?** → Read `ARCHITECTURE.md` & `DATA_STRUCTURE.md`
- **What to work on?** → Check `PLAN.md` (Priority 1 first)
- **How do I...?** → Check examples in similar components
- **Type help?** → Look at existing interfaces in `DATA_STRUCTURE.md`
- **Stuck?** → Check recent commits (`git log`) for similar work

---

## File Ownership

- **Routes/Config**: `App.tsx`, `vite.config.ts`
- **Global UI**: `Components/GlobalComponents/`
- **Home Page**: `Components/Home/`, `pages/Home.tsx`
- **Trainer Pages**: `pages/trainer/`, `Components/trainer/`
- **Data**: `src/data/`
- **Docs**: `docs/` (keep in sync with code changes)

---

## Updating Docs

- Code changes? Update `ARCHITECTURE.md` route map
- New data shape? Update `DATA_STRUCTURE.md`
- Finished a task? Mark it done in `PLAN.md`
- Major feature? Add to `ROADMAP.md`

Keep docs accurate. Out-of-date docs hurt future contributors.
