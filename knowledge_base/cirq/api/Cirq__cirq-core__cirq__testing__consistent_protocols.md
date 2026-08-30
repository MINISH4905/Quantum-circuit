---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/consistent_protocols.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/consistent_protocols.py
license: Apache-2.0
---

## `assert_implements_consistent_protocols`

```python
def assert_implements_consistent_protocols(val: Any, *, exponents: Sequence[Any]=(0, 1, -1, 0.25, sympy.Symbol('s')), qubit_count: int | None=None, ignoring_global_phase: bool=False, setup_code: str='import cirq\nimport numpy as np\nimport sympy', global_vals: dict[str, Any] | None=None, local_vals: dict[str, Any] | None=None, ignore_decompose_to_default_gateset: bool=False) -> None
```

Checks that a value is internally consistent and has a good __repr__.

## `assert_eigengate_implements_consistent_protocols`

```python
def assert_eigengate_implements_consistent_protocols(eigen_gate_type: type[ops.EigenGate], *, exponents: Sequence[value.TParamVal]=(0, 1, -1, 0.25, sympy.Symbol('s')), global_shifts: Sequence[float]=(0, -0.5, 0.1), qubit_count: int | None=None, ignoring_global_phase: bool=False, setup_code: str='import cirq\nimport numpy as np\nimport sympy', global_vals: dict[str, Any] | None=None, local_vals: dict[str, Any] | None=None, ignore_decompose_to_default_gateset: bool=False) -> None
```

Checks that an EigenGate subclass is internally consistent and has a
good __repr__.
