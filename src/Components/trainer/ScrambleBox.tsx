interface Props {
  scramble: string;
  loading?: boolean;
}

export default function ScrambleBox({ scramble, loading }: Props) {
  return (
    <div className="w-full text-center">
      <span className="text-xs font-bold text-primary tracking-[0.2em] uppercase mb-2 block">
        Current Scramble
      </span>

      {loading ? (
        <div className="h-24 md:h-28 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800" />
      ) : (
        <h2 className="text-2xl md:text-3xl font-mono font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          {scramble}
        </h2>
      )}
    </div>
  );
}