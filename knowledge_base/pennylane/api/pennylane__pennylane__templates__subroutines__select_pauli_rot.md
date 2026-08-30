---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/select_pauli_rot.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/select_pauli_rot.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/select_pauli_rot.py`

Contains the SelectPauliRot template.

## `SelectPauliRot`

```python
class SelectPauliRot(Operation)
```

Applies individual single-qubit Pauli rotations depending on the state of
designated control qubits.

This operator, also called a **multiplexed rotation** or **uniformly controlled rotation**,
applies a sequence of multi-controlled rotations about the same axis to a single target qubit.
The rotation angles are selected based on the state of the control qubits.
Its definition is given by:

.. math::

   \sum_i | i \rangle \langle i | \otimes R_P(\alpha_i),

where :math:`| i \rangle` refers to the computational basis state of the control register,
the :math:`\{\alpha_i\}` are the rotation angles, and :math:`R_P` denotes a Pauli rotation
about the Pauli operator :math:`P` applied to the target qubit.

.. figure:: ../../../doc/_static/templates/subroutines/select_pauli_rot.png
                :align: center
                :width: 70%
                :target: javascript:void(0);

For more details, see `Möttönen and Vartiainen (2005), Fig 7a <https://arxiv.org/abs/quant-ph/0504100>`_.

Args:
    angles (tensor_like): The rotation angles to be applied. The length of the angles array must
        be :math:`2^n`, where :math:`n` is the number of ``control_wires``.
    control_wires (Sequence[int]): The control qubits used to select the rotation.
    target_wire (Sequence[int]): The wire where the rotations are applied.
    rot_axis (str): The axis around which the rotation is performed.
        It can take the value ``X``, ``Y`` or ``Z``. Default is ``Z``.

Raises:
    ValueError: If the length of the angles array is not :math:`2^n`, where :math:`n` is the number
        of ``control_wires``.
    ValueError: If ``rot_axis`` has a value different from ``X``, ``Y`` or ``Z``.
    ValueError: If the number of the target wires is not one.

.. seealso:: :class:`~.Select`.

**Example**

.. code-block:: python

    angles = np.array([1.0, 2.0, 3.0, 4.0])

    wires = qp.registers({"control": 2, "target": 1})
    dev = qp.device("default.qubit", wires=3)

    @qp.qnode(dev)
    def circuit():
        qp.SelectPauliRot(
            angles,
            control_wires=wires["control"],
            target_wire=wires["target"],
            rot_axis="Y",
        )
        return qp.state()

>>> print(circuit()) # doctest: +SKIP
[0.8776+0.j 0.4794+0.j 0.    +0.j 0.    +0.j 0.    +0.j 0.    +0.j
 0.    +0.j 0.    +0.j]

### `map_wires`

```python
def map_wires(self, wire_map: dict)
```

Map the control and target wires using the provided wire map.

### `decomposition`

```python
def decomposition(self)
```

Return the operator's decomposition using its parameters and hyperparameters.

### `compute_decomposition`

```python
def compute_decomposition(angles, control_wires, target_wire, rot_axis)
```

Computes the decomposition operations for the given state vector.

Args:
    angles (tensor_like): The rotation angles to be applied.
    control_wires (Sequence[int]): The control qubits used to select the rotation.
    target_wire (Sequence[int]): The wire where the rotations are applied.
    rot_axis (str): The axis around the rotation is performed.
        It can take the value ``X``, ``Y`` or ``Z``. Default is ``Z``.

Returns:
    list: List of decomposition operations.

## `decompose_select_pauli_rot`

```python
def decompose_select_pauli_rot(angles, wires, rot_axis, **__)
```

Decomposes the SelectPauliRot
