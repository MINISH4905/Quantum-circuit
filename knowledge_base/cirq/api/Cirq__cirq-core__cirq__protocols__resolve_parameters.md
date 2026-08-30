---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/resolve_parameters.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/resolve_parameters.py
license: Apache-2.0
---

## `SupportsParameterization`

```python
class SupportsParameterization(Protocol)
```

An object that can be parameterized by Symbols and resolved
via a ParamResolver

## `is_parameterized`

```python
def is_parameterized(val: Any) -> bool
```

Returns whether the object is parameterized with any Symbols.

A value is parameterized when it has an `_is_parameterized_` method and
that method returns a truthy value, or if the value is an instance of
sympy.Basic. Note this covers sympy constants such as `sympy.pi`.

Returns:
    True if the gate has any unresolved Symbols
    and False otherwise. If no implementation of the magic
    method above exists or if that method returns NotImplemented,
    this will default to False.

## `parameter_names`

```python
def parameter_names(val: Any) -> Set[str]
```

Returns parameter names for this object.

Args:
    val: Object for which to find the parameter names.
    check_symbols: If true, fall back to calling parameter_symbols.

Returns:
    A set of parameter names if the object is parameterized. It the object
    does not implement the _parameter_names_ magic method or that method
    returns NotImplemented, returns an empty set.

## `parameter_symbols`

```python
def parameter_symbols(val: Any) -> Set[sympy.Symbol]
```

Returns parameter symbols for this object.

Args:
    val: Object for which to find the parameter symbols.

Returns:
    A set of parameter symbols if the object is parameterized. It the object
    does not implement the _parameter_symbols_ magic method or that method
    returns NotImplemented, returns an empty set.

## `resolve_parameters`

```python
def resolve_parameters(val: T, param_resolver: cirq.ParamResolverOrSimilarType, recursive: bool=True) -> T
```

Resolves symbol parameters in the effect using the param resolver.

This function will use the `_resolve_parameters_` magic method
of `val` to resolve any Symbols with concrete values from the given
parameter resolver.

Args:
    val: The object to resolve (e.g. the gate, operation, etc)
    param_resolver: the object to use for resolving all symbols
    recursive: if True, resolves parameters recursively over the
        resolver; otherwise performs a single resolution step.

Returns:
    a gate or operation of the same type, but with all Symbols
    replaced with floats or terminal symbols according to the
    given `cirq.ParamResolver`. If `val` has no `_resolve_parameters_`
    method or if it returns NotImplemented, `val` itself is returned.
    Note that in some cases, such as when directly resolving a sympy
    Symbol, the return type could differ from the input type; however,
    for the much more common case of resolving parameters on cirq
    objects (or if resolving a Union[Symbol, float] instead of just a
    Symbol), the return type will be the same as val so we reflect
    that in the type signature of this protocol function.

Raises:
    RecursionError if the ParamResolver detects a loop in resolution.
    ValueError if `recursive=False` is passed to an external
        _resolve_parameters_ method with no `recursive` parameter.

## `resolve_parameters_once`

```python
def resolve_parameters_once(val: T, param_resolver: cirq.ParamResolverOrSimilarType) -> T
```

Performs a single parameter resolution step using the param resolver.
