---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/backend_estimator_v2.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/backend_estimator_v2.py
license: Apache-2.0
---

## Module `qiskit/primitives/backend_estimator_v2.py`

Estimator V2 implementation for an arbitrary Backend object.

## `Options`

```python
class Options
```

Options for :class:`~.BackendEstimatorV2`.

## `BackendEstimatorV2`

```python
class BackendEstimatorV2(BaseEstimatorV2)
```

Evaluates expectation values for provided quantum circuit and observable combinations.

The :class:`~.BackendEstimatorV2` class is a generic implementation of the
:class:`~.BaseEstimatorV2` interface that is used to wrap a :class:`~.BackendV2`
object in the :class:`~.BaseEstimatorV2` API. It
facilitates using backends that do not provide a native
:class:`~.BaseEstimatorV2` implementation in places that work with
:class:`~.BaseEstimatorV2`. However,
if you're using a provider that has a native implementation of
:class:`~.BaseEstimatorV2`, it is a better choice to leverage that native
implementation as it will likely include additional optimizations and be
a more efficient implementation. The generic nature of this class
precludes doing any provider- or backend-specific optimizations.

This class does not perform any measurement or gate mitigation, and, presently, is only
compatible with Pauli-based observables. More formally, given an observable of the type
:math:`O=\sum_{i=1}^Na_iP_i`, where :math:`a_i` is a complex number and :math:`P_i` is a
Pauli operator, the estimator calculates the expectation :math:`\mathbb{E}(P_i)` of each
:math:`P_i` and finally calculates the expectation value of :math:`O` as
:math:`\mathbb{E}(O)=\sum_{i=1}^Na_i\mathbb{E}(P_i)`. The reported ``std`` is calculated
as

.. math::

    \frac{\sum_{i=1}^{n}|a_i|\sqrt{\textrm{Var}\big(P_i\big)}}{\sqrt{N}}\:,

where :math:`\textrm{Var}(P_i)` is the variance of :math:`P_i`, :math:`N=O(\epsilon^{-2})` is
the number of shots, and :math:`\epsilon` is the target precision [1].

Each tuple of ``(circuit, observables, <optional> parameter values, <optional> precision)``,
called an estimator primitive unified bloc (PUB), produces its own array-based result. The
:meth:`~.BackendEstimatorV2.run` method can be given a sequence of pubs to run in one call.

The options for :class:`~.BackendEstimatorV2` consist of the following items.

* ``default_precision``: The default precision to use if none are specified in :meth:`~run`.
  Default: 0.015625 (1 / sqrt(4096)).

* ``abelian_grouping``: Whether the observables should be grouped into sets of qubit-wise
  commuting observables.
  Default: True.

* ``seed_simulator``: The seed to use in the simulator. If None, a random seed will be used.
  Default: None.

**Reference:**

[1] O. Crawford, B. van Straaten, D. Wang, T. Parks, E. Campbell, St. Brierley,
Efficient quantum measurement of Pauli operators in the presence of finite sampling error.
`Quantum 5, 385 <https://doi.org/10.22331/q-2021-01-20-385>`_

### `__init__`

```python
def __init__(self, *, backend: BackendV2, options: dict | None=None)
```

Args:
    backend: The backend to run the primitive on.
    options: The options to control the default precision (``default_precision``),
        the operator grouping (``abelian_grouping``), and
        the random seed for the simulator (``seed_simulator``).

### `options`

```python
def options(self) -> Options
```

Return the options

### `backend`

```python
def backend(self) -> BackendV2
```

Returns the backend which this estimator object is based on.
