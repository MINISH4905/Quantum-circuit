---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/stratify_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/stratify_test.py
license: Apache-2.0
---

## `test_greedy_merging`

```python
def test_greedy_merging()
```

Tests a tricky situation where the algorithm of "Merge single-qubit
gates, greedily align single-qubit then 2-qubit operations" doesn't work.
Our algorithm succeeds because we also run it in reverse order.

## `test_greedy_merging_reverse`

```python
def test_greedy_merging_reverse()
```

Same as the above test, except that the aligning is done in reverse.

## `test_complex_circuit`

```python
def test_complex_circuit()
```

Tests that a complex circuit is correctly optimized.

## `test_heterogeneous_circuit`

```python
def test_heterogeneous_circuit()
```

Tests that a circuit that is very heterogeneous is correctly optimized
