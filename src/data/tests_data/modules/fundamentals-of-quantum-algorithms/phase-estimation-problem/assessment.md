---
module: fundamentals-of-quantum-algorithms
concept: The Phase Estimation Problem
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [PhaseEstimation]
---

## Quiz

### Q1
**Question:** What is the primary goal of the quantum phase estimation algorithm?
- A) To create entanglement between qubits
- B) To estimate the eigenvalue (phase) of a unitary operator U applied to an eigenstate |ψ⟩
- C) To measure the fidelity of a quantum state
- D) To initialize qubits in the |0⟩ state

**Correct:** B
**Explanation:** The quantum phase estimation algorithm estimates the phase φ such that U|ψ⟩ = e^{2πiφ}|ψ⟩, i.e., it finds the eigenvalue of the unitary operator U corresponding to the eigenstate |ψ⟩.

### Q2
**Question:** The phase estimation algorithm uses the inverse Quantum Fourier Transform (QFT). How many ancilla qubits are required to estimate k bits of the phase?
- A) k ancilla qubits
- B) 2k ancilla qubits
- C) k/2 ancilla qubits
- D) log₂(k) ancilla qubits

**Correct:** A
**Explanation:** To estimate k bits of the phase φ = 0.φ₁φ₂...φₖ, the phase estimation algorithm requires exactly k ancilla qubits. Each ancilla qubit stores one bit of the estimated phase.

### Q3
**Question:** If a unitary operator U has an eigenstate |ψ⟩ with eigenvalue e^{2πi/4}, what is the estimated phase φ (in bits)?
- A) φ = 0.01 (binary) = 1/4
- B) φ = 0.10 (binary) = 1/2
- C) φ = 0.11 (binary) = 3/4
- D) φ = 0.00 (binary) = 0

**Correct:** A
**Explanation:** The eigenvalue e^{2πi/4} = e^{2πi × 0.01₂}, so the phase in binary is 0.01, which equals 1/4 = 0.25 in decimal.

### Q4
**Question:** What is the probability of measuring the correct phase estimate when using t ancilla qubits in the phase estimation algorithm, if the unitary has a non-degenerate eigenvalue?
- A) 1/t
- B) 1/2ᵗ
- C) ≥ 8/π² ≈ 0.81 (for optimal t)
- D) 1

**Correct:** C
**Explanation:** The phase estimation algorithm has a success probability of at least 8/π² ≈ 0.81 when the eigenvalue is non-degenerate and t ancilla qubits are used. The probability can be amplified by repeating the algorithm.

### Q5
**Question:** How does increasing the number of ancilla qubits t affect the precision of the phase estimation?
- A) It decreases the precision
- B) It has no effect on precision
- C) It increases the precision (more bits of the phase are estimated correctly)
- D) It causes the algorithm to fail

**Correct:** C
**Explanation:** With t ancilla qubits, the phase estimation algorithm can estimate t bits of the phase φ. Increasing t provides more bits of precision, allowing the estimation of the phase to greater accuracy.

## Challenges

### Challenge 1 — Phase Estimation for φ = 1/2
**Difficulty:** intermediate
**Description:** Build a phase estimation circuit that estimates the phase φ = 1/2 (binary 0.1) using 2 ancilla qubits. The unitary U is such that U|ψ⟩ = e^{2πi/2}|ψ⟩ = −|ψ⟩. Verify that the measurement probabilities show the phase 0.1 (i.e., outcome |10⟩ or similar with high probability).
**Target:**
```json
{ "type": "measurement_probability", "target": {"10": 0.8}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def phase_estimation_half(qc: QuantumCircuit, q_psi: int, q_ancilla: list) -> QuantumCircuit:
    # Your code here
    pass
```

### Challenge 2 — Phase Estimation for φ = 1/4
**Difficulty:** intermediate
**Description:** Build a phase estimation circuit that estimates the phase φ = 1/4 (binary 0.01) using 2 ancilla qubits. The unitary U satisfies U|ψ⟩ = e^{2πi/4}|ψ⟩. Verify the measurement outcomes reflect the 2-bit phase estimation.
**Target:**
```json
{ "type": "measurement_probability", "target": {"01": 0.8}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def phase_estimation_quarter(qc: QuantumCircuit, q_psi: int, q_ancilla: list) -> QuantumCircuit:
    # Your code here
    pass
```