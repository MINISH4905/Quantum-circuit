---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/optimization/optimization_utils.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/optimization/optimization_utils.py
license: Apache-2.0
---

## Module `pennylane/transforms/optimization/optimization_utils.py`

Utility functions for circuit optimization.

## `find_next_gate`

```python
def find_next_gate(wires, op_list)
```

Given a list of operations, finds the next operation that acts on at least one of
the same set of wires, if present.

Args:
    wires (Wires): A set of wires acted on by a quantum operation.
    op_list (list[Operation]): A list of operations that are implemented after the
        operation that acts on ``wires``.

Returns:
    int or None: The index, in ``op_list``, of the earliest gate that uses one or more
    of the same wires, or ``None`` if no such gate is present.

## `fuse_rot_angles`

```python
def fuse_rot_angles(angles_1, angles_2)
```

Compute the set of rotation angles that is equivalent to performing
two successive ``qp.Rot`` operations.

The ``qp.Rot`` operation represents the most general single-qubit operation.
Two such operations can be fused into a new operation, however the angular dependence
is non-trivial.

Args:
    angles_1 (tensor_like): A set of three angles for the first ``qp.Rot`` operation.
    angles_2 (tensor_like): A set of three angles for the second ``qp.Rot`` operation.

Returns:
    tensor_like: Rotation angles for a single ``qp.Rot`` operation that
    implements the same operation as the two sets of input angles.

This function supports broadcasting/batching as long as the two inputs are standard
broadcast-compatible.

.. note::

    The output angles are not always defined uniquely because Euler angles are not
    unique for some rotations. ``fuse_rot_angles`` makes a particular
    choice in this case.

.. warning::

    This function is not differentiable everywhere. It has singularities for specific
    input values where the derivative will be NaN.

.. warning::

    This function is numerically unstable at singular points. It is recommended to use
    it with 64-bit floating point precision.

See the documentation of :func:`~.pennylane.transforms.single_qubit_fusion` for a
mathematical derivation of this function.
