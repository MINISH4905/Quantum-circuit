import type { Statevector } from "./state-vector-simulator";

export interface QSpherePoint {
  index: number;
  bitstring: string;
  weight: number;
  probability: number;
  /** Phase angle of the amplitude, normalized to [0, 2*PI). */
  phase: number;
  /** Projected 2D screen coordinates, roughly within [-1, 1]. */
  x: number;
  y: number;
  /** Depth after the viewing tilt; larger = closer to the viewer. Used for z-order/opacity. */
  depth: number;
}

const EPSILON = 1e-9;

function popcount(i: number): number {
  let count = 0;
  while (i) {
    count += i & 1;
    i >>= 1;
  }
  return count;
}

function bitstringFor(index: number, qubits: number): string {
  let s = "";
  for (let q = qubits - 1; q >= 0; q--) {
    s += (index >> q) & 1;
  }
  return s;
}

export interface QSphereView {
  /** Rotation around the vertical (Y) axis, in degrees — spinning the sphere left/right. */
  azimuthDeg: number;
  /** Rotation around the horizontal (X) axis, in degrees — tilting the sphere up/down. */
  elevationDeg: number;
}

export const DEFAULT_QSPHERE_VIEW: QSphereView = { azimuthDeg: 0, elevationDeg: 22 };

/**
 * Project each basis state of the statevector onto a sphere: latitude by
 * Hamming weight (|0...0> at the north pole, |1...1> at the south pole),
 * states of equal weight spread evenly around that latitude's azimuth.
 * Dot size (elsewhere) should scale with `probability`; color with `phase`.
 * `view` lets the caller rotate the sphere (e.g. via mouse drag).
 */
export function computeQSphereLayout(sv: Statevector, view: QSphereView = DEFAULT_QSPHERE_VIEW): QSpherePoint[] {
  const n = sv.qubits;
  const size = 1 << n;
  const az = (view.azimuthDeg * Math.PI) / 180;
  const el = (view.elevationDeg * Math.PI) / 180;

  // Group basis state indices by Hamming weight, preserving ascending index order.
  const groups = new Map<number, number[]>();
  for (let i = 0; i < size; i++) {
    const w = popcount(i);
    if (!groups.has(w)) groups.set(w, []);
    groups.get(w)!.push(i);
  }

  const points: QSpherePoint[] = [];
  for (let i = 0; i < size; i++) {
    const re = sv.re[i];
    const im = sv.im[i];
    const probability = re * re + im * im;
    if (probability < EPSILON) continue;

    const weight = popcount(i);
    const group = groups.get(weight)!;
    const k = group.indexOf(i);
    const theta = n === 0 ? 0 : (weight / n) * Math.PI;
    const phi = group.length > 1 ? (2 * Math.PI * k) / group.length : 0;

    const X = Math.sin(theta) * Math.cos(phi);
    const Y = Math.cos(theta);
    const Z = Math.sin(theta) * Math.sin(phi);

    // Rotate around the vertical axis (spin), then the horizontal axis (tilt).
    const X1 = X * Math.cos(az) + Z * Math.sin(az);
    const Z1 = -X * Math.sin(az) + Z * Math.cos(az);
    const Y1 = Y;

    const Y2 = Y1 * Math.cos(el) - Z1 * Math.sin(el);
    const Z2 = Y1 * Math.sin(el) + Z1 * Math.cos(el);
    const X2 = X1;

    const phase = ((Math.atan2(im, re) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    points.push({
      index: i,
      bitstring: bitstringFor(i, n),
      weight,
      probability,
      phase,
      x: X2,
      y: -Y2,
      depth: Z2,
    });
  }

  // Draw back-to-front so nearer points render on top.
  points.sort((a, b) => a.depth - b.depth);
  return points;
}
