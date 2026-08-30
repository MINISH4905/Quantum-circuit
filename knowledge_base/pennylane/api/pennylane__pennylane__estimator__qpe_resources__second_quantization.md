---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/qpe_resources/second_quantization.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/qpe_resources/second_quantization.py
license: Apache-2.0
---

## Module `pennylane/estimator/qpe_resources/second_quantization.py`

This module contains the functions needed for resource estimation with the double factorization
method.

## `DoubleFactorization`

```python
class DoubleFactorization(Operation)
```

Estimate the number of non-Clifford gates and logical qubits for a quantum phase estimation
algorithm in second quantization with a double-factorized Hamiltonian.

Atomic units are used throughout the class.

.. seealso::
    :class:`~.FirstQuantization`

Args:
    one_electron (array[array[float]]): one-electron integrals
    two_electron (tensor_like): two-electron integrals
    error (float): target error in the algorithm
    rank_r (int): rank of the first factorization of the two-electron integral tensor
    rank_m (int): average rank of the second factorization of the two-electron integral tensor
    tol_factor (float): threshold error value for discarding the negligible factors
    tol_eigval (float): threshold error value for discarding the negligible factor eigenvalues
    br (int): number of bits for auxiliary qubit rotation
    alpha (int): number of bits for the keep register
    beta (int): number of bits for the rotation angles
    chemist_notation (bool): if True, the two-electron integrals need to be in chemist notation

**Example**

>>> symbols  = ['O', 'H', 'H']
>>> geometry = np.array([[0.00000000,  0.00000000,  0.28377432],
...                      [0.00000000,  1.45278171, -1.00662237],
...                      [0.00000000, -1.45278171, -1.00662237]])
>>> mol = qp.qchem.Molecule(symbols, geometry, basis_name='sto-3g')
>>> core, one, two = qp.qchem.electron_integrals(mol)()
>>> algo = qp.estimator.DoubleFactorization(one, two)
>>> algo.lamb # the 1-Norm of the Hamiltonian
np.float64(53.6...)
>>> algo.gates # estimated number of non-Clifford gates
103969925
>>> algo.qubits # estimated number of logical qubits
290

.. details::
    :title: Theory

    To estimate the gate and qubit costs for implementing this method, the Hamiltonian needs to
    be factorized using the :func:`~.pennylane.qchem.factorize` function following
    [`PRX Quantum 2, 030305 (2021) <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.030305>`_].
    The objective of the factorization is to find a set of symmetric matrices, :math:`L^{(r)}`,
    such that the two-electron integral tensor in
    `chemist notation <http://vergil.chemistry.gatech.edu/notes/permsymm/permsymm.pdf>`_,
    :math:`V`, can be computed as

    .. math::

           V_{ijkl} = \sum_r^R L_{ij}^{(r)} L_{kl}^{(r) T},

    with the rank :math:`R \leq n^2`, where :math:`n` is the number of molecular orbitals. The
    matrices :math:`L^{(r)}` are diagonalized and for each matrix the eigenvalues that are
    smaller than a given threshold (and their corresponding eigenvectors) are discarded. The
    average number of the retained eigenvalues, :math:`M`, determines the rank of the second
    factorization step. The 1-norm of the Hamiltonian can then be computed using the
    :func:`~.pennylane.estimator.DoubleFactorization.norm` function from the electron integrals
    and the eigenvalues of the matrices :math:`L^{(r)}`.

    The total number of gates and qubits for implementing the quantum phase estimation algorithm
    for the given Hamiltonian can then be computed using the functions
    :func:`~.pennylane.estimator.DoubleFactorization.gate_cost` and
    :func:`~.pennylane.estimator.DoubleFactorization.qubit_cost` with a target error that has the
    default value of 0.0016 Ha (chemical accuracy). The costs are computed using Eqs. (C39-C40)
    of [`PRX Quantum 2, 030305 (2021) <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.030305>`_].

### `lamb`

```python
def lamb(self)
```

Return the 1-Norm of the Hamiltonian.

The 1-norm of a double-factorized molecular Hamiltonian is computed using Eqs. (15-17) of
[`Phys. Rev. Research 3, 033055 (2021) <https://journals.aps.org/prresearch/abstract/10.1103/PhysRevResearch.3.033055>`_]

.. math::

    \lambda = ||T|| + \frac{1}{4} \sum_r ||L^{(r)}||^2,

where the Schatten 1-norm for a given matrix :math:`T` is defined as

.. math::

    ||T|| = \sum_k |\text{eigvals}[T]_k|.

The matrices :math:`L^{(r)}` are obtained from factorization of the two-electron integral
tensor :math:`V` such that

.. math::

    V_{ijkl} = \sum_r L_{ij}^{(r)} L_{kl}^{(r) T}.

The matrix :math:`T` is constructed from the one- and two-electron integrals as

.. math::

    T = h_{ij} - \frac{1}{2} \sum_l V_{illj} + \sum_l V_{llij}.

The two-electron integral tensor is arranged in chemist notation.

### `gates`

```python
def gates(self)
```

Return the total number of Toffoli gates needed to implement the double factorization
algorithm.

The expression for computing the cost is taken from Eqs. (45) and (C39) of
[`PRX Quantum 2, 030305 (2021) <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.030305>`_].

### `qubits`

```python
def qubits(self)
```

Return the number of logical qubits needed to implement the double factorization method.

The expression for computing the cost is taken from Eq. (C40) of
[`PRX Quantum 2, 030305 (2021) <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.030305>`_].

### `estimation_cost`

```python
def estimation_cost(lamb, error)
```

Return the number of calls to the unitary needed to achieve the desired error in quantum
phase estimation.

The expression for computing the cost is taken from Eq. (45) of
[`PRX Quantum 2, 030305 (2021) <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.030305>`_].

Args:
    lamb (float): 1-norm of a second-quantized Hamiltonian
    error (float): target error in the algorithm

Returns:
    int: number of calls to unitary

**Example**

>>> lamb = 72.49779513025341
>>> error = 0.001
>>> qp.estimator.DoubleFactorization.estimation_cost(lamb, error)
113880

### `unitary_cost`

```python
def unitary_cost(n, rank_r, rank_m, rank_max, br=7, alpha=10, beta=20)
```

Return the number of Toffoli gates needed to implement the qubitization unitary operator
for the double factorization algorithm.

The expression for computing the cost is taken from Eq. (C39) of
[`PRX Quantum 2, 030305 (2021) <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.030305>`_].

Args:
    n (int): number of molecular spin-orbitals
    rank_r (int): rank of the first factorization of the two-electron integral tensor
    rank_m (float): average rank of the second factorization of the two-electron tensor
    rank_max (int): maximum rank of the second factorization of the two-electron tensor
    br (int): number of bits for auxiliary qubit rotation
    alpha (int): number of bits for the keep register
    beta (int): number of bits for the rotation angles

Returns:
    int: number of Toffoli gates to implement the qubitization unitary

**Example**

>>> kwargs = {'n': 14,
...           'rank_r': 26,
...           'rank_m': 5.5,
...           'rank_max': 7,
...           'br': 7,
...           'alpha': 10,
...           'beta': 20,
...         }
>>> qp.estimator.DoubleFactorization.unitary_cost(**kwargs)
2007

### `gate_cost`

```python
def gate_cost(n, lamb, error, rank_r, rank_m, rank_max, br=7, alpha=10, beta=20)
```

Return the total number of Toffoli gates needed to implement the double factorization
algorithm.

The expression for computing the cost is taken from Eqs. (45) and (C39) of
[`PRX Quantum 2, 030305 (2021) <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.030305>`_].

Args:
    n (int): number of molecular spin-orbitals
    lamb (float): 1-norm of a second-quantized Hamiltonian
    error (float): target error in the algorithm
    rank_r (int): rank of the first factorization of the two-electron integral tensor
    rank_m (float): average rank of the second factorization of the two-electron tensor
    rank_max (int): maximum rank of the second factorization of the two-electron tensor
    br (int): number of bits for auxiliary qubit rotation
    alpha (int): number of bits for the keep register
    beta (int): number of bits for the rotation angles

Returns:
    int: the number of Toffoli gates for the double factorization method

**Example**

>>> kwargs = {'n': 14,
...           'lamb': 52.98761457453095,
...           'error': 0.001,
...           'rank_r': 26,
...           'rank_m': 5.5,
...           'rank_max': 7,
...           'br': 7,
...           'alpha': 10,
...           'beta': 20,
...         }
>>> qp.estimator.DoubleFactorization.gate_cost(**kwargs)
167048631

### `qubit_cost`

```python
def qubit_cost(n, lamb, error, rank_r, rank_m, rank_max, br=7, alpha=10, beta=20)
```

Return the number of logical qubits needed to implement the double factorization method.

The expression for computing the cost is taken from Eq. (C40) of
[`PRX Quantum 2, 030305 (2021) <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.030305>`_].

Args:
    n (int): number of molecular spin-orbitals
    lamb (float): 1-norm of a second-quantized Hamiltonian
    error (float): target error in the algorithm
    rank_r (int): rank of the first factorization of the two-electron integral tensor
    rank_m (float): average rank of the second factorization of the two-electron tensor
    rank_max (int): maximum rank of the second factorization of the two-electron tensor
    br (int): number of bits for auxiliary qubit rotation
    alpha (int): number of bits for the keep register
    beta (int): number of bits for the rotation angles

Returns:
    int: number of logical qubits for the double factorization method

**Example**

>>> kwargs = {'n': 14,
...           'lamb': 52.98761457453095,
...           'error': 0.001,
...           'rank_r': 26,
...           'rank_m': 5.5,
...           'rank_max': 7,
...           'br': 7,
...           'alpha': 10,
...           'beta': 20,
...         }
>>> qp.estimator.DoubleFactorization.qubit_cost(**kwargs)
292

### `norm`

```python
def norm(one, two, eigvals)
```

Return the 1-norm of a molecular Hamiltonian from the one- and two-electron integrals
and eigenvalues of the factorized two-electron integral tensor.

The 1-norm of a double-factorized molecular Hamiltonian is computed using Eqs. (15-17) of
[`Phys. Rev. Research 3, 033055 (2021) <https://journals.aps.org/prresearch/abstract/10.1103/PhysRevResearch.3.033055>`_]

.. math::

    \lambda = ||T|| + \frac{1}{4} \sum_r ||L^{(r)}||^2,

where the Schatten 1-norm for a given matrix :math:`T` is defined as

.. math::

    ||T|| = \sum_k |\text{eigvals}[T]_k|.

The matrices :math:`L^{(r)}` are obtained from factorization of the two-electron integral
tensor :math:`V` such that

.. math::

    V_{ijkl} = \sum_r L_{ij}^{(r)} L_{kl}^{(r) T}.

The matrix :math:`T` is constructed from the one- and two-electron integrals as

.. math::

    T = h_{ij} - \frac{1}{2} \sum_l V_{illj} + \sum_l V_{llij}.

Note that the two-electron integral tensor must be arranged in chemist notation.

Args:
    one (array[array[float]]): one-electron integrals
    two (array[array[float]]): two-electron integrals
    eigvals (array[float]): eigenvalues of the matrices obtained from factorizing the
        two-electron integral tensor

Returns:
    array[float]: 1-norm of the Hamiltonian

**Example**

>>> symbols  = ['H', 'H', 'O']
>>> geometry = np.array([[0.00000000,  0.00000000,  0.28377432],
...                      [0.00000000,  1.45278171, -1.00662237],
...                      [0.00000000, -1.45278171, -1.00662237]])
>>> mol = qp.qchem.Molecule(symbols, geometry, basis_name='sto-3g')
>>> core, one, two = qp.qchem.electron_integrals(mol)()
>>> two = np.swapaxes(two, 1, 3) # convert to the chemists notation
>>> _, eigvals, _ = qp.qchem.factorize(two, 1e-5)
>>> print(qp.estimator.DoubleFactorization.norm(one, two, eigvals))
369.4...
