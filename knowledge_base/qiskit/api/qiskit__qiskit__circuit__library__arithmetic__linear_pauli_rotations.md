---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/arithmetic/linear_pauli_rotations.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/arithmetic/linear_pauli_rotations.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/arithmetic/linear_pauli_rotations.py`

Linearly-controlled X, Y or Z rotation.

## `LinearPauliRotations`

```python
class LinearPauliRotations(FunctionalPauliRotations)
```

Linearly-controlled X, Y or Z rotation.

For a register of state qubits :math:`|x\rangle`, a target qubit :math:`|0\rangle` and the
basis ``'Y'`` this circuit acts as:

.. code-block:: text

        q_0: ─────────────────────────■───────── ... ──────────────────────
                                      │
                                      .
                                      │
    q_(n-1): ─────────────────────────┼───────── ... ───────────■──────────
              ┌────────────┐  ┌───────┴───────┐       ┌─────────┴─────────┐
        q_n: ─┤ RY(offset) ├──┤ RY(2^0 slope) ├  ...  ┤ RY(2^(n-1) slope) ├
              └────────────┘  └───────────────┘       └───────────────────┘

This can for example be used to approximate linear functions, with :math:`a =` ``slope``:math:`/2`
and :math:`b =` ``offset``:math:`/2` and the basis ``'Y'``:

.. math::

    |x\rangle |0\rangle \mapsto \cos(ax + b)|x\rangle|0\rangle + \sin(ax + b)|x\rangle |1\rangle

Since for small arguments :math:`\sin(x) \approx x` this operator can be used to approximate
linear functions.

### `__init__`

```python
def __init__(self, num_state_qubits: int | None=None, slope: float=1, offset: float=0, basis: str='Y', name: str='LinRot') -> None
```

Args:
    num_state_qubits: The number of qubits representing the state :math:`|x\rangle`.
    slope: The slope of the controlled rotation.
    offset: The offset of the controlled rotation.
    basis: The type of Pauli rotation ('X', 'Y', 'Z').
    name: The name of the circuit object.

### `slope`

```python
def slope(self) -> float
```

The multiplicative factor in the rotation angle of the controlled rotations.

The rotation angles are ``slope * 2^0``, ``slope * 2^1``, ... , ``slope * 2^(n-1)`` where
``n`` is the number of state qubits.

Returns:
    The rotation angle common in all controlled rotations.

### `slope`

```python
def slope(self, slope: float) -> None
```

Set the multiplicative factor of the rotation angles.

Args:
    slope: The slope of the rotation angles.

### `offset`

```python
def offset(self) -> float
```

The angle of the single qubit offset rotation on the target qubit.

Before applying the controlled rotations, a single rotation of angle ``offset`` is
applied to the target qubit.

Returns:
    The offset angle.

### `offset`

```python
def offset(self, offset: float) -> None
```

Set the angle for the offset rotation on the target qubit.

Args:
    offset: The offset rotation angle.

## `LinearPauliRotationsGate`

```python
class LinearPauliRotationsGate(Gate)
```

Linearly-controlled X, Y or Z rotation.

For a register of state qubits :math:`|x\rangle`, a target qubit :math:`|0\rangle` and the
basis ``'Y'`` this circuit acts as:

.. parsed-literal::

        q_0: ─────────────────────────■───────── ... ──────────────────────
                                      │
                                      .
                                      │
    q_(n-1): ─────────────────────────┼───────── ... ───────────■──────────
              ┌────────────┐  ┌───────┴───────┐       ┌─────────┴─────────┐
        q_n: ─┤ RY(offset) ├──┤ RY(2^0 slope) ├  ...  ┤ RY(2^(n-1) slope) ├
              └────────────┘  └───────────────┘       └───────────────────┘

This can for example be used to approximate linear functions, with :math:`a =` ``slope``:math:`/2`
and :math:`b =` ``offset``:math:`/2` and the basis ``'Y'``:

.. math::

    |x\rangle |0\rangle \mapsto \cos(ax + b)|x\rangle|0\rangle + \sin(ax + b)|x\rangle |1\rangle

Since for small arguments :math:`\sin(x) \approx x` this operator can be used to approximate
linear functions.

### `__init__`

```python
def __init__(self, num_state_qubits: int, slope: float=1, offset: float=0, basis: str='Y', label: str | None=None) -> None
```

Args:
    num_state_qubits: The number of qubits representing the state :math:`|x\rangle`.
    slope: The slope of the controlled rotation.
    offset: The offset of the controlled rotation.
    basis: The type of Pauli rotation ('X', 'Y', 'Z').
    label: The label of the gate.
