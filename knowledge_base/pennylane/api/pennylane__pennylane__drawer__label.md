---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/drawer/label.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/drawer/label.py
license: Apache-2.0
---

## Module `pennylane/drawer/label.py`

Contains the 'label' function for customizing operator labels.

## `LabelledOp`

```python
class LabelledOp(SymbolicOp)
```

Creates a labelled operator.

Args:
    base (Operator): The operator you wish to label.
    custom_label (str): The custom label to label your operator with.

**Example:**

>>> op = qp.RX(1.23456, wires=0)
>>> labelled_op = LabelledOp(op, "my-rx")
>>> print(labelled_op.hyperparameters["custom_label"])
my-rx
>>> labelled_op.label()
'RX("my-rx")'
>>> labelled_op.label(decimals=2)
'RX\n(1.23, "my-rx")'

### `custom_label`

```python
def custom_label(self) -> str
```

Retrieve the custom label set on this operator.

### `label`

```python
def label(self, decimals=None, base_label=None, cache=None) -> str
```

Retrieve the label for this operator.

Args:
    decimals=None (int): If ``None``, no parameters are included. Else,
        specifies how to round the parameters.
    base_label=None (str): overwrite the non-parameter component of the label
    cache=None (dict): dictionary that carries information between label calls
        in the same drawing

Returns:
    str: label to use in drawings

## `label`

```python
def label(op: Operator, new_label: str) -> LabelledOp
```

Labels an operator with a custom label.

.. warning::

    This function is not currently supported inside :func:`~.qjit`-compiled circuits.

Args:
    op (Operator): The operator you wish to mark.
    new_label (str): The label you wish to give to the operator.

**Example:**

>>> op = qp.X(0)
>>> labelled_op = qp.drawer.label(op, "my-x")
>>> print(labelled_op.custom_label)
my-x

The custom label will be displayed in the circuit diagram when using :func:`~.draw`

.. code-block:: python

    @qp.qnode(qp.device("default.qubit"))
    def circuit():
        qp.drawer.label(qp.H(0), "my-h")
        qp.CNOT([0,1])
        return qp.probs()

>>> print(qp.draw(circuit)())
0: ──H("my-h")─╭●─┤  Probs
1: ────────────╰X─┤  Probs
