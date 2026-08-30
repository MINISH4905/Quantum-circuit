---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/value/product_state.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/value/product_state.py
license: Apache-2.0
---

## `ProductState`

```python
class ProductState
```

A quantum state that is a tensor product of one qubit states.

For example, the |00⟩ state is `cirq.KET_ZERO(q0) * cirq.KET_ZERO(q1)`.
The |+⟩ state is a length-1 tensor product state and can be constructed
with `cirq.KET_PLUS(q0)`.

### `__getitem__`

```python
def __getitem__(self, qubit: cirq.Qid) -> _NamedOneQubitState
```

Return the _NamedOneQubitState at the given qubit.

### `state_vector`

```python
def state_vector(self, qubit_order: cirq.QubitOrder | None=None) -> np.ndarray
```

The state-vector representation of this state.

### `projector`

```python
def projector(self, qubit_order: cirq.QubitOrder | None=None) -> np.ndarray
```

The projector associated with this state expressed as a matrix.

This is |s⟩⟨s| where |s⟩ is this state.
