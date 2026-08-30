---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/trotter_error/realspace/realspace_coefficients.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/trotter_error/realspace/realspace_coefficients.py
license: Apache-2.0
---

## Module `pennylane/labs/trotter_error/realspace/realspace_coefficients.py`

Tree representation of coefficients of a realspace operator

## `RealspaceCoeffs`

```python
class RealspaceCoeffs
```

Lightweight representation of a tensor of coefficients.

The :class:`~.pennylane.labs.trotter_error.RealspaceCoeffs` object is initialized with an array
and can be used to represent coefficients of a real space operator. A real space operator
is constrcuted from position and momentum operators, e.g., Eq. 4
of `arXiv:1703.09313 <https://arxiv.org/abs/1703.09313>`_ which represents a vibrational
Hamiltonian.

Args:
    tensor (ndarray): a numpy tensor
    label (string): name of the tensor

**Examples**

>>> import numpy as np
>>> from pennylane.labs.trotter_error import RealspaceCoeffs
>>> coeffs = np.array([[1, 0], [0, 1]])
>>> rs_coeffs = RealspaceCoeffs(coeffs, label="alpha")
>>> rs_coeffs.shape
(2, 2)

.. details::
     :title: Usage Details

     The :class:`~.pennylane.labs.trotter_error.RealspaceCoeffs` object allows arithmetic
     operations such as addition, subtraction, multiplication and matrix multiplication.
     Printing the resulting objects displays the expression that is used to compute each entry
     of the tensor.

     >>> coeffs1 = RealspaceCoeffs(np.array([[1, 0], [0, 1]]), label="alpha")
     >>> coeffs2 = RealspaceCoeffs(np.array([[2, 1], [1, 3]]), label="beta")
     >>> expr1 = coeffs1 + 2 * coeffs2
     >>> coeffs3 = RealspaceCoeffs(np.array([3, 2]), label="omega")
     >>> expr2 = expr1 @ coeffs3
     >>> expr2
     ((alpha[idx0,idx1]) + (2 * (beta[idx0,idx1]))) * (omega[idx2])

### `is_zero`

```python
def is_zero(self) -> bool
```

Determine if the :class:`~.pennylane.labs.trotter_error.RealspaceCoeffs` objects
represents the zero tensor.

Returns:
    bool: returns ``True`` when the tensor is zero, otherwise returns ``False``

### `shape`

```python
def shape(self) -> tuple[int]
```

Return the shape of the tensor.

### `nonzero`

```python
def nonzero(self, threshold: float=0.0)
```

Return the nonzero coefficients in a dictionary.

Args:
    threshold (float): tolerance to return coefficients with magnitude greater than ``threshold``

Returns:
    dict: a dictionary representation of the coefficient tensor

**Example**

>>> from pennylane.labs.trotter_error import RealspaceCoeffs
>>> import numpy as np
>>> node = RealspaceCoeffs(np.array([[1, 0, 0, 1], [0, 0, 1, 1]]), label="alpha")
>>> node.nonzero()
{(0, 0): 1, (0, 3): 1, (1, 2): 1, (1, 3): 1}
