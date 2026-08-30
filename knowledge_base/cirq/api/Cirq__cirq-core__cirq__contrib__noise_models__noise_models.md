---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/noise_models/noise_models.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/noise_models/noise_models.py
license: Apache-2.0
---

## `DepolarizingNoiseModel`

```python
class DepolarizingNoiseModel(devices.NoiseModel)
```

Applies depolarizing noise to each qubit individually at the end of
every moment.

If a circuit contains measurements, they must be in moments that don't
also contain gates.

### `__init__`

```python
def __init__(self, depol_prob: float, prepend: bool=False)
```

A depolarizing noise model

Args:
    depol_prob: Depolarizing probability.
    prepend: If True, put noise before affected gates. Default: False.

### `depol_prob`

```python
def depol_prob(self) -> float
```

The depolarizing probability.

## `ReadoutNoiseModel`

```python
class ReadoutNoiseModel(devices.NoiseModel)
```

NoiseModel with probabilistic bit flips preceding measurement.

This simulates readout error. Note that since noise is applied before the
measurement moment, composing this model on top of another noise model will
place the bit flips immediately before the measurement (regardless of the
previously-added noise).

If a circuit contains measurements, they must be in moments that don't
also contain gates.

### `__init__`

```python
def __init__(self, bitflip_prob: float, prepend: bool=True)
```

A noise model with readout error.

Args:
    bitflip_prob: Probability of a bit-flip during measurement.
    prepend: If True, put noise before affected gates. Default: True.

### `bitflip_prob`

```python
def bitflip_prob(self) -> float
```

The probability of a bit-flip during measurement.

## `DampedReadoutNoiseModel`

```python
class DampedReadoutNoiseModel(devices.NoiseModel)
```

NoiseModel with T1 decay preceding measurement.

This simulates asymmetric readout error. Note that since noise is applied
before the measurement moment, composing this model on top of another noise
model will place the T1 decay immediately before the measurement
(regardless of the previously-added noise).

If a circuit contains measurements, they must be in moments that don't
also contain gates.

### `__init__`

```python
def __init__(self, decay_prob: float, prepend: bool=True)
```

A depolarizing noise model with damped readout error.

Args:
    decay_prob: Probability of T1 decay during measurement.
    prepend: If True, put noise before affected gates. Default: True.

### `decay_prob`

```python
def decay_prob(self) -> float
```

The probability of T1 decay during measurement.

## `DepolarizingWithReadoutNoiseModel`

```python
class DepolarizingWithReadoutNoiseModel(devices.NoiseModel)
```

DepolarizingNoiseModel with probabilistic bit flips preceding
measurement.
This simulates readout error.
If a circuit contains measurements, they must be in moments that don't
also contain gates.

### `__init__`

```python
def __init__(self, depol_prob: float, bitflip_prob: float)
```

A depolarizing noise model with readout error.
Args:
    depol_prob: Depolarizing probability.
    bitflip_prob: Probability of a bit-flip during measurement.

### `depol_prob`

```python
def depol_prob(self) -> float
```

The depolarizing probability.

### `bitflip_prob`

```python
def bitflip_prob(self) -> float
```

The probability of a bit-flip during measurement.

## `DepolarizingWithDampedReadoutNoiseModel`

```python
class DepolarizingWithDampedReadoutNoiseModel(devices.NoiseModel)
```

DepolarizingWithReadoutNoiseModel with T1 decay preceding
measurement.
This simulates asymmetric readout error. The noise is structured
so the T1 decay is applied, then the readout bitflip, then measurement.
If a circuit contains measurements, they must be in moments that don't
also contain gates.

### `__init__`

```python
def __init__(self, depol_prob: float, bitflip_prob: float, decay_prob: float)
```

A depolarizing noise model with damped readout error.
Args:
    depol_prob: Depolarizing probability.
    bitflip_prob: Probability of a bit-flip during measurement.
    decay_prob: Probability of T1 decay during measurement.
        Bitflip noise is applied first, then amplitude decay.

### `depol_prob`

```python
def depol_prob(self) -> float
```

The depolarizing probability.

### `bitflip_prob`

```python
def bitflip_prob(self) -> float
```

Probability of a bit-flip during measurement.

### `decay_prob`

```python
def decay_prob(self) -> float
```

The probability of T1 decay during measurement.
