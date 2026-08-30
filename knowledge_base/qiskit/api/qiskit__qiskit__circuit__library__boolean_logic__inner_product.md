---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/boolean_logic/inner_product.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/boolean_logic/inner_product.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/boolean_logic/inner_product.py`

InnerProduct circuit and gate.

## `InnerProduct`

```python
class InnerProduct(QuantumCircuit)
```

A 2n-qubit Boolean function that computes the inner product of
two n-qubit vectors over :math:`F_2`.

This implementation is a phase oracle which computes the following transform.

.. math::

    \mathcal{IP}_{2n} : F_2^{2n} \rightarrow {-1, 1}
    \mathcal{IP}_{2n}(x_1, \cdots, x_n, y_1, \cdots, y_n) = (-1)^{x.y}

The corresponding unitary is a diagonal, which induces a -1 phase on any inputs
where the inner product of the top and bottom registers is 1. Otherwise it keeps
the input intact.

.. code-block:: text


    q0_0: ─■──────────
           │
    q0_1: ─┼──■───────
           │  │
    q0_2: ─┼──┼──■────
           │  │  │
    q0_3: ─┼──┼──┼──■─
           │  │  │  │
    q1_0: ─■──┼──┼──┼─
              │  │  │
    q1_1: ────■──┼──┼─
                 │  │
    q1_2: ───────■──┼─
                    │
    q1_3: ──────────■─


Reference Circuit:
    .. plot::
       :alt: Diagram illustrating the previously described circuit.

       from qiskit.circuit.library import InnerProduct
       from qiskit.visualization.library import _generate_circuit_library_visualization
       circuit = InnerProduct(4)
       _generate_circuit_library_visualization(circuit)

### `__init__`

```python
def __init__(self, num_qubits: int) -> None
```

Args:
    num_qubits: width of top and bottom registers (half total circuit width)

## `InnerProductGate`

```python
class InnerProductGate(Gate)
```

A 2n-qubit Boolean function that computes the inner product of
two n-qubit vectors over :math:`F_2`.

This implementation is a phase oracle which computes the following transform.

.. math::

    \mathcal{IP}_{2n} : F_2^{2n} \rightarrow {-1, 1}
    \mathcal{IP}_{2n}(x_1, \cdots, x_n, y_1, \cdots, y_n) = (-1)^{x.y}

The corresponding unitary is a diagonal, which induces a -1 phase on any inputs
where the inner product of the top and bottom registers is 1. Otherwise, it keeps
the input intact.

.. parsed-literal::


    q0_0: ─■──────────
           │
    q0_1: ─┼──■───────
           │  │
    q0_2: ─┼──┼──■────
           │  │  │
    q0_3: ─┼──┼──┼──■─
           │  │  │  │
    q1_0: ─■──┼──┼──┼─
              │  │  │
    q1_1: ────■──┼──┼─
                 │  │
    q1_2: ───────■──┼─
                    │
    q1_3: ──────────■─


Reference Circuit:
    .. plot::
       :alt: Diagram illustrating the previously described circuit.

       from qiskit.circuit import QuantumCircuit
       from qiskit.circuit.library import InnerProductGate
       from qiskit.visualization.library import _generate_circuit_library_visualization
       circuit = QuantumCircuit(8)
       circuit.append(InnerProductGate(4), [0, 1, 2, 3, 4, 5, 6, 7])
       _generate_circuit_library_visualization(circuit)

### `__init__`

```python
def __init__(self, num_qubits: int) -> None
```

Args:
    num_qubits: width of top and bottom registers (half total number of qubits).
