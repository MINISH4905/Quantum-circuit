import type { Statevector } from "./state-vector-simulator";

// Local mirror of backend/app/simulator.py::compute_bloch_angles, so the
// local-mode fallback (see QSpherePanel/ProbabilitiesPanel's own local
// statevector pattern) can render Bloch spheres without a backend round trip.

export interface BlochAngle {
  qubit: number;
  theta: number | null;
  phi: number | null;
  r: number;
  pure: boolean;
}

// Below this Bloch-vector magnitude, the reduced single-qubit state is too
// mixed (e.g. entangled with another qubit) for theta/phi to mean anything.
const PURITY_THRESHOLD = 0.999;

/** Reduced single-qubit Bloch vector for every qubit, via the (qubit, other-qubits) partial trace. */
export function computeBlochAngles(sv: Statevector): BlochAngle[] {
  const { qubits, re, im } = sv;
  const size = re.length;
  const angles: BlochAngle[] = [];

  for (let q = 0; q < qubits; q++) {
    const bit = 1 << q;
    let rho00 = 0;
    let rho11 = 0;
    let rho01Re = 0;
    let rho01Im = 0;

    for (let i = 0; i < size; i++) {
      if ((i & bit) !== 0) continue; // iterate each (|0>,|1>) pair once, from the |0> index
      const j = i | bit;
      const re0 = re[i];
      const im0 = im[i];
      const re1 = re[j];
      const im1 = im[j];

      rho00 += re0 * re0 + im0 * im0;
      rho11 += re1 * re1 + im1 * im1;
      // rho01 += amp_i * conj(amp_j)
      rho01Re += re0 * re1 + im0 * im1;
      rho01Im += im0 * re1 - re0 * im1;
    }

    const rx = 2 * rho01Re;
    const ry = -2 * rho01Im;
    const rz = rho00 - rho11;
    const r = Math.sqrt(rx * rx + ry * ry + rz * rz);

    let theta: number | null = null;
    let phi: number | null = null;
    let pure = false;
    if (r >= PURITY_THRESHOLD) {
      const clamped = Math.max(-1, Math.min(1, rz / r));
      theta = Math.acos(clamped);
      phi = Math.atan2(ry, rx);
      pure = true;
    }

    angles.push({ qubit: q, theta, phi, r, pure });
  }

  return angles;
}
