import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Alg } from "cubing/alg";
import type { AlgoCase } from "../../types";
import CubeViewer, { type CubeViewerHandle } from "./CubeViewer";

interface Props {
  alg: AlgoCase;
  allAlgorithms?: string[];
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

const AlgorithmModal = ({ alg, allAlgorithms, onClose }: Props) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const allAlgs = useMemo(
    () => allAlgorithms ?? [alg.algorithm, ...(alg.alternatives ?? [])],
    [alg.algorithm, alg.alternatives, allAlgorithms],
  );
  const [selectedIdx, setSelectedIdx] = useState(0);

  const setupAlg = useMemo(() => {
    try {
      return new Alg(alg.algorithm).invert().toString();
    } catch {
      return "";
    }
  }, [alg.algorithm]);

  const solutionAlg = useMemo(() => {
    return allAlgs[selectedIdx];
  }, [allAlgs, selectedIdx]);

  const solutionRef = useRef<CubeViewerHandle>(null);

  const handleScrambleFinish = useCallback(() => {
    solutionRef.current?.jumpToStart();
    solutionRef.current?.play();
  }, []);

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
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl 
        border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full ${difficultyColors[alg.difficulty]} shrink-0`} />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{alg.name}</h2>
            {alg.description && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
                {alg.description}
              </span>
            )}
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 capitalize">
              {difficultyLabels[alg.difficulty] ?? alg.difficulty}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {alg.aliases && alg.aliases.length > 0 && (
          <div className="px-5 pt-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {alg.aliases.join(" · ")}
            </p>
          </div>
        )}

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
              Mezcla
            </label>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <CubeViewer alg={setupAlg} controls onFinish={handleScrambleFinish} />
            </div>
            <div className="font-mono text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-600 dark:text-slate-400 break-all mt-2">
              {setupAlg}
            </div>

          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
              Solución
            </label>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden p-1">
              <CubeViewer ref={solutionRef} scramble={setupAlg} alg={solutionAlg} controls />
            </div>
            <div className="mt-2 space-y-1.5 max-h-[260px] overflow-y-auto">
              {allAlgs.map((algStr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`w-full text-left font-mono text-sm rounded-xl px-4 py-2.5 break-all transition-all ${
                    idx === selectedIdx
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-300 dark:border-blue-700"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700"
                  }`}
                >
                  {algStr}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
          {alg.usedIn && (
            <span>Usado en: <strong className="text-slate-600 dark:text-slate-300">{alg.usedIn}</strong></span>
          )}
          {alg.optimalMoves && (
            <span>Movimientos óptimos: <strong className="text-slate-600 dark:text-slate-300">{alg.optimalMoves}</strong></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmModal;
