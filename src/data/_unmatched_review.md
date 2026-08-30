# Unmatched assessments — human review required

The 24 assessment files under `src/data/tests_data/modules/` that match **no**
concept in `learning-content.json`, by directory slug or by frontmatter title.

**Nothing here has been assigned.** Candidates are ranked suggestions only.

---

## How to read this

- **Score** — `difflib` ratio, best of (frontmatter title vs concept title),
  (dir slug vs concept id), (dir slug vs concept title). Candidates are drawn
  from the same course's module only. Roughly: `>0.75` strong, `0.5–0.75`
  plausible, `<0.5` weak.
- **Taken** — that concept already has a *matched* assessment attached. Picking
  it means two assessments on one lesson.
- **Q / C** — questions and challenges in the file. **PH** = all challenges are
  `No circuit challenge` placeholders (not machine-checkable).

> Assign by **`sourceFile`**, never by concept `id` — ids are not unique even
> within one module (`introduction` occurs 23×). Every candidate below shows
> its `sourceFile`.

---

## Summary

| # | Assessment slug | Frontmatter concept | Q | C | Best score |
|---:|---|---|---:|---:|---:|
| 1 | `circuits-detail` | Circuits Details | 5 | 2 PH | 0.70 |
| 2 | `final-batch-3` | Advanced Circuits | 5 | 2 PH | 0.64 |
| 3 | `final-batch-4` | Advanced Circuits Part 2 | 5 | 2 PH | 0.50 |
| 4 | `info-detail` | Information Detail Part 2 | 5 | 2 PH | 0.52 |
| 5 | `info-detail2` | Information Detail Part 2 | 5 | 2 PH | 0.50 |
| 6 | `information-detail` | Information Detail | 5 | 2 PH | 0.59 |
| 7 | `final-batch-1` | Advanced Shor's Algorithm | 5 | 2 PH | 0.78 |
| 8 | `grover-detail` | Grover's Algorithm Detail Part 2 | 5 | 2 PH | 0.74 |
| 9 | `grover-detail2` | Grover's Algorithm Detail Part 2 | 5 | 2 PH | 0.74 |
| 10 | `sho-detail` | Shor's Algorithm Detail Part 2 | 5 | 2 PH | 0.70 |
| 11 | `sho-detail2` | Shor's Algorithm Detail Part 2 | 5 | 2 PH | 0.70 |
| 12 | `sho-detail3` | Shor's Algorithm Detail Part 3 | 5 | 2 PH | 0.70 |
| 13 | `sho-detail4` | Shor's Algorithm Detail Part 4 | 5 | 2 PH | 0.70 |
| 14 | `simon-algorithm-detail` | **(none — empty file)** | — | — | 0.81 |
| 15 | `simon-detail` | Simon's Algorithm Details | 5 | 2 PH | 0.81 |
| 16 | `final-batch-2` | Advanced Tomography | 5 | 2 PH | 0.48 |
| 17 | `final-batch-3` | Advanced Purifications | 5 | 2 PH | 0.74 |
| 18 | `final-batch-5` | Final Lesson | 5 | 2 PH | 0.40 |
| 19 | `purifications-detail` | Purifications Detail | 5 | 2 PH | 0.79 |
| 20 | `purifications-detail2` | Purifications Detail Part 2 | 5 | 2 PH | 0.77 |
| 21 | `purifications-detail3` | Purifications Detail Part 3 | 5 | 2 PH | 0.77 |
| 22 | `tomography-detail` | Tomography Detail Part 2 | 5 | 2 PH | 0.43 |
| 23 | `tomography-detail2` | Tomography Detail Part 2 | 5 | 2 PH | 0.43 |
| 24 | `tomography-detail3` | Tomography Detail Part 3 | 5 | 2 PH | 0.43 |

Counts: **24 files**, 23 with content + 1 empty. 
**21 of 24** have challenge sets that are entirely placeholders.

---

## Detail


### Course: `basics-of-quantum-information`

learning-content module id: `courses-basics-of-quantum-information`


#### 1. `circuits-detail`

| | |
|---|---|
| File | `tests_data/modules/basics-of-quantum-information/circuits-detail/assessment.md` |
| Frontmatter `concept:` | `Circuits Details` |
| Frontmatter `module:` | `basics-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.70 | `circuits` | Circuits | concept | `learning/courses/basics-of-quantum-information/quantum-circuits/circuits.ipynb` | **yes** |
| 0.44 | `qiskit-implementation` | Qiskit implementation | concept | `learning/courses/basics-of-quantum-information/entanglement-in-action/qiskit-implementation.ipynb` | **yes** |
| 0.44 | `qiskit-implementation` | Qiskit implementation | concept | `learning/courses/basics-of-quantum-information/multiple-systems/qiskit-implementation.ipynb` | **yes** |


#### 2. `final-batch-3`

| | |
|---|---|
| File | `tests_data/modules/basics-of-quantum-information/final-batch-3/assessment.md` |
| Frontmatter `concept:` | `Advanced Circuits` |
| Frontmatter `module:` | `basics-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.64 | `circuits` | Circuits | concept | `learning/courses/basics-of-quantum-information/quantum-circuits/circuits.ipynb` | **yes** |
| 0.35 | `superdense-coding` | Superdense coding | concept | `learning/courses/basics-of-quantum-information/entanglement-in-action/superdense-coding.ipynb` | **yes** |
| 0.35 | `classical-information` | Classical information | concept | `learning/courses/basics-of-quantum-information/multiple-systems/classical-information.ipynb` | **yes** |


#### 3. `final-batch-4`

| | |
|---|---|
| File | `tests_data/modules/basics-of-quantum-information/final-batch-4/assessment.md` |
| Frontmatter `concept:` | `Advanced Circuits Part 2` |
| Frontmatter `module:` | `basics-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.50 | `circuits` | Circuits | concept | `learning/courses/basics-of-quantum-information/quantum-circuits/circuits.ipynb` | **yes** |
| 0.35 | `classical-information` | Classical information | concept | `learning/courses/basics-of-quantum-information/multiple-systems/classical-information.ipynb` | **yes** |
| 0.35 | `classical-information` | Classical information | concept | `learning/courses/basics-of-quantum-information/single-systems/classical-information.ipynb` | **yes** |


#### 4. `info-detail`

| | |
|---|---|
| File | `tests_data/modules/basics-of-quantum-information/info-detail/assessment.md` |
| Frontmatter `concept:` | `Information Detail Part 2` |
| Frontmatter `module:` | `basics-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.52 | `introduction` | Introduction | concept | `learning/courses/basics-of-quantum-information/entanglement-in-action/introduction.ipynb` | no |
| 0.52 | `introduction` | Introduction | concept | `learning/courses/basics-of-quantum-information/multiple-systems/introduction.ipynb` | no |
| 0.52 | `introduction` | Introduction | concept | `learning/courses/basics-of-quantum-information/quantum-circuits/introduction.ipynb` | no |


#### 5. `info-detail2`

| | |
|---|---|
| File | `tests_data/modules/basics-of-quantum-information/info-detail2/assessment.md` |
| Frontmatter `concept:` | `Information Detail Part 2` |
| Frontmatter `module:` | `basics-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.50 | `introduction` | Introduction | concept | `learning/courses/basics-of-quantum-information/entanglement-in-action/introduction.ipynb` | no |
| 0.50 | `introduction` | Introduction | concept | `learning/courses/basics-of-quantum-information/multiple-systems/introduction.ipynb` | no |
| 0.50 | `quantum-information` | Quantum information | concept | `learning/courses/basics-of-quantum-information/multiple-systems/quantum-information.ipynb` | **yes** |


#### 6. `information-detail`

| | |
|---|---|
| File | `tests_data/modules/basics-of-quantum-information/information-detail/assessment.md` |
| Frontmatter `concept:` | `Information Detail` |
| Frontmatter `module:` | `basics-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.59 | `quantum-information` | Quantum information | concept | `learning/courses/basics-of-quantum-information/multiple-systems/quantum-information.ipynb` | **yes** |
| 0.59 | `quantum-information` | Quantum information | concept | `learning/courses/basics-of-quantum-information/single-systems/quantum-information.ipynb` | **yes** |
| 0.56 | `classical-information` | Classical information | concept | `learning/courses/basics-of-quantum-information/multiple-systems/classical-information.ipynb` | **yes** |


### Course: `fundamentals-of-quantum-algorithms`

learning-content module id: `courses-fundamentals-of-quantum-algorithms`


#### 7. `final-batch-1`

| | |
|---|---|
| File | `tests_data/modules/fundamentals-of-quantum-algorithms/final-batch-1/assessment.md` |
| Frontmatter `concept:` | `Advanced Shor's Algorithm` |
| Frontmatter `module:` | `fundamentals-of-quantum-algorithms` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.78 | `shor-algorithm` | Shor's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/shor-algorithm.ipynb` | no |
| 0.68 | `deutsch-algorithm` | Deutsch's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-algorithm.ipynb` | **yes** |
| 0.62 | `simon-algorithm` | Simon's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/simon-algorithm.ipynb` | **yes** |


#### 8. `grover-detail`

| | |
|---|---|
| File | `tests_data/modules/fundamentals-of-quantum-algorithms/grover-detail/assessment.md` |
| Frontmatter `concept:` | `Grover's Algorithm Detail Part 2` |
| Frontmatter `module:` | `fundamentals-of-quantum-algorithms` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.74 | `grover-algorithm-description` | Grover's algorithm description | concept | `learning/courses/fundamentals-of-quantum-algorithms/grover-algorithm/grover-algorithm-description.ipynb` | no |
| 0.58 | `shor-algorithm` | Shor's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/shor-algorithm.ipynb` | no |
| 0.53 | `simon-algorithm` | Simon's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/simon-algorithm.ipynb` | **yes** |


#### 9. `grover-detail2`

| | |
|---|---|
| File | `tests_data/modules/fundamentals-of-quantum-algorithms/grover-detail2/assessment.md` |
| Frontmatter `concept:` | `Grover's Algorithm Detail Part 2` |
| Frontmatter `module:` | `fundamentals-of-quantum-algorithms` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.74 | `grover-algorithm-description` | Grover's algorithm description | concept | `learning/courses/fundamentals-of-quantum-algorithms/grover-algorithm/grover-algorithm-description.ipynb` | no |
| 0.58 | `shor-algorithm` | Shor's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/shor-algorithm.ipynb` | no |
| 0.53 | `simon-algorithm` | Simon's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/simon-algorithm.ipynb` | **yes** |


#### 10. `sho-detail`

| | |
|---|---|
| File | `tests_data/modules/fundamentals-of-quantum-algorithms/sho-detail/assessment.md` |
| Frontmatter `concept:` | `Shor's Algorithm Detail Part 2` |
| Frontmatter `module:` | `fundamentals-of-quantum-algorithms` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.70 | `shor-algorithm` | Shor's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/shor-algorithm.ipynb` | no |
| 0.63 | `grover-algorithm-description` | Grover's algorithm description | concept | `learning/courses/fundamentals-of-quantum-algorithms/grover-algorithm/grover-algorithm-description.ipynb` | no |
| 0.60 | `simon-algorithm` | Simon's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/simon-algorithm.ipynb` | **yes** |


#### 11. `sho-detail2`

| | |
|---|---|
| File | `tests_data/modules/fundamentals-of-quantum-algorithms/sho-detail2/assessment.md` |
| Frontmatter `concept:` | `Shor's Algorithm Detail Part 2` |
| Frontmatter `module:` | `fundamentals-of-quantum-algorithms` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.70 | `shor-algorithm` | Shor's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/shor-algorithm.ipynb` | no |
| 0.63 | `grover-algorithm-description` | Grover's algorithm description | concept | `learning/courses/fundamentals-of-quantum-algorithms/grover-algorithm/grover-algorithm-description.ipynb` | no |
| 0.60 | `simon-algorithm` | Simon's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/simon-algorithm.ipynb` | **yes** |


#### 12. `sho-detail3`

| | |
|---|---|
| File | `tests_data/modules/fundamentals-of-quantum-algorithms/sho-detail3/assessment.md` |
| Frontmatter `concept:` | `Shor's Algorithm Detail Part 3` |
| Frontmatter `module:` | `fundamentals-of-quantum-algorithms` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.70 | `shor-algorithm` | Shor's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/shor-algorithm.ipynb` | no |
| 0.63 | `grover-algorithm-description` | Grover's algorithm description | concept | `learning/courses/fundamentals-of-quantum-algorithms/grover-algorithm/grover-algorithm-description.ipynb` | no |
| 0.60 | `simon-algorithm` | Simon's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/simon-algorithm.ipynb` | **yes** |


#### 13. `sho-detail4`

| | |
|---|---|
| File | `tests_data/modules/fundamentals-of-quantum-algorithms/sho-detail4/assessment.md` |
| Frontmatter `concept:` | `Shor's Algorithm Detail Part 4` |
| Frontmatter `module:` | `fundamentals-of-quantum-algorithms` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.70 | `shor-algorithm` | Shor's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/shor-algorithm.ipynb` | no |
| 0.63 | `grover-algorithm-description` | Grover's algorithm description | concept | `learning/courses/fundamentals-of-quantum-algorithms/grover-algorithm/grover-algorithm-description.ipynb` | no |
| 0.60 | `simon-algorithm` | Simon's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/simon-algorithm.ipynb` | **yes** |


#### 14. `simon-algorithm-detail`

| | |
|---|---|
| File | `tests_data/modules/fundamentals-of-quantum-algorithms/simon-algorithm-detail/assessment.md` |
| Frontmatter `concept:` | **absent — file is 0 bytes** |
| Frontmatter `module:` | **absent** |
| Content | **EMPTY (0 bytes) — needs regeneration, see `_defects_report.md` §1** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.81 | `simon-algorithm` | Simon's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/simon-algorithm.ipynb` | **yes** |
| 0.67 | `shor-algorithm` | Shor's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/shor-algorithm.ipynb` | no |
| 0.64 | `grover-algorithm-description` | Grover's algorithm description | concept | `learning/courses/fundamentals-of-quantum-algorithms/grover-algorithm/grover-algorithm-description.ipynb` | no |


#### 15. `simon-detail`

| | |
|---|---|
| File | `tests_data/modules/fundamentals-of-quantum-algorithms/simon-detail/assessment.md` |
| Frontmatter `concept:` | `Simon's Algorithm Details` |
| Frontmatter `module:` | `fundamentals-of-quantum-algorithms` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.81 | `simon-algorithm` | Simon's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/simon-algorithm.ipynb` | **yes** |
| 0.68 | `shor-algorithm` | Shor's algorithm | concept | `learning/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/shor-algorithm.ipynb` | no |
| 0.66 | `grover-algorithm-description` | Grover's algorithm description | concept | `learning/courses/fundamentals-of-quantum-algorithms/grover-algorithm/grover-algorithm-description.ipynb` | no |


### Course: `general-formulation-of-quantum-information`

learning-content module id: `courses-general-formulation-of-quantum-information`


#### 16. `final-batch-2`

| | |
|---|---|
| File | `tests_data/modules/general-formulation-of-quantum-information/final-batch-2/assessment.md` |
| Frontmatter `concept:` | `Advanced Tomography` |
| Frontmatter `module:` | `general-formulation-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.48 | `discrimination-and-tomography` | Quantum state discrimination and tomography | concept | `learning/courses/general-formulation-of-quantum-information/general-measurements/discrimination-and-tomography.ipynb` | **yes** |
| 0.40 | `quantum-channel-basics` | Quantum channel basics | concept | `learning/courses/general-formulation-of-quantum-information/quantum-channels/quantum-channel-basics.ipynb` | **yes** |
| 0.38 | `fidelity` | Fidelity | concept | `learning/courses/general-formulation-of-quantum-information/purifications-and-fidelity/fidelity.ipynb` | **yes** |


#### 17. `final-batch-3`

| | |
|---|---|
| File | `tests_data/modules/general-formulation-of-quantum-information/final-batch-3/assessment.md` |
| Frontmatter `concept:` | `Advanced Purifications` |
| Frontmatter `module:` | `general-formulation-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.74 | `purifications` | Purifications | concept | `learning/courses/general-formulation-of-quantum-information/purifications-and-fidelity/purifications.ipynb` | **yes** |
| 0.53 | `representations-of-channels` | Channel representations | concept | `learning/courses/general-formulation-of-quantum-information/quantum-channels/representations-of-channels.ipynb` | no |
| 0.50 | `representation-equivalence` | Equivalence of the representations | concept | `learning/courses/general-formulation-of-quantum-information/quantum-channels/representation-equivalence.ipynb` | no |


#### 18. `final-batch-5`

| | |
|---|---|
| File | `tests_data/modules/general-formulation-of-quantum-information/final-batch-5/assessment.md` |
| Frontmatter `concept:` | `Final Lesson` |
| Frontmatter `module:` | `general-formulation-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.40 | `purifications` | Purifications | concept | `learning/courses/general-formulation-of-quantum-information/purifications-and-fidelity/purifications.ipynb` | **yes** |
| 0.40 | `quantum-channel-basics` | Quantum channel basics | concept | `learning/courses/general-formulation-of-quantum-information/quantum-channels/quantum-channel-basics.ipynb` | **yes** |
| 0.40 | `representations-of-channels` | Channel representations | concept | `learning/courses/general-formulation-of-quantum-information/quantum-channels/representations-of-channels.ipynb` | no |


#### 19. `purifications-detail`

| | |
|---|---|
| File | `tests_data/modules/general-formulation-of-quantum-information/purifications-detail/assessment.md` |
| Frontmatter `concept:` | `Purifications Detail` |
| Frontmatter `module:` | `general-formulation-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.79 | `purifications` | Purifications | concept | `learning/courses/general-formulation-of-quantum-information/purifications-and-fidelity/purifications.ipynb` | **yes** |
| 0.49 | `discrimination-and-tomography` | Quantum state discrimination and tomography | concept | `learning/courses/general-formulation-of-quantum-information/general-measurements/discrimination-and-tomography.ipynb` | **yes** |
| 0.48 | `representation-equivalence` | Equivalence of the representations | concept | `learning/courses/general-formulation-of-quantum-information/quantum-channels/representation-equivalence.ipynb` | no |


#### 20. `purifications-detail2`

| | |
|---|---|
| File | `tests_data/modules/general-formulation-of-quantum-information/purifications-detail2/assessment.md` |
| Frontmatter `concept:` | `Purifications Detail Part 2` |
| Frontmatter `module:` | `general-formulation-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.77 | `purifications` | Purifications | concept | `learning/courses/general-formulation-of-quantum-information/purifications-and-fidelity/purifications.ipynb` | **yes** |
| 0.48 | `discrimination-and-tomography` | Quantum state discrimination and tomography | concept | `learning/courses/general-formulation-of-quantum-information/general-measurements/discrimination-and-tomography.ipynb` | **yes** |
| 0.47 | `representation-equivalence` | Equivalence of the representations | concept | `learning/courses/general-formulation-of-quantum-information/quantum-channels/representation-equivalence.ipynb` | no |


#### 21. `purifications-detail3`

| | |
|---|---|
| File | `tests_data/modules/general-formulation-of-quantum-information/purifications-detail3/assessment.md` |
| Frontmatter `concept:` | `Purifications Detail Part 3` |
| Frontmatter `module:` | `general-formulation-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.77 | `purifications` | Purifications | concept | `learning/courses/general-formulation-of-quantum-information/purifications-and-fidelity/purifications.ipynb` | **yes** |
| 0.48 | `discrimination-and-tomography` | Quantum state discrimination and tomography | concept | `learning/courses/general-formulation-of-quantum-information/general-measurements/discrimination-and-tomography.ipynb` | **yes** |
| 0.47 | `representation-equivalence` | Equivalence of the representations | concept | `learning/courses/general-formulation-of-quantum-information/quantum-channels/representation-equivalence.ipynb` | no |


#### 22. `tomography-detail`

| | |
|---|---|
| File | `tests_data/modules/general-formulation-of-quantum-information/tomography-detail/assessment.md` |
| Frontmatter `concept:` | `Tomography Detail Part 2` |
| Frontmatter `module:` | `general-formulation-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.43 | `discrimination-and-tomography` | Quantum state discrimination and tomography | concept | `learning/courses/general-formulation-of-quantum-information/general-measurements/discrimination-and-tomography.ipynb` | **yes** |
| 0.33 | `representation-equivalence` | Equivalence of the representations | concept | `learning/courses/general-formulation-of-quantum-information/quantum-channels/representation-equivalence.ipynb` | no |
| 0.32 | `convex-combinations` | Convex combinations of density matrices | concept | `learning/courses/general-formulation-of-quantum-information/density-matrices/convex-combinations.ipynb` | **yes** |


#### 23. `tomography-detail2`

| | |
|---|---|
| File | `tests_data/modules/general-formulation-of-quantum-information/tomography-detail2/assessment.md` |
| Frontmatter `concept:` | `Tomography Detail Part 2` |
| Frontmatter `module:` | `general-formulation-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.43 | `discrimination-and-tomography` | Quantum state discrimination and tomography | concept | `learning/courses/general-formulation-of-quantum-information/general-measurements/discrimination-and-tomography.ipynb` | **yes** |
| 0.32 | `representation-equivalence` | Equivalence of the representations | concept | `learning/courses/general-formulation-of-quantum-information/quantum-channels/representation-equivalence.ipynb` | no |
| 0.32 | `convex-combinations` | Convex combinations of density matrices | concept | `learning/courses/general-formulation-of-quantum-information/density-matrices/convex-combinations.ipynb` | **yes** |


#### 24. `tomography-detail3`

| | |
|---|---|
| File | `tests_data/modules/general-formulation-of-quantum-information/tomography-detail3/assessment.md` |
| Frontmatter `concept:` | `Tomography Detail Part 3` |
| Frontmatter `module:` | `general-formulation-of-quantum-information` |
| Content | 5 questions, 2 challenge(s) — **all placeholder targets** |

Candidates:

| Score | Concept id | Title | Type | sourceFile | Taken |
|---:|---|---|---|---|---|
| 0.43 | `discrimination-and-tomography` | Quantum state discrimination and tomography | concept | `learning/courses/general-formulation-of-quantum-information/general-measurements/discrimination-and-tomography.ipynb` | **yes** |
| 0.32 | `representation-equivalence` | Equivalence of the representations | concept | `learning/courses/general-formulation-of-quantum-information/quantum-channels/representation-equivalence.ipynb` | no |
| 0.32 | `convex-combinations` | Convex combinations of density matrices | concept | `learning/courses/general-formulation-of-quantum-information/density-matrices/convex-combinations.ipynb` | **yes** |


---

## Patterns worth noting before assigning

**1. Duplicate `concept:` titles.** Several distinct directories declare the
*same* title, so title matching cannot separate them even manually:

| Title | Claimed by |
|---|---|
| `Information Detail Part 2` | `info-detail`, `info-detail2` |
| `Grover's Algorithm Detail Part 2` | `grover-detail`, `grover-detail2` |
| `Shor's Algorithm Detail Part 2` | `sho-detail`, `sho-detail2` |
| `Tomography Detail Part 2` | `tomography-detail`, `tomography-detail2` |

**2. `Part N` series with no counterpart.** `sho-detail` → `sho-detail4` and
`purifications-detail` → `purifications-detail3` imply multi-part lessons that
do not exist upstream. The Qiskit courses have one `Shor's algorithm` lesson,
not four. These look like generated filler rather than real curriculum.

**3. `final-batch-N` names are not curriculum.** `final-batch-1/2/3/4/5` are
generation-run artifacts. Note `final-batch-3` appears in **two** different
courses with different content.

**4. They correlate with low quality.** 21 of these 24 have challenge sets that
are entirely `No circuit challenge` placeholders, versus near-zero among the 32
matched files. Evidence they came from one lower-quality batch — worth deciding
on the cohort as a whole rather than file by file.

**5. Real lessons currently have no assessment.** If some of these are
reassigned, these uncovered concepts are the natural targets:

| Concept id | Title | Module |
|---|---|---|
| `grover-algorithm-description` | Grover's algorithm description | `courses-fundamentals-of-quantum-algorithms` |
| `shor-algorithm` | Shor's algorithm | `courses-fundamentals-of-quantum-algorithms` |
| `bloch-sphere` | Bloch sphere | `courses-general-formulation-of-quantum-information` |
| `convex-combinations` | Convex combinations of density matrices | `courses-general-formulation-of-quantum-information` |
| `density-matrix-basics` | Density matrix basics | `courses-general-formulation-of-quantum-information` |
| `representation-equivalence` | Equivalence of the representations | `courses-general-formulation-of-quantum-information` |
| `representations-of-channels` | Channel representations | `courses-general-formulation-of-quantum-information` |

---

## Recommended next step

Treat these as three groups rather than 24 individual decisions:

- **Strong (score ≥ 0.74, 9 files)** — `circuits-detail`, `final-batch-1`,
  `grover-detail`, `grover-detail2`, `simon-detail`, `simon-algorithm-detail`,
  `final-batch-3` (gen-form), `purifications-detail`, `purifications-detail2/3`.
  A human can confirm each in seconds. Most map to a lesson that **already has**
  an assessment, so the real question is whether to keep both.
- **Weak (score < 0.5, 5 files)** — `final-batch-5` ("Final Lesson"),
  `final-batch-2`, `tomography-detail*`. No plausible target; likeliest drop.
- **Blocked (1 file)** — `simon-algorithm-detail` is empty. Regenerate before
  any mapping decision.

