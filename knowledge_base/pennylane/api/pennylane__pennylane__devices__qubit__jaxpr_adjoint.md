---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qubit/jaxpr_adjoint.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qubit/jaxpr_adjoint.py
license: Apache-2.0
---

## Module `pennylane/devices/qubit/jaxpr_adjoint.py`

Compute the jvp of a jaxpr using the adjoint Jacobian method.

## `execute_and_jvp`

```python
def execute_and_jvp(jaxpr: jax.extend.core.Jaxpr, args: tuple, tangents: tuple, num_wires: int)
```

Execute and calculate the jvp for a jaxpr using the adjoint method.

Args:
    jaxpr (jax.extend.core.Jaxpr): the jaxpr to evaluate
    args : an iterable of tensorlikes.  Should include the consts followed by the inputs
    tangents: an iterable of tensorlikes and ``jax.interpreter.ad.Zero`` objects.  Should
        include the consts followed by the inputs.
    num_wires (int): the number of wires to use.

Note that the consts for the jaxpr should be included at the beginning of both the ``args``
and ``tangents``.
