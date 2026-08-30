---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/dynamical_decoupling.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/dynamical_decoupling.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/dynamical_decoupling.py`

Transformer pass that adds dynamical decoupling operations to a circuit.

## `add_dynamical_decoupling`

```python
def add_dynamical_decoupling(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, schema: str | tuple[ops.Gate, ...]='DEFAULT', single_qubit_gate_moments_only: bool=True) -> cirq.Circuit
```

Adds dynamical decoupling gate operations to a given circuit.
This transformer preserves the structure of the original circuit.

Args:
      circuit: Input circuit to transform.
      context: `cirq.TransformerContext` storing common configurable options for transformers.
      schema: Dynamical decoupling schema name or a dynamical decoupling sequence.
        If a schema is specified, the provided dynamical decoupling sequence will be used.
        Otherwise, customized dynamical decoupling sequence will be applied.
      single_qubit_gate_moments_only: If set True, dynamical decoupling operation will only be
        added in single-qubit gate moments.

Returns:
      A copy of the input circuit with dynamical decoupling operations.
