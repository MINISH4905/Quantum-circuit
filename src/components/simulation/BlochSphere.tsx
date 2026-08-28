// Single-qubit Bloch sphere. SVG + CSS-transform based (no 3D dependency is
// present in this project — see package.json — so this follows the same 2D
// projected-wireframe approach already used by QSpherePanel's Q-sphere).

const SIZE = 130;
const CENTER = SIZE / 2;
const SPHERE_R = SIZE / 2 - 26;
const AZ_DEG = -35;
const EL_DEG = 20;

export interface BlochSphereAngle {
  theta: number | null;
  phi: number | null;
  r: number;
  pure: boolean;
}

interface Vec2 {
  sx: number;
  sy: number;
}

// Same rotate-then-tilt projection as computeQSphereLayout, with the Bloch
// z-axis (pole) mapped to the viewer's vertical axis.
function project(x: number, y: number, z: number): Vec2 {
  const az = (AZ_DEG * Math.PI) / 180;
  const el = (EL_DEG * Math.PI) / 180;
  const X = x;
  const Y = z;
  const Z = y;

  const X1 = X * Math.cos(az) + Z * Math.sin(az);
  const Z1 = -X * Math.sin(az) + Z * Math.cos(az);
  const Y1 = Y;

  const Y2 = Y1 * Math.cos(el) - Z1 * Math.sin(el);
  const X2 = X1;

  return { sx: X2, sy: -Y2 };
}

function ellipsePath(rx: number, ry: number, cy = 0): string {
  return `M ${CENTER - rx} ${CENTER + cy} A ${rx} ${ry} 0 1 0 ${CENTER + rx} ${CENTER + cy} A ${rx} ${ry} 0 1 0 ${CENTER - rx} ${CENTER + cy}`;
}

function hueForPhi(phi: number): string {
  const deg = (((phi + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI)) * 360;
  return `hsl(${deg}, 85%, 62%)`;
}

function axisLine(dx: number, dy: number, dz: number) {
  const p = project(dx, dy, dz);
  return { x2: CENTER + p.sx * SPHERE_R, y2: CENTER + p.sy * SPHERE_R };
}

const X_AXIS = axisLine(1, 0, 0);
const Y_AXIS = axisLine(0, 1, 0);
const Z_TOP = axisLine(0, 0, 1);
const Z_BOTTOM = axisLine(0, 0, -1);

export function BlochSphere({ qubitIndex, angle }: { qubitIndex: number; angle: BlochSphereAngle | null }) {
  // Before the first simulation result lands, default to |0> (+Z) rather than
  // showing an empty sphere — every circuit starts there.
  const effective: BlochSphereAngle = angle ?? { theta: 0, phi: 0, r: 1, pure: true };
  const mixed = !effective.pure;

  const theta = effective.theta ?? 0;
  const phi = effective.phi ?? 0;
  const bx = effective.r * Math.sin(theta) * Math.cos(phi);
  const by = effective.r * Math.sin(theta) * Math.sin(phi);
  const bz = effective.r * Math.cos(theta);

  const tip = project(bx, by, bz);
  const angleDeg = (Math.atan2(tip.sy, tip.sx) * 180) / Math.PI;
  const lengthFrac = Math.min(1, Math.sqrt(tip.sx * tip.sx + tip.sy * tip.sy));
  const color = mixed ? "#6b6a63" : hueForPhi(phi);

  const readout = mixed
    ? `mixed · r=${effective.r.toFixed(2)}`
    : `θ=${((theta * 180) / Math.PI).toFixed(0)}° φ=${(((phi + 2 * Math.PI) % (2 * Math.PI)) * (180 / Math.PI)).toFixed(0)}°`;

  return (
    <div className="bloch-sphere" aria-label={`Bloch sphere for qubit ${qubitIndex}`}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" className="bloch-sphere-svg">
        <circle cx={CENTER} cy={CENTER} r={SPHERE_R} fill="none" stroke="#383835" strokeWidth={1} />
        <path d={ellipsePath(SPHERE_R, SPHERE_R * 0.32)} fill="none" stroke="#2c2c2a" strokeWidth={1} />
        <ellipse cx={CENTER} cy={CENTER} rx={SPHERE_R * 0.32} ry={SPHERE_R} fill="none" stroke="#2c2c2a" strokeWidth={1} />

        <line x1={CENTER - (X_AXIS.x2 - CENTER)} y1={CENTER - (X_AXIS.y2 - CENTER)} x2={X_AXIS.x2} y2={X_AXIS.y2} stroke="#8a4f4f" strokeWidth={1} />
        <line x1={CENTER - (Y_AXIS.x2 - CENTER)} y1={CENTER - (Y_AXIS.y2 - CENTER)} x2={Y_AXIS.x2} y2={Y_AXIS.y2} stroke="#4f7a4f" strokeWidth={1} />
        <line x1={Z_BOTTOM.x2} y1={Z_BOTTOM.y2} x2={Z_TOP.x2} y2={Z_TOP.y2} stroke="#57575a" strokeWidth={1} />

        <text x={X_AXIS.x2 + 5} y={X_AXIS.y2 + 3} fontSize={9} fill="#8a4f4f">X</text>
        <text x={Y_AXIS.x2 + 4} y={Y_AXIS.y2 + 3} fontSize={9} fill="#4f7a4f">Y</text>
        <text x={Z_TOP.x2} y={Z_TOP.y2 - 6} fontSize={9} fill="#c3c2b7" textAnchor="middle">|0⟩</text>
        <text x={Z_BOTTOM.x2} y={Z_BOTTOM.y2 + 12} fontSize={9} fill="#c3c2b7" textAnchor="middle">|1⟩</text>

        <circle cx={CENTER} cy={CENTER} r={2} fill="#898781" />

        <g
          className="bloch-vector"
          style={{
            transform: `rotate(${angleDeg}deg) scale(${lengthFrac})`,
            transformOrigin: `${CENTER}px ${CENTER}px`,
          }}
        >
          <line
            x1={CENTER}
            y1={CENTER}
            x2={CENTER + SPHERE_R}
            y2={CENTER}
            stroke={color}
            strokeWidth={2}
            strokeDasharray={mixed ? "4 3" : undefined}
            strokeLinecap="round"
          />
          <circle cx={CENTER + SPHERE_R} cy={CENTER} r={4} fill={color} stroke="#0d0d0d" strokeWidth={0.75} />
        </g>
      </svg>
      <div className="bloch-sphere-label">
        <span className="bloch-sphere-title">Qubit {qubitIndex}</span>
        <span className="bloch-sphere-readout">{readout}</span>
      </div>
    </div>
  );
}
