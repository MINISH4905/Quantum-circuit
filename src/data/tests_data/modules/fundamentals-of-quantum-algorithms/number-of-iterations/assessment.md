---
module: fundamentals-of-quantum-algorithms
concept: Choosing the Number of Grover Iterations
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [GroversAlgorithm]
---

## Quiz

### Q1
**Question:** What is the approximate optimal number of Grover iterations for a database of N = 4 items?
- A) 1 iteration
- B) √N = 2 iterations
- C) N/2 = 2 iterations
- D) Both B and C

**Correct:** D
**Explanation:** For N = 4 items, the optimal number of Grover iterations is approximately (π/4)√N ≈ 1.57, which rounds to 1 or 2 iterations. Both 1 and 2 iterations are viable, with 2 iterations sometimes giving slightly better probability depending on the exact initial state.

### Q2
**Question:** What happens if too few Grover iterations are performed?
- A) The target state probability is maximized
- B) The target state probability is suboptimal but non-zero
- C) The quantum state becomes |0⟩
- D) The algorithm errors out

**Correct:** B
**Explanation:** If too few iterations are performed, the state vector has not rotated sufficiently toward the target state, so the probability of measuring the target is less than the maximum achievable value.

### Q3
**Question:** What happens if too many Grover iterations are performed?
- A) The target state probability is maximized
- B) The target state probability begins to decrease (overshoot)
- C) The quantum state becomes |0⟩
- D) The algorithm errors out

**Correct:** B
**Explanation:** Grover's algorithm is periodic. After the optimal number of iterations, the state vector continues to rotate, and beyond a certain point the probability of the target state decreases (overshoot phenomenon). The optimal number maximizes the probability.

### Q4
**Question:** For N = 16 items, approximately how many Grover iterations are needed?
- A) 1 iteration
- B) 4 iterations  
- C) √N = 4 iterations
- D) N/2 = 8 iterations

**Correct:** C
**Explanation:** The optimal number of iterations is approximately (π/4)√N ≈ 1.57 × 4 ≈ 6.28, which rounds to about 5-6 iterations. However, √N = 4 is the order of magnitude, and the exact number is close to 5 for N=16.

### Q5
**Question:** The Grover iteration rotates the state vector by approximately what angle toward the target state?
- A) π/(4√N) radians
- B) π/2 radians
- C) π/4 radians
- D) √N radians

**Correct:** A
**Explanation:** Each Grover iteration rotates the state vector by an angle of approximately 2arcsin(1/√N) ≈ π/(2√N) radians in the 2-dimensional subspace. The total rotation needed is approximately π/2 to reach the target state, requiring about (π/4)√N iterations.

## Challenges

### Challenge 1 — Optimal Iterations for N=4
**Difficulty:** intermediate
**Description:** Build a Grover circuit for N=4 (2 qubits) and apply the optimal number of iterations (1 or 2) to maximize the probability of measuring the target state |11⟩. Verify the probability is at least 0.8.
**Target:**
```json
{ "type": "measurement_probability", "target": {"11": 0.8}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def optimal_iterations_n4(qc: QuantumCircuit, qs: list) -> QuantumCircuit:
    # Your code here
    pass
```

### Challenge 2 — Compare 1 vs 2 Iterations for N=4
**Difficulty:** intermediate
**Description:** Build two Grover circuits for N=4: one with 1 iteration and one with 2 iterations. Compare the measurement probabilities of the target state |11⟩ and determine which gives the higher probability.
**Target:**
```json
{ "type": "measurement_probability", "target": {"11_1iter": ">0.7", "11_2iter": ">0.7"}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit

def compare_iterations(qc: QuantumCircuit, qs: list, num_iterations: int) -> QuantumCircuit:
    # Your code here
    pass
```