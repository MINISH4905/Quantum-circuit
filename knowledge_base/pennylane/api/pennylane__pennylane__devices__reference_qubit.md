---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/reference_qubit.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/reference_qubit.py
license: Apache-2.0
---

## Module `pennylane/devices/reference_qubit.py`

Contains the ReferenceQubit device, a minimal device that can be used for testing
and plugin development purposes.

## `sample_state`

```python
def sample_state(state: np.ndarray, shots: int, seed=None)
```

Generate samples from the provided state and number of shots.

## `simulate`

```python
def simulate(tape: QuantumScript, seed=None) -> Result
```

Simulate a tape and turn it into results.

Args:
    tape (.QuantumTape): a representation of a circuit
    seed (Any): A seed to use to control the generation of samples.

## `supports_operation`

```python
def supports_operation(op: Operator) -> bool
```

This function used by preprocessing determines what operations
are natively supported by the device.

While in theory ``simulate`` can support any operation with a matrix, we limit the target
gate set for improved testing and reference purposes.

## `ReferenceQubit`

```python
class ReferenceQubit(Device)
```

A slimmed down numpy-based simulator for reference and testing purposes.

Args:
    wires (int, Iterable[Number, str]): Number of wires present on the device, or iterable that
        contains unique labels for the wires as numbers (i.e., ``[-1, 0, 2]``) or strings
        (``['aux', 'q1', 'q2']``). Default ``None`` if not specified. While this device allows
        for ``wires`` to be unspecified at construction time, other devices may make this argument
        mandatory. Devices can also implement additional restrictions on the possible wires.
    shots (int, Sequence[int], Sequence[Union[int, Sequence[int]]]): The default number of shots
        to use in executions involving this device. Note that during execution, shots
        are pulled from the circuit, not from the device.
    seed (Union[str, None, int, array_like[int], SeedSequence, BitGenerator, Generator, jax.random.PRNGKey]): A
        seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``. This is an optional
        keyword argument added to follow recommend NumPy best practices. Other devices do not need
        this parameter if it does not make sense for them.
