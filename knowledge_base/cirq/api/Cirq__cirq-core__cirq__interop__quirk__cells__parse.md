---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/interop/quirk/cells/parse.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/interop/quirk/cells/parse.py
license: Apache-2.0
---

## `parse_matrix`

```python
def parse_matrix(text: str) -> np.ndarray
```

Attempts to parse a complex matrix in exactly the same way as Quirk.

## `parse_complex`

```python
def parse_complex(text: str) -> complex
```

Attempts to parse a complex number in exactly the same way as Quirk.

## `parse_formula`

```python
def parse_formula(formula: str) -> float | sympy.Expr
```

Attempts to parse formula text in exactly the same way as Quirk.
