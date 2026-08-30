---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/equivalent_basis_map.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/equivalent_basis_map.py
license: Apache-2.0
---

## `assert_equivalent_computational_basis_map`

```python
def assert_equivalent_computational_basis_map(maps: dict[int, int], circuit: circuits.Circuit) -> None
```

Ensure equivalence of basis state mapping.

Args:
    maps: dictionary of test computational basis input states and
        the output computational basis states that they should be mapped to.
        The states are specified using little endian convention, meaning
        that the last bit of a binary literal will refer to the last qubit's
        value.
    circuit: the circuit to be tested
Raises:
    AssertionError: Raised in case any basis state is mapped to the wrong
        basis state.
