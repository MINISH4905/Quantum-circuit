---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/integer_comparator.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/integer_comparator.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/integer_comparator.py`

Integer Comparator.

## `IntegerComparator`

```python
class IntegerComparator(BlueprintCircuit)
```

Integer Comparator.

Operator compares basis states :math:`|i\rangle_n` against a classically given integer
:math:`L` of fixed value and flips a target qubit if :math:`i \geq L`
(or :math:`<` depending on the parameter ``geq``):

.. math::

    |i\rangle_n |0\rangle \mapsto |i\rangle_n |i \geq L\rangle

This operation is based on two's complement implementation of binary subtraction but only
uses carry bits and no actual result bits. If the most significant carry bit
(the results bit) is 1, the :math:`\geq` condition is ``True`` otherwise it is ``False``.

### `__init__`

```python
def __init__(self, num_state_qubits: int | None=None, value: int | None=None, geq: bool=True, name: str='cmp') -> None
```

Args:
    num_state_qubits: Number of state qubits. If this is set it will determine the number
        of qubits required for the circuit.
    value: The fixed value to compare with.
    geq: If True, evaluate a ``>=`` condition, else ``<``.
    name: Name of the circuit.

### `value`

```python
def value(self) -> int
```

The value to compare the qubit register to.

Returns:
    The value against which the value of the qubit register is compared.

### `geq`

```python
def geq(self) -> bool
```

Return whether the comparator compares greater or less equal.

Returns:
    True, if the comparator compares ``>=``, False if ``<``.

### `geq`

```python
def geq(self, geq: bool) -> None
```

Set whether the comparator compares greater or less equal.

Args:
    geq: If True, the comparator compares ``>=``, if False ``<``.

### `num_state_qubits`

```python
def num_state_qubits(self) -> int
```

The number of qubits encoding the state for the comparison.

Returns:
    The number of state qubits.

### `num_state_qubits`

```python
def num_state_qubits(self, num_state_qubits: int | None) -> None
```

Set the number of state qubits.

Note that this will change the quantum registers.

Args:
    num_state_qubits: The new number of state qubits.

## `IntegerComparatorGate`

```python
class IntegerComparatorGate(Gate)
```

Perform a :math:`\geq` (or :math:`<`) on a qubit register against a classical integer.

This operator compares basis states :math:`|i\rangle_n` against a classically given integer
:math:`L` of fixed value and flips a target qubit if :math:`i \geq L`
(or :math:`<` depending on the parameter ``geq``):

.. math::

    |i\rangle_n |0\rangle \mapsto |i\rangle_n |i \geq L\rangle

### `__init__`

```python
def __init__(self, num_state_qubits: int, value: int, geq: bool=True, label: str | None=None)
```

Args:
    num_state_qubits: The number of qubits in the registers.
    value: The value :math:`L` to compare to.
    geq: If ``True`` compute :math:`i \geq L`, otherwise compute :math:`i < L`.
    label: An optional label for the gate.
