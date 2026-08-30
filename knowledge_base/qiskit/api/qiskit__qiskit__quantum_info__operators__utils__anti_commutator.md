---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/utils/anti_commutator.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/utils/anti_commutator.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/utils/anti_commutator.py`

Anti commutator function.

## `anti_commutator`

```python
def anti_commutator(a: OperatorTypeT, b: OperatorTypeT) -> OperatorTypeT
```

Compute anti-commutator of a and b.

.. math::

    ab + ba.

Args:
    a: Operator a.
    b: Operator b.
Returns:
    The anti-commutator
