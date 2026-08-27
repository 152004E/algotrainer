interface Props {
  algorithm: string;
  revealed: boolean;
  onReveal: () => void;
}

export default function AlgorithmBox({ algorithm, revealed, onReveal }: Props) {
  if (revealed) {
    return (
      <div
        id="algo-display"
        className="w-full text-center px-4 py-3 rounded-lg bg-primary/5 border border-primary/20 text-sm sm:text-base font-medium tracking-tight text-slate-700 dark:text-slate-300 font-mono break-words"
      >
        {algorithm}
      </div>
    );
  }

  return (
    <button
      data-reveal-algo
      type="button"
      onClick={onReveal}
      className="w-full px-6 py-3 bg-primary/5 text-primary/50 border border-primary/20 hover:bg-primary/10 hover:text-primary/70 rounded-lg font-medium text-sm cursor-pointer transition-colors"
    >
      Ver algoritmo recomendado
    </button>
  );
}
