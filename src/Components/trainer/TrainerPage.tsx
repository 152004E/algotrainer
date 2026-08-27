import { useOutletContext } from "react-router-dom";
import type { AlgoCase } from "../../types";
import PassiveTrainerView from "./PassiveTrainerView";
import VirtualTrainerView from "./VirtualTrainerView";
import type { TrainerMode } from "./TrainerModeToggle";
import type { TrainerSettings } from "../../hooks/useTrainerSettings";

export default function TrainerPage({ cases }: { cases: AlgoCase[] }) {
  const { mode, settings, onSettingsChange } = useOutletContext<{
    mode: TrainerMode | null;
    settings: TrainerSettings;
    onSettingsChange: (s: TrainerSettings) => void;
  }>();

  if (!mode) return null;

  return mode === "passive" ? (
    <PassiveTrainerView cases={cases} />
  ) : (
    <VirtualTrainerView
      cases={cases}
      settings={settings}
      onSettingsChange={onSettingsChange}
    />
  );
}
