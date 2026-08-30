---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/eject_z.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/eject_z.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/eject_z.py`

Transformer pass that pushes Z gates later and later in the circuit.

## `eject_z`

```python
def eject_z(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, atol: float=0.0, eject_parameterized: bool=False) -> cirq.Circuit
```

Pushes Z gates towards the end of the circuit.

As the Z gates get pushed they may absorb other Z gates, get absorbed into
measurements, cross CZ gates, cross PhasedXPowGate (aka W) gates (by phasing them), etc.

Args:
      circuit: Input circuit to transform.
      context: `cirq.TransformerContext` storing common configurable options for transformers.
      atol: Maximum absolute error tolerance. The optimization is
           permitted to simply drop negligible combinations of Z gates,
           with a threshold determined by this tolerance.
      eject_parameterized: If True, the optimization will attempt to eject
          parameterized Z gates as well.  This may result in other gates
          parameterized by symbolic expressions.
Returns:
    Copy of the transformed input circuit.
