---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/fable.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/fable.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/fable.py`

This module contains the template for the Fast Approximate BLock Encoding (FABLE) technique.

## `FABLE`

```python
class FABLE(Operation)
```

Construct a unitary with the fast approximate block encoding method.

The FABLE method allows to simplify block encoding circuits without reducing accuracy,
for matrices of specific structure [`arXiv:2205.00081 <https://arxiv.org/abs/2205.00081>`_].


Args:
    input_matrix (tensor_like): a :math:`(2^n \times 2^n)` matrix to be encoded,
        where :math:`n` is an integer
    wires (Iterable[int, str], Wires): the wires the operation acts on. The number of wires can
        be computed as :math:`(2 \times n + 1)`.
    tol (float): rotation gates that have an angle value smaller than this tolerance are removed
    id (str or None): string representing the operation (optional)

Raises:
    ValueError: if the number of wires doesn't fit the dimensions of the matrix

**Example**

We can define a matrix and a block-encoding circuit as follows:

.. code-block:: python

    input_matrix = np.array([[0.1, 0.2],[0.3, -0.2]])
    dev = qp.device('default.qubit', wires=3)
    @qp.qnode(dev)
    def example_circuit():
        qp.FABLE(input_matrix, wires=range(3), tol=0)
        return qp.state()

We can see that the input matrix has been block encoded in the matrix of the circuit:

>>> s = qp.math.ceil_log2(max(len(input_matrix), len(input_matrix[0])))
>>> expected = 2**s * qp.matrix(example_circuit)().real[0 : 2**s, 0 : 2**s]
>>> print(f"Block-encoded matrix:\n{expected}")
Block-encoded matrix:
[[ 0.1  0.2]
 [ 0.3 -0.2]]

.. note::
    FABLE can be implemented for matrices of arbitrary shape and size.
    When given a :math:`(N \times M)` matrix, the matrix is padded with zeroes
    until it is of :math:`(N \times N)` dimension, where :math:`N` is equal to :math:`2^n`,
    and :math:`n` is an integer. It is also assumed that the values
    of the input matrix are within :math:`[-1, 1]`. Apply a subnormalization factor if needed.

### `compute_decomposition`

```python
def compute_decomposition(input_matrix, wires, tol=0)
```

Sequence of gates that represents the efficient circuit produced by the FABLE technique

Args:
    input_matrix (tensor_like): an :math:`(N \times N)` matrix to be encoded
    wires (Any or Iterable[Any]): wires that the operator acts on
    tol (float): rotation gates that have an angle value smaller than this tolerance are removed

Returns:
    list[.Operator]: list of gates for efficient circuit
