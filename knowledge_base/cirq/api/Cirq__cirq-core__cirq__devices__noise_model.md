---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/devices/noise_model.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/devices/noise_model.py
license: Apache-2.0
---

## `NoiseModel`

```python
class NoiseModel(metaclass=value.ABCMetaImplementAnyOneOf)
```

Replaces operations and moments with noisy counterparts.

A child class must override *at least one* of the following three methods:

    noisy_moments
    noisy_moment
    noisy_operation

The methods that are not overridden will be implemented in terms of the ones
that are.

Simulators told to use a noise model will use these methods in order to
dynamically rewrite the program they are simulating.

### `from_noise_model_like`

```python
def from_noise_model_like(cls, noise: cirq.NOISE_MODEL_LIKE) -> cirq.NoiseModel
```

Transforms an object into a noise model if unambiguously possible.

Args:
    noise: `None`, a `cirq.NoiseModel`, or a single qubit operation.

Returns:
    `cirq.NO_NOISE` when given `None`,
    `cirq.ConstantQubitNoiseModel(gate)` when given a single qubit
    gate, or the given value if it is already a `cirq.NoiseModel`.

Raises:
    ValueError: If noise is a `cirq.Gate` that acts on more than one
        qubit.
    TypeError: The input is not a ``cirq.NOISE_MODE_LIKE``.

### `is_virtual_moment`

```python
def is_virtual_moment(self, moment: cirq.Moment) -> bool
```

Returns true iff the given moment is non-empty and all of its
operations are virtual.

Moments for which this method returns True should not have additional
noise applied to them.

Args:
    moment: ``cirq.Moment`` to check for non-virtual operations.

Returns:
    True if "moment" is non-empty and all operations in "moment" are
    virtual; false otherwise.

### `noisy_moments`

```python
def noisy_moments(self, moments: Iterable[cirq.Moment], system_qubits: Sequence[cirq.Qid]) -> Sequence[cirq.OP_TREE]
```

Adds possibly stateful noise to a series of moments.

Args:
    moments: The moments to add noise to.
    system_qubits: A list of all qubits in the system.

Returns:
    A sequence of OP_TREEs, with the k'th tree corresponding to the
    noisy operations for the k'th moment.

### `noisy_moment`

```python
def noisy_moment(self, moment: cirq.Moment, system_qubits: Sequence[cirq.Qid]) -> cirq.OP_TREE
```

Adds noise to the operations from a moment.

Args:
    moment: The moment to add noise to.
    system_qubits: A list of all qubits in the system.

Returns:
    An OP_TREE corresponding to the noisy operations for the moment.

### `noisy_operation`

```python
def noisy_operation(self, operation: cirq.Operation) -> cirq.OP_TREE
```

Adds noise to an individual operation.

Args:
    operation: The operation to make noisy.

Returns:
    An OP_TREE corresponding to the noisy operations implementing the
    noisy version of the given operation.

## `ConstantQubitNoiseModel`

```python
class ConstantQubitNoiseModel(NoiseModel)
```

Applies noise to each qubit individually at the start of every moment.

This is the noise model that is wrapped around an operation when that
operation is given as "the noise to use" for a `NOISE_MODEL_LIKE` parameter.

### `__init__`

```python
def __init__(self, qubit_noise_gate: cirq.Gate, prepend: bool=False)
```

Noise model which applies a specific gate as noise to all gates.

Args:
    qubit_noise_gate: The "noise" gate to use.
    prepend: If True, put noise before affected gates. Default: False.

Raises:
    ValueError: if qubit_noise_gate is not a single-qubit gate.

## `validate_all_measurements`

```python
def validate_all_measurements(moment: cirq.Moment) -> bool
```

Ensures that the moment is homogenous and returns whether all ops are measurement gates.

Args:
    moment: the moment to be checked
Returns:
    bool: True if all operations are measurements, False if none of them are
Raises:
    ValueError: If a moment is a mixture of measurement and non-measurement gates.
