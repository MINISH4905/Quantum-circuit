---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/devices/superconducting_qubits_noise_properties.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/devices/superconducting_qubits_noise_properties.py
license: Apache-2.0
---

## Module `cirq-core/cirq/devices/superconducting_qubits_noise_properties.py`

Class for representing noise on a superconducting qubit device.

## `SuperconductingQubitsNoiseProperties`

```python
class SuperconductingQubitsNoiseProperties(devices.NoiseProperties, abc.ABC)
```

Noise-defining properties for a superconducting-qubit-based device.

Args:
    gate_times_ns: dict[type, float] of gate types to their duration on
        quantum hardware. Used with t(1|phi)_ns to specify thermal noise.
    t1_ns: dict[cirq.Qid, float] of qubits to their T_1 time, in ns.
    tphi_ns: dict[cirq.Qid, float] of qubits to their T_phi time, in ns.
    readout_errors: dict[cirq.Qid, list[float]] of qubits to their readout
        errors in matrix form: [P(read |1> from |0>), P(read |0> from |1>)].
        Used to prepend amplitude damping errors to measurements.
    gate_pauli_errors: dict of noise_utils.OpIdentifiers (a gate and the qubits it
        targets) to the Pauli error for that operation. Used to construct
        depolarizing error. Keys in this dict must have defined qubits.
    validate: If True, verifies that t1 and tphi qubits sets match, and
        that all symmetric two-qubit gates have errors which are
        symmetric over the qubits they affect. Defaults to True.

### `qubits`

```python
def qubits(self) -> list[cirq.Qid]
```

Qubits for which we have data

### `single_qubit_gates`

```python
def single_qubit_gates(cls) -> set[type[ops.Gate]]
```

Returns the set of single-qubit gates this class supports.

### `symmetric_two_qubit_gates`

```python
def symmetric_two_qubit_gates(cls) -> set[type[ops.Gate]]
```

Returns the set of symmetric two-qubit gates this class supports.

### `asymmetric_two_qubit_gates`

```python
def asymmetric_two_qubit_gates(cls) -> set[type[ops.Gate]]
```

Returns the set of asymmetric two-qubit gates this class supports.

### `two_qubit_gates`

```python
def two_qubit_gates(cls) -> set[type[ops.Gate]]
```

Returns the set of all two-qubit gates this class supports.

### `expected_gates`

```python
def expected_gates(cls) -> set[type[ops.Gate]]
```

Returns the set of all gates this class supports.
