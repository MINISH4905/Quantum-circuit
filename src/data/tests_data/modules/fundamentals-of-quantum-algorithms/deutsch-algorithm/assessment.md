---
module: fundamentals-of-quantum-algorithms
concept: Deutsch's Algorithm
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [DeutschJozsa]
---

## Quiz

### Q1
**Question:** What is the primary goal of Deutsch's algorithm?
- A) To factor large integers
- B) To determine if a boolean function f: {0,1} → {0,1} is constant or balanced
- C) To create entanglement between two qubits
- D) To solve systems of linear equations

**Correct:** B
**Explanation:** Deutsch's algorithm determines whether a given 1-qubit boolean function f(x) is constant (outputs the same value for all inputs) or balanced (outputs 0 for half the inputs and 1 for the other half).

### Q2
**Question:** How many oracle queries does Deutsch's algorithm require to determine if f is constant or balanced with certainty?
- A) 2 queries
- B) 1 query (exponential advantage over classical)
- C) 2ⁿ queries
- D) log n queries

**Correct:** B
**Explanation:** Deutsch's algorithm offers an exponential quantum advantage, determining if f is constant or balanced with a single oracle query. A classical deterministic algorithm requires 2 queries in the worst case.

### Q3
**Question:** What is the key difference between Deutsch's algorithm and the Deutsch-Jozsa algorithm?
- A) Deutsch's algorithm works for 1 qubit, while Deutsch-Jozsa works for n qubits
- B) Deutsch's algorithm uses the Hadamard gate, while Deutsch-Jozsa does not
- C) Deutsch's algorithm measures after the first Hadamard, while Deutsch-Jozsa measures at the end
- D) There is no difference; they are the same algorithm

**Correct:** A
**Explanation:** Deutsch's algorithm is the 1-qubit version that determines if a function is constant or balanced. The Deutsch-Jozsa algorithm generalizes this to n qubits (a function f: {0,1}ⁿ → {0,1}) and also determines if the function is constant or balanced, but with the same single-query quantum advantage.

### Q4
**Question:** In Deutsch's algorithm, after the initial Hadamard gates and oracle query, what transformation is applied before the final measurement?
- A) Another application of the oracle
- B) Hadamard gates on all qubits
- C) A CNOT gate only
- D) A Pauli Z gate

**Correct:** B
**Explanation:** After the oracle query, Hadamard gates are applied to all qubits. This interferometry causes the state to evolve such that the measurement outcome reveals whether the function is constant or balanced.

### Q5
**Question:** If the final measurement in Deutsch's algorithm yields the result |0⟩, what can we conclude about the function f?
- A) f is balanced
- B) f is constant
- C) f is neither constant nor balanced
- D) The algorithm failed

**Correct:** B
**Explanation:** If the measurement yields |0⟩, the interference is constructive for the |0⟩ state, which means the function f is constant. If the measurement yields |1⟩, the function is balanced.

## Challenges

### Challenge 1 — Deutsch's Algorithm (1 Qubit)
**Difficulty:** intermediate
**Description:** Build a Deutsch's algorithm circuit for a 1-qubit function. The oracle implements a constant function (no phase flip). The circuit should determine if the function is constant or balanced by measuring the first qubit.
**Target:**
```json
{ "type": "measurement_probability", "target": {"0": 0.9}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def deutsch_constant(qc: QuantumCircuit, q: int) -> QuantumCircuit:
    # Your code here
    pass
```

### Challenge 2 — Deutsch's Algorithm (Balanced Function)
**Difficulty:** intermediate
**Description:** Build a Deutsch's algorithm circuit for a 1-qubit balanced function. The oracle applies a phase flip for the |1⟩ state. The circuit should determine if the function is constant or balanced by measuring the first qubit.
**Target:**
```json
{ "type": "measurement_probability", "target": {"1": 0.9}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def deutsch_balanced(qc: QuantumCircuit, q: int) -> QuantumCircuit:
    # Your code here
    pass
```