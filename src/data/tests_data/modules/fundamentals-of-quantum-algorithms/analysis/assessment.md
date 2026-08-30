---
module: fundamentals-of-quantum-algorithms
concept: Grover's Algorithm Analysis
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [GroversAlgorithm]
---

## Quiz

### Q1
**Question:** In Grover's algorithm, what is the role of the oracle?
- A) To create entanglement between qubits
- B) To mark the target state by applying a phase flip
- C) To measure the quantum state
- D) To initialize qubits in the |0⟩ state

**Correct:** B
**Explanation:** The oracle is a crucial component of Grover's algorithm that marks the target state by applying a phase flip (typically a -1 phase to the target state amplitude), while leaving other states' amplitudes unchanged.

### Q2
**Question:** After each Grover iteration, how does the amplitude of the target state change?
- A) It decreases linearly
- B) It increases quadratically
- C) It rotates toward the target state in the 2-dimensional subspace
- D) It remains unchanged

**Correct:** C
**Explanation:** Each Grover iteration rotates the state vector toward the target state in the 2-dimensional subspace spanned by the target state and the uniform superposition. The amplitude of the target state increases with each iteration, approximately following a sinusoidal pattern.

### Q3
**Question:** If there are N unmarked items in a database of N items, how many Grover iterations are required to find a marked item with high probability?
- A) 1
- B) √N
- C) N/2
- D) N

**Correct:** C
**Explanation:** When there is only one marked item among N items (so N-1 unmarked), approximately N/2 Grover iterations are required to maximize the probability of measuring the marked state. This is about half the total number of items.

### Q4
**Question:** What is the approximate probability of measuring the target state after the optimal number of Grover iterations for N items?
- A) 1/N
- B) 1/2
- C) (1 + sin(3π/(4√N)))²/4 (close to 1 for large N)
- D) 1 − 1/N

**Correct:** C
**Explanation:** After the optimal number of iterations (approximately (π/4)√N), the probability of measuring the target state is cos²(π/(4√N)) ≈ 1 for large N, but for small N it's given by the exact expression (1 + sin(3π/(4√N)))²/4.

### Q5
**Question:** Grover's algorithm provides a quadratic speedup over classical search. If a classical computer requires O(N) evaluations to find a marked item, how many evaluations does Grover's algorithm require?
- A) O(1)
- B) O(log N)
- C) O(√N)
- D) O(N²)

**Correct:** C
**Explanation:** Grover's algorithm requires O(√N) oracle queries to find the marked item with high probability, providing a quadratic speedup over the classical O(N) search bound.

## Challenges

### Challenge 1 — Single Grover Iteration
**Difficulty:** intermediate
**Description:** Build a quantum circuit that implements a single Grover iteration for a 1-qubit search where the target state is |1⟩. The iteration consists of: (1) oracle applying a phase flip to |1⟩, (2) diffusion operator (inversion about the mean). Start from the |0⟩ state and apply the optimal number of iterations for a 1-qubit search.
**Target:**
```json
{ "type": "measurement_probability", "target": {"1": 1.0}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def grover_iteration_1q(qc: QuantumCircuit, q: int) -> QuantumCircuit:
    # Your code here
    pass
```

### Challenge 2 — Grover Search with 2 Qubits
**Difficulty:** intermediate
**Description:** Build a Grover search circuit for a 2-qubit system where the target state is |11⟩, starting from the |00⟩ state. Apply the optimal number of Grover iterations (1 iteration for N=4) to maximize the probability of measuring |11⟩.
**Target:**
```json
{ "type": "measurement_probability", "target": {"11": 0.95}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def grover_search_2q(qc: QuantumCircuit, qs: list) -> QuantumCircuit:
    # Your code here
    pass
```