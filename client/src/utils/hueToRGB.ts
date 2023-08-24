const toZeroOne = (n: number) => {
  if (n < 0) return n + 1;
  if (n > 1) return n - 1;
  return n;
};

const hueToRGB = (p: number, q: number, t: number): number => {
  const tt = toZeroOne(t);
  if (tt < 1 / 6) return p + (q - p) * 6 * t;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

export const hslToHex = (h: number, s: number, l: number): string => {
  const hh = (h + 360) % 360; // Ensure hue is within [0, 360)
  const ss = Math.max(0, Math.min(1, s)); // Ensure saturation is within [0, 1]
  const ll = Math.max(0, Math.min(1, l)); // Ensure lightness is within [0, 1]

  if (ss === 0) {
    const lum = Math.round(ll * 255);
    return `#${lum.toString(16).padStart(2, '0').repeat(3)}`;
  }

  const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
  const p = 2 * l - q;

  const r = Math.round(hueToRGB(p, q, hh / 360 + 1 / 3) * 255);
  const g = Math.round(hueToRGB(p, q, hh / 360) * 255);
  const b = Math.round(hueToRGB(p, q, hh / 360 - 1 / 3) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
    .toString(16)
    .padStart(2, '0')}`;
};
