export default function CubeViewer() {
  return (
    <div className="relative group">
      {/* Glow Effect */}
      <div className="absolute -inset-4 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700"></div>

      {/* Cube Container */}
      <div className="relative w-80 h-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden">
        {/* Simulated 3D Cube Rendering */}
        <div className="transform rotate-12 flex gap-4">
          <div className="cube-grid w-48 h-48 shadow-xl">
            {/* Top/Front Mixed Mockup Colors */}
            <div className="cube-face bg-white"></div>
            <div className="cube-face bg-blue-500"></div>
            <div className="cube-face bg-white"></div>
            <div className="cube-face bg-red-500"></div>
            <div className="cube-face bg-white"></div>
            <div className="cube-face bg-red-500"></div>
            <div className="cube-face bg-white"></div>
            <div className="cube-face bg-blue-500"></div>
            <div className="cube-face bg-white"></div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">refresh</span>
          </button>
          <button className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">3d_rotation</span>
          </button>
        </div>
      </div>
    </div>
  );
}