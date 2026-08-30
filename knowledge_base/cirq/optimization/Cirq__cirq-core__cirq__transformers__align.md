---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/align.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/align.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/align.py`

Transformer passes which align operations to the left or right of the circuit.

## `align_left`

```python
def align_left(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None) -> cirq.Circuit
```

Aligns gates to the left of the circuit.

Note that tagged operations with tag in `context.tags_to_ignore` will continue to stay in their
original position and will not be aligned.

Args:
      circuit: Input circuit to transform.
      context: `cirq.TransformerContext` storing common configurable options for transformers.

Returns:
      Copy of the transformed input circuit.

## `align_right`

```python
def align_right(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None) -> cirq.Circuit
```

Aligns gates to the right of the circuit.

Note that tagged operations with tag in `context.tags_to_ignore` will continue to stay in their
original position and will not be aligned.

Args:
      circuit: Input circuit to transform.
      context: `cirq.TransformerContext` storing common configurable options for transformers.

Returns:
      Copy of the transformed input circuit.
