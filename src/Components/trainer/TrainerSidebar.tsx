import { useState, useEffect } from "react";
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
    <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold">CubeTrainer</h2>
      </div>
      <div className="p-4 space-y-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Progress</p>
          <p className="text-2xl font-bold">{stats.casesPracticed} / {stats.totalCases}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Streak</p>
          <p className="text-2xl font-bold">{stats.currentStreak}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Best Streak</p>
          <p className="text-2xl font-bold">{stats.longestStreak}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Recognition</p>
          <p className="text-2xl font-bold">
            {rt > 0 ? `${(rt / 1000).toFixed(2)}s` : "--"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Avg Recog</p>
          <p className="text-2xl font-bold">
            {stats.avgRecognitionTime > 0
              ? `${(stats.avgRecognitionTime / 1000).toFixed(2)}s`
              : "--"}
          </p>
        </div>
      </div>
    </aside>
  );
}
