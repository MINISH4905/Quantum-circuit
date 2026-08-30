---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/tag_transformers.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/tag_transformers.py
license: Apache-2.0
---

## `index_tags`

```python
def index_tags(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, target_tags: set[Hashable] | None=None) -> cirq.Circuit
```

Indexes tags in target_tags as tag_0, tag_1, ... per tag.

Args:
    circuit: Input circuit to apply the transformations on. The input circuit is not mutated.
    context: `cirq.TransformerContext` storing common configurable options for transformers.
    target_tags: Tags to be indexed.

Returns:
    Copy of the transformed input circuit.

## `remove_tags`

```python
def remove_tags(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, target_tags: set[Hashable] | None=None, remove_if: Callable[[Hashable], bool]=lambda _: False) -> cirq.Circuit
```

Removes tags from the operations based on the input args.

Args:
    circuit: Input circuit to apply the transformations on. The input circuit is not mutated.
    context: `cirq.TransformerContext` storing common configurable options for transformers.
    target_tags: Tags to be removed.
    remove_if: A callable(tag) that returns True if the tag should be removed.
      Defaults to False.

Returns:
    Copy of the transformed input circuit.
