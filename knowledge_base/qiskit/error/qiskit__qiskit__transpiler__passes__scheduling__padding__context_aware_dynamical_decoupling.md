---
framework: qiskit
api_version: 2.5.2
doc_type: error
source_path: qiskit/transpiler/passes/scheduling/padding/context_aware_dynamical_decoupling.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/scheduling/padding/context_aware_dynamical_decoupling.py
license: Apache-2.0
---

## Error surface of `qiskit/transpiler/passes/scheduling/padding/context_aware_dynamical_decoupling.py`

### Validation

### `AdjacentDelayBlock.validate`

```python
def validate(self, log: bool=True) -> None
```

Validate the list of delay events in the adjacent block.

Args:
    log: If ``True`` log invalid blocks on DEBUG level. Otherwise raise an error if the
        block is invalid.

Raises:
    RuntimeError: If the blocks are not ordered by time and event type.
