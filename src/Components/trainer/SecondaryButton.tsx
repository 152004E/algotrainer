import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function SecondaryButton({ className = "", ...rest }: Props) {
  return (
    <button
      type="button"
      className={`px-4 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors ${className}`}
      {...rest}
    />
  );
}