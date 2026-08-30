---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/intermediate_reps/parity_matrix.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/intermediate_reps/parity_matrix.py
license: Apache-2.0
---

## Module `pennylane/transforms/intermediate_reps/parity_matrix.py`

Parity matrix representation

## `parity_matrix`

```python
def parity_matrix(circ: QuantumScript, wire_order: Sequence | None=None) -> tuple[TensorLike, PostprocessingFn]
```

Compute the `parity matrix intermediate representation <https://pennylane.ai/compilation/parity-matrix-intermediate-representation>`__ of a CNOT circuit.

Args:
    circ (QNode or QuantumScript or Callable): Quantum circuit containing only ``CNOT`` gates.
    wire_order (Sequence): Indicates how rows and columns should be ordered. If ``None`` is provided, uses the wires of the input circuit (``tape.wires``).

Returns:
    TensorLike:
        :math:`n \times n` Parity matrix for :math:`n` qubits. In the case of inputting a callable function,
        a new callable with the same call signature is returned (see :func:`pennylane.transform`).

**Example**

.. code-block:: python

    import pennylane as qp
    from pennylane.transforms import parity_matrix

    def circuit():
        qp.CNOT((3, 2))
        qp.CNOT((0, 2))
        qp.CNOT((2, 1))
        qp.CNOT((3, 2))
        qp.CNOT((3, 0))
        qp.CNOT((0, 2))

>>> parity_matrix(circuit, wire_order=range(4))()
array([[1, 0, 0, 1],
       [1, 1, 1, 1],
       [0, 0, 1, 1],
       [0, 0, 0, 1]])

The corresponding circuit is the following, with output values of the qubits denoted at the right end.

.. code-block::

    x_0: ────╭●───────╭X─╭●─┤  x_0 ⊕ x_3
    x_1: ────│──╭X────│──│──┤  x_0 ⊕ x_1 ⊕ x_2 ⊕ x_3
    x_2: ─╭X─╰X─╰●─╭X─│──╰X─┤  x_2 ⊕ x_3
    x_3: ─╰●───────╰●─╰●────┤  x_3

For more details, see the `compilation page <https://pennylane.ai/compilation/parity-matrix-intermediate-representation>`__ on the parity matrix intermediate representation.
