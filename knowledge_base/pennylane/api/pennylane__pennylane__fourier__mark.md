---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/fourier/mark.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/fourier/mark.py
license: Apache-2.0
---

## Module `pennylane/fourier/mark.py`

Contains the 'label' function for customizing operator labels.

## `MarkedOp`

```python
class MarkedOp(SymbolicOp)
```

Create a marked operator.

Args:
    base (Operator): The operator you wish to mark.
    marker (str): The custom marker to give to your operator.

**Example:**

>>> op = qp.RX(1.23456, wires=0)
>>> marked_op = MarkedOp(op, "my-rx")
>>> print(marked_op.marker)
my-rx

### `marker`

```python
def marker(self) -> str
```

Retrieve the marker set on this operator.

## `mark`

```python
def mark(op: Operator, marker: str) -> MarkedOp
```

Mark an operator with a custom tag.

.. warning::

    This function is not currently supported inside :func:`~.qjit`-compiled circuits.

Args:
    op (Operator): The operator you wish to mark.
    marker (str): The marker to give to the operator.

**Example:**

>>> op = qp.X(0)
>>> marked_op = mark(op, "my-x")
>>> print(marked_op.marker)
my-x

.. seealso:: :func:`~.fourier.circuit_spectrum`
