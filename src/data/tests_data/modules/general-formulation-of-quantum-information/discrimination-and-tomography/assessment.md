---
module: general-formulation-of-quantum-information
concept: Quantum State Discrimination and Tomography
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [Measurements]
---

## Quiz

### Q1
**Question:** What is the primary goal of quantum state discrimination?
- A) To create entanglement between quantum systems
- B) To identify which of a given set of quantum states was prepared
- C) To purify a mixed quantum state
- D) To compute the fidelity of a quantum channel

**Correct:** B
**Explanation:** Quantum state discrimination is the task of identifying which of a given set of quantum states was prepared, based on a single copy of the state and a measurement.

### Q2
**Question:** If two non-orthogonal quantum states |ψ⟩ and |φ⟩ have an inner product ⟨ψ|φ⟩ = 0.5, what can be said about their discriminability?
- A) They can be perfectly distinguished with a single measurement
- B) They can be distinguished with probability greater than 1/2 but less than 1
- C) They cannot be distinguished at all
- D) Their discriminability depends only on the measurement basis

**Correct:** B
**Explanation:** For two non-orthogonal states, the optimal probability of correctly identifying the state is (1 + √(1 − |⟨ψ|φ⟩|²))/2. With |⟨ψ|φ⟩| = 0.5, this gives a probability greater than 1/2 but less than 1.

### Q3
**Question:** Which of the following best describes the purpose of quantum process tomography?
- A) To determine the input state of a quantum system
- B) To characterize a quantum channel by reconstructing its complete quantum operation
- C) To measure the fidelity of a quantum state
- D) To create entanglement between quantum systems

**Correct:** B
**Explanation:** Quantum process tomography characterizes a quantum channel by reconstructing its complete quantum operation, typically by preparing known input states, applying the channel, and performing full state tomography on the outputs.

### Q3
**Question:** (Duplicate corrected): What is the minimum number of different input states needed for process tomography of a single-qubit quantum channel?
- A) 1
- B) 2
- C) 3
- D) 4

**Correct:** D
**Explanation:** Process tomography of a single-qubit channel requires at least 4 different input states (typically |0⟩, |1⟩, |+⟩, |+i⟩) to uniquely determine the channel's action on the entire Bloch sphere.

### Q5
**Question:** If a quantum channel is modeled by a Kraus representation {Eᵢ}, what does Naimark's theorem imply about implementing this channel?
- A) The channel cannot be implemented unitarily
- B) The channel can be implemented by extending the system with an ancilla and performing a projective measurement
- C) The channel requires post-selection to be implementable
- D) The channel is only implementable classically

**Correct:** B
**Explanation:** Naimark's theorem implies that any quantum channel described by Kraus operators can be implemented by extending the system with an ancilla and performing a projective measurement, which is the physical implementation of the channel via a unitary evolution on the combined system.

## Challenges

### Challenge 1 — State Discrimination: Optal Probability for Two Non-Orthogonal States
**Difficulty:** introductory
**Description:** Implement a circuit that discriminates between two non-orthogonal quantum states |ψ⟩ = |0⟩ and |φ⟩ = cos(θ)|0⟩ + sin(θ)|1⟩ with θ = π/4, using the optimal measurement that maximizes the success probability.
**Target:**
```json
{ "type": "value", "target": {"success_probability": 0.85}, "tolerance": 0.05 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit
import numpy as np

def state_discrimination_optimal(theta: float) -> QuantumCircuit:
    # Your code here
    pass
```

### Challenge 2 — Process Tomography for a Single-Qubit Depolarizing Channel
**Difficulty:** intermediate
**Description:** Implement process tomography for a single-qubit depolarizing channel with depolarizing probability p. The channel maps ρ → (1−p)ρ + (p/3)(XρX + YρY + ZρZ). Use the standard input states |0⟩, |1⟩, |+⟩, |+i⟩ and perform state tomography on the outputs.
**Target:**
```json
{ "type": "value", "target": {"process_fidelity": 0.95}, "tolerance": 0.05 }
```
**Starter code:**
```python
from qiskit import QuantumCircuit, Aer
import numpy as np

def process_tomography_depolarizing(p: float) -> dict:
    # Your code here
    pass
```