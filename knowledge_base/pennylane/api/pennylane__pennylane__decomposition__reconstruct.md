---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/decomposition/reconstruct.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/decomposition/reconstruct.py
license: Apache-2.0
---

## Module `pennylane/decomposition/reconstruct.py`

Defines an internal helper function to reconstruct an operator from a resource rep.

## `decomps_use_reconstructor`

```python
def decomps_use_reconstructor(op_type, op_params)
```

Checks for special cases that has_reconstructor is not yet prepared to handle.

## `get_decomp_kwargs`

```python
def get_decomp_kwargs(op)
```

Returns the kwargs needed for a decomposition rule.

## `register_reconstructor`

```python
def register_reconstructor(op_type: type[Operator])
```

A decorator that registers a function as the reconstructor of op_type.

A reconstructor is expected to take ``(*op.data, wires=op.wires, **op.resource_params)``
as input and return an instance of the original op.

## `has_reconstructor`

```python
def has_reconstructor(op_class: type[Operator], op_params: dict)
```

Checks whether a reconstructor exists for the resource rep.

## `reconstruct`

```python
def reconstruct(data: tuple, wires: Wires, op_type: type[Operator], op_params: dict) -> Operator
```

Reconstruct an instance of op_type with resource params.
