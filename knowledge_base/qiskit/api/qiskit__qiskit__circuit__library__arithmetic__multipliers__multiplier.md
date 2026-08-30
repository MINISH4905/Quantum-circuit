---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/multipliers/multiplier.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/multipliers/multiplier.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/multipliers/multiplier.py`

Compute the product of two equally sized qubit registers.

## `Multiplier`

```python
class Multiplier(QuantumCircuit)
```

Compute the product of two equally sized qubit registers into a new register.

For two input registers :math:`|a\rangle_n`, :math:`|b\rangle_n` with :math:`n` qubits each
and an output register with :math:`2n` qubits, a multiplier performs the following operation

.. math::

    |a\rangle_n |b\rangle_n |0\rangle_{t} \mapsto |a\rangle_n |b\rangle_n |a \cdot b\rangle_t

where :math:`t` is the number of bits used to represent the result. To completely store the result
of the multiplication without overflow we need :math:`t = 2n` bits.

The quantum register :math:`|a\rangle_n` (analogously :math:`|b\rangle_n` and
output register)

.. math::

    |a\rangle_n = |a_0\rangle \otimes \cdots \otimes |a_{n - 1}\rangle,

for :math:`a_i \in \{0, 1\}`, is associated with the integer value

.. math::

    a = 2^{0}a_{0} + 2^{1}a_{1} + \cdots + 2^{n - 1}a_{n - 1}.

### `__init__`

```python
def __init__(self, num_state_qubits: int, num_result_qubits: int | None=None, name: str='Multiplier') -> None
```

Args:
    num_state_qubits: The number of qubits in each of the input registers.
    num_result_qubits: The number of result qubits to limit the output to.
        Default value is ``2 * num_state_qubits`` to represent any possible
        result from the multiplication of the two inputs.
    name: The name of the circuit.
Raises:
    ValueError: If ``num_state_qubits`` is smaller than 1.
    ValueError: If ``num_result_qubits`` is smaller than ``num_state_qubits``.
    ValueError: If ``num_result_qubits`` is larger than ``2 * num_state_qubits``.

### `num_state_qubits`

```python
def num_state_qubits(self) -> int
```

The number of state qubits, i.e. the number of bits in each input register.

Returns:
    The number of state qubits.

### `num_result_qubits`

```python
def num_result_qubits(self) -> int
```

The number of result qubits to limit the output to.

Returns:
    The number of result qubits.

## `MultiplierGate`

```python
class MultiplierGate(Gate)
```

Compute the product of two equally sized qubit registers into a new register.

For two input registers :math:`|a\rangle_n`, :math:`|b\rangle_n` with :math:`n` qubits each
and an output register with :math:`2n` qubits, a multiplier performs the following operation

.. math::

    |a\rangle_n |b\rangle_n |0\rangle_{t} \mapsto |a\rangle_n |b\rangle_n |a \cdot b\rangle_t

where :math:`t` is the number of bits used to represent the result. To completely store the result
of the multiplication without overflow we need :math:`t = 2n` bits.

The quantum register :math:`|a\rangle_n` (analogously :math:`|b\rangle_n` and
output register)

.. math::

    |a\rangle_n = |a_0\rangle \otimes \cdots \otimes |a_{n - 1}\rangle,

for :math:`a_i \in \{0, 1\}`, is associated with the integer value

.. math::

    a = 2^{0}a_{0} + 2^{1}a_{1} + \cdots + 2^{n - 1}a_{n - 1}.

### `__init__`

```python
def __init__(self, num_state_qubits: int, num_result_qubits: int | None=None, label: str | None=None) -> None
```

Args:
    num_state_qubits: The number of qubits in each of the input registers.
    num_result_qubits: The number of result qubits to limit the output to.
        Default value is ``2 * num_state_qubits`` to represent any possible
        result from the multiplication of the two inputs.
    label: The optional string label to apply to the instruction.
Raises:
    ValueError: If ``num_state_qubits`` is smaller than 1.
    ValueError: If ``num_result_qubits`` is smaller than ``num_state_qubits``.
    ValueError: If ``num_result_qubits`` is larger than ``2 * num_state_qubits``.

### `num_state_qubits`

```python
def num_state_qubits(self) -> int
```

The number of state qubits, i.e. the number of bits in each input register.

Returns:
    The number of state qubits.

### `num_result_qubits`

```python
def num_result_qubits(self) -> int
```

The number of result qubits to limit the output to.

Returns:
    The number of result qubits.
