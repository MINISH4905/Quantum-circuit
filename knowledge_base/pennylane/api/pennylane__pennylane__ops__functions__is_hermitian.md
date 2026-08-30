---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/functions/is_hermitian.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/functions/is_hermitian.py
license: Apache-2.0
---

## Module `pennylane/ops/functions/is_hermitian.py`

This module contains the qp.is_hermitian function.

## `is_hermitian`

```python
def is_hermitian(op: Operator)
```

Check if the operation is hermitian.

A hermitian matrix is a complex square matrix that is equal to its own adjoint

.. math:: O^\dagger = O

Args:
    op (~.operation.Operator): the operator to check against

Returns:
    bool: True if the operation is hermitian, False otherwise

.. note::
    This check might be expensive for large operators.

**Example**

>>> op = qp.X(0)
>>> qp.is_hermitian(op)
True
>>> op2 = qp.RX(0.54, wires=0)
>>> qp.is_hermitian(op2)
False
