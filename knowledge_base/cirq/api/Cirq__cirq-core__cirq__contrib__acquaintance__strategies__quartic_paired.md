---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/acquaintance/strategies/quartic_paired.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/acquaintance/strategies/quartic_paired.py
license: Apache-2.0
---

## `qubit_pairs_to_qubit_order`

```python
def qubit_pairs_to_qubit_order(qubit_pairs: Sequence[Sequence[cirq.Qid]]) -> list[cirq.Qid]
```

Takes a sequence of qubit pairs and returns a sequence in which every
pair is at distance two.

Specifically, given pairs (1a, 1b), (2a, 2b), etc. returns
(1a, 2a, 1b, 2b, 3a, 4a, 3b, 4b, ...).

## `quartic_paired_acquaintance_strategy`

```python
def quartic_paired_acquaintance_strategy(qubit_pairs: Iterable[tuple[cirq.Qid, cirq.Qid]]) -> tuple[cirq.Circuit, Sequence[cirq.Qid]]
```

Acquaintance strategy for pairs of pairs.

Implements UpCCGSD ansatz from arXiv:1810.02327.
