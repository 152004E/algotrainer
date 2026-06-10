const MIRROR_MAP: Record<string, string> = {
  "R": "L'",
  "R'": "L",
  "R2": "L2'",
  "R2'": "L2",
  "L": "R'",
  "L'": "R",
  "L2": "R2'",
  "L2'": "R2",
  "r": "l'",
  "r'": "l",
  "r2": "l2'",
  "r2'": "l2",
  "l": "r'",
  "l'": "r",
  "l2": "r2'",
  "l2'": "r2",
  "U": "U'",
  "U'": "U",
  "U2": "U2",
  "U2'": "U2'",
  "D": "D'",
  "D'": "D",
  "D2": "D2",
  "D2'": "D2'",
  "F": "F'",
  "F'": "F",
  "F2": "F2",
  "F2'": "F2'",
  "B": "B'",
  "B'": "B",
  "B2": "B2",
  "B2'": "B2'",
  "M": "M'",
  "M'": "M",
  "M2": "M2",
  "M2'": "M2'",
  "E": "E'",
  "E'": "E",
  "E2": "E2",
  "E2'": "E2'",
  "S": "S'",
  "S'": "S",
  "S2": "S2",
  "S2'": "S2'",
  "u": "d'",
  "u'": "d",
  "u2": "d2'",
  "u2'": "d2",
  "d": "u'",
  "d'": "u",
  "d2": "u2'",
  "d2'": "u2",
  "f": "f'",
  "f'": "f",
  "f2": "f2",
  "f2'": "f2'",
  "b": "b'",
  "b'": "b",
  "b2": "b2",
  "b2'": "b2'",
  "x": "x'",
  "x'": "x",
  "x2": "x2",
  "x2'": "x2'",
  "y": "y'",
  "y'": "y",
  "y2": "y2",
  "y2'": "y2'",
  "z": "z",
  "z'": "z'",
  "z2": "z2",
  "z2'": "z2'",
};

const TOKEN_PATTERN = /[RLUDFBMSErludfbxyz]\d?'?/g;

export function mirrorAlgorithm(alg: string): string {
  if (alg.includes("||")) {
    return alg
      .split("||")
      .map((segment, i) => {
        const trimmed = segment.trim();
        if (i % 2 === 1) {
          return trimmed.replace(TOKEN_PATTERN, (match) => {
            const mirrored = MIRROR_MAP[match];
            return mirrored ?? match;
          });
        }
        return trimmed;
      })
      .join(" ");
  }

  return alg.replace(TOKEN_PATTERN, (match) => {
    const mirrored = MIRROR_MAP[match];
    return mirrored ?? match;
  });
}
