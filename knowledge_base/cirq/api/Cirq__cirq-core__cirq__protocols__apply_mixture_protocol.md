---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/apply_mixture_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/apply_mixture_protocol.py
license: Apache-2.0
---

## Module `cirq-core/cirq/protocols/apply_mixture_protocol.py`

A protocol for implementing high performance mixture evolutions.

## `ApplyMixtureArgs`

```python
class ApplyMixtureArgs
```

Arguments for performing a mixture of unitaries.

The receiving object is expected to mutate `target_tensor` so that it
contains the state (state vector or density matrix) after applying the
mixture then return `target_tensor`. Alternatively, if workspace is
required, the receiving object can overwrite `out_buffer` with the results
and return `out_buffer`. Or, if the receiving object is attempting to
be simple instead of fast, it can create an entirely new array and
return that.

Attributes:
    target_tensor: The input tensor that needs to be left (and potentially
        right) multiplied and summed, representing the effect of the
        mixture. The tensor will have the shape (2, 2, 2, ..., 2). It can
        correspond to a state vector or a density matrix.
    out_buffer: Pre-allocated workspace with the same shape and
        dtype as the target tensor. If buffers are used, the result should
        end up in this buffer. It is the responsibility of calling code
        to notice if the result is this buffer.
    auxiliary_buffer0: Pre-allocated workspace with the same shape and dtype
        as the target tensor.
    auxiliary_buffer1: Pre-allocated workspace with the same shape
        and dtype as the target tensor.
    left_axes: Which axes to multiply the left action of the mixture upon.
    right_axes: Which axes to multiply the right action of the mixture upon.
        If provided we will assume `target_tensor` is a density matrix,
        otherwise it will be assumed `target_tensor` is a state vector.

### `__init__`

```python
def __init__(self, target_tensor: np.ndarray, out_buffer: np.ndarray, auxiliary_buffer0: np.ndarray, auxiliary_buffer1: np.ndarray, left_axes: Iterable[int], right_axes: Iterable[int] | None=None)
```

Args for apply mixture.

Args:
    target_tensor: The input tensor that needs to be left (and
        potentially right) multiplied and summed, representing the
        effect of the mixture. The tensor will have the shape
        (2, 2, 2, ..., 2). It can  correspond to a state vector or a
        density matrix.
    out_buffer: Pre-allocated workspace with the same shape and
        dtype as the target tensor. If buffers are used, the result
        should end up in this buffer. It is the responsibility of
        calling code to notice if the result is this buffer.
    auxiliary_buffer0: Pre-allocated workspace with the same shape and
        dtype as the target tensor.
    auxiliary_buffer1: Pre-allocated workspace with the same shape
        and dtype as the target tensor.
    left_axes: Which axes to multiply the left action of the mixture
        upon.
    right_axes: Which axes to multiply the right action of the mixture
        upon. If provided we will assume `target_tensor` is a density
        matrix, otherwise it will be assumed `target_tensor` is a
        state vector.

## `SupportsApplyMixture`

```python
class SupportsApplyMixture(Protocol)
```

An object that can efficiently implement a mixture.

## `apply_mixture`

```python
def apply_mixture(val: Any, args: ApplyMixtureArgs, *, default: np.ndarray | TDefault=RaiseTypeErrorIfNotProvided) -> np.ndarray | TDefault
```

High performance evolution under a mixture of unitaries evolution.

Follows the steps below to attempt to apply a mixture:

A. Try to use `val._apply_mixture_(args)`.
    1. If `_apply_mixture_` is not present or returns NotImplemented
        go to step B.
    2. If '_apply_mixture_' is present and returns None conclude that
        `val` has no effect and return.
    3. If '_apply_mixture_' is present and returns a numpy array conclude
        that the mixture was applied successfully and forward result to
        caller.

B. Construct an ApplyUnitaryArgs object `uargs` from `args` and then
    try to use `cirq.apply_unitary(val, uargs, None)`.
    1. If `None` is returned then go to step C.
    2. If a numpy array is returned forward this result back to the caller
        and return.

C. Try to use `val._mixture_()`.
    1. If '_mixture_' is not present or returns NotImplemented
        go to step D.
    2. If '_mixture_' is present and returns None conclude that `val` has
        no effect and return.
    3. If '_mixture_' returns a list of tuples, loop over the list and
        examine each tuple. If the tuple is of the form
        `(probability, np.ndarray)` use matrix multiplication to apply it.
        If the tuple is of the form `(probability, op)` where op is any op,
        attempt to use `cirq.apply_unitary(op, uargs, None)`. If this
        operation returns None go to step D. Otherwise return the resulting
        state after all of the tuples have been applied.

D. Raise TypeError or return `default`.


Args:
    val: The value with a mixture to apply to the target.
    args: A mutable `cirq.ApplyMixtureArgs` object describing the target
        tensor, available workspace, and left and right axes to operate on.
        The attributes of this object will be mutated as part of computing
        the result.
    default: What should be returned if `val` doesn't have a mixture. If
        not specified, a TypeError is raised instead of returning a default
        value.

Returns:
    If the receiving object is not able to apply a mixture,
    the specified default value is returned (or a TypeError is raised). If
    this occurs, then `target_tensor` should not have been mutated.

    If the receiving object was able to work inline, directly
    mutating `target_tensor` it will return `target_tensor`. The caller is
    responsible for checking if the result is `target_tensor`.

    If the receiving object wrote its output over `out_buffer`, the
    result will be `out_buffer`. The caller is responsible for
    checking if the result is `out_buffer` (and e.g. swapping
    the buffer for the target tensor before the next call).

    Note that it is an error for the return object to be either of the
    auxiliary buffers, and the method will raise an AssertionError if
    this contract is violated.

    The receiving object may also write its output over a new buffer
    that it created, in which case that new array is returned.

Raises:
    TypeError: `val` doesn't have a mixture and `default` wasn't specified.
    ValueError: Different left and right shapes of `args.target_tensor`
        selected by `left_axes` and `right_axes` or `qid_shape(val)` doesn't
        equal the left and right shapes.
    AssertionError: `_apply_mixture_` returned an auxiliary buffer.
