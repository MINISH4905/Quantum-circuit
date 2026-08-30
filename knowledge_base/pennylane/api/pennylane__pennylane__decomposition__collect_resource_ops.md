---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/decomposition/collect_resource_ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/decomposition/collect_resource_ops.py
license: Apache-2.0
---

## Module `pennylane/decomposition/collect_resource_ops.py`

Defines an interpreter that extracts a set of resource reps from a plxpr

## `CollectResourceOps`

```python
class CollectResourceOps(FlattenedInterpreter)
```

Collects a set of unique resource ops from a plxpr.

## `handle_qnode`

```python
def handle_qnode(self, *invals, shots_len, qnode, device, execution_config, qfunc_jaxpr, n_consts)
```

Handle a qnode primitive.

## `explore_all_branches`

```python
def explore_all_branches(self, *invals, jaxpr_branches, consts_slices, args_slice)
```

Handle the cond primitive by a flattened python strategy.
