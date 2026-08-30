---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/study/sweeps.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/study/sweeps.py
license: Apache-2.0
---

## `Sweep`

```python
class Sweep(metaclass=abc.ABCMeta)
```

A sweep is an iterator over ParamResolvers.

A ParamResolver assigns values to Symbols. For sweeps, each ParamResolver
must specify the same Symbols that are assigned.  So a sweep is a way to
iterate over a set of different values for a fixed set of Symbols. This is
useful for a circuit, where there are a fixed set of Symbols, and you want
to iterate over an assignment of all values to all symbols.

For example, a sweep can explicitly assign a set of equally spaced points
between two endpoints using a Linspace,
    sweep = Linspace("angle", start=0.0, end=2.0, length=10)
This can then be used with a circuit that has an 'angle' sympy.Symbol to
run simulations multiple simulations, one for each of the values in the
sweep
    result = simulator.run_sweep(program=circuit, params=sweep)

Sweeps support Cartesian and Zip products using the '*' and '+' operators,
see the Product and Zip documentation.

### `keys`

```python
def keys(self) -> list[cirq.TParamKey]
```

The keys for the all of the sympy.Symbols that are resolved.

### `param_tuples`

```python
def param_tuples(self) -> Iterator[Params]
```

An iterator over (key, value) pairs assigning Symbol key to value.

## `Product`

```python
class Product(Sweep)
```

Cartesian product of one or more sweeps.

If one sweep assigns 'a' to the values 0, 1, 2, and the second sweep
assigns 'b' to the values 2, 3, then the product is a sweep that
assigns the tuple ('a','b') to all possible combinations of these
assignments: (0, 2), (0, 3), (1, 2), (1, 3), (2, 2), (2, 3).
That is, the leftmost sweep is the outer loop in a product of sweeps.

## `Concat`

```python
class Concat(Sweep)
```

Concatenates multiple to a new sweep.

All sweeps must share the same descriptors.

If one sweep assigns 'a' to the values 0, 1, 2, and another sweep assigns
'a' to the values 3, 4, 5, the concatenation produces a sweep assigning
'a' to the values 0, 1, 2, 3, 4, 5 in sequence.

## `Zip`

```python
class Zip(Sweep)
```

Zip product (direct sum) of one or more sweeps.

If one sweep assigns 'a' to values 0, 1, 2, and the second sweep assigns 'b'
to the values 3, 4, 5, then the zip is a sweep that assigns to the
tuple ('a', 'b') the pair-wise matched values (0, 3), (1, 4), (2, 5).

When iterating over a Zip, we iterate the individual sweeps in parallel,
stopping when the first component sweep stops. For example if one sweep
assigns 'a' to values 0, 1 and the second sweep assigns 'b' to the values
3, 4, 5, then the zip is a sweep that assigns to the tuple ('a', 'b') the
values (0, 3), (1, 4).

## `ZipLongest`

```python
class ZipLongest(Zip)
```

Iterate over constituent sweeps in parallel

Analogous to itertools.zip_longest.
Note that we iterate until all sweeps terminate,
so if the sweeps are different lengths, the
shorter sweeps will be filled by repeating their last value
until all sweeps have equal length.

Note that this is different from itertools.zip_longest,
which uses a fixed fill value.

Raises:
    ValueError if an input sweep is completely empty.

## `SingleSweep`

```python
class SingleSweep(Sweep)
```

A simple sweep over one parameter with values from an iterator.

## `Points`

```python
class Points(SingleSweep)
```

A simple sweep with explicitly supplied values.

### `__init__`

```python
def __init__(self, key: cirq.TParamKey, points: Sequence[float], metadata: Any | None=None) -> None
```

Creates a sweep on a variable with supplied values.

Args:
    key: sympy.Symbol or equivalent to sweep across.
    points: sequence of floating point values that represent
        the values to sweep across.  The length of the sweep
        will be equivalent to the length of this sequence.
    metadata: Optional metadata to attach to the sweep to
        annotate the sweep or its variable.

## `Linspace`

```python
class Linspace(SingleSweep)
```

A simple sweep over linearly-spaced values.

### `__init__`

```python
def __init__(self, key: cirq.TParamKey, start: float, stop: float, length: int, metadata: Any | None=None) -> None
```

Creates a linear-spaced sweep for a given key.

For the given args, assigns to the list of values
    start, start + (stop - start) / (length - 1), ..., stop

Args:
    key: sympy.Symbol or equivalent to sweep across.
    start: minimum value of linear sweep.
    stop: maximum value of linear sweep.
    length: number of points in the sweep.
    metadata: Optional metadata to attach to the sweep to
        annotate the sweep or its variable.

## `ListSweep`

```python
class ListSweep(Sweep)
```

A wrapper around a list of `ParamResolver`s.

### `__init__`

```python
def __init__(self, resolver_list: Iterable[resolver.ParamResolverOrSimilarType])
```

Creates a `Sweep` over a list of `ParamResolver`s.

Args:
    resolver_list: The list of parameter resolvers to use in the sweep.
        All resolvers must resolve the same set of parameters.

Raises:
    TypeError: If `resolver_list` is not a `cirq.ParamResolver` or a
        dict.

## `dict_to_product_sweep`

```python
def dict_to_product_sweep(factor_dict: ProductOrZipSweepLike) -> Product
```

Cartesian product of sweeps from a dictionary.

Each entry in the dictionary specifies a sweep as a mapping from the
parameter to a value or sequence of values. The Cartesian product of these
sweeps is returned.

Args:
    factor_dict: The dictionary containing the sweeps.

Returns:
    Cartesian product of the sweeps.

## `dict_to_zip_sweep`

```python
def dict_to_zip_sweep(factor_dict: ProductOrZipSweepLike) -> Zip
```

Zip product of sweeps from a dictionary.

Each entry in the dictionary specifies a sweep as a mapping from the
parameter to a value or sequence of values. The zip product of these
sweeps is returned.

Args:
    factor_dict: The dictionary containing the sweeps.

Returns:
    Zip product of the sweeps.

## `list_of_dicts_to_zip`

```python
def list_of_dicts_to_zip(params: Sequence[Mapping[str, float]]) -> cirq.Zip
```

Converts a list of dictionaries into a cirq.Zip of cirq.Points.

This will convert lists of dictionaries into a more compact
Sweep format.   For large sweeps, this can vastly improve performance.

This will change [{'a': 1.0, 'b': 2.0}, {'a': 3.0, 'b': 4.0}]
into cirq.Zip(cirq.Points('a', [1.0, 3.0]), cirq.Points('b', [2.0, 4.0])_)

Raises:
    ValueError if the keys in any of the list items are not the same.
