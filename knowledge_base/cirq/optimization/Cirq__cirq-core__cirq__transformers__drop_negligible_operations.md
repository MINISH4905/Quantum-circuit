---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/drop_negligible_operations.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/drop_negligible_operations.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/drop_negligible_operations.py`

Transformer pass that removes operations with tiny effects.

## `drop_negligible_operations`

```python
def drop_negligible_operations(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, atol: float=1e-08) -> cirq.Circuit
```

Removes operations with tiny effects.

An operation `op` is considered to have a tiny effect if
`cirq.trace_distance_bound(op) <= atol`.

Args:
      circuit: Input circuit to transform.
      context: `cirq.TransformerContext` storing common configurable options for transformers.
      atol: Absolute tolerance to determine if an operation `op` is negligible --
            i.e. if `cirq.trace_distance_bound(op) <= atol`.

Returns:
      Copy of the transformed input circuit.
