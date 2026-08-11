import ScrambleBox from "../../Components/trainer/ScrambleBox";
import CubeViewer from "../../Components/trainer/CubeViewer";
import AlgorithmBox from "../../Components/trainer/AlgorithmBox";
import NextCaseButton from "../../Components/trainer/NextCaseButton";
import { useScrambledTrainer } from "../../hooks/useScrambledTrainer";
import WVCases from "../../data/WVCases";

export default function WVTrainer() {
  const { currentCase, scramble, loading, nextCase, revealed, revealAlgorithm } =
    useScrambledTrainer(WVCases);

  return (
    <>
      <ScrambleBox scramble={scramble} loading={loading} />
      <CubeViewer scramble={scramble} loading={loading} />
      <AlgorithmBox algorithm={currentCase.algorithm} revealed={revealed} onReveal={revealAlgorithm} />
      <NextCaseButton onNext={nextCase} />
    </>
  );
}
