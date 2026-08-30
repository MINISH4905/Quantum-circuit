---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/gauge_compiling/sqrt_iswap_gauge.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/gauge_compiling/sqrt_iswap_gauge.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/gauge_compiling/sqrt_iswap_gauge.py`

A Gauge transformer for SQRT_ISWAP gate.

## `RZRotation`

```python
class RZRotation(Gauge)
```

Represents a SQRT_ISWAP Gauge composed of Rz rotations.

The gauge replaces an SQRT_ISWAP gate with either
    0: ───Rz(t)───iSwap───────Rz(-t)───
                    │
    1: ───Rz(t)───iSwap^0.5───Rz(-t)───

where t is uniformly sampled from [0, 2π).

## `XYRotation`

```python
class XYRotation(Gauge)
```

Represents a SQRT_ISWAP Gauge composed of XY rotations.

The gauge replaces an SQRT_ISWAP gate with either
    0: ───XY(t)───iSwap───────XY(t)───
                    │
    1: ───XY(t)───iSwap^0.5───XY(t)───

where t is uniformly sampled from [0, 2π) and
    XY(theta) = cos(theta) X + sin(theta) Y
