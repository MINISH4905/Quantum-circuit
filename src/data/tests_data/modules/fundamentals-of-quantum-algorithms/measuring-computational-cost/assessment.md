---
module: fundamentals-of-quantum-algorithms
concept: Measuring Computational Cost
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [SolveSATWithGrover]
---

## Quiz

### Q1
**Question:** What is the primary metric for measuring the computational cost of a quantum algorithm?
- A) The number of qubits used
- B) The number of oracle queries
- C) The circuit depth in terms of gate operations
- D) Both B and C

**Correct:** D
**Explanation:** The computational cost of a quantum algorithm is typically measured by the number of oracle queries (for algorithmic complexity) and the circuit depth (for practical implementation complexity). Both are important for understanding the efficiency of the algorithm.

### Q2
**Question:** In Grover's algorithm, what does the computational cost scale as with respect to the number of items N?
- A) O(1)
- B) O(log N)
- C) O(√N) oracle queries
- D) O(N²)

**Correct:** C
**Explanation:** Grover's algorithm requires O(√N) oracle queries to find the marked item with high probability, providing a quadratic speedup over the classical O(N) search.

### Q3
**Question:** What is the computational cost of the quantum Fourier transform (QFT) on n qubits?
- A) O(n) oracle queries
- B) O(n²) gate operations
- C) O(2ⁿ) gate operations
- D) O(n log n) oracle queries

**Correct:** B
**Explanation:** The quantum Fourier transform on n qubits can be implemented with O(n²) gate operations (Hadamard and controlled-phase gates), making it efficient compared to the classical FFT which also runs in O(n log n) but requires classical computation.

### Q3
**Question:** (Duplicate corrected): What is the main computational advantage of Shor's algorithm over classical algorithms?
- A) It uses fewer qubits
- B) It solves integer factorization in polynomial time using O(n²) gate operations and O(n) oracle queries
- C) It provides a quadratic speedup for unstructured search
- D) It guarantees exact results without error

**Correct:** B
**Explanation:** Shor's algorithm solves integer factorization in polynomial time, with O(n²) gate operations and O(n) oracle queries for an n-bit integer, which is exponentially faster than the best-known classical algorithms.

### Q5
**Question:** Why is it important to measure the computational cost of quantum algorithms?
- A) To determine how many physical qubits are needed
- B) To assess the practical feasibility of running the algorithm on real quantum hardware
- C) To calculate the probability of measurement outcomes
- D) To initialize the quantum state correctly

**Correct:** B
**Explanation:** The computational cost determines whether a quantum algorithm can be run on available quantum hardware within reasonable time and resource constraints. High cost may make an algorithm impractical despite its theoretical speedup.

## Challenges

### Challenge 1 — Oracle Query Complexity Estimation
**Difficulty:** intermediate
**Description:** Estimate the oracle query complexity for a given quantum algorithm. For Grover's algorithm with N = 16 items, how many oracle queries are needed to achieve at least 50% probability of success?
**Target:**
```json
{ "type": "value", "target": {"oracle_queries": 12}, "tolerance": 2 }
```
**Starter code:**
```python
def estimate_oracle_queries(N: int) -> int:
    # Your code here
    pass
```

### Challenge 2 — Circuit Depth Comparison
**Difficulty:** intermediate
**Description:** Compare the circuit depth of implementing the QFT classically vs. quantumly for n = 3 qubits. The quantum QFT should have fewer gate operations than the classical simulation approach.
**Target:**
```json
{ "type": "value", "target": {"quantum_depth": "< classical_depth"}, "tolerance": 0.1 }
```
**Starter code:**
```python
def compare_circuit_depth(n: int) -> dict:
    # Your code here
    pass
```