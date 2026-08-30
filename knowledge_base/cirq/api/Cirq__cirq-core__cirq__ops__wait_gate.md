---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/wait_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/wait_gate.py
license: Apache-2.0
---

## `WaitGate`

```python
class WaitGate(raw_types.Gate)
```

An idle gate that represents waiting.

In non-noisy simulators, this gate is just an identity gate. But noisy
simulators and noise models may insert more error for longer waits.

### `__init__`

```python
def __init__(self, duration: cirq.DURATION_LIKE | int, num_qubits: int | None=None, qid_shape: tuple[int, ...] | None=None) -> None
```

Initialize a wait gate with the given duration.

Args:
    duration: A constant or parameterized wait duration. This can be
        an instance of `datetime.timedelta` or `cirq.Duration`.
    num_qubits: The number of qubits the gate operates on. If None and `qid_shape` is None,
        this defaults to one qubit.
    qid_shape: Can be specified instead of `num_qubits` for the case that the gate should
        act on qudits.

Raises:
    ValueError: If the `qid_shape` provided is empty or `num_qubits` contradicts
        `qid_shape`.

## `wait`

```python
def wait(*target: cirq.Qid, duration: cirq.DURATION_LIKE=None, picos: cirq.TParamVal=0, nanos: cirq.TParamVal=0, micros: cirq.TParamVal=0, millis: cirq.TParamVal=0) -> raw_types.Operation
```

Creates a WaitGate applied to all the given qubits.

The duration can be specified as a DURATION_LIKE or using keyword args with
numbers in the appropriate units. See Duration for details.

Args:
    *target: The qubits that should wait.
    duration: Wait duration (see Duration).
    picos: Picoseconds to wait (see Duration).
    nanos: Nanoseconds to wait (see Duration).
    micros: Microseconds to wait (see Duration).
    millis: Milliseconds to wait (see Duration).
