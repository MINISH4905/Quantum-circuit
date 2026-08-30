---
module: general-formulation-of-quantum-information
concept: Naimark's Theorem
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [Measurements]
---

## Quiz

### Q1
**Question:** What does Naimark's theorem state about quantum measurements?
- A) Any POVM measurement can be implemented as a projective measurement on a larger Hilbert space
- B) Any projective measurement can be implemented as a POVM on the original Hilbert space
- C) Quantum measurements always collapse the state to |0⟩
- D) Quantum measurements preserve the purity of the state

**Correct:** A
**Explanation:** Naimark's theorem states that any positive operator-valued measure (POVM) {Eᵢ} on a Hilbert space H can be implemented as a projective measurement {Πᵢ} on a larger Hilbert space H ⊗ K, where K is an ancilla space. The projectors Πᵢ are obtained by taking the square roots of the POVM elements: Πᵢ = √Eᵢ ⊗ I_K, and then performing a standard projective measurement followed by discarding the ancilla outcome.

### Q2
**Question:** Why is Naimark's theorem important for quantum measurement theory?
- A) It proves that all quantum measurements can be implemented using projective measurements on an extended system
- B) It shows that POVMs are not necessary for quantum measurements
- C) It proves that projective measurements are sufficient for all quantum tasks
- D) It demonstrates that quantum measurements cannot be implemented on classical computers

**Correct:** A
**Explanation:** Naimark's theorem is fundamental because it shows that the more general POVM formalism can be reduced to projective measurements on a larger system. This has important implications for quantum cryptography, state discrimination, and the operational interpretation of POVMs.

### Q3
**Question:** If a POVM has elements E₁ = [[0.7, 0], [0, 0.3]] and E₂ = [[0.3, 0], [0, 0.7]], what does Naimark's theorem guarantee?
- A) These POVM elements cannot be implemented as projective measurements
- B) These POVM elements can be implemented as projective measurements on a larger Hilbert space
- C) The POVM elements must be projective themselves
- D) The POVM elements violate the completeness relation

**Correct:** B
**Explanation:** By Naimark's theorem, any POVM with positive, semi-definite elements summing to the identity can be implemented as a projective measurement on a larger Hilbert space containing an ancillary system.

### Q4
**Question:** What is the minimum dimension of the ancillary space K required for Naimark's theorem implementation of a POVM with m outcomes on a d-dimensional Hilbert space?
- A) m
- B) d
- C) m × d
- d) d²

**Correct:** A
**Explanation:** The minimum dimension of the ancillary space K required is m, the number of POVM outcomes. The theorem constructs a projective measurement on H ⊗ K where K has dimension m, and the projectors are Πᵢ = √Eᵢ ⊗ I_m.

### Q4
**Question:** (Duplicate corrected): How does Naimark's theorem relate the POVM formalism to projective measurements?
- A) POVMs are a special case of projective measurements
- B) Projective measurements are a special case of POVMs
- C) Naimark's theorem shows any POVM can be dilated to a projective measurement on a larger space
- D) POVMs and projective measurements are unrelated

**Correct:** C
**Explanation:** Naimark's theorem shows that any POVM can be dilated to a projective measurement on a larger Hilbert space. This means projective measurements are more general in the sense that they can simulate any POVM when an ancillary system is added.

### Q5
**Question:** Given a single-qubit POVM with elements E₁ = [[0.8, 0], [0, 0.2]] and E₂ = [[0.2, 0], [0, 0.8]], what is the minimum ancilla dimension needed per Naimark's theorem?
- A) 1
- B) 2
- C) 3
- D) 4

**Correct:** B
**Explanation:** The POVM has 2 outcomes, so the minimum ancilla dimension needed is 2 per Naimark's theorem.

## Challenges

### Challenge 1 — Naimark Dilation for Qubit POVM
**Difficulty:** intermediate
**Description:** Implement the Naimark dilation for a single-qubit POVM with two outcomes. Given E₁ = [[p, 0], [0, 1−p]] and E₂ = [[1−p, 0], [0, p]], construct the projective measurement on C² ⊗ C² (2×2 ancilla) that implements this POVM.
**Target:**
```json
{ "type": "statevector", "target": "|00⟩", "tolerance": 0.01 }
```
**Starter code:**
```python
import numpy as np
from qiskit import QuantumCircuit

def naimark_dilation_qubit(p: float) -> QuantumCircuit:
    # Your code here
    pass
```

### Challenge 2 — Verify Naimark Dilation Implementability
**Difficulty:** intermediate
**Description:** Given a POVM with two outcomes E₁ = [[0.8, 0], [0, 0.2]] and E₂ = [[0.2, 0], [0, 0.8]], verify that the Naimark dilation correctly implements the POVM by simulating the projective measurement and checking the outcome probabilities match the POVM elements.
**Target:**
```json
{ "type": "value", "target": {"p1": 0.8, "p2": 0.2}, "tolerance": 0.1 }
```
**Starter code:**
```python
import numpy as np
from qiskit import QuantumCircuit, Aer

def verify_naimark_dilation(p: float) -> dict:
    # Your code here
    pass
```