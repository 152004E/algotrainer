interface Props {
  scramble: string;
}

export default function ScrambleBox({ scramble }: Props) {
  return (
    <div className="w-full text-center">

      <span className="text-xs font-bold text-blue-500 tracking-[0.2em] uppercase mb-2 block">
        Current Scramble
      </span>

      <h2 className="text-2xl font-mono bg-gray-100 dark:bg-gray-900 p-6 rounded-xl">
        {scramble}
      </h2>

    </div>
  );
}