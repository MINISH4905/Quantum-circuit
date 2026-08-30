---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/composite.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/composite.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/composite.py`

This submodule defines a base class for composite operations.

## `handle_recursion_error`

```python
def handle_recursion_error(func)
```

Handles any recursion errors raised from too many levels of nesting.

## `CompositeOp`

```python
class CompositeOp(Operator)
```

A base class for operators that are composed of other operators.

Args:
    operands: (tuple[~.operation.Operator]): a tuple of operators which will be combined.

Keyword Args:
    id (str or None): id for the operator. Default is None.

The child composite operator should define the `_op_symbol` property
during initialization and define any relevant representations, such as
:meth:`~.operation.Operator.matrix` and :meth:`~.operation.Operator.decomposition`.

### `__iter__`

```python
def __iter__(self)
```

Return the iterator over the underlying operands.

### `__getitem__`

```python
def __getitem__(self, idx)
```

Return the operand at position ``idx`` of the composition.

### `__len__`

```python
def __len__(self)
```

Return the number of operators in this composite operator

### `data`

```python
def data(self)
```

Create data property

### `data`

```python
def data(self, new_data)
```

Set the data property

### `num_wires`

```python
def num_wires(self)
```

Number of wires the operator acts on.

### `has_overlapping_wires`

```python
def has_overlapping_wires(self) -> bool
```

Boolean expression that indicates if the factors have overlapping wires.

### `is_verified_hermitian`

```python
def is_verified_hermitian(self)
```

This property determines if the composite operator is hermitian.

### `eigvals`

```python
def eigvals(self)
```

Return the eigenvalues of the specified operator.

This method uses pre-stored eigenvalues for standard observables where
possible and stores the corresponding eigenvectors from the eigendecomposition.

Returns:
    array: array containing the eigenvalues of the operator

### `matrix`

```python
def matrix(self, wire_order=None)
```

Representation of the operator as a matrix in the computational basis.

### `overlapping_ops`

```python
def overlapping_ops(self) -> list[list[Operator]]
```

Groups all operands of the composite operator that act on overlapping wires.

Returns:
    List[List[Operator]]: List of lists of operators that act on overlapping wires. All the
    inner lists commute with each other.

### `eigendecomposition`

```python
def eigendecomposition(self)
```

Return the eigendecomposition of the matrix specified by the operator.

This method uses pre-stored eigenvalues for standard observables where
possible and stores the corresponding eigenvectors from the eigendecomposition.

It transforms the input operator according to the wires specified.

Returns:
    dict[str, array]: dictionary containing the eigenvalues and the
        eigenvectors of the operator.

### `diagonalizing_gates`

```python
def diagonalizing_gates(self)
```

Sequence of gates that diagonalize the operator in the computational basis.

Given the eigendecomposition :math:`O = U \Sigma U^{\dagger}` where
:math:`\Sigma` is a diagonal matrix containing the eigenvalues,
the sequence of diagonalizing gates implements the unitary :math:`U^{\dagger}`.

The diagonalizing gates rotate the state into the eigenbasis
of the operator.

A ``DiagGatesUndefinedError`` is raised if no representation by decomposition is defined.

.. seealso:: :meth:`~.Operator.compute_diagonalizing_gates`.

Returns:
    list[.Operator] or None: a list of operators

### `label`

```python
def label(self, decimals=None, base_label=None, cache=None)
```

How the composite operator is represented in diagrams and drawings.

Args:
    decimals (int): If ``None``, no parameters are included. Else,
        how to round the parameters. Defaults to ``None``.
    base_label (Iterable[str]): Overwrite the non-parameter component of the label.
        Must be same length as ``operands`` attribute. Defaults to ``None``.
    cache (dict): Dictionary that carries information between label calls
        in the same drawing. Defaults to ``None``.

Returns:
    str: label to use in drawings

**Example (using the Sum composite operator)**

>>> op = qp.S(0) + qp.X(0) + qp.Rot(1,2,3, wires=[1])
>>> op.label()
'𝓗'

### `queue`

```python
def queue(self, context=qp.QueuingManager)
```

Updates each operator's owner to self, this ensures
that the operators are not applied to the circuit repeatedly.
