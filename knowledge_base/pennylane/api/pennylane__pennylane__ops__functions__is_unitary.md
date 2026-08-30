---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/functions/is_unitary.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/functions/is_unitary.py
license: Apache-2.0
---

## Module `pennylane/ops/functions/is_unitary.py`

This module contains the qp.is_unitary function.

## `is_unitary`

```python
def is_unitary(op: Operator)
```

Check if the operation is unitary.

A matrix is unitary if its adjoint is also its inverse, that is, if

.. math:: O^\dagger O = OO^\dagger = I

Args:
    op (~.operation.Operator): the operator to check against

Returns:
    bool: True if the operation is unitary, False otherwise

.. note::
    This check might be expensive for large operators.

**Example**

>>> op = qp.RX(0.54, wires=0)
>>> qp.is_unitary(op)
True
>>> op2 = op + op
>>> qp.is_unitary(op2)
False
