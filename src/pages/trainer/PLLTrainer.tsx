import ScrambleBox from "../../Components/trainer/ScrambleBox";
import CubeViewer from "../../Components/trainer/CubeViewer";
import AlgorithmBox from "../../Components/trainer/AlgorithmBox";
import NextCaseButton from "../../Components/trainer/NextCaseButton";
import { useTrainer } from "../../hooks/useTrainer";
import PLLCases from "../../data/PLLCases";

export default function PLLTrainer() {
  const { currentCase, nextCase, revealed, revealAlgorithm } = useTrainer(PLLCases);

  return (
    <>
      <ScrambleBox scramble={currentCase.scramble} />
      <CubeViewer />
      <AlgorithmBox algorithm={currentCase.algorithm} revealed={revealed} onReveal={revealAlgorithm} />
      <NextCaseButton onNext={nextCase} />
    </>
  );
}
