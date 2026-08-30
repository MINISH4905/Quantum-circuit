---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/trotter_error/realspace/realspace_operator.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/trotter_error/realspace/realspace_operator.py
license: Apache-2.0
---

## Module `pennylane/labs/trotter_error/realspace/realspace_operator.py`

The RealspaceOperator class

## `RealspaceOperator`

```python
class RealspaceOperator
```

Represents a linear combination of a product of position and momentum operators.
The ``RealspaceOperator`` class can be used to represent components of a vibrational
Hamiltonian, e.g., the following sum over a product of two position operators :math:`Q`:

.. math:: \sum_{i,j=1}^n \phi_{i,j}Q_i Q_j,

where :math:`\phi_{i, j}` represents the coefficient and is a constant.

Args:
    modes (int): the number of vibrational modes
    ops (Sequence[str]): a sequence representation of the position and momentum operators
    coeffs (``RealspaceCoeffs``): an expression tree which evaluates the entries of the coefficient tensor

**Example**

This example uses :class:`~.pennylane.labs.trotter_error.RealspaceOperator` to build the
operator :math:`\sum_{i,j=1}^2 \phi_{i,j}Q_i Q_j`. The operator represents a sum over 2 modes
for the position operators :math:`Q_iQ_j`.

>>> from pennylane.labs.trotter_error import RealspaceOperator, RealspaceCoeffs
>>> import numpy as np
>>> n_modes = 2
>>> ops = ("Q", "Q")
>>> coeffs = RealspaceCoeffs(np.array([[1, 0], [0, 1]]), label="phi")
>>> RealspaceOperator(n_modes, ops, coeffs)
RealspaceOperator(5, ('Q', 'Q'), phi[idx0,idx1])

### `matrix`

```python
def matrix(self, gridpoints: int, basis: str='realspace', sparse: bool=False) -> np.ndarray | sp.sparse.csr_array
```

Return a matrix representation of the operator.

Args:
    gridpoints (int): the number of gridpoints used to discretize the position or momentum operators
    basis (str): the basis of the matrix, available options are ``realspace`` and ``harmonic``
    sparse (bool): if ``True`` returns a sparse matrix, otherwise returns a dense matrix

Returns:
    Union[ndarray, scipy.sparse.csr_array]: the matrix representation of the :class:`~.pennylane.labs.trotter_error.RealspaceOperator`

**Example**

>>> from pennylane.labs.trotter_error import RealspaceOperator, RealspaceCoeffs
>>> import numpy as np
>>> n_modes = 2
>>> ops = ("Q", "Q")
>>> coeffs = RealspaceCoeffs(np.array([[1, 0], [0, 1]]), label="phi")
>>> RealspaceOperator(n_modes, ops, coeffs).matrix(2)
[[6.28318531 0.         0.         0.        ]
 [0.         3.14159265 0.         0.        ]
 [0.         0.         3.14159265 0.        ]
 [0.         0.         0.         0.        ]]

### `zero`

```python
def zero(cls, modes) -> RealspaceOperator
```

Returns a ``RealspaceOperator`` representing the zero operator.

Args:
    modes (int): the number of vibrational modes

Returns:
    RealspaceOperator: a representation of the zero operator

### `get_coefficients`

```python
def get_coefficients(self, threshold: float=0.0) -> dict[tuple[int], float]
```

Return the non-zero coefficients in a dictionary.

Args:
    threshold (float): tolerance to return coefficients whose magnitude is greater than ``threshold``

Returns:
    Dict[Tuple[int], float]: a dictionary whose keys are the nonzero indices, and values are the coefficients

**Example**

>>> from pennylane.labs.trotter_error import RealspaceOperator, RealspaceCoeffs
>>> import numpy as np
>>> n_modes = 2
>>> ops = ("Q", "Q")
>>> coeffs = RealspaceCoeffs(np.array([[1, 0], [0, 1]]), label="phi")
>>> RealspaceOperator(n_modes, ops, coeffs).get_coefficients()
{(0, 0): 1, (1, 1): 1}

## `RealspaceSum`

```python
class RealspaceSum(Fragment)
```

Represents a linear combination of :class:`~.pennylane.labs.trotter_error.RealspaceOperator` objects.

The :class:`~pennylane.labs.trotter_error.RealspaceSum` class can be used to represent a
Hamiltonian that is built from a sum of
:class:`~.pennylane.labs.trotter_error.RealspaceOperator` objects. For example, the vibrational
hamiltonian, adapted from Eq. 4 of `arXiv:1703.09313 <https://arxiv.org/abs/1703.09313>`_,

.. math:: \sum_i \frac{\omega_i}{2} P_i^2 + \sum_i \frac{\omega_i}{2} Q_i^2 + \sum_i \phi^{(1)}_i Q_i + \sum_{i,j} \phi^{(2)}_{ij} Q_i Q_j + \dots,

is a sum of terms where each term can be expressed by a :class:`~.pennylane.labs.trotter_error.RealspaceOperator`.

Args:
    modes (int): the number of vibrational modes
    ops (Sequence[RealspaceOperator]): a sequence containing :class:`~.pennylane.labs.trotter_error.RealspaceOperator` objects

**Example**

We can build the harmonic part of a vibrational Hamiltonian,
:math:`\sum_i \frac{\omega_i}{2} P_i^2 + \sum_i \frac{\omega_i}{2} Q_i^2`, with the following
code.

>>> from pennylane.labs.trotter_error import RealspaceOperator, RealspaceCoeffs, RealspaceSum
>>> import numpy as np
>>> n_modes = 2
>>> freqs = np.array([1.23, 3.45]) / 2
>>> coeffs = RealspaceCoeffs(freqs, label="omega")
>>> rs_op1 = RealspaceOperator(n_modes, ("PP",), coeffs)
>>> rs_op2 = RealspaceOperator(n_modes, ("QQ",), coeffs)
>>> RealspaceSum(n_modes, [rs_op1, rs_op2])
RealspaceSum((RealspaceOperator(2, ('PP',), omega[idx0]), RealspaceOperator(2, ('QQ',), omega[idx0])))

### `zero`

```python
def zero(cls, modes: int) -> RealspaceSum
```

Returns a :class:`~.pennylane.labs.trotter_error.RealspaceOperator` representing the zero operator

Args:
    modes (int): the number of vibrational modes (needed for consistency with arithmetic operations)

Returns:
    RealspaceOperator: a representation of the zero operator

### `matrix`

```python
def matrix(self, gridpoints: int, basis: str='realspace', sparse: bool=False) -> np.ndarray | sp.sparse.cs_array
```

Return a matrix representation of the :class:`~pennylane.labs.trotter_error.RealspaceSum`.

Args:
    gridpoints (int): the number of gridpoints used to discretize the position/momentum operators
    basis (str): the basis of the matrix, available options are ``realspace`` and ``harmonic``
    sparse (bool): if ``True`` returns a sparse matrix, otherwise a dense matrix

Returns:
    Union[ndarray, scipy.sparse.csr_array]: the matrix representation of the :class:`~.pennylane.labs.trotter_error.RealspaceOperator`

**Example**

>>> from pennylane.labs.trotter_error import RealspaceOperator, RealspaceCoeffs, RealspaceSum
>>> import numpy as np
>>> n_modes = 2
>>> freqs = np.array([1.23, 3.45])
>>> coeffs = RealspaceCoeffs(freqs, label="omega")
>>> rs_op1 = RealspaceOperator(n_modes, ("PP",), coeffs)
>>> rs_op2 = RealspaceOperator(n_modes, ("QQ",), coeffs)
>>> RealspaceSum(n_modes, [rs_op1, rs_op2]).matrix(2)
[[22.05398043+0.00000000e+00j -5.41924733+6.63666389e-16j
  -1.93207948+2.36611495e-16j  0.        +0.00000000e+00j]
 [-5.41924733-6.63666389e-16j 11.21548577+0.00000000e+00j
   0.        +0.00000000e+00j -1.93207948+2.36611495e-16j]
 [-1.93207948-2.36611495e-16j  0.        +0.00000000e+00j
  18.18982146+0.00000000e+00j -5.41924733+6.63666389e-16j]
 [ 0.        +0.00000000e+00j -1.93207948-2.36611495e-16j
  -5.41924733-6.63666389e-16j  7.35132681+0.00000000e+00j]]

### `norm`

```python
def norm(self, params: dict) -> float
```

Returns an upper bound on the spectral norm of the operator.

Args:
    params (Dict): The dictionary of parameters. The supported parameters are

        * ``gridpoints`` (int): the number of gridpoints used to discretize the operator
        * ``sparse`` (bool): If ``True``, use optimizations for sparse operators. Defaults to ``False``.

Returns:
    float: an upper bound on the spectral norm of the operator

**Example**

>>> from pennylane.labs.trotter_error import RealspaceOperator, RealspaceCoeffs, RealspaceSum
>>> import numpy as np
>>> n_modes = 2
>>> freqs = np.array([1.23, 3.45])
>>> coeffs = RealspaceCoeffs(freqs, label="omega")
>>> rs_op1 = RealspaceOperator(n_modes, ("PP",), coeffs)
>>> rs_op2 = RealspaceOperator(n_modes, ("QQ",), coeffs)
>>> params = {"gridpoints": 2, "sparse": True}
>>> RealspaceSum(n_modes, [rs_op1, rs_op2]).norm(params)
29.405307237600457

### `apply`

```python
def apply(self, state: HOState) -> HOState
```

Apply the :class:`~.pennylane.labs.trotter_error.RealspaceSum` to an input :class:`~.pennylane.labs.trotter_error.HOState` object.

### `get_coefficients`

```python
def get_coefficients(self, threshold: float=0.0) -> dict[tuple[str], dict]
```

Return a dictionary containing the non-zero coefficients of the :class:`~pennylane.labs.trotter_error.RealspaceSum`.

Args:
    threshold (float): tolerance to return coefficients whose magnitude is greater than ``threshold``

Returns:
    Dict: a dictionary whose keys correspond to the RealspaceOperators in the sum, and whose
        values are dictionaries obtained by :func:`~.pennylane.labs.trotter_error.RealspaceOperator.get_coefficients`

**Example**

>>> from pennylane.labs.trotter_error import RealspaceOperator, RealspaceCoeffs, RealspaceSum
>>> import numpy as np
>>> n_modes = 2
>>> freqs = np.array([1.23, 3.45])
>>> coeffs = RealspaceCoeffs(freqs, label="omega")
>>> rs_op1 = RealspaceOperator(n_modes, ("PP",), coeffs)
>>> rs_op2 = RealspaceOperator(n_modes, ("QQ",), coeffs)
>>> RealspaceSum(n_modes, [rs_op1, rs_op2]).get_coefficients()
{('PP',): {(0,): 1.23, (1,): 3.45}, ('QQ',): {(0,): 1.23, (1,): 3.45}}
