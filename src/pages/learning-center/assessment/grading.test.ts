// @vitest-environment node
//
// Pure grading logic — no DOM needed, so this file opts out of the config's
// global jsdom environment. (jsdom also can't load under Node < 20.19, which
// require()s an ESM dep and throws ERR_REQUIRE_ESM.)
import { describe, it, expect } from "vitest";
import { gradeQuiz, gradeChallenge, isAutoGradable, normalizeLearnerCode } from "./grading";
import learningContentRaw from "../../../data/learning-content.json";
import type { AssessmentChallenge, AssessmentQuestion, LearningContentData, LearningConcept } from "../types";

const content = learningContentRaw as unknown as LearningContentData;

function allAssessmentConcepts(): LearningConcept[] {
  return content.roadmap.flatMap((stage) =>
    stage.modules.flatMap((m) => m.concepts.filter((c) => c.type === "assessment"))
  );
}

const questions: AssessmentQuestion[] = [
  {
    id: "Q1",
    question: "First?",
    options: [
      { key: "A", text: "no" },
      { key: "B", text: "yes" },
    ],
    correct: "B",
    explanation: "because yes",
  },
  {
    id: "Q2",
    question: "Second?",
    options: [
      { key: "A", text: "yes" },
      { key: "B", text: "no" },
    ],
    correct: "A",
    explanation: "because yes",
  },
];

function bellChallenge(target: Record<string, number>, tolerance = 0.1): AssessmentChallenge {
  return {
    id: "c1",
    title: "Bell state",
    difficulty: "introductory",
    description: "Build a Bell state.",
    starterCode: "",
    target: { type: "measurement_probability", target, tolerance },
  };
}

const BELL_ANSWER = `qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure(0, 0)
qc.measure(1, 1)`;

describe("gradeQuiz", () => {
  it("scores a fully correct submission", () => {
    const grade = gradeQuiz(questions, ["B", "A"]);
    expect(grade.score).toBe(2);
    expect(grade.total).toBe(2);
    expect(grade.results.every((r) => r.isCorrect)).toBe(true);
  });

  it("scores a fully wrong submission and still reports the correct key", () => {
    const grade = gradeQuiz(questions, ["A", "B"]);
    expect(grade.score).toBe(0);
    expect(grade.results[0]).toEqual({ index: 0, id: "Q1", chosen: "A", correct: "B", isCorrect: false });
  });

  it("counts unanswered questions as wrong rather than skipping them", () => {
    const grade = gradeQuiz(questions, ["B"]);
    expect(grade.score).toBe(1);
    expect(grade.total).toBe(2);
    expect(grade.results[1].chosen).toBeNull();
    expect(grade.results[1].isCorrect).toBe(false);
  });

  it("grades questions that share an id independently", () => {
    // Seven shipped assessments repeat a question id (Q1,Q2,Q3,Q3,Q5), so
    // position — not id — must be the identity. Same id, different answers.
    const dupes: AssessmentQuestion[] = [
      { ...questions[0], id: "Q3" },
      { ...questions[1], id: "Q3" },
    ];
    const grade = gradeQuiz(dupes, ["B", "B"]);
    expect(grade.score).toBe(1);
    expect(grade.results[0].isCorrect).toBe(true);
    expect(grade.results[1].isCorrect).toBe(false);
    expect(grade.results.map((r) => r.index)).toEqual([0, 1]);
  });
});

describe("isAutoGradable", () => {
  it("accepts measurement_probability targets", () => {
    expect(isAutoGradable(bellChallenge({ "00": 0.5, "11": 0.5 }))).toBe(true);
  });

  it("rejects statevector, value and null targets", () => {
    const base = bellChallenge({});
    expect(isAutoGradable({ ...base, target: { type: "statevector", target: "|Φ+⟩", tolerance: 0.001 } })).toBe(false);
    expect(isAutoGradable({ ...base, target: { type: "value", target: { gcd_1: 1 }, tolerance: 0.01 } })).toBe(false);
    expect(isAutoGradable({ ...base, target: null })).toBe(false);
  });

  it("rejects a measurement_probability target that isn't really one", () => {
    // Two shipped challenges are mislabelled: label keys, comparison-string
    // values, describing a two-circuit comparison. Unpassable, so not shown.
    const mislabelled = {
      ...bellChallenge({}),
      target: {
        type: "measurement_probability" as const,
        target: { "11_1iter": ">0.7", "11_2iter": ">0.7" } as unknown as Record<string, number>,
        tolerance: 0.1,
      },
    };
    expect(isAutoGradable(mislabelled)).toBe(false);
  });

  it("rejects empty, non-numeric and ragged-width targets", () => {
    expect(isAutoGradable(bellChallenge({}))).toBe(false);
    expect(isAutoGradable(bellChallenge({ "00": NaN }))).toBe(false);
    expect(isAutoGradable(bellChallenge({ "0": 0.5, "11": 0.5 }))).toBe(false);
    expect(isAutoGradable(bellChallenge({ "0x": 1 } as Record<string, number>))).toBe(false);
  });
});

describe("normalizeLearnerCode", () => {
  it("flattens the def-wrapped starter shape the content ships", () => {
    const wrapped = `from qiskit import QuantumCircuit

def chsh_bell_state(qc: QuantumCircuit, qs: list) -> QuantumCircuit:
    qc = QuantumCircuit(2, 2)
    qc.h(0)
    qc.cx(0, 1)
    return qc`;
    const flat = normalizeLearnerCode(wrapped);
    expect(flat).toContain("qc = QuantumCircuit(2, 2)");
    expect(flat).not.toMatch(/^\s+qc\.h\(0\)/m);
    expect(flat).not.toContain("def ");
    expect(flat).not.toContain("return");
  });

  it("preserves line numbering so parse errors still line up", () => {
    const wrapped = `def f(qc):
    qc = QuantumCircuit(1)
    qc.bogus(0)`;
    const flat = normalizeLearnerCode(wrapped);
    expect(flat.split("\n")).toHaveLength(3);
    expect(flat.split("\n")[2]).toBe("qc.bogus(0)");
    // The bad call was on line 3 of the learner's editor; the error must say 3.
    const grade = gradeChallenge(bellChallenge({ "0": 1 }), wrapped);
    expect(grade.parseErrors[0].line).toBe(3);
  });

  it("leaves already-flat code untouched", () => {
    expect(normalizeLearnerCode(BELL_ANSWER)).toBe(BELL_ANSWER);
  });
});

describe("gradeChallenge", () => {
  it("passes a correct Bell-state answer", () => {
    const grade = gradeChallenge(bellChallenge({ "00": 0.5, "11": 0.5 }), BELL_ANSWER);
    expect(grade.parseErrors).toEqual([]);
    expect(grade.ok).toBe(true);
    expect(grade.worstDelta).toBeLessThan(1e-9);
  });

  it("passes the same answer written in the def-wrapped starter shape", () => {
    const wrapped = `def build(qc, qs):
${BELL_ANSWER.split("\n")
  .map((l) => `    ${l}`)
  .join("\n")}
    return qc`;
    expect(gradeChallenge(bellChallenge({ "00": 0.5, "11": 0.5 }), wrapped).ok).toBe(true);
  });

  it("fails a circuit that produces the wrong distribution", () => {
    const grade = gradeChallenge(bellChallenge({ "00": 0.5, "11": 0.5 }), "qc = QuantumCircuit(2, 2)\nqc.h(0)");
    expect(grade.ok).toBe(false);
    expect(grade.worstDelta).toBeGreaterThan(0.1);
  });

  it("treats a target key missing from the simulation as zero", () => {
    // A plain Bell state never yields 01/10; the target says so explicitly.
    const grade = gradeChallenge(bellChallenge({ "00": 0.5, "01": 0, "10": 0, "11": 0.5 }), BELL_ANSWER);
    expect(grade.ok).toBe(true);
    expect(grade.rows.map((r) => r.bitstring)).toEqual(["00", "01", "10", "11"]);
  });

  it("fails an extra unwanted outcome the target didn't list", () => {
    // Target expects only |00>, but H on qubit 0 also produces |01>.
    const grade = gradeChallenge(bellChallenge({ "00": 1 }), "qc = QuantumCircuit(2, 2)\nqc.h(0)");
    expect(grade.ok).toBe(false);
    expect(grade.rows.find((r) => r.bitstring === "01")?.actual).toBeCloseTo(0.5, 6);
  });

  it("respects the per-challenge tolerance at the boundary", () => {
    const answer = "qc = QuantumCircuit(1, 1)\nqc.h(0)";
    // Actual is 0.5/0.5; a 0.45 target is 0.05 off — inside 0.1, outside 0.01.
    expect(gradeChallenge(bellChallenge({ "0": 0.45, "1": 0.55 }, 0.1), answer).ok).toBe(true);
    expect(gradeChallenge(bellChallenge({ "0": 0.45, "1": 0.55 }, 0.01), answer).ok).toBe(false);
  });

  it("surfaces parse errors with line numbers instead of grading", () => {
    const grade = gradeChallenge(bellChallenge({ "00": 0.5, "11": 0.5 }), "qc = QuantumCircuit(2)\nqc.toffoli(0, 1, 2)");
    expect(grade.ok).toBe(false);
    expect(grade.parseErrors).toHaveLength(1);
    expect(grade.parseErrors[0].line).toBe(2);
  });

  it("explains an answer with no circuit at all", () => {
    // The parser reports this itself, so it arrives as a line-1 parse error
    // rather than a bare message.
    const grade = gradeChallenge(bellChallenge({ "00": 1 }), "# Your code here");
    expect(grade.ok).toBe(false);
    expect(grade.parseErrors).toHaveLength(1);
    expect(grade.parseErrors[0].message).toMatch(/QuantumCircuit/);
  });

  it("refuses to grade a non-gradable target", () => {
    const challenge = { ...bellChallenge({}), target: null };
    const grade = gradeChallenge(challenge, BELL_ANSWER);
    expect(grade.ok).toBe(false);
    expect(grade.message).toMatch(/not auto-graded/i);
  });
});

// The assessment content is regenerated by `npm run fetch-content`. These guards
// fail loudly on schema drift instead of letting the UI silently render blanks.
describe("learning-content.json assessment shape", () => {
  const concepts = allAssessmentConcepts();

  it("has assessment nodes, each with a structured assessment object", () => {
    expect(concepts.length).toBeGreaterThan(0);
    for (const c of concepts) {
      expect(c.assessment, `${c.sourceFile} is type "assessment" but has no assessment object`).toBeDefined();
    }
  });

  it("gives every question options, a correct key that exists, and an explanation", () => {
    for (const c of concepts) {
      for (const q of c.assessment!.questions) {
        const where = `${c.sourceFile} ${q.id}`;
        expect(q.options.length, `${where} has no options`).toBeGreaterThan(1);
        expect(q.question.trim(), `${where} has no question text`).not.toBe("");
        expect(q.explanation.trim(), `${where} has no explanation`).not.toBe("");
        expect(q.options.map((o) => o.key), `${where} correct key "${q.correct}" is not an option`).toContain(q.correct);
      }
    }
  });

  it("still grades correctly on the assessments whose question ids repeat", () => {
    // Known content defect: 7 assessments run Q1,Q2,Q3,Q3,Q5. Rather than
    // assert uniqueness (which fails on real data), assert the thing we
    // actually depend on — that grading is positional and unaffected.
    const withDupes = concepts.filter((c) => {
      const ids = c.assessment!.questions.map((q) => q.id);
      return new Set(ids).size !== ids.length;
    });
    expect(withDupes.length).toBeGreaterThan(0);

    for (const c of withDupes) {
      const qs = c.assessment!.questions;
      const allCorrect = gradeQuiz(qs, qs.map((q) => q.correct));
      expect(allCorrect.score, `${c.sourceFile} should score full marks on its own key`).toBe(qs.length);
      expect(allCorrect.results.map((r) => r.index)).toEqual(qs.map((_, i) => i));
    }
  });

  it("finds auto-gradable challenges, and every one carries usable starter code", () => {
    const gradable = concepts.flatMap((c) => c.assessment!.challenges.filter(isAutoGradable));
    expect(gradable.length).toBeGreaterThan(0);
    for (const ch of gradable) {
      expect(typeof ch.starterCode, `${ch.id} has no starterCode`).toBe("string");
      expect(Object.keys(ch.target!.target as Record<string, number>).length).toBeGreaterThan(0);
    }
  });

  it("does not accept the untouched starter stub as a correct answer", () => {
    // Every starter is a stub with the body left to the learner, so grading it
    // as-is must fail — otherwise the challenge would be free marks.
    const gradable = concepts.flatMap((c) => c.assessment!.challenges.filter(isAutoGradable));
    for (const ch of gradable) {
      expect(gradeChallenge(ch, ch.starterCode).ok, `${ch.id} starter code passes without any work`).toBe(false);
    }
  });
});
