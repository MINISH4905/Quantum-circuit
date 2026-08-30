---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/apply_unitary_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/apply_unitary_protocol.py
license: Apache-2.0
---

## Module `cirq-core/cirq/protocols/apply_unitary_protocol.py`

A protocol for implementing high performance unitary left-multiplies.

## `ApplyUnitaryArgs`

```python
class ApplyUnitaryArgs
```

Arguments for performing an efficient left-multiplication by a unitary.

The receiving object is expected to mutate `target_tensor` so that it
contains the state after multiplication, and then return `target_tensor`.
Alternatively, if workspace is required, the receiving object can overwrite
`available_buffer` with the results and return `available_buffer`. Or, if
the receiving object is attempting to be simple instead of fast, it can
create an entirely new array and return that.

Attributes:
    target_tensor: The input tensor that needs to be left-multiplied by
        the unitary effect of the receiving object. The tensor will
        have the shape (2, 2, 2, ..., 2). It usually corresponds to
        a multi-qubit superposition, but it could also be a multi-qubit
        unitary transformation or some other concept.
    available_buffer: Pre-allocated workspace with the same shape and
        dtype as the target tensor.
    axes: Which axes the unitary effect is being applied to (e.g. the
        qubits that the gate is operating on).
    subspaces: Which subspace (in the computational basis) the unitary
        effect is being applied to, on each axis. By default it applies
        to subspace 0..d-1 on each axis, where d is the dimension of the
        unitary effect on that axis. Subspaces on each axis must be
        representable as a slice, so the dimensions specified here need to
        have a consistent step size.

### `__init__`

```python
def __init__(self, target_tensor: np.ndarray, available_buffer: np.ndarray, axes: Iterable[int], subspaces: Sequence[tuple[int, ...]] | None=None)
```

Inits ApplyUnitaryArgs.

Args:
    target_tensor: The input tensor that needs to be left-multiplied by
        the unitary effect of the receiving object. The tensor will
        have the shape (2, 2, 2, ..., 2). It usually corresponds to
        a multi-qubit superposition, but it could also be a multi-qubit
        unitary transformation or some other concept.
    available_buffer: Pre-allocated workspace with the same shape and
        dtype as the target tensor.
    axes: Which axes the unitary effect is being applied to (e.g. the
        qubits that the gate is operating on).
    subspaces: Which subspace (in the computational basis) the unitary
        effect is being applied to, on each axis. By default it applies
        to subspace 0..d-1 on each axis, where d is the dimension of
        the unitary effect on that axis. Subspaces on each axis must be
        representable as a slice, so the dimensions specified here need
        to have a consistent step size.
Raises:
    ValueError: If the subspace count does not equal the axis count, if
        any subspace has zero dimensions, or if any subspace has
        dimensions specified without a consistent step size.

### `default`

```python
def default(num_qubits: int | None=None, *, qid_shape: tuple[int, ...] | None=None) -> ApplyUnitaryArgs
```

A default instance starting in state |0⟩.

Specify exactly one argument.

Args:
    num_qubits: The number of qubits to make space for in the state.
    qid_shape: The shape of the state, specifying the dimension of each
        qid.

Raises:
    TypeError: If exactly neither `num_qubits` or `qid_shape` is provided or
        both are provided.

### `for_unitary`

```python
def for_unitary(cls, num_qubits: int | None=None, *, qid_shape: tuple[int, ...] | None=None) -> ApplyUnitaryArgs
```

A default instance corresponding to an identity matrix.

Specify exactly one argument.

Args:
    num_qubits: The number of qubits to make space for in the state.
    qid_shape: A tuple representing the number of quantum levels of each
        qubit the identity matrix applies to. `qid_shape` is (2, 2, 2) for
        a three-qubit identity operation tensor.

Raises:
    TypeError: If exactly neither `num_qubits` or `qid_shape` is provided or
        both are provided.

### `with_axes_transposed_to_start`

```python
def with_axes_transposed_to_start(self) -> ApplyUnitaryArgs
```

Returns a transposed view of the same arguments.

Returns:
    A view over the same target tensor and available workspace, but
    with the numpy arrays transposed such that the axes field is
    guaranteed to equal `range(len(result.axes))`. This allows one to
    say e.g. `result.target_tensor[0, 1, 0, ...]` instead of
    `result.target_tensor[result.subspace_index(0b010)]`.

### `subspace_index`

```python
def subspace_index(self, little_endian_bits_int: int=0, *, big_endian_bits_int: int=0) -> tuple[slice | int | EllipsisType, ...]
```

An index for the subspace where the target axes equal a value.

Args:
    little_endian_bits_int: The desired value of the qubits at the
        targeted `axes`, packed into an integer. The least significant
        bit of the integer is the desired bit for the first axis, and
        so forth in increasing order. Can't be specified at the same
        time as `big_endian_bits_int`.
    big_endian_bits_int: The desired value of the qubits at the
        targeted `axes`, packed into an integer. The most significant
        bit of the integer is the desired bit for the first axis, and
        so forth in decreasing order. Can't be specified at the same
        time as `little_endian_bits_int`.

Returns:
    A value that can be used to index into `target_tensor` and
    `available_buffer`, and manipulate only the part of Hilbert space
    corresponding to a given bit assignment.

Example:
    If `target_tensor` is a 4 qubit tensor and `axes` is `[1, 3]` and
    then this method will return the following when given
    `little_endian_bits=0b01`:

        `(slice(None), 0, slice(None), 1, Ellipsis)`

    Therefore the following two lines would be equivalent:

        args.target_tensor[args.subspace_index(0b01)] += 1

        args.target_tensor[:, 0, :, 1] += 1

## `SupportsConsistentApplyUnitary`

```python
class SupportsConsistentApplyUnitary(Protocol)
```

An object that can be efficiently left-multiplied into tensors.

## `apply_unitary`

```python
def apply_unitary(unitary_value: Any, args: ApplyUnitaryArgs, default: np.ndarray | TDefault=RaiseTypeErrorIfNotProvided, *, allow_decompose: bool=True) -> np.ndarray | TDefault
```

High performance left-multiplication of a unitary effect onto a tensor.

Applies the unitary effect of `unitary_value` to the tensor specified in
`args` by using the following strategies:

A. Try to use `unitary_value._apply_unitary_(args)`.
    Case a) Method not present or returns `NotImplemented`.
        Continue to next strategy.
    Case b) Method returns `None`.
        Conclude `unitary_value` has no unitary effect.
    Case c) Method returns a numpy array.
        Forward the successful result to the caller.

B. Try to use `unitary_value._unitary_()`.
    Case a) Method not present or returns `NotImplemented`.
        Continue to next strategy.
    Case b) Method returns `None`.
        Conclude `unitary_value` has no unitary effect.
    Case c) Method returns a numpy array.
        Multiply the matrix onto the target tensor and return to the caller.

C. Try to use `unitary_value._decompose_()` (if `allow_decompose`).
    Case a) Method not present or returns `NotImplemented` or `None`.
        Continue to next strategy.
    Case b) Method returns an OP_TREE.
        Delegate to `cirq.apply_unitaries`.

D. Conclude that `unitary_value` has no unitary effect.

The order that the strategies are tried depends on the number of qubits
being operated on. For small numbers of qubits (4 or less) the order is
ABCD. For larger numbers of qubits the order is ACBD (because it is expected
that decomposing will outperform generating the raw matrix).

Args:
    unitary_value: The value with a unitary effect to apply to the target.
    args: A mutable `cirq.ApplyUnitaryArgs` object describing the target
        tensor, available workspace, and axes to operate on. The attributes
        of this object will be mutated as part of computing the result.
    default: What should be returned if `unitary_value` doesn't have a
        unitary effect. If not specified, a TypeError is raised instead of
        returning a default value.
    allow_decompose: Defaults to True. If set to False, and applying the
        unitary effect requires decomposing the object, the method will
        pretend the object has no unitary effect.

Returns:
    If the receiving object does not have a unitary effect, then the
    specified default value is returned (or a TypeError is raised). If
    this occurs, then `target_tensor` should not have been mutated.

    Otherwise the result is the `np.ndarray` instance storing the result.
    This may be `args.target_tensor`, `args.available_workspace`, or some
    other numpy array. It is the caller's responsibility to correctly handle
    all three of these cases. In all cases `args.target_tensor` and
    `args.available_buffer` may have been mutated.

Raises:
    TypeError: `unitary_value` doesn't have a unitary effect and `default`
        wasn't specified.

## `apply_unitaries`

```python
def apply_unitaries(unitary_values: Iterable[Any], qubits: Sequence[cirq.Qid], args: ApplyUnitaryArgs | None=None, default: Any=RaiseTypeErrorIfNotProvided) -> np.ndarray | None
```

Apply a series of unitaries onto a state tensor.

Uses `cirq.apply_unitary` on each of the unitary values, to apply them to
the state tensor from the `args` argument.

CAUTION: if one of the given unitary values does not have a unitary effect,
forcing the method to terminate, the method will not rollback changes
from previous unitary values.

Args:
    unitary_values: The values with unitary effects to apply to the target.
    qubits: The qubits that will be targeted by the unitary values. These
        qubits match up, index by index, with the `indices` property of the
        `args` argument.
    args: A mutable `cirq.ApplyUnitaryArgs` object describing the target
        tensor, available workspace, and axes to operate on. The attributes
        of this object will be mutated as part of computing the result. If
        not specified, this defaults to the zero state of the given qubits
        with an axis ordering matching the given qubit ordering.
    default: What should be returned if any of the unitary values actually
        don't have a unitary effect. If not specified, a TypeError is
        raised instead of returning a default value.

Returns:
    If any of the unitary values do not have a unitary effect, the
    specified default value is returned (or a TypeError is raised).
    CAUTION: If this occurs, the contents of `args.target_tensor`
    and `args.available_buffer` may have been mutated.

    If all of the unitary values had a unitary effect that was
    successfully applied, this method returns the `np.ndarray`
    storing the final result. This `np.ndarray` may be
    `args.target_tensor`, `args.available_buffer`, or some
    other instance. The caller is responsible for dealing with
    this potential aliasing of the inputs and the result.

Raises:
    TypeError: An item from `unitary_values` doesn't have a unitary effect
        and `default` wasn't specified.
    ValueError: If the number of qubits does not match the number of
        axes provided in the `args`.
