---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/containers/bit_array.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/containers/bit_array.py
license: Apache-2.0
---

## Module `qiskit/primitives/containers/bit_array.py`

BitArray

## `BitArray`

```python
class BitArray(ShapedMixin)
```

Stores an array of bit values.

This object contains a single, contiguous block of data that represents an array of bitstrings.
The last axis is over packed bits, the second last axis is over shots, and the preceding axes
correspond to the shape of the pub that was executed to sample these bits.

You typically get this object back as one part of a :class:`.DataBin` accessed through
a single :class:`.PubResult.data`.  Users do not typically create this class themselves, however
if you have bitstring-like data in an alternate form that you would like to convert to a
:class:`BitArray`, you can use one of :meth:`from_bool_array`, :meth:`from_counts` or
:meth:`from_samples`.

You can "unpack" the bitstrings into expanded array of :class:`bool` by using the
:meth:`to_bool_array` method.

This class supports the bitwise ``&`` (and), ``|`` (or), ``^`` (xor) and ``~`` (not) operators,
where the binary operators act on two :class:`BitArray` instances.

The class also supports the "indexing" syntax ``bit_array[indices]``.  These ``indices`` select
a single entry, or multi-dimensional slice of entries, from the same shape as the corresponding
pub.  The allowed indices match :class:`numpy.ndarray`: you can use single integers, slices
(``a:b``) or Numpy arrays for each dimension, and use a tuple of items to slice multiple
dimensions at once. The indexing syntax cannot be used to slice along the "shots" or "bits"
axes; for these, use :meth:`slice_shots` and :meth:`slice_bits`, respectively.

### `__init__`

```python
def __init__(self, array: NDArray[np.uint8], num_bits: int)
```

Args:
    array: The ``uint8`` data array.
    num_bits: How many bits are in each outcome.

Raises:
    TypeError: If the input is not a NumPy array with type ``numpy.uint8``.
    ValueError: If the input array has fewer than two axes, or the size of the last axis
        is not the smallest number of bytes that can contain ``num_bits``.

### `array`

```python
def array(self) -> NDArray[np.uint8]
```

The raw NumPy array of data.

### `num_bits`

```python
def num_bits(self) -> int
```

The number of bits in the register that this array stores data for.

For example, a ``ClassicalRegister(5, "meas")`` would result in ``num_bits=5``.

### `num_shots`

```python
def num_shots(self) -> int
```

The number of shots sampled from the register in each configuration.

More precisely, the length of the second last axis of :attr:`~.array`.

### `bitcount`

```python
def bitcount(self) -> NDArray[np.uint64]
```

Compute the number of ones appearing in the binary representation of each shot.

Returns:
    A ``numpy.uint64``-array with shape ``(*shape, num_shots)``.

### `from_bool_array`

```python
def from_bool_array(array: NDArray[np.bool_], order: Literal['big', 'little']='big') -> BitArray
```

Construct a new bit array from an array of bools.

Args:
    array: The array to convert, with "bitstrings" along the last axis.
    order: One of ``"big"`` or ``"little"``, indicating whether ``array[..., 0]``
        correspond to the most significant bits or the least significant bits of each
        bitstring, respectively.

Returns:
    A new bit array.

### `from_counts`

```python
def from_counts(counts: Mapping[str | int, int] | Iterable[Mapping[str | int, int]], num_bits: int | None=None) -> BitArray
```

Construct a new bit array from one or more ``Counts``-like objects.

The ``counts`` can have keys that are (uniformly) integers, hexstrings, or bitstrings.
Their values represent numbers of occurrences of that value.

Args:
    counts: One or more counts-like mappings with the same number of shots.
    num_bits: The desired number of bits per shot. If unset, the biggest value found sets
        this value, with a minimum of one bit.

Returns:
    A new bit array with shape ``()`` for single input counts, or ``(N,)`` for an iterable
    of :math:`N` counts.

Raises:
    ValueError: If different mappings have different numbers of shots.
    ValueError: If no counts dictionaries are supplied.

### `from_samples`

```python
def from_samples(samples: Iterable[str] | Iterable[int], num_bits: int | None=None) -> BitArray
```

Construct a new bit array from an iterable of bitstrings, hexstrings, or integers.

All samples are assumed to be integers if the first one is. Strings are all assumed to be
bitstrings whenever the first string doesn't start with ``"0x"``.

Consider pairing this method with :meth:`~reshape` if your samples represent nested data.

Args:
    samples: A list of bitstrings, a list of integers, or a list of hexstrings.
    num_bits: The desired number of bits per sample. If unset, the biggest sample provided
        is used to determine this value, with a minimum of one bit.

Returns:
    A new bit array.

Raises:
    ValueError: If no strings are given.

### `to_bool_array`

```python
def to_bool_array(self, order: Literal['big', 'little']='big') -> NDArray[np.bool_]
```

Convert this :class:`~BitArray` to a boolean array.

Args:
    order: One of ``"big"`` or ``"little"``, respectively indicating whether the most significant
        bit or the least significant bit of each bitstring should be placed at ``[..., 0]``.

Returns:
    A NumPy array of bools.

Raises:
    ValueError: If the order is not one of ``"big"`` or ``"little"``.

### `get_counts`

```python
def get_counts(self, loc: int | tuple[int, ...] | None=None) -> dict[str, int]
```

Return a counts dictionary with bitstring keys.

Args:
    loc: Which entry of this array to return a dictionary for. If ``None``, counts from
        all positions in this array are unioned together.

Returns:
    A dictionary mapping bitstrings to the number of occurrences of that bitstring.

### `get_int_counts`

```python
def get_int_counts(self, loc: int | tuple[int, ...] | None=None) -> dict[int, int]
```

Return a counts dictionary, where bitstrings are stored as ``int``\s.

Args:
    loc: Which entry of this array to return a dictionary for. If ``None``, counts from
        all positions in this array are unioned together.

Returns:
    A dictionary mapping ``ints`` to the number of occurrences of that ``int``.

### `get_bitstrings`

```python
def get_bitstrings(self, loc: int | tuple[int, ...] | None=None) -> list[str]
```

Return a list of bitstrings.

Args:
    loc: Which entry of this array to return a dictionary for. If ``None``, counts from
        all positions in this array are unioned together.

Returns:
    A list of bitstrings.

### `reshape`

```python
def reshape(self, *shape: ShapeInput) -> BitArray
```

Return a new reshaped bit array.

The :attr:`~num_shots` axis is either included or excluded from the reshaping procedure
depending on which picture the new shape is compatible with. For example, for a bit array
with shape ``(20, 5)`` and ``64`` shots, a reshape to ``(100,)`` would leave the
number of shots intact, whereas a reshape to ``(200, 32)`` would change the number of
shots to ``32``.

Args:
    *shape: The new desired shape.

Returns:
    A new bit array.

Raises:
    ValueError: If the size corresponding to your new shape is not equal to either
        :attr:`~size`, or the product of :attr:`~size` and :attr:`~num_shots`.

### `transpose`

```python
def transpose(self, *axes) -> BitArray
```

Return a bit array with axes transposed.

Args:
    axes: None, tuple of ints or n ints. See `ndarray.transpose
        <https://numpy.org/doc/stable/reference/generated/
        numpy.ndarray.transpose.html#numpy.ndarray.transpose>`_
        for the details.

Returns:
    BitArray: A bit array with axes permuted.

Raises:
    ValueError: If ``axes`` don't match this bit array.
    ValueError: If ``axes`` includes any indices that are out of bounds.

### `slice_bits`

```python
def slice_bits(self, indices: int | Sequence[int]) -> BitArray
```

Return a bit array sliced along the bit axis of some indices of interest.

.. note::

    The convention used by this method is that the index ``0`` corresponds to
    the least-significant bit in the :attr:`~array`, or equivalently
    the right-most bitstring entry as returned by
    :meth:`~get_counts` or :meth:`~get_bitstrings`, etc.

    If this bit array was produced by a sampler, then an index ``i`` corresponds to the
    :class:`~.ClassicalRegister` location ``creg[i]``.

Args:
    indices: The bit positions of interest to slice along.

Returns:
    A bit array sliced along the bit axis.

Raises:
    IndexError: If there are any invalid indices of the bit axis.

### `slice_shots`

```python
def slice_shots(self, indices: int | Sequence[int]) -> BitArray
```

Return a bit array sliced along the shots axis of some indices of interest.

Args:
    indices: The shots positions of interest to slice along.

Returns:
    A bit array sliced along the shots axis.

Raises:
    IndexError: If there are any invalid indices of the shots axis.

### `postselect`

```python
def postselect(self, indices: Sequence[int] | int, selection: Sequence[bool | int] | bool | int) -> BitArray
```

Post-select this bit array based on sliced equality with a given bitstring.

.. note::
    If this bit array contains any shape axes, it is first flattened into a long list of shots
    before applying post-selection. This is done because :class:`~BitArray` cannot handle
    ragged numbers of shots across axes.

Args:
    indices: A list of the indices of the cbits on which to postselect.
        If this bit array was produced by a sampler, then an index ``i`` corresponds to the
        :class:`~.ClassicalRegister` location ``creg[i]`` (as in :meth:`~slice_bits`).
        Negative indices are allowed.

    selection: A list of binary values (will be cast to ``bool``) of length matching
        ``indices``, with ``indices[i]`` corresponding to ``selection[i]``. Shots will be
        discarded unless all cbits specified by ``indices`` have the values given by
        ``selection``.

Returns:
    A new bit array with ``shape=(), num_bits=data.num_bits, num_shots<=data.num_shots``.

Raises:
    IndexError: If ``max(indices)`` is greater than or equal to :attr:`num_bits`.
    IndexError: If ``min(indices)`` is less than negative :attr:`num_bits`.
    ValueError: If the lengths of ``selection`` and ``indices`` do not match.

### `expectation_values`

```python
def expectation_values(self, observables: ObservablesArrayLike) -> NDArray[np.float64]
```

Compute the expectation values of the provided observables, broadcasted against
this bit array.

.. note::

    This method returns the real part of the expectation value even if
    the operator has complex coefficients due to the specification of
    :func:`~.sampled_expectation_value`.

Args:
    observables: The observable(s) to take the expectation value of.
        Must have a shape broadcastable with this bit array and
        the same number of qubits as the number of bits of this bit array.
        The observables must be diagonal (I, Z, 0 or 1) too.

Returns:
    An array of expectation values whose shape is the broadcast shape of ``observables``
    and this bit array.

Raises:
    ValueError: If the provided observables does not have a shape broadcastable with
        this bit array.
    ValueError: If the provided observables does not have the same number of qubits as
        the number of bits of this bit array.
    ValueError: If the provided observables are not diagonal.

### `concatenate`

```python
def concatenate(bit_arrays: Sequence[BitArray], axis: int=0) -> BitArray
```

Join a sequence of bit arrays along an existing axis.

Args:
    bit_arrays: The bit arrays must have (1) the same number of bits,
        (2) the same number of shots, and
        (3) the same shape, except in the dimension corresponding to axis
        (the first, by default).
    axis: The axis along which the arrays will be joined. Default is 0.

Returns:
    The concatenated bit array.

Raises:
    ValueError: If the sequence of bit arrays is empty.
    ValueError: If any bit arrays has a different number of bits.
    ValueError: If any bit arrays has a different number of shots.
    ValueError: If any bit arrays has a different number of dimensions.

### `concatenate_shots`

```python
def concatenate_shots(bit_arrays: Sequence[BitArray]) -> BitArray
```

Join a sequence of bit arrays along the shots axis.

Args:
    bit_arrays: The bit arrays must have (1) the same number of bits,
        and (2) the same shape.

Returns:
    The stacked bit array.

Raises:
    ValueError: If the sequence of bit arrays is empty.
    ValueError: If any bit arrays has a different number of bits.
    ValueError: If any bit arrays has a different shape.

### `concatenate_bits`

```python
def concatenate_bits(bit_arrays: Sequence[BitArray]) -> BitArray
```

Join a sequence of bit arrays along the bits axis.

.. note::
    This method is equivalent to per-shot bitstring concatenation.

Args:
    bit_arrays: Bit arrays that have (1) the same number of shots,
        and (2) the same shape.

Returns:
    The stacked bit array.

Raises:
    ValueError: If the sequence of bit arrays is empty.
    ValueError: If any bit arrays has a different number of shots.
    ValueError: If any bit arrays has a different shape.
