---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/merge_k_qubit_gates.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/merge_k_qubit_gates.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/merge_k_qubit_gates.py`

Transformer pass to merge connected components of k-qubit unitary operations.

## `merge_k_qubit_unitaries`

```python
def merge_k_qubit_unitaries(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, k: int=0, rewriter: Callable[[cirq.CircuitOperation], cirq.OP_TREE] | None=None) -> cirq.Circuit
```

Merges connected components of unitary operations, acting on <= k qubits.

Uses rewriter to convert a connected component of unitary operations acting on <= k-qubits
into a more desirable form. If not specified, connected components are replaced by a single
`cirq.MatrixGate` containing unitary matrix of the merged component.

Args:
    circuit: Input circuit to transform. It will not be modified.
    context: `cirq.TransformerContext` storing common configurable options for transformers.
    k: Connected components of unitary operations acting on <= k qubits are merged.
    rewriter: Callable type that takes a `cirq.CircuitOperation`, encapsulating a connected
        component of unitary operations acting on <= k qubits, and produces a `cirq.OP_TREE`.
        Specifies how to merge the connected component into a more desirable form.

Returns:
    Copy of the transformed input circuit.

Raises:
    ValueError: If k <= 0
