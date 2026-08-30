---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/estimator_beta/wires_manager/base_classes.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/estimator_beta/wires_manager/base_classes.py
license: Apache-2.0
---

## Module `pennylane/labs/estimator_beta/wires_manager/base_classes.py`

This module contains the base class for wire management.

## `Allocate`

```python
class Allocate
```

A class used to represent the allocation of auxiliary wires to be used in the resource
decomposition of a :class:`~.pennylane.estimator.resource_operator.ResourceOperator`.

Args:
    num_wires (int): the number of wires to be allocated
    state (Literal["any", "zero"] | AllocateState): The quantum state of the wires to be allocated, valid values include "zero" or "any".
    restored (bool): A guarantee that the allocated register will be restored (deallocated) to its
        initial state. If True, this requirement will be enforced programmatically.

Raises:
    ValueError: `num_wires` must be a positive integer
    ValueError: if `restored` is not a boolean

**Example**

>>> import pennylane.labs.estimator_beta as qre
>>> qre.Allocate(4)
Allocate(4, state=zero, restored=False)
>>> qre.Allocate(2, state="any", restored=True)
Allocate(2, state=any, restored=True)

### `equal`

```python
def equal(self, other: 'Allocate') -> bool
```

Determine if two instances of the class are equal.

### `state`

```python
def state(self)
```

The quantum state of the wires to be allocated, valid values include "zero" or "any".

### `state`

```python
def state(self, _)
```

Raise error if users attempt to change values

### `restored`

```python
def restored(self)
```

A guarantee that the allocated register will be restored (deallocated) to its
initial state. If True, this requirement will be enforced programmatically.

### `restored`

```python
def restored(self, _)
```

Raise error if users attempt to change values

### `num_wires`

```python
def num_wires(self)
```

The number of wires to be allocated.

### `num_wires`

```python
def num_wires(self, _)
```

Raise error if users attempt to change values

## `Deallocate`

```python
class Deallocate
```

A class used to represent the deallocation of auxiliary wires that were used in the resource
decomposition of a :class:`~.pennylane.estimator.resource_operator.ResourceOperator`.

Args:
    num_wires (int | None): the number of wires to be deallocated
    allocated_register (Allocate | None): the allocated wire register the we wish to deallocate
    state (Literal["any", "zero"] | AllocateState): The quantum state of the wires to be deallocated, valid values include "zero" or "any".
    restored (bool): A guarantee that the allocated register will be restored (deallocated) to its
        initial state. If True, this requirement will be enforced programmatically.

Raises:
    ValueError: if `num_wires` is not a positive integer
    ValueError: if `restored` is not a boolean

**Example**

The simplest way to deallocate a register is to provide the instance of ``Allocate``
where the register was allocated.

>>> import pennylane.labs.estimator_beta as qre
>>> allocate_4 = qre.Allocate(4)  # Allocate 4 qubits
>>> qre.Deallocate(allocated_register=allocate_4)
Deallocate(4, state=zero, restored=False)

We can also manually deallocate a register by specifically providing the details of the register.

>>> qre.Deallocate(num_wires=4, state="zero", restored=False)
Deallocate(4, state=zero, restored=False)

.. note::

    If an ``allocated_register`` is provided along with the other parameters (``num_wires``,
    ``state``, ``restored``) and the two differ, then the details provided in the
    ``allocated_register`` will take precedence.

If a register was allocated with ``state = "any"`` and ``restored = True``, this can
only be deallocated by passing that specific instance of ``Allocate`` to deallocate.

>>> temp_register = qre.Allocate(5, state="any", restored=True)
>>> qre.Deallocate(allocated_register=temp_register)  # Restore the allocated register
Deallocate(5, state=any, restored=True)

### `equal`

```python
def equal(self, other: 'Deallocate') -> bool
```

Determine if two instances of the class are equal.

### `state`

```python
def state(self)
```

The quantum state of the wires to be deallocated, valid values include "zero" or "any".

### `state`

```python
def state(self, _)
```

Raise error if users attempt to change values

### `restored`

```python
def restored(self)
```

A guarantee that the allocated register will be restored (deallocated) to its
initial state. If True, this requirement will be enforced programmatically.

### `restored`

```python
def restored(self, _)
```

Raise error if users attempt to change values

### `num_wires`

```python
def num_wires(self)
```

The number of wires to be deallocated.

### `num_wires`

```python
def num_wires(self, _)
```

Raise error if users attempt to change values

### `allocated_register`

```python
def allocated_register(self)
```

The allocated wire register the we wish to deallocate.

### `allocated_register`

```python
def allocated_register(self, _)
```

Raise error if users attempt to change values

## `MarkQubits`

```python
class MarkQubits
```

A base class used to mark the state of certain wire labels.

This class can be used in quantum circuit (qfunc) to mark the state of certain algorithmic wires.
Its primary use is to mark the state of algorithmic qubits so that they can be used by other subroutines.

Args:
    wires (WiresLike): the label(s) of the wires to be marked

### `queue`

```python
def queue(self, context=QueuingManager)
```

Adds the MarkQubit instance to the active queue.

### `equal`

```python
def equal(self, other: 'MarkQubits')
```

Check if two MarkQubits instances are equal.

## `MarkClean`

```python
class MarkClean(MarkQubits)
```

A class used to mark that certain wires are in the zero state.

This class can be used in quantum circuit (qfunc) to mark certain algorithmic wires as being in the zero state.
Its primary use is to mark the state of algorithmic qubits as clean so that they can be used as auxiliary qubits
by other subroutines.

Args:
    wires (WiresLike): the label(s) of the wires to be marked

**Example**

>>> import pennylane.labs.estimator_beta as qre
>>> qre.MarkClean(wires=[0,1,2])
MarkClean(Wires([0, 1, 2]))
