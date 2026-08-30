---
module: fundamentals-of-quantum-algorithms
concept: The Query Model of Computation
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [SolveSATWithGrover]
---

## Quiz

### Q1
**Question:** What is the standard model of computation for quantum algorithms?
- A) The query model, where the algorithm's cost is measured by the number of oracle queries
- B) The circuit model, where the algorithm's cost is measured by gate count
- C) The measurement model, where the algorithm's cost is measured by the number of measurements
- D) The entanglement model, where the algorithm's cost is measured by entanglement entropy

**Correct:** A
**Explanation:** The query model is the standard model for studying the computational complexity of quantum algorithms. In this model, the cost of an algorithm is measured by the number of queries it makes to a black-box oracle, which abstracts away the details of gate operations and focuses on the fundamental difficulty of the problem.

### Q2
**Question:** How does the query model differ from the circuit model?
- A) The query model counts only oracle queries, while the circuit model counts all gate operations
- B) The query model is only for classical algorithms
- C) The circuit model is more fundamental than the query model
- D) The query model cannot handle quantum algorithms

**Correct:** A
**Explanation:** The query model abstracts the algorithm to focus on the number of oracle queries as the primary measure of complexity, while the circuit model counts all quantum gate operations including Hadamard gates, CNOTs, measurements, etc.

### Q3
**Question:** In the query model, what does it mean for a quantum algorithm to make a "query" to an oracle?
- A) The algorithm applies a physical oracle gate to the quantum state
- B) The algorithm interacts with a black-box function that encodes the problem instance
- C) The algorithm measures the quantum state and classically processes the result
- D) The algorithm initializes the quantum state to |0⟩

**Correct:** B
**Explanation:** A query to the oracle involves interacting with a black-box function that encodes the problem instance. The algorithm can apply operations conditioned on the oracle's output, but the query itself is the fundamental unit of communication with the problem instance.

### Q4
**Question:** Which of the following problems is known to have a polynomial quantum speedup in the query model?
- A) Unstructured search (Grover's algorithm)
- B) Simulating quantum systems
- C) Computing the ground state energy of a Hamiltonian
- D) Solving linear systems of equations

**Correct:** A
**Explanation:** Unstructured search via Grover's algorithm provides a quadratic speedup in the query model, requiring O(√N) queries compared to the classical Ω(N) queries needed for deterministic or high-probability success.

### Q5
**Question:** Which of the following problems is believed to have an exponential quantum speedup in the query model?
- A) Unstructured search
- B) Deutsch-Jozsa algorithm
- C) Simon's algorithm
- D) Both A and C

**Correct:** D
**Explanation:** Both Grover's algorithm (unstructured search) and Simon's algorithm provide exponential quantum speedups in the query model, while Deutsch-Jozsa provides a less dramatic (though still significant) speedup.

## Challenges

### Challenge 1 — Query Complexity Lower Bound Intuition
**Difficulty:** introductory
**Description:** Explain why the query model focuses on oracle queries rather than gate operations when measuring algorithmic complexity. Write 2-3 sentences focusing on the abstraction aspect.
**Starter code:** (no circuit needed — this is a conceptual challenge)

### Challenge 2 — Oracle Query Count for Deutsch-Jozsa
**Difficulty:** introductory
**Description:** Determine the number of oracle queries needed by the Deutsch-Jozsa algorithm for a function f: {0,1}ⁿ → {0,1}. Verify that the algorithm requires exactly 1 query regardless of n.
**Target:**
```json
{ "type": "value", "target": {"oracle_queries": 1}, "tolerance": 0.01 }
```
**Starter code:**
```python
def deutsch_jozsa_queries(n: int) -> int:
    # Your code here
    pass
```