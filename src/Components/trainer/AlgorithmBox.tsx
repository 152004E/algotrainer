interface Props {
  algorithm: string;
  revealed: boolean;
  onReveal: () => void;
}

export default function AlgorithmBox({ algorithm, revealed, onReveal }: Props) {
  return (
    <div className="w-full text-center space-y-6">
      <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold">
        RECOMMENDED ALGORITHM
      </div>

      {revealed ? (
        <div
          id="algo-display"
          className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono"
        >
          {algorithm}
        </div>
      ) : (
        <button
          data-reveal-algo
          onClick={onReveal}
          className="w-full px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-mono text-2xl cursor-pointer transition-colors"
        >
          Click or press SPACE
        </button>
      )}
    </div>
  );
}
