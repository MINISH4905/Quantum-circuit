---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/stratify.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/stratify.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/stratify.py`

Transformer pass to repack circuits avoiding simultaneous operations with different classes.

## `stratified_circuit`

```python
def stratified_circuit(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, categories: Iterable[Category]=()) -> cirq.Circuit
```

Repacks avoiding simultaneous operations with different classes.

This transforms the given circuit to ensure that no operations of different categories are
found in the same moment. Makes no optimality guarantees.
Tagged Operations marked with any of `context.tags_to_ignore` will be treated as a separate
category will be left in their original moments without stratification.

Args:
    circuit: The circuit whose operations should be re-arranged. Will not be modified.
    context: `cirq.TransformerContext` storing common configurable options for transformers.
    categories: A list of classifiers picking out certain operations. There are several ways
        to specify a classifier. You can pass in a gate instance (e.g. `cirq.X`),
        a gate type (e.g. `cirq.XPowGate`), an operation instance
        (e.g. `cirq.X(cirq.LineQubit(0))`), an operation type (e.g.`cirq.CircuitOperation`),
        or an arbitrary operation predicate (e.g. `lambda op: len(op.qubits) == 2`).

Returns:
    A copy of the original circuit, but with re-arranged operations.
