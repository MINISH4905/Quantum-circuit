---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qubit/attributes.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qubit/attributes.py
license: Apache-2.0
---

## Module `pennylane/ops/qubit/attributes.py`

This file contains a number of attributes that may be held by operators,
and lists all operators satisfying those criteria.

## `Attribute`

```python
class Attribute(set)
```

Class to represent a set of operators with a certain attribute.

**Example**

Suppose we would like to store a list of which qubit operations are
Pauli operators. We can create a new ``Attribute``, ``pauli_ops``, like so,
listing which operations satisfy this property.

>>> pauli_ops = Attribute(["PauliX", "PauliZ"])

We can check either a string or an Operation for inclusion in this set:

>>> qp.X(0) in pauli_ops
True
>>> "Hadamard" in pauli_ops
False

We can also dynamically add operators to the sets at runtime, by passing
either a string, an operation class, or an operation itself. This is useful
for adding custom operations to the attributes such as
``composable_rotations`` and ``self_inverses`` that are used in compilation
transforms.

>>> pauli_ops.add("PauliY")
>>> assert len(pauli_ops) == 3

### `add`

```python
def add(self, obj)
```

Add an Operator to an attribute.

### `__contains__`

```python
def __contains__(self, obj)
```

Check if the attribute contains a given Operator.
