---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/gms.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/gms.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/gms.py`

Global Mølmer–Sørensen gate.

## `GMS`

```python
class GMS(QuantumCircuit)
```

Global Mølmer–Sørensen gate.

Circuit symbol:

.. code-block:: text

         ┌───────────┐
    q_0: ┤0          ├
         │           │
    q_1: ┤1   GMS    ├
         │           │
    q_2: ┤2          ├
         └───────────┘

Expanded Circuit:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import GMS
   from qiskit.visualization.library import _generate_circuit_library_visualization
   import numpy as np
   circuit = GMS(num_qubits=3, theta=[[0, np.pi/4, np.pi/8],
                                      [0, 0, np.pi/2],
                                      [0, 0, 0]])
   _generate_circuit_library_visualization(circuit.decompose())

The Mølmer–Sørensen gate is native to ion-trap systems. The global MS
can be applied to multiple ions to entangle multiple qubits simultaneously [1].

In the two-qubit case, this is equivalent to an XX(theta) interaction,
and is thus reduced to the RXXGate. The global MS gate is a sum of XX
interactions on all pairs [2].

.. math::

    GMS(\chi_{12}, \chi_{13}, ..., \chi_{n-1 n}) =
    exp(-i \sum_{i=1}^{n} \sum_{j=i+1}^{n} X{\otimes}X \frac{\chi_{ij}}{2})

References:

[1] Sørensen, A. and Mølmer, K., Multi-particle entanglement of hot trapped ions.
Physical Review Letters. 82 (9): 1835–1838.
`arXiv:9810040 <https://arxiv.org/abs/quant-ph/9810040>`_

[2] Maslov, D. and Nam, Y., Use of global interactions in efficient quantum circuit
constructions. New Journal of Physics, 20(3), p.033018.
`arXiv:1707.06356 <https://arxiv.org/abs/1707.06356>`_

### `__init__`

```python
def __init__(self, num_qubits: int, theta: list[list[float]] | np.ndarray) -> None
```

Args:
    num_qubits: width of gate.
    theta: a num_qubits x num_qubits symmetric matrix of
        interaction angles for each qubit pair. The upper
        triangle is considered.

## `MSGate`

```python
class MSGate(Gate)
```

The Mølmer–Sørensen gate.

The Mølmer–Sørensen gate is native to ion-trap systems. The global MS
can be applied to multiple ions to entangle multiple qubits simultaneously [1].

In the two-qubit case, this is equivalent to an XX interaction,
and is thus reduced to the :class:`.RXXGate`. The global MS gate is a sum of XX
interactions on all pairs [2].

.. math::

    MS(\chi_{12}, \chi_{13}, ..., \chi_{n-1 n}) =
    exp(-i \sum_{i=1}^{n} \sum_{j=i+1}^{n} X{\otimes}X \frac{\chi_{ij}}{2})

Example::

    import numpy as np
    from qiskit.circuit.library import MSGate
    from qiskit.quantum_info import Operator

    gate = MSGate(num_qubits=3, theta=[[0, np.pi/4, np.pi/8],
                                       [0, 0, np.pi/2],
                                       [0, 0, 0]])
    print(Operator(gate))


References:

[1] Sørensen, A. and Mølmer, K., Multi-particle entanglement of hot trapped ions.
Physical Review Letters. 82 (9): 1835–1838.
`arXiv:9810040 <https://arxiv.org/abs/quant-ph/9810040>`_

[2] Maslov, D. and Nam, Y., Use of global interactions in efficient quantum circuit
constructions. New Journal of Physics, 20(3), p.033018.
`arXiv:1707.06356 <https://arxiv.org/abs/1707.06356>`_

### `__init__`

```python
def __init__(self, num_qubits: int, theta: ParameterValueType | Sequence[Sequence[ParameterValueType]], label: str | None=None)
```

Args:
    num_qubits: The number of qubits the MS gate acts on.
    theta: The XX rotation angles. If a single value, the same angle is used on all
        interactions. Alternatively an upper-triangular, square matrix with width
        ``num_qubits`` can be provided with interaction angles for each qubit pair.
    label: A gate label.
