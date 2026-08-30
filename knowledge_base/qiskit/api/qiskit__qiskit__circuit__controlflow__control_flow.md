---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/controlflow/control_flow.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/controlflow/control_flow.py
license: Apache-2.0
---

## Module `qiskit/circuit/controlflow/control_flow.py`

Container to encapsulate all control flow operations.

## `ControlFlowOp`

```python
class ControlFlowOp(Instruction, ABC)
```

Abstract class to encapsulate all control flow operations.

All subclasses of :class:`ControlFlowOp` have an internal attribute,
:attr:`~ControlFlowOp.blocks`, which exposes the inner subcircuits used in the different blocks
of the control flow.

### `blocks`

```python
def blocks(self) -> tuple[QuantumCircuit, ...]
```

Tuple of :class:`.QuantumCircuit`\ s which may be executed as part of the
execution of this :class:`ControlFlowOp`.

### `replace_blocks`

```python
def replace_blocks(self, blocks: typing.Iterable[QuantumCircuit]) -> ControlFlowOp
```

Return a new version of this control-flow operations with the :attr:`blocks` mapped to
the given new ones.

Typically this is used in a workflow such as::

    existing_op = ...

    def map_block(block: QuantumCircuit) -> QuantumCircuit:
        new_block = block.copy_empty_like()
        # ... do something to `new_block` ...
        return new_block

    new_op = existing_op.replace_blocks(
        map_block(block) for block in existing_op.blocks
    )

It is the caller's responsibility to ensure that the mapped blocks are defined over a
unified set of circuit resources, much like constructing a :class:`ControlFlowOp` using its
default constructor.

Args:
    blocks: the new subcircuit blocks to use.

Returns:
    New :class:`ControlFlowOp` with replaced blocks.

### `iter_captured_vars`

```python
def iter_captured_vars(self) -> typing.Iterable[expr.Var]
```

Get an iterator over the unique captured variables in all blocks of this construct.

### `iter_captured_stretches`

```python
def iter_captured_stretches(self) -> typing.Iterable[expr.Stretch]
```

Get an iterator over the unique captured stretch variables in all blocks of this
construct.
