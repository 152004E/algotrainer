interface Props {
  onNext: () => void;
}

export default function NextCaseButton({ onNext }: Props) {
  return (
    <div className="pt-4 flex flex-col items-center gap-4 w-full">
      <button
        data-next-case
        onClick={onNext}
        className="group relative px-12 py-5 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold text-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center gap-3"
      >
        <span>Next Case</span>
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </button>
      <p className="text-slate-400 text-sm">
        Press <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono">SPACE</kbd> to skip to next case
      </p>
    </div>
  );
}
