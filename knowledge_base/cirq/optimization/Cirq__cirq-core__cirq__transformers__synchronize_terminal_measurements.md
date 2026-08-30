---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/synchronize_terminal_measurements.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/synchronize_terminal_measurements.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/synchronize_terminal_measurements.py`

Transformer pass to move terminal measurements to the end of circuit.

## `find_terminal_measurements`

```python
def find_terminal_measurements(circuit: cirq.AbstractCircuit) -> list[tuple[int, cirq.Operation]]
```

Finds all terminal measurements in the given circuit.

A measurement is terminal if there are no other operations acting on the measured qubits
after the measurement operation occurs in the circuit.

Args:
    circuit: The circuit to find terminal measurements in.

Returns:
    List of terminal measurements (unordered), each specified as
    (moment_index, measurement_operation).

## `synchronize_terminal_measurements`

```python
def synchronize_terminal_measurements(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, after_other_operations: bool=True) -> cirq.Circuit
```

Move measurements to the end of the circuit.

Move all measurements in a circuit to the final moment, if it can accommodate them (without
overlapping with other operations). If `after_other_operations` is true, then a new moment will
be added to the end of the circuit containing all the measurements that should be brought
forward.

Args:
      circuit: Input circuit to transform.
      context: `cirq.TransformerContext` storing common configurable options for transformers.
      after_other_operations: Set by default. If the circuit's final moment contains
            non-measurement operations and this is set then a new empty moment is appended to
            the circuit before pushing measurements to the end.
Returns:
      Copy of the transformed input circuit.
