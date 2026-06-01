import type { AlgoCase } from "../types";
import { mirrorAlgorithm } from "./mirrorAlgorithm";

export function resolveAlternatives(
  caseData: AlgoCase,
  allCases: AlgoCase[],
): string[] {
  if (caseData.alternatives && caseData.alternatives.length > 0) {
    return caseData.alternatives;
  }

  if (caseData.ergonomicPairId) {
    const pair = allCases.find((c) => c.id === caseData.ergonomicPairId);
    if (pair?.isCanonicalVariantSource && pair.alternatives) {
      return pair.alternatives.map(mirrorAlgorithm);
    }
  }

  return [];
}

export function resolveAllAlgorithms(
  caseData: AlgoCase,
  allCases: AlgoCase[],
): string[] {
  return [
    caseData.algorithm,
    ...resolveAlternatives(caseData, allCases),
  ];
}
