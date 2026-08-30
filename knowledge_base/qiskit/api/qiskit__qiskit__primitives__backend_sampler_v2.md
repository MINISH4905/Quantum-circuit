---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/backend_sampler_v2.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/backend_sampler_v2.py
license: Apache-2.0
---

## Module `qiskit/primitives/backend_sampler_v2.py`

Sampler V2 implementation for an arbitrary Backend object.

## `Options`

```python
class Options
```

Options for :class:`~.BackendSamplerV2`

## `BackendSamplerV2`

```python
class BackendSamplerV2(BaseSamplerV2)
```

Evaluates bitstrings for provided quantum circuits

The :class:`~.BackendSamplerV2` class is a generic implementation of the
:class:`~.BaseSamplerV2` interface that is used to wrap a :class:`~.BackendV2`
object in the class :class:`~.BaseSamplerV2` API. It
facilitates using backends that do not provide a native
:class:`~.BaseSamplerV2` implementation in places that work with
:class:`~.BaseSamplerV2`. However,
if you're using a provider that has a native implementation of
:class:`~.BaseSamplerV2`, it is a better choice to leverage that native
implementation as it will likely include additional optimizations and be
a more efficient implementation. The generic nature of this class
precludes doing any provider- or backend-specific optimizations.

This class does not perform any measurement or gate mitigation.

Each tuple of ``(circuit, <optional> parameter values, <optional> shots)``, called a sampler
primitive unified bloc (PUB), produces its own array-valued result. The :meth:`~run` method can
be given many pubs at once.

The options for :class:`~.BackendSamplerV2` consist of the following items.

* ``default_shots``: The default shots to use if none are specified in :meth:`~run`.
  Default: 1024.

* ``seed_simulator``: The seed to use in the simulator. If None, a random seed will be used.
  Default: None.

* ``run_options``: A dictionary of options to pass through to the ``run()``
  method of the wrapped :class:`~.BackendV2` instance.

.. note::

    This class requires a backend that supports ``memory`` option.

### `__init__`

```python
def __init__(self, *, backend: BackendV2, options: dict | None=None)
```

Args:
    backend: The backend to run the primitive on.
    options: The options to control the default shots (``default_shots``) and
        the random seed for the simulator (``seed_simulator``).

### `backend`

```python
def backend(self) -> BackendV2
```

Returns the backend which this sampler object is based on.

### `options`

```python
def options(self) -> Options
```

Return the options
