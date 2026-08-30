---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/trotter_error/abstract.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/trotter_error/abstract.py
license: Apache-2.0
---

## Module `pennylane/labs/trotter_error/abstract.py`

The Fragment class

## `Fragment`

```python
class Fragment(ABC)
```

Abstract class used to define a fragment object for product formula error estimation.

A :class:`~.Fragment` is an object that has a well-defined notion of a commutator. To ensure
the existence of commutators, the implementation requires the following arithmetic dunder
methods:

* :meth:`~.__add__`: implements addition

* :meth:`~.__mul__`: implements multiplication

* :meth:`~.__matmul__`: implements matrix multiplication

In addition to the arithmetic operators, a ``norm`` method should be defined. The norm is
required to compute error estimates of Trotter error operators.

### `norm`

```python
def norm(self, params: dict) -> float
```

Compute the norm of the fragment.

Args:
    params (Dict): A dictionary of parameters needed to compute the norm. It should be
        specified for each class inheriting from :class:`~.Fragment`.

Returns:
    float: the norm of the :class:`~.Fragment`

### `apply`

```python
def apply(self, state: AbstractState) -> AbstractState
```

Apply the Fragment to a state on the right. The type of ``state`` is determined by each class inheriting from ``Fragment``.

Args:
    state (AbstractState): an object representing a quantum state

Returns:
    AbstractState: the result of applying the ``Fragment`` to ``state``

### `expectation`

```python
def expectation(self, left: AbstractState, right: AbstractState) -> float
```

Return the expectation value of a state. The type of ``state`` is determined by each class inheriting from ``Fragment``.

Args:
    left (AbstractState): the state to be multiplied on the left of the ``Fragment``
    right (AbstractState): the state to be multiplied on the right of the ``Fragment``

Returns:
    float: the expectation value obtained by applying ``Fragment`` to the given states

## `commutator`

```python
def commutator(a: Fragment, b: Fragment) -> Fragment
```

Return the commutator of two :class:`~.Fragment` objects

Args:
    a (Fragment): the :class:`~.Fragment` on the left side of the commutator
    b (Fragment): the :class:`~.Fragment` on the right side of the commutator

Returns:
    Fragment: the commutator ``[a, b]``

## `nested_commutator`

```python
def nested_commutator(fragments: Sequence[Fragment]) -> Fragment
```

Return the nested commutator of a sequence of :class:`~.Fragment` objects

Args:
    fragments (Sequence[Fragment]): a sequence of fragments

Returns:
    Fragment: the nested commutator of the fragments

## `AbstractState`

```python
class AbstractState(ABC)
```

Abstract class used to define a state object for product formula error estimation.

A class inheriting from ``AbstractState`` must implement the following dunder methods.

* ``__add__``: implements addition
* ``__mul__``: implements multiplication

Additionally, it requires the following methods.

* ``zero_state``: returns a representation of the zero state
* ``dot``: implments the dot product of two states

### `zero_state`

```python
def zero_state(cls) -> AbstractState
```

Return a representation of the zero state.

Returns:
    AbstractState: an ``AbstractState`` representation of the zero state

### `dot`

```python
def dot(self, other: AbstractState) -> float
```

Compute the dot product of two states.

Args:
    other (AbstractState): the state to take the dot product with

Returns:
   float: the dot product of self and other
