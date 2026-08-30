---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/_classical_resource_map.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/_classical_resource_map.py
license: Apache-2.0
---

## Module `qiskit/circuit/_classical_resource_map.py`

Shared helper utility for mapping classical resources from one circuit or DAG to another.

## `VariableMapper`

```python
class VariableMapper(expr.ExprVisitor[expr.Expr])
```

Stateful helper class that manages the mapping of variables in conditions and expressions.

This is designed to be used by both :class:`.QuantumCircuit` and :class:`.DAGCircuit` when
managing operations that need to map classical resources from one circuit to another.

The general usage is to initialise this at the start of a many-block mapping operation, then
call its :meth:`map_condition`, :meth:`map_target` or :meth:`map_expr` methods as appropriate,
which will return the new object that should be used.

If an ``add_register`` callable is given to the initializer, the mapper will use it to attempt
to add new aliasing registers to the outer circuit object, if there is not already a suitable
register for the mapping available in the circuit.  If this parameter is not given, a
``ValueError`` will be raised instead.  The given ``add_register`` callable may choose to raise
its own exception.

### `map_condition`

```python
def map_condition(self, condition, /, *, allow_reorder=False)
```

Map the given ``condition`` so that it only references variables in the destination
circuit (as given to this class on initialization).

If ``allow_reorder`` is ``True``, then when a legacy condition (the two-tuple form) is made
on a register that has a counterpart in the destination with all the same (mapped) bits but
in a different order, then that register will be used and the value suitably modified to
make the equality condition work.  This is maintaining legacy (tested) behavior of
:meth:`.DAGCircuit.compose`; nowhere else does this, and in general this would require *far*
more complex classical rewriting than Terra needs to worry about in the full expression era.

### `map_target`

```python
def map_target(self, target, /)
```

Map the real-time variables in a ``target`` of a :class:`.SwitchCaseOp` to the new
circuit, as defined in the ``circuit`` argument of the initializer of this class.

### `map_expr`

```python
def map_expr(self, node: expr.Expr, /) -> expr.Expr
```

Map the variables in an :class:`~.expr.Expr` node to the new circuit.
