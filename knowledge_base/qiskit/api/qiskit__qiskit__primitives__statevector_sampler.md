---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/statevector_sampler.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/statevector_sampler.py
license: Apache-2.0
---

## Module `qiskit/primitives/statevector_sampler.py`

Statevector Sampler V2 class

## `StatevectorSampler`

```python
class StatevectorSampler(BaseSamplerV2)
```

Simple implementation of :class:`BaseSamplerV2` using full state vector simulation.

This class is implemented via :class:`~.Statevector` which turns provided circuits into
pure state vectors, and is therefore incompatible with mid-circuit measurements (although
other implementations may be).

As seen in the example below, this sampler supports providing arrays of parameter value sets to
bind against a single circuit.

Each tuple of ``(circuit, <optional> parameter values, <optional> shots)``, called a sampler
primitive unified bloc (PUB), produces its own array-valued result. The :meth:`~run` method can
be given many pubs at once.

.. plot::
   :include-source:
   :nofigs:

    from qiskit.circuit import (
        Parameter, QuantumCircuit, ClassicalRegister, QuantumRegister
    )
    from qiskit.primitives import StatevectorSampler

    import matplotlib.pyplot as plt
    import numpy as np

    # Define our circuit registers, including classical registers
    # called 'alpha' and 'beta'.
    qreg = QuantumRegister(3)
    alpha = ClassicalRegister(2, "alpha")
    beta = ClassicalRegister(1, "beta")

    # Define a quantum circuit with two parameters.
    circuit = QuantumCircuit(qreg, alpha, beta)
    circuit.h(0)
    circuit.cx(0, 1)
    circuit.cx(1, 2)
    circuit.ry(Parameter("a"), 0)
    circuit.rz(Parameter("b"), 0)
    circuit.cx(1, 2)
    circuit.cx(0, 1)
    circuit.h(0)
    circuit.measure([0, 1], alpha)
    circuit.measure([2], beta)

    # Define a sweep over parameter values, where the second axis is over
    # the two parameters in the circuit.
    params = np.vstack([
        np.linspace(-np.pi, np.pi, 100),
        np.linspace(-4 * np.pi, 4 * np.pi, 100)
    ]).T

    # Instantiate a new statevector simulation based sampler object.
    sampler = StatevectorSampler()

    # Start a job that will return shots for all 100 parameter value sets.
    pub = (circuit, params)
    job = sampler.run([pub], shots=256)

    # Extract the result for the 0th pub (this example only has one pub).
    result = job.result()[0]

    # There is one BitArray object for each ClassicalRegister in the
    # circuit. Here, we can see that the BitArray for alpha contains data
    # for all 100 sweep points, and that it is indeed storing data for 2
    # bits over 256 shots.
    assert result.data.alpha.shape == (100,)
    assert result.data.alpha.num_bits == 2
    assert result.data.alpha.num_shots == 256

    # We can work directly with a binary array in performant applications.
    raw = result.data.alpha.array

    # For small registers where it is anticipated to have many counts
    # associated with the same bitstrings, we can turn the data from,
    # for example, the 22nd sweep index into a dictionary of counts.
    counts = result.data.alpha.get_counts(22)

    # Or, convert into a list of bitstrings that preserve shot order.
    bitstrings = result.data.alpha.get_bitstrings(22)
    print(bitstrings)

### `__init__`

```python
def __init__(self, *, default_shots: int=1024, seed: np.random.Generator | int | None=None)
```

Args:
    default_shots: The default shots for the sampler if not specified during run.
    seed: The seed or Generator object for random number generation.
        If None, a random seeded default RNG will be used.

### `default_shots`

```python
def default_shots(self) -> int
```

Return the default shots

### `seed`

```python
def seed(self) -> np.random.Generator | int | None
```

Return the seed or Generator object for random number generation.
