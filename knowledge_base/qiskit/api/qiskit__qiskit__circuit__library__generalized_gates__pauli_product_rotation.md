---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/pauli_product_rotation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/pauli_product_rotation.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/pauli_product_rotation.py`

A generic Pauli rotation gate.

## `PauliProductRotationGate`

```python
class PauliProductRotationGate(Gate)
```

A generic Pauli rotation.

This implements the unitary operation

.. math::

    R_P(\theta) = e^{-i \theta / 2 P}

for a Pauli :math:`P \in \{I, X, Y, Z\}^{\otimes n}` and a rotation angle
:math:`\theta \in \mathbb R`, which could be represented by an unbound parameter.

Example:

.. plot::
   :include-source:
   :nofigs:

    from qiskit.circuit import QuantumCircuit
    from qiskit.circuit.library import PauliProductRotationGate
    from qiskit.quantum_info import Pauli

    pauli = Pauli("XYZ")
    ppr = PauliProductRotationGate(pauli, angle=0.2)
    circuit = QuantumCircuit(10)
    circuit.append(ppr, [1, 2, 6])

### `__init__`

```python
def __init__(self, pauli: qiskit.quantum_info.Pauli, angle: ParameterValueType, label: str | None=None)
```

Args:
    pauli: The Pauli defining the rotation axis. May include a phase of :math:`-1`, but
        not :math:`i` or :math:`-i`.
    angle: The rotation angle.
    label: An optional label for the gate to display in circuit visualizations.

### `inverse`

```python
def inverse(self, annotated=False)
```

Return the inverse; a rotation about the negative angle.

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: int | str | None=None, annotated: bool | None=None)
```

Return the controlled version of itself.

The returned gate represents :math:`e^{-i \theta / 2 P_C}`, where :math:`P_C` is the original
Pauli :math:`P`, tensored with :math:`|0\rangle\langle 0|` and :math:`|1\rangle\langle 1|`
projectors (depending on the control state).

Args:
    num_ctrl_qubits: Number of controls to add. Defaults to ``1``.
    label: Optional gate label. Defaults to ``None``.
        Ignored if the controlled gate is implemented as an annotated operation.
    ctrl_state: The control state of the gate, specified either as an integer or a bitstring
        (e.g. ``"110"``). If ``None``, defaults to the all-ones state ``2**num_ctrl_qubits - 1``.
    annotated: Indicates whether the controlled gate should be implemented as a controlled gate
        or as an annotated operation. If ``None``, treated as ``False``.

Returns:
    A controlled version of this gate.

Raises:
    QiskitError: invalid ``num_ctrl_qubits`` or ``ctrl_state``.

### `pauli`

```python
def pauli(self) -> qiskit.quantum_info.Pauli
```

Return the Pauli rotation axis.

Note that this does not include any potential sign in the :class:`~.quantum_info.Pauli`
object used to construct this gate, since the sign is absorbed into the rotation angle,
which is accessible via the ``params`` attribute.

Returns:
    The Pauli rotation axis.

### `to_matrix`

```python
def to_matrix(self)
```

Returns a dense matrix representation of
:class:`~.PauliProductRotationGate`.

This implements

.. math::

   e^{-i \theta / 2 P} = \cos(\theta / 2) I - i \sin(\theta / 2) P

for a rotation angle :math:`\theta` and Pauli :math:`P`.
