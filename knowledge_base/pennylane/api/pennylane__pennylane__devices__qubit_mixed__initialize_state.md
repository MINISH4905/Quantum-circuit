---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qubit_mixed/initialize_state.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qubit_mixed/initialize_state.py
license: Apache-2.0
---

## Module `pennylane/devices/qubit_mixed/initialize_state.py`

Functions to prepare a state.

## `create_initial_state`

```python
def create_initial_state(wires: qp.wires.Wires | Iterable, prep_operation: qp.operation.StatePrepBase | qp.QubitDensityMatrix | None=None, like: str=None)
```

Returns an initial state, defaulting to :math:`\ket{0}` if no state-prep operator is provided.

Args:
    wires (Union[Wires, Iterable]): The wires to be present in the initial state
    prep_operation (Optional[StatePrepBase]): An operation to prepare the initial state
    like (Optional[str]): The machine learning interface used to create the initial state.
        Defaults to None

Returns:
    array: The initial density matrix (tensor form) of a circuit
