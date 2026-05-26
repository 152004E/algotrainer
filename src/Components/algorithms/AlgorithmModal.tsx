import { useEffect, useRef, useMemo } from "react";
import { Alg } from "cubing/alg";
import type { AlgoCase } from "../../types";
import CubeAlgorithmViewer from "./CubeAlgorithmViewer";

interface Props {
  alg: AlgoCase;
  onClose: () => void;
}

const difficultyColors: Record<string, string> = {
  Easy: "bg-emerald-500",
  Medium: "bg-amber-500",
  Hard: "bg-rose-500",
};

const difficultyLabels: Record<string, string> = {
  Easy: "Fácil",
  Medium: "Medio",
  Hard: "Difícil",
};

const AlgorithmModal = ({ alg, onClose }: Props) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const mezcla = useMemo(() => {
    try {
      return new Alg(alg.algorithm).invert().toString();
    } catch {
      return "";
    }
  }, [alg.algorithm]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl 
        border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${difficultyColors[alg.difficulty]}`} />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{alg.name}</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 capitalize">
              {difficultyLabels[alg.difficulty] ?? alg.difficulty}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-5">
          <CubeAlgorithmViewer setupAlg={mezcla} solutionAlg={alg.algorithm} />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">
              Mezcla
            </label>
            <div className="font-mono text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-600 dark:text-slate-400 break-all">
              {mezcla}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">
              Solución
            </label>
            <div className="font-mono text-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 text-blue-700 dark:text-blue-300 break-all font-semibold">
              {alg.algorithm}
            </div>
          </div>

          {alg.description && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">
                Descripción
              </label>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {alg.description}
              </p>
            </div>
          )}

          {alg.recognition && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">
                Reconocimiento
              </label>
              <p className="text-sm text-slate-600 dark:text-slate-400">{alg.recognition}</p>
            </div>
          )}

          {alg.fingertricks && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">
                Fingertricks
              </label>
              <p className="text-sm text-slate-600 dark:text-slate-400">{alg.fingertricks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmModal;
