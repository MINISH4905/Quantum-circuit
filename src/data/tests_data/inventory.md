# Qiskit Documentation Inventory

## 1. Real Module Names under /learning (in order of appearance)

### computer-science module
- **Qiskit in the classroom - computer science** (top-level TOC title)
- **Overview** (index.mdx frontmatter title)
- **The Deutsch-Jozsa algorithm** (notebook: deutsch-jozsa.ipynb)
- **Grover's algorithm** (notebook: grovers.ipynb)
- **Quantum teleportation** (notebook: quantum-teleportation.ipynb)
- **Quantum key distribution** (notebook: quantum-key-distribution.ipynb)
- **Shor's algorithm** (notebook: shors-algorithm.ipynb)
- **Quantum Fourier transform** (notebook: qft.ipynb)
- **Variational Quantum Eigensolver** (notebook: vqe.ipynb)
- **Modules** (table of contents section)

### quantum-mechanics module
- **Qiskit in the classroom - quantum mechanics** (top-level TOC title)
- **Overview** (index.mdx frontmatter title)
- **Get started with Qiskit in the classroom** (notebook: get-started-with-qiskit.ipynb)
- **Superposition with Qiskit** (notebook: superposition-with-qiskit.ipynb)
- **Stern-Gerlach measurements with Qiskit** (notebook: stern-gerlach-measurements-with-qiskit.ipynb)
- **Exploring uncertainty with Qiskit** (notebook: exploring-uncertainty-with-qiskit.ipynb)
- **Bell's inequality with Qiskit** (notebook: bells-inequality-with-qiskit.ipynb)

---

## 2. QuantumKatas Category Names (26 total)

| Category Name | Task Count |
|---|---|
| BasicGates | 16 |
| BoundedKnapsack | 17 |
| CHSHGame | 8 |
| DeutschJozsa | 15 |
| DistinguishUnitaries | 15 |
| GHZGame | 7 |
| GraphColoring | 17 |
| GroversAlgorithm | 8 |
| JointMeasurements | 13 |
| KeyDistribution_BB84 | 10 |
| MagicSquareGame | 12 |
| MarkingOracles | 11 |
| Measurements | 18 |
| PhaseEstimation | 7 |
| QEC_BitFlipCode | 12 |
| QFT | 16 |
| RippleCarryAdder | 23 |
| SimonsAlgorithm | 7 |
| SolveSATWithGrover | 10 |
| SuperdenseCoding | 5 |
| Superposition | 21 |
| Teleportation | 14 |
| TruthTables | 10 |
| UnitaryPatterns | 18 |
| examples | 8 |
| tutorials | 32 |

---

## 3. Proposed Mapping: Katas Categories → /learning Modules

| /learning Module | Matching Katas Categories | Rationale |
|---|---|---|
| **computer-science** | DeutschJozsa, GroversAlgorithm, Teleportation, KeyDistribution_BB84, QFT | Direct module names; computer-science curriculum covers these algorithms |
| **quantum-mechanics** | Superposition, BasicGates, Measurements | quantum-mechanics covers superposition, single-qubit gates, and measurement concepts |
| **Unmapped** | BoundedKnapsack, CHSHGame, GHZGame, GraphColoring, MagicSquareGame, MarkingOracles, PhaseEstimation, RippleCarryAdder, SimonsAlgorithm, SolveSATWithGrover, SuperdenseCoding, TruthTables, UnitaryPatterns, examples, tutorials | These categories don't cleanly map to the two /learning modules; skipped per task constraints |

**Note:** The two /learning modules (computer-science, quantum-mechanics) map to 7 + 3 = 10 of the 26 Katas categories. The remaining 16 categories are unmapped per the constraint to skip forced mismatches.