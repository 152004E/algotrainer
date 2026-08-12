interface Props {
  algorithm: string;
  revealed: boolean;
  onReveal: () => void;
}

export default function AlgorithmBox({ algorithm, revealed, onReveal }: Props) {
  return (
    <div className="w-full text-center space-y-6">
      <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-full text-sm font-bold">
        ALGORITMO RECOMENDADO
      </div>

      {revealed ? (
        <div
          id="algo-display"
          className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono break-words"
        >
          {algorithm}
        </div>
      ) : (
        <button
          data-reveal-algo
          onClick={onReveal}
          className="w-full px-8 py-4 bg-primary/10 text-primary border-2 border-primary/40 hover:bg-primary/15 rounded-xl font-bold text-xl cursor-pointer transition-colors"
        >
          Ver algoritmo recomendado
        </button>
      )}
    </div>
  );
}
