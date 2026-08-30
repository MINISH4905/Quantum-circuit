---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/circuits/moment.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/circuits/moment.py
license: Apache-2.0
---

## Module `cirq-core/cirq/circuits/moment.py`

A simplified time-slice of operations within a sequenced circuit.

## `Moment`

```python
class Moment
```

A time-slice of operations within a circuit.

Grouping operations into moments is intended to be a strong suggestion to
whatever is scheduling operations on real hardware. Operations in the same
moment should execute at the same time (to the extent possible; not all
operations have the same duration) and it is expected that all operations
in a moment should be completed before beginning the next moment.

Moment can be indexed by qubit or list of qubits:

*   `moment[qubit]` returns the Operation in the moment which touches the
        given qubit, or throws KeyError if there is no such operation.
*   `moment[qubits]` returns another Moment which consists only of those
        operations which touch at least one of the given qubits. If there
        are no such operations, returns an empty Moment.

### `__init__`

```python
def __init__(self, *contents: cirq.OP_TREE, _flatten_contents: bool=True, tags: tuple[Hashable, ...]=()) -> None
```

Constructs a moment with the given operations.

Args:
    contents: The operations applied within the moment.
        Will be flattened and frozen into a tuple before storing.
    _flatten_contents: If True, use flatten_to_ops to convert
        the OP_TREE of contents into a tuple of Operation. If False,
        we skip flattening and assume that contents already consists
        of individual operations. This is used internally by helper
        methods to avoid unnecessary validation.
    tags:  Optional tags to denote specific Moment objects with meta-data.
        These are a tuple of any Hashable object.  Typically, a class
        will be passed.  Tags apply only to this specific set of operations
        and will be lost on any transformation of the
        Moment.  For instance, if operations are added to the Moment, tags
        will be dropped unless explicitly added back in by the user.

Raises:
    ValueError: A qubit appears more than once.

### `from_ops`

```python
def from_ops(cls, *ops: cirq.Operation, tags: tuple[Hashable, ...]=()) -> cirq.Moment
```

Construct a Moment from the given operations.

This avoids calling `flatten_to_ops` in the moment constructor, which
results in better performance in cases where the contents of the moment
are already in the form of a sequence of operations rather than an
arbitrary OP_TREE.

Args:
    *ops: Operations to include in the Moment.
    tags:  Optional tags to denote specific Moment objects with meta-data.
        These are a tuple of any Hashable object.  Tags will be dropped if
        the operations in the Moment are modified or transformed.

### `tags`

```python
def tags(self) -> tuple[Hashable, ...]
```

Returns a tuple of the operation's tags.

### `with_tags`

```python
def with_tags(self, *new_tags: Hashable) -> cirq.Moment
```

Creates a new Moment with the current ops and the specified tags.

If the moment already has tags, this will add the new_tags to the
preexisting tags.

This method can be used to attach meta-data to moments
without affecting their functionality.  The intended usage is to
attach classes intended for this purpose or strings to mark operations
for specific usage that will be recognized by consumers.

Tags can be a list of any type of object that is useful to identify
this operation as long as the type is hashable.  If you wish the
resulting operation to be eventually serialized into JSON, you should
also restrict the operation to be JSON serializable.

Please note that tags should be instantiated if classes are
used.  Raw types are not allowed.

### `operates_on_single_qubit`

```python
def operates_on_single_qubit(self, qubit: cirq.Qid) -> bool
```

Determines if the moment has operations touching the given qubit.
Args:
    qubit: The qubit that may or may not be touched by operations.
Returns:
    Whether this moment has operations involving the qubit.

### `operates_on`

```python
def operates_on(self, qubits: Iterable[cirq.Qid]) -> bool
```

Determines if the moment has operations touching the given qubits.

Args:
    qubits: The qubits that may or may not be touched by operations.

Returns:
    Whether this moment has operations involving the qubits.

### `operation_at`

```python
def operation_at(self, qubit: raw_types.Qid) -> cirq.Operation | None
```

Returns the operation on a certain qubit for the moment.

Args:
    qubit: The qubit on which the returned Operation operates
        on.

Returns:
    The operation that operates on the qubit for that moment.

### `with_operation`

```python
def with_operation(self, operation: cirq.Operation) -> cirq.Moment
```

Returns an equal moment, but with the given op added.

Any tags on the Moment will be dropped.

Args:
    operation: The operation to append.

Returns:
    The new moment.

Raises:
    ValueError: If the operation given overlaps a current operation in the moment.

### `with_operations`

```python
def with_operations(self, *contents: cirq.OP_TREE) -> cirq.Moment
```

Returns a new moment with the given contents added.

Any tags on the original Moment object are dropped if the Moment
is changed.

Args:
    *contents: New operations to add to this moment.

Returns:
    The new moment.

Raises:
    ValueError: If the contents given overlaps a current operation in the moment.

### `without_operations_touching`

```python
def without_operations_touching(self, qubits: Iterable[cirq.Qid]) -> cirq.Moment
```

Returns an equal moment, but without ops on the given qubits.

Any tags on the original Moment object are dropped if the Moment
is changed.

Args:
    qubits: Operations that touch these will be removed.

Returns:
    The new moment.

### `transform_qubits`

```python
def transform_qubits(self, qubit_map: dict[cirq.Qid, cirq.Qid] | Callable[[cirq.Qid], cirq.Qid]) -> Self
```

Returns the same moment, but with different qubits.

Args:
   qubit_map: A function or a dict mapping each current qubit into a
              desired new qubit.

Returns:
    The receiving moment but with qubits transformed by the given
        function.

### `expand_to`

```python
def expand_to(self, qubits: Iterable[cirq.Qid]) -> cirq.Moment
```

Returns self expanded to given superset of qubits by making identities explicit.

Args:
    qubits: Iterable of `cirq.Qid`s to expand this moment to.

Returns:
    A new `cirq.Moment` with identity operations on the new qubits
    not currently found in the moment.

Raises:
    ValueError: if this moments' qubits are not a subset of `qubits`.

### `to_text_diagram`

```python
def to_text_diagram(self: cirq.Moment, *, xy_breakdown_func: Callable[[cirq.Qid], tuple[Any, Any]]=_default_breakdown, extra_qubits: Iterable[cirq.Qid]=(), use_unicode_characters: bool=True, precision: int | None=None, include_tags: bool | Iterable[type]=True) -> str
```

Create a text diagram for the moment.

Args:
    xy_breakdown_func: A function to split qubits/qudits into x and y
        components. For example, the default breakdown turns
        `cirq.GridQubit(row, col)` into the tuple `(col, row)` and
        `cirq.LineQubit(x)` into `(x, 0)`.
    extra_qubits: Extra qubits/qudits to include in the diagram, even
        if they don't have any operations applied in the moment.
    use_unicode_characters: Whether or not the output should use fancy
        unicode characters or stick to plain ASCII. Unicode characters
        look nicer, but some environments don't draw them with the same
        width as ascii characters (which ruins the diagrams).
    precision: How precise numbers, such as angles, should be. Use None
        for infinite precision, or an integer for a certain number of
        digits of precision.
    include_tags: Controls which tags attached to operations are
        included. ``True`` includes all tags, ``False`` includes none,
        or a collection of tag classes may be specified to include only
        those tags.

Returns:
    The text diagram rendered into text.
