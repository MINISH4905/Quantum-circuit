import { describe, it, expect } from "vitest";
import { runSimulation } from "../../simulation/state-vector-simulator";
import { getConceptExample } from "./conceptExample";
import type { LearningConcept } from "./types";

function makeConcept(title: string): LearningConcept {
  return { id: title, title, type: "concept", content: "", order: null, sourceFile: title, githubUrl: "" };
}

describe("getConceptExample — new entries link to the right concept titles", () => {
  it("matches Superdense coding and checkSuccess passes against its own circuit", () => {
    const example = getConceptExample(makeConcept("Superdense coding"));
    expect(example).not.toBeNull();
    const result = runSimulation(example!.build(), 2048);
    expect(example!.task.checkSuccess(result.probabilities)).toBe(true);
  });

  it("matches every teleportation title variant and checkSuccess passes against its own circuit", () => {
    for (const title of ["Quantum teleportation", "Teleportation", "Quantum Teleportation"]) {
      const example = getConceptExample(makeConcept(title));
      expect(example).not.toBeNull();
      const result = runSimulation(example!.build(), 2048);
      expect(example!.task.checkSuccess(result.probabilities)).toBe(true);
    }
  });

  it("does not attach an example to unrelated concept titles", () => {
    expect(getConceptExample(makeConcept("Introduction"))).toBeNull();
    expect(getConceptExample(makeConcept("Classical repetition codes"))).toBeNull();
  });
});
