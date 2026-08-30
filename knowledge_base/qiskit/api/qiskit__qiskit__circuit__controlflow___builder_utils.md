---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/controlflow/_builder_utils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/controlflow/_builder_utils.py
license: Apache-2.0
---

## Module `qiskit/circuit/controlflow/_builder_utils.py`

Private utility functions that are used by the builder interfaces.

## `validate_condition`

```python
def validate_condition(condition: _ConditionT) -> _ConditionT
```

Validate that a condition is in a valid format and return it, but raise if it is invalid.

Args:
    condition: the condition to be tested for validity.  Must be either the legacy 2-tuple
        format, or a :class:`~.expr.Expr` that has `Bool` type.

Raises:
    CircuitError: if the condition is not in a valid format.

Returns:
    The same condition as passed, if it was valid.

## `LegacyResources`

```python
class LegacyResources
```

A pair of the :class:`.Clbit` and :class:`.ClassicalRegister` resources used by some other
object (such as a legacy condition or :class:`.expr.Expr` node).

## `node_resources`

```python
def node_resources(node: expr.Expr) -> LegacyResources
```

Get the legacy classical resources (:class:`.Clbit` and :class:`.ClassicalRegister`)
referenced by an :class:`~.expr.Expr`.

## `condition_resources`

```python
def condition_resources(condition: tuple[ClassicalRegister, int] | tuple[Clbit, int] | expr.Expr) -> LegacyResources
```

Get the legacy classical resources (:class:`.Clbit` and :class:`.ClassicalRegister`)
referenced by a legacy condition or an :class:`~.expr.Expr`.

## `partition_registers`

```python
def partition_registers(registers: Iterable[Register]) -> tuple[set[QuantumRegister], set[ClassicalRegister]]
```

Partition a sequence of registers into its quantum and classical registers.

## `unify_circuit_resources`

```python
def unify_circuit_resources(circuits: Iterable[QuantumCircuit]) -> Iterable[QuantumCircuit]
```

Ensure that all the given ``circuits`` have all the same qubits, clbits and registers, and
that they are defined in the same order.  The order is important for binding when the bodies are
used in the 3-tuple :obj:`.Instruction` context.

This function will preferentially try to mutate its inputs if they share an ordering, but if
not, it will rebuild two new circuits.  This is to avoid coupling too tightly to the inner
class; there is no real support for deleting or re-ordering bits within a :obj:`.QuantumCircuit`
context, and we don't want to rely on the *current* behavior of the private APIs, since they
are very liable to change.  No matter the method used, circuits with unified bits and registers
are returned.
