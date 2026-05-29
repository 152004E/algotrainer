import { useState, useMemo } from "react";
import { Alg } from "cubing/alg";
import type { AlgoCase } from "../../types";

interface Props {
  alg: AlgoCase;
  onClick: (alg: AlgoCase) => void;
}

const AlgorithmCard = ({ alg, onClick }: Props) => {
  const [imgError, setImgError] = useState(false);
  const imgSrc = `/algorithms/${alg.subset.toLowerCase()}/${alg.id}.png`;
  const mezcla = useMemo(() => {
    try {
      return new Alg(alg.algorithm).invert().toString();
    } catch {
      return "";
    }
  }, [alg.algorithm]);

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
            {alg.description && (
              <span className="shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                {alg.description}
              </span>
            )}
          </div>

          {mezcla && (
            <p className="font-mono text-[11px] text-slate-400 dark:text-slate-500 truncate mt-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Mezcla</span>{" "}
              {mezcla}
            </p>
          )}

          <p className="font-mono text-xs text-blue-600 dark:text-blue-400 truncate mt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Solución</span>{" "}
            {alg.algorithm}
          </p>
        </div>

        <div className="shrink-0 w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden group-hover:ring-2 group-hover:ring-blue-300 dark:group-hover:ring-blue-600 transition-all duration-300">
          {imgError ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          ) : (
            <img
              src={imgSrc}
              alt={alg.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
        </div>
      </div>
    </button>
  );
};

export default AlgorithmCard;
