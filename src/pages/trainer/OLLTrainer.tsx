import ScrambleBox from "../../Components/trainer/ScrambleBox";
import CubeViewer from "../../Components/trainer/CubeViewer";
import AlgorithmBox from "../../Components/trainer/AlgorithmBox";
import NextCaseButton from "../../Components/trainer/NextCaseButton";

export default function OLLTrainer() {
  const scramble = "U R2 D' R2 U2 R2 D R2 U2";
  const algorithm = "(R U R' U') (R' F R2 U') R' U' (R U R' F')";

  const handleNextCase = () => {
    console.log("next case");
  };

  return (
    <>
      <ScrambleBox scramble={scramble} />
      <CubeViewer />
      <AlgorithmBox algorithm={algorithm} />
      <NextCaseButton onNext={handleNextCase} />
    </>
  );
}
