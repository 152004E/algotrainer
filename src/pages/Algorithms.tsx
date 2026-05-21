import OLLCases from "../data/OLLCases";
import PLLCases from "../data/PLLCases";
import WVCases from "../data/WVCases";
import MWCases from "../data/MWCases";
import f2lCases from "../data/f2lCases";

const datasets = [
  { name: "F2L", cases: f2lCases, color: "bg-blue-500" },
  { name: "Winter Variation", cases: WVCases, color: "bg-green-500" },
  { name: "Magic Wonderful", cases: MWCases, color: "bg-purple-500" },
  { name: "OLL", cases: OLLCases, color: "bg-orange-500" },
  { name: "PLL", cases: PLLCases, color: "bg-red-500" },
];

export default function Algorithms() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <h1 className="text-4xl font-bold">All Algorithms</h1>

      {datasets.map(({ name, cases, color }) => (
        <section key={name} className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${color}`} />
            {name}
            <span className="text-gray-400 text-lg font-normal">
              ({cases.length} cases)
            </span>
          </h2>

          <div className="grid gap-3">
            {cases.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{c.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700">
                    {c.difficulty}
                  </span>
                </div>
                <p className="font-mono text-sm mb-1">
                  <span className="text-gray-400">Scramble:</span> {c.scramble}
                </p>
                <p className="font-mono text-sm">
                  <span className="text-gray-400">Algo:</span> {c.algorithm}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
