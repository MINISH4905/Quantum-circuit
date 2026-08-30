---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/qasm.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/qasm.py
license: Apache-2.0
---

## `QasmArgs`

```python
class QasmArgs(string.Formatter)
```

Formatting Arguments for outputting QASM code.

### `__init__`

```python
def __init__(self, precision: int=10, version: str='2.0', qubit_id_map: Mapping[cirq.Qid, str] | None=None, meas_key_id_map: dict[str, str] | None=None, meas_key_bitcount: dict[str, int] | None=None) -> None
```

Inits QasmArgs.

Args:
    precision: The number of digits after the decimal to show for
        numbers in the qasm code.
    version: The QASM version to target. Objects may return different
        qasm depending on version.
    qubit_id_map: A dictionary mapping qubits to qreg QASM identifiers.
    meas_key_id_map: A dictionary mapping measurement keys to creg QASM
        identifiers.
    meas_key_bitcount: A dictionary with of bits for each measurement
        key.

### `format_field`

```python
def format_field(self, value: Any, spec: str) -> str
```

Method of string.Formatter that specifies the output of format().

## `SupportsQasm`

```python
class SupportsQasm(Protocol)
```

An object that can be turned into QASM code.

Returning `NotImplemented` or `None` means "don't know how to turn into
QASM". In that case fallbacks based on decomposition and known unitaries
will be used instead.

## `SupportsQasmWithArgs`

```python
class SupportsQasmWithArgs(Protocol)
```

An object that can be turned into QASM code.

Returning `NotImplemented` or `None` means "don't know how to turn into
QASM". In that case fallbacks based on decomposition and known unitaries
will be used instead.

## `SupportsQasmWithArgsAndQubits`

```python
class SupportsQasmWithArgsAndQubits(Protocol)
```

An object that can be turned into QASM code if it knows its qubits.

Returning `NotImplemented` or `None` means "don't know how to turn into
QASM". In that case fallbacks based on decomposition and known unitaries
will be used instead.

## `qasm`

```python
def qasm(val: Any, *, args: QasmArgs | None=None, qubits: Iterable[cirq.Qid] | None=None, default: TDefault=RaiseTypeErrorIfNotProvided) -> str | TDefault
```

Returns QASM code for the given value, if possible.

Different values require different sets of arguments. The general rule of
thumb is that circuits don't need any, operations need a `QasmArgs`, and
gates need both a `QasmArgs` and `qubits`.

Args:
    val: The value to turn into QASM code.
    args: A `QasmArgs` object to pass into the value's `_qasm_` method.
        This is for needed for objects that only have a local idea of what's
        going on, e.g. a `cirq.Operation` in a bigger `cirq.Circuit`
        involving qubits that the operation wouldn't otherwise know about.
    qubits: A list of qubits that the value is being applied to. This is
        needed for `cirq.Gate` values, which otherwise wouldn't know what
        qubits to talk about.  It should generally not be specified otherwise.
    default: A default result to use if the value doesn't have a
        `_qasm_` method or that method returns `NotImplemented` or `None`.
        If not specified, non-decomposable values cause a `TypeError`.

Returns:
    The result of `val._qasm_(...)`, if `val` has a `_qasm_`
    method and it didn't return `NotImplemented` or `None`. Otherwise
    `default` is returned, if it was specified. Otherwise an error is
    raised.

Raises:
    TypeError: `val` didn't have a `_qasm_` method (or that method returned
        `NotImplemented` or `None`) and `default` wasn't set.
