---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/wires_manager.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/wires_manager.py
license: Apache-2.0
---

## Module `pennylane/estimator/wires_manager.py`

This module contains the base class for wire management.

## `WireResourceManager`

```python
class WireResourceManager
```

Manages and tracks the auxiliary and algorithmic wires used in a quantum circuit.

This class provides a high-level abstraction for managing wire resources within a quantum
circuit.
The manager tracks the state of three distinct types of wires:

* Zeroed state wires: Auxiliary wires that are in the :math:`|0\rangle` state. They are converted
  to an unknown state upon allocation.
* Any state wires: Auxiliary wires that are in an unknown state. They are converted to
  zeroed wires when they are freed.
* Algorithmic wires: The core wires used by the quantum algorithm.

Args:
    zeroed (int): Number of zeroed state work wires.
    any_state (int): Number of work wires in an unknown state, default is ``0``.
    algo_wires (int): Number of algorithmic wires, default value is ``0``.
    tight_budget (bool): Determines whether extra zeroed state wires can be allocated when they
        exceed the available amount. The default is ``False``.

**Example**

>>> import pennylane.estimator as qre
>>> q = qre.WireResourceManager(
...     zeroed=2,
...     any_state=2,
...     tight_budget=False,
... )
>>> print(q)
WireResourceManager(zeroed wires=2, any_state wires=2, algorithmic wires=0, tight budget=False)

### `algo_wires`

```python
def algo_wires(self) -> int
```

Returns the number of algorithmic wires.

### `total_wires`

```python
def total_wires(self) -> int
```

Returns the number of total wires.

### `algo_wires`

```python
def algo_wires(self, count: int)
```

Setter for algorithmic wires.

### `grab_zeroed`

```python
def grab_zeroed(self, num_wires: int) -> None
```

Grabs zeroed wires, and moves them to an arbitrary state; incrementing the number of any_state wires.

Args:
    num_wires(int) : number of zeroed wires to be grabbed

Raises:
    ValueError: If tight_budget is `True` and the number of wires to be grabbed is greater than
        available zeroed wires.

### `free_wires`

```python
def free_wires(self, num_wires: int) -> None
```

Frees any_state wires and converts them into zeroed wires.

Args:
    num_wires(int) : number of wires to be freed

Raises:
    ValueError: If number of wires to be freed is greater than available any_state wires.

## `Allocate`

```python
class Allocate(_WireAction)
```

Allows allocation of work wires through :class:`~pennylane.estimator.WireResourceManager`.

Args:
    num_wires (int): number of work wires to be allocated


.. details::
    :title: Usage Details

    The ``Allocate`` class is typically used within a decomposition function to track the
    allocation of auxiliary wires. This allows determination of a circuit's wire overhead.
    In this example, we show the decomposition for a
    3-controlled ``X`` gate, which requires one work wire.

    First, we define a custom decomposition which doesn't track the extra work wire:

    >>> import pennylane.estimator as qre
    >>> from pennylane.estimator import GateCount, resource_rep
    >>> def resource_decomp(num_ctrl_wires=3, num_zero_ctrl=0, **kwargs):
    ...     gate_list = []
    ...     gate_list.append(GateCount(resource_rep(qre.TemporaryAND), 1))
    ...     gate_list.append(GateCount(resource_rep(qre.Adjoint, {"base_cmpr_op": resource_rep(qre.TemporaryAND)}), 1))
    ...     gate_list.append(GateCount(resource_rep(qre.Toffoli), 1))
    ...     return gate_list
    >>> config = qre.ResourceConfig()
    >>> config.set_decomp(qre.MultiControlledX, resource_decomp)
    >>> res = qre.estimate(qre.MultiControlledX(3, 0), config=config)
    >>> print(res.algo_wires, res.zeroed_wires, res.any_state_wires)
    4 0 0

    This decomposition uses a total of ``4`` wires and doesn't track the work wires.

    Now, if we want to track the allocation of wires using ``Allocate``, the decomposition
    can be redefined as:

    >>> import pennylane.estimator as qre
    >>> from pennylane.estimator import GateCount, resource_rep
    >>> def resource_decomp(num_ctrl_wires=3, num_zero_ctrl=0, **kwargs):
    ...     gate_list = []
    ...     gate_list.append(qre.Allocate(num_wires=1))
    ...     gate_list.append(GateCount(resource_rep(qre.TemporaryAND), 1))
    ...     gate_list.append(GateCount(resource_rep(qre.Adjoint, {"base_cmpr_op": resource_rep(qre.TemporaryAND)}), 1))
    ...     gate_list.append(GateCount(resource_rep(qre.Toffoli), 1))
    ...     gate_list.append(qre.Deallocate(num_wires=1))
    ...     return gate_list
    >>> config = qre.ResourceConfig()
    >>> config.set_decomp(qre.MultiControlledX, resource_decomp)
    >>> res = qre.estimate(qre.MultiControlledX(3, 0), config=config)
    >>> print(res.algo_wires, res.zeroed_wires, res.any_state_wires)
    4 1 0

    Now, the one extra auxiliary wire is being tracked.

## `Deallocate`

```python
class Deallocate(_WireAction)
```

Allows freeing ``any_state`` work wires through :class:`~pennylane.estimator.WireResourceManager`.

Args:
    num_wires (int): number of ``any_state`` work wires to be freed.

.. details::
    :title: Usage Details

    The ``Deallocate`` class is typically used within a decomposition function to track the
    allocation of auxiliary wires. This allows to accurately determine the wire overhead
    of a circuit. In this example, we show the decomposition for a
    3-controlled ``X`` gate, which requires one work wire that is returned in a zeroed state.

    First, we define a custom decomposition which allocates the work wire but doesn't free it.

    >>> import pennylane.estimator as qre
    >>> from pennylane.estimator import GateCount, resource_rep
    >>> def resource_decomp(num_ctrl_wires=3, num_zero_ctrl=0, **kwargs):
    ...     gate_list = []
    ...     gate_list.append(qre.Allocate(num_wires=1))
    ...     gate_list.append(GateCount(resource_rep(qre.TemporaryAND), 1))
    ...     gate_list.append(GateCount(resource_rep(qre.Adjoint, {"base_cmpr_op": resource_rep(qre.TemporaryAND)}), 1))
    ...     gate_list.append(GateCount(resource_rep(qre.Toffoli), 1))
    ...     return gate_list
    >>> config = qre.ResourceConfig()
    >>> config.set_decomp(qre.MultiControlledX, resource_decomp)
    >>> res = qre.estimate(qre.MultiControlledX(3, 0), config=config)
    >>> print(res.algo_wires, res.zeroed_wires, res.any_state_wires)
    4 0 1

    This decomposition uses a total of ``4`` algorithmic wires and ``1`` work wire which is returned in an arbitrary state.

    We can free this wire using ``Deallocate``, allowing it to be reused with more operations.
    The decomposition can be redefined as:

    >>> import pennylane.estimator as qre
    >>> from pennylane.estimator import GateCount, resource_rep
    >>> def resource_decomp(num_ctrl_wires=3, num_zero_ctrl=0, **kwargs):
    ...     gate_list = []
    ...     gate_list.append(qre.Allocate(num_wires=1))
    ...     gate_list.append(GateCount(resource_rep(qre.TemporaryAND), 1))
    ...     gate_list.append(GateCount(resource_rep(qre.Adjoint, {"base_cmpr_op": resource_rep(qre.TemporaryAND)}), 1))
    ...     gate_list.append(GateCount(resource_rep(qre.Toffoli), 1))
    ...     gate_list.append(qre.Deallocate(num_wires=1))
    ...     return gate_list
    >>> config = qre.ResourceConfig()
    >>> config.set_decomp(qre.MultiControlledX, resource_decomp)
    >>> res = qre.estimate(qre.MultiControlledX(3, 0), config=config)
    >>> print(res.algo_wires, res.zeroed_wires, res.any_state_wires)
    4 1 0

    Now, the auxiliary wire is freed, meaning that it is described as being in the zeroed state
    after the decomposition, and that it can now be used for other operators which require zeroed auxiliary wires.
