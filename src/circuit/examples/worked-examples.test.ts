import { describe, it, expect } from "vitest";
import { buildDeutschJozsaCircuit, buildGroverCircuit } from "./worked-examples";
import { validateCircuit } from "../validation/validate";
import { runSimulation } from "../../simulation/state-vector-simulator";

describe("Deutsch-Jozsa worked example", () => {
  it("is valid and reports balanced (never 00)", () => {
    const circuit = buildDeutschJozsaCircuit();
    expect(validateCircuit(circuit)).toEqual([]);
    const result = runSimulation(circuit, 1024);
    expect(result.probabilities["00"] ?? 0).toBeLessThan(1e-9);
  });
});

describe("Grover worked example", () => {
  it("is valid and finds |11> with probability ~1", () => {
    const circuit = buildGroverCircuit();
    expect(validateCircuit(circuit)).toEqual([]);
    const result = runSimulation(circuit, 1024);
    expect(result.probabilities["11"]).toBeGreaterThan(0.99);
  });
});
