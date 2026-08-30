---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/functions/is_commuting.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/functions/is_commuting.py
license: Apache-2.0
---

## Module `pennylane/ops/functions/is_commuting.py`

Defines `is_commuting`, an function for determining if two functions commute.

## `intersection`

```python
def intersection(wires1, wires2)
```

Check if two sets of wires intersect.

Args:
    wires1 (pennylane.wires.Wires): First set of wires.
    wires2 (pennylane.wires.Wires: Second set of wires.

Returns:
    bool: True if the two sets of wires are not disjoint and False if disjoint.

## `check_commutation_two_non_simplified_crot`

```python
def check_commutation_two_non_simplified_crot(operation1, operation2)
```

Check commutation for two CRot that were not simplified.

Args:
    operation1 (pennylane.Operation): First operation.
    operation2 (pennylane.Operation): Second operation.

Returns:
    bool: True if commutation, False otherwise.

## `check_commutation_two_non_simplified_rotations`

```python
def check_commutation_two_non_simplified_rotations(operation1, operation2)
```

Check that the operations are two non simplified operations. If it is the case, then it checks commutation
for two rotations that were not simplified.

Only allowed ops are `U2`, `U3`, `Rot`, `CRot`.

Args:
    operation1 (pennylane.Operation): First operation.
    operation2 (pennylane.Operation): Second operation.

Returns:
    bool: True if commutation, False otherwise, None if not two rotations.

## `is_commuting`

```python
def is_commuting(operation1, operation2)
```

Check if two operations are commuting using a lookup table.

A lookup table is used to check the commutation between the
controlled, targeted part of operation 1 with the controlled, targeted part of operation 2.

.. note::

    Most qubit-based PennyLane operations are supported --- CV operations
    are not supported at this time.

    Unsupported qubit-based operations include:

    :class:`~.PauliRot`, :class:`~.QubitDensityMatrix`, :class:`~.CVNeuralNetLayers`,
    :class:`~.ApproxTimeEvolution`, :class:`~.ArbitraryUnitary`, :class:`~.CommutingEvolution`,
    :class:`~.DisplacementEmbedding`, :class:`~.SqueezingEmbedding`
    :class:`~.Exp`

Args:
    operation1 (.Operation): A first quantum operation.
    operation2 (.Operation): A second quantum operation.

Returns:
    bool: True if the operations commute, False otherwise.

**Example**

>>> qp.is_commuting(qp.X(0), qp.Z(0))
False
