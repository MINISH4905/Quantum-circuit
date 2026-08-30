---
module: basics-of-quantum-information
concept: Quantum Circuits
difficulty_progression: [introductory]
source_reference: qiskit-documentation-learning
katas_reference_categories: [BasicGates]
---

## Quiz

### Q1
**Question:** Which Qiskit class represents a quantum circuit with qubits and classical bits?
- A) QuantumRegister
- B) QuantumCircuit
- C) QuantumState
- D) QuantumProcessor

**Correct:** B
**Explanation:** QuantumCircuit is the fundamental class in Qiskit for representing and manipulating quantum circuits. It contains qubits and optionally classical bits, and supports operations like gates, measurements, and barriers.

### Q2
**Question:** What does the following Qiskit code do? `qc = QuantumCircuit(2, 2); qc.x(0); qc.cx(0, 1); qc.measure([0,1], [0,1])`
- A) Creates a 2-qubit circuit with no operations, then measures both qubits
- B) Flips qubit 0, entangles qubits 0 and 1, then measures both qubits into 2 classical bits
- C) Creates a Bell state and measures both qubits into the same classical bit
- D) Applies an X gate to qubit 1 only

**Correct:** B
**Explanation:** The code creates a 2-qubit, 2-classical-bit circuit. `qc.x(0)` flips qubit 0 from |0⟩ to |1⟩. `qc.cx(0, 1)` creates entanglement (CNOT) with qubit 0 as control and qubit 1 as target. `qc.measure([0,1], [0,1])` measures both qubits into the two classical bits.

### Q3
**Question:** Which gate creates entanglement between two qubits in Qiskit?
- A) Hadamard gate
- B) Pauli X gate
- C) CNOT gate
- D) S gate

**Correct:** C
**Explanation:** The CNOT (Controlled-NOT) gate creates entanglement when applied to two qubits. With the control qubit in |+⟩ state (created by H), the CNOT creates a Bell state (|00⟩ + |11⟩)/√2.

### Q4
**Question:** What is the purpose of a barrier in a Qiskit quantum circuit?
- A) To pause the simulation for a specified time
- B) To visually separate segments of the circuit and prevent certain optimizations
- C) To measure a qubit
- D) To apply a phase gate

**Correct:** B
**Explanation:** Barriers in Qiskit serve as physical and logical boundaries in a quantum circuit. They prevent the compiler from reordering gates across the barrier, which is important for maintaining the intended circuit structure, especially when using them to separate initialization, computation, and measurement segments.

### Q5
**Question:** If we have a 3-qubit quantum circuit and we apply a Hadamard gate to qubit 0, a CNOT with qubit 0 as control and qubit 1 as target, and another CNOT with qubit 0 as control and qubit 2 as target, what state is produced from |000⟩?
- A) |000⟩
- B) (|000⟩ + |111⟩)/√2 (GHZ state)
- C) (|000⟩ + |100⟩)/√2
- D) (|000⟩ − |111⟩)/√2

**Correct:** B
**Explanation:** Starting from |000⟩, H on qubit 0 creates (|0⟩ + |1⟩)/√2 ⊗ |00⟩. CNOT(0,1) creates (|00⟩ + |11⟩)/√2 ⊗ |0⟩. CNOT(0,2) creates (|000⟩ + |111⟩)/√2, which is the 3-qubit GHZ state.

## Challenges

### Challenge 1 — Create Bell State (Circuit)
**Difficulty:** introductory
**Description:** Build a quantum circuit that creates the Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 from the initial |00⟩ state using a Hadamard gate and a CNOT gate.
**Target:**
```json
{ "type": "statevector", "target": "|Φ+⟩", "tolerance": 0.001 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def create_bell_state(qc: QuantumCircuit, qs: list) -> QuantumCircuit:
    # Your code here
    pass
```

### Challenge 2 — Create GHZ State (3 Qubits)
**Difficulty:** intermediate
**Description:** Build a quantum circuit that creates the GHZ state (|000⟩ + |111⟩)/√2 from the initial |000⟩ state using one Hadamard gate and two CNOT gates.
**Target:**
```json
{ "type": "statevector", "target": "|GHZ⟩", "tolerance": 0.001 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def create_ghz_state(qc: QuantumCircuit, qs: list) -> QuantumCircuit:
    # Your code here
    pass
```