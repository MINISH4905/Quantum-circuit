---
module: basics-of-quantum-information
concept: Classical Information in Quantum Context
difficulty_progression: [introductory]
source_reference: qiskit-documentation-learning
katas_reference_categories: [Measurements]
---

## Quiz

### Q1
**Question:** Which of the following best describes a classical bit in the context of information theory?
- A) A quantum system with two energy levels
- B) A variable that can take the value 0 or 1
- C) A qubit in the |0⟩ state
- D) A continuous variable

**Correct:** B
**Explanation:** A classical bit is the fundamental unit of classical information, capable of storing either a 0 or a 1. It is distinct from a qubit, which can exist in superposition.

### Q2
**Question:** When a qubit in the |+⟩ = (|0⟩ + |1⟩)/√2 state is measured in the computational (Z) basis, what is the probability of obtaining the outcome 0?
- A) 0
- B) 1/4
- C) 1/2
- D) 1

**Correct:** C
****Explanation:** The |+⟩ state has equal amplitudes for |0⟩ and |1⟩, so P(0) = |1/√2|² = 1/2 and P(1) = 1/2.

### Q3
**Question:** Which operation converts the |0⟩ state to the |+⟩ state = (|0⟩ + |1⟩)/√2?
- A) Pauli X gate
- B) Pauli Z gate
- C) Hadamard gate
- D) S gate

**Correct:** C
**Explanation:** The Hadamard gate H maps |0⟩ → (|0⟩ + |1⟩)/√2 = |+⟩. The other gates have different effects: X flips |0⟩ to |1⟩, Z adds a phase to |1⟩, and S adds a π/2 phase to |1⟩.

### Q4
**Question:** If two bits of classical information are encoded using the superdense coding protocol, how many qubits must be transmitted from Alice to Bob?
- A) 1 qubit
- B) 2 qubits
- C) 3 qubits
- D) 4 qubits

**Correct:** A
**Explanation:** Superdense coding allows transmitting 2 classical bits by sending exactly 1 qubit, using a pre-shared entangled pair between Alice and Bob.

### Q5
**Question:** True or false: Quantum teleportation can transmit a quantum state without any classical communication.
- A) True
- B) False

**Correct:** B
**Explanation:** False. Quantum teleportation requires both entanglement and classical communication (2 bits from Alice to Bob). The no-cloning theorem prevents transmitting a quantum state without disturbing the original, and classical communication is needed for the receiver to reconstruct the state.

## Challenges

### Challenge 1 — Bell State Preparation (Optional)
**Difficulty:** introductory
**Description:** Build a quantum circuit that creates the Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 from |00⟩, as a prerequisite for superdense coding and teleportation.
**Target:**
```json
{ "type": "statevector", "target": "|Φ+⟩", "tolerance": 0.001 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def bell_state_prerequisite(qc: QuantumCircuit, qs: list) -> QuantumCircuit:
    # Your code here
    pass
```

**Note:** This challenge is optional for lessons where the learner needs entanglement as a foundation. If the lesson focuses purely on classical information theory, this challenge may be skipped in favor of quiz-only assessment.