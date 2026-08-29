// Safe, structured parsing & formatting for gate parameter expressions.
// Deliberately does NOT use eval() or Function() — only a fixed grammar of
// numbers, "pi", "*", "/", and unary "-" is recognized.
//
// Supported expression forms (whitespace-insensitive):
//   pi            2*pi           -pi
//   pi/2          pi/4           3*pi/4
//   1.5           -0.5           0

const PI_PATTERN = /^(-)?(\d+(?:\.\d+)?)?\*?pi(?:\/(\d+(?:\.\d+)?))?$/i;
const NUMBER_PATTERN = /^-?\d+(?:\.\d+)?$/;

export interface ParameterParseError {
  message: string;
}

/** Parse a parameter expression string into a numeric radian value. Returns null on failure. */
export function parseParameterExpression(raw: string): number | null {
  const expr = raw.trim().replace(/\s+/g, "");
  if (expr.length === 0) return null;

  if (NUMBER_PATTERN.test(expr)) {
    const n = Number(expr);
    return Number.isFinite(n) ? n : null;
  }

  const match = PI_PATTERN.exec(expr);
  if (match) {
    const [, sign, coefficient, denominator] = match;
    const coeff = coefficient ? Number(coefficient) : 1;
    const denom = denominator ? Number(denominator) : 1;
    if (!Number.isFinite(coeff) || !Number.isFinite(denom) || denom === 0) return null;
    const value = (Math.PI * coeff) / denom;
    return sign ? -value : value;
  }

  return null;
}

/** Format a numeric radian value back into a readable expression, preferring pi fractions. */
export function formatParameter(value: number): string {
  if (!Number.isFinite(value)) return "0";
  if (value === 0) return "0";

  const ratio = value / Math.PI;
  for (let denom = 1; denom <= 12; denom++) {
    const numerator = ratio * denom;
    const rounded = Math.round(numerator);
    if (Math.abs(numerator - rounded) < 1e-9 && rounded !== 0) {
      const g = gcd(Math.abs(rounded), denom);
      const n = rounded / g;
      const d = denom / g;
      const sign = n < 0 ? "-" : "";
      const absN = Math.abs(n);
      const coeffPart = absN === 1 ? "" : `${absN}*`;
      const piPart = d === 1 ? "pi" : `pi/${d}`;
      return `${sign}${coeffPart}${piPart}`;
    }
  }

  return Number(value.toFixed(6)).toString();
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
