---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/uniform_superposition_gate_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/uniform_superposition_gate_test.py
license: Apache-2.0
---

## `test_generated_unitary_is_uniform`

```python
def test_generated_unitary_is_uniform(m: int, n: int) -> None
```

The code checks that the unitary matrix corresponds to the generated uniform superposition
states (see uniform_superposition_gate.py). It is enough to check that the
first colum of the unitary matrix (which corresponds to the action of the gate on
$\ket{0}^n$ is $\frac{1}{\sqrt{M}} [1 1  \cdots 1 0 \cdots 0]^T$, where the first $M$
entries are all "1"s (excluding the normalization factor of $\frac{1}{\sqrt{M}}$ and the
remaining $2^n-M$ entries are all "0"s.

## `test_incompatible_m_value_and_qubit_args`

```python
def test_incompatible_m_value_and_qubit_args(m: int, n: int) -> None
```

The code checks that test errors are raised if the arguments m (number of
superposition states and n (number of qubits) are positive integers and are compatible
 (i.e., n >= log2(m)).
