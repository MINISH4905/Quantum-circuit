---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/gateset.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/gateset.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/gateset.py`

Functionality for grouping and validating Cirq gates.

## `GateFamily`

```python
class GateFamily
```

Wrapper around gate instances/types describing a set of accepted gates.

GateFamily supports initialization via

- Non-parameterized instances of `cirq.Gate` (Instance Family).
- Python types inheriting from `cirq.Gate` (Type Family).

By default, the containment checks depend on the initialization type:

- Instance Family: Containment check is done via `cirq.equal_up_to_global_phase`.
- Type Family: Containment check is done by type comparison.

For example:

- Instance Family:

    >>> gate_family = cirq.GateFamily(cirq.X)
    >>> assert cirq.X in gate_family
    >>> assert cirq.Rx(rads=np.pi) in gate_family
    >>> assert cirq.X ** sympy.Symbol("theta") not in gate_family

- Type Family:

    >>> gate_family = cirq.GateFamily(cirq.XPowGate)
    >>> assert cirq.X in gate_family
    >>> assert cirq.Rx(rads=np.pi) in gate_family
    >>> assert cirq.X ** sympy.Symbol("theta") in gate_family

As seen in the examples above, GateFamily supports containment checks for instances of both
`cirq.Operation` and `cirq.Gate`. By default, a `cirq.Operation` instance `op` is accepted if
the underlying `op.gate` is accepted.

Further constraints can be added on containment checks for `cirq.Operation` objects by setting
`tags_to_accept` and/or `tags_to_ignore` in the GateFamily constructor. For a tagged
operation, the underlying gate `op.gate` will be checked for containment only if both:

- `op.tags` has no intersection with `tags_to_ignore`
- `tags_to_accept` is not empty, then `op.tags` should have a non-empty intersection with
    `tags_to_accept`.

If a `cirq.Operation` contains tags from both `tags_to_accept` and `tags_to_ignore`, it is
rejected. Furthermore, tags cannot appear in both `tags_to_accept` and `tags_to_ignore`.

For the purpose of tag comparisons, a `Gate` is considered as an `Operation` without tags.

For example:

    >>> q = cirq.NamedQubit('q')
    >>> gate_family = cirq.GateFamily(cirq.ZPowGate, tags_to_accept=['accepted_tag'])
    >>> assert cirq.Z(q).with_tags('accepted_tag') in gate_family
    >>> assert cirq.Z(q).with_tags('other_tag') not in gate_family
    >>> assert cirq.Z(q) not in gate_family
    >>> assert cirq.Z not in gate_family
    ...
    >>> gate_family = cirq.GateFamily(cirq.ZPowGate, tags_to_ignore=['ignored_tag'])
    >>> assert cirq.Z(q).with_tags('ignored_tag') not in gate_family
    >>> assert cirq.Z(q).with_tags('other_tag') in gate_family
    >>> assert cirq.Z(q) in gate_family
    >>> assert cirq.Z in gate_family

In order to create gate families with constraints on parameters of a gate
type, users should derive from the `cirq.GateFamily` class and override the
`_predicate` method used to check for gate containment.

### `__init__`

```python
def __init__(self, gate: type[raw_types.Gate] | raw_types.Gate, *, name: str | None=None, description: str | None=None, ignore_global_phase: bool=True, tags_to_accept: Iterable[Hashable]=(), tags_to_ignore: Iterable[Hashable]=()) -> None
```

Init GateFamily.

Args:
    gate: A python `type` inheriting from `cirq.Gate` for type based membership checks, or
        a non-parameterized instance of a `cirq.Gate` for equality based membership checks.
    name: The name of the gate family.
    description: Human readable description of the gate family.
    ignore_global_phase: If True, value equality is checked via
        `cirq.equal_up_to_global_phase`.
    tags_to_accept: If non-empty, only `cirq.Operations` containing at least one tag in this
        sequence can be accepted.
    tags_to_ignore: Any `cirq.Operation` containing at least one tag in this sequence is
        rejected. Note that this takes precedence over `tags_to_accept`, so an operation
        which contains tags from both `tags_to_accept` and `tags_to_ignore` is rejected.

Raises:
    ValueError: if `gate` is not a `cirq.Gate` instance or subclass.
    ValueError: if `gate` is a parameterized instance of `cirq.Gate`.
    ValueError: if `tags_to_accept` and `tags_to_ignore` contain common tags.

## `Gateset`

```python
class Gateset
```

Gatesets represent a collection of `cirq.GateFamily` objects.

Gatesets are useful for

- Describing the set of allowed gates in a human-readable format.
- Validating a given gate / `cirq.OP_TREE` against the set of allowed gates.

Gatesets rely on the underlying `cirq.GateFamily` for both description and
validation purposes.

### `__init__`

```python
def __init__(self, *gates: type[raw_types.Gate] | raw_types.Gate | GateFamily, name: str | None=None, unroll_circuit_op: bool=True) -> None
```

Init Gateset.

Accepts a list of gates, each of which should be either

- `cirq.Gate` subclass
- `cirq.Gate` instance
- `cirq.GateFamily` instance

`cirq.Gate` subclasses and instances are converted to the default
`cirq.GateFamily(gate=g)` instance and thus a default name and
description is populated.

Args:
    *gates: A list of `cirq.Gate` subclasses / `cirq.Gate` instances /
        `cirq.GateFamily` instances to initialize the Gateset.
    name: (Optional) Name for the Gateset. Useful for description.
    unroll_circuit_op: If True, `cirq.CircuitOperation` is recursively
        validated by validating the underlying `cirq.Circuit`.

### `with_params`

```python
def with_params(self, *, name: str | None=None, unroll_circuit_op: bool | None=None) -> Gateset
```

Returns a copy of this Gateset with identical gates and new values for named arguments.

If a named argument is None then corresponding value of this Gateset is used instead.

Args:
    name: New name for the Gateset.
    unroll_circuit_op: If True, new Gateset will recursively validate
        `cirq.CircuitOperation` by validating the underlying `cirq.Circuit`.

Returns:
    `self` if all new values are None or identical to the values of current Gateset.
    else a new Gateset with identical gates and new values for named arguments.

### `__contains__`

```python
def __contains__(self, item: raw_types.Gate | raw_types.Operation) -> bool
```

Check for containment of a given Gate/Operation in this Gateset.

Containment checks are handled as follows:

- For Gates or Operations that have an underlying gate (i.e. op.gate is not None):
    - Forwards the containment check to the underlying `cirq.GateFamily` objects.
    - Examples of such operations include `cirq.GateOperation`s and their controlled
        and tagged variants (i.e. instances of `cirq.TaggedOperation`,
        `cirq.ControlledOperation` where `op.gate` is not None) etc.
- For Operations that do not have an underlying gate:
    - Forwards the containment check to `self._validate_operation(item)`.
    - Examples of such operations include `cirq.CircuitOperation`s and their controlled
        and tagged variants (i.e. instances of `cirq.TaggedOperation`,
        `cirq.ControlledOperation` where `op.gate` is None) etc.

The complexity of the method in terms of the number of `gates`, n, is

- O(1) when any default `cirq.GateFamily` instance accepts the given item, except
    for an Instance GateFamily trying to match an item with a different global phase.
- O(n) for all other cases: matching against custom gate families, matching across
    global phase for the default Instance GateFamily, no match against any underlying
    gate family.

Args:
    item: The `cirq.Gate` or `cirq.Operation` instance to check containment for.

### `validate`

```python
def validate(self, circuit_or_optree: cirq.AbstractCircuit | op_tree.OP_TREE) -> bool
```

Validates gates forming `circuit_or_optree` should be contained in Gateset.

Args:
    circuit_or_optree: The `cirq.Circuit` or `cirq.OP_TREE` to validate.
