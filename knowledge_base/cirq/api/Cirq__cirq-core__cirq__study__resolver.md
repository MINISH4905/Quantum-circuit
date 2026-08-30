---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/study/resolver.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/study/resolver.py
license: Apache-2.0
---

## Module `cirq-core/cirq/study/resolver.py`

Resolves ParameterValues to assigned values.

## `symbol`

```python
def symbol(name: str) -> sympy.Symbol
```

Creates a sympy Symbol for use in sweeps.

We export this from cirq to allow constructing basic parametrizable objects
without additional imports beyond cirq itself.

## `ParamResolver`

```python
class ParamResolver
```

Resolves parameters to actual values.

A parameter is a variable whose value has not been determined.
A ParamResolver is an object that can be used to assign values for these
variables.

ParamResolvers are hashable; their param_dict must not be mutated.

Attributes:
    param_dict: A dictionary from the ParameterValue key (str) to its
        assigned value.

Raises:
    TypeError if formulas are passed as keys.

### `value_of`

```python
def value_of(self, value: cirq.TParamKey | cirq.TParamValComplex, recursive: bool=True) -> cirq.TParamValComplex
```

Attempt to resolve a parameter to its assigned value.

Scalars are returned without modification.  Strings are resolved via
the parameter dictionary with exact match only.  Otherwise, strings
are considered to be sympy.Symbols with the name as the input string.

A sympy.Symbol is first checked for exact match in the parameter
dictionary. Otherwise, it is treated as a sympy.Basic.

A sympy.Basic is resolved using sympy substitution.

Note that passing a formula to this resolver can be slow due to the
underlying sympy library.  For circuits relying on quick performance,
it is recommended that all formulas are flattened before-hand using
cirq.flatten or other means so that formula resolution is avoided.
If unable to resolve a sympy.Symbol, returns it unchanged.
If unable to resolve a name, returns a sympy.Symbol with that name.

Args:
    value: The parameter to try to resolve.
    recursive: Whether to recursively evaluate formulas.

Returns:
    The value of the parameter as resolved by this resolver.

Raises:
    RecursionError: If the ParamResolver detects a loop in recursive
        resolution.
    sympy.SympifyError: If the resulting value cannot be interpreted.
