---
module: fundamentals-of-quantum-algorithms
concept: Two Examples: Factoring and GCDs
difficulty_progression: [intermediate]
source_reference: qiskit-documentation-learning
katas_reference_categories: [SolveSATWithGrover]
---

## Quiz

### Q1
**Question:** What is the greatest common divisor (GCD) and why is it important in quantum algorithms?
- A) The GCD of two integers is the largest integer that divides both without a remainder; it is essential for Shor's algorithm to recover factors from the period
- B) The GCD is the smallest integer that is a multiple of both integers; it is used for quantum state initialization
- C) The GCD measures the entanglement between two quantum registers
- D) The GCD calculates the phase estimate in the quantum Fourier transform

**Correct:** A
**Explanation:** The greatest common divisor (GCD) of two integers a and b is the largest positive integer that divides both a and b without a remainder. In Shor's algorithm, the GCD is the classical post-processing step that extracts the non-trivial factors from the period found by the quantum Fourier transform.

### Q2
**Question:** In the context of Shor's algorithm, what does the classical GCD computation operate on?
- A) The quantum state amplitudes
- B) The period r found by the quantum period-finding subroutine
- C) The oracle's phase flip results
- D) The Hadamard-transformed input state

**Correct:** B
**Explanation:** After the quantum period-finding subroutine outputs the period r, the classical GCD computation operates on r and the integer N being factored, computing gcd(r, N) and gcd(r/2 ± 1, N) to reveal the non-trivial factors of N.

### Q3
**Question:** If N = 15 and the period r = 4, what are the values of gcd(r, N) and gcd(r/2 ± 1, N)?
- A) gcd(4, 15) = 1, gcd(2 ± 1, 15) = {gcd(1, 15), gcd(3, 15)} = {1, 3}
- B) gcd(4, 15) = 15, gcd(2 ± 1, 15) = {gcd(1, 15), gcd(3, 15)} = {1, 3}
- C) gcd(4, 15) = 1, gcd(2 ± 1, 15) = {gcd(1, 15), gcd(3, 15)} = {1, 3}
- D) gcd(4, 15) = 1, gcd(2 ± 1, 15) = {gcd(1, 15), gcd(3, 15)} = {1, 3}

**Correct:** A
**Explanation:** gcd(4, 15) = 1 since 4 and 15 share no common factors. gcd(1, 15) = 1 and gcd(3, 15) = 3. The factor 3 is a non-trivial factor of 15, and multiplying by another run may reveal factor 5.

### Q3
**Question:** (Duplicate corrected): What condition must be met for the GCD-based post-processing in Shor's algorithm to successfully reveal a non-trivial factor?
- A) The period r must be odd
- B) The period r must be even, and gcd(r/2 ± 1, N) must yield a non-trivial factor
- C) The period r must be a multiple of N
- D) The period r must be less than N

**Correct:** B
**Explanation:** For the GCD-based post-processing to succeed, the period r must be even, and at least one of gcd(r/2 ± 1, N) must yield a non-trivial factor (neither 1 nor N). If r is odd, the algorithm must be repeated with a different base a.

### Q5
**Question:** Why is the GCD computation considered efficient classically, even though Shor's algorithm provides an exponential quantum speedup for the period-finding part?
- A) The GCD computation uses only polynomial-time classical operations (Euclidean algorithm)
- B) The GCD computation requires quantum superposition
- C) The GCD computation relies on the quantum Fourier transform
- D) The GCD computation measures the quantum state directly

**Correct:** A
**Explanation:** The GCD is computed classically using the Euclidean algorithm, which runs in polynomial time (O(log²N) bit operations). This is exponentially faster than the best-known classical period-finding algorithm, but still efficient classically on its own.

## Challenges

### Challenge 1 — Classical GCD Post-Processing
**Difficulty:** introductory
**Description:** Implement the classical GCD post-processing step of Shor's algorithm. Given a period r and integer N, compute gcd(r, N) and gcd(r/2 ± 1, N) to identify potential factors. Verify your implementation with N = 15 and r = 4, which should yield factors 3 and 5.
**Target:**
```json
{ "type": "value", "target": {"gcd_1": 1, "gcd_2": 3}, "tolerance": 0.01 }
```
**Starter code:**
```python
import math

def shor_gcd_post_processing(r: int, N: int) -> dict:
    # Your code here
    pass
```

### Challenge 2 — Verify Factors of N = 15
**Difficulty:** introductory
**Description:** Given N = 15 and r = 4 (a period found by the quantum subroutine), verify that the GCD-based post-processing correctly identifies the factors of 15. Compute gcd(4, 15) and gcd(2 ± 1, 15), and confirm that the results include the non-trivial factors 3 and 5.
**Target:**
```json
{ "type": "value", "target": {"gcd_1": 1, "gcd_2": 3, "factor_5": 5}, "tolerance": 0.01 }
```
**Starter code:**
```python
import math

def verify_factors(N: int, r: int) -> dict:
    # Your code here
    pass
```