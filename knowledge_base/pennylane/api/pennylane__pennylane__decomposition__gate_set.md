---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/decomposition/gate_set.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/decomposition/gate_set.py
license: Apache-2.0
---

## Module `pennylane/decomposition/gate_set.py`

This module contains definitions of the GateSet data structure.

## `GateSet`

```python
class GateSet(Mapping)
```

Stores the target gate set of a decomposition pass.

Args:
    gate_set (Iterable | Mapping): the contents
    name (str): a shorthand to use in the str and repr

While the ``decompose`` transform can accept any iterable for it's ``gate_set``
argument, the ``GateSet`` class provides some helpful tools.
This includes a ``name`` argument for improved inspection and condensed reprs,
immutability for improved protection when used as a global variable, and conversion
between class and string based representations of operators.

We can create a gateset using both :class:`~.Operator` subclasses or strings, and use
both classes and strings to check inclusion in the gateset

>>> from pennylane.decomposition import GateSet
>>> gateset = GateSet({"X", qp.RX, "Adjoint(RX)"})
>>> gateset
GateSet({Adjoint(RX), PauliX, RX})
>>> qp.X in gateset
True
>>> "RX" in gateset
True

We can also provide a ``name`` for improved inspection.

>>> gateset_name = GateSet({qp.RX, qp.RY, qp.RZ}, name="Rotations")
>>> print(gateset_name)
Rotations
>>> qp.decompose(gate_set=gateset_name)
<decompose(gate_set=Rotations)>

Gate sets can be combined with ``|``:

>>> gateset | {qp.RX, qp.RY, qp.RZ}
GateSet({Adjoint(RX), PauliX, RX, RY, RZ})

Items can be removed with ``-``:

>>> gateset - {qp.RX, qp.RY}
GateSet({Adjoint(RX), PauliX})
>>> gateset - qp.RX
GateSet({Adjoint(RX), PauliX})
>>> gateset - "RX"
GateSet({Adjoint(RX), PauliX})

Weights can also be provided for use in calculating costs and choosing optimal decompositions:

>>> GateSet({qp.I: 0, qp.RX: 1, qp.CNOT: 3})
GateSet({Identity=0, RX, CNOT=3})

If not provided, weights default to ``1``:

>>> dict(gateset)
{'Adjoint(RX)': 1.0, 'PauliX': 1.0, 'RX': 1.0}
