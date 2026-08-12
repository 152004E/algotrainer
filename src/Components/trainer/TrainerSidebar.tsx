import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { trainerStatsStore } from "../../hooks/TrainerStatsStore";

export default function TrainerSidebar() {
  const [stats, setStats] = useState(trainerStatsStore.stats);
  const [rt, setRt] = useState(trainerStatsStore.recognitionTime);

  useEffect(() => {
    return trainerStatsStore.subscribe((s, rt) => {
      setStats(s);
      setRt(rt);
    });
  }, []);

  return (
    <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col">
      {/* Header */}
      <Link to="/" className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img
          src="/algoTrainerLogo-removebg-preview.png"
          alt="AlgoTrainer"
          className="h-8 w-auto object-contain"
        />
        <span className="text-xl font-bold text-slate-700 dark:text-slate-300">
          AlgoTrainer
        </span>
      </Link>

      {/* Stats Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {/* Current Session */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
            Current Session
          </h3>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">timer</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Mean of 3</span>
              </div>
              <span className="font-mono font-bold text-primary">
                {rt > 0 ? `${(rt / 1000).toFixed(2)}s` : "--"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400 text-lg">equalizer</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Average of 5</span>
              </div>
              <span className="font-mono text-slate-600 dark:text-slate-400">
                {stats.avgRecognitionTime > 0
                  ? `${(stats.avgRecognitionTime / 1000).toFixed(2)}s`
                  : "--"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400 text-lg">history</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Solved</span>
              </div>
              <span className="font-mono text-slate-600 dark:text-slate-400">
                {stats.casesPracticed}/{stats.totalCases}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400 text-lg">check_circle</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Success rate</span>
              </div>
              <span className="font-mono text-slate-600 dark:text-slate-400">
                {stats.attempts > 0
                  ? `${Math.round((stats.correct / stats.attempts) * 100)}%`
                  : "--"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400 text-lg">bolt</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Avg execution</span>
              </div>
              <span className="font-mono text-slate-600 dark:text-slate-400">
                {stats.avgExecutionTime > 0
                  ? `${(stats.avgExecutionTime / 1000).toFixed(2)}s`
                  : "--"}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Bests */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
            Personal Bests
          </h3>
          <div className="space-y-3 px-2">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500">Single</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">--</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500">Ao12</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">--</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button className="flex w-full items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">
          <span className="material-symbols-outlined">settings</span>
          Settings
        </button>
      </div>
    </aside>
  );
}
