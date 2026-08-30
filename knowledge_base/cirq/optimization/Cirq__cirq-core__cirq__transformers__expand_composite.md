---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/expand_composite.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/expand_composite.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/expand_composite.py`

Transformer pass that expands composite operations via `cirq.decompose`.

## `expand_composite`

```python
def expand_composite(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, no_decomp: Callable[[ops.Operation], bool]=lambda _: False) -> cirq.Circuit
```

A transformer that expands composite operations via `cirq.decompose`.

For each operation in the circuit, this pass examines if the operation can
be decomposed. If it can be, the operation is cleared out and replaced
with its decomposition using a fixed insertion strategy.

Transformation is applied using `cirq.map_operations_and_unroll`, which preserves the
moment structure of the input circuit.

Args:
      circuit: Input circuit to transform.
      context: `cirq.TransformerContext` storing common configurable options for transformers.
      no_decomp: A predicate that determines whether an operation should
            be decomposed or not. Defaults to decomposing everything.
Returns:
      Copy of the transformed input circuit.
