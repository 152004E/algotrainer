import { ThemeToggleButton } from "../GlobalComponents/ThemeToggleButton";

export default function TrainerToolsSidebar() {
  return (
    <aside className="w-16 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-background-dark flex flex-col items-center py-8 gap-6">
      <button
        className="size-10 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary transition-all flex items-center justify-center"
        title="Tutorial"
      >
        <span className="material-symbols-outlined">help</span>
      </button>

      <button
        className="size-10 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary transition-all flex items-center justify-center"
        title="Keyboard Shortcuts"
      >
        <span className="material-symbols-outlined">keyboard</span>
      </button>

      <button
        className="size-10 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary transition-all flex items-center justify-center"
        title="Share Algorithm"
      >
        <span className="material-symbols-outlined">share</span>
      </button>

      <div className="mt-auto">
        <ThemeToggleButton />
      </div>
    </aside>
  );
}