---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/symbolicop.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/symbolicop.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/symbolicop.py`

This submodule defines a base class for symbolic operations representing operator math.

## `SymbolicOp`

```python
class SymbolicOp(Operator)
```

Developer-facing base class for single-operator symbolic operators.

Args:
    base (~.operation.Operator): the base operation that is modified symbolically
    id (str): custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified

This *developer-facing* class can serve as a parent to single base symbolic operators, such as
:class:`~.ops.op_math.Adjoint`.

New symbolic operators can inherit from this class to receive some common default behaviour, such
as deferring properties to the base class, copying the base class during a shallow copy, and
updating the metadata of the base operator during queueing.

The child symbolic operator should define the `_name` property during initialization and define
any relevant representations, such as :meth:`~.operation.Operator.matrix`,
:meth:`~.operation.Operator.diagonalizing_gates`, :meth:`~.operation.Operator.eigvals`, and
:meth:`~.operation.Operator.decomposition`.

### `base`

```python
def base(self) -> Operator
```

The base operator.

### `data`

```python
def data(self)
```

The trainable parameters

### `num_wires`

```python
def num_wires(self)
```

Number of wires the operator acts on.

## `ScalarSymbolicOp`

```python
class ScalarSymbolicOp(SymbolicOp)
```

Developer-facing base class for single-operator symbolic operators that contain a
scalar coefficient.

Args:
    base (~.operation.Operator): the base operation that is modified symbolically
    scalar (float): the scalar coefficient
    id (str): custom label given to an operator instance, can be useful for some applications
        where the instance has to be identified

This *developer-facing* class can serve as a parent to single base symbolic operators, such as
:class:`~.ops.op_math.SProd` and :class:`~.ops.op_math.Pow`.

### `matrix`

```python
def matrix(self, wire_order=None)
```

Representation of the operator as a matrix in the computational basis.

If ``wire_order`` is provided, the numerical representation considers the position of the
operator's wires in the global wire order. Otherwise, the wire order defaults to the
operator's wires.

If the matrix depends on trainable parameters, the result
will be cast in the same autodifferentiation framework as the parameters.

A ``MatrixUndefinedError`` is raised if the base matrix representation has not been defined.

.. seealso:: :meth:`~.Operator.compute_matrix`

Args:
    wire_order (Iterable): global wire order, must contain all wire labels from the
    operator's wires

Returns:
    tensor_like: matrix representation
