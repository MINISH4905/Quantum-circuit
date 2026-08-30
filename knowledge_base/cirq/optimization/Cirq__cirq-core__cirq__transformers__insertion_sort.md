---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/insertion_sort.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/insertion_sort.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/insertion_sort.py`

Transformer that sorts commuting operations in increasing order of their `.qubits` tuple.

## `insertion_sort_transformer`

```python
def insertion_sort_transformer(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None) -> cirq.Circuit
```

Sorts the operations using their sorted `.qubits` property as comparison key.

Operations are swapped only if they commute.

Args:
    circuit: input circuit.
    context: optional TransformerContext (not used),
