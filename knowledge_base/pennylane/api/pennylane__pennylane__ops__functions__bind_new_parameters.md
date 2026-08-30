---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/functions/bind_new_parameters.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/functions/bind_new_parameters.py
license: Apache-2.0
---

## Module `pennylane/ops/functions/bind_new_parameters.py`

This module contains the qp.bind_new_parameters function.

## `bind_new_parameters`

```python
def bind_new_parameters(op: Operator, params: Sequence[TensorLike]) -> Operator
```

Create a new operator with updated parameters

This function takes an :class:`~.Operator` and new parameters as input and
returns a new operator of the same type with the new parameters. This function
does not mutate the original operator.

Args:
    op (.Operator): Operator to update
    params (Sequence[TensorLike]): New parameters to create operator with. This
        must have the same shape as `op.data`.

Returns:
    .Operator: New operator with updated parameters
