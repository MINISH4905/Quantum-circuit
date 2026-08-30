---
module: fundamentals-of-quantum-algorithms
concept: Simon's Algorithm
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [SolveSATWithGrover]
---

## Quiz

### Q1
**Question:** What is the primary problem that Simon's algorithm solves?
- A) Factoring large integers
- B) Determining if a function is one-to-one or two-to-one
- C) Creating entanglement between qubits
- D) Estimating the phase of a unitary operator

**Correct:** B
**Explanation:** Simon's algorithm determines whether a given black-box function f(x) is one-to-one (injective) or two-to-one with a hidden period s, where f(x) = f(x ⊕ s) for all x.

### Q2
**Question:** What is the key output of Simon's algorithm?
- A) The value of the hidden period s
- B) A uniform superposition over all basis states
- C) The probability of measuring each basis state
- D) The oracle function itself

**Correct:** A
**Explanation:** Simon's algorithm outputs a set of linear equations that uniquely determine the hidden period s modulo 2, allowing the computation of s classically after O(n) algorithm runs.

### Q3
**Question:** How many queries to the oracle does Simon's algorithm require to find the hidden period with high probability?
- A) 1 query
- B) 2 queries
- C) O(n) queries, where n is the number of qubits
- D) Exponential in n

**Correct:** C
**Explanation:** Simon's algorithm requires O(n) oracle queries to determine the hidden period s with high probability, where n is the number of qubits (the input size). This gives an exponential speedup over the classical Ω(2^(n/2)) query complexity.

### Q4
**Question:** What is the role of the Hadamard transform in Simon's algorithm?
- A) To create the initial uniform superposition
- B) To interfere the state vectors and extract linear equations for the hidden period
- C) To measure the oracle output
- D) To initialize the ancilla qubits

**Correct:** B
**Explanation:** After the oracle query, Hadamard transforms are applied to create interference patterns that encode the linear constraints x · s = 0 (mod 2), which when measured give equations that determine the hidden period s.

### Q5
**Question:** If we have a function f(x) on n qubits with a hidden period s = 1010 (binary), how many classical runs of Simon's algorithm are needed to uniquely determine s?
- A) 1 run
- B) n runs (where n is the number of qubits)
- C) 2^n runs
- D) The period is determined in a single run

**Correct:** B
**Explanation:** Each run of Simon's algorithm gives one linear equation x · s = 0 (mod 2). After O(n) runs (specifically, n linearly independent equations), the hidden period s can be uniquely determined classically by solving the system of linear equations.

## Challenges

### Challenge 1 — Simon's Algorithm: Oracle Construction
**Difficulty:** intermediate
**Description:** Build a quantum oracle for Simon's algorithm that implements the function f(x) = f(x ⊕ s) for a hidden period s = 10 (binary). The oracle should act on two n-qubit registers: the input register and the output register, mapping |x⟩|0⟩ to |x⟩|f(x)⟩.
**Target:**
```json
{ "type": "statevector", "target": "|f(x)⟩", "tolerance": 0.01 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def simon_oracle(qc: QuantumCircuit, input_register: int, output_register: int, s: int) -> QuantumCircuit:
    # Your code here
    pass
```

### Challenge 2 — Simon's Algorithm: Full Circuit
**Difficulty:** intermediate
**Description:** Build the complete Simon's algorithm circuit for n=2 qubits with hidden period s=10 (binary). The circuit should include: (1) Hadamard gates on all input qubits, (2) the Simon oracle, (3) Hadamard gates on all input qubits, (4) measurement of the input register.
**Target:**
```json
{ "type": "measurement_probability", "target": {"00": 0.25, "01": 0.25, "10": 0.25, "11": 0.25}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def simon_algorithm_full(n: int, s: int) -> QuantumCircuit:
    # Your code here
    pass
```