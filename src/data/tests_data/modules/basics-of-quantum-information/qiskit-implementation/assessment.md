---
module: basics-of-quantum-information
concept: Qiskit Circuit Implementation
difficulty_progression: [introductory]
source_reference: qiskit-documentation-learning
katas_reference_categories: [BasicGates]
---

## Quiz

### Q1
**Question:** Which Qiskit function creates a single-qubit quantum circuit with one qubit in the |0⟩ state?
- A) QuantumCircuit(1)
- B) QuantumCircuit(q=1)
- C) QuantumCircuit(1, 1)
- D) QuantumRegister(1)

**Correct:** A
**Explanation:** QuantumCircuit(1) creates a quantum circuit with 1 qubit and no classical bits. QuantumCircuit(1, 1) creates 1 qubit and 1 classical bit.

### Q2
**Question:** Which gate applies a bit flip (X) operation to a qubit in Qiskit?
-A) qc.z(0)
- B) qc.x(0)
- C) qc.h(0)
- D) qc.s(0)

**Correct:** B
**Explanation:** The X gate (also called the bit-flip gate) flips the state of a qubit: |0⟩ → |1⟩ and |1⟩ → |0⟩. In Qiskit, it's applied as qc.x(0).

### Q3
**Question:** What does the Hadamard gate do to a qubit state in Qiskit?
- A) It flips the |0⟩ state to |1⟩
- B) It adds a phase of π to the |1⟩ state
- C) It creates an equal superposition of |0⟩ and |1⟩ from the |0⟩ state
- D) It measures the qubit and collapses the state

**Correct:** C
**Explanation:** The Hadamard gate H maps |0⟩ → (|0⟩ + |1⟩)/√2 = |+⟩, creating an equal superposition. It also maps |1⟩ → (|0⟩ − |1⟩)/√2 = |−⟩.

### Q4
**Question:** After applying a Hadamard gate to qubit 0 and a CNOT gate with qubit 0 as control and qubit 1 as target, starting from |00⟩, what state is the two-qubit system in?
- A) |00⟩
- B) |01⟩
- C) |10⟩
- D) (|00⟩ + |11⟩)/√2

**Correct:** D
**Explanation:** H on qubit 0 creates (|0⟩ + |1⟩)/√� ⊗ |0⟩ = (|00⟩ + |10⟩)/√2. CNOT(0,1) then maps this to (|00⟩ + |11⟩)/√2 = |Φ⁺⟩, the Bell state.

### Q5
**Question:** Which of the following correctly measures a qubit in Qiskit and returns the result as a bit?
- A) qc.measure_all()
- B) qc.measure(0, 0)
- C) Both A and B
- D) Neither A nor B

**Correct:** C
**Explanation:** Both qc.measure_all() and qc.measure(0, 0) measure qubit 0 and store the result in classical bit 0. measure_all() measures all qubits and stores results in corresponding classical bits.

## Challenges

### Challenge 1 — Create Bell State
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

### Challenge 2 — Prepare |+⟩ State on First Qubit
**Difficulty:** introductory
**Description:** Build a quantum circuit that prepares the |+⟩ = (|0⟩ + |1⟩)/√2 state on the first qubit of a 2-qubit system, starting from |00⟩. The second qubit should remain |0⟩.
**Target:**
```json
{ "type": "statevector", "target": "|+⟩⊗|0⟩", "tolerance": 0.001 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def prepare_plus_state(qc: QuantumCircuit, qs: list) -> QuantumCircuit:
    # Your code here
    pass
```