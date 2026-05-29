import { useEffect, useRef } from "react";
import "cubing/twisty";

interface Props {
  alg: string;
  height?: string;
}

const CubeViewer = ({ alg, height = "240px" }: Props) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.tempoScale = 0.8;
    el.alg = alg;
    el.jumpToStart();
    el.play();
  }, [alg]);

  return (
    <twisty-player
      ref={ref}
      puzzle="3x3x3"
      background="none"
      control-panel="none"
      viewer-link="none"
      hint-facelets="none"
      style={{ width: "100%", height }}
    />
  );
};

export default CubeViewer;
