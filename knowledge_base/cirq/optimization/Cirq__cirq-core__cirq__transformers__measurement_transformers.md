---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/measurement_transformers.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/measurement_transformers.py
license: Apache-2.0
---

## `defer_measurements`

```python
def defer_measurements(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None) -> cirq.Circuit
```

Implements the Deferred Measurement Principle.

Uses the Deferred Measurement Principle to move all measurements to the
end of the circuit. All non-terminal measurements are changed to
conditional quantum gates onto ancilla qubits, and classically controlled
operations are transformed to quantum controls from those ancilla qubits.
Finally, measurements of all ancilla qubits are appended to the end of the
circuit.

Optimizing deferred measurements is an area of active research, and future
iterations may contain optimizations that reduce the number of ancilla
qubits, so one should not depend on the exact shape of the output from this
function. Only the logical equivalence is guaranteed to remain unchanged.
Moment and subcircuit structure is not preserved.

Args:
    circuit: The circuit to transform. It will not be modified.
    context: `cirq.TransformerContext` storing common configurable options
        for transformers.
Returns:
    A circuit with equivalent logic, but all measurements at the end of the
    circuit.
Raises:
    NotImplementedError: When attempting to defer a measurement with a
        confusion map. (https://github.com/quantumlib/Cirq/issues/5482)

## `dephase_measurements`

```python
def dephase_measurements(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=transformer_api.TransformerContext(deep=True)) -> cirq.Circuit
```

Changes all measurements to a dephase operation.

This transformer is useful when using a density matrix simulator, when
wishing to calculate the final density matrix of a circuit and not simulate
the measurements themselves.

Args:
    circuit: The circuit to transform. It will not be modified.
    context: `cirq.TransformerContext` storing common configurable options
        for transformers. The default has `deep=True` to ensure
        measurements at all levels are dephased.
Returns:
    A copy of the circuit, with dephase operations in place of all
    measurements.
Raises:
    ValueError: If the circuit contains classical controls. In this case,
        it is required to change these to quantum controls via
        `cirq.defer_measurements` first. Since deferral adds ancilla qubits
        to the circuit, this is not done automatically, to prevent
        surprises.

## `drop_terminal_measurements`

```python
def drop_terminal_measurements(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=transformer_api.TransformerContext(deep=True)) -> cirq.Circuit
```

Removes terminal measurements from a circuit.

This transformer is helpful when trying to capture the final state vector
of a circuit with many terminal measurements, as simulating the circuit
with those measurements in place would otherwise collapse the final state.

Args:
    circuit: The circuit to transform. It will not be modified.
    context: `cirq.TransformerContext` storing common configurable options
        for transformers. The default has `deep=True`, as "terminal
        measurements" is ill-defined without inspecting subcircuits;
        passing a context with `deep=False` will return an error.
Returns:
    A copy of the circuit, with identity or X gates in place of terminal
    measurements.
Raises:
    ValueError: if the circuit contains non-terminal measurements, or if
        the provided context has`deep=False`.
