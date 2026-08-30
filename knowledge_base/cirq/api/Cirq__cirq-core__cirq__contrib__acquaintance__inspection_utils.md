---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/acquaintance/inspection_utils.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/acquaintance/inspection_utils.py
license: Apache-2.0
---

## `LogicalAnnotator`

```python
class LogicalAnnotator(ExecutionStrategy)
```

Realizes acquaintance opportunities.

### `__init__`

```python
def __init__(self, initial_mapping: LogicalMapping) -> None
```

Inits LogicalAnnotator.

Args:
    initial_mapping: The initial mapping of qubits to logical indices.
