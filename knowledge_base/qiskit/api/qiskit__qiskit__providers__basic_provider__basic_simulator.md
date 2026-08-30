---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/providers/basic_provider/basic_simulator.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/providers/basic_provider/basic_simulator.py
license: Apache-2.0
---

## Module `qiskit/providers/basic_provider/basic_simulator.py`

Contains a (slow) Python simulator.

It simulates a quantum circuit (an experiment) that has been compiled
to run on the simulator. It is exponential in the number of qubits.

The simulator is run using

.. plot::
   :include-source:
   :nofigs:

   BasicSimulator().run(run_input)

Where the input is a :class:`.QuantumCircuit` object and the output is a
:class:`.BasicProviderJob` object,
which can later be queried for the Result object. The result will contain a 'memory' data
field, which is a result of measurements for each shot.

## `BasicSimulator`

```python
class BasicSimulator(BackendV2)
```

Python implementation of a basic (non-efficient) quantum simulator.

The simulator supports up to 24 qubits for statevector simulation and up to
2048 qubits for Clifford/Stabilizer simulation.

### `__init__`

```python
def __init__(self, provider=None, target: Target | None=None, **fields) -> None
```

Args:
    provider: An optional backwards reference to the provider object that the backend
        is from.
    target: An optional target to configure the simulator.
    fields: kwargs for the values to use to override the default
        options.

Raises:
    AttributeError: If a field is specified that's outside the backend's
        options.

### `run`

```python
def run(self, run_input: QuantumCircuit | list[QuantumCircuit], **run_options) -> BasicProviderJob
```

Run on the backend.

Args:
    run_input (QuantumCircuit or list): the QuantumCircuit (or list
        of QuantumCircuit objects) to run
    run_options (kwargs): additional runtime backend options

Returns:
    BasicProviderJob: derived from BaseJob

Additional Information:
    * kwarg options specified in ``run_options`` will temporarily override
      any set options of the same name for the current run. These may include:

        * "initial_statevector": vector-like. The "initial_statevector"
          option specifies a custom initial statevector to be used instead
          of the all-zero state. The size of this vector must correspond to
          the number of qubits in the ``run_input`` argument.

        * "seed_simulator": int. This is the internal seed for sample
          generation.

        * "shots": int. Number of shots used in the simulation.

        * "memory": bool. If True, the result will contain the results
          of every individual shot simulation.

        * "use_clifford_optimization": bool. If True, enables Clifford
          circuit optimization using stabilizer formalism. Default: False.

    Example::

        backend.run(
            circuit_2q,
            initial_statevector = np.array([1, 0, 0, 1j]) / math.sqrt(2)
        )
