import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function SpaceHint({ children }: Props) {
  return (
    <span className="text-center text-xs text-slate-500 dark:text-slate-400">
      <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-xs border border-slate-300 dark:border-slate-700">
        Space
      </kbd>{" "}
      {children}
    </span>
  );
}