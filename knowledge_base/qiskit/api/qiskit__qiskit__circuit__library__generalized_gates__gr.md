---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/gr.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/gr.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/gr.py`

Global R gates.

## `GR`

```python
class GR(QuantumCircuit)
```

Global R gate.

Circuit symbol:

.. code-block:: text

         ┌──────────┐
    q_0: ┤0         ├
         │          │
    q_1: ┤1 GR(ϴ,φ) ├
         │          │
    q_2: ┤2         ├
         └──────────┘

The global R gate is native to atomic systems (ion traps, cold neutrals). The global R
can be applied to multiple qubits simultaneously.

In the one-qubit case, this is equivalent to an R(theta, phi) operation,
and is thus reduced to the RGate. The global R gate is a direct sum of R
operations on all individual qubits.

.. math::

    GR(\theta, \phi) = \exp(-i \sum_{i=1}^{n} (\cos(\phi)X_i + \sin(\phi)Y_i) \theta/2)

Expanded Circuit:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import GR
   from qiskit.visualization.library import _generate_circuit_library_visualization
   import numpy as np
   circuit = GR(num_qubits=3, theta=np.pi/4, phi=np.pi/2)
   _generate_circuit_library_visualization(circuit)

### `__init__`

```python
def __init__(self, num_qubits: int, theta: float, phi: float) -> None
```

Args:
    num_qubits: number of qubits.
    theta: rotation angle about axis determined by phi
    phi: angle of rotation axis in xy-plane

## `GRX`

```python
class GRX(GR)
```

Global RX gate.

**Circuit symbol:**

.. code-block:: text

         ┌──────────┐
    q_0: ┤0         ├
         │          │
    q_1: ┤1  GRX(ϴ) ├
         │          │
    q_2: ┤2         ├
         └──────────┘

The global RX gate is native to atomic systems (ion traps, cold neutrals). The global RX
can be applied to multiple qubits simultaneously.

In the one-qubit case, this is equivalent to an RX(theta) operation,
and is thus reduced to the RXGate. The global RX gate is a direct sum of RX
operations on all individual qubits.

.. math::

    GRX(\theta) = \exp(-i \sum_{i=1}^{n} X_i \theta/2)

**Expanded Circuit:**

.. plot::
   :alt: Diagram illustrating the previously described circuit.

    from qiskit.circuit.library import GRX
    from qiskit.visualization.library import _generate_circuit_library_visualization
    import numpy as np
    circuit = GRX(num_qubits=3, theta=np.pi/4)
    _generate_circuit_library_visualization(circuit)

### `__init__`

```python
def __init__(self, num_qubits: int, theta: float) -> None
```

Create a new Global RX (GRX) gate.

Args:
    num_qubits: number of qubits.
    theta: rotation angle about x-axis

## `GRY`

```python
class GRY(GR)
```

Global RY gate.

**Circuit symbol:**

.. code-block:: text

         ┌──────────┐
    q_0: ┤0         ├
         │          │
    q_1: ┤1  GRY(ϴ) ├
         │          │
    q_2: ┤2         ├
         └──────────┘

The global RY gate is native to atomic systems (ion traps, cold neutrals). The global RY
can be applied to multiple qubits simultaneously.

In the one-qubit case, this is equivalent to an RY(theta) operation,
and is thus reduced to the RYGate. The global RY gate is a direct sum of RY
operations on all individual qubits.

.. math::

    GRY(\theta) = \exp(-i \sum_{i=1}^{n} Y_i \theta/2)

**Expanded Circuit:**

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import GRY
   from qiskit.visualization.library import _generate_circuit_library_visualization
   import numpy as np
   circuit = GRY(num_qubits=3, theta=np.pi/4)
   _generate_circuit_library_visualization(circuit)

### `__init__`

```python
def __init__(self, num_qubits: int, theta: float) -> None
```

Create a new Global RY (GRY) gate.

Args:
    num_qubits: number of qubits.
    theta: rotation angle about y-axis

## `GRZ`

```python
class GRZ(QuantumCircuit)
```

Global RZ gate.

**Circuit symbol:**

.. code-block:: text

         ┌──────────┐
    q_0: ┤0         ├
         │          │
    q_1: ┤1  GRZ(φ) ├
         │          │
    q_2: ┤2         ├
         └──────────┘

The global RZ gate is native to atomic systems (ion traps, cold neutrals). The global RZ
can be applied to multiple qubits simultaneously.

In the one-qubit case, this is equivalent to an RZ(phi) operation,
and is thus reduced to the RZGate. The global RZ gate is a direct sum of RZ
operations on all individual qubits.

.. math::

    GRZ(\phi) = \exp(-i \sum_{i=1}^{n} Z_i \phi)

**Expanded Circuit:**

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import GRZ
   from qiskit.visualization.library import _generate_circuit_library_visualization
   import numpy as np
   circuit = GRZ(num_qubits=3, phi=np.pi/2)
   _generate_circuit_library_visualization(circuit)

### `__init__`

```python
def __init__(self, num_qubits: int, phi: float) -> None
```

Create a new Global RZ (GRZ) gate.

Args:
    num_qubits: number of qubits.
    phi: rotation angle about z-axis
