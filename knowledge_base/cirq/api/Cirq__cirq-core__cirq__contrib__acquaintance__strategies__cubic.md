---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/acquaintance/strategies/cubic.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/acquaintance/strategies/cubic.py
license: Apache-2.0
---

## `cubic_acquaintance_strategy`

```python
def cubic_acquaintance_strategy(qubits: Iterable[cirq.Qid], swap_gate: cirq.Gate=ops.SWAP) -> cirq.Circuit
```

Acquaints every triple of qubits.

Exploits the fact that in a simple linear swap network every pair of
logical qubits that starts at distance two remains so (except temporarily
near the edge), and that every third one `goes through` the pair at some
point in the network. The strategy then iterates through a series of
mappings in which qubits i and i + k are placed at distance two, for k = 1
through n / 2. Linear swap networks are used in between to effect the
permutation.
