---
module: general-formulation-of-quantum-information
concept: Fidelity
difficulty_progression: [introductory]
source_reference: qiskit-documentation-learning
katas_reference_categories: [Measurements]
---

## Quiz

### Q1
**Question:** What is the fidelity between two quantum states?
- A) The absolute value of the inner product between the states
- B) The sum of the state probabilities
- C) The trace of the density matrices
- D) The expectation value of the Pauli Z operator

**Correct:** A
**Explanation:** The fidelity between two pure quantum states |ψ⟩ and |φ⟩ is defined as F = |⟨ψ|φ⟩|², which is the absolute value of the inner product between the states squared.

### Q2
**Question:** If |ψ⟩ = |0⟩ and |φ⟩ = (|0⟩ + |1⟩)/√2, what is the fidelity F = |⟨ψ|φ⟩|²?
- A) 0
- B) 1/4
- C) 1/2
- D) 1

**Correct:** C
**Explanation:** ⟨ψ|φ⟩ = ⟨0|(⟨0| + ⟨1|)/√2 = 1/√2, so F = |1/√2|² = 1/2.

### Q3
**Question:** The fidelity between a quantum state ρ and the maximally mixed state I/d is given by:
- A) F = Tr(ρ)²/d²
- B) F = Tr(ρI/d) = 1/d
- C) F = ||ρ − I/d||₁/2
- D) F = det(ρ)

**Correct:** B
**Explanation:** The fidelity between ρ and the maximally mixed state I/d is F = Tr(ρ · I/d) = Tr(ρ)/d = 1/d, since ρ is a density matrix with Tr(ρ) = 1.

### Q4
**Question:** If F(ρ, σ) = 1, what can be concluded about the relationship between ρ and σ?
- A) ρ and σ are orthogonal
- B) ρ and σ are the same state
- C) ρ and σ have disjoint support
- D) ρ is the maximally mixed state

**Correct:** B
**Explanation:** Fidelity F(ρ, σ) = 1 if and only if ρ = σ, meaning the two density matrices represent the same quantum state.

### Q5
**Question:** How is fidelity used in quantum information theory?
- A) To measure the distinguishability of quantum states
- B) To quantify the closeness of two quantum states
- C) To calculate the entropy of a quantum state
- D) To determine the entanglement of a quantum state

**Correct:** B
**Explanation:** Fidelity quantifies the closeness of two quantum states, with F = 1 indicating identical states and F = 0 indicating orthogonal (distinct) states. It's widely used in quantum state comparison, quantum process tomography, and error analysis.

## Challenges

### Challenge 1 — Fidelity Between Pure States
**Difficulty:** introductory
**Description:** Implement a function that computes the fidelity F = |⟨ψ|φ⟩|² between two single-qubit pure states given their Bloch sphere representations or state vectors.
**Target:**
```json
{ "type": "value", "target": {"fidelity": 0.5}, "tolerance": 0.01 }
```
**Starter code:**
```python
import numpy as np

def fidelity_pure_states(psi: np.ndarray, phi: np.ndarray) -> float:
    # Your code here
    pass
```

### Challenge 2 — Fidelity Between Mixed States
**Difficulty:** intermediate
**Description:** Implement a function that computes the fidelity between two single-qubit density matrices ρ and σ.
**Target:**
```json
{ "type": "value", "target": {"fidelity": 0.8}, "tolerance": 0.05 }
```
**Starter code:**
```python
import numpy as np

def fidelity_mixed_states(rho: np.ndarray, sigma: np.ndarray) -> float:
    # Your code here
    pass
```