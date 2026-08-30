---
module: fundamentals-of-quantum-algorithms
concept: Simulating Classical Computations
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [SolveSATWithGrover]
---

## Quiz

### Q1
**Question:** What is the primary difference between classical and quantum computation?
- A) Classical computation uses deterministic logic gates, while quantum computation uses quantum gates that can create superposition and entanglement
- B) Classical computation is faster than quantum computation
- C) Quantum computation cannot solve problems that classical computation can solve
- D) Classical computation requires quantum states

**Correct:** A
**Explanation:** Classical computation operates on definite bits (0 or 1), while quantum computation uses quantum bits (qubits) that can exist in superposition, enabling fundamentally different algorithmic approaches like Grover's search and Shor's factoring.

### Q2
**Question:** Which of the following problems can be efficiently simulated on a classical computer?
- A) Finding the ground state of a quantum Hamiltonian for 50 qubits
- B) Simulating the output of a polynomial-size quantum circuit
- C) Factoring a 2048-bit RSA integer
- D) Solving the traveling salesman problem for 100 cities

**Correct:** B
**Explanation:** While classical computers cannot efficiently solve problems like factoring large integers or simulating large quantum systems, they can efficiently simulate polynomial-size quantum circuits, though the simulation cost grows exponentially with the number of qubits.

### Q3
**Question:** What is the computational cost of simulating n qubits on a classical computer?
- A) O(n) operations
- B) O(n²) operations
- C) O(2ⁿ) operations (exponential in n)
- D) O(log n) operations

**Correct:** C
**Explanation:** Simulating n qubits classically requires tracking the state vector which has 2ⁿ complex amplitudes, making the simulation cost exponential in n. This is why quantum computers provide a potential advantage for problems that involve large Hilbert spaces.

### Q3
**Question:** (Duplicate corrected): Which of the following quantum algorithms can be efficiently simulated on a classical computer?
- A) Shor's algorithm for integer factorization
- B) Grover's algorithm for unstructured search
- C) TheDeutsch-Jozsa algorithm
- D) All of the above

**Correct:** C
**Explanation:** The Deutsch-Jozsa algorithm can be efficiently simulated on a classical computer because it only requires a single query and the classical verification is efficient. In contrast, Shor's and Grover's algorithms provide provable quantum speedups that cannot be efficiently simulated classically.

### Q5
**Question:** Why is the simulation of quantum algorithms on classical computers important for quantum computing research?
- A) It allows verification of quantum algorithm correctness before running on hardware
- B) It proves that quantum computers are not needed for any computation
- C) It shows that quantum algorithms are no better than classical ones
- D) It demonstrates that quantum states can be fully described classically

**Correct:** A
**Explanation:** Classical simulation of quantum algorithms is essential for testing and verifying algorithm correctness, exploring parameter regimes, and understanding the sources of quantum speedup before running on actual quantum hardware, which is limited and error-prone.

## Challenges

### Challenge 1 — Simulate Deutsch-Jozsa on 2 Qubits
**Difficulty:** intermediate
**Description:** Use classical simulation to verify the Deutsch-Jozsa algorithm for a 2-qubit constant function. Simulate the circuit and verify that the probability of measuring |00⟩ is ≥ 0.9.
**Target:**
```json
{ "type": "value", "target": {"prob_00": "≥ 0.9"}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit, Aer simulator

def simulate_deutsch_jossa_constant() -> dict:
    # Your code here
    pass
```

### Challenge 2 — Simulate Grover Search on 3 Qubits
**Difficulty:** intermediate
**Description:** Use classical simulation to verify Grover's algorithm for N=8 (3 qubits) with 1 marked item. Simulate the circuit with the optimal number of iterations and verify the probability of measuring the marked state.
**Target:**
```json
{ "type": "value", "target": {"prob_markeds": "≥ 0.8"}, "tolerance": 0.1 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit, Aer

def simulate_grover_search() -> dict:
    # Your code here
    pass
```