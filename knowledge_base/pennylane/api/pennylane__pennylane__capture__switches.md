---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/capture/switches.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/capture/switches.py
license: Apache-2.0
---

## Module `pennylane/capture/switches.py`

Contains the switches to (de)activate the capturing mechanism, and a
status reporting function on whether it is enabled or not.

## `pause`

```python
def pause()
```

Temporarily stop program capture.

>>> def f():
...     with qp.capture.pause():
...         qp.X(0)
...     return 2
>>> jax.make_jaxpr(f)()
{ lambda ; . let  in (2,) }
