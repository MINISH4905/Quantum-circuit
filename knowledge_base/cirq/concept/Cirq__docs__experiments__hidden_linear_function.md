---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/experiments/hidden_linear_function.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/experiments/hidden_linear_function.ipynb
license: Apache-2.0
---

##### Copyright 2020 The Cirq Developers

```python
# @title Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
```

# Hidden linear function problem

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/experiments/hidden_linear_function"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/experiments/hidden_linear_function.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/experiments/hidden_linear_function.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/experiments/hidden_linear_function.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

```python
try:
    import cirq
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    print("installed cirq.")
```

In this notebook we consider a problem from the paper "Quantum advantage with shallow circuits" [[1]](https://arxiv.org/abs/1704.00690) and build a quantum circuit, which solves it, in Cirq.

## Introduction

It's well-known that some problems can be solved on the quantum computer exponentially faster than on the classical one in terms of computation time. However, there is more subtle way in which quantum computers are more powerful. There is a problem, which can be solved by quantum circuit of constant depth, but can't be solved by classical circuit of constant depth. In this notebook we will consider this problem.


### Structure of this notebook

We start by giving formal statement of the problem. Then we solve this problem in a straightforward way, which follows directly from the problem definition. We will use this solution to verify our quantum solution in the next part. Also, this part contains helper code to generate "interesting" instances of the problem.

In the next part we solve this problem with Cirq. First, we write a code which builds a quantum circuit for solving arbitrary instances of the problem. Then we use Cirq's Clifford simulator to simulate this circuit. We do it for small instances and compare results to the brute force solution from the previous part. Then, we solve the problem for a larger instance of the problem to demonstrate that it can be solved efficiently.

Goal of this notebook is to introduce the reader to the problem and to show how Cirq can be used to solve it. We don't include proofs, but we refer the reader to corresponding lemmas in the original paper.

## Problem statement

In this problem we consider a [quadratic form](https://en.wikipedia.org/wiki/Quadratic_form) of a [binary vector](https://en.wikipedia.org/wiki/Bit_array) and with binary coefficients (but additions and multiplications are evaluated modulo 4). Then we restrict this quadratic form, i.e. we allow to use only certain binary vectors as input. It turns out that under this restriction this quadratic form is equivalent to a linear function, i.e. it just evaluates dot product of input vector and certain scalar vector. Task is to find this scalar vector.

In other words, we have a linear function, which is "hidden" inside a quadratic form.

### Formal statement of the problem

Consider $A \in \mathbb{F}_2^{n \times n}$ - upper-triangular binary matrix of size $n \times n$, $b \in \mathbb{F}_2^n$ - binary vector of length $n$.

Define a function $q : \mathbb{F}_2^n \to \mathbb{Z}_4$:

$$q(x) = (2 x^T A x + b^T x) ~\text{mod}~ 4 = \left(2 \sum_{i,j}A_{i,j}x_i x_j + \sum_{i} b_i x_i \right) ~\text{mod}~ 4 , $$ 

Also define

$$\mathcal{L}_q = \Big\{x \in  \mathbb{F}_2^n : q(x \oplus y) = (q(x) + q(y)) ~\text{mod}~ 4 ~~ \forall y \in \mathbb{F}_2^n \Big\}.$$

Turns out (see Lemma 1 on page 6 in [[1]](https://arxiv.org/abs/1704.00690)) that restriction of $q$ on $\mathcal{L}_q$ is a linear function, i.e. there exists such $z \in \mathbb{F}_2^n$, that

$$q(x) = 2 z^T x ~~\forall x \in \mathcal{L}_q.$$

Our task is, given $A$ and $b$, to find $z$. There may be multiple answers - we need to find any such answer.

**Notation in the problem**

* $q$ - quadratic form; $A$ - matrix of its quadratic coefficients; $b$ - vector of its linear coefficients;
* $\mathcal{L}_q$ - linear space on which we restrict $q(x)$ in order to get linear function;
* $z$ - vector of coefficients of the linear function we get by restricting $q$ on $\mathcal{L}_q$. This vector is "hidden" in the coefficients of $q$ and the problem is to find it.

### Why is this problem interesting?

#### 1. It's a problem without an oracle

There are other problems where task is to find coefficients of a linear function. But usually the linear function is represented by an [oracle](https://en.wikipedia.org/wiki/Oracle_machine). See, for example, [Bernstein–Vazirani algorithm](https://en.wikipedia.org/wiki/Bernstein%E2%80%93Vazirani_algorithm).

In this problem we avoid use of an oracle by "hiding" the linear function in the coefficients of quadratic form $A$ and $b$, which are the only inputs to the problem.

#### 2. Quantum circuits have advantage over classical when solving this problem

As we will show below, this problem can be solved with a Clifford circuit. Therefore, according to the [Gottesman–Knill theorem](https://en.wikipedia.org/wiki/Gottesman%E2%80%93Knill_theorem), this problem can be solved in polynomial time on a classical computer. So, it might look like quantum computers aren't better than classical ones in solving this problem.

However, if we apply certain restrictions on matrix $A$, the circuit will have fixed depth (i.e. number of `Moment`s). Namely, if the matrix $A$ is an adjacency matrix of a "grid" graph (whose edges can be colored in 4 colors), all CZ gates will fit in 4 `Moment`s, and overall we will have only 8 `Moment`s - and this doesn't depend on $n$.

But for classical circuits it can be proven (see [[1]](https://arxiv.org/abs/1704.00690)) that even if we restrict matrix $A$ in the same way, the depth of classical circuit (with gates of bounded fan-in) must grow as $n$ grows (in fact, it grows as $\log(n)$).

In terms of complexity theory, this problem is in [QNC<sup>0</sup>](https://complexityzoo.net/Complexity_Zoo:Q#qnc0), but not in [NC<sup>0</sup>](https://en.wikipedia.org/wiki/NC_(complexity)), which shows that
QNC<sup>0</sup> $\nsubseteq$ NC<sup>0</sup>.

## Preparation and brute force solution

For small values of $n$ we can solve this problem with a trivial brute force solution. First, we need to build $\mathcal{L}_q$. We can do that by checking for all possible $2^n$ binary vectors, whether it belongs to $\mathcal{L}_q$, using the definition of $\mathcal{L}_q$. Then we need to try all possible $z \in \mathbb{F}_2^n$, and for each of them and for each $x \in \mathcal{L}_q$ check whether $q(x) = 2 z^T x$.

Below we implement a class which represents an instance of a problem and solves it with a brute force solution.

```python
import numpy as np
import cirq
```

```python
class HiddenLinearFunctionProblem:
    """Instance of Hidden Linear Function problem.

    The problem is defined by matrix A and vector b, which are
    the coefficients of quadratic form, in which linear function
    is "hidden".
    """

    def __init__(self, A, b):
        self.n = A.shape[0]
        assert A.shape == (self.n, self.n)
        assert b.shape == (self.n,)
        for i in range(self.n):
            for j in range(i + 1):
                assert A[i][j] == 0, 'A[i][j] can be 1 only if i<j'

        self.A = A
        self.b = b

    def q(self, x):
        """Action of quadratic form on binary vector (modulo 4).

        Corresponds to `q(x)` in problem definition.
        """
        assert x.shape == (self.n,)
        return (2 * (x @ self.A @ x) + (self.b @ x)) % 4

    def bruteforce_solve(self):
        """Calculates, by definition, all vectors `z` which are solutions to the problem."""

        # All binary vectors of length `n`.
        all_vectors = [np.array([(m >> i) % 2 for i in range(self.n)]) for m in range(2**self.n)]

        def vector_in_L(x):
            for y in all_vectors:
                if self.q((x + y) % 2) != (self.q(x) + self.q(y)) % 4:
                    return False
            return True

        # L is subspace to which we restrict domain of quadratic form.
        # Corresponds to `L_q` in the problem definition.
        self.L = [x for x in all_vectors if vector_in_L(x)]

        # All vectors `z` which are solutions to the problem.
        self.all_zs = [z for z in all_vectors if self.is_z(z)]

    def is_z(self, z):
        """Checks by definition, whether given vector `z` is solution to this problem."""
        assert z.shape == (self.n,)
        assert self.L is not None
        for x in self.L:
            if self.q(x) != 2 * ((z @ x) % 2):
                return False
        return True
```

For testing, we need to generate an instance of a problem. We can generate random $A$ and $b$. However, for some $A$ and $b$ problem is trivial - that is, $\mathcal{L}_q = \{0\}$ and therefore any $z$ is a solution. In fact, product of $|\mathcal{L}_q|$ and number of solutions is always equal to $2^n$ (see Lemma 2 in [[1]](https://arxiv.org/abs/1704.00690)), so we want a problem with large $\mathcal{L}_q$.

Code below can be used to generate random problem with given size of $\mathcal{L}_q$.

```python
def random_problem(n, seed=None):
    """Generates instance of the problem with given `n`.

    Args:
        n: dimension of the problem.
    """
    if seed is not None:
        np.random.seed(seed)
    A = np.random.randint(0, 2, size=(n, n))
    for i in range(n):
        for j in range(i + 1):
            A[i][j] = 0
    b = np.random.randint(0, 2, size=n)
    problem = HiddenLinearFunctionProblem(A, b)
    return problem


def find_interesting_problem(n, min_L_size):
    """Generates "interesting" instance of the problem.

    Returns instance of problem with given `n`, such that size of
    subspace `L_q` is at least `min_L_size`.

    Args:
        n: dimension of the problem.
        min_L_size: minimal cardinality of subspace L.
    """
    for _ in range(1000):
        problem = random_problem(n)
        problem.bruteforce_solve()
        if len(problem.L) >= min_L_size and not np.max(problem.A) == 0:
            return problem
    return None


problem = find_interesting_problem(10, 4)
print("Size of subspace L: %d" % len(problem.L))
print("Number of solutions: %d" % len(problem.all_zs))
```

We ran this function for a while and found an instance with $n=10$ and $|\mathcal{L}_q|=16$, so only 64 of 1024 possible vectors are solutions. So, chance of randomly guessing a solution is $\frac{1}{16}$. We define this instance below by values of $A$ and $b$ and we will use it later to verify our quantum solution.

```python
A = np.array(
    [
        [0, 1, 1, 0, 0, 1, 0, 0, 1, 1],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
)
b = np.array([0, 0, 0, 0, 1, 1, 1, 0, 0, 1])
problem_10_64 = HiddenLinearFunctionProblem(A, b)
problem_10_64.bruteforce_solve()
print("Size of subspace L: %d" % len(problem_10_64.L))
print("Number of solutions: %d" % len(problem_10_64.all_zs))
```

## Solution with a quantum circuit

As shown in [[1]](https://arxiv.org/abs/1704.00690), given problem can be solved by a quantum circuit, which implements operator $H ^ {\otimes n} U_q H ^ {\otimes n}$, where

$$U_q = \prod_{1 < i < j < n} CZ_{ij}^{A_{ij}} \cdot \bigotimes_{j=1}^{n} S_j^{b_j} .$$

We need to apply this operator to $| 0^n \rangle$ and measure the result - result is guaranteed to be one of the solutions. Moreover, we can get any solution with equal probability. 

**Why does this circuit solve the problem?** Define $p(z) = \left| \langle z | H ^ {\otimes n} U_q H ^ {\otimes n} | 0^n \rangle \right|^2$. It can be shown that $p(z)>0$ iff $z$ is a solution. For the proof, see Lemma 2 on page 7 in [[1]](https://arxiv.org/abs/1704.00690).

Let's generate such a circuit and simulate it.

Note that: 

* We use `Cirq.S` gate, whose matrix is $\left(\begin{smallmatrix}1 & 0\\0 & i\end{smallmatrix}\right)$. In the paper [[1]](https://arxiv.org/abs/1704.00690) matrix of S gate is defined as $\left(\begin{smallmatrix}1 & 0\\0 & -i\end{smallmatrix}\right)$. But for this problem it doesn't matter.

* We reorder CZ gates in such a way so they take less moments. This is a problem of minimal [edge coloring](https://en.wikipedia.org/wiki/Edge_coloring), and we solve it here with a simple greedy algorithm (there are better algorithms, but finding true optimum is not the point here). We can do that because CZ gates commute (because their matrices are diagonal). This part is not essential to the solution - it just makes the circuit shorter.

* All gates are Clifford gates, so we can use Clifford simulator.

```python
def edge_coloring(A):
    """Solves edge coloring problem.

    Args:
        A: adjacency matrix of a graph.

    Returns list of lists of edges, such as edges in each list
    do not have common vertex.
    Tries to minimize length of this list.
    """
    A = np.copy(A)
    n = A.shape[0]
    ans = []
    while np.max(A) != 0:
        edges_group = []
        used = np.zeros(n, dtype=bool)
        for i in range(n):
            for j in range(n):
                if A[i][j] == 1 and not used[i] and not used[j]:
                    edges_group.append((i, j))
                    A[i][j] = 0
                    used[i] = used[j] = True
        ans.append(edges_group)
    return ans
```

```python
def generate_circuit_for_problem(problem):
    """Generates `cirq.Circuit` which solves instance of Hidden Linear Function problem."""

    qubits = cirq.LineQubit.range(problem.n)
    circuit = cirq.Circuit()

    # Hadamard gates at the beginning (creating equal superposition of all states).
    circuit += cirq.Moment([cirq.H(q) for q in qubits])

    # Controlled-Z gates encoding the matrix A.
    for layer in edge_coloring(problem.A):
        for i, j in layer:
            circuit += cirq.CZ(qubits[i], qubits[j])

    # S gates encoding the vector b.
    circuit += cirq.Moment([cirq.S.on(qubits[i]) for i in range(problem.n) if problem.b[i] == 1])

    # Hadamard gates at the end.
    circuit += cirq.Moment([cirq.H(q) for q in qubits])

    # Measurements.
    circuit += cirq.Moment([cirq.measure(qubits[i], key=str(i)) for i in range(problem.n)])

    return circuit


def solve_problem(problem, print_circuit=False):
    """Solves instance of Hidden Linear Function problem.

    Builds quantum circuit for given problem and simulates
    it with the Clifford simulator.

    Returns measurement result as binary vector, which is
    guaranteed to be a solution to given problem.
    """
    circuit = generate_circuit_for_problem(problem)

    if print_circuit:
        print(circuit)

    sim = cirq.CliffordSimulator()
    result = sim.simulate(circuit)
    z = np.array([result.measurements[str(i)][0] for i in range(problem.n)])
    return z


solve_problem(problem_10_64, print_circuit=True)
```

## Testing

Now, let's test this algorithm. Let's solve it with a quantum circuit 100 times and each time check that measurement result is indeed an answer to the problem.

```python
def test_problem(problem):
    problem.bruteforce_solve()
    tries = 100
    for _ in range(tries):
        z = solve_problem(problem)
        assert problem.is_z(z)


test_problem(problem_10_64)
print('OK')
```

Let's repeat that for 10 other problems with $n=8$ and chance of random guessing at most $\frac{1}{4}$.

```python
for _ in range(10):
    test_problem(find_interesting_problem(8, 4))
print('OK')
```

Now, let's run our algorithm on a problem with $n=200$.

```python
%%time
tries = 200
problem = random_problem(tries, seed=0)
solve_problem(problem, print_circuit=False)
```

## References

[[1]](https://arxiv.org/abs/1704.00690) Sergey Bravyi, David Gosset and Robert König, "Quantum advantage with shallow circuits" Science 362, no. 6412 (2018): 308-311.
