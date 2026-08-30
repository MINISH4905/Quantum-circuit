---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/interop/quirk/url_to_circuit.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/interop/quirk/url_to_circuit.py
license: Apache-2.0
---

## `quirk_url_to_circuit`

```python
def quirk_url_to_circuit(quirk_url: str, *, qubits: Sequence[cirq.Qid] | None=None, extra_cell_makers: Mapping[str, cirq.Gate] | Iterable[cirq.interop.quirk.cells.CellMaker]=(), max_operation_count: int=10 ** 6) -> cirq.Circuit
```

Parses a Cirq circuit out of a Quirk URL.

Args:
    quirk_url: The URL of a bookmarked Quirk circuit. It is not required
        that the domain be "algassert.com/quirk". The only important part of
        the URL is the fragment (the part after the #).
    qubits: Qubits to use in the circuit. The length of the list must be
        at least the number of qubits in the Quirk circuit (including unused
        qubits). The maximum number of qubits in a Quirk circuit is 16.
        This argument defaults to `cirq.LineQubit.range(16)` when not
        specified.
    extra_cell_makers: Non-standard Quirk cells to accept. This can be
        used to parse URLs that come from a modified version of Quirk that
        includes gates that Quirk doesn't define. This can be specified
        as either a list of `cirq.interop.quirk.cells.CellMaker` instances,
        or for more simple cases as a dictionary from a Quirk id string
        to a cirq Gate.
    max_operation_count: If the number of operations in the circuit would
        exceed this value, the method raises a `ValueError` instead of
        attempting to construct the circuit. This is important to specify
        for servers parsing unknown input, because Quirk's format allows for
        a billion laughs attack in the form of nested custom gates.

Examples:

>>> print(cirq.quirk_url_to_circuit(
...     'http://algassert.com/quirk#circuit={"cols":[["H"],["•","X"]]}'
... ))
0: ───H───@───
          │
1: ───────X───

>>> print(cirq.quirk_url_to_circuit(
...     'http://algassert.com/quirk#circuit={"cols":[["H"],["•","X"]]}',
...     qubits=[cirq.NamedQubit('Alice'), cirq.NamedQubit('Bob')]
... ))
Alice: ───H───@───
              │
Bob: ─────────X───

>>> print(cirq.quirk_url_to_circuit(
...     'http://algassert.com/quirk#circuit={"cols":[["iswap"]]}',
...     extra_cell_makers={'iswap': cirq.ISWAP}))
0: ───iSwap───
      │
1: ───iSwap───

>>> print(cirq.quirk_url_to_circuit(
...     'http://algassert.com/quirk#circuit={"cols":[["iswap"]]}',
...     extra_cell_makers=[
...         cirq.interop.quirk.cells.CellMaker(
...             identifier='iswap',
...             size=2,
...             maker=lambda args: cirq.ISWAP(*args.qubits))
...     ]))
0: ───iSwap───
      │
1: ───iSwap───

Returns:
    The parsed circuit.

Raises:
    ValueError: Invalid circuit URL, or circuit would be larger than
        `max_operations_count`.

## `quirk_json_to_circuit`

```python
def quirk_json_to_circuit(data: dict, *, qubits: Sequence[cirq.Qid] | None=None, extra_cell_makers: Mapping[str, cirq.Gate] | Iterable[cirq.interop.quirk.cells.CellMaker]=(), quirk_url: str | None=None, max_operation_count: int=10 ** 6) -> cirq.Circuit
```

Constructs a Cirq circuit from Quirk's JSON format.

Args:
    data: Data parsed from quirk's JSON representation.
    qubits: Qubits to use in the circuit. See quirk_url_to_circuit.
    extra_cell_makers: Non-standard Quirk cells to accept. See
        quirk_url_to_circuit.
    quirk_url: If given, the original URL from which the JSON was parsed, as
        described in quirk_url_to_circuit.
    max_operation_count: If the number of operations in the circuit would
        exceed this value, the method raises a `ValueError` instead of
        attempting to construct the circuit. This is important to specify
        for servers parsing unknown input, because Quirk's format allows for
        a billion laughs attack in the form of nested custom gates.

Examples:

>>> print(cirq.quirk_json_to_circuit(
...     {"cols":[["H"], ["•", "X"]]}
... ))
0: ───H───@───
          │
1: ───────X───

Returns:
    The parsed circuit.

Raises:
    ValueError: Invalid circuit URL, or circuit would be larger than
        `max_operations_count`.
