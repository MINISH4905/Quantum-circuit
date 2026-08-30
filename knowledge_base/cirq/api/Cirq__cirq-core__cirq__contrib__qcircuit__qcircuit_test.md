---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/qcircuit/qcircuit_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/qcircuit/qcircuit_test.py
license: Apache-2.0
---

## `assert_has_qcircuit_diagram`

```python
def assert_has_qcircuit_diagram(actual: cirq.Circuit, desired: str, **kwargs) -> None
```

Determines if a given circuit has the desired qcircuit diagram.

Args:
    actual: The circuit that was actually computed by some process.
    desired: The desired qcircuit diagram as a string. Newlines at the
        beginning and whitespace at the end are ignored.
    **kwargs: Keyword arguments to be passed to
        circuit_to_latex_using_qcircuit.
