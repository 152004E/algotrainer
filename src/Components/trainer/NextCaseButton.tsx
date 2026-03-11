interface Props {
  onNext: () => void;
}

export default function NextCaseButton({ onNext }: Props) {
  return (
    <button
      onClick={onNext}
      className="px-10 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold"
    >
      Next Case
    </button>
  );
}