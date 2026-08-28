import AlgorithmBox from "./AlgorithmBox";

interface Props {
  algorithm: string;
  forceReveal?: boolean;
  revealed: boolean;
  onReveal: () => void;
}

export default function AlgorithmReveal({
  algorithm,
  forceReveal,
  revealed,
  onReveal,
}: Props) {
  const isRevealed = forceReveal || revealed;
  return (
    <AlgorithmBox
      algorithm={algorithm}
      revealed={isRevealed}
      onReveal={onReveal}
    />
  );
}