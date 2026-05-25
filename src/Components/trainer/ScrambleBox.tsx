interface Props {
  scramble: string;
}

export default function ScrambleBox({ scramble }: Props) {
  return (
    <div className="w-full text-center">
      <span className="text-xs font-bold text-primary tracking-[0.2em] uppercase mb-2 block">
        Current Scramble
      </span>

      <h2 className="text-2xl md:text-3xl font-mono font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
        {scramble}
      </h2>
    </div>
  );
}