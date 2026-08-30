---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/_utils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/_utils.py
license: Apache-2.0
---

## Module `qiskit/circuit/_utils.py`

This module contains utility functions for circuits.

## `with_gate_array`

```python
def with_gate_array(base_array)
```

Class decorator that adds an ``__array__`` method to a :class:`.Gate` instance that returns a
singleton nonwritable view onto the complex matrix described by ``base_array``.

## `with_controlled_gate_array`

```python
def with_controlled_gate_array(base_array, num_ctrl_qubits, cached_states=None)
```

Class decorator that adds an ``__array__`` method to a :class:`.ControlledGate` instance that
returns singleton nonwritable views onto a relevant precomputed complex matrix for the given
control state.

If ``cached_states`` is not given, then all possible control states are precomputed.  If it is
given, it should be an iterable of integers, and only these control states will be cached.
