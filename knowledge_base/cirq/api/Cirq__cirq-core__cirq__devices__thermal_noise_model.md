---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/devices/thermal_noise_model.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/devices/thermal_noise_model.py
license: Apache-2.0
---

## `ThermalNoiseModel`

```python
class ThermalNoiseModel(devices.NoiseModel)
```

NoiseModel representing simulated thermalization of a qubit.

This model is designed for qubits which use energy levels as their states.
"Heating" and "cooling" here are used to refer to environmental noise which
transitions a qubit to higher or lower energy levels, respectively.

### `__init__`

```python
def __init__(self, qubits: set[cirq.Qid], gate_durations_ns: dict[type, float], heat_rate_GHz: float | dict[cirq.Qid, float] | None=None, cool_rate_GHz: float | dict[cirq.Qid, float] | None=None, dephase_rate_GHz: float | dict[cirq.Qid, float] | None=None, require_physical_tag: bool=True, skip_measurements: bool=True, prepend: bool=False)
```

Construct a ThermalNoiseModel data object.

Required Args:
    qubits: Set of all qubits in the system.
    gate_durations_ns: Map of gate types to their duration in
        nanoseconds. These values will override default values for
        gate duration, if any (e.g. WaitGate).
Optional Args:
    heat_rate_GHz: single number (units GHz) specifying heating rate,
        either per qubit, or global value for all.
        Given a rate gh, the Lindblad op will be sqrt(gh)*a^dag
        (where a is annihilation), so that the heating Lindbladian is
        gh(a^dag • a - 0.5{a*a^dag, •}).
    cool_rate_GHz: single number (units GHz) specifying cooling rate,
        either per qubit, or global value for all.
        Given a rate gc, the Lindblad op will be sqrt(gc)*a
        so that the cooling Lindbladian is gc(a • a^dag - 0.5{n, •})
        This number is equivalent to 1/T1.
    dephase_rate_GHz: single number (units GHz) specifying dephasing
        rate, either per qubit, or global value for all.
        Given a rate gd, Lindblad op will be sqrt(2*gd)*n where
        n = a^dag * a, so that the dephasing Lindbladian is
        2 * gd * (n • n - 0.5{n^2, •}).
        This number is equivalent to 1/Tphi.
    require_physical_tag: whether to only apply noise to operations
        tagged with PHYSICAL_GATE_TAG.
    skip_measurements: whether to skip applying noise to measurements.
    prepend: If True, put noise before affected gates. Default: False.

Returns:
    The ThermalNoiseModel with specified parameters.
