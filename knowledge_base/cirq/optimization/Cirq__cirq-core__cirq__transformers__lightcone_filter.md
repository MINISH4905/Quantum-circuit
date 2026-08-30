---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/lightcone_filter.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/lightcone_filter.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/lightcone_filter.py`

Transformer to remove gates that are outside of the backwards lightcone of measurements.

## `lightcone_filter`

```python
def lightcone_filter(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None) -> cirq.Circuit
```

Apply a lightcone filter to the input circuit.

Returns:
    A copy of the original circuit, with gates outside of the backwards lightcone of
    measurements removed.
