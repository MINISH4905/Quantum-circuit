---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/statevector_estimator.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/statevector_estimator.py
license: Apache-2.0
---

## Module `qiskit/primitives/statevector_estimator.py`

Statevector Estimator V2 class

## `StatevectorEstimator`

```python
class StatevectorEstimator(BaseEstimatorV2)
```

Simple implementation of :class:`BaseEstimatorV2` with full state vector simulation.

This class is implemented via :class:`~.Statevector` which turns provided circuits into
pure state vectors. These states are subsequently acted on by :class:`~.SparsePauliOp`,
which implies that, at present, this implementation is only compatible with Pauli-based
observables.

Each tuple of ``(circuit, observables, <optional> parameter values, <optional> precision)``,
called an estimator primitive unified bloc (PUB), produces its own array-based result. The
:meth:`~.StatevectorEstimator.run` method can be given a sequence of pubs to run in one call.


.. note::
    The result of this class is exact if the circuit contains only unitary operations.
    On the other hand, the result could be stochastic if the circuit contains a non-unitary
    operation such as a reset for some subsystems.
    The stochastic result can be made reproducible by setting ``seed``, e.g.,
    ``StatevectorEstimator(seed=123)``.

.. plot::
    :alt: Output from the previous code.
    :include-source:

    from qiskit.circuit import Parameter, QuantumCircuit
    from qiskit.primitives import StatevectorEstimator
    from qiskit.quantum_info import Pauli, SparsePauliOp

    import matplotlib.pyplot as plt
    import numpy as np

    # Define a circuit with two parameters.
    circuit = QuantumCircuit(2)
    circuit.h(0)
    circuit.cx(0, 1)
    circuit.ry(Parameter("a"), 0)
    circuit.rz(Parameter("b"), 0)
    circuit.cx(0, 1)
    circuit.h(0)

    # Define a sweep over parameter values, where the second axis is over
    # the two parameters in the circuit.
    params = np.vstack([
        np.linspace(-np.pi, np.pi, 100),
        np.linspace(-4 * np.pi, 4 * np.pi, 100)
    ]).T

    # Define three observables. Many formats are supported here including
    # classes such as qiskit.quantum_info.SparsePauliOp. The inner length-1
    # lists cause this array of observables to have shape (3, 1), rather
    # than shape (3,) if they were omitted.
    observables = [
        [SparsePauliOp(["XX", "IY"], [0.5, 0.5])],
        [Pauli("XX")],
        [Pauli("IY")]
    ]

    # Instantiate a new statevector simulation based estimator object.
    estimator = StatevectorEstimator()

    # Estimate the expectation value for all 300 combinations of
    # observables and parameter values, where the pub result will have
    # shape (3, 100). This shape is due to our array of parameter
    # bindings having shape (100,), combined with our array of observables
    # having shape (3, 1)
    pub = (circuit, observables, params)
    job = estimator.run([pub])

    # Extract the result for the 0th pub (this example only has one pub).
    result = job.result()[0]

    # Error-bar information is also available, but the error is 0
    # for this StatevectorEstimator.
    result.data.stds

    # Pull out the array-based expectation value estimate data from the
    # result and plot a trace for each observable.
    for idx, pauli in enumerate(observables):
        plt.plot(result.data.evs[idx], label=pauli)
    plt.legend()

### `__init__`

```python
def __init__(self, *, default_precision: float=0.0, seed: np.random.Generator | int | None=None)
```

Args:
    default_precision: The default precision for the estimator if not specified during run.
    seed: The seed or Generator object for random number generation.
        If None, a random seeded default RNG will be used.

### `default_precision`

```python
def default_precision(self) -> float
```

Return the default precision

### `seed`

```python
def seed(self) -> np.random.Generator | int | None
```

Return the seed or Generator object for random number generation.
