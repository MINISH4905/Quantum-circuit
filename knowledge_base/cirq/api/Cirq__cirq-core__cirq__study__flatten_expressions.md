---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/study/flatten_expressions.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/study/flatten_expressions.py
license: Apache-2.0
---

## Module `cirq-core/cirq/study/flatten_expressions.py`

Resolves symbolic expressions to unique symbols.

## `flatten`

```python
def flatten(val: Any) -> tuple[Any, ExpressionMap]
```

Creates a copy of `val` with any symbols or expressions replaced with
new symbols.  `val` can be a `Circuit`, `Gate`, `Operation`, or other
type.

`flatten` goes through every parameter in `val` and does the following:
- If the parameter is a number, don't change it.
- If the parameter is a symbol, don't change it.
- If the parameter is an expression, replace it with a symbol.  The new
    symbol will be `sympy.Symbol('<x + 1>')` if the expression was
    `sympy.Symbol('x') + 1`.  In the unlikely case that an expression with a
    different meaning also has the string `'x + 1'`, a number is appended to
    the name to avoid collision: `sympy.Symbol('<x + 1>_1')`.

This function also creates a dictionary mapping from expressions and symbols
in `val` to the new symbols in the flattened copy of `val`.  E.g.
`cirq.ExpressionMap({sympy.Symbol('x')+1: sympy.Symbol('<x + 1>')})`.  This
`ExpressionMap` can be used to transform a sweep over the symbols in `val`
to a sweep over the flattened symbols e.g. a sweep over `sympy.Symbol('x')`
to a sweep over `sympy.Symbol('<x + 1>')`.

Args:
    val: The value to copy and substitute parameter expressions with
    flattened symbols.

Returns:
    The tuple (new value, expression map) where new value and expression map
    are described above.

Examples:

>>> qubit = cirq.LineQubit(0)
>>> a = sympy.Symbol('a')
>>> circuit = cirq.Circuit(
...     cirq.X(qubit) ** (a/4),
...     cirq.Y(qubit) ** (1-a/2),
... )
>>> print(circuit)
0: ───X^(a/4)───Y^(1 - a/2)───

>>> sweep = cirq.Linspace(a, start=0, stop=3, length=4)
>>> print(cirq.ListSweep(sweep))
Sweep:
{'a': 0.0}
{'a': 1.0}
{'a': 2.0}
{'a': 3.0}

>>> c_flat, expr_map = cirq.flatten(circuit)
>>> print(c_flat)
0: ───X^(<a/4>)───Y^(<1 - a/2>)───
>>> expr_map
cirq.ExpressionMap({a/4: <a/4>, 1 - a/2: <1 - a/2>})

>>> new_sweep = expr_map.transform_sweep(sweep)
>>> print(new_sweep)
Sweep:
{'<a/4>': 0.0, '<1 - a/2>': 1.0}
{'<a/4>': 0.25, '<1 - a/2>': 0.5}
{'<a/4>': 0.5, '<1 - a/2>': 0.0}
{'<a/4>': 0.75, '<1 - a/2>': -0.5}

>>> for params in sweep:  # Original
...     print(circuit,
...           '=>',
...           cirq.resolve_parameters(circuit, params))
0: ───X^(a/4)───Y^(1 - a/2)─── => 0: ───X^0───Y───
0: ───X^(a/4)───Y^(1 - a/2)─── => 0: ───X^0.25───Y^0.5───
0: ───X^(a/4)───Y^(1 - a/2)─── => 0: ───X^0.5───Y^0───
0: ───X^(a/4)───Y^(1 - a/2)─── => 0: ───X^0.75───Y^-0.5───

>>> for params in new_sweep:  # Flattened
...     print(c_flat, '=>', end=' ')
...     print(cirq.resolve_parameters(c_flat, params))
0: ───X^(<a/4>)───Y^(<1 - a/2>)─── => 0: ───X^0───Y───
0: ───X^(<a/4>)───Y^(<1 - a/2>)─── => 0: ───X^0.25───Y^0.5───
0: ───X^(<a/4>)───Y^(<1 - a/2>)─── => 0: ───X^0.5───Y^0───
0: ───X^(<a/4>)───Y^(<1 - a/2>)─── => 0: ───X^0.75───Y^-0.5───

## `flatten_with_sweep`

```python
def flatten_with_sweep(val: Any, sweep: sweeps.Sweep | list[resolver.ParamResolver]) -> tuple[Any, sweeps.Sweep]
```

Creates a copy of `val` with any symbols or expressions replaced with
new symbols.  `val` can be a `Circuit`, `Gate`, `Operation`, or other
type.  Also transforms a sweep over the symbols in `val` to a sweep over the
new symbols.

`flatten_with_sweep` goes through every parameter in `val` and does the
following:
- If the parameter is a number, don't change it.
- If the parameter is a symbol, don't change it and use the same symbol with
    the same values in the new sweep.
- If the parameter is an expression, replace it with a symbol and use the
    new symbol with the evaluated value of the expression in the new sweep.
    The new symbol will be `sympy.Symbol('<x + 1>')` if the expression was
    `sympy.Symbol('x') + 1`.  In the unlikely case that an expression with a
    different meaning also has the string `'x + 1'`, a number is appended to
    the name to avoid collision: `sympy.Symbol('<x + 1>_1')`.

Args:
    val: The value to copy and substitute parameter expressions with
    flattened symbols.
    sweep: A sweep over parameters used by `val`.

Returns:
    The tuple (new value, new sweep) where new value is `val` with flattened
    expressions and new sweep is the equivalent sweep over it.

## `flatten_with_params`

```python
def flatten_with_params(val: Any, params: resolver.ParamResolverOrSimilarType) -> tuple[Any, resolver.ParamDictType]
```

Creates a copy of `val` with any symbols or expressions replaced with
new symbols.  `val` can be a `Circuit`, `Gate`, `Operation`, or other
type.  Also transforms a dictionary of symbol values for `val` to an
equivalent dictionary mapping the new symbols to their evaluated values.

`flatten_with_params` goes through every parameter in `val` and does the
following:
- If the parameter is a number, don't change it.
- If the parameter is a symbol, don't change it and use the same symbol with
    the same value in the new dictionary of symbol values.
- If the parameter is an expression, replace it with a symbol and use the
    new symbol with the evaluated value of the expression in the new
    dictionary of symbol values.  The new symbol will be
    `sympy.Symbol('<x + 1>')` if the expression was `sympy.Symbol('x') + 1`.
    In the unlikely case that an expression with a different meaning also
    has the string `'x + 1'`, a number is appended to the name to avoid
    collision: `sympy.Symbol('<x + 1>_1')`.

Args:
    val: The value to copy and substitute parameter expressions with
    flattened symbols.
    params: A dictionary or `ParamResolver` where the keys are
        `sympy.Symbol`s used by `val` and the values are numbers.

Returns:
    The tuple (new value, new params) where new value is `val` with
    flattened expressions and new params is a dictionary mapping the
    new symbols like `sympy.Symbol('<x + 1>')` to numbers like
    `params['x'] + 1`.

## `ExpressionMap`

```python
class ExpressionMap(dict)
```

A dictionary with sympy expressions and symbols for keys and sympy
symbols for values.

This is returned by `cirq.flatten`.  See `ExpressionMap.transform_sweep` and
`ExpressionMap.transform_params`.

### `__init__`

```python
def __init__(self, *args, **kwargs)
```

Initializes the `ExpressionMap`.

Takes the same arguments as the builtin `dict`.  Keys must be sympy
expressions or symbols (instances of `sympy.Expr`).

### `transform_sweep`

```python
def transform_sweep(self, sweep: sweeps.Sweep | list[resolver.ParamResolver]) -> sweeps.Sweep
```

Returns a sweep to use with a circuit flattened earlier with
`cirq.flatten`.

If `sweep` sweeps symbol `a` over (1.0, 2.0, 3.0) and this
`ExpressionMap` maps `a/2+1` to the symbol `'<a/2 + 1>'` then this
method returns a sweep that sweeps symbol `'<a/2 + 1>'` over
(1.5, 2, 2.5).

See `cirq.flatten` for an example.

Args:
    sweep: The sweep to transform.

### `transform_params`

```python
def transform_params(self, params: resolver.ParamResolverOrSimilarType) -> resolver.ParamDictType
```

Returns a `ParamResolver` to use with a circuit flattened earlier
with `cirq.flatten`.

If `params` maps symbol `a` to 3.0 and this `ExpressionMap` maps
`a/2+1` to `'<a/2 + 1>'` then this method returns a resolver that maps
symbol `'<a/2 + 1>'` to 2.5.

See `cirq.flatten` for an example.

Args:
    params: The params to transform.
