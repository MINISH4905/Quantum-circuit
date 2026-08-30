---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/raw_types.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/raw_types.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/raw_types.py`

Basic types defining qubits, gates, and operations.

## `Qid`

```python
class Qid(metaclass=abc.ABCMeta)
```

Identifies a quantum object such as a qubit, qudit, resonator, etc.

Child classes represent specific types of objects, such as a qubit at a
particular location on a chip or a qubit with a particular name.

The main criteria that a custom qid must satisfy is *comparability*. Child
classes meet this criteria by implementing the `_comparison_key` method. For
example, `cirq.LineQubit`'s `_comparison_key` method returns `self.x`. This
ensures that line qubits with the same `x` are equal, and that line qubits
will be sorted ascending by `x`. `Qid` implements all equality,
comparison, and hashing methods via `_comparison_key`.

### `dimension`

```python
def dimension(self) -> int
```

Returns the dimension or the number of quantum levels this qid has.
E.g. 2 for a qubit, 3 for a qutrit, etc.

### `validate_dimension`

```python
def validate_dimension(dimension: int) -> None
```

Raises an exception if `dimension` is not positive.

Raises:
    ValueError: `dimension` is not positive.

### `with_dimension`

```python
def with_dimension(self, dimension: int) -> Qid
```

Returns a new qid with a different dimension.

Child classes can override.  Wraps the qubit object by default.

Args:
    dimension: The new dimension or number of levels.

## `Gate`

```python
class Gate(metaclass=value.ABCMetaImplementAnyOneOf)
```

An operation type that can be applied to a collection of qubits.

Gates can be applied to qubits by calling their on() method with
the qubits to be applied to supplied, or, alternatively, by simply
calling the gate on the qubits.  In other words calling MyGate.on(q1, q2)
to create an Operation on q1 and q2 is equivalent to MyGate(q1,q2).

Gates operate on a certain number of qubits. All implementations of gate
must implement a method to declare the number of qubits (if a gate acting
on qubits) or the qid shape (if acting on qudits).  In general, this means
that a Gate subclass should implement only `_qid_shape_` if it can act on
qudits, otherwise it should define only `_num_qubits_`.

Linear combinations of gates can be created by adding gates together and
multiplying them by scalars.

### `validate_args`

```python
def validate_args(self, qubits: Sequence[cirq.Qid]) -> None
```

Checks if this gate can be applied to the given qubits.

By default checks that:
- inputs are of type `Qid`
- len(qubits) == num_qubits()
- qubit_i.dimension == qid_shape[i] for all qubits

Child classes can override.  The child implementation should call
`super().validate_args(qubits)` then do custom checks.

Args:
    qubits: The sequence of qubits to potentially apply the gate to.

Raises:
    ValueError: The gate can't be applied to the qubits.

### `on`

```python
def on(self, *qubits: Qid) -> cirq.Operation
```

Returns an application of this gate to the given qubits.

Args:
    *qubits: The collection of qubits to potentially apply the gate to.

Returns: a `cirq.Operation` which is this gate applied to the given
    qubits.

### `on_each`

```python
def on_each(self, *targets: Qid | Iterable[Any]) -> list[cirq.Operation]
```

Returns a list of operations applying the gate to all targets.

Args:
    *targets: The qubits to apply this gate to. For single-qubit gates
        this can be provided as varargs or a combination of nested
        iterables. For multi-qubit gates this must be provided as an
        `Iterable[Sequence[Qid]]`, where each sequence has `num_qubits`
        qubits.

Returns:
    Operations applying this gate to the target qubits.

Raises:
    ValueError: If targets are not instances of Qid or Iterable[Qid].
        If the gate qubit number is incompatible.
    TypeError: If a single target is supplied and it is not iterable.

### `wrap_in_linear_combination`

```python
def wrap_in_linear_combination(self, coefficient: cirq.TParamValComplex=1) -> cirq.LinearCombinationOfGates
```

Returns a LinearCombinationOfGates with this gate.

Args:
    coefficient: number coefficient to use in the resulting
        `cirq.LinearCombinationOfGates` object.

Returns:
    `cirq.LinearCombinationOfGates` containing self with a
        coefficient of `coefficient`.

### `with_probability`

```python
def with_probability(self, probability: cirq.TParamVal) -> cirq.Gate
```

Creates a probabilistic channel with this gate.

Args:
    probability: floating point value between 0 and 1, giving the
        probability this gate is applied.

Returns:
    `cirq.RandomGateChannel` that applies `self` with probability
        `probability` and the identity with probability `1-p`.

### `controlled`

```python
def controlled(self, num_controls: int | None=None, control_values: cv.AbstractControlValues | Sequence[int | Collection[int]] | None=None, control_qid_shape: tuple[int, ...] | None=None) -> Gate
```

Returns a controlled version of this gate. If no arguments are
specified, defaults to a single qubit control.

Args:
    num_controls: Total number of control qubits.
    control_values: Which control computational basis state to apply the
        sub gate.  A sequence of length `num_controls` where each
        entry is an integer (or set of integers) corresponding to the
        computational basis state (or set of possible values) where that
        control is enabled.  When all controls are enabled, the sub gate is
        applied.  If unspecified, control values default to 1.
    control_qid_shape: The qid shape of the controls.  A tuple of the
        expected dimension of each control qid.  Defaults to
        `(2,) * num_controls`.  Specify this argument when using qudits.

Returns:
    A `cirq.Gate` representing `self` controlled by the given control values
        and qubits. This is a `cirq.ControlledGate` in the base
        implementation, but subclasses may return a different gate type.

### `num_qubits`

```python
def num_qubits(self) -> int
```

The number of qubits this gate acts on.

## `Operation`

```python
class Operation(metaclass=abc.ABCMeta)
```

An effect applied to a collection of qubits.

The most common kind of Operation is a GateOperation, which separates its
effect into a qubit-independent Gate and the qubits it should be applied to.

### `with_qubits`

```python
def with_qubits(self, *new_qubits: cirq.Qid) -> cirq.Operation
```

Returns the same operation, but applied to different qubits.

Args:
    *new_qubits: The new qubits to apply the operation to. The order must
        exactly match the order of qubits returned from the operation's
        `qubits` property.

### `tags`

```python
def tags(self) -> tuple[Hashable, ...]
```

Returns a tuple of the operation's tags.

### `untagged`

```python
def untagged(self) -> cirq.Operation
```

Returns the underlying operation without any tags.

### `with_tags`

```python
def with_tags(self, *new_tags: Hashable) -> cirq.Operation
```

Creates a new TaggedOperation, with this op and the specified tags.

This method can be used to attach meta-data to specific operations
without affecting their functionality.  The intended usage is to
attach classes intended for this purpose or strings to mark operations
for specific usage that will be recognized by consumers.  Specific
examples include ignoring this operation in optimization passes,
hardware-specific functionality, or circuit diagram customizability.

Tags can be a list of any type of object that is useful to identify
this operation as long as the type is hashable.  If you wish the
resulting operation to be eventually serialized into JSON, you should
also restrict the operation to be JSON serializable.

Please note that tags should be instantiated if classes are
used.  Raw types are not allowed.

Args:
    *new_tags: The tags to wrap this operation in.

### `transform_qubits`

```python
def transform_qubits(self, qubit_map: dict[cirq.Qid, cirq.Qid] | Callable[[cirq.Qid], cirq.Qid]) -> cirq.Operation
```

Returns the same operation, but with different qubits.

This function will return a new operation with the same gate but
with qubits mapped according to the argument.

For example, the following will translate LineQubits to GridQubits
using a grid with 4 columns:

>>> op = cirq.CZ(cirq.LineQubit(5), cirq.LineQubit(9))
>>> op.transform_qubits(lambda q: cirq.GridQubit(q.x // 4, q.x % 4))
cirq.CZ(cirq.GridQubit(1, 1), cirq.GridQubit(2, 1))

This can also be used with a dictionary that has a mapping, such
as the following which maps named qubits to line qubits:

>>> a = cirq.NamedQubit('alice')
>>> b = cirq.NamedQubit('bob')
>>> d = {a: cirq.LineQubit(4), b: cirq.LineQubit(5)}
>>> op = cirq.CNOT(a, b)
>>> op.transform_qubits(d)
cirq.CNOT(cirq.LineQubit(4), cirq.LineQubit(5))

Args:
    qubit_map: A function or a dict mapping each current qubit into a desired
        new qubit.

Returns:
    The receiving operation but with qubits transformed by the given
        function.
Raises:
    TypeError: qubit_map was not a function or dict mapping qubits to
        qubits.

### `controlled_by`

```python
def controlled_by(self, *control_qubits: cirq.Qid, control_values: cv.AbstractControlValues | Sequence[int | Collection[int]] | None=None) -> cirq.Operation
```

Returns a controlled version of this operation. If no control_qubits
   are specified, returns self.

Args:
    *control_qubits: Qubits to control the operation by. Required.
    control_values: For which control qubit values to apply the
        operation.  A sequence of the same length as `control_qubits`
        where each entry is an integer (or set of integers)
        corresponding to the qubit value (or set of possible values)
        where that control is enabled.  When all controls are enabled,
        the operation is applied.  If unspecified, control values
        default to 1.

### `with_probability`

```python
def with_probability(self, probability: cirq.TParamVal) -> cirq.Operation
```

Creates a probabilistic channel with this operation.

Args:
    probability: floating point value between 0 and 1, giving the
        probability this gate is applied.

Returns:
    `cirq.RandomGateChannel` that applies `self` with probability
        `probability` and the identity with probability `1-p`.

Raises:
    NotImplementedError: if called on an operation that lacks a gate.

### `validate_args`

```python
def validate_args(self, qubits: Sequence[cirq.Qid]) -> None
```

Raises an exception if the `qubits` don't match this operation's qid
shape.

Call this method from a subclass's `with_qubits` method.

Args:
    qubits: The new qids for the operation.

Raises:
    ValueError: The operation had qids that don't match it's qid shape.

### `classical_controls`

```python
def classical_controls(self) -> frozenset[cirq.Condition]
```

The classical controls gating this operation.

### `with_classical_controls`

```python
def with_classical_controls(self, *conditions)
```

Returns a classically controlled version of this operation.

An operation that is classically controlled is executed iff all
conditions evaluate to True. Conditions can be either a measurement key
or a user-specified `cirq.Condition`. A measurement key evaluates to
True iff any qubit in the corresponding measurement operation evaluated
to a non-zero value; `cirq.Condition` supports more complex,
user-defined conditions.

If no conditions are specified, returns self.

The classical control will remove any tags on the existing operation,
since tags are fragile, and we always opt to get rid of the tags when
the underlying operation is changed.

Args:
    *conditions: A list of measurement keys, strings that can be parsed
        into measurement keys, or sympy expressions where the free
        symbols are measurement key strings.

Returns:
    A `ClassicallyControlledOperation` wrapping the operation. If no conditions
   are specified, returns self.

### `without_classical_controls`

```python
def without_classical_controls(self) -> cirq.Operation
```

Removes all classical controls from the operation.

This function removes all classical controls gating the operation. It
acts recursively, so that all classical control wrappers are always
removed from the current operation.

If there are no classical controls on the operation, it will return
`self`.

Since tags are fragile, this will also remove any tags from the operation,
when called on `TaggedOperation` (unless there are no classical controls on it).
If a `TaggedOperation` is under all the classical control layers,
that `TaggedOperation` will be returned from this function.

Returns:
    The operation with all classical controls removed.

## `TaggedOperation`

```python
class TaggedOperation(Operation)
```

Operation annotated with a set of tags.

These Tags can be used for special processing.  TaggedOperations
can be initialized with using `Operation.with_tags(tag)`
or by using `TaggedOperation(op, tag)`.

Tags added can be of any type, but they should be Hashable in order
to allow equality checking.  If you wish to serialize operations into
JSON, you should restrict yourself to only use objects that have a JSON
serialization.  Tags cannot be raw types and should be instantiated
if classes are used.

See `Operation.with_tags()` for more information on intended usage.

### `tags`

```python
def tags(self) -> tuple[Hashable, ...]
```

Returns a tuple of the operation's tags.

### `untagged`

```python
def untagged(self) -> cirq.Operation
```

Returns the underlying operation without any tags.

### `with_tags`

```python
def with_tags(self, *new_tags: Hashable) -> cirq.TaggedOperation
```

Creates a new TaggedOperation with combined tags.

Overloads Operation.with_tags to create a new TaggedOperation
that has the tags of this operation combined with the new_tags
specified as the parameter.

Please note that tags should be instantiated if classes are
used.  Raw types are not allowed.
