---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/circuits/circuit_operation.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/circuits/circuit_operation.py
license: Apache-2.0
---

## Module `cirq-core/cirq/circuits/circuit_operation.py`

A structure for encapsulating entire circuits in an operation.

A CircuitOperation is an Operation object that wraps a FrozenCircuit. When
applied as part of a larger circuit, a CircuitOperation will execute all
component operations in order, including any nested CircuitOperations.

## `CircuitOperation`

```python
class CircuitOperation(ops.Operation)
```

An operation that encapsulates a circuit.

This class captures modifications to the contained circuit, such as tags
and loops, to support more condensed serialization. Similar to
GateOperation, this type is immutable.

### `__init__`

```python
def __init__(self, circuit: cirq.FrozenCircuit, repetitions: INT_TYPE=1, qubit_map: dict[cirq.Qid, cirq.Qid] | None=None, measurement_key_map: dict[str, str] | None=None, param_resolver: study.ParamResolverOrSimilarType | None=None, repetition_ids: Sequence[str] | None=None, parent_path: tuple[str, ...]=(), extern_keys: frozenset[cirq.MeasurementKey]=frozenset(), use_repetition_ids: bool | None=None, repeat_until: cirq.Condition | None=None)
```

Initializes a CircuitOperation.

Args:
    circuit: The FrozenCircuit wrapped by this operation.
    repetitions: How many times the circuit should be repeated. This can be
        integer, or a sympy expression. If sympy, the expression must
        resolve to an integer, or float within 0.001 of integer, at
        runtime.
    qubit_map: Remappings for qubits in the circuit.
    measurement_key_map: Remappings for measurement keys in the circuit.
        The keys and values should be unindexed (i.e. without repetition_ids).
        The values cannot contain the `MEASUREMENT_KEY_SEPARATOR`.
    param_resolver: Resolved values for parameters in the circuit.
    repetition_ids: List of identifiers for each repetition of the
        CircuitOperation. If populated, the length should be equal to the
        repetitions. If not populated and abs(`repetitions`) > 1, it is
        initialized to strings for numbers in `range(repetitions)`.
    parent_path: A tuple of identifiers for any parent CircuitOperations
        containing this one.
    extern_keys: The set of measurement keys defined at extern scope. The
        values here are used by decomposition and simulation routines to
        cache which external measurement keys exist as possible binding
        targets for unbound `ClassicallyControlledOperation` keys. This
        field is not intended to be set or changed manually, and should be
        empty in circuits that aren't in the middle of decomposition.
    use_repetition_ids: When True, any measurement key in the subcircuit
        will have its path prepended with the repetition id for each
        repetition. When False, this will not happen and the measurement
        key will be repeated. When None, default to False unless the caller
        passes `repetition_ids` explicitly.
    repeat_until: A condition that will be tested after each iteration of
        the subcircuit. The subcircuit will repeat until condition returns
        True, but will always run at least once, and the measurement key
        need not be defined prior to the subcircuit (but must be defined in
        a measurement within the subcircuit). This field is incompatible
        with repetitions or repetition_ids.

Raises:
    TypeError: if repetitions is not an integer or sympy expression, or if
        the provided circuit is not a FrozenCircuit.
    ValueError: if any of the following conditions is met.
        - Negative repetitions on non-invertible circuit
        - Number of repetition IDs does not match repetitions
        - Repetition IDs used with parameterized repetitions
        - Conflicting qubit dimensions in qubit_map
        - Measurement key map has invalid key names
        - repeat_until used with other repetition controls
        - Key(s) in repeat_until are not modified by circuit

### `base_operation`

```python
def base_operation(self) -> cirq.CircuitOperation
```

Returns a copy of this operation with only the wrapped circuit.

Key and qubit mappings, parameter values, and repetitions are not copied.

### `replace`

```python
def replace(self, **changes) -> cirq.CircuitOperation
```

Returns a copy of this operation with the specified changes.

### `qubits`

```python
def qubits(self) -> tuple[cirq.Qid, ...]
```

Returns the qubits operated on by this object.

### `mapped_circuit`

```python
def mapped_circuit(self, deep: bool=False) -> cirq.Circuit
```

Applies all maps to the contained circuit and returns the result.

Args:
    deep: If true, this will also call mapped_circuit on any
        CircuitOperations this object contains.

Returns:
    The contained circuit with all other member variables (repetitions,
    qubit mapping, parameterization, etc.) applied to it. This behaves
    like `cirq.decompose(self)`, but preserving moment structure.

### `mapped_op`

```python
def mapped_op(self, deep: bool=False) -> cirq.CircuitOperation
```

As `mapped_circuit`, but wraps the result in a CircuitOperation.

### `repeat`

```python
def repeat(self, repetitions: IntParam | None=None, repetition_ids: Sequence[str] | None=None, use_repetition_ids: bool | None=None) -> CircuitOperation
```

Returns a copy of this operation repeated 'repetitions' times.
 Each repetition instance will be identified by a single repetition_id.

Args:
    repetitions: Number of times this operation should repeat. This
        is multiplied with any pre-existing repetitions. If unset, it
        defaults to the length of `repetition_ids`.
    repetition_ids: List of IDs, one for each repetition. If unset,
        defaults to `default_repetition_ids(repetitions)`.
    use_repetition_ids: If given, this specifies the value for `use_repetition_ids`
        of the resulting circuit operation. If not given, we enable ids if
        `repetition_ids` is not None, and otherwise fall back to
        `self.use_repetition_ids`.

Returns:
    A copy of this operation repeated `repetitions` times with the
    appropriate `repetition_ids`. The output `repetition_ids` are the
    cartesian product of input `repetition_ids` with the base
    operation's `repetition_ids`. If the base operation has unset
    `repetition_ids` (indicates {-1, 0, 1} `repetitions` with no custom
    IDs), the input `repetition_ids` are directly used.

Raises:
    TypeError: `repetitions` is not an integer value.
    ValueError: Unexpected length of `repetition_ids`.
    ValueError: Both `repetitions` and `repetition_ids` are None.

### `with_key_path`

```python
def with_key_path(self, path: tuple[str, ...]) -> cirq.CircuitOperation
```

Alias for `cirq.with_key_path(self, path)`.

Args:
    path: Tuple of strings representing an alternate path to assign to the measurement
        keys in this `CircuitOperation`.

Returns:
    A copy of this object with `parent_path=path`.

### `with_repetition_ids`

```python
def with_repetition_ids(self, repetition_ids: list[str]) -> cirq.CircuitOperation
```

Returns a copy of this `CircuitOperation` with the given repetition IDs.

Args:
    repetition_ids: List of new repetition IDs to use. Must have length equal to the
        existing number of repetitions.

Returns:
    A copy of this object with `repetition_ids=repetition_ids`.

### `with_qubit_mapping`

```python
def with_qubit_mapping(self, qubit_map: Mapping[cirq.Qid, cirq.Qid] | Callable[[cirq.Qid], cirq.Qid]) -> cirq.CircuitOperation
```

Returns a copy of this operation with an updated qubit mapping.

Users should pass either 'qubit_map' or 'transform' to this method.

Args:
    qubit_map: A mapping of old qubits to new qubits. This map will be
        composed with any existing qubit mapping.

Returns:
    A copy of this operation targeting qubits as indicated by qubit_map.

Raises:
    TypeError: qubit_map was not a function or dict mapping qubits to
        qubits.
    ValueError: The new operation has a different number of qubits than
        this operation.

### `with_qubits`

```python
def with_qubits(self, *new_qubits: cirq.Qid) -> cirq.CircuitOperation
```

Returns a copy of this operation with an updated qubit mapping.

Args:
    *new_qubits: A list of qubits to target. Qubits in this list are
        matched to qubits in the circuit following default qubit order,
        ignoring any existing qubit map.

Returns:
    A copy of this operation targeting `new_qubits`.

Raises:
    ValueError: `new_qubits` has a different number of qubits than
        this operation.

### `with_measurement_key_mapping`

```python
def with_measurement_key_mapping(self, key_map: Mapping[str, str]) -> cirq.CircuitOperation
```

Returns a copy of this operation with an updated key mapping.

Args:
    key_map: A mapping of old measurement keys to new measurement keys.
        This map will be composed with any existing key mapping.
        The keys and values of the map should be unindexed (i.e. without
        repetition_ids).

Returns:
    A copy of this operation with measurement keys updated as specified
        by key_map.

Raises:
    ValueError: The new operation has a different number of measurement
        keys than this operation.

### `with_params`

```python
def with_params(self, param_values: cirq.ParamResolverOrSimilarType, recursive: bool=False) -> cirq.CircuitOperation
```

Returns a copy of this operation with an updated ParamResolver.

Any existing parameter mappings will have their values updated given
the provided mapping, and any new parameters will be added to the
ParamResolver.

Note that any resulting parameter mappings with no corresponding
parameter in the base circuit will be omitted. These parameters do not
apply to the `repetitions` field if that is parameterized.

Args:
    param_values: A map or ParamResolver able to convert old param
        values to new param values. This map will be composed with any
        existing ParamResolver via single-step resolution.
    recursive: If True, resolves parameter values recursively over the
        resolver; otherwise performs a single resolution step. This
        behavior applies only to the passed-in mapping, for the current
        application. Existing parameters are never resolved recursively
        because a->b and b->a needs to be a valid mapping.

Returns:
    A copy of this operation with its ParamResolver updated as specified
        by param_values.
