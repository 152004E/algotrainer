interface Props {
  algorithm: string;
  revealed: boolean;
  onReveal: () => void;
}

export default function AlgorithmBox({ algorithm, revealed, onReveal }: Props) {
  return (
    <div className="text-center space-y-4">
      <div className="text-sm font-bold text-blue-500">
        RECOMMENDED ALGORITHM
      </div>

      {revealed ? (
        <div
          id="algo-display"
          className="text-3xl font-bold font-mono"
        >
          {algorithm}
        </div>
      ) : (
        <button
          data-reveal-algo
          onClick={onReveal}
          className="px-8 py-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-mono text-2xl cursor-pointer"
        >
          Click or press SPACE
        </button>
      )}
    </div>
  );
}
