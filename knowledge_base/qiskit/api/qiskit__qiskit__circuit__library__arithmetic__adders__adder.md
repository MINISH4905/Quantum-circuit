---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/adders/adder.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/adders/adder.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/adders/adder.py`

Compute the sum of two equally sized qubit registers.

## `Adder`

```python
class Adder(QuantumCircuit)
```

Compute the sum of two equally sized qubit registers.

For two registers :math:`|a\rangle_n` and :math:`|b\rangle_n` with :math:`n` qubits each, an
adder performs the following operation

.. math::

    |a\rangle_n |b\rangle_n \mapsto |a\rangle_n |a + b\rangle_{n + 1}.

The quantum register :math:`|a\rangle_n` (and analogously :math:`|b\rangle_n`)

.. math::

    |a\rangle_n = |a_0\rangle \otimes \cdots \otimes |a_{n - 1}\rangle,

for :math:`a_i \in \{0, 1\}`, is associated with the integer value

.. math::

    a = 2^{0}a_{0} + 2^{1}a_{1} + \cdots + 2^{n - 1}a_{n - 1}.

### `__init__`

```python
def __init__(self, num_state_qubits: int, name: str='Adder') -> None
```

Args:
    num_state_qubits: The number of qubits in each of the registers.
    name: The name of the circuit.

### `num_state_qubits`

```python
def num_state_qubits(self) -> int
```

The number of state qubits, i.e. the number of bits in each input register.

Returns:
    The number of state qubits.

## `HalfAdderGate`

```python
class HalfAdderGate(Gate)
```

Compute the sum of two equally-sized qubit registers, including a carry-out bit.

For two registers :math:`|a\rangle_n` and :math:`|b\rangle_n` with :math:`n` qubits each, an
adder performs the following operation

.. math::

    |a\rangle_n |b\rangle_n |0\rangle \mapsto |a\rangle_n |a + b\rangle_{n + 1}.

The final input qubit is a clean qubit initialized to :math:`|0\rangle`.
It stores the carry-out bit, which is why the output sum register has
:math:`n + 1` qubits.

The quantum register :math:`|a\rangle_n` (and analogously :math:`|b\rangle_n`)

.. math::

    |a\rangle_n = |a_0\rangle \otimes \cdots \otimes |a_{n - 1}\rangle,

for :math:`a_i \in \{0, 1\}`, is associated with the integer value

.. math::

    a = 2^{0}a_{0} + 2^{1}a_{1} + \cdots + 2^{n - 1}a_{n - 1}.

### `__init__`

```python
def __init__(self, num_state_qubits: int, label: str | None=None) -> None
```

Args:
    num_state_qubits: The number of qubits in each of the registers.
    label: An optional label for identifying the instruction.

### `num_state_qubits`

```python
def num_state_qubits(self) -> int
```

The number of state qubits, i.e. the number of bits in each input register.

Returns:
    The number of state qubits.

## `ModularAdderGate`

```python
class ModularAdderGate(Gate)
```

Compute the sum modulo :math:`2^n` of two :math:`n`-sized qubit registers.

For two registers :math:`|a\rangle_n` and :math:`|b\rangle_n` with :math:`n` qubits each, an
adder performs the following operation

.. math::

    |a\rangle_n |b\rangle_n \mapsto |a\rangle_n |a + b \text{ mod } 2^n\rangle_n.

The quantum register :math:`|a\rangle_n` (and analogously :math:`|b\rangle_n`)

.. math::

    |a\rangle_n = |a_0\rangle \otimes \cdots \otimes |a_{n - 1}\rangle,

for :math:`a_i \in \{0, 1\}`, is associated with the integer value

.. math::

    a = 2^{0}a_{0} + 2^{1}a_{1} + \cdots + 2^{n - 1}a_{n - 1}.

### `__init__`

```python
def __init__(self, num_state_qubits: int, label: str | None=None) -> None
```

Args:
    num_state_qubits: The number of qubits in each of the registers.
    label: An optional label for identifying the instruction.

### `num_state_qubits`

```python
def num_state_qubits(self) -> int
```

The number of state qubits, i.e. the number of bits in each input register.

Returns:
    The number of state qubits.

## `FullAdderGate`

```python
class FullAdderGate(Gate)
```

Compute the sum of two :math:`n`-sized qubit registers, including carry-in and -out bits.

For two registers :math:`|a\rangle_n` and :math:`|b\rangle_n` with :math:`n` qubits each, an
adder performs the following operation

.. math::

    |c_{\text{in}}\rangle_1 |a\rangle_n |b\rangle_n
    \mapsto |a\rangle_n |c_{\text{in}} + a + b \rangle_{n + 1}.

The quantum register :math:`|a\rangle_n` (and analogously :math:`|b\rangle_n`)

.. math::

    |a\rangle_n = |a_0\rangle \otimes \cdots \otimes |a_{n - 1}\rangle,

for :math:`a_i \in \{0, 1\}`, is associated with the integer value

.. math::

    a = 2^{0}a_{0} + 2^{1}a_{1} + \cdots + 2^{n - 1}a_{n - 1}.

### `__init__`

```python
def __init__(self, num_state_qubits: int, label: str | None=None) -> None
```

Args:
    num_state_qubits: The number of qubits in each of the registers.
    label: An optional label for identifying the instruction.

### `num_state_qubits`

```python
def num_state_qubits(self) -> int
```

The number of state qubits, i.e. the number of bits in each input register.

Returns:
    The number of state qubits.
