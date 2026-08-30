---
module: basics-of-quantum-information
concept: Inner Products and Projections
difficulty_progression: [introductory]
source_reference: qiskit-documentation-learning
katas_reference_categories: [BasicGates]
---

## Quiz

### Q1
**Question:** What is the inner product of two quantum states |ψ⟩ and |φ⟩ commonly denoted as?
- A) ⟨ψ|φ⟩
- B) |ψ⟩|φ⟩
- C) ⟨ψφ|
- D) |ψ⟩⟨φ|

**Correct:** A
**Explanation:** The inner product of two quantum states |ψ⟩ and |φ⟩ is denoted as ⟨ψ|φ⟩, which is the bra-ket notation where ⟨ψ| is the bra (conjugate transpose of |ψ⟩) and |φ⟩ is the ket.

### Q2
**Question:** If |ψ⟩ = α|0⟩ + β|1⟩ and |φ⟩ = γ|0⟩ + δ|1⟩, what is ⟨ψ|φ⟩?
- A) αγ + βδ
- B) α*γ + β*δ
- C) αδ + βγ
- D) α*δ + β*γ

**Correct:** B
**Explanation:** The bra ⟨ψ| = α*⟨0| + β*⟨1| (complex conjugate of coefficients), and the inner product ⟨ψ|φ⟩ = α*⟨0|(γ|0⟩ + δ|1⟩) + β*⟨1|(γ|0⟩ + δ|1⟩) = α*γ + β*δ.

### Q3
**Question:** If |ψ⟩ = (|0⟩ + |1⟩)/√2 and |φ⟩ = (|0⟩ − |1⟩)/√2, what is ⟨ψ|φ⟩?
- A) 1
- B) 0
- C) 1/2
- D) −1/2

**Correct:** D
**Explanation:** ⟨ψ|φ⟩ = (⟨0| + ⟨1|)/√2 ⊗ (|0⟩ − |1⟩)/√2 = (⟨0|0⟩ − ⟨0|1⟩ + ⟨1|0⟩ − ⟨1|1⟩)/2 = (1 − 0 + 0 − 1)/2 = 0. The states are orthogonal.

### Q4
**Question:** The fidelity between two quantum states |ψ⟩ and |φ⟩ is defined as F = |⟨ψ|φ⟩|². If ⟨ψ|φ⟩ = 0, what is the fidelity?
- A) 0
- B) 1/4
- C) 1/2
- D) 1

**Correct:** A
**Explanation:** If the inner product is 0 (orthogonal states), then the fidelity F = |0|² = 0.

### Q5
**Question:** Which of the following best describes the projection of |φ⟩ onto the subspace spanned by |ψ⟩?
- A) ⟨ψ|φ⟩ |ψ⟩
- B) ⟨ψ|φ⟩ ⟨ψ|
- C) |ψ⟩⟨φ|
- D) |φ⟩⟨ψ|

**Correct:** A
**Explanation:** The projection of |φ⟩ onto the direction of |ψ⟩ is given by ⟨ψ|φ⟩ |ψ⟩, which scales |ψ⟩ by the inner product (the component of |φ⟩ along |ψ⟩).

## Challenges

### Challenge 1 — State Fidelity Estimation
**Difficulty:** introductory
**Description:** Build a quantum circuit that estimates the fidelity F = |⟨ψ|φ⟩|² between two single-qubit states using the swap test technique. Start with |ψ⟩ = |0⟩ and |φ⟩ = (|0⟩ + |1⟩)/√2 = |+⟩, and verify the fidelity is approximately 1/2.
**Target:**
```json
{ "type": "measurement_probability", "target": {"0": 0.75, "1": 0.25}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def swap_test_fidelity(qc: QuantumCircuit, qpsi: int, qphi: int) -> QuantumCircuit:
    # Your code here
    pass
```

### Challenge 2 — Orthogonal State Detection
**Difficulty:** introductory
**Description:** Build a circuit that uses the swap test to determine if two single-qubit states are orthogonal. Start with |ψ⟩ = |0⟩ and |φ⟩ = |1⟩, and verify that the swap test outputs 0 (orthogonal) with high probability.
**Target:**
```json
{ "type": "measurement_probability", "target": {"0": 1.0}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def orthogonal_check(qc: QuantumCircuit, qpsi: int, qphi: int) -> QuantumCircuit:
    # Your code here
    pass
```