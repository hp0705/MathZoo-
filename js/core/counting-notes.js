const LADDER = [
  { freq: 261.63, name: "C4" },
  { freq: 293.66, name: "D4" },
  { freq: 329.63, name: "E4" },
  { freq: 392.00, name: "G4" },
  { freq: 440.00, name: "A4" },
  { freq: 523.25, name: "C5" },
  { freq: 587.33, name: "D5" },
  { freq: 659.25, name: "E5" },
  { freq: 783.99, name: "G5" },
  { freq: 880.00, name: "A5" }
];

/**
 * Return the pentatonic ladder note for a 1-based count n.
 */
export function noteForCount(n) {
  const count = Math.max(1, Math.trunc(Number(n)));
  const idx = (count - 1) % 10;
  const { freq, name } = LADDER[idx];
  return {
    freq,
    name,
    bell: count % 10 === 0
  };
}
