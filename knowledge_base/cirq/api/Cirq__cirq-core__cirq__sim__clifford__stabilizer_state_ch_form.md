---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/clifford/stabilizer_state_ch_form.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/clifford/stabilizer_state_ch_form.py
license: Apache-2.0
---

## `StabilizerStateChForm`

```python
class StabilizerStateChForm(qis.StabilizerState)
```

A representation of stabilizer states using the CH form,

    $|\psi> = \omega U_C U_H |s>$

This representation keeps track of overall phase.

Reference: https://arxiv.org/abs/1808.00128

### `__init__`

```python
def __init__(self, num_qubits: int, initial_state: int=0) -> None
```

Initializes StabilizerStateChForm
Args:
    num_qubits: The number of qubits in the system.
    initial_state: The computational basis representation of the
        state as a big endian int.

### `__str__`

```python
def __str__(self) -> str
```

Return the state vector string representation of the state.

### `__repr__`

```python
def __repr__(self) -> str
```

Return the CH form representation of the state.

### `inner_product_of_state_and_x`

```python
def inner_product_of_state_and_x(self, x: int) -> complex
```

Returns the amplitude of x'th element of
the state vector, i.e. <x|psi>

### `update_sum`

```python
def update_sum(self, t, u, delta=0, alpha=0) -> None
```

Implements the transformation (Proposition 4 in Bravyi et al)

``i^alpha U_H (|t> + i^delta |u>) = omega W_C W_H |s'>``

### `project_Z`

```python
def project_Z(self, q, z) -> None
```

Applies a Z projector on the q'th qubit.

Returns: a normalized state with Z_q |psi> = z |psi>
