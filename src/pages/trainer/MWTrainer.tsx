import ScrambleBox from "../../Components/trainer/ScrambleBox";
import CubeViewer from "../../Components/trainer/CubeViewer";
import AlgorithmBox from "../../Components/trainer/AlgorithmBox";
import NextCaseButton from "../../Components/trainer/NextCaseButton";

export default function WVTrainer() {

  const scramble = "R U R' U'";
  const algorithm = "(R U R' U')";

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