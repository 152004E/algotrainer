import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  shortcut?: string;
}

export default function PrimaryButton({
  children,
  shortcut,
  className = "",
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`group flex items-center justify-center gap-2 h-14 px-8 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0 ${className}`}
      {...rest}
    >
      {children}
      {shortcut && (
        <kbd className="px-2 py-0.5 bg-white/20 rounded font-mono text-sm">
          {shortcut}
        </kbd>
      )}
    </button>
  );
}