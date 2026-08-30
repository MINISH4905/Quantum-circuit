---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/controlled_decompositions.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/controlled_decompositions.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/controlled_decompositions.py`

This submodule defines functions to decompose controlled operations

## `decompose_mcx`

```python
def decompose_mcx(control_wires, target_wire, work_wires, work_wire_type: Literal['zeroed', 'borrowed']='borrowed')
```

Decomposes the multi-controlled PauliX
