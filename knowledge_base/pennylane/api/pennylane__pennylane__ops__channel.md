---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/channel.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/channel.py
license: Apache-2.0
---

## Module `pennylane/ops/channel.py`

This module contains the available built-in noisy
quantum channels supported by PennyLane, as well as their conventions.

## `AmplitudeDamping`

```python
class AmplitudeDamping(Channel)
```

Single-qubit amplitude damping error channel.

Interaction with the environment can lead to changes in the state populations of a qubit.
This is the phenomenon behind scattering, dissipation, attenuation, and spontaneous emission.
It can be modelled by the amplitude damping channel, with the following Kraus matrices:

.. math::
    K_0 = \begin{bmatrix}
            1 & 0 \\
            0 & \sqrt{1-\gamma}
            \end{bmatrix}
.. math::
    K_1 = \begin{bmatrix}
            0 & \sqrt{\gamma}  \\
            0 & 0
            \end{bmatrix}

where :math:`\gamma \in [0, 1]` is the amplitude damping probability.

**Details:**

* Number of wires: 1
* Number of parameters: 1

Args:
    gamma (float): amplitude damping probability
    wires (Sequence[int] or int): the wire the channel acts on
    id (str or None): String representing the operation (optional)

### `compute_kraus_matrices`

```python
def compute_kraus_matrices(gamma)
```

Kraus matrices representing the AmplitudeDamping channel.

Args:
    gamma (float): amplitude damping probability

Returns:
    list(array): list of Kraus matrices

**Example**

>>> qp.AmplitudeDamping.compute_kraus_matrices(0.5)
[array([[1.        , 0.        ],
        [0.        , 0.70710678]]),
 array([[0.        , 0.70710678],
        [0.        , 0.        ]])]

## `GeneralizedAmplitudeDamping`

```python
class GeneralizedAmplitudeDamping(Channel)
```

Single-qubit generalized amplitude damping error channel.

This channel models the exchange of energy between a qubit and its environment
at finite temperatures, with the following Kraus matrices:

.. math::
    K_0 = \sqrt{1-p} \begin{bmatrix}
            1 & 0 \\
            0 & \sqrt{1-\gamma}
            \end{bmatrix}

.. math::
    K_1 = \sqrt{1-p}\begin{bmatrix}
            0 & \sqrt{\gamma}  \\
            0 & 0
            \end{bmatrix}

.. math::
    K_2 = \sqrt{p}\begin{bmatrix}
            \sqrt{1-\gamma} & 0 \\
            0 & 1
            \end{bmatrix}

.. math::
    K_3 = \sqrt{p}\begin{bmatrix}
            0 & 0 \\
            \sqrt{\gamma} & 0
            \end{bmatrix}

where :math:`\gamma \in [0, 1]` is the probability of damping and :math:`p \in [0, 1]`
is the probability of the system being excited by the environment (for more details see
`arXiv:1903.07747 <https://arxiv.org/abs/1903.07747>`_).

**Details:**

* Number of wires: 1
* Number of parameters: 2

Args:
    gamma (float): amplitude damping probability
    p (float): excitation probability
    wires (Sequence[int] or int): the wire the channel acts on
    id (str or None): String representing the operation (optional)

### `compute_kraus_matrices`

```python
def compute_kraus_matrices(gamma, p)
```

Kraus matrices representing the GeneralizedAmplitudeDamping channel.

Args:
    gamma (float): amplitude damping probability
    p (float): excitation probability

Returns:
    list (array): list of Kraus matrices

**Example**

>>> qp.GeneralizedAmplitudeDamping.compute_kraus_matrices(0.3, 0.6)
[array([[0.63245553, 0.        ], [0.        , 0.52915026]]),
 array([[0.        , 0.34641016], [0.        , 0.        ]]),
 array([[0.64807407, 0.        ], [0.        , 0.77459667]]),
 array([[0.        , 0.        ], [0.42426407, 0.        ]])]

## `PhaseDamping`

```python
class PhaseDamping(Channel)
```

Single-qubit phase damping error channel.

Interaction with the environment can lead to loss of quantum information changes without any
changes in qubit excitations. This can be modelled by the phase damping channel, with
the following Kraus matrices:

.. math::
    K_0 = \begin{bmatrix}
            1 & 0 \\
            0 & \sqrt{1-\gamma}
            \end{bmatrix}
.. math::

    K_1 = \begin{bmatrix}
            0 & 0  \\
            0 & \sqrt{\gamma}
            \end{bmatrix}

where :math:`\gamma \in [0, 1]` is the phase damping probability.

**Details:**

* Number of wires: 1
* Number of parameters: 1

Args:
    gamma (float): phase damping probability
    wires (Sequence[int] or int): the wire the channel acts on

### `compute_kraus_matrices`

```python
def compute_kraus_matrices(gamma)
```

Kraus matrices representing the PhaseDamping channel.

Args:
    gamma (float): phase damping probability

Returns:
    list (array): list of Kraus matrices

**Example**

>>> qp.PhaseDamping.compute_kraus_matrices(0.5)
[array([[1.        , 0.        ], [0.        , 0.70710678]]),
 array([[0.        , 0.        ], [0.        , 0.70710678]])]

## `DepolarizingChannel`

```python
class DepolarizingChannel(Channel)
```

Single-qubit symmetrically depolarizing error channel.

This channel is modelled by the following Kraus matrices:

.. math::
    K_0 = \sqrt{1-p} \begin{bmatrix}
            1 & 0 \\
            0 & 1
            \end{bmatrix}

.. math::
    K_1 = \sqrt{p/3}\begin{bmatrix}
            0 & 1  \\
            1 & 0
            \end{bmatrix}

.. math::
    K_2 = \sqrt{p/3}\begin{bmatrix}
            0 & -i \\
            i & 0
            \end{bmatrix}

.. math::
    K_3 = \sqrt{p/3}\begin{bmatrix}
            1 & 0 \\
            0 & -1
            \end{bmatrix}

where :math:`p \in [0, 1]` is the depolarization probability and is equally
divided in the application of all Pauli operations.

.. note::

    Multiple equivalent definitions of the Kraus operators :math:`\{K_0 \ldots K_3\}` exist in
    the literature [`1 <https://michaelnielsen.org/qcqi/>`_] (Eqs. 8.102-103). Here, we adopt the
    one from Eq. 8.103, which is also presented in [`2 <http://theory.caltech.edu/~preskill/ph219/chap3_15.pdf>`_] (Eq. 3.85).
    For this definition, please make a note of the following:

    * For :math:`p = 0`, the channel will be an Identity channel, i.e., a noise-free channel.
    * For :math:`p = \frac{3}{4}`, the channel will be a fully depolarizing channel.
    * For :math:`p = 1`, the channel will be a uniform Pauli error channel.

**Details:**

* Number of wires: 1
* Number of parameters: 1

Args:
    p (float): Each Pauli gate is applied with probability :math:`\frac{p}{3}`
    wires (Sequence[int] or int): the wire the channel acts on
    id (str or None): String representing the operation (optional)

### `compute_kraus_matrices`

```python
def compute_kraus_matrices(p)
```

Kraus matrices representing the depolarizing channel.

Args:
    p (float): each Pauli gate is applied with probability :math:`\frac{p}{3}`

Returns:
    list (array): list of Kraus matrices

**Example**

>>> qp.DepolarizingChannel.compute_kraus_matrices(0.5)
[array([[0.70710678+0.j, 0.        +0.j],
        [0.        +0.j, 0.70710678+0.j]]),
 array([[0.        +0.j, 0.40824829+0.j],
        [0.40824829+0.j, 0.        +0.j]]),
 array([[0.+0.j        , 0.-0.40824829j],
        [0.+0.40824829j, 0.+0.j        ]]),
 array([[ 0.40824829+0.j,  0.        +0.j],
        [ 0.        +0.j, -0.40824829+0.j]])]

## `BitFlip`

```python
class BitFlip(Channel)
```

Single-qubit bit flip (Pauli :math:`X`) error channel.

This channel is modelled by the following Kraus matrices:

.. math::
    K_0 = \sqrt{1-p} \begin{bmatrix}
            1 & 0 \\
            0 & 1
            \end{bmatrix}

.. math::
    K_1 = \sqrt{p}\begin{bmatrix}
            0 & 1  \\
            1 & 0
            \end{bmatrix}

where :math:`p \in [0, 1]` is the probability of a bit flip (Pauli :math:`X` error).

**Details:**

* Number of wires: 1
* Number of parameters: 1

Args:
    p (float): The probability that a bit flip error occurs.
    wires (Sequence[int] or int): the wire the channel acts on
    id (str or None): String representing the operation (optional)

### `compute_kraus_matrices`

```python
def compute_kraus_matrices(p)
```

Kraus matrices representing the BitFlip channel.

Args:
    p (float): probability that a bit flip error occurs

Returns:
    list (array): list of Kraus matrices

**Example**

>>> qp.BitFlip.compute_kraus_matrices(0.5)
[array([[0.70710678, 0.        ], [0.        , 0.70710678]]),
 array([[0.        , 0.70710678], [0.70710678, 0.        ]])]

## `ResetError`

```python
class ResetError(Channel)
```

Single-qubit Reset error channel.

This channel is modelled by the following Kraus matrices:

.. math::
    K_0 = \sqrt{1-p_0-p_1} \begin{bmatrix}
            1 & 0 \\
            0 & 1
            \end{bmatrix}

.. math::
    K_1 = \sqrt{p_0}\begin{bmatrix}
            1 & 0  \\
            0 & 0
            \end{bmatrix}

.. math::
    K_2 = \sqrt{p_0}\begin{bmatrix}
            0 & 1  \\
            0 & 0
            \end{bmatrix}

.. math::
    K_3 = \sqrt{p_1}\begin{bmatrix}
            0 & 0  \\
            1 & 0
            \end{bmatrix}

.. math::
    K_4 = \sqrt{p_1}\begin{bmatrix}
            0 & 0  \\
            0 & 1
            \end{bmatrix}

where :math:`p_0 \in [0, 1]` is the probability of a reset to 0,
and :math:`p_1 \in [0, 1]` is the probability of a reset to 1 error.

**Details:**

* Number of wires: 1
* Number of parameters: 2

Args:
    p_0 (float): The probability that a reset to 0 error occurs.
    p_1 (float): The probability that a reset to 1 error occurs.
    wires (Sequence[int] or int): the wire the channel acts on
    id (str or None): String representing the operation (optional)

### `compute_kraus_matrices`

```python
def compute_kraus_matrices(p_0, p_1)
```

Kraus matrices representing the ResetError channel.

Args:
    p_0 (float): probability that a reset to 0 error occurs
    p_1 (float): probability that a reset to 1 error occurs

Returns:
    list (array): list of Kraus matrices

**Example**

>>> qp.ResetError.compute_kraus_matrices(0.2, 0.3)
[array([[0.70710678, 0.        ], [0.        , 0.70710678]]),
 array([[0.4472136, 0.       ], [0.       , 0.       ]]),
 array([[0.       , 0.4472136], [0.       , 0.       ]]),
 array([[0.        , 0.        ], [0.54772256, 0.        ]]),
 array([[0.        , 0.        ], [0.        , 0.54772256]])]

## `PauliError`

```python
class PauliError(Channel)
```

Pauli operator error channel for an arbitrary number of qubits.

This channel is modelled by the following Kraus matrices:

.. math::
    K_0 = \sqrt{1-p} * I

.. math::
    K_1 = \sqrt{p} * (K_{w0} \otimes K_{w1} \otimes \dots K_{wn})

Where :math:`I` is the Identity,
and :math:`\otimes` denotes the Kronecker Product,
and :math:`K_{wi}` denotes the Kraus matrix corresponding to the operator acting on wire :math:`wi`,
and :math:`p` denotes the probability with which the channel is applied.

.. warning::

    The size of the Kraus matrices for PauliError scale exponentially
    with the number of wires, the channel acts on. Simulations with
    PauliError can result in a significant increase in memory and
    computational usage. Use with caution!

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 3

Args:
    operators (str): The Pauli operators (``'I'``, ``'X'``, ``'Y'``, or ``'Z'``) acting on the specified (groups of) wires
    p (float): The probability of the operator being applied
    wires (Sequence[int] or int): The wires the channel acts on
    id (str or None): String representing the operation (optional)

**Example:**

>>> pe = PauliError("X", 0.5, wires=0)
>>> km = pe.kraus_matrices()
>>> km[0]
array([[0.70710678, 0.        ],
       [0.        , 0.70710678]])
>>> km[1]
    array([[0.        , 0.70710678],
           [0.70710678, 0.        ]])

### `compute_kraus_matrices`

```python
def compute_kraus_matrices(p, operators)
```

Kraus matrices representing the PauliError channel.

Args:
    operators (str): the Pauli operators acting on the specified (groups of) wires
    p (float): probability of the operator being applied

Returns:
    list (array): list of Kraus matrices

**Example**

>>> qp.PauliError.compute_kraus_matrices(0.5, "X")
[array([[0.70710678, 0.        ], [0.        , 0.70710678]]),
 array([[0.        , 0.70710678], [0.70710678, 0.        ]])]

## `PhaseFlip`

```python
class PhaseFlip(Channel)
```

Single-qubit bit flip (Pauli :math:`Z`) error channel.

This channel is modelled by the following Kraus matrices:

.. math::
    K_0 = \sqrt{1-p} \begin{bmatrix}
            1 & 0 \\
            0 & 1
            \end{bmatrix}

.. math::
    K_1 = \sqrt{p}\begin{bmatrix}
            1 & 0  \\
            0 & -1
            \end{bmatrix}

where :math:`p \in [0, 1]` is the probability of a phase flip (Pauli :math:`Z`) error.

**Details:**

* Number of wires: 1
* Number of parameters: 1

Args:
    p (float): The probability that a phase flip error occurs.
    wires (Sequence[int] or int): the wire the channel acts on
    id (str or None): String representing the operation (optional)

### `compute_kraus_matrices`

```python
def compute_kraus_matrices(p)
```

Kraus matrices representing the PhaseFlip channel.

Args:
    p (float): the probability that a phase flip error occurs

Returns:
    list (array): list of Kraus matrices

**Example**

>>> qp.PhaseFlip.compute_kraus_matrices(0.5)
[array([[0.70710678, 0.        ], [0.        , 0.70710678]]),
 array([[ 0.70710678,  0.        ], [ 0.        , -0.70710678]])]

## `QubitChannel`

```python
class QubitChannel(Channel)
```

Apply an arbitrary fixed quantum channel.

Kraus matrices that represent the fixed channel are provided
as a list of NumPy arrays.

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 1
* Gradient recipe: None

Args:
    K_list (list[array[complex]]): list of Kraus matrices
    wires (Union[Wires, Sequence[int], or int]): the wire(s) the operation acts on
    id (str or None): String representing the operation (optional)

### `compute_kraus_matrices`

```python
def compute_kraus_matrices(*kraus_matrices)
```

Kraus matrices representing the QubitChannel channel.

Args:
    *K_list (list[array[complex]]): list of Kraus matrices

Returns:
    list (array): list of Kraus matrices

**Example**

>>> K_list = qp.PhaseFlip(0.5, wires=0).kraus_matrices()
>>> res = qp.QubitChannel.compute_kraus_matrices(K_list)[0]
>>> all(np.allclose(r, k) for r, k  in zip(res, K_list))
True

## `ThermalRelaxationError`

```python
class ThermalRelaxationError(Channel)
```

Thermal relaxation error channel.

This channel is modelled by the following Kraus matrices:

Case :math:`T_2 \leq T_1`:

.. math::
    K_0 = \sqrt{1 - p_z - p_{r0} - p_{r1}} \begin{bmatrix}
            1 & 0 \\
            0 & 1
            \end{bmatrix}

.. math::
    K_1 = \sqrt{p_z}\begin{bmatrix}
            1 & 0  \\
            0 & -1
            \end{bmatrix}

.. math::
    K_2 = \sqrt{p_{r0}}\begin{bmatrix}
            1 & 0  \\
            0 & 0
            \end{bmatrix}

.. math::
    K_3 = \sqrt{p_{r0}}\begin{bmatrix}
            0 & 1  \\
            0 & 0
            \end{bmatrix}

.. math::
    K_4 = \sqrt{p_{r1}}\begin{bmatrix}
            0 & 0  \\
            1 & 0
            \end{bmatrix}

.. math::
    K_5 = \sqrt{p_{r1}}\begin{bmatrix}
            0 & 0  \\
            0 & 1
            \end{bmatrix}

where :math:`p_{r0} \in [0, 1]` is the probability of a reset to 0, :math:`p_{r1} \in [0, 1]` is the probability of
a reset to 1 error, :math:`p_z \in [0, 1]` is the probability of a phase flip (Pauli :math:`Z`) error.

Case :math:`T_2 > T_1`:
The Choi matrix is given by

.. math::
    \Lambda = \begin{bmatrix}
                    1 - p_e * p_{reset} & 0 & 0 & eT_2 \\
                    0 & p_e * p_{reset} & 0 & 0 \\
                    0 & 0 & (1 - p_e) * p_{reset} & 0 \\
                    eT_2 & 0 & 0 & 1 - (1 - p_e) * p_{reset}
                    \end{bmatrix}

.. math::
    K_N = \sqrt{\lambda} \Phi(\nu_{\lambda})

where :math:`\lambda` are the eigenvalues of the Choi matrix, :math:`\nu_{\lambda}` are the eigenvectors of
the choi_matrix, and :math:`\Phi(x)` is a isomorphism from :math:`\mathbb{C}^{n^2}`
to :math:`\mathbb{C}^{n \times n}` with column-major order mapping.

**Details:**

* Number of wires: 1
* Number of parameters: 4

Args:
    pe (float): exited state population. Must be between ``0`` and ``1``
    t1 (float): the :math:`T_1` relaxation constant
    t2 (float): the :math:`T_2` dephasing constant. Must be less than :math:`2 T_1`
    tg (float): the gate time for relaxation error
    wires (Sequence[int] or int): the wire the channel acts on
    id (str or None): String representing the operation (optional)

### `compute_kraus_matrices`

```python
def compute_kraus_matrices(pe, t1, t2, tg)
```

Kraus matrices representing the ThermalRelaxationError channel.

Args:
    pe (float): exited state population. Must be between ``0`` and ``1``
    t1 (float): the :math:`T_1` relaxation constant
    t2 (float): The :math:`T_2` dephasing constant. Must be less than :math:`2 T_1`
    tg (float): the gate time for relaxation error

Returns:
    list (array): list of Kraus matrices

**Example**

>>> qp.ThermalRelaxationError.compute_kraus_matrices(0.1, 1.2, 1.3, 0.1)
[array([[0.        , 0.        ],
        [0.08941789, 0.        ]]),
 array([[0.        , 0.26825366],
        [0.        , 0.        ]]),
 array([[-0.12718544,  0.        ],
        [ 0.        ,  0.13165421]]),
 array([[0.98784022, 0.        ],
        [0.        , 0.95430977]]),
 array([[0., 0.],
        [0., 0.]]),
 array([[0., 0.],
        [0., 0.]])]
