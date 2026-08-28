export type TrainerMode = "passive" | "virtual";

interface Props {
  mode: TrainerMode;
  onModeChange: (m: TrainerMode) => void;
}

export default function TrainerModeToggle({
  mode,
  onModeChange,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
        <button
          type="button"
          onClick={() => onModeChange("passive")}
          className={
            "px-4 py-2 rounded-lg text-sm font-semibold transition-colors " +
            (mode === "passive"
              ? "bg-primary text-white shadow"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200")
          }
        >
          Reconocimiento
        </button>
        <button
          type="button"
          onClick={() => onModeChange("virtual")}
          className={
            "px-4 py-2 rounded-lg text-sm font-semibold transition-colors " +
            (mode === "virtual"
              ? "bg-primary text-white shadow"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200")
          }
        >
          Resolución
        </button>
      </div>
    </div>
  );
}
