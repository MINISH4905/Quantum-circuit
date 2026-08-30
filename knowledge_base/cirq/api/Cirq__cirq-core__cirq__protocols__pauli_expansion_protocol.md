---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/pauli_expansion_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/pauli_expansion_protocol.py
license: Apache-2.0
---

## Module `cirq-core/cirq/protocols/pauli_expansion_protocol.py`

Protocol for obtaining expansion of linear operators in Pauli basis.

## `SupportsPauliExpansion`

```python
class SupportsPauliExpansion(Protocol)
```

An object that knows its expansion in the Pauli basis.

## `pauli_expansion`

```python
def pauli_expansion(val: Any, *, default: value.LinearDict[str] | TDefault=RaiseTypeErrorIfNotProvided, atol: float=1e-09) -> value.LinearDict[str] | TDefault
```

Returns coefficients of the expansion of val in the Pauli basis.

Args:
    val: The value whose Pauli expansion is to returned.
    default: Determines what happens when `val` does not have methods that
        allow Pauli expansion to be obtained (see below). If set, the value
        is returned in that case. Otherwise, TypeError is raised.
    atol: Ignore coefficients whose absolute value is smaller than this.

Returns:
    If `val` has a _pauli_expansion_ method, then its result is returned.
    Otherwise, if `val` has a small unitary then that unitary is expanded
    in the Pauli basis and coefficients are returned. Otherwise, if default
    is set to None or other value then default is returned. Otherwise,
    TypeError is raised.

Raises:
    TypeError: If `val` has none of the methods necessary to obtain its Pauli
        expansion and no default value has been provided.
