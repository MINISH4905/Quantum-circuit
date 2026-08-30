---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/exact_reciprocal.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/exact_reciprocal.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/exact_reciprocal.py`

Exact reciprocal rotation.

## `ExactReciprocal`

```python
class ExactReciprocal(QuantumCircuit)
```

Exact reciprocal

.. math::

    |x\rangle |0\rangle \mapsto \cos(1/x)|x\rangle|0\rangle + \sin(1/x)|x\rangle |1\rangle

### `__init__`

```python
def __init__(self, num_state_qubits: int, scaling: float, neg_vals: bool=False, name: str='1/x') -> None
```

Args:
    num_state_qubits: The number of qubits representing the value to invert.
    scaling: Scaling factor :math:`s` of the reciprocal function, i.e. to compute
        :math:`s / x`.
    neg_vals: Whether :math:`x` might represent negative values. In this case the first
        qubit is the sign, with :math:`|1\rangle` for negative and :math:`|0\rangle` for
        positive.  For the negative case it is assumed that the remaining string represents
        :math:`1 - x`. This is because :math:`e^{-2 \pi i x} = e^{2 \pi i (1 - x)}` for
        :math:`x \in [0,1)`.
    name: The name of the object.

.. note::

    It is assumed that the binary string :math:`x` represents a number < 1.

## `ExactReciprocalGate`

```python
class ExactReciprocalGate(Gate)
```

Implements an exact reciprocal function.

For a state :math:`|x\rangle` and a scaling factor :math:`s`, this gate implements the operation

.. math::

    |x\rangle |0\rangle \mapsto
        \cos\left(\arcsin\left(s\frac{2^n}{x}\right)\right)|x\rangle|0\rangle +
        \left(s\frac{2^n}{x}\right)|x\rangle|1\rangle.

States representing :math:`x = 0` or :math:`s 2^n / x \geq 1` are left unchanged, since
this function would not be defined.

### `__init__`

```python
def __init__(self, num_state_qubits: int, scaling: float, neg_vals: bool=False, label: str='1/x') -> None
```

Args:
    num_state_qubits: The number of qubits representing the value to invert.
    scaling: Scaling factor :math:`s` of the reciprocal function, i.e. to compute
        :math:`s / x`.
    neg_vals: Whether :math:`x` might represent negative values. In this case the first
        qubit is the sign, with :math:`|1\rangle` for negative and :math:`|0\rangle` for
        positive.  For the negative case it is assumed that the remaining string represents
        :math:`1 - x`. This is because :math:`e^{-2 \pi i x} = e^{2 \pi i (1 - x)}` for
        :math:`x \in [0,1)`.
    label: The label of the object.

.. note::

    It is assumed that the binary string :math:`x` represents a number < 1.
