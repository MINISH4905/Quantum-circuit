---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/gauge_compiling/cphase_gauge.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/gauge_compiling/cphase_gauge.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/gauge_compiling/cphase_gauge.py`

A Gauge Transformer for the cphase gate.

## `CPhasePauliGauge`

```python
class CPhasePauliGauge(Gauge)
```

Gauges for the cphase gate (CZPowGate).

We identify 16 distinct gauges, corresponding to the 16 two-qubit Pauli operators that can be
inserted before the cphase gate. When an anticommuting gate is inserted, the cphase angle is
negated (or equivalently, the exponent of the CZPowGate is negated), so both postive and
negative angles should be calibrated to use this.

### `sample`

```python
def sample(self, gate: ops.Gate, prng: np.random.Generator) -> ConstantGauge
```

Sample the 16 cphase gauges at random.

Args:
    gate: The CZPowGate to transform.
    prng: The pseudorandom number generator.

Returns:
    A ConstantGauge implementing the transformation.

Raises:
    TypeError: if gate is not a CZPowGate
