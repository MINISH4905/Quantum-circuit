---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/circuit_diagram_info_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/circuit_diagram_info_protocol.py
license: Apache-2.0
---

## `CircuitDiagramInfo`

```python
class CircuitDiagramInfo
```

Describes how to draw an operation in a circuit diagram.

### `__init__`

```python
def __init__(self, wire_symbols: Iterable[str], exponent: Any=1, connected: bool=True, exponent_qubit_index: int | None=None, auto_exponent_parens: bool=True) -> None
```

Inits CircuitDiagramInfo.

Args:
    wire_symbols: The symbols that should be shown on the qubits
        affected by this operation. Must match the number of qubits that
        the operation is applied to.
    exponent: An optional convenience value that will be appended onto
        an operation's final gate symbol with a caret in front
        (unless it's equal to 1). For example, the square root of X gate
        has a text diagram exponent of 0.5 and symbol of 'X' so it is
        drawn as 'X^0.5'.
    connected: Whether or not to draw a line connecting the qubits.
    exponent_qubit_index: The qubit to put the exponent on. (The k'th
        qubit is the k'th target of the gate.) Defaults to the bottom
        qubit in the diagram.
    auto_exponent_parens: When this is True, diagram making code will
        add parentheses around exponents whose contents could look
        ambiguous (e.g. if the exponent contains a dash character that
        could be mistaken for an identity wire). Defaults to True.

Raises:
    ValueError: If `wire_symbols` is a string, and not an iterable
        of strings.

## `CircuitDiagramInfoArgs`

```python
class CircuitDiagramInfoArgs
```

A request for information on drawing an operation in a circuit diagram.

Attributes:
    known_qubits: The qubits the gate is being applied to. None means this
        information is not known by the caller.
    known_qubit_count: The number of qubits the gate is being applied to
        None means this information is not known by the caller.
    use_unicode_characters: If true, the wire symbols are permitted to
        include unicode characters (as long as they work well in fixed
        width fonts). If false, use only ascii characters. ASCII is
        preferred in cases where UTF8 support is done poorly, or where
        the fixed-width font being used to show the diagrams does not
        properly handle unicode characters.
    precision: The number of digits after the decimal to show for numbers in
        the text diagram. None means use full precision.
    label_map: The map from label entities to diagram positions.
    include_tags: If ``True`` all tags from ``TaggedOperations`` will be
        printed.  If ``False`` no tags will be printed.  Alternatively a
        collection of tag classes can be provided.  In this case only tags
        whose type is contained in the collection will be shown.
    transpose: Whether the circuit is to be drawn with time from left to
        right (transpose is False), or from top to bottom.

### `format_radians`

```python
def format_radians(self, radians: sympy.Basic | int | float) -> str
```

Returns angle in radians as a human-readable string.

## `SupportsCircuitDiagramInfo`

```python
class SupportsCircuitDiagramInfo(Protocol)
```

A diagrammable operation on qubits.

## `circuit_diagram_info`

```python
def circuit_diagram_info(val: Any, args: CircuitDiagramInfoArgs | None=None, default=RaiseTypeErrorIfNotProvided)
```

Requests information on drawing an operation in a circuit diagram.

Calls _circuit_diagram_info_ on `val`. If `val` doesn't have
_circuit_diagram_info_, or it returns NotImplemented, that indicates that
diagram information is not available.

Args:
    val: The operation or gate that will need to be drawn.
    args: A CircuitDiagramInfoArgs describing the desired drawing style.
    default: A default result to return if the value doesn't have circuit
        diagram information. If not specified, a TypeError is raised
        instead.

Returns:
    If `val` has no _circuit_diagram_info_ method or it returns
    NotImplemented, then `default` is returned (or a TypeError is
    raised if no `default` is specified).

    Otherwise, the value returned by _circuit_diagram_info_ is returned.

Raises:
    TypeError:
        `val` doesn't have circuit diagram information and `default` was
        not specified.
