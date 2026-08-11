interface FaceLabel {
  letter: string;
  className: string;
}

const OVERLAY_LABELS: FaceLabel[] = [
  { letter: "U", className: "top-[4%] left-1/2 -translate-x-1/2" },
  { letter: "L", className: "left-[2%] top-1/2 -translate-y-1/2" },
  { letter: "R", className: "right-[2%] top-1/2 -translate-y-1/2" },
  { letter: "F", className: "left-[20%] bottom-[10%]" },
];

export function NotationGuideOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {OVERLAY_LABELS.map(({ letter, className }) => (
        <div
          key={letter}
          className={`absolute flex items-center gap-0.5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm rounded-lg px-1.5 py-1 border border-slate-200 dark:border-slate-700 shadow-lg ${className}`}
        >
          <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-100">
            {letter}
          </span>
          <span className="text-[10px] text-primary font-bold">↻</span>
        </div>
      ))}
    </div>
  );
}

const NET_FACES = [
  { letter: "U", color: "bg-white", border: "border-slate-300" },
  { letter: "L", color: "bg-orange-400", border: "border-orange-300" },
  { letter: "F", color: "bg-green-500", border: "border-green-400" },
  { letter: "R", color: "bg-red-500", border: "border-red-400" },
  { letter: "D", color: "bg-yellow-300", border: "border-yellow-200" },
  { letter: "B", color: "bg-blue-600", border: "border-blue-500" },
];

export function NotationLegend() {
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="grid grid-cols-3 gap-1">
        <div />
        <FaceSquare {...NET_FACES[0]} />
        <div />
        <FaceSquare {...NET_FACES[1]} />
        <FaceSquare {...NET_FACES[2]} />
        <FaceSquare {...NET_FACES[3]} />
        <div />
        <FaceSquare {...NET_FACES[4]} />
        <FaceSquare {...NET_FACES[5]} />
      </div>
      <p className="text-[11px] text-slate-400">
        ↻ = giro horario visto desde fuera de la cara · ↺ = antihorario
      </p>
    </div>
  );
}

function FaceSquare({ letter, color, border }: (typeof NET_FACES)[number]) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-14 h-14 rounded-md ${color} ${border} border shadow-sm`}
    >
      <span className="font-mono font-bold text-sm text-slate-900 drop-shadow-sm">
        {letter}
      </span>
      <span className="text-xs text-slate-900 font-bold leading-none">↻</span>
    </div>
  );
}
