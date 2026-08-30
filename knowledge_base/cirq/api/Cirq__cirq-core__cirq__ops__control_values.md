---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/control_values.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/control_values.py
license: Apache-2.0
---

## `AbstractControlValues`

```python
class AbstractControlValues(abc.ABC)
```

Abstract base class defining the API for control values.

Control values define predicates on the state of one or more qubits. Predicates can be composed
with logical OR to form a "sum", or with logical AND to form a "product". We provide two
implementations: `SumOfProducts` which consists of one or more AND (product) clauses each of
which applies to all N qubits, and `ProductOfSums` which consists of N OR (sum) clauses,
each of which applies to one qubit.

`cirq.ControlledGate` and `cirq.ControlledOperation` are useful to augment
existing gates and operations to have one or more control qubits. For every
control qubit, the set of integer values for which the control should be enabled
is represented by one of the implementations of `cirq.AbstractControlValues`.

Implementations of `cirq.AbstractControlValues` can use different internal
representations to store control values, but they must satisfy the public API
defined here and be immutable.

### `validate`

```python
def validate(self, qid_shapes: Sequence[int]) -> None
```

Validates that all control values for ith qubit are in range [0, qid_shaped[i])

### `expand`

```python
def expand(self) -> SumOfProducts
```

Returns an expanded `cirq.SumOfProduct` representation of this control values.

### `is_trivial`

```python
def is_trivial(self) -> bool
```

Returns True iff each controlled variable is activated only for value 1.

This configuration is equivalent to `cirq.SumOfProducts(((1,) * num_controls))`
and `cirq.ProductOfSums(((1,),) * num_controls)`

### `__iter__`

```python
def __iter__(self) -> Iterator[tuple[int, ...]]
```

Iterator on internal representation of control values used by the derived classes.

Note: Be careful that the terms iterated upon by this iterator will have different
meaning based on the implementation. For example:
>>> print(*cirq.ProductOfSums([(0, 1), (0,)]))
(0, 1) (0,)
>>> print(*cirq.SumOfProducts([(0, 0), (1, 0)]))
(0, 0) (1, 0)

### `__and__`

```python
def __and__(self, other: AbstractControlValues) -> AbstractControlValues
```

Returns a cartesian product of all control values predicates in `self` x `other`.

The `and` of two control values `cv1` and `cv2` represents a control value object
acting on the union of qubits represented by `cv1` and `cv2`. For example:

>>> cv1 = cirq.ProductOfSums([(0, 1), 2])
>>> cv2 = cirq.SumOfProducts([[0, 0], [1, 1]])
>>> assert cirq.num_qubits(cv1 & cv2) == cirq.num_qubits(cv1) + cirq.num_qubits(cv2)

Args:
  other: An instance of `AbstractControlValues`.

Returns:
  An instance of `AbstractControlValues` that represents the cartesian product of
  control values represented by `self` and `other`.

### `__or__`

```python
def __or__(self, other: AbstractControlValues) -> AbstractControlValues
```

Returns a union of all control values predicates in `self` + `other`.

Both `self` and `other` must represent control values for the same set of qubits and
hence their `or` would also be a control value object acting on the same set of qubits.
For example:

>>> cv1 = cirq.ProductOfSums([(0, 1), 2])
>>> cv2 = cirq.SumOfProducts([[0, 0], [1, 1]])
>>> assert cirq.num_qubits(cv1 | cv2) == cirq.num_qubits(cv1) == cirq.num_qubits(cv2)

Args:
  other: An instance of `AbstractControlValues`.

Returns:
  An instance of `AbstractControlValues` that represents the union of control values
  represented by `self` and `other`.

Raises:
    ValueError: If `cirq.num_qubits(self) != cirq.num_qubits(other)`.

## `ProductOfSums`

```python
class ProductOfSums(AbstractControlValues)
```

Represents control values as N OR (sum) clauses, each of which applies to one qubit.

## `SumOfProducts`

```python
class SumOfProducts(AbstractControlValues)
```

Represents control values as AND (product) clauses, each of which applies to all N qubits.

`SumOfProducts` representation describes the control values as a union
of n-bit tuples, where each n-bit tuple represents an allowed assignment
of bits for which the control should be activated. This expanded
representation allows us to create control values combinations which
cannot be factored as a `ProductOfSums` representation.

For example:

1) `(|00><00| + |11><11|) X + (|01><01| + |10><10|) I` represents an
    operator which flips the third qubit if the first two qubits
    are `00` or `11`, and does nothing otherwise.
    This can be constructed as
    >>> xor_control_values = cirq.SumOfProducts(((0, 0), (1, 1)))
    >>> q0, q1, q2 = cirq.LineQubit.range(3)
    >>> xor_cop = cirq.X(q2).controlled_by(q0, q1, control_values=xor_control_values)

2) `(|00><00| + |01><01| + |10><10|) X + (|11><11|) I` represents an
    operators which flips the third qubit if the `nand` of first two
    qubits is `1` (i.e. first two qubits are either `00`, `01` or `10`),
    and does nothing otherwise. This can be constructed as:

    >>> nand_control_values = cirq.SumOfProducts(((0, 0), (0, 1), (1, 0)))
    >>> q0, q1, q2 = cirq.LineQubit.range(3)
    >>> nand_cop = cirq.X(q2).controlled_by(q0, q1, control_values=nand_control_values)

### `__iter__`

```python
def __iter__(self) -> Iterator[tuple[int, ...]]
```

Returns the combinations tracked by the object.
