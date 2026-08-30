---
module: general-formulation-of-quantum-information
concept: Quantum Information
difficulty_progression: [introductory]
source_reference: qiskit-documentation-learning
katas_reference_categories: [Measurements]
---

## Quiz

### Q1
**Question:** What is the fundamental unit of quantum information?
- A) A classical bit
- B) A qubit
- C) A qutrit
- D) A photon

**Correct:** B
**Explanation:** A qubit (quantum bit) is the fundamental unit of quantum information, capable of representing both 0 and 1 simultaneously through superposition.

### Q2
**Question:** What is the no-cloning theorem?
- A) Quantum states can be perfectly cloned using entanglement
- B) Quantum states cannot be perfectly copied without knowing the state
- C) Quantum states can be cloned if they are in a known basis
- D) Classical information cannot be transmitted via quantum channels

**Correct:** B
**Explanation:** The no-cloning theorem states that it is impossible to create an identical copy of an arbitrary unknown quantum state. This is a fundamental distinction between quantum and classical information.

### Q3
**Question:** What is the maximum amount of classical information that can be transmitted through a qubit using the Holevo bound?
- A) 1 bit
- B) 2 bits
- C) Infinite amount
- D) Depends on the quantum channel

**Correct:** A
**Explanation:** The Holevo bound states that the amount of classical information that can be extracted from a quantum system is limited to 1 bit per qubit, regardless of the quantum operations performed.

### Q4
**Question:** What does it mean for two quantum states to be orthogonal?
- A) Their inner product is 1
- B) Their inner product is 0
- C) They have the same Bloch vector
- D) They have the same fidelity

**Correct:** B
**Explanation:** Two quantum states are orthogonal if their inner product ⟨ψ|φ⟩ = 0. Orthogonal states can be perfectly distinguished by a measurement.

### Q5
**Question:** What is the dimension of the Hilbert space for a system of n qubits?
- A) n
- B) 2n
- C) 2ⁿ
- D) n²

**Correct:** C
**Explanation:** The Hilbert space for a system of n qubits has dimension 2ⁿ, since each qubit contributes a factor of 2 to the total dimension.

## Challenges

### Challenge 1 — No-Cloning Theorem Verification
**Difficulty:** introductory
**Description:** Implement a circuit that attempts to clone an arbitrary single-qubit state |ψ⟩ = α|0⟩ + β|1⟩, and verify that the original and "clone" states are not identical, demonstrating the no-cloning theorem.
**Target:**
```json
{ "type": "value", "target": {"cloning_success": false}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit
import numpy as np

def no_cloning_violation(alpha: float, beta: float) -> dict:
    # Your code here
    pass
```

### Challenge 2 — Holevo Bound Calculation
**Difficulty:** intermediate
**Description:** Implement a function that calculates the Holevo bound for an ensemble of quantum states {pᵢ, ρᵢ}. The Holevo bound χ = S(ρ) − ∑ᵢ pᵢS(ρᵢ) gives the maximum classical information that can be extracted, where S is the von Neumann entropy and ρ = ∑ᵢ pᵢρᵢ is the average state.
**Target:**
```json
{ "type": "value", "target": {"holevo_bound": 1.0}, "tolerance": 0.1 }
```
**Starter code:**
```python
import numpy as np

def holevo_bound(ensemble: list) -> float:
    # Your code here
    pass
```