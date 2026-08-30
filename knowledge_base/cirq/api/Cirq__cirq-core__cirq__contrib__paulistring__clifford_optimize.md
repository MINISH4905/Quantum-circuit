---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/paulistring/clifford_optimize.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/paulistring/clifford_optimize.py
license: Apache-2.0
---

## `clifford_optimized_circuit`

```python
def clifford_optimized_circuit(circuit: circuits.Circuit, atol: float=1e-08) -> circuits.Circuit
```

Optimizes a circuit composed of Clifford and CZ gates.

This function attempts to simplify a circuit by finding local optimizations.
It works in two stages:
1.  It converts the circuit to a target gateset consisting of
    `cirq.SingleQubitCliffordGate` and `cirq.CZPowGate` gates.
2.  It then iterates through the circuit, applying the following rules:
    -   Merges adjacent single-qubit Clifford gates.
    -   Commutes single-qubit Clifford gates past CZ gates, attempting to
        merge them with other single-qubit Clifford gates.
    -   Cancels pairs of identical CZ gates.

Args:
    circuit: The circuit to optimize.
    atol: A limit on the amount of absolute error introduced by the decomposition.

Returns:
    The optimized circuit.
