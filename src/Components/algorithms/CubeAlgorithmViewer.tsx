import { useEffect, useRef } from "react";
import "cubing/twisty";

interface Props {
  setupAlg: string;
  solutionAlg: string;
}

const CubeAlgorithmViewer = ({ setupAlg, solutionAlg }: Props) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.tempoScale = 0.6;
    el.alg = setupAlg + " . " + solutionAlg;
    el.jumpToStart();
    el.play();
  }, [setupAlg, solutionAlg]);

  return (
    <twisty-player
      ref={ref}
      puzzle="3x3x3"
      background="none"
      control-panel="none"
      viewer-link="none"
      hint-facelets="none"
      style={{ width: "100%", height: "280px" }}
    />
  );
};

export default CubeAlgorithmViewer;
