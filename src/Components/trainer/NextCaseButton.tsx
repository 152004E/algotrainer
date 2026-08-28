import PrimaryButton from "./PrimaryButton";
import SpaceHint from "./SpaceHint";

interface Props {
  onNext: () => void;
}

export default function NextCaseButton({ onNext }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <PrimaryButton data-next-case onClick={onNext} className="w-64">
        Siguiente caso
        <span className="material-symbols-outlined align-middle ml-1 group-hover:translate-x-0.5 transition-transform">
          arrow_forward
        </span>
      </PrimaryButton>
      <SpaceHint>para saltar al siguiente caso</SpaceHint>
    </div>
  );
}