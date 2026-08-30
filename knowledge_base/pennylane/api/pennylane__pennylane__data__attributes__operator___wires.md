---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/attributes/operator/_wires.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/attributes/operator/_wires.py
license: Apache-2.0
---

## Module `pennylane/data/attributes/operator/_wires.py`

Contains utility function for converting ``Wires`` objects to JSON.

## `UnserializableWireError`

```python
class UnserializableWireError(TypeError)
```

Raised if a wire label is not JSON-serializable.

## `wires_to_json`

```python
def wires_to_json(wires: Wires) -> str
```

Converts ``wires`` to a JSON list, with wire labels in
order of their index.

Returns:
    JSON list of wires

Raises:
    UnserializableWireError: if any of the wires are not JSON-serializable.
