let counter = 1;

/** Generate a unique operation id. Used by the parser and other IR builders. */
export function generateOperationId(prefix = "op"): string {
  return `${prefix}_${counter++}`;
}
