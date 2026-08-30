---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/equivalent_repr_eval.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/equivalent_repr_eval.py
license: Apache-2.0
---

## `assert_equivalent_repr`

```python
def assert_equivalent_repr(value: Any, *, setup_code: str='import cirq\nimport numpy as np\nimport sympy\nimport pandas as pd\nimport datetime\n', global_vals: dict[str, Any] | None=None, local_vals: dict[str, Any] | None=None) -> None
```

Checks that eval(repr(v)) == v.

Args:
    value: A value whose repr should be evaluatable python
        code that produces an equivalent value.
    setup_code: Code that must be executed before the repr can be evaluated.
        Ideally this should just be a series of 'import' lines.
    global_vals: Pre-defined values that should be in the global scope when
        evaluating the repr.
    local_vals: Pre-defined values that should be in the local scope when
        evaluating the repr.

Raises:
    AssertionError: If the assertion fails, or eval(repr(value)) raises an error.
