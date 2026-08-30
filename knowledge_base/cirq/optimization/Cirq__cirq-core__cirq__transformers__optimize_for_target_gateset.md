---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/optimize_for_target_gateset.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/optimize_for_target_gateset.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/optimize_for_target_gateset.py`

Transformers to rewrite a circuit using gates from a given target gateset.

## `optimize_for_target_gateset`

```python
def optimize_for_target_gateset(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, gateset: cirq.CompilationTargetGateset | None=None, ignore_failures: bool=True, max_num_passes: int | None=1) -> cirq.Circuit
```

Transforms the given circuit into an equivalent circuit using gates accepted by `gateset`.

Repeat max_num_passes times or when `max_num_passes=None` until no further changes can be done
1. Run all `gateset.preprocess_transformers`
2. Convert operations using built-in cirq decompose + `gateset.decompose_to_target_gateset`.
3. Run all `gateset.postprocess_transformers`

Note:
    The optimizer is a heuristic and may not produce optimal results even with
    max_num_passes=None. The preprocessors and postprocessors of the gate set
    as well as their order yield different results.


Args:
    circuit: Input circuit to transform. It will not be modified.
    context: `cirq.TransformerContext` storing common configurable options for transformers.
    gateset: Target gateset, which should be an instance of `cirq.CompilationTargetGateset`.
    ignore_failures: If set, operations that fail to convert are left unchanged. If not set,
        conversion failures raise a ValueError.
    max_num_passes: The maximum number of passes to do. A value of `None` means to keep
        iterating until no more changes happen to the number of moments or operations.

Returns:
    An equivalent circuit containing gates accepted by `gateset`.

Raises:
    ValueError: If any input operation fails to convert and `ignore_failures` is False.
