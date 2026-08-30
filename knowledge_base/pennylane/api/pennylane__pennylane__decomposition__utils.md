---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/decomposition/utils.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/decomposition/utils.py
license: Apache-2.0
---

## Module `pennylane/decomposition/utils.py`

This module implements utility functions for the decomposition module.

## `translate_op_alias`

```python
def translate_op_alias(op_alias)
```

Translates an operator alias to its proper name.

## `to_name`

```python
def to_name(op) -> str
```

Get the canocial name of an operation for the graph.

## `toggle_graph_decomposition`

```python
def toggle_graph_decomposition()
```

A closure that toggles the experimental graph-based decomposition on and off.
