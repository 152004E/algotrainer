import type { SolveVerification } from "../../utils/verifySolve";

interface Props {
  verdict: SolveVerification | null;
  userMoves: string[];
  recognitionTime: number;
  executionTime: number;
  onRepeat: () => void;
  onNext: () => void;
}

function formatMs(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`;
}

export default function FeedbackPanel({
  verdict,
  userMoves,
  recognitionTime,
  executionTime,
  onRepeat,
  onNext,
}: Props) {
  const solved = verdict?.solved ?? false;
  const status = solved ? "resuelto" : "incorrecto";
  const statusColor = solved
    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
    : "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300";

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-center gap-3">
        <span
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${statusColor}`}
        >
          <span className="material-symbols-outlined text-base">
            {solved ? "check_circle" : "cancel"}
          </span>
          {status === "resuelto" ? "¡Resuelto!" : status}
        </span>
        {verdict?.exact && (
          <span className="text-xs px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-semibold">
            Algoritmo exacto
          </span>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Tus movimientos
        </div>
        <div className="p-3 font-mono text-sm text-slate-700 dark:text-slate-200 break-all min-h-10">
          {userMoves.length > 0 ? userMoves.join(" ") : "(sin movimientos)"}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
        <span>
          Reconocimiento:{" "}
          <strong className="font-mono text-slate-700 dark:text-slate-200">
            {formatMs(recognitionTime)}
          </strong>
        </span>
        <span>
          Ejecución:{" "}
          <strong className="font-mono text-slate-700 dark:text-slate-200">
            {formatMs(executionTime)}
          </strong>
        </span>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={onRepeat}
          className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors"
        >
          Repetir
        </button>
        <button
          data-next-case
          type="button"
          onClick={onNext}
          className="group px-8 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          Siguiente caso
          <span className="material-symbols-outlined align-middle ml-1 group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
