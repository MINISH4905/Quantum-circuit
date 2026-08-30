---
module: fundamentals-of-quantum-algorithms
concept: Shor's Algorithm
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [SolveSATWithGrover]
---

## Quiz

### Q1
**Question:** What is the primary problem that Shor's algorithm solves?
- A) Finding the ground state of a quantum Hamiltonian
- B) Factoring large integers efficiently
- C) Simulating quantum systems
- D) Searching an unstructured database

**Correct:** B
**Explanation:** Shor's algorithm efficiently factors large integers, which has profound implications for cryptography, particularly RSA encryption, whose security relies on the difficulty of integer factorization.

### Q2
**Question:** Which two classical algorithms does Shor's algorithm combine to achieve its speedup?
- A) Linear search and binary search
- B) Greatest common divisor (GCD) computation and continued fractions
- C) Matrix multiplication and eigenvalue decomposition
- D) Fourier transform and Gaussian elimination

**Correct:** B
**Explanation:** Shor's algorithm reduces the factoring problem to finding the period of a function, which is solved using the quantum period-finding subroutine (based on the quantum Fourier transform) and classical post-processing using the greatest common divisor (GCD) algorithm.

### Q3
**Question:** What is the key quantum subroutine that provides the exponential speedup in Shor's algorithm?
- A) Grover's search
- B) Quantum Fourier transform
- B) Quantum teleportation
- D) Quantum error correction

**Correct:** B
**Explanation:** The quantum Fourier transform (QFT) is the core quantum subroutine that enables the period-finding step of Shor's algorithm, providing the exponential speedup over classical period-finding methods.

### Q4
**Question:** After the quantum period-finding step, what classical step is essential to recover the factors?
- A) Solving a system of linear equations
- B) Computing the greatest common divisor (GCD) of certain values
- C) Applying the Chinese remainder theorem
- D) Performing a Grover search

**Correct:** B
**Explanation:** After the quantum period-finding step outputs a period r, the classical step of computing gcd(r, N) and gcd(r/2 ± 1, N) (where N is the integer to factor) reveals the non-trivial factors of N.

### Q5
**Question:** Why can't Shor's algorithm factor the integer N = 15 efficiently on a classical computer, but can do so efficiently on a quantum computer?
- A) Classical computers cannot perform modular exponentiation
- B) Classical computers require exponential time to find the period of the modular exponential function, while the quantum Fourier transform finds it in polynomial time
- C) Classical computers lack sufficient qubits
- D) The integer 15 is too small for classical algorithms to handle

**Correct:** B
**Explanation:** The core difficulty for classical computers is finding the period r of the function f(x) = a^x mod N. While this can be done quickly on a quantum computer using the QFT, the best-known classical algorithms require exponential time in the number of bits of N.