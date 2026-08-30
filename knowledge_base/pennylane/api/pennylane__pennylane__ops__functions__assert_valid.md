---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/functions/assert_valid.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/functions/assert_valid.py
license: Apache-2.0
---

## Module `pennylane/ops/functions/assert_valid.py`

This module contains the qp.ops.functions.check_validity function for determining whether or not an
Operator class is correctly defined.

## `assert_valid`

```python
def assert_valid(op: qp.operation.Operator, *, skip_deepcopy=False, skip_differentiation=False, skip_new_decomp=False, skip_decomp_matrix_check=False, skip_pickle=False, skip_wire_mapping=False, skip_capture=False) -> None
```

Runs basic validation checks on an :class:`~.operation.Operator` to make
sure it has been correctly defined.

Args:
    op (.Operator): an operator instance to validate

Keyword Args:
    skip_deepcopy=False: If ``True``, deepcopy tests are not run.
    skip_differentiation=False: If ``True``, differentiation tests are not run.
    skip_new_decomp: If ``True``, the operator will not be tested for its decomposition
        defined using the new system.
    skip_decomp_matrix_check: If ``True``, the decomposition rule check will only
        verify that the produced operators match the resource function, and does not
        test that the matrix of the decomposition matches the operator itself.
    skip_pickle=False : If ``True``, pickling tests are not run. Set to ``True`` when
        testing a locally defined operator, as pickle cannot handle local objects
    skip_wire_mapping : If ``True``, the operator will not be tested for wire mapping.
    skip_capture: If ``True``, the program capture tests will be skipped.

**Examples:**

.. code-block:: python

    class MyOp(qp.operation.Operator):

        def __init__(self, data, wires):
            self.data = data
            super().__init__(wires=wires)

    op = MyOp(qp.numpy.array(0.5), wires=0)

>>> assert_valid(op)
Traceback (most recent call last):
    ...
AssertionError: MyOp._unflatten must be able to reproduce the original operation from () and (Wires([0]), ()). You may need to override either the _unflatten or _flatten method.
For local testing, try type(op)._unflatten(*op._flatten())

.. code-block:: python

    class MyOp(qp.operation.Operator):

        def __init__(self, wires):
            self.hyperparameters["unhashable_list"] = []
            super().__init__(wires=wires)

    op = MyOp(wires = 0)

>>> assert_valid(op)
Traceback (most recent call last):
    ...
AssertionError: metadata output from _flatten must be hashable. Got metadata (Wires([0]), (('unhashable_list', []),))
