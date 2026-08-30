---
module: basics-of-quantum-information
concept: CHSH Game
difficulty_progression: [introductory]
source_reference: qiskit-documentation-learning
katas_reference_categories: [CHSHGame]
---

## Quiz

### Q1
**Question:** In the CHSH game, what do the two bits communicated by Alice to Bob represent?
- A) The measurement outcomes of her two qubits in the computational basis
- B) The measurement outcomes of her two qubits in the X basis
- C) The basis choices (0 for computational, 1 for X) made by Alice and Bob
- D) The phase angles of her two qubits

**Correct:** C
**Explanation:** In the CHSH game, Alice and Bob each choose a basis (computational X or Z) by Alice sending two classical bits representing her choice of measurement basis for her two qubits. These basis choices determine which correlations are checked to violate the Bell inequality.

### Q2
**Question:** What is the maximum probability of winning the CHSH game classically?
- A) 1/2
- B) 3/4
- C) (2 + √2)/4 ≈ 0.854
- D) 1

**Correct:** C
**Explanation:** Classically, the maximum probability of winning the CHSH game is (2 + √2)/4 ≈ 0.854. Quantum mechanically, using entangled states and appropriate measurements, the winning probability can reach cos²(π/8) ≈ 0.854, demonstrating the power of quantum entanglement.

### Q3
**Question:** Which of the following statements about the CHSH inequality is true?
- A) It provides a bound of 2 on the correlation functions for any local hidden variable theory
- B) It provides a bound of 2√2 ≈ 3.414 on the correlation functions for quantum mechanics
- C) It can be violated by any entangled state
- D) Both A and B are correct

**Correct:** D
**Explanation:** The CHSH inequality states that for any local hidden variable theory, the CHSH parameter S must satisfy |S| ≤ 2. Quantum mechanics can achieve |S| = 2√2 ≈ 3.414 with maximally entangled states, demonstrating quantum non-locality.

### Q4
**Question:** In the quantum CHSH setup, two qubits are prepared in the Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2. If Alice measures her qubit in the Z basis and Bob measures his qubit in the Z basis, what is the correlation?
- A) Always correlated (both 0 or both 1)
- B) Always anti-correlated (one 0, one 1)
- C) Uncorrelated (random outcomes)
- D) Correlated with probability 3/4

**Correct:** A
**Explanation:** For the Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2, both qubits are perfectly correlated in the Z basis: if Alice measures 0, Bob measures 0, and if Alice measures 1, Bob measures 1.

### Q5
**Question:** Which measurement setup would maximize the CHSH violation for two qubits in the |Φ⁺⟩ state?
- A) Alice: Z basis, Bob: Z basis
- B) Alice: Z basis, Bob: X basis
- C) Alice: (Z+X)/√2 basis, Bob: (Z−X)/√2 basis
- D) Alice: X basis, Bob: X basis

**Correct:** C
**Explanation:** The maximum CHSH violation of 2√2 is achieved when Alice measures observables A = σz and A' = σx, and Bob measures B = (σz + σx)/√2 and B' = (σz − σx)/√2. This setup correlates the measurement bases to maximize the quantum violation of the Bell inequality.

## Challenges

### Challenge 1 — CHSH Circuit
**Difficulty:** introductory
**Description:** Build a quantum circuit that creates the Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 from the initial |00⟩ state, using a Hadamard gate and a CNOT gate. This is the first part of the CHSH setup.
**Target:**
```json
{ "type": "statevector", "target": "|Φ+⟩", "tolerance": 0.001 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def chsh_bell_state(qc: QuantumCircuit, qs: list) -> QuantumCircuit:
    # Your code here
    pass
```

### Challenge 2 — CHSH Measurement Correlations
**Difficulty:** introductory
**Description:** Build a quantum circuit that measures correlations between Alice and Bob's qubits in the CHSH game setup. Alice applies a Hadamard then measures in Z basis, Bob applies a CNOT then Hadamard then measures in Z basis, starting from |00⟩.
**Target:**
```json
{ "type": "measurement_probability", "target": {"00": 0.5, "01": 0.25, "10": 0.25, "11": 0.0}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def chsh_correlations(qc: QuantumCircuit, qs: list) -> QuantumCircuit:
    # Your code here
    pass
```