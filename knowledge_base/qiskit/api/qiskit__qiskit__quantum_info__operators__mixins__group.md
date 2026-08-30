---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/mixins/group.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/mixins/group.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/mixins/group.py`

Mixin for gate operator interface.

## `GroupMixin`

```python
class GroupMixin(ABC)
```

Abstract Mixin for operator group operations.

This class defines the following methods

    - :meth:`compose`
    - :meth:`dot`
    - :meth:`tensor`
    - :meth:`expand`
    - :meth:`power`

And the following operator overloads:

    - ``&``, ``__and__`` -> :meth:`compose`
    - ``@``, ``__matmul__`` -> :meth:`dot`
    - ``^``, ``__xor__`` -> :meth:`tensor`
    - ``**``, ``__pow__`` -> :meth:`power`

The following abstract methods must be implemented by subclasses
using this mixin

    - ``compose(self, other, qargs=None, inplace=False)``
    - ``tensor(self, other)``
    - ``expand(self, other)``

### `tensor`

```python
def tensor(self, other) -> Self
```

Return the tensor product with another CLASS.

Args:
    other (CLASS): a CLASS object.

Returns:
    CLASS: the tensor product :math:`a \otimes b`, where :math:`a`
        is the current CLASS, and :math:`b` is the other CLASS.

.. note::
    The tensor product can be obtained using the ``^`` binary operator.
    Hence ``a.tensor(b)`` is equivalent to ``a ^ b``.

.. note:
    Tensor uses reversed operator ordering to :meth:`expand`.
    For two operators of the same type ``a.tensor(b) = b.expand(a)``.

### `expand`

```python
def expand(self, other) -> Self
```

Return the reverse-order tensor product with another CLASS.

Args:
    other (CLASS): a CLASS object.

Returns:
    CLASS: the tensor product :math:`b \otimes a`, where :math:`a`
        is the current CLASS, and :math:`b` is the other CLASS.

.. note:
    Expand is the opposite operator ordering to :meth:`tensor`.
    For two operators of the same type ``a.expand(b) = b.tensor(a)``.

### `compose`

```python
def compose(self, other, qargs=None, front=False) -> Self
```

Return the operator composition with another CLASS.

Args:
    other (CLASS): a CLASS object.
    qargs (list or None):  a list of subsystem positions to
                          apply other on. If None apply on all
                          subsystems (default: None).
    front (bool): If True compose using right operator multiplication,
                  instead of left multiplication [default: False].

Returns:
    CLASS: The composed CLASS.

Raises:
    QiskitError: if other cannot be converted to an operator, or has
                 incompatible dimensions for specified subsystems.

.. note::
    Composition (``&``) by default is defined as `left` matrix multiplication for
    matrix operators, while ``@`` (equivalent to :meth:`dot`) is defined as `right` matrix
    multiplication. That is that ``A & B == A.compose(B)`` is equivalent to
    ``B @ A == B.dot(A)`` when ``A`` and ``B`` are of the same type.

    Setting the ``front=True`` kwarg changes this to `right` matrix
    multiplication and is equivalent to the :meth:`dot` method
    ``A.dot(B) == A.compose(B, front=True)``.

### `dot`

```python
def dot(self, other, qargs=None) -> Self
```

Return the right multiplied operator self * other.

Args:
    other (CLASS): an operator object.
    qargs (list or None):  a list of subsystem positions to
                          apply other on. If None apply on all
                          subsystems (default: None).

Returns:
    CLASS: The right matrix multiplied CLASS.

.. note::
    The dot product can be obtained using the ``@`` binary operator.
    Hence ``a.dot(b)`` is equivalent to ``a @ b``.

### `power`

```python
def power(self, n) -> Self
```

Return the composition of an operator with itself n times.

Args:
    n (int): the number of times to compose with self (n>0).

Returns:
    CLASS: the n-times composed operator.

Raises:
    QiskitError: if the input and output dimensions of the operator
                 are not equal, or the power is not a positive integer.
