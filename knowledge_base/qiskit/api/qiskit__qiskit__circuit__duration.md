---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/duration.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/duration.py
license: Apache-2.0
---

## Module `qiskit/circuit/duration.py`

Utilities for handling duration of a circuit instruction.

## `duration_in_dt`

```python
def duration_in_dt(duration_in_sec: float, dt_in_sec: float) -> int
```

Return duration in dt.

Args:
    duration_in_sec: duration [s] to be converted.
    dt_in_sec: duration of dt in seconds used for conversion.

Returns:
    Duration in dt.

## `convert_durations_to_dt`

```python
def convert_durations_to_dt(qc: QuantumCircuit, dt_in_sec: float, inplace=True)
```

Convert all the durations in SI (seconds) into those in dt.

Returns a new circuit if `inplace=False`.

Args:
    qc (QuantumCircuit): Duration of dt in seconds used for conversion.
    dt_in_sec (float): Duration of dt in seconds used for conversion.
    inplace (bool): All durations are converted inplace or return new circuit.

Returns:
    QuantumCircuit: Converted circuit if `inplace = False`, otherwise None.

Raises:
    CircuitError: if fail to convert durations.
