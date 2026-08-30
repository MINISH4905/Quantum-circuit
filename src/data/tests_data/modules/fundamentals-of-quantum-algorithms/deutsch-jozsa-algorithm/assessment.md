---
module: fundamentals-of-quantum-algorithms
concept: The Deutsch-Jozsa Algorithm
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [DeutschJozsa]
---

## Quiz

### Q1
**Question:** What is the primary goal of the Deutsch-Jozsa algorithm?
- A) To factor large integers
- B) To determine if a boolean function f: {0,1}ⁿ → {0,1} is constant or balanced
- C) To create entanglement between qubits
- D) To solve systems of linear equations

**Correct:** B
**Explanation:** The Deutsch-Jozsa algorithm determines whether a given boolean function f: {0,1}ⁿ → {0,1} is constant (outputs the same value for all possible inputs) or balanced (outputs 0 for exactly half the inputs and 1 for the other half).

### Q2
**Question:** How many oracle queries does the Deutsch-Jozsa algorithm require to determine if f is constant or balanced with certainty?
- A) n queries for n qubits
- B) 2ⁿ queries for certainty
- C) 1 query (exponential quantum advantage)
- D) log n queries with high probability

**Correct:** C
**Explanation:** The Deutsch-Jozsa algorithm offers an exponential quantum advantage, determining if f is constant or balanced with a single oracle query. A classical deterministic algorithm requires 2^(n-1)+1 queries in the worst case to achieve certainty.

### Q3
**Question:** What happens if the final measurement in the Deutsch-Jozsa algorithm yields the result |0⟩ⁿ?
- A) The function f is balanced
- B) The function f is constant
- C) The algorithm has failed
- D) The result is random

**Correct:** B
**Explanation:** If the final measurement yields all zeros |0⟩ⁿ, the interference is constructive, indicating that the function f is constant. If the function were balanced, the measurement would yield a non-zero string with high probability.

### Q4
**Question:** The Deutsch-Jozsa algorithm can determine if a function is constant or balanced with certainty, whereas a classical deterministic algorithm requires how many queries in the worst case?
- A) 1 query
- B) 2 queries
- C) 2^(n-1)+1 queries
- D) n queries

**Correct:** C
**Explanation:** A classical deterministic algorithm requires 2^(n-1)+1 queries in the worst case to determine if f is constant or balanced with certainty, while the quantum algorithm requires only 1 query.

### Q5
**Question:** The Deutsch-Jozsa algorithm can determine if a function f: {0,1}ⁿ → {0,1} is constant or balanced. For n = 3 (3 qubits), how many oracle queries does the quantum algorithm need?
- A) 1 query
- B) 2 queries
- C) 4 queries
- D) 8 queries

**Correct:** A
**Explanation:** The quantum Deutsch-Jozsa algorithm requires exactly 1 oracle query regardless of the number of qubits n. The exponential advantage is independent of n.

## Challenges

### Challenge 1 — Deutsch-Jozsa Algorithm (Constant Function, 1 Qubit)
**Difficulty:** intermediate
**Description:** Build a Deutsch-Jozsa circuit that identifies whether a 1-qubit function is constant. The oracle for a constant function applies no phase flip. The input consists of 1 qubit initialized to |0⟩, followed by H gates, the oracle, and H gates, then measurement.
**Target:**
```json
{ "type": "measurement_probability", "target": {"0": 1.0}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def deutsch_jozsa_constant_1q(qc: QuantumCircuit, q: int) -> QuantumCircuit:
    # Your code here
    pass
```

### Challenge 2 — Deutsch-Jozsa Algorithm (Balanced Function, 1 Qubit)
**Difficulty:** intermediate
**Description:** Build a Deutsch-Jozsa circuit that identifies whether a 1-qubit function is balanced. The oracle applies a phase flip for the |1⟩ state. The input consists of 1 qubit initialized to |0⟩, followed by H gates, the oracle, and H gates, then measurement.
**Target:**
```json
{ "type": "measurement_probability", "target": {"1": 1.0}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def deutsch_jozsa_balanced_1q(qc: QuantumCircuit, q: int) -> QuantumCircuit:
    # Your code here
    pass
```