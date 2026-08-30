---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/controlflow/box.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/controlflow/box.py
license: Apache-2.0
---

## Module `qiskit/circuit/controlflow/box.py`

Simple box basic block.

## `BoxOp`

```python
class BoxOp(ControlFlowOp)
```

A scoped "box" of operations on a circuit that are treated atomically in the greater context.

A "box" is a control-flow construct that is entered unconditionally.  The contents of the box
behave somewhat as if the start and end of the box were barriers, except it is permissible to
commute operations "all the way" through the box.  The box is also an explicit scope for the
purposes of variables, stretches and compiler passes.

A box may be "annotated" with arbitrary user-defined custom :class:`.Annotation` objects.  In
cases where order is important, these should be interpreted by applying the first annotation in
the list first, then the second, and so on.  It is generally recommended that annotations should
not be order-dependent, wherever possible.

Typically you create this by using the builder-interface form of :meth:`.QuantumCircuit.box`.

### `__init__`

```python
def __init__(self, body: QuantumCircuit, duration: None=None, unit: typing.Literal['dt', 's', 'ms', 'us', 'ns', 'ps', 'expr'] | None=None, label: str | None=None, annotations: typing.Iterable[Annotation]=())
```

Default constructor of :class:`BoxOp`.

Args:
    body: the circuit to use as the body of the box.  This should explicitly close over any
        :class:`.expr.Var` variables that must be incident from the outer circuit.  The
        required number of qubits and clbits for the resulting instruction are inferred from
        the number in the circuit, even if they are idle.
    duration: an optional duration for the box as a whole.
    unit: the unit of the ``duration``.
    label: an optional string label for the instruction.
    annotations: any :class:`.Annotation`\ s to apply to the box.  In cases where order
        is important, annotations are to be interpreted in the same order they appear in
        the iterable.

### `body`

```python
def body(self)
```

The ``body`` :class:`.QuantumCircuit` of the operation.

This is the same object returned as the sole entry in :meth:`params` and :meth:`blocks`.

## `BoxContext`

```python
class BoxContext
```

Context-manager that powers :meth:`.QuantumCircuit.box`.

This is not part of the public interface, and should not be instantiated by users.

### `__init__`

```python
def __init__(self, circuit: QuantumCircuit, *, duration: None=None, unit: typing.Literal['dt', 's', 'ms', 'us', 'ns', 'ps']='dt', label: str | None=None, annotations: typing.Iterable[Annotation]=())
```

Args:
    circuit: the outermost scope of the circuit under construction.
    duration: the final duration of the box.
    unit: the unit of ``duration``.
    label: an optional label for the box.
    annotations: any :class:`.Annotation`\ s to apply to the box.  In cases where order
        is important, annotations are to be interpreted in the same order they appear in
        the iterable.
