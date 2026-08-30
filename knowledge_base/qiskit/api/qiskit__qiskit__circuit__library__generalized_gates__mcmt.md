---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/mcmt.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/mcmt.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/mcmt.py`

Multiple-Control, Multiple-Target Gate.

## `MCMT`

```python
class MCMT(QuantumCircuit)
```

The multi-controlled multi-target gate, for an arbitrary singly controlled target gate.

For example, the H gate controlled on 3 qubits and acting on 2 target qubits is represented as:

.. code-block:: text

    ───■────
       │
    ───■────
       │
    ───■────
    ┌──┴───┐
    ┤0     ├
    │  2-H │
    ┤1     ├
    └──────┘

This default implementation requires no ancilla qubits, by broadcasting the target gate
to the number of target qubits and using Qiskit's generic control routine to control the
broadcasted target on the control qubits. If ancilla qubits are available, a more efficient
variant using the so-called V-chain decomposition can be used. This is implemented in
:class:`~qiskit.circuit.library.MCMTVChain`.

### `__init__`

```python
def __init__(self, gate: Gate | Callable[[QuantumCircuit, circuit.Qubit, circuit.Qubit], circuit.Instruction], num_ctrl_qubits: int, num_target_qubits: int) -> None
```

Create a new multi-control multi-target gate.

Args:
    gate: The gate to be applied controlled on the control qubits and applied to the target
        qubits. Can be either a Gate or a circuit method.
        If it is a callable, it will be cast to a Gate.
    num_ctrl_qubits: The number of control qubits.
    num_target_qubits: The number of target qubits.

Raises:
    AttributeError: If the gate cannot be cast to a controlled gate.
    AttributeError: If the number of controls or targets is 0.

### `num_ancilla_qubits`

```python
def num_ancilla_qubits(self)
```

Return the number of ancillas.

### `control`

```python
def control(self, num_ctrl_qubits=1, label=None, ctrl_state=None, annotated=False)
```

Return the controlled version of the MCMT circuit.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return the inverse MCMT circuit, which is itself.

## `MCMTVChain`

```python
class MCMTVChain(MCMT)
```

The MCMT implementation using the CCX V-chain.

This implementation requires ancillas but is decomposed into a much shallower circuit
than the default implementation in :class:`~qiskit.circuit.library.MCMT`.

Expanded circuit:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import MCMTVChain, ZGate
   from qiskit.visualization.library import _generate_circuit_library_visualization
   circuit = MCMTVChain(ZGate(), 2, 2)
   _generate_circuit_library_visualization(circuit.decompose())

Examples:

    >>> from qiskit.circuit.library import HGate
    >>> MCMTVChain(HGate(), 3, 2).draw()

    q_0: ──■────────────────────────■──
           │                        │
    q_1: ──■────────────────────────■──
           │                        │
    q_2: ──┼────■──────────────■────┼──
           │    │  ┌───┐       │    │
    q_3: ──┼────┼──┤ H ├───────┼────┼──
           │    │  └─┬─┘┌───┐  │    │
    q_4: ──┼────┼────┼──┤ H ├──┼────┼──
         ┌─┴─┐  │    │  └─┬─┘  │  ┌─┴─┐
    q_5: ┤ X ├──■────┼────┼────■──┤ X ├
         └───┘┌─┴─┐  │    │  ┌─┴─┐└───┘
    q_6: ─────┤ X ├──■────■──┤ X ├─────
              └───┘          └───┘

### `num_ancilla_qubits`

```python
def num_ancilla_qubits(self)
```

Return the number of ancilla qubits required.

## `MCMTGate`

```python
class MCMTGate(ControlledGate)
```

The multi-controlled multi-target gate, for an arbitrary singly controlled target gate.

For example, the H gate controlled on 3 qubits and acting on 2 target qubits is represented as:

.. parsed-literal::

    ───■────
       │
    ───■────
       │
    ───■────
    ┌──┴───┐
    ┤0     ├
    │  2-H │
    ┤1     ├
    └──────┘

Depending on the number of available auxiliary qubits, this operation can be synthesized
using different methods. For example, if :math:`n - 1` clean auxiliary qubits are available
(where :math:`n` is the number of control qubits), a V-chain decomposition can be used whose
depth is linear in :math:`n`. See also :func:`.synth_mcmt_chain`.

### `__init__`

```python
def __init__(self, gate: Gate, num_ctrl_qubits: int, num_target_qubits: int, ctrl_state: int | str | None=None, label: str | None=None) -> None
```

Args:
    gate: The base gate to apply on multiple target qubits, controlled by other qubits.
        This must be a single-qubit gate or a controlled single-qubit gate.
    num_ctrl_qubits: The number of control qubits.
    num_target_qubits: The number of target qubits.
    ctrl_state: The control state of the control qubits. Defaults to all closed controls.
    label: The gate label.

### `control`

```python
def control(self, num_ctrl_qubits: int=1, label: str | None=None, ctrl_state: str | int | None=None, annotated: bool | None=None)
```

Return a controlled version of the MCMT gate.

The controlled gate is implemented as :class:`.MCMTGate`, regardless of the
value of ``annotated``.

Args:
    num_ctrl_qubits: Number of controls to add. Defaults to ``1``.
    label: Optional gate label. Defaults to ``None``.
    ctrl_state: The control state of the gate, specified either as an integer or a bitstring
        (e.g. ``"110"``). If ``None``, defaults to the all-ones state ``2**num_ctrl_qubits - 1``
    annotated: Ignored.

Returns:
    A controlled version of this gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return the inverse MCMT circuit.
