---
module: fundamentals-of-quantum-algorithms
concept: Unstructured Search
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [GroversAlgorithm]
---

## Quiz

### Q1
**Question:** In unstructured search, what are we trying to find?
- A) The maximum value in a sorted database
- B) A specific marked item in an unsorted database
- C) The average value of all database entries
- D) The number of items in the database

**Correct:** B
**Explanation:** Unstructured search involves searching a database where the items are not arranged in any particular order, and we need to find a specific marked or target item.

### Q2
**Question:** How does a classical linear search find a marked item in an unsorted database of N items?
- A) By using Grover's algorithm
- B) By checking each item one by one until the marked item is found
- C) By using quantum entanglement
- D) By sorting the database first

**Correct:** B
**Explanation:** A classical linear search checks each item sequentially. In the worst case, the marked item is the last one checked, requiring N evaluations. On average, (N+1)/2 evaluations are needed.

### Q3
**Question:** What is the main advantage of Grover's algorithm over classical search for unstructured data?
- A) It finds the marked item in O(1) time
- B) It finds the marked item in O(log N) time
- C) It finds the marked item in O(√N) time (quadratic speedup)
- D) It finds the marked item in O(N) time (no speedup)

**Correct:** C
**Explanation:** Grover's algorithm provides a quadratic speedup, requiring O(√N) oracle queries compared to the classical O(N) evaluations needed for linear search.

### Q3
**Question:** (Duplicate numbering in original - corrected) What must be defined before running Grover's algorithm for unstructured search?
- A) The database sorting order
- B) The oracle that marks the target state
- C) The classical memory size
- D) The measurement basis only

**Correct:** B
**Explanation:** The oracle is the core component that marks the target state by applying a phase flip. It must be defined for the specific target item before Grover's algorithm can be executed.

### Q5
**Question:** If Grover's algorithm is run with too many iterations, what phenomenon occurs?
- A) The probability of the target state increases indefinitely
- B) The probability of the target state decreases (overshoot)
- C) The algorithm automatically corrects itself
- D) The qubits decohere immediately

**Correct:** B
**Explanation:** Grover's algorithm is periodic. After the optimal number of iterations, the state vector continues to rotate, and the probability of the target state decreases (overshoot phenomenon) if too many iterations are applied.

## Challenges

### Challenge 1 — Grover Search with 1 Qubit
**Difficulty:** intermediate
**Description:** Build a Grover circuit for a 1-qubit search where the target is |1⟩, starting from |0⟩. Apply the optimal number of iterations (1 iteration for N=2) and verify the probability of measuring |1⟩ is high.
**Target:**
```json
{ "type": "measurement_probability", "target": {"1": 0.8}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def grover_1q(qc: QuantumCircuit, q: int) -> QuantumCircuit:
    # Your code here
    pass
```

### Challenge 2 — Grover Search with 2 Qubits (N=4)
**Difficulty:** intermediate
**Description:** Build a Grover search circuit for N=4 (2 qubits) where the target state is |11⟩, starting from |00⟩. Apply 1 optimal iteration and verify the probability of measuring |11⟩ is >= 0.7.
**Target:**
```json
{ "type": "measurement_probability", "target": {"11": 0.7}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def grover_2q(qc: QuantumCircuit, qs: list) -> QuantumCircuit:
    # Your code here
    pass
```