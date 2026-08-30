---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/controlledgate.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/controlledgate.py
license: Apache-2.0
---

## Module `qiskit/circuit/controlledgate.py`

Controlled unitary gate.

## `ControlledGate`

```python
class ControlledGate(Gate)
```

Controlled unitary gate.

### `__init__`

```python
def __init__(self, name: str, num_qubits: int, params: list, label: str | None=None, num_ctrl_qubits: int | None=1, definition: QuantumCircuit | None=None, ctrl_state: int | str | None=None, base_gate: Gate | None=None, *, _base_label=None)
```

Create a new ControlledGate. In the new gate the first ``num_ctrl_qubits``
of the gate are the controls.

Args:
    name: The name of the gate.
    num_qubits: The number of qubits the gate acts on.
    params: A list of parameters for the gate.
    label: An optional label for the gate.
    num_ctrl_qubits: Number of control qubits.
    definition: A list of gate rules for implementing this gate. The
        elements of the list are tuples of (:meth:`~qiskit.circuit.Gate`, [qubit_list],
        [clbit_list]).
    ctrl_state: The control state in decimal or as
        a bitstring (e.g. '111'). If specified as a bitstring the length
        must equal num_ctrl_qubits, MSB on left. If None, use
        2**num_ctrl_qubits-1.
    base_gate: Gate object to be controlled.

Raises:
    CircuitError: If ``num_ctrl_qubits`` >= ``num_qubits``.
    CircuitError: ctrl_state < 0 or ctrl_state > 2**num_ctrl_qubits.

Examples:

Create a controlled standard gate and apply it to a circuit.

.. plot::
   :alt: Circuit diagram output by the previous code.
   :include-source:

   from qiskit import QuantumCircuit, QuantumRegister
   from qiskit.circuit.library.standard_gates import HGate

   qr = QuantumRegister(3)
   qc = QuantumCircuit(qr)
   c3h_gate = HGate().control(2)
   qc.append(c3h_gate, qr)
   qc.draw('mpl')

Create a controlled custom gate and apply it to a circuit.

.. plot::
   :alt: Circuit diagram output by the previous code.
   :include-source:

   from qiskit import QuantumCircuit, QuantumRegister
   from qiskit.circuit.library.standard_gates import HGate

   qc1 = QuantumCircuit(2)
   qc1.x(0)
   qc1.h(1)
   custom = qc1.to_gate().control(2)

   qc2 = QuantumCircuit(4)
   qc2.append(custom, [0, 3, 1, 2])
   qc2.draw('mpl')

### `definition`

```python
def definition(self) -> QuantumCircuit
```

Return definition in terms of other basic gates. If the gate has
open controls, as determined from :attr:`ctrl_state`, the returned
definition is conjugated with X without changing the internal
``_definition``.

### `definition`

```python
def definition(self, excited_def: QuantumCircuit)
```

Set controlled gate definition with closed controls.

Args:
    excited_def: The circuit with all closed controls.

### `name`

```python
def name(self) -> str
```

Get name of gate. If the gate has open controls the gate name
will become:

   <original_name_o<ctrl_state>

where <original_name> is the gate name for the default case of
closed control qubits and <ctrl_state> is the integer value of
the control state for the gate.

### `name`

```python
def name(self, name_str)
```

Set the name of the gate. Note the reported name may differ
from the set name if the gate has open controls.

### `num_ctrl_qubits`

```python
def num_ctrl_qubits(self)
```

Get number of control qubits.

Returns:
    int: The number of control qubits for the gate.

### `num_ctrl_qubits`

```python
def num_ctrl_qubits(self, num_ctrl_qubits)
```

Set the number of control qubits.

Args:
    num_ctrl_qubits (int): The number of control qubits.

Raises:
    CircuitError: ``num_ctrl_qubits`` is not an integer in ``[0, num_qubits]``.

### `ctrl_state`

```python
def ctrl_state(self) -> int
```

Return the control state of the gate as a decimal integer.

### `ctrl_state`

```python
def ctrl_state(self, ctrl_state: int | str | None)
```

Set the control state of this gate.

Args:
    ctrl_state: The control state of the gate.

Raises:
    CircuitError: ctrl_state is invalid.

### `params`

```python
def params(self)
```

Get parameters from base_gate.

Returns:
    list: List of gate parameters.

Raises:
    CircuitError: Controlled gate does not define a base gate

### `params`

```python
def params(self, parameters)
```

Set base gate parameters.

Args:
    parameters (list): The list of parameters to set.

Raises:
    CircuitError: If controlled gate does not define a base gate.

### `inverse`

```python
def inverse(self, annotated: bool=False) -> ControlledGate | AnnotatedOperation
```

Invert this gate by calling inverse on the base gate.
