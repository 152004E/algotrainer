import { useEffect, useRef } from "react";
import "cubing/twisty";
import { randomScrambleForEvent } from "cubing/scramble";
import { Alg } from "cubing/alg";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const CubeHero = () => {
  const ref = useRef<any>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let active = true;
    el.tempoScale = 0.45;

    const cycle = async () => {
      while (active) {
        const raw = await randomScrambleForEvent("333");
        const scramble = raw.toString();
        const inverse = new Alg(scramble).invert().toString();
        const moveCount = scramble.split(" ").length;

        el.alg = scramble + " . " + inverse;
        el.jumpToStart();
        el.play();
        await delay(moveCount * 1000 + 1500);

        await delay(2000);
      }
    };

    cycle();
    return () => {
      active = false;
    };
  }, []);

  return (
    <twisty-player
      ref={ref}
      puzzle="3x3x3"
      background="none"
      control-panel="none"
      viewer-link="none"
      hint-facelets="none"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default CubeHero;
