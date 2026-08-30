---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/math/single_dispatch.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/math/single_dispatch.py
license: Apache-2.0
---

## Module `pennylane/math/single_dispatch.py`

Autoray registrations

## `sparse_matrix_power`

```python
def sparse_matrix_power(A, n)
```

Dispatch to the appropriate sparse matrix power function.

## `autograd_get_dtype_name`

```python
def autograd_get_dtype_name(x)
```

A autograd version of get_dtype_name that can handle array boxes.
