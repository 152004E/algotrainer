export default function TrainerTabs() {
  return (
    <div className="absolute top-0 left-0 right-0 p-6 flex justify-center border-b border-slate-200 dark:border-slate-800">

      <nav className="flex items-center gap-8">

        <button className="text-blue-500 font-semibold border-b-2 border-blue-500 pb-1">
          F2L Trainer
        </button>

        <button className="text-gray-400 hover:text-gray-600">
          OLL Practice
        </button>

        <button className="text-gray-400 hover:text-gray-600">
          PLL Time Attack
        </button>

      </nav>

    </div>
  );
}