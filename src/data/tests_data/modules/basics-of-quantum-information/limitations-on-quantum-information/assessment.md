---
module: basics-of-quantum-information
concept: Limitations on Quantum Information
difficulty_progression: [introductory]
source_reference: qiskit-documentation-learning
katas_reference_categories: [Measurements]
---

## Quiz

### Q1
**Question:** Which of the following is a fundamental limitation on quantum information processing?
- A) The no-cloning theorem prohibits copying an arbitrary unknown quantum state
- B) Quantum states can be perfectly distinguished with a single measurement
- C) Quantum computers can solve NP-complete problems in polynomial time
- D) Qubit coherence times are unlimited

**Correct:** A
**Explanation:** The no-cloning theorem is a fundamental limitation that prohibits creating an identical copy of an arbitrary unknown quantum state. This distinguishes quantum information from classical information and has important implications for quantum cryptography and quantum computing.

### Q2
**Question:** Which inequality provides a fundamental limit on the probability of distinguishing two non-orthogonal quantum states?
- A) The no-cloning theorem
- B) The Holevo bound
- C) The Bell inequality
- D) The Pauli exclusion principle

**Correct:** B
**Explanation:** The Holevo bound limits the amount of classical information that can be extracted from a quantum state. It also provides a fundamental limit on the probability of distinguishing between non-orthogonal quantum states, which cannot be distinguished with certainty via any measurement.

### Q3
**Question:** If two quantum states |ψ⟩ and |φ⟩ have an inner product ⟨ψ|φ⟩ = 1/√2, what is the maximum probability of correctly distinguishing them with a single measurement?
- A) 1/2
- B) (2 + √2)/4 ≈ 0.854
- C) (2 − √2)/4 ≈ 0.146
- D) 1

**Correct:** B
**Explanation:** For two pure state quantum sources with equal a priori probabilities, the minimum error discrimination probability is P_success = (1 + √(1 − |⟨ψ|φ⟩|²))/2. With |⟨ψ|φ⟩| = 1/√2, we have P_success = (1 + √(1 − 1/2))/2 = (1 + 1/√2)/2 = (2 + √2)/4 ≈ 0.854.

### Q4
**Question:** Which of the following best describes the relationship between distinguishability and inner product?
- A) States with inner product 0 are perfectly distinguishable
- B) States with inner product 1 are perfectly distinguishable
- C) States with inner product 0 cannot be distinguished
- D) Inner product has no relationship with distinguishability

**Correct:** A
**Explanation:** Two quantum states are perfectly distinguishable if and only if they are orthogonal, meaning their inner product ⟨ψ|φ⟩ = 0. If the inner product is non-zero, the states have some overlap and cannot be distinguished with certainty in a single measurement.

### Q5
**Question:** The no-broadcasting theorem is a generalization of the no-cloning theorem. What does it state?
- A) Quantum states can be broadcast (copied) to many receivers using entanglement
- B) Quantum states cannot be broadcast (copied) to multiple unknown recipients
- C) Only classical states can be broadcast, not quantum states
- D) Both A and C are correct

**Correct:** B
**Explanation:** The no-broadcasting theorem states that quantum states cannot be copied (broadcast) to multiple unknown recipients. This is a generalization of the no-cloning theorem, which prohibits copying a single unknown state. Broadcasting would require creating multiple copies simultaneously, which is impossible for unknown quantum states.

## Challenges

**Note:** This lesson focuses on conceptual understanding of fundamental limitations in quantum information. Quiz-only assessment is appropriate as the concepts are primarily theoretical rather than circuit-building oriented. No circuit challenges are provided for this lesson.

**Supplementary concept:** Learners interested in experimental demonstration can explore the no-cloning theorem using Qiskit's quantum simulator by attempting to create a copy of an arbitrary single-qubit state and verifying that the original and "copy" states are not identical.