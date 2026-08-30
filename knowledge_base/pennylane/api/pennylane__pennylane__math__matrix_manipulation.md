---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/math/matrix_manipulation.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/math/matrix_manipulation.py
license: Apache-2.0
---

## Module `pennylane/math/matrix_manipulation.py`

This module contains methods that manipulates matrices.

## `expand_matrix`

```python
def expand_matrix(mat, wires: Sequence | int, wire_order=None, sparse_format='csr')
```

Re-express a matrix acting on a subspace defined by a set of wire labels
according to a global wire order.

Args:
    mat (tensor_like): matrix to expand
    wires (Sequence): wires determining the subspace that ``mat`` acts on; a matrix of
        dimension :math:`D^n` acts on a subspace of :math:`n` wires, where :math:`D` is the qudit dimension (2).
    wire_order (Iterable): global wire order, which has to contain all wire labels in ``wires``, but can also
        contain additional labels
    sparse_format (str): if ``mat`` is a SciPy sparse matrix then this is the string representing the
        preferred scipy sparse matrix format to cast the expanded matrix too

Returns:
    tensor_like: expanded matrix

**Example**

If the wire order is ``None`` or identical to ``wires``, the original matrix gets returned:

>>> matrix = np.array([[1, 2, 3, 4],
...                    [5, 6, 7, 8],
...                    [9, 10, 11, 12],
...                    [13, 14, 15, 16]])
>>> print(expand_matrix(matrix, wires=[0, 2], wire_order=[0, 2]))
[[ 1  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]
 [13 14 15 16]]
>>> print(expand_matrix(matrix, wires=[0, 2]))
[[ 1  2  3  4]
 [ 5  6  7  8]
 [ 9 10 11 12]
 [13 14 15 16]]

If the wire order is a permutation of ``wires``, the entries of the matrix get permuted:

>>> print(expand_matrix(matrix, wires=[0, 2], wire_order=[2, 0]))
[[ 1  3  2  4]
 [ 9 11 10 12]
 [ 5  7  6  8]
 [13 15 14 16]]

If the wire order contains wire labels not found in ``wires``, the matrix gets expanded:

>>> print(expand_matrix(matrix, wires=[0, 2], wire_order=[0, 1, 2]))
[[ 1  2  0  0  3  4  0  0]
 [ 5  6  0  0  7  8  0  0]
 [ 0  0  1  2  0  0  3  4]
 [ 0  0  5  6  0  0  7  8]
 [ 9 10  0  0 11 12  0  0]
 [13 14  0  0 15 16  0  0]
 [ 0  0  9 10  0  0 11 12]
 [ 0  0 13 14  0  0 15 16]]

The method works with tensors from all autodifferentiation frameworks, for example:

>>> matrix_torch = torch.tensor([[1., 2.],
...                              [3., 4.]], requires_grad=True)
>>> res = expand_matrix(matrix_torch, wires=["b"], wire_order=["a", "b"])
>>> type(res)
torch.Tensor
>>> res.requires_grad
True

The method works with scipy sparse matrices, for example:

>>> from scipy import sparse
>>> mat = sparse.csr_matrix([[0, 1], [1, 0]])
>>> qp.math.expand_matrix(mat, wires=[1], wire_order=[0,1]).toarray()
array([[0., 1., 0., 0.],
       [1., 0., 0., 0.],
       [0., 0., 0., 1.],
       [0., 0., 1., 0.]])

## `reduce_matrices`

```python
def reduce_matrices(mats_and_wires_gen: Iterable[tuple[np.ndarray, Sequence]], reduce_func: Callable) -> tuple[np.ndarray, Sequence]
```

Apply the given ``reduce_func`` cumulatively to the items of the ``mats_and_wires_gen``
generator, from left to right, reducing the sequence to a tuple containing a single
matrix and the wires it acts on.

Args:
    mats_and_wires_gen (Iterable): tuples containing the matrix and the wires of each operator
    reduce_func (callable): function used to reduce the sequence of operators

Returns:
    Tuple[tensor, Sequence]: a tuple containing the reduced matrix and the wires it acts on

## `get_batch_size`

```python
def get_batch_size(tensor, expected_shape, expected_size)
```

Determine whether a tensor has an additional batch dimension for broadcasting,
compared to an expected_shape. Has support for abstract TF tensors.

Args:
    tensor (TensorLike): A tensor to inspect for batching
    expected_shape (Tuple[int]): The expected shape of the tensor if not batched
    expected_size (int): The expected size of the tensor if not batched

Returns:
    Optional[int]: The batch size of the tensor if there is one, otherwise None

## `expand_vector`

```python
def expand_vector(vector, original_wires, expanded_wires)
```

Expand a vector to more wires.

Args:
    vector (array): :math:`2^n` vector where n = len(original_wires).
    original_wires (Sequence[int]): original wires of vector
    expanded_wires (Union[Sequence[int], int]): expanded wires of vector, can be shuffled
        If a single int m is given, corresponds to list(range(m))

Returns:
    array: :math:`2^m` vector where m = len(expanded_wires).

## `convert_to_su2`

```python
def convert_to_su2(U, return_global_phase=False)
```

Convert a 2x2 unitary matrix to :math:`SU(2)`. (batched operation)

Args:
    U (array[complex]): A matrix with a batch dimension, presumed to be
        of shape :math:`n \times 2 \times 2` and unitary for any positive integer n.
    return_global_phase (bool): If `True`, the return will include the global phase.
        If `False`, only the :math:`SU(2)` representation is returned.

Returns:
    array[complex]:
        A :math:`n \times 2 \times 2` matrix in :math:`SU(2)` that is equivalent to U up to a
        global phase. If ``return_global_phase=True``, a 2-element tuple is returned, with
        the first element being the :math:`SU(2)` equivalent and the second, the global phase.

## `convert_to_su4`

```python
def convert_to_su4(U, return_global_phase=False)
```

Convert a 4x4 matrix to :math:`SU(4)`.

Args:
    U (array[complex]): A matrix, presumed to be :math:`4 \times 4` and unitary.
    return_global_phase (bool): If `True`, the return will include the global phase.
        If `False`, only the :math:`SU(4)` representation is returned.

Returns:
    array[complex]:
        A :math:`4 \times 4` matrix in :math:`SU(4)` that is equivalent to U up to a global
        phase. If ``return_global_phase=True``, a 2-element tuple is returned, with the first
        element being the :math:`SU(4)` equivalent and the second, the global phase.
