import { useOutletContext } from "react-router-dom";
import type { AlgoCase } from "../../types";
import PassiveTrainerView from "./PassiveTrainerView";
import VirtualTrainerView from "./VirtualTrainerView";
import type { TrainerMode } from "./TrainerModeToggle";

export default function TrainerPage({ cases }: { cases: AlgoCase[] }) {
  const { mode, learnMode } = useOutletContext<{
    mode: TrainerMode | null;
    learnMode: boolean;
  }>();

  if (!mode) return null;

  return mode === "passive" ? (
    <PassiveTrainerView cases={cases} />
  ) : (
    <VirtualTrainerView cases={cases} learnMode={learnMode} />
  );
}
