---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/containers/sampler_pub.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/containers/sampler_pub.py
license: Apache-2.0
---

## Module `qiskit/primitives/containers/sampler_pub.py`

Sampler Pub class

## `SamplerPub`

```python
class SamplerPub(ShapedMixin)
```

Pub (Primitive Unified Bloc) for a Sampler.

Pub is composed of tuple (circuit, parameter_values, shots).

If shots are provided this number of shots will be run with the sampler,
if ``shots=None`` the number of run shots is determined by the sampler.

### `__init__`

```python
def __init__(self, circuit: QuantumCircuit, parameter_values: BindingsArray | None=None, shots: int | None=None, validate: bool=True)
```

Initialize a sampler pub.

Args:
    circuit: A quantum circuit.
    parameter_values: A bindings array.
    shots: A specific number of shots to run with. This value takes
        precedence over any value owed by or supplied to a sampler.
    validate: If ``True``, the input data is validated during initialization.

### `circuit`

```python
def circuit(self) -> QuantumCircuit
```

A quantum circuit.

### `parameter_values`

```python
def parameter_values(self) -> BindingsArray
```

A bindings array.

### `shots`

```python
def shots(self) -> int | None
```

A specific number of shots to run with (optional).

This value takes precedence over any value owed by or supplied to a sampler.

### `coerce`

```python
def coerce(cls, pub: SamplerPubLike, shots: int | None=None) -> SamplerPub
```

Coerce a :class:`~.SamplerPubLike` object into a :class:`~.SamplerPub` instance.

Args:
    pub: An object to coerce.
    shots: An optional default number of shots to use if not
           already specified by the pub-like object.

Returns:
    A coerced sampler pub.

### `validate`

```python
def validate(self)
```

Validate the pub.
