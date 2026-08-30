---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/decompose_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/decompose_protocol.py
license: Apache-2.0
---

## `DecompositionContext`

```python
class DecompositionContext
```

Stores common configurable options for decomposing composite gates into simpler operations.

Args:
    qubit_manager: A `cirq.QubitManager` instance to allocate clean / dirty ancilla qubits as
        part of the decompose protocol.
    extract_global_phases: If set, will extract the global phases from
     `DECOMPOSE_TARGET_GATESET` into independent global phase operations.

### `extracting_global_phases`

```python
def extracting_global_phases(self) -> DecompositionContext
```

Returns a copy with the `extract_global_phases` field set.

## `SupportsDecompose`

```python
class SupportsDecompose(Protocol)
```

An object that can be decomposed into simpler operations.

All decomposition methods should ultimately terminate on basic 1-qubit and
2-qubit gates included by default in Cirq. If a custom decomposition is not
specified, Cirq will decompose all operations to XPow/YPow/ZPow/CZPow/Measurement
+ Global phase gateset. However, the default decomposition in Cirq should be a last resort
fallback and it is recommended for consumers of decomposition to either not depend
upon a specific target gateset, or give an `intercepting_decomposer` to `cirq.decompose`
that attempts to target a specific gate set.

For example, `cirq.TOFFOLI` has a `_decompose_` method that returns a pair
of Hadamard gates surrounding a `cirq.CCZ`. Although `cirq.CCZ` is not a
1-qubit or 2-qubit operation, it specifies its own `_decompose_` method
that only returns 1-qubit or 2-qubit operations. This means that iteratively
decomposing `cirq.TOFFOLI` terminates in 1-qubit and 2-qubit operations, and
so almost all decomposition-aware code will be able to handle `cirq.TOFFOLI`
instances.

Callers are responsible for iteratively decomposing until they are given
operations that they understand. The `cirq.decompose` method is a simple way
to do this, because it has logic to recursively decompose until a given
`keep` predicate is satisfied.

Code implementing `_decompose_` MUST NOT create cycles, such as a gate A
decomposes into a gate B which decomposes back into gate A. This will result
in infinite loops when calling `cirq.decompose`.

It is permitted (though not recommended) for the chain of decompositions
resulting from an operation to hit a dead end before reaching 1-qubit or
2-qubit operations. When this happens, `cirq.decompose` will raise
a `TypeError` by default, but can be configured to ignore the issue or
raise a caller-provided error.

## `SupportsDecomposeWithQubits`

```python
class SupportsDecomposeWithQubits(Protocol)
```

An object that can be decomposed into operations on given qubits.

Returning `NotImplemented` or `None` means "not decomposable". Otherwise an
operation, list of operations, or generally anything meeting the `OP_TREE`
contract can be returned.

For example, a SWAP gate can be turned into three CNOTs. But in order to
describe those CNOTs one must be able to talk about "the target qubit" and
"the control qubit". This can only be done once the qubits-to-be-swapped are
known.

The main user of this protocol is `GateOperation`, which decomposes itself
by delegating to its gate. The qubits argument is needed because gates are
specified independently of target qubits and so must be told the relevant
qubits. A `GateOperation` implements `SupportsDecompose` as long as its gate
implements `SupportsDecomposeWithQubits`.

## `decompose`

```python
def decompose(val: Any, *, intercepting_decomposer: OpDecomposer | None=None, fallback_decomposer: OpDecomposer | None=None, keep: Callable[[cirq.Operation], bool] | None=None, on_stuck_raise: None | Exception | Callable[[cirq.Operation], Exception | None]=_value_error_describing_bad_operation, preserve_structure: bool=False, context: DecompositionContext | None=None) -> list[cirq.Operation]
```

Recursively decomposes a value into `cirq.Operation`s meeting a criteria.

Args:
    val: The value to decompose into operations.
    intercepting_decomposer: An optional method that is called before the
        default decomposer (the value's `_decompose_` method). If
        `intercepting_decomposer` is specified and returns a result that
        isn't `NotImplemented` or `None`, that result is used. Otherwise the
        decomposition falls back to the default decomposer.

        Note that `val` will be passed into `intercepting_decomposer`, even
        if `val` isn't a `cirq.Operation`.
    fallback_decomposer: An optional decomposition that used after the
        `intercepting_decomposer` and the default decomposer (the value's
        `_decompose_` method) both fail.
    keep: A predicate that determines if the initial operation or
        intermediate decomposed operations should be kept or else need to be
        decomposed further. If `keep` isn't specified, it defaults to "value
        can't be decomposed anymore".
    on_stuck_raise: If there is an operation that can't be decomposed and
        also can't be kept, `on_stuck_raise` is used to determine what error
        to raise. `on_stuck_raise` can either directly be an `Exception`, or
        a method that takes the problematic operation and returns an
        `Exception`. If `on_stuck_raise` is set to `None` or a method that
        returns `None`, non-decomposable operations are simply silently
        kept. `on_stuck_raise` defaults to a `ValueError` describing the
        unwanted non-decomposable operation.
    preserve_structure: Prevents subcircuits (i.e. `CircuitOperation`s)
        from being decomposed, but decomposes their contents. If this is
        True, `intercepting_decomposer` cannot be specified.
    context: Decomposition context specifying common configurable options for
        controlling the behavior of decompose.

Returns:
    A list of operations that the given value was decomposed into. If
    `on_stuck_raise` isn't set to None, all operations in the list will
    satisfy the predicate specified by `keep`.

Raises:
    TypeError:
        `val` isn't a `cirq.Operation` and can't be decomposed even once.
        (So it's not possible to return a list of operations.)

    ValueError:
        Default type of error raised if there's an non-decomposable
        operation that doesn't satisfy the given `keep` predicate.

    TError:
        Custom type of error raised if there's an non-decomposable operation
        that doesn't satisfy the given `keep` predicate.

## `decompose_once`

```python
def decompose_once(val: Any, default=RaiseTypeErrorIfNotProvided, *args, flatten: bool=True, context: DecompositionContext | None=None, **kwargs)
```

Decomposes a value into operations, if possible.

This method decomposes the value exactly once, instead of decomposing it
and then continuing to decomposing the decomposed operations recursively
until some criteria is met (which is what `cirq.decompose` does).

Args:
    val: The value to call `_decompose_` on, if possible.
    default: A default result to use if the value doesn't have a
        `_decompose_` method or that method returns `NotImplemented` or
        `None`. If not specified, non-decomposable values cause a
        `TypeError`.
    *args: Positional arguments to forward into the `_decompose_` method of
        `val`.  For example, this is used to tell gates what qubits they are
        being applied to.
    flatten: If True, the returned OP-TREE will be flattened to a list of operations.
    context: Decomposition context specifying common configurable options for
        controlling the behavior of decompose.
    **kwargs: Keyword arguments to forward into the `_decompose_` method of
        `val`.

Returns:
    The result of `val._decompose_(*args, **kwargs)`, if `val` has a
    `_decompose_` method and it didn't return `NotImplemented` or `None`.
    Otherwise `default` is returned, if it was specified. Otherwise an error
    is raised.

Raises:
    TypeError: `val` didn't have a `_decompose_` method (or that method returned
        `NotImplemented` or `None`) and `default` wasn't set.

## `decompose_once_with_qubits`

```python
def decompose_once_with_qubits(val: Any, qubits: Iterable[cirq.Qid], default=RaiseTypeErrorIfNotProvided, flatten: bool=True, context: DecompositionContext | None=None)
```

Decomposes a value into operations on the given qubits.

This method is used when decomposing gates, which don't know which qubits
they are being applied to unless told. It decomposes the gate exactly once,
instead of decomposing it and then continuing to decomposing the decomposed
operations recursively until some criteria is met.

Args:
    val: The value to call `._decompose_(qubits)` on, if possible.
    qubits: The value to pass into the named `qubits` parameter of
        `val._decompose_`.
    default: A default result to use if the value doesn't have a
        `_decompose_` method or that method returns `NotImplemented` or
        `None`. If not specified, non-decomposable values cause a
        `TypeError`.
    flatten: If True, the returned OP-TREE will be flattened to a list of operations.
    context: Decomposition context specifying common configurable options for
        controlling the behavior of decompose.

Returns:
    The result of `val._decompose_(qubits)`, if `val` has a
    `_decompose_` method and it didn't return `NotImplemented` or `None`.
    Otherwise `default` is returned, if it was specified. Otherwise an error
    is raised.

TypeError:
    `val` didn't have a `_decompose_` method (or that method returned
    `NotImplemented` or `None`) and `default` wasn't set.
