export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-4xl font-bold">About AlgoTrainer</h1>

      <p className="text-lg text-gray-600 dark:text-gray-300">
        AlgoTrainer is a speedcubing algorithm training tool. Practice algorithms
        for F2L, Winter Variation (WV), Magic Wonderful (MW), OLL, and PLL.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">How It Works</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li>Pick an algorithm set from the tabs</li>
          <li>A scramble and case will appear</li>
          <li>Try to recall the algorithm</li>
          <li>Press SPACE or click to reveal the solution</li>
          <li>Press SPACE again for the next case</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
        <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
          <span className="font-mono bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-center">
            SPACE
          </span>
          <span>Reveal algorithm / Next case</span>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Data Sources</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Algorithms sourced from alg.cubing.net and standard speedcubing references.
        </p>
      </section>
    </div>
  );
}
