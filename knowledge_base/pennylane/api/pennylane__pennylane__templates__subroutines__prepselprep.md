---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/prepselprep.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/prepselprep.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/prepselprep.py`

Contains the PrepSelPrep template.

## `PrepSelPrep`

```python
class PrepSelPrep(Operation)
```

Implements a block-encoding of a linear combination of unitaries.

.. warning::
    Derivatives of this operator are not always guaranteed to exist.

Args:
    lcu (Union[.Hamiltonian, .Sum, .Prod, .SProd, .LinearCombination]): The operator
        written as a linear combination of unitaries.
    control (WiresLike): The control qubits for the PrepSelPrep operator.

**Example**

We define an operator and a block-encoding circuit as:

>>> lcu = qp.dot([0.3, -0.1], [qp.X(2), qp.Z(2)])
>>> control = [0, 1]
>>> @qp.qnode(qp.device("default.qubit"))
... def circuit(lcu, control):
...     qp.PrepSelPrep(lcu, control)
...     return qp.state()

We can see that the operator matrix, up to a normalization constant, is block encoded in the
circuit matrix:

>>> matrix_psp = qp.matrix(circuit, wire_order = [0, 1, 2])(lcu, control = control)
>>> print(matrix_psp.real[0:2, 0:2])
[[-0.25  0.75]
 [ 0.75  0.25]]

>>> matrix_lcu = qp.matrix(lcu)
>>> print(qp.matrix(lcu).real / sum(abs(np.array(lcu.terms()[0]))))
[[-0.25  0.75]
 [ 0.75  0.25]]

### `__copy__`

```python
def __copy__(self)
```

Copy this op

### `data`

```python
def data(self)
```

Create data property

### `data`

```python
def data(self, new_data)
```

Set the data property

### `lcu`

```python
def lcu(self)
```

The LCU to be block-encoded.

### `coeffs`

```python
def coeffs(self)
```

The coefficients of the LCU to be block-encoded.

### `ops`

```python
def ops(self)
```

The operators of the LCU to be block-encoded.

### `control`

```python
def control(self)
```

The control wires.

### `target_wires`

```python
def target_wires(self)
```

The wires of the input operators.

### `wires`

```python
def wires(self)
```

All wires involved in the operation.

### `queue`

```python
def queue(self, context: QueuingManager=QueuingManager)
```

Append the operator to the Operator queue.
