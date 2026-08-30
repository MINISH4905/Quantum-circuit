---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/routing/mapping_manager_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/routing/mapping_manager_test.py
license: Apache-2.0
---

## `construct_directed_device_graph_and_mapping`

```python
def construct_directed_device_graph_and_mapping() -> tuple[nx.DiGraph, dict[cirq.Qid, cirq.Qid], Sequence[cirq.Qid]]
```

Return a directed device graph with bidirectional 0<->1 and directed 1->2 edges.
