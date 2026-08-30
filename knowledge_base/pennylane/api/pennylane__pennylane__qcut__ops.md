---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qcut/ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qcut/ops.py
license: Apache-2.0
---

## Module `pennylane/qcut/ops.py`

Nodes for use in qcut.

## `PrepareNode`

```python
class PrepareNode(Operation)
```

Placeholder node for state preparations

### `node_uid`

```python
def node_uid(self) -> str
```

Custom UID for this node.

## `MeasureNode`

```python
class MeasureNode(Operation)
```

Placeholder node for measurement operations

### `node_uid`

```python
def node_uid(self) -> str
```

Custom UID for this node.
