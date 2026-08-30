---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/transpiler/timing_constraints.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/timing_constraints.py
license: Apache-2.0
---

## Module `qiskit/transpiler/timing_constraints.py`

Timing Constraints class.

## `TimingConstraints`

```python
class TimingConstraints
```

Hardware Instruction Timing Constraints.

### `__init__`

```python
def __init__(self, granularity: int=1, min_length: int=1, pulse_alignment: int=1, acquire_alignment: int=1)
```

Initialize a TimingConstraints object

Args:
    granularity: An integer value representing minimum pulse gate
        resolution in units of ``dt``. A user-defined pulse gate should have
        duration of a multiple of this granularity value.
    min_length: An integer value representing minimum pulse gate
        length in units of ``dt``. A user-defined pulse gate should be longer
        than this length.
    pulse_alignment: An integer value representing a time resolution of gate
        instruction starting time. Gate instruction should start at time which
        is a multiple of the alignment value.
    acquire_alignment: An integer value representing a time resolution of measure
        instruction starting time. Measure instruction should start at time which
        is a multiple of the alignment value.

Notes:
    This information will be provided by the backend configuration.

Raises:
    TranspilerError: When any invalid constraint value is passed.
