interface Props {
  onMove: (move: string) => void;
  disabled?: boolean;
}

interface PadMove {
  label: string;
  move: string;
  cw: boolean;
}

const MOVES: PadMove[] = ["U", "D", "R", "L", "F", "B"].flatMap((face) => [
  { label: face, move: face, cw: true },
  { label: `${face}'`, move: `${face}'`, cw: false },
  { label: `${face}2`, move: `${face}2`, cw: true },
]);

export default function MovePad({ onMove, disabled }: Props) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-6 gap-1.5">
        {MOVES.map(({ label, move, cw }) => (
          <button
            key={move}
            type="button"
            onClick={() => onMove(move)}
            disabled={disabled}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-700 dark:text-slate-200 font-mono font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span>{label}</span>
            <span className="text-[10px] leading-none opacity-70">
              {cw ? "↻" : "↺"}
            </span>
          </button>
        ))}
      </div>
      <p className="text-[11px] text-slate-400 text-center mt-1.5">
        <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono">U R L F D B</kbd>{" "}
        giro · <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono">Shift</kbd>{" "}
        inverso · <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono">2</kbd>{" "}
        doble · <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono">Space</kbd>{" "}
        comprobar
      </p>
    </div>
  );
}
