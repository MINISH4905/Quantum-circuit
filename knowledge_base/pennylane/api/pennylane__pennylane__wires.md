---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/wires.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/wires.py
license: Apache-2.0
---

## Module `pennylane/wires.py`

This module contains the :class:`Wires` class, which takes care of wire bookkeeping.

## `Wires`

```python
class Wires(Sequence)
```

A bookkeeping class for wires, which are ordered collections of unique objects.

If the input ``wires`` can be iterated over, it is interpreted as a sequence of wire labels that have to be
unique and hashable. Else it is interpreted as a single wire label that has to be hashable. The
only exception are strings which are interpreted as wire labels.

The hash function of a wire label is considered the source of truth when deciding whether
two wire labels are the same or not.

Indexing an instance of this class will return a wire label.

.. warning::

    In order to support wire labels of any hashable type, integers and 0-d arrays are considered different.
    For example, running ``qp.RX(1.1, qp.numpy.array(0))`` on a device initialized with ``wires=[0]``
    will fail because ``qp.numpy.array(0)`` does not exist in the device's wire map.

Args:
     wires (Any): the wire label(s)

### `__getitem__`

```python
def __getitem__(self, idx)
```

Method to support indexing. Returns a Wires object if index is a slice,
or a label if index is an integer.

### `__len__`

```python
def __len__(self)
```

Method to support ``len()``.

### `contains_wires`

```python
def contains_wires(self, wires)
```

Method to determine if Wires object contains wires in another Wires object.

### `__contains__`

```python
def __contains__(self, item)
```

Method checking if Wires object contains an object.

### `__repr__`

```python
def __repr__(self)
```

Method defining the string representation of this class.

### `__eq__`

```python
def __eq__(self, other)
```

Method to support the '==' operator.
This will also implicitly define the '!=' operator.

### `__hash__`

```python
def __hash__(self)
```

Implements the hash function.

### `__add__`

```python
def __add__(self, other)
```

Defines the addition to return a Wires object containing all wires of the two terms.

Args:
    other (Iterable[Number,str], Number, Wires): object to add from the right

Returns:
    Wires: all wires appearing in either object

**Example**

>>> wires1 =  Wires([4, 0, 1])
>>> wires2 = Wires([1, 2])
>>> wires1 + wires2
Wires([4, 0, 1, 2])

### `__radd__`

```python
def __radd__(self, other)
```

Defines addition according to __add__ if the left object has no addition defined.

Args:
    other (Iterable[Number,str], Number, Wires): object to add from the left

Returns:
    Wires: all wires appearing in either object

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Defines a numpy array representation of the Wires object.

Args:
    dtype: The desired data-type for the array. Default is ``None``.
    copy: If ``True``, then force a copy. If ``False``, then ensure that a copy
        is not made. If ``None`` (default), a copy will only be made if
        necessary.

Returns:
    ndarray: array representing Wires object

### `__jax_array__`

```python
def __jax_array__(self)
```

Defines a JAX numpy array representation of the Wires object.

Returns:
    JAX ndarray: array representing Wires object

### `labels`

```python
def labels(self)
```

Get a tuple of the labels of this Wires object.

### `toarray`

```python
def toarray(self)
```

Returns a numpy array representation of the Wires object.

Returns:
    ndarray: array representing Wires object

### `tolist`

```python
def tolist(self)
```

Returns a list representation of the Wires object.

Returns:
    List: list of wire labels

### `toset`

```python
def toset(self)
```

Returns a set representation of the Wires object.

Returns:
    Set: set of wire labels

### `index`

```python
def index(self, wire)
```

Overwrites a Sequence's ``index()`` function which returns the index of ``wire``.

Args:
    wire (Any): Object whose index is to be found. If this is a Wires object of length 1, look for the object
        representing the wire.

Returns:
    int: index of the input

### `indices`

```python
def indices(self, wires)
```

Return the indices of the wires in this Wires object.

Args:
    wires (Iterable[Number, str], Number, str, Wires): Wire(s) whose indices are to be found

Returns:
    list: index list

**Example**

>>> wires1 =  Wires([4, 0, 1])
>>> wires2 = Wires([1, 4])
>>> wires1.indices(wires2)
[2, 0]
>>> wires1.indices([1, 4])
[2, 0]

### `map`

```python
def map(self, wire_map)
```

Returns a new Wires object with different labels, using the rule defined in mapping.

Args:
    wire_map (dict): Dictionary containing all wire labels used in this object as keys, and unique
                     new labels as their values
**Example**

>>> wires = Wires(['a', 'b', 'c'])
>>> wire_map = {'a': 4, 'b':2, 'c': 3}
>>> wires.map(wire_map)
Wires([4, 2, 3])

### `subset`

```python
def subset(self, indices, periodic_boundary=False)
```

Returns a new Wires object which is a subset of this Wires object. The wires of the new
object are the wires at positions specified by 'indices'. Also accepts a single index as input.

Args:
    indices (List[int] or int): indices or index of the wires we want to select
    periodic_boundary (bool): controls periodic boundary conditions in the indexing

Returns:
    Wires: subset of wires

**Example**

>>> wires = Wires([4, 0, 1, 5, 6])
>>> wires.subset([2, 3, 0])
Wires([1, 5, 4])
>>> wires.subset(1)
Wires([0])

If ``periodic_boundary`` is True, the modulo of the number of wires of an index is used instead of an index,
so that  ``wires.subset(i) == wires.subset(i % n_wires)`` where ``n_wires`` is the number of wires of this
object.

>>> wires = Wires([4, 0, 1, 5, 6])
>>> wires.subset([5, 1, 7], periodic_boundary=True)
Wires([4, 0, 1])

### `select_random`

```python
def select_random(self, n_samples, seed=None)
```

Returns a randomly sampled subset of Wires of length 'n_samples'.

Args:
    n_samples (int): number of subsampled wires
    seed (int): optional random seed used for selecting the wires

Returns:
    Wires: random subset of wires

### `shared_wires`

```python
def shared_wires(list_of_wires)
```

Return only the wires that appear in each Wires object in the list.

This is similar to a set intersection method, but keeps the order of wires as they appear in the list.

Args:
    list_of_wires (list[Wires]): list of Wires objects

Returns:
    Wires: shared wires

**Example**

>>> wires1 =  Wires([4, 0, 1])
>>> wires2 = Wires([3, 0, 4])
>>> wires3 = Wires([4, 0])
>>> Wires.shared_wires([wires1, wires2, wires3])
Wires([4, 0])
>>> Wires.shared_wires([wires2, wires1, wires3])
Wires([0, 4])

### `all_wires`

```python
def all_wires(list_of_wires, sort=False)
```

Return the wires that appear in any of the Wires objects in the list.

This is similar to a set combine method, but keeps the order of wires as they appear in the list.

Args:
    list_of_wires (list[Wires]): list of Wires objects
    sort (bool): Toggle for sorting the combined wire labels. The sorting is based on
        value if all keys are int, else labels' str representations are used.

Returns:
    Wires: combined wires

**Example**

>>> wires1 = Wires([4, 0, 1])
>>> wires2 = Wires([3, 0, 4])
>>> wires3 = Wires([5, 3])
>>> list_of_wires = [wires1, wires2, wires3]
>>> Wires.all_wires(list_of_wires)
Wires([4, 0, 1, 3, 5])

### `unique_wires`

```python
def unique_wires(list_of_wires)
```

Return the wires that are unique to any Wire object in the list.

Args:
    list_of_wires (list[Wires]): list of Wires objects

Returns:
    Wires: unique wires

**Example**

>>> wires1 = Wires([4, 0, 1])
>>> wires2 = Wires([0, 2, 3])
>>> wires3 = Wires([5, 3])
>>> Wires.unique_wires([wires1, wires2, wires3])
Wires([4, 1, 2, 5])

### `union`

```python
def union(self, other)
```

Return the union of the current :class:`~.Wires` object and either another :class:`~.Wires` object or an
iterable that can be interpreted like a :class:`~.Wires` object, e.g., a ``list``.

Args:
    other (Any): :class:`~.Wires` or any iterable that can be interpreted like a :class:`~.Wires` object
        to perform the union with

Returns:
    Wires: A new :class:`~.Wires` object representing the union of the two :class:`~.Wires` objects.

**Example**

>>> from pennylane.wires import Wires
>>> wires1 = Wires([1, 2, 3])
>>> wires2 = Wires([3, 4, 5])
>>> wires1.union(wires2)
Wires([1, 2, 3, 4, 5])

Alternatively, use the ``|`` operator:

>>> wires1 | wires2
Wires([1, 2, 3, 4, 5])

### `__or__`

```python
def __or__(self, other)
```

Return the union of the current Wires object and either another Wires object or an
iterable that can be interpreted like a Wires object e.g., List.

Args:
    other (Any): Wires or any iterable that can be interpreted like a Wires object
        to perform the union with

Returns:
    Wires: A new Wires object representing the union of the two Wires objects.

**Example**

>>> from pennylane.wires import Wires
>>> wires1 = Wires([1, 2, 3])
>>> wires2 = Wires([3, 4, 5])
>>> wires1 | wires2
Wires([1, 2, 3, 4, 5])

### `__ror__`

```python
def __ror__(self, other)
```

Right-hand version of __or__.

### `intersection`

```python
def intersection(self, other)
```

Return the intersection of the current :class:`~.Wires` object and either another :class:`~.Wires` object or
an iterable that can be interpreted like a :class:`~.Wires` object, e.g., a ``list``.

Args:
    other (Any): :class:`~.Wires` or any iterable that can be interpreted like a :class:`~.Wires` object
        to perform the intersection with

Returns:
    Wires: A new :class:`~.Wires` object representing the intersection of the two :class:`~.Wires` objects.

**Example**

>>> from pennylane.wires import Wires
>>> wires1 = Wires([1, 2, 3])
>>> wires2 = Wires([2, 3, 4])
>>> wires1.intersection(wires2)
Wires([2, 3])

Alternatively, use the ``&`` operator:

>>> wires1 & wires2
Wires([2, 3])

### `__and__`

```python
def __and__(self, other)
```

Return the intersection of the current Wires object and either another Wires object or
an iterable that can be interpreted like a Wires object e.g., List.

Args:
    other (Any): Wires or any iterable that can be interpreted like a Wires object
        to perform the union with

Returns:
    Wires: A new Wires object representing the intersection of the two Wires objects.

**Example**

>>> from pennylane.wires import Wires
>>> wires1 = Wires([1, 2, 3])
>>> wires2 = Wires([2, 3, 4])
>>> wires1 & wires2
Wires([2, 3])

### `__rand__`

```python
def __rand__(self, other)
```

Right-hand version of __and__.

### `difference`

```python
def difference(self, other)
```

Return the difference of the current :class:`~.Wires` object and either another :class:`~.Wires` object or
an iterable that can be interpreted like a :class:`~.Wires` object, e.g., a ``list``.

Args:
    other (Any): :class:`~.Wires` object or any iterable that can be interpreted like a :class:`~.Wires` object
        to perform the difference with

Returns:
    Wires: A new :class:`~.Wires` object representing the difference of the two :class:`~.Wires` objects.

**Example**

>>> from pennylane.wires import Wires
>>> wires1 = Wires([1, 2, 3])
>>> wires2 = Wires([2, 3, 4])
>>> wires1.difference(wires2)
Wires([1])

Alternatively, use the ``-`` operator:

>>> wires1 - wires2
Wires([1])

### `__sub__`

```python
def __sub__(self, other)
```

Return the difference of the current Wires object and either another Wires object or
an iterable that can be interpreted like a Wires object e.g., List.

Args:
    other (Any): Wires or any iterable that can be interpreted like a Wires object
        to perform the union with

Returns:
    Wires: A new Wires object representing the difference of the two Wires objects.

**Example**

>>> from pennylane.wires import Wires
>>> wires1 = Wires([1, 2, 3])
>>> wires2 = Wires([2, 3, 4])
>>> wires1 - wires2
Wires([1])

### `__rsub__`

```python
def __rsub__(self, other)
```

Right-hand version of __sub__.

### `symmetric_difference`

```python
def symmetric_difference(self, other)
```

Return the symmetric difference of the current :class:`~.Wires` object and either another :class:`~.Wires`
object or an iterable that can be interpreted like a :class:`~.Wires` object, e.g., a ``list``.

Args:
    other (Any): :class:`~.Wires` or any iterable that can be interpreted like a :class:`~.Wires` object
        to perform the symmetric difference with

Returns:
    Wires: A new :class:`~.Wires` object representing the symmetric difference of the two :class:`~.Wires` objects.

**Example**

>>> from pennylane.wires import Wires
>>> wires1 = Wires([1, 2, 3])
>>> wires2 = Wires([3, 4, 5])
>>> wires1.symmetric_difference(wires2)
Wires([1, 2, 4, 5])

Alternatively, use the ``^`` operator:

>>> wires1 ^ wires2
Wires([1, 2, 4, 5])

### `__xor__`

```python
def __xor__(self, other)
```

Return the symmetric difference of the current Wires object and either another Wires
object or an iterable that can be interpreted like a Wires object e.g., List.

Args:
    other (Any): Wires or any iterable that can be interpreted like a Wires object
        to perform the union with

Returns:
    Wires: A new Wires object representing the symmetric difference of the two Wires objects.

**Example**

>>> from pennylane.wires import Wires
>>> wires1 = Wires([1, 2, 3])
>>> wires2 = Wires([3, 4, 5])
>>> wires1 ^ wires2
Wires([1, 2, 4, 5])

### `__rxor__`

```python
def __rxor__(self, other)
```

Right-hand version of __xor__.

## `DynamicWire`

```python
class DynamicWire
```

A wire whose concrete value will be determined later during a compilation step or execution.

Multiple dynamic wires can correspond to the same device wire as long as they are properly allocated and
deallocated.

Args:
    key (uuid.UUID or None): An optional UUID key to identify the dynamic wire. If None, a random UUID will be generated.
