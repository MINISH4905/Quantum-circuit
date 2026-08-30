---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/ops/qubit/state_preparation.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/ops/qubit/state_preparation.py
license: Apache-2.0
---

## Module `pennylane/estimator/ops/qubit/state_preparation.py`

Resource operators for state preparation templates.

## `BasisState`

```python
class BasisState(ResourceOperator)
```

Resource class for preparing a single basis state.

Args:
    num_wires (int): the number of wires the operator acts on
    wires (WiresLike, Optional): the wire(s) the operation acts on

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_wires (int): number of wires the operator acts on

### `resource_rep`

```python
def resource_rep(cls, num_wires: int) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, num_wires: int) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list represents a gate and the
number of times it occurs in the circuit.

Args:
    num_wires (int): the number of wires the operator acts on

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of
    ``GateCount`` objects, where each object represents a specific quantum gate and the
    number of times it appears in the decomposition.
