interface Props {
  algorithm: string;
}

export default function AlgorithmBox({ algorithm }: Props) {
  return (
    <div className="text-center space-y-4">

      <div className="text-sm font-bold text-blue-500">
        RECOMMENDED ALGORITHM
      </div>

      <div className="text-3xl font-bold font-mono">
        {algorithm}
      </div>

    </div>
  );
}