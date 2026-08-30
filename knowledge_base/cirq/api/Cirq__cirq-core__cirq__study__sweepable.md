---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/study/sweepable.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/study/sweepable.py
license: Apache-2.0
---

## Module `cirq-core/cirq/study/sweepable.py`

Defines which types are Sweepable.

## `to_resolvers`

```python
def to_resolvers(sweepable: Sweepable) -> Iterator[ParamResolver]
```

Convert a Sweepable to a list of ParamResolvers.

## `to_sweeps`

```python
def to_sweeps(sweepable: Sweepable, metadata: dict | None=None) -> list[Sweep]
```

Converts a Sweepable to a list of Sweeps.

## `to_sweep`

```python
def to_sweep(sweep_or_resolver_list: Sweep | ParamResolverOrSimilarType | Iterable[ParamResolverOrSimilarType]) -> Sweep
```

Converts the argument into a ``cirq.Sweep``.

Args:
    sweep_or_resolver_list: The object to try to turn into a
        ``cirq.Sweep`` . A ``cirq.Sweep``, a single ``cirq.ParamResolver``,
        or a list of ``cirq.ParamResolver`` s.

Returns:
    A sweep equal to or containing the argument.

Raises:
    TypeError: If an unsupport type was supplied.
