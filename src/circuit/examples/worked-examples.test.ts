import { describe, it, expect } from "vitest";
import {
  buildDeutschJozsaCircuit,
  buildGroverCircuit,
  buildBellStateCircuit,
  buildGHZCircuit,
  buildTeleportationCircuit,
  buildSuperdenseCodingCircuit,
} from "./worked-examples";
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

describe("Bell State worked example", () => {
  it("is valid and produces ~50% |00> and ~50% |11>", () => {
    const circuit = buildBellStateCircuit();
    expect(validateCircuit(circuit)).toEqual([]);
    const result = runSimulation(circuit, 1024);
    expect(result.probabilities["00"]).toBeCloseTo(0.5, 1);
    expect(result.probabilities["11"]).toBeCloseTo(0.5, 1);
  });
});

describe("GHZ State worked example", () => {
  it("is valid and produces ~50% |000> and ~50% |111>", () => {
    const circuit = buildGHZCircuit();
    expect(validateCircuit(circuit)).toEqual([]);
    const result = runSimulation(circuit, 1024);
    expect(result.probabilities["000"]).toBeCloseTo(0.5, 1);
    expect(result.probabilities["111"]).toBeCloseTo(0.5, 1);
  });
});

describe("Teleportation worked example", () => {
  it("is valid", () => {
    const circuit = buildTeleportationCircuit();
    expect(validateCircuit(circuit)).toEqual([]);
  });
});

describe("Superdense Coding worked example", () => {
  it("is valid and decodes to |11>", () => {
    const circuit = buildSuperdenseCodingCircuit();
    expect(validateCircuit(circuit)).toEqual([]);
    const result = runSimulation(circuit, 1024);
    expect(result.probabilities["11"]).toBeGreaterThan(0.99);
  });
});
