---
module: basics-of-quantum-information
concept: Superdense Coding
difficulty_progression: [introductory]
source_reference: qiskit-documentation-learning
katas_reference_categories: [SuperdenseCoding]
---

## Quiz

### Q1
**Question:** In the superdense coding protocol, how many classical bits can be transmitted using one entangled pair and one entangled qubit?
- A) 1 bit
- B) 2 bits
- C) 3 bits
- D) 4 bits

**Correct:** B
**Explanation:** Superdense coding allows transmitting 2 classical bits by sending one qubit over a quantum channel, using a pre-shared entangled pair. Alice applies one of four possible Pauli operations (I, X, Z, iY) to encode her 2 bits, then sends her qubit to Bob, who decodes by performing a Bell measurement.

### Q2
**Question:** In the superdense coding protocol, what initial state do Alice and Bob share?
- A) |00⟩
- B) |01⟩
- C) |Φ⁺⟩ = (|00⟩ + |11⟩)/√2
- D) |Ψ⁺⟩ = (|01⟩ + |10⟩)/√2

**Correct:** C
**Explanation:** The protocol begins with both Alice and Bob sharing a Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2, where Alice holds one qubit and Bob holds the other.

### Q3
**Question:** After Alice applies an X gate to her qubit in the superdense coding protocol, what does this encode?
- A) Classical bit 0
- B) Classical bit 1
- C) Both bits are 0
- D) Both bits are 1

**Correct:** B
**Explanation:** Applying the X gate (bit-flip) to Alice's qubit encodes the classical bit 1 (in combination with the other gate). The four possible operations I, X, Z, and iY (or ZX) encode the two-bit messages 00, 01, 10, and 11 respectively.

### Q4
**Question:** After Alice encodes her message and sends her qubit to Bob, how does Bob decode the 2-bit message?
- A) By applying a Hadamard gate to both qubits
- B) By measuring both qubits in the computational basis
- C) By performing a Bell measurement (CNOT followed by Hadamard on first qubit, then measure both)
- D) By applying a CNOT gate only

**Correct:** C
**Explanation:** Bob decodes by performing a Bell measurement: applying a CNOT with Alice's qubit as control and Bob's as target, then a Hadamard on Alice's qubit, then measuring both qubits in the computational basis. The measurement outcomes directly correspond to the 2-bit message.

### Q5
**Question:** If Alice applies the Z gate instead of the X gate to encode her message in superdense coding, what 2-bit message does this encode (assuming I encodes 00)?
- A) 00
- B) 01
- C) 10
- D) 11

**Correct:** C
**Explanation:** The four gates encode the two-bit messages as follows: I (identity) → 00, X (bit-flip) → 01, Z (phase-flip) → 10, and iY (or ZX) → 11. So Z encodes the message 10.

## Challenges

### Challenge 1 — Superdense Coding Circuit
**Difficulty:** introductory
**Description:** Build a quantum circuit that implements the superdense coding protocol: (1) prepare two qubits in |00⟩, (2) create entanglement with a Hadamard on Alice's qubit and a CNOT, (3) Alice applies an X gate to encode bit 1 of her message, (4) Alice sends her qubit to Bob, (5) Bob decodes by performing a Bell measurement (CNOT then Hadamard on first qubit, then measure both).
**Target:**
```json
{ "type": "measurement_probability", "target": {"00": 0.25, "01": 0.25, "10": 0.25, "11": 0.25}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def superdense_coding_circuit(qc: QuantumCircuit, alice_qubit: int, bob_qubit: int) -> QuantumCircuit:
    # Your code here
    pass
```

### Challenge 2 — Encode and Decode 2-Bit Message
**Difficulty:** introductory
**Description:** Build a circuit where Alice encodes the 2-bit message "10" using appropriate gates, sends her qubit to Bob, and Bob decodes the message by performing a Bell measurement. Verify that Bob's measurement outcomes correspond to the encoded message.
**Target:**
```json
{ "type": "measurement_probability", "target": {"10": 1.0}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def encode_decode_superdense(qc: QuantumCircuit, alice_qubit: int, bob_qubit: int) -> QuantumCircuit:
    # Your code here
    pass
```