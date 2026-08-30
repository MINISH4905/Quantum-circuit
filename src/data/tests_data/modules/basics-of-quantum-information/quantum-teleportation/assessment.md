---
module: basics-of-quantum-information
concept: Quantum Teleportation
difficulty_progression: [introductory]
source_reference: qiskit-documentation-learning
katas_reference_categories: [Teleportation]
---

## Quiz

### Q1
**Question:** In the quantum teleportation protocol, what is the role of the entangled pair shared between Alice and Bob?
- A) To transmit the quantum state directly through a classical channel
- B) To entangle Alice's and Bob's qubits so that operations on one affect the other
- C) To store the quantum state until Bob can retrieve it
- D) To measure the state without disturbing it

**Correct:** B
**Explanation:** The shared entangled pair (typically |Φ⁺⟩ = (|00⟩ + |11⟩)/√2) creates quantum correlations between Alice and Bob's qubits. Operations on Alice's qubit have corresponding effects on Bob's qubit, enabling state reconstruction after classical communication.

### Q2
**Question:** How many classical bits does Alice need to send to Bob to complete the teleportation protocol?
- A) 1 bit
- B) 2 bits
- C) 3 bits
- D) 4 bits

**Correct:** B
**Explanation:** Alice performs a Bell measurement on her two qubits (the original state and her half of the entangled pair), obtaining 2 classical bits. She sends these 2 bits to Bob, who applies the corresponding Pauli operations to reconstruct the original state.

### Q3
**Question:** After Alice measures her two qubits in the Bell basis and sends the 2-bit result to Bob, what operation does Bob apply if he receives the bit string "10"?
- A) X gate
- B) Z gate
- C) ZX gate (apply Z then X, or X then Z since they anticommute)
- D) No operation needed

**Correct:** C
**Explanation:** In the standard teleportation protocol, the 2-bit measurement result maps to specific Pauli corrections: "00" → I (identity), "01" → X, "10" → Z, "11" → ZX (or XZ). The order matters due to the anticommutation relations of Pauli operators.

### Q4
**Question:** If the original quantum state to be teleported is |ψ⟩ = α|0⟩ + β|1⟩, and Alice's Bell measurement yields the outcome corresponding to a Z gate correction, what was the original state on Alice's qubit before measurement?
- A) α|0⟩ + β|1⟩
- B) α|0⟩ − β|1⟩
- C) α|1⟩ + β|0⟩
- D) α|1⟩ − β|0⟩

**Correct:** B
**Explanation:** When Alice's measurement result requires a Z gate correction, Bob's qubit is in the state α|0⟩ − β|1⟩. After applying the Z gate (which flips the phase of |1⟩), Bob recovers the original state α|0⟩ + β|1⟩.

### Q5
**Question:** Which of the following statements about quantum teleportation is false?
- A) It teleports an unknown quantum state from one location to another
- B) It destroys the original quantum state at the sender's location
- C) It transmits the quantum state faster than the speed of light
- D) It requires entanglement and classical communication

**Correct:** C
**Explanation:** Quantum teleportation does not transmit the state faster than light. The original state is destroyed at the sender's location (no-cloning theorem), and the receiver Bob can only reconstruct the state after receiving the 2-bit classical communication from Alice, which travels at or below light speed.

## Challenges

### Challenge 1 — Teleportation Circuit
**Difficulty:** introductory
**Description:** Build a quantum circuit that implements the quantum teleportation protocol: (1) prepare two qubits in the |00⟩ state, (2) create entanglement between Alice's and Bob's qubits with a CNOT and Hadamard, (3) Alice performs a Bell measurement on her qubit and the state to be teleported, (4) Alice sends her 2-bit measurement result to Bob, (5) Bob applies the appropriate Pauli corrections based on the measurement result.
**Target:**
```json
{ "type": "statevector", "target": "|ψ⟩ on Bob's qubit", "tolerance": 0.001 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def teleportation_circuit(qc: QuantumCircuit, q: int, q_ancilla: int, q_bob: int) -> QuantumCircuit:
    # Your code here
    pass
```

### Challenge 2 — Teleportation State Reconstruction
**Difficulty:** introductory
**Description:** Build a circuit that teleports the |+⟩ state from Alice to Bob. Start with |+⟩ on Alice's input qubit, two ancilla qubits in |00⟩, and verify that Bob's qubit ends up in the |+⟩ state after applying the correct Pauli operations based on Alice's measurement.
**Target:**
```json
{ "type": "statevector", "target": "|+⟩ on Bob's qubit", "tolerance": 0.001 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def teleport_plus_state(qc: QuantumCircuit, q: int, q_ancilla: int, q_bob: int) -> QuantumCircuit:
    # Your code here
    pass
```