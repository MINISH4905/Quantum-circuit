---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/dla/dense_util.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/dla/dense_util.py
license: Apache-2.0
---

## Module `pennylane/labs/dla/dense_util.py`

Utility tools for dense Lie algebra representations

## `pauli_coefficients`

```python
def pauli_coefficients(H: TensorLike) -> np.ndarray
```

Computes the coefficients of one or multiple Hermitian matrices in the Pauli basis.

The coefficients are ordered lexicographically in the Pauli group, ``["III", "IIX", "IIY", "IIZ", "IXI", ...]``.

Args:
    H (tensor_like[complex]): a Hermitian matrix of dimension ``(2**n, 2**n)`` or a collection
        of Hermitian matrices of dimension ``(batch, 2**n, 2**n)``.

Returns:
    np.ndarray: The coefficients of ``H`` in the Pauli basis with shape ``(4**n,)`` for a single
    matrix input and ``(batch, 4**n)`` for a collection of matrices. The output is real-valued.

See :func:`~.pennylane.pauli.pauli_decompose` for theoretical background information.

**Examples**

Consider the Hamiltonian :math:`H=\frac{1}{4} X_0 + \frac{2}{5} Z_0 X_1` with matrix

>>> H = 1 / 4 * qp.X(0) + 2 / 5 * qp.Z(0) @ qp.X(1)
>>> mat = H.matrix()
>>> mat
array([[ 0.  +0.j,  0.4 +0.j,  0.25+0.j,  0.  +0.j],
       [ 0.4 +0.j,  0.  +0.j,  0.  +0.j,  0.25+0.j],
       [ 0.25+0.j,  0.  +0.j,  0.  +0.j, -0.4 +0.j],
       [ 0.  +0.j,  0.25+0.j, -0.4 +0.j,  0.  +0.j]])

Then we can obtain the coefficients of :math:`H` in the Pauli basis via

>>> from pennylane.labs.dla import pauli_coefficients
>>> pauli_coefficients(mat)
array([ 0.  ,  0.  ,  0.  ,  0.  ,  0.25,  0.  ,  0.  ,  0.  ,  0.  ,
        0.  , -0.  ,  0.  ,  0.  ,  0.4 ,  0.  ,  0.  ])

The function can be used on a batch of matrices:

>>> ops = [1 / 4 * qp.X(0), 1 / 2 * qp.Z(0), 3 / 5 * qp.Y(0)]
>>> batch = np.stack([op.matrix() for op in ops])
>>> pauli_coefficients(batch)
array([[0.  , 0.25, 0.  , 0.  ],
       [0.  , 0.  , 0.  , 0.5 ],
       [0.  , 0.  , 0.6 , 0.  ]])

## `batched_pauli_decompose`

```python
def batched_pauli_decompose(H: TensorLike, tol: float | None=None, pauli: bool=False)
```

Decomposes a Hermitian matrix or a batch of matrices into a linear combination
of Pauli operators.

Args:
    H (tensor_like[complex]): a Hermitian matrix of dimension ``(2**n, 2**n)`` or a collection
        of Hermitian matrices of dimension ``(batch, 2**n, 2**n)``.
    tol (float): Tolerance below which Pauli coefficients are discarded.
    pauli (bool): Whether to format the output as :class:`~.PauliSentence`.

Returns:
    Union[~.Hamiltonian, ~.PauliSentence]: the matrix (matrices) decomposed as a
    linear combination of Pauli operators, returned either as a :class:`~.Hamiltonian`
    or :class:`~.PauliSentence` instance.

.. seealso:: :func:`~.pauli_coefficients`

**Examples**

Consider the Hamiltonian :math:`H=\frac{1}{4} X_0 + \frac{2}{5} Z_0 X_1`. We can compute its
matrix and get back the Pauli representation via ``batched_pauli_decompose``.

>>> from pennylane.labs.dla import batched_pauli_decompose
>>> H = 1 / 4 * qp.X(0) + 2 / 5 * qp.Z(0) @ qp.X(1)
>>> mat = H.matrix()
>>> op = batched_pauli_decompose(mat)
>>> op
0.25 * X(1) + 0.4 * Z(1)
>>> type(op)
pennylane.ops.op_math.sum.Sum

We can choose to receive a :class:`~.PauliSentence` instead as output instead, by setting
``pauli=True``:

>>> op = batched_pauli_decompose(mat, pauli=True)
>>> type(op)
pennylane.pauli.pauli_arithmetic.PauliSentence

This function supports batching and will return a list of operations for a batched input:

>>> ops = [1 / 4 * qp.X(0), 1 / 2 * qp.Z(0) + 1e-7 * qp.Y(0)]
>>> batch = np.stack([op.matrix() for op in ops])
>>> batched_pauli_decompose(batch)
[0.25 * X(0), 1e-07 * Y(0) + 0.5 * Z(0)]

Small contributions can be removed by specifying the ``tol`` parameter, which defaults
to ``1e-10``, accordingly:

>>> batched_pauli_decompose(batch, tol=1e-6)
[0.25 * X(0), 0.5 * Z(0)]

## `orthonormalize`

```python
def orthonormalize(basis: Iterable[PauliSentence | Operator | np.ndarray]) -> np.ndarray
```

Orthonormalize a list of basis vectors.

Args:
    basis (Iterable[Union[PauliSentence, Operator, np.ndarray]]): List of basis vectors.

Returns:
    np.ndarray: Orthonormalized basis vectors.

.. seealso:: :func:`~trace_inner_product`, :func:`~orthonormalize`

**Example**

>>> from pennylane.labs.dla import orthonormalize, check_orthonormal
>>> from pennylane.pauli import trace_inner_product
>>> ops = [qp.X(0), qp.X(0) + qp.Y(0), qp.Y(0) + qp.Z(0)]
>>> check_orthonormal(ops, trace_inner_product)
False
>>> ops_orth = orthonormalize(ops)
>>> check_orthonormal(ops_orth, trace_inner_product)
True

This works also for lists of dense matrices as inputs
>>> ops_m = [qp.matrix(op) for op in ops]
>>> ops_m_orth = orthonormalize(ops_m)
>>> ops_m_orth.shape
(3, 2, 2)

## `check_orthonormal`

```python
def check_orthonormal(g: Iterable[PauliSentence | Operator], inner_product: callable) -> bool
```

Utility function to check if operators in ``g`` are orthonormal with respect to the provided ``inner_product``.

Args:
    g (Iterable[Union[PauliSentence, Operator]]): List of operators
    inner_product (callable): Inner product function to check orthonormality

Returns:
    bool: ``True`` if the operators are orthonormal, ``False`` otherwise.

.. seealso:: :func:`~trace_inner_product`, :func:`~orthonormalize`

**Example**

>>> from pennylane.labs.dla import orthonormalize, check_orthonormal
>>> ops = [qp.X(0), qp.X(0) + qp.Y(0), qp.Y(0) + qp.Z(0)]
>>> check_orthonormal(ops, qp.pauli.trace_inner_product)
False
>>> ops_orth = orthonormalize(ops)
>>> check_orthonormal(ops_orth, trace_inner_product)
True
