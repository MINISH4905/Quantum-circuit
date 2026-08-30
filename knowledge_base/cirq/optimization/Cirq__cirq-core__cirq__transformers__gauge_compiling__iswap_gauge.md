---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/gauge_compiling/iswap_gauge.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/gauge_compiling/iswap_gauge.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/gauge_compiling/iswap_gauge.py`

A Gauge transformer for ISWAP gate.

## `RZRotation`

```python
class RZRotation(Gauge)
```

Represents an ISWAP Gauge composed of Rz rotations.

The gauge replaces an ISWAP gate with either
    0: ───Rz(t)──────iSwap───Rz(sgn*t)───
                        │
    1: ───Rz(-sgn*t)───iSwap───Rz(-t)───

where t is uniformly sampled from [0, 2π) and sgn is uniformly sampled from {-1, 1}.

## `XYRotation`

```python
class XYRotation(Gauge)
```

Represents an ISWAP Gauge composed of XY rotations.

The gauge replaces an ISWAP gate with either
    0: ───XY(a)───iSwap───XY(b)───
                    │
    1: ───XY(b)───iSwap───XY(a)───

where a and b are uniformly sampled from [0, 2π) and XY is a single-qubit rotation defined as
    XY(theta) = cos(theta) X + sin(theta) Y
