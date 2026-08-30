---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/measurements/shots.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/measurements/shots.py
license: Apache-2.0
---

## Module `pennylane/measurements/shots.py`

This module contains the Shots class to hold shot-related information.

## `ShotCopies`

```python
class ShotCopies(NamedTuple)
```

A namedtuple that represents a shot quantity being repeated some number of times.
For example, ``ShotCopies(10 shots x 2)`` indicates two executions with 10 shots each for 20 shots total.

### `__str__`

```python
def __str__(self)
```

The string representation of the class

### `__repr__`

```python
def __repr__(self)
```

The representation of the class

## `valid_int`

```python
def valid_int(s)
```

Returns True if s is a positive integer.

## `valid_tuple`

```python
def valid_tuple(s)
```

Returns True if s is a tuple of the form (shots, copies).

## `Shots`

```python
class Shots
```

A data class that stores shot information.

Args:
    shots (Union[None, int, Sequence[int, Tuple[int, int]]]): Raw shot information

Defining shots enables users to specify circuit executions, and the Shots class standardizes
the internal representation of shots. There are three ways to specify shot values:

* The value ``None``
* A positive integer
* A sequence consisting of either positive integers or a tuple-pair of positive integers of the form ``(shots, copies)``

The tuple-pair of the form ``(shots, copies)`` is represented internally by a NamedTuple called
:class:`~ShotCopies`. The first value is the number of shots to execute, and the second value is the
number of times to repeat a circuit with that number of shots.

The ``Shots`` class exposes two properties:

* ``total_shots``, the total number of shots to be executed
* ``shot_vector``, the tuple of :class:`~ShotCopies` to be executed

Instances of this class are static. If an instance is passed to the constructor, that same
instance is returned. If an instance is constructed with a ``None`` value, ``total_shots``
will be ``None``.  This indicates analytic execution. A ``Shots`` object created with a
``None`` value is Falsy, while any other value results in a Truthy object:

>>> bool(Shots(None)), bool(Shots(1))
(False, True)

**Examples**

Example constructing a Shots instance with ``None``:

>>> shots = Shots(None)
>>> shots.total_shots, shots.shot_vector
(None, ())

Example constructing a Shots instance with an int:

>>> shots = Shots(100)
>>> shots.total_shots, shots.shot_vector
(100, (ShotCopies(100 shots x 1),))

Example constructing a Shots instance with another instance:

>>> shots = Shots(100)
>>> Shots(shots) is shots
True

Example constructing a Shots instance with a sequence of ints:

>>> shots = Shots([100, 200])
>>> shots.total_shots, shots.shot_vector
(300, (ShotCopies(100 shots x 1), ShotCopies(200 shots x 1)))

Example constructing a Shots instance with a sequence of tuple-pairs:

>>> shots = Shots(((100, 3), (200, 4),))
>>> shots.total_shots, shots.shot_vector
(1100, (ShotCopies(100 shots x 3), ShotCopies(200 shots x 4)))

Example constructing a Shots instance with a sequence of both ints and tuple-pairs.
Note that the first stand-alone ``100`` gets absorbed into the subsequent tuple because the
shot value matches:

>>> shots = Shots((10, 100, (100, 3), (200, 4),))
>>> shots.total_shots, shots.shot_vector
(1210, (ShotCopies(10 shots x 1), ShotCopies(100 shots x 4), ShotCopies(200 shots x 4)))

Example constructing a Shots instance by multiplying an existing one by an int or float:

>>> Shots(100) * 2
Shots(total_shots=200, shot_vector=(ShotCopies(200 shots x 1),))
>>> Shots([7, (100, 2)]) * 1.5
Shots(total_shots=310, shot_vector=(ShotCopies(10 shots x 1), ShotCopies(150 shots x 2)))

Example constructing a Shots instance by adding two existing instances together:

>>> Shots(100) + Shots(((10,2),))
Shots(total_shots=120, shot_vector=(ShotCopies(100 shots x 1), ShotCopies(10 shots x 2)))

One should also note that specifying a single tuple of length 2 is considered two different
shot values, and *not* a tuple-pair representing shots and copies to avoid special behaviour
depending on the iterable type:

>>> shots = Shots((100, 2))
>>> shots.total_shots, shots.shot_vector
(102, (ShotCopies(100 shots x 1), ShotCopies(2 shots x 1)))

>>> shots = Shots(((100, 2),))
>>> shots.total_shots, shots.shot_vector
(200, (ShotCopies(100 shots x 2),))

### `__str__`

```python
def __str__(self)
```

The string representation of the class

### `__repr__`

```python
def __repr__(self)
```

The representation of the class

### `__eq__`

```python
def __eq__(self, other)
```

Equality between Shot instances.

### `__hash__`

```python
def __hash__(self)
```

Hash for a given Shot instance.

### `has_partitioned_shots`

```python
def has_partitioned_shots(self)
```

Evaluates to True if this instance represents either multiple shot
quantities, or the same shot quantity repeated multiple times.

Returns:
    bool: whether shots are partitioned

### `num_copies`

```python
def num_copies(self)
```

The total number of copies of any shot quantity.

### `bins`

```python
def bins(self)
```

Yields:
    tuple: A tuple containing the lower and upper bounds for each shot quantity in shot_vector.

Example:
    >>> shots = Shots((1, 1, 2, 3))
    >>> list(shots.bins())
    [(0, 1), (1, 2), (2, 4), (4, 7)]

## `add_shots`

```python
def add_shots(s1: Shots, s2: Shots) -> Shots
```

Add two :class:`~.Shots` objects by concatenating their shot vectors.

Args:
    s1 (Shots): a Shots object to add
    s2 (Shots): a Shots object to add

Returns:
    Shots: a :class:`~.Shots` object built by concatenating the shot vectors of ``s1`` and ``s2``

Example:
    >>> s1 = Shots((5, (10, 2)))
    >>> s2 = Shots((3, 2, (10, 3)))
    >>> print(qp.measurements.add_shots(s1, s2))
    Shots(total=60, vector=[5 shots, 10 shots x 2, 3 shots, 2 shots, 10 shots x 3])
