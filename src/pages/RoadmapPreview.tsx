import { RoadmapRevamp, type RevampStage } from "./learner-module/RoadmapRevamp";

/* Design preview for the revamped learner roadmap.
 *
 * Static mock data only — nothing here touches useLearningData,
 * useLearningProgress or the learner stores. The module names mirror the real
 * curriculum and progress is seeded so every visual state is on screen at once
 * (completed / in-progress / not-started, filled + partial + empty connectors,
 * and the "next up" lesson highlight). Delete this file and its route once the
 * design is signed off and RoadmapRevamp is wired to real data.
 */

function lessons(titles: string[], completeCount: number, currentIndex = -1) {
  return titles.map((title, i) => ({
    id: `${title}-${i}`,
    title,
    complete: i < completeCount,
    current: i === currentIndex,
  }));
}

const STAGES: RevampStage[] = [
  {
    id: "foundations",
    title: "Foundations of Quantum Computing",
    modules: [
      {
        id: "basics",
        title: "Basics of Quantum Information",
        estimatedTime: "6 hr",
        lessons: lessons(
          [
            "Single systems",
            "Multiple systems",
            "Quantum circuits",
            "Entanglement in action",
            "Superdense coding",
            "Quantum teleportation",
          ],
          6
        ),
      },
      {
        id: "use-qc",
        title: "Use a QC Today",
        estimatedTime: "2 hr",
        lessons: lessons(
          ["Set up your environment", "Run your first circuit", "Read the results", "Primitives overview"],
          2,
          2
        ),
      },
    ],
  },
  {
    id: "algorithms",
    title: "Quantum Algorithms",
    modules: [
      {
        id: "fundamentals",
        title: "Fundamentals of Quantum Algorithms",
        estimatedTime: "8 hr",
        lessons: lessons(
          [
            "Quantum query algorithms",
            "Quantum algorithmic foundations",
            "Phase estimation",
            "Grover's algorithm",
            "Order finding and factoring",
          ],
          0
        ),
      },
      {
        id: "variational",
        title: "Variational Algorithm Design",
        estimatedTime: "5 hr",
        lessons: lessons(["Reference states", "Ansatz and variational forms", "Cost functions", "Optimization loops"], 0),
      },
      {
        id: "diagonalization",
        title: "Quantum Diagonalization Algorithms",
        estimatedTime: "4 hr",
        lessons: lessons(["Krylov quantum diagonalization", "Sample-based diagonalization", "Noise and mitigation"], 0),
      },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Topics",
    modules: [
      {
        id: "qec",
        title: "Foundations of Quantum Error Correction",
        estimatedTime: "9 hr",
        lessons: lessons(
          ["Correcting quantum errors", "Stabilizer formalism", "Surface codes", "Fault-tolerant gates"],
          0
        ),
      },
    ],
  },
];

export function RoadmapPreview() {
  return (
    <RoadmapRevamp
      roleLabel="Software Developer"
      stages={STAGES}
      streak={4}
      handsOnCompleted={3}
      handsOnTotal={11}
      resume={{
        moduleTitle: "Use a QC Today",
        lessonTitle: "Read the results",
        nextLessonTitle: "Primitives overview",
      }}
    />
  );
}
