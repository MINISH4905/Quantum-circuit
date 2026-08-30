---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/about.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/about.py
license: Apache-2.0
---

## Module `pennylane/about.py`

This module contains the :func:`about` function to display all the details of the PennyLane installation,
e.g., OS, version, `Numpy` and `Scipy` versions, installation method.

## `catalyst_version`

```python
def catalyst_version() -> str | None
```

Get the version of the installed Catalyst package, if available.

## `about`

```python
def about()
```

Prints the information for pennylane installation.
