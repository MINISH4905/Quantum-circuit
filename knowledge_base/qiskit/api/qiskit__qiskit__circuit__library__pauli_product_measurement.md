---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/pauli_product_measurement.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/pauli_product_measurement.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/pauli_product_measurement.py`

An instruction to implement a Pauli Product Measurement.

## `PauliProductMeasurement`

```python
class PauliProductMeasurement(Instruction)
```

Pauli Product Measurement instruction.

A Pauli Product Measurement is a fundamental operation in fault-tolerant quantum
computing. Mathematically, it corresponds to a joint projective measurement on
multiple qubits, where the measured observable is a tensor product of Pauli operators.
The outcome of this measurement is a single eigenvalue, either :math:`+1` or :math:`-1`,
indicating the eigenstate of the Pauli product.

References:

[1] Daniel Litinski.
"A Game of Surface Codes: Large-Scale Quantum Computing with Lattice Surgery"
`arXiv:1808.02892 <https://arxiv.org/abs/1808.02892>`__

### `__init__`

```python
def __init__(self, pauli: qiskit.quantum_info.Pauli, label: str | None=None)
```

Args:
    pauli: A tensor product of Pauli operators defining the measurement,
        for example ``Pauli("XY")`` or ``Pauli("-XYIZ")``.
        The identity Pauli operator is not permitted.
        The Pauli may include a phase of :math:`-1`, but not :math:`i` or :math:`-i`.
    label: An optional label for the gate to display in circuit visualizations.
        By default, the label is set to ``PPM(<pauli label>)``.

.. note::

    While Paulis involving ``"I"``-terms are fully supported, it is recommended to remove
    ``"I"``-terms from the Pauli when creating a ``PauliProductMeasurement`` instruction,
    as this does not change the actual measurement but specifies the instruction over
    a smaller set of qubits.

Raises:
    CircuitError: If the Pauli is the all identity operator, has size 0, or a complex
        phase.

### `inverse`

```python
def inverse(self, annotated=False)
```

Prevents from calling ``inverse`` on a PauliProductMeasurement instruction.

### `pauli`

```python
def pauli(self) -> Pauli
```

Return the Pauli product implemented by this measurement.

This is a public accessor that reconstructs and returns the
:class:`~qiskit.quantum_info.Pauli` corresponding to this
instruction's underlying tensor product of Pauli operators,
including its global phase of ``+1`` or ``-1``.

Returns:
    The Pauli product measured by this instruction.
