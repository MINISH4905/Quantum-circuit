---
module: general-formulation-of-quantum-information
concept: Formulations of Measurements
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [Measurements]
---

## Quiz

### Q1
**Question:** What is the Born rule in quantum mechanics?
- A) The probability of a measurement outcome is the square of the wave function amplitude
- B) The probability of a measurement outcome is the trace of the density matrix
- C) The probability of a measurement outcome is the expectation value of the Pauli operator
- D) The probability of a measurement outcome is the fidelity between states

**Correct:** A
**Explanation:** The Born rule states that the probability of obtaining a particular measurement outcome is the square of the absolute value of the wave function amplitude (or more generally, the expectation value of the associated projector).

### Q2
**Question:** If a qubit is in the state |ψ⟩ = α|0⟩ + β|1⟩, what is the probability of measuring |0⟩?
- A) |α|²
- B) |β|²
- C) α + β
- D) αβ

**Correct:** A
**Explanation:** According to the Born rule, the probability of measuring |0⟩ is |⟨0|ψ⟩|² = |α|².

### Q3
**Question:** What is the expectation value of the Pauli Z operator for the state |ψ⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩?
- A) cos(θ)
- B) sin(θ)
- C) 1
- D) 0

**Correct:** A
**Explanation:** The expectation value ⟨ψ|Z|ψ⟩ = |cos(θ/2)|² − |sin(θ/2)|² = cos²(θ/2) − sin²(θ/2) = cos(θ).

### Q3
**Question:** (Duplicate corrected): What is the probability distribution for measuring the state |ψ⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩ in the computational basis?
- A) P(0) = sin²(θ/2), P(1) = cos²(θ/2)
- B) P(0) = cos²(θ/2), P(1) = sin²(θ/2)
- P(0) = P(1) = 1/2

**Correct:** B
**Explanation:** P(0) = |⟨0|ψ⟩|² = |cos(θ/2)|² = cos²(θ/2) and P(1) = |⟨1|ψ⟩|² = |sin(θ/2)|² = sin²(θ/2).

### Q5
**Question:** Which of the following measurements is described by the observable Z ⊗ I on two qubits?
- A) Measuring only the first qubit in the computational basis
- B) Measuring only the second qubit in the computational basis
- C) Measuring both qubits in the computational basis
- D) Measuring the parity of the two qubits

**Correct:** A
**Explanation:** Z ⊗ I measures the Z observable on the first qubit while leaving the second qubit unchanged, effectively measuring only the first qubit in the computational basis.

## Challenges

### Challenge 1 — Measurement Probability Simulation
**Difficulty:** introductory
**Description:** Simulate the measurement of a single qubit in the computational basis for the state |ψ⟩ = cos(π/8)|0⟩ + sin(π/8)|1⟩. Verify that P(0) = cos²(π/8) ≈ 0.85 and P(1) = sin²(π/8) ≈ 0.15.
**Target:**
```json
{ "type": "value", "target": {"p0": 0.85, "p1": 0.15}, "tolerance": 0.05 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit, Aer

def simulate_measurement_probabilities() -> dict:
    # Your code here
    pass
```

### Challenge 2 — Expectation Value of Z on a Single Qubit
**Difficulty:** introductory
**Description:** Compute the expectation value ⟨Z⟩ for the state |ψ⟩ = cos(π/4)|0⟩ + sin(π/4)|1⟩ using the Born rule, and verify it equals cos(π/2) = 0.
**Target:**
```json
{ "type": "value", "target": {"expectation_z": 0.0}, "tolerance": 0.05 }
```
**Starter code:**
```python
import numpy as np

def expectation_z_single_qubit() -> float:
    # Your code here
    pass
```