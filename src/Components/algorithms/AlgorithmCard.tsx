import type { AlgoCase } from "../../types";

interface Props {
  alg: AlgoCase;
  onClick: (alg: AlgoCase) => void;
}

const difficultyStyles: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Hard: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

const difficultyLabels: Record<string, string> = {
  Easy: "Fácil",
  Medium: "Medio",
  Hard: "Difícil",
};

const AlgorithmCard = ({ alg, onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={() => onClick(alg)}
      className="group relative text-left w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 
        bg-white dark:bg-slate-800/60 
        hover:shadow-lg hover:shadow-slate-200/40 dark:hover:shadow-slate-900/40 
        hover:border-blue-300 dark:hover:border-blue-600
        transition-all duration-400 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
              {alg.name}
            </h4>
            <span
              className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${difficultyStyles[alg.difficulty]}`}
            >
              {difficultyLabels[alg.difficulty] ?? alg.difficulty}
            </span>
          </div>

          <p className="font-mono text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
            {alg.algorithm}
          </p>

          {alg.description && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 line-clamp-1">
              {alg.description}
            </p>
          )}
        </div>

        <div className="shrink-0 w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500 transition-all duration-300">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default AlgorithmCard;
