---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/qpe_resources/first_quantization.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/qpe_resources/first_quantization.py
license: Apache-2.0
---

## Module `pennylane/estimator/qpe_resources/first_quantization.py`

This module contains the functions needed for estimating the number of logical qubits and
non-Clifford gates for quantum algorithms in first quantization using a plane-wave basis.

## `FirstQuantization`

```python
class FirstQuantization(Operation)
```

Estimate the number of non-Clifford gates and logical qubits for a quantum phase estimation
algorithm in first quantization using a plane-wave basis.

To estimate the gate and qubit costs for implementing this method, the number of plane waves,
the number of electrons and the lattice vectors need to be defined. The costs can then be
computed using the functions :func:`~.pennylane.estimator.FirstQuantization.gate_cost` and
:func:`~.pennylane.estimator.FirstQuantization.qubit_cost` with a target error that has the default
value of 0.0016 Ha (chemical accuracy).

Atomic units are used throughout the class.

Args:
    n (int): number of plane waves
    eta (int): number of electrons
    omega (float): unit cell volume
    error (float): target error in the algorithm
    charge (int): total electric charge of the system
    br (int): number of bits for auxiliary qubit rotation
    vectors (array[float]): lattice vectors

**Example**

>>> n = 100000
>>> eta = 156
>>> vectors = np.array([[10.46219511,  0.00000000,  0.00000000],
...                     [ 0.00000000, 10.46219511,  0.00000000],
...                     [ 0.00000000,  0.00000000, 10.46219511]])
>>> algo = qp.estimator.FirstQuantization(n, eta, vectors=vectors)
>>> algo.lamb # the 1-Norm of the Hamiltonian
np.float64(649912.4804278888)
>>> f"{algo.gates:.1e}" # estimated number of non-Clifford gates
'1.1e+13'
>>> algo.qubits # estimated number of logical qubits
4416

.. details::
    :title: Theory

    Following `PRX Quantum 2, 040332 (2021) <https://link.aps.org/doi/10.1103/PRXQuantum.2.040332>`_
    , the target algorithm error, :math:`\epsilon`, is distributed among four different sources
    of error using Eq. (131)

    .. math::
        \epsilon^2 \geq \epsilon_{qpe}^2 + (\epsilon_{\mathcal{M}} + \epsilon_R + \epsilon_T)^2,

    where :math:`\epsilon_{qpe}` is the quantum phase estimation error and
    :math:`\epsilon_{\mathcal{M}}`, :math:`\epsilon_R`, and :math:`\epsilon_T` are defined in
    Eqs. (132-134).

    Here, we fix :math:`\epsilon_{\mathcal{M}} = \epsilon_R = \epsilon_T = \alpha \epsilon` with
    a default value of :math:`\alpha = 0.01` and obtain

    .. math::
        \epsilon_{qpe} = \sqrt{\epsilon^2 [1 - (3 \alpha)^2]}.

    Note that the user only needs to define the target algorithm error :math:`\epsilon`. The
    error distribution takes place inside the functions.

### `lamb`

```python
def lamb(self)
```

Return the 1-norm of a first-quantized Hamiltonian in the plane-wave basis.

The expressions needed for computing the norm are taken from
[`PRX Quantum 2, 040332 (2021) <https://link.aps.org/doi/10.1103/PRXQuantum.2.040332>`_].
The norm is computed assuming that amplitude ampliﬁcation is performed.

### `gates`

```python
def gates(self)
```

Return the total number of Toffoli gates needed to implement the first quantization
algorithm.

The expression for computing the cost is taken from Eq. (125) of
[`PRX Quantum 2, 040332 (2021) <https://link.aps.org/doi/10.1103/PRXQuantum.2.040332>`_].

### `qubits`

```python
def qubits(self)
```

Return the number of logical qubits needed to implement the first quantization
algorithm.

The expression for computing the cost is taken from Eq. (101) of
[`arXiv:2204.11890v1 <https://arxiv.org/abs/2204.11890v1>`_].

### `success_prob`

```python
def success_prob(n, br)
```

Return the probability of success for state preparation.

The expression for computing the probability of success is taken from Eqs. (59, 60) of
[`PRX Quantum 2, 040332 (2021) <https://link.aps.org/doi/10.1103/PRXQuantum.2.040332>`_].

Args:
    n (int): number of basis states to create an equal superposition for state preparation
    br (int): number of bits for auxiliary qubit rotation

Returns:
    float: probability of success for state preparation

**Example**

>>> n = 3
>>> br = 8
>>> qp.estimator.FirstQuantization.success_prob(n, br)
np.float64(0.9999928850303523)

### `norm`

```python
def norm(n, eta, omega, error, br=7, charge=0, cubic=True, vectors=None)
```

Return the 1-norm of a first-quantized Hamiltonian in the plane-wave basis.

The expressions needed for computing the norm are taken from
[`PRX Quantum 2, 040332 (2021) <https://link.aps.org/doi/10.1103/PRXQuantum.2.040332>`_].
The norm is computed assuming that amplitude ampliﬁcation is performed.

Args:
    n (int): number of plane waves
    eta (int): number of electrons
    omega (float): unit cell volume
    error (float): target error in the algorithm
    br (int): number of bits for auxiliary qubit rotation
    charge (int): total electric charge of the system
    cubic (bool): True if the unit cell is cubic
    vectors (array[float]): lattice vectors

Returns:
    float: 1-norm of a first-quantized Hamiltonian in the plane-wave basis

**Example**

>>> n = 10000
>>> eta = 156
>>> omega = 1145.166
>>> error = 0.001
>>> qp.estimator.FirstQuantization.norm(n, eta, omega, error)
np.float64(281053.7561251118)

.. details::
    :title: Theory

    To compute the norm, for numerical convenience, we use the following modified
    expressions to obtain parameters that contain a sum over
    :math:`\frac{1}{\left \| \nu \right \|^k}` where :math:`\nu` denotes an element of the
    set of reciprocal lattice vectors, :math:`G_0`, and
    :math:`k \in \left \{ 1, 2 \right \}`.

    For :math:`\lambda_{\nu}` defined in Eq. (25) of
    `PRX Quantum 2, 040332 (2021) <https://link.aps.org/doi/10.1103/PRXQuantum.2.040332>`_
    as

    .. math::

        \lambda_{\nu} = \sum_{\nu \in G_0} \frac{1}{\left \| \nu \right \|^2},

    we follow Eq. (F6) of
    `PRX 8, 011044 (2018) <https://journals.aps.org/prx/abstract/10.1103/PhysRevX.8.011044>`_
    and use

    .. math::

        \lambda_{\nu} = 4\pi \left ( \frac{\sqrt{3}}{2} N^{1/3} - 1 \right) + 3 - \frac{3}{N^{1/3}}
        + 3 \int_{x=1}^{N^{1/3}} \int_{y=1}^{N^{1/3}} \frac{1}{x^2 + y^2} dydx.

    We also need to compute :math:`\lambda^{\alpha}_{\nu}` defined in Eq. (123) of
    `PRX Quantum 2, 040332 (2021) <https://link.aps.org/doi/10.1103/PRXQuantum.2.040332>`_

    .. math::

        \lambda^{\alpha}_{\nu} = \alpha \sum_{\nu \in G_0} \frac{\left \lceil
        \mathcal{M}(2^{\mu - 2}) / \left \| \nu \right \|^2 \right \rceil}{\mathcal{M}
        2^{2\mu - 4}},

    which we compute here, for :math:`\alpha = 1`, as

    .. math::

        \lambda^{1}_{\nu} = \lambda_{\nu} + \epsilon_l,

    where :math:`\epsilon_l` is simply defined as the difference of
    :math:`\lambda^{1}_{\nu}` and :math:`\lambda_{\nu}`. We follow Eq. (113) of
    `PRX Quantum 2, 040332 (2021) <https://link.aps.org/doi/10.1103/PRXQuantum.2.040332>`_
    to derive an upper bound for its absolute value:

    .. math::

        |\epsilon_l| \le \frac{4}{2^{n_m}} (7 \times 2^{n_p + 1} + 9 n_p - 11 - 3 \times 2^{-n_p}),

    where :math:`\mathcal{M} = 2^{n_m}` and :math:`n_m` is defined in Eq. (132) of
    `PRX Quantum 2, 040332 (2021) <https://link.aps.org/doi/10.1103/PRXQuantum.2.040332>`_.
    Finally, for :math:`p_{\nu}` defined in Eq. (128) of
    `PRX Quantum 2, 040332 (2021) <https://link.aps.org/doi/10.1103/PRXQuantum.2.040332>`_

    .. math::

        p_{\nu} = \sum_{\mu = 2}^{n_p + 1} \sum_{\nu \in B_{\mu}} \frac{\left \lceil M(2^{\mu-2}
        / \left \| \nu \right \|)^2 \right \rceil}{M 2^{2\mu} 2^{n_{\mu} + 1}},

    we use the upper bound from Eq. (29) in
    `arXiv:1807.09802v2 <https://arxiv.org/abs/1807.09802v2>`_ which gives
    :math:`p_{\nu} = 0.2398`.

### `unitary_cost`

```python
def unitary_cost(n, eta, omega, error, br=7, charge=0)
```

Return the number of Toffoli gates needed to implement the qubitization unitary
operator.

The expression for computing the cost is taken from Eq. (125) of
[`PRX Quantum 2, 040332 (2021) <https://link.aps.org/doi/10.1103/PRXQuantum.2.040332>`_].

Args:
    n (int): number of plane waves
    eta (int): number of electrons
    omega (float): unit cell volume
    error (float): target error in the algorithm
    br (int): number of bits for auxiliary qubit rotation
    charge (int): total electric charge of the system

Returns:
    int: the number of Toffoli gates needed to implement the qubitization unitary operator

**Example**

>>> n = 100000
>>> eta = 156
>>> omega = 169.69608
>>> error = 0.01
>>> qp.estimator.FirstQuantization.unitary_cost(n, eta, omega, error)
17033

### `estimation_cost`

```python
def estimation_cost(n, eta, omega, error, br=7, charge=0, cubic=True, vectors=None)
```

Return the number of calls to the unitary needed to achieve the desired error in quantum
phase estimation.

The expression for computing the cost is taken from Eq. (125) of
[`PRX Quantum 2, 040332 (2021) <https://link.aps.org/doi/10.1103/PRXQuantum.2.040332>`_].

Args:
    n (int): number of plane waves
    eta (int): number of electrons
    omega (float): unit cell volume
    error (float): target error in the algorithm
    br (int): number of bits for auxiliary qubit rotation
    charge (int): total electric charge of the system
    cubic (bool): True if the unit cell is cubic
    vectors (array[float]): lattice vectors

Returns:
    int: number of calls to unitary

**Example**

>>> n = 100000
>>> eta = 156
>>> omega = 1145.166
>>> error = 0.01
>>> qp.estimator.FirstQuantization.estimation_cost(n, eta, omega, error)
102133985

### `gate_cost`

```python
def gate_cost(n, eta, omega, error, br=7, charge=0, cubic=True, vectors=None)
```

Return the total number of Toffoli gates needed to implement the first quantization
algorithm.

The expression for computing the cost is taken from Eq. (125) of
[`PRX Quantum 2, 040332 (2021) <https://link.aps.org/doi/10.1103/PRXQuantum.2.040332>`_].

Args:
    n (int): number of plane waves
    eta (int): number of electrons
    omega (float): unit cell volume
    error (float): target error in the algorithm
    br (int): number of bits for auxiliary qubit rotation
    charge (int): total electric charge of the system
    cubic (bool): True if the unit cell is cubic
    vectors (array[float]): lattice vectors

Returns:
    int: the number of Toffoli gates needed to implement the first quantization algorithm

**Example**

>>> n = 100000
>>> eta = 156
>>> omega = 169.69608
>>> error = 0.01
>>> qp.estimator.FirstQuantization.gate_cost(n, eta, omega, error)
3676557345574

### `qubit_cost`

```python
def qubit_cost(n, eta, omega, error, br=7, charge=0, cubic=True, vectors=None)
```

Return the number of logical qubits needed to implement the first quantization
algorithm.

The expression for computing the cost is taken from Eq. (101) of
[`arXiv:2204.11890v1 <https://arxiv.org/abs/2204.11890v1>`_].

Args:
    n (int): number of plane waves
    eta (int): number of electrons
    omega (float): unit cell volume
    error (float): target error in the algorithm
    br (int): number of bits for auxiliary qubit rotation
    charge (int): total electric charge of the system
    cubic (bool): True if the unit cell is cubic
    vectors (array[float]): lattice vectors

Returns:
    int: number of logical qubits needed to implement the first quantization algorithm

**Example**

>>> n = 100000
>>> eta = 156
>>> omega = 169.69608
>>> error = 0.01
>>> qp.estimator.FirstQuantization.qubit_cost(n, eta, omega, error)
4377
