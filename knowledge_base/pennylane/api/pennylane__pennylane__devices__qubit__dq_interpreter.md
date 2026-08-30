---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/qubit/dq_interpreter.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/qubit/dq_interpreter.py
license: Apache-2.0
---

## Module `pennylane/devices/qubit/dq_interpreter.py`

This module contains a class for executing plxpr using default qubit tools.

## `DefaultQubitInterpreter`

```python
class DefaultQubitInterpreter(FlattenedInterpreter)
```

Implements a class for interpreting plxpr using python simulation tools.

Args:
    num_wires (int): the number of wires to initialize the state with
    shots (int | None): the number of shots to use for the execution. Shot vectors are not supported yet.
    key (None, jax.numpy.ndarray): the ``PRNGKey`` to use for random number generation.


>>> import pennylane as qp
>>> from pennylane.devices.qubit.dq_interpreter import DefaultQubitInterpreter
>>> qp.capture.enable()
>>> import jax
>>> key = jax.random.PRNGKey(1234)
>>> dq = DefaultQubitInterpreter(num_wires=2, shots=None, key=key)
>>> @qp.for_loop(2)
... def g(i,y):
...     qp.RX(y,0)
...     return y
>>> def f(x):
...     g(x)
...     return qp.expval(qp.Z(0))
>>> dq(f)(0.5)
Array(0.54030231, dtype=float64)
>>> jaxpr = jax.make_jaxpr(f)(0.5)
>>> dq.eval(jaxpr.jaxpr, jaxpr.consts, 0.5)
[Array(0.54030231, dtype=float64)]

This execution can be differentiated via backprop and jitted as normal. Note that finite shot executions
still cannot be differentiated with backprop.

>>> jax.grad(dq(f))(jax.numpy.array(0.5))
Array(-1.68294197, dtype=float64, weak_type=True)
>>> jax.jit(dq(f))(jax.numpy.array(0.5))
Array(0.54030231, dtype=float64)

### `state`

```python
def state(self)
```

The statevector

### `shots`

```python
def shots(self)
```

The shots

### `key`

```python
def key(self)
```

A jax PRNGKey for random number generation.

### `is_state_batched`

```python
def is_state_batched(self) -> bool
```

Whether or not the state vector is batched.
