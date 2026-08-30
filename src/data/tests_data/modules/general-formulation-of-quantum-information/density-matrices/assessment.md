---
module: general-formulation-of-quantum-information
concept: Convex Combinations of Density Matrices
difficulty_progression: [introductory]
source_reference: qiskit-documentation-learning
katas_reference_categories: [Measurements]
---

## Quiz

### Q1
**Question:** What is a convex combination of quantum states?
- A) A linear combination of density matrices with arbitrary coefficients
- B) A probabilistic mixture of density matrices with coefficients that sum to 1 and are non-negative
- C) The tensor product of two density matrices
- D) The partial trace of a density matrix

**Correct:** B
**Explanation:** A convex combination of density matrices ρ₁, ρ₂, ..., ρₖ is of the form ρ = ∑ᵢ pᵢρᵢ where pᵢ ≥ 0 and ∑ᵢ pᵢ = 1. This represents a probabilistic mixture of quantum states, which is fundamental to understanding mixed states in quantum mechanics.

### Q2
**Question:** If ρ = pρ₁ + (1−p)ρ₂ with 0 < p < 1, what type of quantum state does ρ represent?
- A) A pure state
- B) A mixed state
- C) An entangled state
- D) A maximally entangled state

**Correct:** B
**Explanation:** When a density matrix is expressed as a convex combination of other density matrices with non-trivial probabilities (0 < p < 1), it represents a mixed quantum state, not a pure state which would have ρ² = ρ.

### Q3
**Question:** Which of the following density matrices represents a pure state?
- A) I/2 (the maximally mixed state for a single qubit)
- B) |0⟩⟨0| = [[1, 0], [0, 0]]
- C) (|0⟩⟨0| + |1⟩⟨1|)/2
- D) (|0⟩⟨1| + |1⟩⟨0|)/2

**Correct:** B
**Explanation:** |0⟩⟨0| = [[1, 0], [0, 0]] is a projection operator onto the |0⟩ state, and it satisfies the pure state condition ρ² = ρ. The other options are mixed states.

### Q4
**Question:** If ρ₁ = |0⟩⟨0| and ρ₂ = |1⟩⟨1|, what is the convex combination ρ = 0.7ρ₁ + 0.3ρ₂?
- A) [[0.7, 0], [0, 0.3]]
- B) [[0.3, 0], [0, 0.7]]
- C) [[0.7, 0.3], [0.3, 0.3]]
- D) [[1, 0], [0, 1]]

**Correct:** A
**Explanation:** ρ = 0.7|0⟩⟨0| + 0.3|1⟩⟨1| = 0.7[[1, 0], [0, 0]] + 0.3[[0, 0], [0, 1]] = [[0.7, 0], [0, 0.3]].

### Q5
**Question:** The Bloch vector representation of a convex combination of density matrices corresponds to:
- A) A point inside the Bloch sphere
- B) A point on the surface of the Bloch sphere
- C) A point outside the Bloch sphere
- D) The origin of the Bloch coordinate system

**Correct:** A
**Explanation:** A mixed state represented as a convex combination of pure states corresponds to a Bloch vector that lies strictly inside the Bloch sphere (its length is less than 1), while pure states correspond to points on the surface (length = 1).

## Challenges

### Challenge 1 — Representing a Mixed State as Convex Combination
**Difficulty:** introductory
**Description:** Implement a function that returns the convex combination ρ = p|0⟩⟨0| + (1−p)|1⟩⟨1| as a 2×2 numpy array (or list of lists), where p is a given probability.
**Target:**
```json
{ "type": "value", "target": [[0.7, 0], [0, 0.3]], "tolerance": 0.01 }
```
**Starter code:**
```python
import numpy as np

def mixed_state_convex_combination(p: float) -> list:
    # Your code here
    pass
```

### Challenge 2 — Bloch Sphere Length from Convex Coefficients
**Difficulty:** introductory
**Description:** Implement a function that computes the length of the Bloch vector for a convex combination ρ = p|0⟩⟨0| + (1−p)|1⟩⟨1|, and verify it is |1−2p|.
**Target:**
```json
{ "type": "value", "target": {"bloch_length": 0.1}, "tolerance": 0.01 }
```
**Starter code:**
```python
import numpy as np

def bloch_length_from_convex(p: float) -> float:
    # Your code here
    pass
```