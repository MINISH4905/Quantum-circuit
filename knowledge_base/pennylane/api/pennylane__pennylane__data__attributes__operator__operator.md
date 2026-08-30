---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/attributes/operator/operator.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/attributes/operator/operator.py
license: Apache-2.0
---

## Module `pennylane/data/attributes/operator/operator.py`

Contains DatasetAttribute definition for pennylane operators, and lists
of operators.

## `DatasetOperator`

```python
class DatasetOperator(Generic[Op], DatasetAttribute[HDF5Group, Op, Op])
```

``DatasetAttribute`` for ``pennylane.operation.Operator`` classes.

Supports all operator types that meet the following conditions:
    - The ``__init__()`` method matches the signature of ``Operator.__init__``,
        or any additional arguments are optional and do not affect the value of
        the operator
    - The ``data`` and ``wires`` attributes will produce an identical copy of
        operator if passed into the classes' ``__init__()`` method. Generally,
        this means ``__init__()`` do not mutate the ``identifiers`` and ``wires``
        arguments.
    - Hyperparameters are not used or are automatically derived by ``__init__()``.

### `supported_ops`

```python
def supported_ops(cls) -> frozenset[type[Operator]]
```

Set of supported operators.
