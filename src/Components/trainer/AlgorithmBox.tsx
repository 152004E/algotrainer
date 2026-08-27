interface Props {
  algorithm: string;
  revealed: boolean;
  onReveal: () => void;
}

export default function AlgorithmBox({ algorithm, revealed, onReveal }: Props) {
  return (
    <div className="w-full text-center space-y-3">
      <div className="inline-block px-3 py-1 bg-primary/5 text-primary/60 border border-primary/20 rounded-full text-xs font-medium">
        ALGORITMO RECOMENDADO
      </div>

      {revealed ? (
        <div
          id="algo-display"
          className="text-sm sm:text-base font-medium tracking-tight text-slate-700 dark:text-slate-300 font-mono break-words"
        >
          {algorithm}
        </div>
      ) : (
        <button
          data-reveal-algo
          onClick={onReveal}
          className="w-full px-6 py-3 bg-primary/5 text-primary/60 border border-primary/20 hover:bg-primary/10 rounded-lg font-medium text-sm cursor-pointer transition-colors"
        >
          Ver algoritmo recomendado
        </button>
      )}
    </div>
  );
}
