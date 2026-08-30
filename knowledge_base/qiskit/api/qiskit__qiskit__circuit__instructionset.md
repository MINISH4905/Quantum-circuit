---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/instructionset.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/instructionset.py
license: Apache-2.0
---

## Module `qiskit/circuit/instructionset.py`

Instruction collection.

## `InstructionSet`

```python
class InstructionSet
```

Instruction collection, and their contexts.

### `__init__`

```python
def __init__(self, *, resource_requester: Callable[..., ClassicalRegister | Clbit] | None=None)
```

New collection of instructions.

The context (``qargs`` and ``cargs`` that each instruction is attached to) is also stored
separately for each instruction.

Args:
    resource_requester: A callable that takes in the classical resource used in the
        condition, verifies that it is present in the attached circuit, resolves any indices
        into concrete :obj:`.Clbit` instances, and returns the concrete resource.  If this
        is not given, specifying a condition with an index is forbidden, and all concrete
        :obj:`.Clbit` and :obj:`.ClassicalRegister` resources will be assumed to be valid.

        .. note::

            The callback ``resource_requester`` assumes that a call implies that the
            resource will now be used.  It may throw an error if the resource is not valid
            for usage.

### `__len__`

```python
def __len__(self)
```

Return number of instructions in set

### `__getitem__`

```python
def __getitem__(self, i)
```

Return instruction at index

### `add`

```python
def add(self, instruction, qargs=None, cargs=None)
```

Add an instruction and its context (where it is attached).

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Invert all instructions.

.. note::
    It is preferable to take the inverse *before* appending the gate(s) to the circuit.

### `instructions`

```python
def instructions(self)
```

Legacy getter for the instruction components of an instruction set.  This does not
support mutation.

### `qargs`

```python
def qargs(self)
```

Legacy getter for the qargs components of an instruction set.  This does not support
mutation.

### `cargs`

```python
def cargs(self)
```

Legacy getter for the cargs components of an instruction set.  This does not support
mutation.
