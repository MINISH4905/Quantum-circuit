---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/drop_empty_moments.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/drop_empty_moments.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/drop_empty_moments.py`

Transformer pass that removes empty moments from a circuit.

## `drop_empty_moments`

```python
def drop_empty_moments(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None) -> cirq.Circuit
```

Removes empty moments from a circuit.

Args:
      circuit: Input circuit to transform.
      context: `cirq.TransformerContext` storing common configurable options for transformers.

Returns:
      Copy of the transformed input circuit.
