---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/diagonal_optimization.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/diagonal_optimization.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/diagonal_optimization.py`

Transformer pass that removes diagonal gates before measurements.

## `drop_diagonal_before_measurement`

```python
def drop_diagonal_before_measurement(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None) -> cirq.Circuit
```

Removes Z and CZ gates that appear immediately before measurements.

This transformer optimizes circuits by removing Z-type and CZ-type diagonal gates
(specifically ZPowGate instances like Z, S, T, Rz, and CZPowGate instances like CZ)
that appear immediately before measurement operations. Since measurements project onto
the computational basis, these diagonal gates applied immediately before a measurement
do not affect the measurement outcome and can be safely removed (when all their qubits
are measured).

To maximize the effectiveness of this optimization, the transformer first applies
the `eject_z` transformation, which pushes Z gates (and other diagonal phases)
later in the circuit. This handles cases where diagonal gates can commute past
other operations. For example:

    Z(q0) - CZ(q0, q1) - measure(q0) - measure(q1)

After `eject_z`, the Z gate on the control qubit commutes through the CZ:

    CZ(q0, q1) - Z(q1) - measure(q0) - measure(q1)

Then both the CZ and Z(q1) can be removed since all their qubits are measured:

    measure(q0) - measure(q1)

Args:
    circuit: Input circuit to transform.
    context: `cirq.TransformerContext` storing common configurable options for transformers.

Returns:
    Copy of the transformed input circuit with diagonal gates before measurements removed.

Examples:
    >>> import cirq
    >>> q0, q1 = cirq.LineQubit.range(2)
    >>>
    >>> # Simple case: Z before measurement
    >>> circuit = cirq.Circuit(cirq.H(q0), cirq.Z(q0), cirq.measure(q0))
    >>> optimized = cirq.drop_diagonal_before_measurement(circuit)
    >>> print(optimized)
    0: ───H───M───

    >>> # Complex case: Z-CZ commutation with both qubits measured
    >>> circuit = cirq.Circuit(
    ...     cirq.Z(q0),
    ...     cirq.CZ(q0, q1),
    ...     cirq.measure(q0),
    ...     cirq.measure(q1)
    ... )
    >>> optimized = cirq.drop_diagonal_before_measurement(circuit)
    >>> print(optimized)
    0: ───M───
    <BLANKLINE>
    1: ───M───
