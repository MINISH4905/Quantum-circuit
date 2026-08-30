---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/circuits/circuit.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/circuits/circuit.py
license: Apache-2.0
---

## Module `cirq-core/cirq/circuits/circuit.py`

The circuit data structure.

Circuits consist of a list of Moments, each Moment made up of a set of
Operations. Each Operation is a Gate that acts on some Qubits, for a given
Moment the Operations must all act on distinct Qubits.

## `Alignment`

```python
class Alignment(enum.Enum)
```

Alignment option for combining/zipping two circuits together.

Args:
    LEFT: Stop when left ends are lined up.
    RIGHT: Stop when right ends are lined up.
    FIRST: Stop the first time left ends are lined up or right ends are lined up.

## `AbstractCircuit`

```python
class AbstractCircuit(abc.ABC)
```

The base class for Circuit-like objects.

A circuit-like object must have a list of moments (which can be empty).

These methods return information about the circuit, and can be called on
either Circuit or FrozenCircuit objects:

*   next_moment_operating_on
*   prev_moment_operating_on
*   next_moments_operating_on
*   operation_at
*   all_qubits
*   all_operations
*   findall_operations
*   findall_operations_between
*   findall_operations_until_blocked
*   findall_operations_with_gate_type
*   reachable_frontier_from
*   has_measurements
*   are_all_matches_terminal
*   are_all_measurements_terminal
*   unitary
*   final_state_vector
*   to_text_diagram
*   to_text_diagram_drawer
*   qid_shape
*   all_measurement_key_names
*   to_quil
*   to_qasm
*   save_qasm
*   get_independent_qubit_sets

### `from_moments`

```python
def from_moments(cls: type[CIRCUIT_TYPE], *moments: cirq.OP_TREE | None, tags: Sequence[Hashable]=()) -> CIRCUIT_TYPE
```

Create a circuit from moment op trees.

Args:
    *moments: Op trees for each moment, which can be one of the following:
        - Moment: will be included directly in the new circuit.
        - AbstractCircuit: will be frozen, wrapped in a CircuitOperation,
            and included in its own moment in the new circuit.
        - None: will be skipped and omitted from the circuit. This can be
            used to include or skip a moment based on a conditional, for example.
        - Other OP_TREE: will be passed to `cirq.Moment` to create a new moment
            which is then included in the new circuit. Note that in this
            case we have the normal restriction that operations in a
            moment must be applied to disjoint sets of qubits.
    tags: A sequence of any type of object that is useful to attach metadata
        to this circuit as long as the type is hashable.  If you wish the
        resulting circuit to be eventually serialized into JSON, you should
        also restrict the tags to be JSON serializable.

### `freeze`

```python
def freeze(self) -> cirq.FrozenCircuit
```

Creates a FrozenCircuit from this circuit.

If 'self' is a FrozenCircuit, the original object is returned.

### `unfreeze`

```python
def unfreeze(self, copy: bool=True) -> cirq.Circuit
```

Creates a Circuit from this circuit.

Args:
    copy: If True and 'self' is a Circuit, returns a copy that circuit.

### `tags`

```python
def tags(self) -> tuple[Hashable, ...]
```

Returns a tuple of the Circuit's tags.

### `with_tags`

```python
def with_tags(self, *new_tags: Hashable) -> Self
```

Creates a new tagged Circuit with `self.tags` and `new_tags` combined.

### `untagged`

```python
def untagged(self) -> Self
```

Returns the underlying Circuit without any tags.

### `next_moment_operating_on`

```python
def next_moment_operating_on(self, qubits: Iterable[cirq.Qid], start_moment_index: int=0, max_distance: int | None=None) -> int | None
```

Finds the index of the next moment that touches the given qubits.

Args:
    qubits: We're looking for operations affecting any of these qubits.
    start_moment_index: The starting point of the search.
    max_distance: The number of moments (starting from the start index
        and moving forward) to check. Defaults to no limit.

Returns:
    None if there is no matching moment, otherwise the index of the
    earliest matching moment.

Raises:
  ValueError: negative max_distance.

### `next_moments_operating_on`

```python
def next_moments_operating_on(self, qubits: Iterable[cirq.Qid], start_moment_index: int=0) -> dict[cirq.Qid, int]
```

Finds the index of the next moment that touches each qubit.

Args:
    qubits: The qubits to find the next moments acting on.
    start_moment_index: The starting point of the search.

Returns:
    The index of the next moment that touches each qubit. If there
    is no such moment, the next moment is specified as the number of
    moments in the circuit. Equivalently, can be characterized as one
    plus the index of the last moment after start_moment_index
    (inclusive) that does *not* act on a given qubit.

### `prev_moment_operating_on`

```python
def prev_moment_operating_on(self, qubits: Sequence[cirq.Qid], end_moment_index: int | None=None, max_distance: int | None=None) -> int | None
```

Finds the index of the previous moment that touches the given qubits.

Args:
    qubits: We're looking for operations affecting any of these qubits.
    end_moment_index: The moment index just after the starting point of
        the reverse search. Defaults to the length of the list of
        moments.
    max_distance: The number of moments (starting just before from the
        end index and moving backward) to check. Defaults to no limit.

Returns:
    None if there is no matching moment, otherwise the index of the
    latest matching moment.

Raises:
    ValueError: negative max_distance.

### `reachable_frontier_from`

```python
def reachable_frontier_from(self, start_frontier: dict[cirq.Qid, int], *, is_blocker: Callable[[cirq.Operation], bool]=lambda op: False) -> dict[cirq.Qid, int]
```

Determines how far can be reached into a circuit under certain rules.

The location L = (qubit, moment_index) is *reachable* if and only if the
following all hold true:

- There is not a blocking operation covering L.
-  At least one of the following holds:
    - qubit is in start frontier and moment_index =
        max(start_frontier[qubit], 0).
    - There is no operation at L and prev(L) = (qubit,
        moment_index-1) is reachable.
    - There is an (non-blocking) operation P covering L such that
        (q', moment_index - 1) is reachable for every q' on which P
        acts.

An operation in moment moment_index is blocking if at least one of the
following hold:

- `is_blocker` returns a truthy value.
- The operation acts on a qubit not in start_frontier.
- The operation acts on a qubit q such that start_frontier[q] >
    moment_index.

In other words, the reachable region extends forward through time along
each qubit in start_frontier until it hits a blocking operation. Any
location involving a qubit not in start_frontier is unreachable.

For each qubit q in `start_frontier`, the reachable locations will
correspond to a contiguous range starting at start_frontier[q] and
ending just before some index end_q. The result of this method is a
dictionary, and that dictionary maps each qubit q to its end_q.

Examples:

If `start_frontier` is

```
{
    cirq.LineQubit(0): 6,
    cirq.LineQubit(1): 2,
    cirq.LineQubit(2): 2
}
```

then the reachable wire locations in the following circuit are
highlighted with '█' characters:

```

        0   1   2   3   4   5   6   7   8   9   10  11  12  13
    0: ───H───@─────────────────█████████████████████─@───H───
              │                                       │
    1: ───────@─██H███@██████████████████████─@───H───@───────
                      │                       │
    2: ─────────██████@███H██─@───────@───H───@───────────────
                              │       │
    3: ───────────────────────@───H───@───────────────────────
```

And the computed `end_frontier` is

```
{
    cirq.LineQubit(0): 11,
    cirq.LineQubit(1): 9,
    cirq.LineQubit(2): 6,
}
```

Note that the frontier indices (shown above the circuit) are
best thought of (and shown) as happening *between* moment indices.

If we specify a blocker as follows:

```
is_blocker=lambda: op == cirq.CZ(cirq.LineQubit(1),
                                 cirq.LineQubit(2))
```

and use this `start_frontier`:

```
{
    cirq.LineQubit(0): 0,
    cirq.LineQubit(1): 0,
    cirq.LineQubit(2): 0,
    cirq.LineQubit(3): 0,
}
```

Then this is the reachable area:

```

        0   1   2   3   4   5   6   7   8   9   10  11  12  13
    0: ─██H███@██████████████████████████████████████─@───H───
              │                                       │
    1: ─██████@███H██─@───────────────────────@───H───@───────
                      │                       │
    2: ─█████████████─@───H───@───────@───H───@───────────────
                              │       │
    3: ─█████████████████████─@───H───@───────────────────────

```

and the computed `end_frontier` is:

```
{
    cirq.LineQubit(0): 11,
    cirq.LineQubit(1): 3,
    cirq.LineQubit(2): 3,
    cirq.LineQubit(3): 5,
}
```

Args:
    start_frontier: A starting set of reachable locations.
    is_blocker: A predicate that determines if operations block
        reachability. Any location covered by an operation that causes
        `is_blocker` to return True is considered to be an unreachable
        location.

Returns:
    An end_frontier dictionary, containing an end index for each qubit q
    mapped to a start index by the given `start_frontier` dictionary.

    To determine if a location (q, i) was reachable, you can use
    this expression:

        q in start_frontier and start_frontier[q] <= i < end_frontier[q]

    where i is the moment index, q is the qubit, and end_frontier is the
    result of this method.

### `findall_operations_between`

```python
def findall_operations_between(self, start_frontier: dict[cirq.Qid, int], end_frontier: dict[cirq.Qid, int], omit_crossing_operations: bool=False) -> list[tuple[int, cirq.Operation]]
```

Finds operations between the two given frontiers.

If a qubit is in `start_frontier` but not `end_frontier`, its end index
defaults to the end of the circuit. If a qubit is in `end_frontier` but
not `start_frontier`, its start index defaults to the start of the
circuit. Operations on qubits not mentioned in either frontier are not
included in the results.

Args:
    start_frontier: Just before where to start searching for operations,
        for each qubit of interest. Start frontier indices are
        inclusive.
    end_frontier: Just before where to stop searching for operations,
        for each qubit of interest. End frontier indices are exclusive.
    omit_crossing_operations: Determines whether or not operations that
        cross from a location between the two frontiers to a location
        outside the two frontiers are included or excluded. (Operations
        completely inside are always included, and operations completely
        outside are always excluded.)

Returns:
    A list of tuples. Each tuple describes an operation found between
    the two frontiers. The first item of each tuple is the index of the
    moment containing the operation, and the second item is the
    operation itself. The list is sorted so that the moment index
    increases monotonically.

### `findall_operations_until_blocked`

```python
def findall_operations_until_blocked(self, start_frontier: dict[cirq.Qid, int], is_blocker: Callable[[cirq.Operation], bool]=lambda op: False) -> list[tuple[int, cirq.Operation]]
```

Finds all operations until a blocking operation is hit.

An operation is considered blocking if both of the following hold:

- It is in the 'light cone' of start_frontier.
- `is_blocker` returns a truthy value, or it acts on a blocked qubit

Every qubit acted on by a blocking operation is thereafter itself
blocked.

The notion of reachability here differs from that in
reachable_frontier_from in two respects:

- An operation is not considered blocking only because it is in a
    moment before the start_frontier of one of the qubits on which it
    acts.
- Operations that act on qubits not in start_frontier are not
    automatically blocking.

For every (moment_index, operation) returned:

- moment_index >= min((start_frontier[q] for q in operation.qubits
    if q in start_frontier), default=0)
- set(operation.qubits).intersection(start_frontier)

Below are some examples, where on the left the opening parentheses show
`start_frontier` and on the right are the operations included (with
their moment indices) in the output. `F` and `T` indicate that
`is_blocker` return `False` or `True`, respectively, when applied to
the gates; `M` indicates that it doesn't matter.

```
    ─(─F───F───────    ┄(─F───F─)┄┄┄┄┄
       │   │              │   │
    ─(─F───F───T─── => ┄(─F───F─)┄┄┄┄┄
               │                  ┊
    ───────────T───    ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄


    ───M─────(─F───    ┄┄┄┄┄┄┄┄┄(─F─)┄┄
       │       │          ┊       │
    ───M───M─(─F───    ┄┄┄┄┄┄┄┄┄(─F─)┄┄
           │        =>        ┊
    ───────M───M───    ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
               │                  ┊
    ───────────M───    ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄


    ───M─(─────M───     ┄┄┄┄┄()┄┄┄┄┄┄┄┄
       │       │           ┊       ┊
    ───M─(─T───M───     ┄┄┄┄┄()┄┄┄┄┄┄┄┄
           │        =>         ┊
    ───────T───M───     ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
               │                   ┊
    ───────────M───     ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄


    ─(─F───F───    ┄(─F───F─)┄
       │   │    =>    │   │
    ───F─(─F───    ┄(─F───F─)┄


    ─(─F───────────    ┄(─F─)┄┄┄┄┄┄┄┄┄
       │                  │
    ───F───F───────    ┄(─F─)┄┄┄┄┄┄┄┄┄
           │        =>        ┊
    ───────F───F───    ┄┄┄┄┄┄┄┄┄(─F─)┄
               │                  │
    ─(─────────F───    ┄┄┄┄┄┄┄┄┄(─F─)┄
```

Args:
    start_frontier: A starting set of reachable locations.
    is_blocker: A predicate that determines if operations block
        reachability. Any location covered by an operation that causes
        `is_blocker` to return True is considered to be an unreachable
        location.

Returns:
    A list of tuples. Each tuple describes an operation found between
    the start frontier and a blocking operation. The first item of
    each tuple is the index of the moment containing the operation,
    and the second item is the operation itself.

### `operation_at`

```python
def operation_at(self, qubit: cirq.Qid, moment_index: int) -> cirq.Operation | None
```

Finds the operation on a qubit within a moment, if any.

Args:
    qubit: The qubit to check for an operation on.
    moment_index: The index of the moment to check for an operation
        within. Allowed to be beyond the end of the circuit.

Returns:
    None if there is no operation on the qubit at the given moment, or
    else the operation.

### `findall_operations`

```python
def findall_operations(self, predicate: Callable[[cirq.Operation], bool]) -> Iterable[tuple[int, cirq.Operation]]
```

Find the locations of all operations that satisfy a given condition.

This returns an iterator of (index, operation) tuples where each
operation satisfies op_cond(operation) is truthy. The indices are
in order of the moments and then order of the ops within that moment.

Args:
    predicate: A method that takes an Operation and returns a Truthy
        value indicating the operation meets the find condition.

Returns:
    An iterator (index, operation)'s that satisfy the op_condition.

### `findall_operations_with_gate_type`

```python
def findall_operations_with_gate_type(self, gate_type: type[_TGate]) -> Iterable[tuple[int, cirq.GateOperation, _TGate]]
```

Find the locations of all gate operations of a given type.

Args:
    gate_type: The type of gate to find, e.g. XPowGate or
        MeasurementGate.

Returns:
    An iterator (index, operation, gate)'s for operations with the given
    gate type.

### `has_measurements`

```python
def has_measurements(self) -> bool
```

Returns whether or not this circuit has measurements.

Returns: True if `cirq.is_measurement(self)` is True otherwise False.

### `are_all_measurements_terminal`

```python
def are_all_measurements_terminal(self) -> bool
```

Whether all measurement gates are at the end of the circuit.

Returns: True iff no measurement is followed by a gate.

### `are_all_matches_terminal`

```python
def are_all_matches_terminal(self, predicate: Callable[[cirq.Operation], bool]) -> bool
```

Check whether all of the ops that satisfy a predicate are terminal.

This method will transparently descend into any CircuitOperations this
circuit contains; as a result, it will misbehave if the predicate
refers to CircuitOperations. See the tests for an example of this.

Args:
    predicate: A predicate on ops.Operations which is being checked.

Returns:
    Whether or not all `Operation` s in a circuit that satisfy the
    given predicate are terminal. Also checks within any CircuitGates
    the circuit may contain.

### `are_any_measurements_terminal`

```python
def are_any_measurements_terminal(self) -> bool
```

Whether any measurement gates are at the end of the circuit.

Returns: True iff some measurements are not followed by a gate.

### `are_any_matches_terminal`

```python
def are_any_matches_terminal(self, predicate: Callable[[cirq.Operation], bool]) -> bool
```

Check whether any of the ops that satisfy a predicate are terminal.

This method will transparently descend into any CircuitOperations this
circuit contains; as a result, it will misbehave if the predicate
refers to CircuitOperations. See the tests for an example of this.

Args:
    predicate: A predicate on ops.Operations which is being checked.

Returns:
    Whether or not any `Operation` s in a circuit that satisfy the
    given predicate are terminal. Also checks within any CircuitGates
    the circuit may contain.

### `all_qubits`

```python
def all_qubits(self) -> frozenset[cirq.Qid]
```

Returns the qubits acted upon by Operations in this circuit.

Returns: frozenset of `cirq.Qid` objects acted on by all operations
    in this circuit.

### `all_operations`

```python
def all_operations(self) -> Iterator[cirq.Operation]
```

Returns an iterator over the operations in the circuit.

Returns: Iterator over `cirq.Operation` elements found in this circuit.

### `map_operations`

```python
def map_operations(self, func: Callable[[cirq.Operation], cirq.OP_TREE]) -> Self
```

Applies the given function to all operations in this circuit.

Args:
    func: a mapping function from operations to OP_TREEs.

Returns:
    A circuit with the same basic structure as the original, but with
    each operation `op` replaced with `func(op)`.

### `qid_shape`

```python
def qid_shape(self, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT) -> tuple[int, ...]
```

Get the qubit shapes of all qubits in this circuit.

Returns: A tuple containing the dimensions (shape) of all qudits
    found in this circuit according to `qubit_order`.

### `all_measurement_key_names`

```python
def all_measurement_key_names(self) -> frozenset[str]
```

Returns the set of all measurement key names in this circuit.

Returns: frozenset of strings that are the measurement key
    names in this circuit.

### `unitary`

```python
def unitary(self, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, qubits_that_should_be_present: Iterable[cirq.Qid]=(), ignore_terminal_measurements: bool=True, dtype: type[np.complexfloating]=np.complex128) -> np.ndarray
```

Converts the circuit into a unitary matrix, if possible.

Returns the same result as `cirq.unitary`, but provides more options.

Args:
    qubit_order: Determines how qubits are ordered when passing matrices
        into np.kron.
    qubits_that_should_be_present: Qubits that may or may not appear
        in operations within the circuit, but that should be included
        regardless when generating the matrix.
    ignore_terminal_measurements: When set, measurements at the end of
        the circuit are ignored instead of causing the method to
        fail.
    dtype: The numpy dtype for the returned unitary. Defaults to
        np.complex128. Specifying np.complex64 will run faster at the
        cost of precision. `dtype` must be a complex np.dtype, unless
        all operations in the circuit have unitary matrices with
        exclusively real coefficients (e.g. an H + TOFFOLI circuit).

Returns:
    A (possibly gigantic) 2d numpy array corresponding to a matrix
    equivalent to the circuit's effect on a quantum state.

Raises:
    ValueError: The circuit contains measurement gates that are not
        ignored.
    TypeError: The circuit contains gates that don't have a known
        unitary matrix, e.g. gates parameterized by a Symbol.

### `final_state_vector`

```python
def final_state_vector(self, *, initial_state: cirq.STATE_VECTOR_LIKE=0, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, ignore_terminal_measurements: bool=False, dtype: type[np.complexfloating]=np.complex128, param_resolver: cirq.ParamResolverOrSimilarType=None, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> np.ndarray
```

Returns the state vector resulting from acting operations on a state.

This is equivalent to calling cirq.final_state_vector with the same
arguments and this circuit as the "program".

Args:
    initial_state: If an int, the state is set to the computational
        basis state corresponding to this state. Otherwise  if this
        is a np.ndarray it is the full initial state. In this case it
        must be the correct size, be normalized (an L2 norm of 1), and
        be safely castable to an appropriate dtype for the simulator.
    qubit_order: Determines the canonical ordering of the qubits. This
        is often used in specifying the initial state, i.e. the
        ordering of the computational basis states.
    qubits_that_should_be_present: Qubits that may or may not appear
        in operations within the circuit, but that should be included
        regardless when generating the matrix.
    ignore_terminal_measurements: When set, measurements at the end of
        the circuit are ignored instead of causing the method to
        fail. Defaults to False.
    dtype: The `numpy.dtype` used by the simulation. Typically one of
        `numpy.complex64` or `numpy.complex128`.
    param_resolver: Parameters to run with the program.
    seed: The random seed to use for this simulator.

Returns:
    The state vector resulting from applying the given unitary
    operations to the desired initial state. Specifically, a numpy
    array containing the amplitudes in np.kron order, where the
    order of arguments to kron is determined by the qubit order
    argument (which defaults to just sorting the qubits that are
    present into an ascending order).

Raises:
    ValueError: If the program doesn't have a well defined final state
        because it has non-unitary gates.

### `to_text_diagram`

```python
def to_text_diagram(self, *, use_unicode_characters: bool=True, transpose: bool=False, include_tags: bool | Iterable[type]=True, precision: int | None=3, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT) -> str
```

Returns text containing a diagram describing the circuit.

Args:
    use_unicode_characters: Determines if unicode characters are
        allowed (as opposed to ascii-only diagrams).
    transpose: Arranges qubit wires vertically instead of horizontally.
    include_tags: Controls which tags attached to operations are
        included. ``True`` includes all tags, ``False`` includes none,
        or a collection of tag classes may be specified to include only
        those tags.
    precision: Number of digits to display in text diagram
    qubit_order: Determines how qubits are ordered in the diagram.

Returns:
    The text diagram.

### `to_text_diagram_drawer`

```python
def to_text_diagram_drawer(self, *, use_unicode_characters: bool=True, qubit_namer: Callable[[cirq.Qid], str] | None=None, transpose: bool=False, include_tags: bool | Iterable[type]=True, draw_moment_groups: bool=True, precision: int | None=3, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, get_circuit_diagram_info: Callable[[cirq.Operation, cirq.CircuitDiagramInfoArgs], cirq.CircuitDiagramInfo] | None=None) -> cirq.TextDiagramDrawer
```

Returns a TextDiagramDrawer with the circuit drawn into it.

Args:
    use_unicode_characters: Determines if unicode characters are
        allowed (as opposed to ascii-only diagrams).
    qubit_namer: Names qubits in diagram. Defaults to using _circuit_diagram_info_ or str.
    transpose: Arranges qubit wires vertically instead of horizontally.
    include_tags: Controls which tags attached to operations are
        included. ``True`` includes all tags, ``False`` includes none,
        or a collection of tag classes may be specified to include only
        those tags.
    draw_moment_groups: Whether to draw moment symbol or not
    precision: Number of digits to use when representing numbers.
    qubit_order: Determines how qubits are ordered in the diagram.
    get_circuit_diagram_info: Gets circuit diagram info. Defaults to
        protocol with fallback.

Returns:
    The TextDiagramDrawer instance.

### `to_qasm`

```python
def to_qasm(self, header: str | None=None, precision: int=10, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT, version: str='2.0') -> str
```

Returns QASM equivalent to the circuit.

Args:
    header: A multi-line string that is placed in a comment at the top
        of the QASM. Defaults to a cirq version specifier.
    precision: Number of digits to use when representing numbers.
    qubit_order: Determines how qubits are ordered in the QASM
        register.
    version: Version of OpenQASM to output.  Defaults to OpenQASM 2.0.
        Specify '3.0' if OpenQASM 3.0 is desired.

### `save_qasm`

```python
def save_qasm(self, file_path: str | bytes | int, header: str | None=None, precision: int=10, qubit_order: cirq.QubitOrderOrList=ops.QubitOrder.DEFAULT) -> None
```

Save a QASM file equivalent to the circuit.

Args:
    file_path: The location of the file where the qasm will be written.
    header: A multi-line string that is placed in a comment at the top
        of the QASM. Defaults to a cirq version specifier.
    precision: Number of digits to use when representing numbers.
    qubit_order: Determines how qubits are ordered in the QASM
        register.

### `zip`

```python
def zip(*circuits: cirq.AbstractCircuit, align: cirq.Alignment | str=Alignment.LEFT) -> cirq.AbstractCircuit
```

Combines operations from circuits in a moment-by-moment fashion.

Moment k of the resulting circuit will have all operations from moment
k of each of the given circuits.

When the given circuits have different lengths, the shorter circuits are
implicitly padded with empty moments. This differs from the behavior of
python's built-in zip function, which would instead truncate the longer
circuits.

The zipped circuits can't have overlapping operations occurring at the
same moment index.

Args:
    *circuits: The circuits to merge together.
    align: The alignment for the zip, see `cirq.Alignment`.

Returns:
    The merged circuit.

Raises:
    ValueError: If the zipped circuits have overlapping operations occurring
        at the same moment index.

Examples:

>>> import cirq
>>> a, b, c, d = cirq.LineQubit.range(4)
>>> circuit1 = cirq.Circuit(cirq.H(a), cirq.CNOT(a, b))
>>> circuit2 = cirq.Circuit(cirq.X(c), cirq.Y(c), cirq.Z(c))
>>> circuit3 = cirq.Circuit(cirq.Moment(), cirq.Moment(cirq.S(d)))
>>> print(circuit1.zip(circuit2))
0: ───H───@───────
          │
1: ───────X───────
<BLANKLINE>
2: ───X───Y───Z───
>>> print(circuit1.zip(circuit2, circuit3))
0: ───H───@───────
          │
1: ───────X───────
<BLANKLINE>
2: ───X───Y───Z───
<BLANKLINE>
3: ───────S───────
>>> print(cirq.Circuit.zip(circuit3, circuit2, circuit1))
0: ───H───@───────
          │
1: ───────X───────
<BLANKLINE>
2: ───X───Y───Z───
<BLANKLINE>
3: ───────S───────

### `concat_ragged`

```python
def concat_ragged(*circuits: cirq.AbstractCircuit, align: cirq.Alignment | str=Alignment.LEFT) -> cirq.AbstractCircuit
```

Concatenates circuits, overlapping them if possible due to ragged edges.

Starts with the first circuit (index 0), then iterates over the other
circuits while folding them in. To fold two circuits together, they
are placed one after the other and then moved inward until just before
their operations would collide. If any of the circuits do not share
qubits and so would not collide, the starts or ends of the circuits will
be aligned, according to the given align parameter.

Beware that this method is *not* associative. For example:

>>> a, b = cirq.LineQubit.range(2)
>>> A = cirq.Circuit(cirq.H(a))
>>> B = cirq.Circuit(cirq.H(b))
>>> f = cirq.Circuit.concat_ragged
>>> f(f(A, B), A) == f(A, f(B, A))
False
>>> len(f(f(f(A, B), A), B)) == len(f(f(A, f(B, A)), B))
False

Args:
    *circuits: The circuits to concatenate.
    align: When to stop when sliding the circuits together.
        'left': Stop when the starts of the circuits align.
        'right': Stop when the ends of the circuits align.
        'first': Stop the first time either the starts or the ends align. Circuits
            are never overlapped more than needed to align their starts (in case
            the left circuit is smaller) or to align their ends (in case the right
            circuit is smaller)

Returns:
    The concatenated and overlapped circuit.

### `get_independent_qubit_sets`

```python
def get_independent_qubit_sets(self) -> list[set[cirq.Qid]]
```

Divide circuit's qubits into independent qubit sets.

Independent qubit sets are the qubit sets such that there are
no entangling gates between qubits belonging to different sets.
If this is not possible, a sequence with a single factor (the whole set of
circuit's qubits) is returned.

>>> q0, q1, q2 = cirq.LineQubit.range(3)
>>> circuit = cirq.Circuit()
>>> circuit.append(cirq.Moment(cirq.H(q2)))
>>> circuit.append(cirq.Moment(cirq.CZ(q0,q1)))
>>> circuit.append(cirq.H(q0))
>>> print(circuit)
0: ───────@───H───
          │
1: ───────@───────
<BLANKLINE>
2: ───H───────────
>>> [sorted(qs) for qs in circuit.get_independent_qubit_sets()]
[[cirq.LineQubit(0), cirq.LineQubit(1)], [cirq.LineQubit(2)]]

Returns:
    The list of independent qubit sets.

### `factorize`

```python
def factorize(self) -> Iterable[Self]
```

Factorize circuit into a sequence of independent circuits (factors).

Factorization is possible when the circuit's qubits can be divided
into two or more independent qubit sets. Preserves the moments from
the original circuit.
If this is not possible, returns the set consisting of the single
circuit (this one).

>>> q0, q1, q2 = cirq.LineQubit.range(3)
>>> circuit = cirq.Circuit()
>>> circuit.append(cirq.Moment(cirq.H(q2)))
>>> circuit.append(cirq.Moment(cirq.CZ(q0,q1)))
>>> circuit.append(cirq.H(q0))
>>> print(circuit)
0: ───────@───H───
          │
1: ───────@───────
<BLANKLINE>
2: ───H───────────
>>> for i, f in enumerate(circuit.factorize()):
...     print("Factor {}".format(i))
...     print(f)
...
Factor 0
0: ───────@───H───
          │
1: ───────@───────
Factor 1
2: ───H───────────

Returns:
    The sequence of circuits, each including only the qubits from one
    independent qubit set.

## `Circuit`

```python
class Circuit(AbstractCircuit)
```

A mutable list of groups of operations to apply to some qubits.

Methods returning information about the circuit (inherited from
AbstractCircuit):

*   next_moment_operating_on
*   earliest_available_moment
*   prev_moment_operating_on
*   next_moments_operating_on
*   operation_at
*   all_qubits
*   all_operations
*   findall_operations
*   findall_operations_between
*   findall_operations_until_blocked
*   findall_operations_with_gate_type
*   reachable_frontier_from
*   has_measurements
*   are_all_matches_terminal
*   are_all_measurements_terminal
*   unitary
*   final_state_vector
*   to_text_diagram
*   to_text_diagram_drawer
*   qid_shape
*   all_measurement_key_names
*   to_quil
*   to_qasm
*   save_qasm
*   get_independent_qubit_sets

Methods for mutation:

*   insert
*   append
*   insert_into_range
*   clear_operations_touching
*   batch_insert
*   batch_remove
*   batch_insert_into
*   insert_at_frontier

Circuits can also be iterated over,

```
    for moment in circuit:
        ...
```

and sliced,

*   `circuit[1:3]` is a new Circuit made up of two moments, the first being
        `circuit[1]` and the second being `circuit[2]`;
*   `circuit[:, qubit]` is a new Circuit with the same moments, but with
        only those operations which act on the given Qubit;
*   `circuit[:, qubits]`, where 'qubits' is list of Qubits, is a new Circuit
        with the same moments, but only with those operations which touch
        any of the given qubits;
*   `circuit[1:3, qubit]` is equivalent to `circuit[1:3][:, qubit]`;
*   `circuit[1:3, qubits]` is equivalent to `circuit[1:3][:, qubits]`;

and concatenated,

*    `circuit1 + circuit2` is a new Circuit made up of the moments in
        circuit1 followed by the moments in circuit2;

and multiplied by an integer,

*    `circuit * k` is a new Circuit made up of the moments in circuit repeated
        k times.

and mutated,
*    `circuit[1:7] = [Moment(...)]`

and factorized,
*   `circuit.factorize()` returns a sequence of Circuits which represent
        independent 'factors' of the original Circuit.

### `__init__`

```python
def __init__(self, *contents: cirq.OP_TREE, strategy: cirq.InsertStrategy=InsertStrategy.EARLIEST, tags: Sequence[Hashable]=()) -> None
```

Initializes a circuit.

Args:
    contents: The initial list of moments and operations defining the
        circuit. You can also pass in operations, lists of operations,
        or generally anything meeting the `cirq.OP_TREE` contract.
        Non-moment entries will be inserted according to the specified
        insertion strategy.
    strategy: When initializing the circuit with operations and moments
        from `contents`, this determines how the operations are packed
        together. This option does not affect later insertions into the
        circuit.
    tags: A sequence of any type of object that is useful to attach metadata
        to this circuit as long as the type is hashable.  If you wish the
        resulting circuit to be eventually serialized into JSON, you should
        also restrict the tags to be JSON serializable.

### `freeze`

```python
def freeze(self) -> cirq.FrozenCircuit
```

Gets a frozen version of this circuit.

Repeated calls to `.freeze()` will return the same FrozenCircuit
instance as long as this circuit is not mutated.

### `copy`

```python
def copy(self) -> Circuit
```

Return a copy of this circuit.

### `__pow__`

```python
def __pow__(self, exponent: int) -> cirq.Circuit
```

A circuit raised to a power, only valid for exponent -1, the inverse.

This will fail if anything other than -1 is passed to the Circuit by
returning NotImplemented.  Otherwise this will return the inverse
circuit, which is the circuit with its moment order reversed and for
every moment all the moment's operations are replaced by its inverse.
If any of the operations do not support inverse, NotImplemented will be
returned.

### `transform_qubits`

```python
def transform_qubits(self, qubit_map: dict[cirq.Qid, cirq.Qid] | Callable[[cirq.Qid], cirq.Qid]) -> cirq.Circuit
```

Returns the same circuit, but with different qubits.

This function will return a new `Circuit` with the same gates but
with qubits mapped according to the argument.

For example, the following will translate LineQubits to GridQubits:

>>> grid_qubits = cirq.GridQubit.square(2)
>>> line_qubits = cirq.LineQubit.range(4)
>>> circuit = cirq.Circuit([cirq.H(q) for q in line_qubits])
>>> circuit.transform_qubits(lambda q : grid_qubits[q.x])
cirq.Circuit([
    cirq.Moment(
        cirq.H(cirq.GridQubit(0, 0)),
        cirq.H(cirq.GridQubit(0, 1)),
        cirq.H(cirq.GridQubit(1, 0)),
        cirq.H(cirq.GridQubit(1, 1)),
    ),
])

Args:
    qubit_map: A function or a dict mapping each current qubit into a desired
        new qubit.

Returns:
    The receiving circuit but with qubits transformed by the given
        function.

Raises:
    TypeError: If `qubit_function` is not a function or a dict.

### `earliest_available_moment`

```python
def earliest_available_moment(self, op: cirq.Operation, *, end_moment_index: int | None=None) -> int
```

Finds the index of the earliest (i.e. left most) moment which can accommodate `op`.

Note that, unlike `circuit.prev_moment_operating_on`, this method also takes care of
implicit dependencies between measurements and classically controlled operations (CCO)
that depend on the results of those measurements. Therefore, using this method, a CCO
`op` would not be allowed to move left past a measurement it depends upon.

Args:
    op: Operation for which the earliest moment that can accommodate it needs to be found.
    end_moment_index: The moment index just after the starting point of the reverse search.
        Defaults to the length of the list of moments.

Returns:
    Index of the earliest matching moment. Returns `end_moment_index` if no moment on left
    is available.

### `insert`

```python
def insert(self, index: int, moment_or_operation_tree: cirq.OP_TREE, strategy: cirq.InsertStrategy=InsertStrategy.EARLIEST) -> int
```

Inserts operations into the circuit.

Operations are inserted into the moment specified by the index and
'InsertStrategy'.
Moments within the operation tree are inserted intact.

Args:
    index: The index to insert all the operations at.
    moment_or_operation_tree: The moment or operation tree to insert.
    strategy: How to pick/create the moment to put operations into.

Returns:
    The insertion index that will place operations just after the
    operations that were inserted by this method.

Raises:
    ValueError: Bad insertion strategy.

### `insert_into_range`

```python
def insert_into_range(self, operations: cirq.OP_TREE, start: int, end: int) -> int
```

Writes operations inline into an area of the circuit.

Args:
    start: The start of the range (inclusive) to write the
        given operations into.
    end: The end of the range (exclusive) to write the given
        operations into. If there are still operations remaining,
        new moments are created to fit them.
    operations: An operation or tree of operations to insert.

Returns:
    An insertion index that will place operations after the operations
    that were inserted by this method.

Raises:
    IndexError: Bad inline_start and/or inline_end.

### `insert_at_frontier`

```python
def insert_at_frontier(self, operations: cirq.OP_TREE, start: int, frontier: dict[cirq.Qid, int] | None=None) -> dict[cirq.Qid, int]
```

Inserts operations inline at frontier.

Args:
    operations: The operations to insert.
    start: The moment at which to start inserting the operations.
    frontier: frontier[q] is the earliest moment in which an operation
        acting on qubit q can be placed.

Raises:
    ValueError: If the frontier given is after start.

### `batch_remove`

```python
def batch_remove(self, removals: Iterable[tuple[int, cirq.Operation]]) -> None
```

Removes several operations from a circuit.

Args:
    removals: A sequence of (moment_index, operation) tuples indicating
        operations to delete from the moments that are present. All
        listed operations must actually be present or the edit will
        fail (without making any changes to the circuit).

Raises:
    ValueError: One of the operations to delete wasn't present to start with.
    IndexError: Deleted from a moment that doesn't exist.

### `batch_replace`

```python
def batch_replace(self, replacements: Iterable[tuple[int, cirq.Operation, cirq.Operation]]) -> None
```

Replaces several operations in a circuit with new operations.

Args:
    replacements: A sequence of (moment_index, old_op, new_op) tuples
        indicating operations to be replaced in this circuit. All "old"
        operations must actually be present or the edit will fail
        (without making any changes to the circuit).

Raises:
    ValueError: One of the operations to replace wasn't present to start with.
    IndexError: Replaced in a moment that doesn't exist.

### `batch_insert_into`

```python
def batch_insert_into(self, insert_intos: Iterable[tuple[int, cirq.OP_TREE]]) -> None
```

Inserts operations into empty spaces in existing moments.

If any of the insertions fails (due to colliding with an existing
operation), this method fails without making any changes to the circuit.

Args:
    insert_intos: A sequence of (moment_index, new_op_tree)
        pairs indicating a moment to add new operations into.

Raises:
    ValueError: One of the insertions collided with an existing
        operation.
    IndexError: Inserted into a moment index that doesn't exist.

### `batch_insert`

```python
def batch_insert(self, insertions: Iterable[tuple[int, cirq.OP_TREE]]) -> None
```

Applies a batched insert operation to the circuit.

Transparently handles the fact that earlier insertions may shift
the index that later insertions should occur at. For example, if you
insert an operation at index 2 and at index 4, but the insert at index 2
causes a new moment to be created, then the insert at "4" will actually
occur at index 5 to account for the shift from the new moment.

All insertions are done with the strategy `cirq.InsertStrategy.EARLIEST`.

When multiple inserts occur at the same index, the gates from the later
inserts end up before the gates from the earlier inserts (exactly as if
you'd called list.insert several times with the same index: the later
inserts shift the earliest inserts forward).

Args:
    insertions: A sequence of (insert_index, operations) pairs
        indicating operations to add into the circuit at specific
        places.

### `append`

```python
def append(self, moment_or_operation_tree: cirq.OP_TREE, strategy: cirq.InsertStrategy=InsertStrategy.EARLIEST) -> None
```

Appends operations onto the end of the circuit.

Moments within the operation tree are appended intact.

Args:
    moment_or_operation_tree: The moment or operation tree to append.
    strategy: How to pick/create the moment to put operations into.

### `clear_operations_touching`

```python
def clear_operations_touching(self, qubits: Iterable[cirq.Qid], moment_indices: Iterable[int]) -> None
```

Clears operations that are touching given qubits at given moments.

Args:
    qubits: The qubits to check for operations on.
    moment_indices: The indices of moments to check for operations
        within.

### `with_tags`

```python
def with_tags(self, *new_tags: Hashable) -> cirq.Circuit
```

Creates a new tagged `Circuit` with `self.tags` and `new_tags` combined.

### `with_noise`

```python
def with_noise(self, noise: cirq.NOISE_MODEL_LIKE) -> cirq.Circuit
```

Make a noisy version of the circuit.

Args:
    noise: The noise model to use.  This describes the kind of noise to
        add to the circuit.

Returns:
    A new circuit with the same moment structure but with new moments
    inserted where needed when more than one noisy operation is
    generated for an input operation.  Emptied moments are removed.

## `get_earliest_accommodating_moment_index`

```python
def get_earliest_accommodating_moment_index(moment_or_operation: _MOMENT_OR_OP, qubit_indices: dict[cirq.Qid, int], mkey_indices: dict[cirq.MeasurementKey, int], ckey_indices: dict[cirq.MeasurementKey, int], length: int | None=None) -> int
```

Get the index of the earliest moment that can accommodate the given moment or operation.

Updates the dictionaries keeping track of the last moment index addressing a given qubit,
measurement key, and control key.

Args:
    moment_or_operation: The moment operation in question.
    qubit_indices: A dictionary mapping qubits to the latest moments that address them.
    mkey_indices: A dictionary mapping measurement keys to the latest moments that address them.
    ckey_indices: A dictionary mapping control keys to the latest moments that address them.
    length: The length of the circuit that we are trying to insert a moment or operation into.
        Should probably be equal to the maximum of the values in `qubit_indices`,
        `mkey_indices`, and `ckey_indices`.

Returns:
    The integer index of the earliest moment that can accommodate the given moment or operation.
