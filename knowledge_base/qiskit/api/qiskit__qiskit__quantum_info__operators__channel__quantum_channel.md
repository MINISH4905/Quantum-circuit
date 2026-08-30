---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/channel/quantum_channel.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/channel/quantum_channel.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/channel/quantum_channel.py`

Abstract base class for Quantum Channels.

## `QuantumChannel`

```python
class QuantumChannel(LinearOp)
```

Quantum channel representation base class.

### `__init__`

```python
def __init__(self, data: list | np.ndarray, num_qubits: int | None=None, op_shape: OpShape | None=None)
```

Initialize a quantum channel Superoperator operator.

Args:
    data: quantum channel data array.
    op_shape: the operator shape of the channel.
    num_qubits: the number of qubits if the channel is N-qubit.

Raises:
    QiskitError: if arguments are invalid.

### `__eq__`

```python
def __eq__(self, other: Self)
```

Test if two QuantumChannels are equal.

### `data`

```python
def data(self)
```

Return data.

### `settings`

```python
def settings(self)
```

Return settings.

### `conjugate`

```python
def conjugate(self)
```

Return the conjugate quantum channel.

.. note::
    This is equivalent to the matrix complex conjugate in the
    :class:`~qiskit.quantum_info.SuperOp` representation
    ie. for a channel :math:`\mathcal{E}`, the SuperOp of
    the conjugate channel :math:`\overline{{\mathcal{{E}}}}` is
    :math:`S_{\overline{\mathcal{E}^\dagger}} = \overline{S_{\mathcal{E}}}`.

### `transpose`

```python
def transpose(self) -> Self
```

Return the transpose quantum channel.

.. note::
    This is equivalent to the matrix transpose in the
    :class:`~qiskit.quantum_info.SuperOp` representation,
    ie. for a channel :math:`\mathcal{E}`, the SuperOp of
    the transpose channel :math:`\mathcal{{E}}^T` is
    :math:`S_{\mathcal{E}^T} = S_{\mathcal{E}}^T`.

### `adjoint`

```python
def adjoint(self) -> Self
```

Return the adjoint quantum channel.

.. note::
    This is equivalent to the matrix Hermitian conjugate in the
    :class:`~qiskit.quantum_info.SuperOp` representation
    ie. for a channel :math:`\mathcal{E}`, the SuperOp of
    the adjoint channel :math:`\mathcal{{E}}^\dagger` is
    :math:`S_{\mathcal{E}^\dagger} = S_{\mathcal{E}}^\dagger`.

### `power`

```python
def power(self, n: float) -> Self
```

Return the power of the quantum channel.

Args:
    n (float): the power exponent.

Returns:
    CLASS: the channel :math:`\mathcal{{E}} ^n`.

Raises:
    QiskitError: if the input and output dimensions of the
                 CLASS are not equal.

.. note::
    For non-positive or non-integer exponents the power is
    defined as the matrix power of the
    :class:`~qiskit.quantum_info.SuperOp` representation
    ie. for a channel :math:`\mathcal{{E}}`, the SuperOp of
    the powered channel :math:`\mathcal{{E}}^\n` is
    :math:`S_{{\mathcal{{E}}^n}} = S_{{\mathcal{{E}}}}^n`.

### `is_cptp`

```python
def is_cptp(self, atol: float | None=None, rtol: float | None=None) -> bool
```

Return True if completely-positive trace-preserving (CPTP).

### `is_tp`

```python
def is_tp(self, atol: float | None=None, rtol: float | None=None) -> bool
```

Test if a channel is trace-preserving (TP)

### `is_cp`

```python
def is_cp(self, atol: float | None=None, rtol: float | None=None) -> bool
```

Test if Choi-matrix is completely-positive (CP)

### `is_unitary`

```python
def is_unitary(self, atol: float | None=None, rtol: float | None=None) -> bool
```

Return True if QuantumChannel is a unitary channel.

### `to_operator`

```python
def to_operator(self) -> Operator
```

Try to convert channel to a unitary representation Operator.

### `to_instruction`

```python
def to_instruction(self) -> Instruction
```

Convert to a Kraus or UnitaryGate circuit instruction.

If the channel is unitary it will be added as a unitary gate,
otherwise it will be added as a kraus simulator instruction.

Returns:
    qiskit.circuit.Instruction: A kraus instruction for the channel.

Raises:
    QiskitError: if input data is not an N-qubit CPTP quantum channel.
