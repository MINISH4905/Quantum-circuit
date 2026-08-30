# Data-quality defects: `tests_data/`

Pass run before any merge work. One file was deleted (§2); **nothing else was
modified**. Everything else below is flagged, not fixed.

Scope: all 56 `assessment.md` files under `src/data/tests_data/modules/`, plus
the surrounding metadata files.

---

## 1. Empty file — NEEDS REGENERATION, excluded from merge

| | |
|---|---|
| **File** | `modules/fundamentals-of-quantum-algorithms/simon-algorithm-detail/assessment.md` |
| **Size** | **0 bytes** |
| **MD5** | `d41d8cd98f00b204e9800998ecf8427e` (identical to `/dev/null`) |
| **Status** | **NEEDS REGENERATION** |
| **Action taken** | None — left empty, as instructed. No content fabricated. |

The file is completely empty: no frontmatter, no `## Quiz`, no `## Challenges`,
zero questions, zero challenges. Its `concept:` field cannot be read because
there is no frontmatter, so it also has no title to reconcile against
`learning-content.json`.

> **Do not include this file in any merge until it has been regenerated.**
> It is the only assessment file with no recoverable content.

Its directory slug `simon-algorithm-detail` is also one of the 24 unmatched
slugs — see `_unmatched_review.md`. Both problems must be resolved before it can
be merged: regenerate the content **and** decide which lesson it attaches to.

---

## 2. Misnamed duplicate — DELETED

| | |
|---|---|
| **Removed** | `modules/fundamentals-of-quantum-algorithms/quanticalgorithmic-foundations/factoring-and-gcd.ipynb` |
| **Kept** | `modules/fundamentals-of-quantum-algorithms/quanticalgorithmic-foundations/factoring-and-gcd/assessment.md` |

Confirmed before deletion:

```
.ipynb : 4822 bytes  md5=0966a137d3a704aa23f6941f1dbfd757
.md    : 4822 bytes  md5=0966a137d3a704aa23f6941f1dbfd757
cmp    : BYTE-IDENTICAL
```

Two independent confirmations that the `.ipynb` was not a notebook:

1. `json.load()` fails immediately — `JSONDecodeError: Expecting value: line 1
   column 1 (char 0)`. A real `.ipynb` is a JSON document.
2. Its first line is `---`, i.e. YAML frontmatter. The content is assessment
   markdown with the standard `module:` / `concept: Two Examples: Factoring and
   GCDs` / `difficulty_progression:` header.

The correctly-named `.md` original was retained unchanged. No `.ipynb` files
remain anywhere under `tests_data/`.

Left as-is (flagged, not fixed): the parent directory is misspelled —
`quanticalgorithmic-foundations` should be `quantum-algorithmic-foundations`,
which is the real path segment in the Qiskit repo
(`learning/courses/fundamentals-of-quantum-algorithms/quantum-algorithmic-foundations/`).
Renaming it would change a join key, so it is left for a human decision.

---

## 3. Other structural anomalies — flagged, not fixed

### 3.1 Broken option marker — 1 occurrence, HIGH severity

`modules/basics-of-quantum-information/chsh-game/assessment.md`, **Q3**, line 36:

```
- A) It provides a bound of 2 on the correlation functions...
- B) It provides a bound of 2√2 ≈ 3.414 on the correlation functions...
- C) It can be violated by any entangled state
-) D) Both A and B are correct        <-- note the stray ")"
```

`**Correct:** D`

The list marker is `-)` instead of `-`. Option D exists in the source text, but
any parser matching the standard `- X)` bullet will drop it, leaving options
A–C with a correct answer of **D** — an **unanswerable question** in the UI.

This is the **only** unanswerable question in the corpus: with a tolerant parser
(`-\)?\s*([A-Z])\)`), 0 of 276 questions have a correct answer outside their
option list.

Fix is a single character (`-)` → `-`) but the file was left untouched per
instructions. **Either apply that one-character fix, or make the merge parser
tolerant of `-)`.**

### 3.2 Question label missing its colon — 19 occurrences across 11 files

The corpus uses two spellings:

| Form | Count |
|---|---:|
| `**Question:**` (with colon) | 257 |
| `**Question**` (no colon) | **19** |

A strict `^\*\*Question:\*\*` matcher silently drops 19 questions. Affected
files (question numbers in brackets):

```
fundamentals-of-quantum-algorithms/deutsch-algorithm            [Q4, Q5]
fundamentals-of-quantum-algorithms/deutsch-jozsa-algorithm      [Q4, Q5]
fundamentals-of-quantum-algorithms/measuring-computational-cost [Q4]
fundamentals-of-quantum-algorithms/number-of-iterations         [Q4, Q5]
fundamentals-of-quantum-algorithms/phase-estimation-problem     [Q4, Q5]
fundamentals-of-quantum-algorithms/quanticalgorithmic-foundations/factoring-and-gcd [Q4]
fundamentals-of-quantum-algorithms/simulating-classical-computations [Q4]
fundamentals-of-quantum-algorithms/unstructured-search          [Q1, ...]
... 3 further files
```

**Recommendation:** make the parser accept `**Question:**?` rather than editing
19 files.

### 3.3 Placeholder challenge targets — 48 occurrences across 24 files

`**Target:**` comes in two forms:

| Form | Count |
|---|---:|
| Fenced valid JSON, e.g. `{ "type": "statevector", "target": "\|Φ+⟩", "tolerance": 0.001 }` | 47 |
| Prose placeholder: `No circuit challenge — quiz-only assessment for this lesson.` | **48** |
| Other / unparseable | 2 |

Example of the placeholder form:

```markdown
### Challenge 1 — Concept Review
**Difficulty:** introductory
**Description:** Answer the quiz questions to demonstrate understanding...
**Target:**
No circuit challenge — quiz-only assessment for this lesson.

**Starter code:**
```python
# No circuit needed — quiz-only assessment
```
```

These are **not machine-checkable**. Roughly half the challenge corpus cannot be
auto-graded against a statevector.

**Notable correlation:** all 24 files whose challenges are *100% placeholder*
are, with one exception, the same files listed as unmatched in
`_unmatched_review.md` (`final-batch-*`, `sho-detail*`, `info-detail*`,
`tomography-detail*`, `purifications-detail*`, `grover-detail*`,
`circuits-detail`, `simon-detail`). That is strong evidence they came from a
lower-quality filler generation batch, and it reinforces treating those 24 as a
single cohort when deciding whether to keep them.

### 3.4 Challenge blocks with no `**Target:**` at all — 2 occurrences

```
fundamentals-of-quantum-algorithms/grover-algorithm/concluding-remarks/assessment.md
fundamentals-of-quantum-algorithms/query-model-of-computation/assessment.md
```

Distinct from §3.3: these have no `**Target:**` line whatsoever, not even a
placeholder. A parser expecting the field will need a null path.

### 3.5 Missing `## Challenges` section — 5 files

```
basics-of-quantum-information/multiple-systems
fundamentals-of-quantum-algorithms/phase-estimation-procedure
fundamentals-of-quantum-algorithms/shors-algorithm
general-formulation-of-quantum-information/purifications
general-formulation-of-quantum-information/quantum-channel-basics
```

Quiz section present and well-formed; challenges section entirely absent. Plus
`simon-algorithm-detail` (§1), which is missing everything.

### 3.6 Count deviations from the norm — low severity

| File | Deviation |
|---|---|
| `general-formulation-of-quantum-information/naimark-theorem` | **6** questions (norm is 5) |
| `basics-of-quantum-information/classical-information` | **1** challenge (norm is 2) |

Distribution: 54 files have 5 questions, 1 has 6, 1 has 0 (the empty file).
48 files have 2 challenges, 1 has 1, 7 have 0.

### 3.7 Option-count variants — NOT defects

Six questions have 2 or 3 options rather than 4:

| File | Q | Options | Correct | Verdict |
|---|---|---|---|---|
| `basics-of-quantum-information/classical-information` | Q5 | A, B | B | answerable |
| `basics-of-quantum-information/qiskit-implementation` | Q2 | B, C, D | B | answerable |
| `fundamentals-of-quantum-algorithms/grover-algorithm/concluding-remarks` | Q1 | A, B, C | B | answerable |
| `general-formulation-of-quantum-information/formulations-of-measurements` | Q4 | A, B | B | answerable |
| `general-formulation-of-quantum-information/naimark-theorem` | Q4 | A, B, C | A | answerable |
| `basics-of-quantum-information/chsh-game` | Q3 | A, B, C | **D** | **BROKEN — see §3.1** |

Five of the six are legitimate true/false or three-option questions: the correct
letter exists among the options. **Only the chsh-game case is an actual defect.**
Flagging these explicitly so a merge step does not reject valid 2- and
3-option questions on an over-strict "must have exactly 4" rule.

Note `qiskit-implementation` Q2 starts at **B** — the options are B, C, D with no
A. Answerable, but worth a look if option letters are used as array indices.

### 3.8 `.DS_Store` files — 3

```
tests_data/.DS_Store
tests_data/modules/.DS_Store
tests_data/modules/basics-of-quantum-information/.DS_Store
tests_data/modules/general-formulation-of-quantum-information/.DS_Store
```

macOS noise. Not deleted (outside the authorised change). Any directory walker
must skip them.

### 3.9 `modules/index.md` is a stale manifest from a different project

Lists 2 modules (`computer-science`, `quantum-mechanics`) that have no
assessment directory here, omits all 56 that do, and its file paths point at
`~/projects/sih-quantum/output/modules/` — a different repository. **Do not use
it as a manifest.** Left in place.

---

## 4. Frontmatter health — clean

Checked all 56 files against the 5 expected keys (`module`, `concept`,
`difficulty_progression`, `source_reference`, `katas_reference_categories`):

- **55 / 56** have complete, well-formed frontmatter
- **0** files have missing keys, unexpected extra keys, or malformed list syntax
- **0** files have unbalanced code fences
- The single exception is the empty file in §1

`source_reference` is the constant `qiskit-documentation-learning` across all 55.

---

## 5. Merge-readiness summary

| Severity | Item | Count | Blocks merge? |
|---|---|---:|---|
| **High** | Empty file, needs regeneration (§1) | 1 | **Yes — exclude** |
| **High** | Unanswerable question, `-)` marker (§3.1) | 1 | Yes, unless parser is tolerant |
| Medium | `**Question**` without colon (§3.2) | 19 | Yes, unless parser is tolerant |
| Medium | Placeholder, non-checkable targets (§3.3) | 48 | No — degrades to quiz-only |
| Medium | Challenge with no target field (§3.4) | 2 | No — needs a null path |
| Low | Missing Challenges section (§3.5) | 5 | No |
| Low | Question/challenge count deviations (§3.6) | 2 | No |
| — | Option-count variants (§3.7) | 5 | No — valid, do not reject |
| Low | `.DS_Store` (§3.8) | 4 | No — skip in walker |
| Low | Stale `index.md` (§3.9) | 1 | No — ignore |
| **Resolved** | Misnamed duplicate `.ipynb` (§2) | 1 | **Deleted** |

**55 of 56 files are mergeable** once the parser tolerates the `-)` marker and
the optional colon after `**Question**`. The 56th (`simon-algorithm-detail`)
must be regenerated first.

Separately, **24 of those 55 do not match any lesson** and need a human mapping
decision before they can be attached — see `_unmatched_review.md`.
