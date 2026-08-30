---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/sample_gates.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/sample_gates.py
license: Apache-2.0
---

## `PhaseUsingCleanAncilla`

```python
class PhaseUsingCleanAncilla(ops.Gate)
```

Phases the state $|phase\_state>$ by $\exp(1j * \pi * \theta)$ using one clean ancilla.

### `narrow_unitary`

```python
def narrow_unitary(self) -> np.ndarray
```

Narrowed unitary corresponding to the unitary effect applied on target qubits.

## `PhaseUsingDirtyAncilla`

```python
class PhaseUsingDirtyAncilla(ops.Gate)
```

Phases the state $|phase\_state>$ by -1 using one dirty ancilla.

### `narrow_unitary`

```python
def narrow_unitary(self) -> np.ndarray
```

Narrowed unitary corresponding to the unitary effect applied on target qubits.
