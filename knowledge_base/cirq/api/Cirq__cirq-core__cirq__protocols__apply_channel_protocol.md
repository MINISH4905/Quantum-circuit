---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/apply_channel_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/apply_channel_protocol.py
license: Apache-2.0
---

## Module `cirq-core/cirq/protocols/apply_channel_protocol.py`

A protocol for implementing high performance channel evolutions.

## `ApplyChannelArgs`

```python
class ApplyChannelArgs
```

Arguments for efficiently performing a channel.

A channel performs the mapping

$$
X \rightarrow \sum_i A_i X A_i^\dagger
$$

for operators $A_i$ that satisfy the normalization condition

$$
\sum_i A_i^\dagger A_i = I.
$$

The receiving object is expected to mutate `target_tensor` so that it
contains the density matrix after multiplication, and then return
`target_tensor`. Alternatively, if workspace is required,
the receiving object can overwrite `out_buffer` with the results
and return `out_buffer`. Or, if the receiving object is attempting to
be simple instead of fast, it can create an entirely new array and
return that.

Attributes:
    target_tensor: The input tensor that needs to be left and right
        multiplied and summed, representing the effect of the channel.
        The tensor will have the shape (2, 2, 2, ..., 2). It usually
        corresponds to a multi-qubit density matrix, with the first
        n indices corresponding to the rows of the density matrix and
        the last n indices corresponding to the columns of the density
        matrix.
    out_buffer: Pre-allocated workspace with the same shape and
        dtype as the target tensor. If buffers are used, the result should
        end up in this buffer. It is the responsibility of calling code
        to notice if the result is this buffer.
    auxiliary_buffer0: Pre-allocated workspace with the same shape and dtype
        as the target tensor.
    auxiliary_buffer1: Pre-allocated workspace with the same shape
        and dtype as the target tensor.
    left_axes: Which axes to multiply the left action of the channel upon.
    right_axes: Which axes to multiply the right action of the channel upon.

### `__init__`

```python
def __init__(self, target_tensor: np.ndarray, out_buffer: np.ndarray, auxiliary_buffer0: np.ndarray, auxiliary_buffer1: np.ndarray, left_axes: Iterable[int], right_axes: Iterable[int])
```

Args for apply channel.

Args:
    target_tensor: The input tensor that needs to be left and right
        multiplied and summed representing the effect of the channel.
        The tensor will have the shape (2, 2, 2, ..., 2). It usually
        corresponds to a multi-qubit density matrix, with the first
        n indices corresponding to the rows of the density matrix and
        the last n indices corresponding to the columns of the density
        matrix.
    out_buffer: Pre-allocated workspace with the same shape and
        dtype as the target tensor. If buffers are used, the result
        should end up in this buffer. It is the responsibility of
        calling code to notice if the result is this buffer.
    auxiliary_buffer0: Pre-allocated workspace with the same shape and
        dtype as the target tensor.
    auxiliary_buffer1: Pre-allocated workspace with the same shape
        and dtype as the target tensor.
    left_axes: Which axes to multiply the left action of the channel
        upon.
    right_axes: Which axes to multiply the right action of the channel
        upon.

## `SupportsApplyChannel`

```python
class SupportsApplyChannel(Protocol)
```

An object that can efficiently implement a channel.

## `apply_channel`

```python
def apply_channel(val: Any, args: ApplyChannelArgs, default: np.ndarray | TDefault=RaiseTypeErrorIfNotProvided) -> np.ndarray | TDefault
```

High performance evolution under a channel evolution.

If `val` defines an `_apply_channel_` method, that method will be
used to apply `val`'s channel effect to the target tensor. Otherwise, if
`val` defines an `_apply_unitary_` method, that method will be used to
apply `val`s channel effect to the target tensor.  Otherwise, if `val`
returns a non-default channel with `cirq.channel`, that channel will be
applied using a generic method.  If none of these cases apply, an
exception is raised or the specified default value is returned.


Args:
    val: The value with a channel to apply to the target.
    args: A mutable `cirq.ApplyChannelArgs` object describing the target
        tensor, available workspace, and left and right axes to operate on.
        The attributes of this object will be mutated as part of computing
        the result.
    default: What should be returned if `val` doesn't have a channel. If
        not specified, a TypeError is raised instead of returning a default
        value.

Returns:
    If the receiving object is not able to apply a channel,
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
    TypeError: `val` doesn't have a channel and `default` wasn't specified.
    ValueError: Different left and right shapes of `args.target_tensor`
        selected by `left_axes` and `right_axes` or `qid_shape(val)` doesn't
        equal the left and right shapes.
    AssertionError: `_apply_channel_` returned an auxiliary buffer.
