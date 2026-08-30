---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/_connected_component.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/_connected_component.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/_connected_component.py`

Defines a connected component of operations, to be used in merge transformers.

## `Component`

```python
class Component
```

Internal representation for a connected component of operations.

### `__init__`

```python
def __init__(self, op: cirq.Operation, moment_id: int, is_mergeable=True)
```

Initializes a singleton component.

## `ComponentWithOps`

```python
class ComponentWithOps(Component)
```

Component that keeps track of operations.

## `ComponentWithCircuitOp`

```python
class ComponentWithCircuitOp(Component)
```

Component that keeps track of operations as a CircuitOperation.

## `ComponentSet`

```python
class ComponentSet
```

Represents a set of mergeable components of operations.

### `new_component`

```python
def new_component(self, op: cirq.Operation, moment_id: int, is_mergeable=True) -> Component
```

Creates a new component and adds it to the set.

### `components`

```python
def components(self) -> list[Component]
```

Returns the initial components in creation order.

### `find`

```python
def find(self, x: Component) -> Component
```

Finds the representative for a merged component.

### `merge`

```python
def merge(self, x: Component, y: Component, merge_left=True) -> Component | None
```

Attempts to merge two components.

If merge_left is True, y is merged into x, and the representative will keep
y's moment. If merge_left is False, x is merged into y, and the representative
will keep y's moment.

Args:
    x: First component to merge.
    y: Second component to merge.
    merge_left: True to keep x's moment for the merged component, False to
        keep y's moment for the merged component.

Returns:
    None, if the components can't be merged.
    Otherwise the new component representative.

## `ComponentWithOpsSet`

```python
class ComponentWithOpsSet(ComponentSet)
```

Represents a set of mergeable components, where each component tracks operations.

### `merge`

```python
def merge(self, x: Component, y: Component, merge_left=True) -> Component | None
```

Attempts to merge two components.

Returns:
    None if can_merge is False or the merge doesn't succeed, otherwise the
        new representative. The representative will have ops = x.ops + y.ops.

## `ComponentWithCircuitOpSet`

```python
class ComponentWithCircuitOpSet(ComponentSet)
```

Represents a set of mergeable components, with operations as a CircuitOperation.

### `merge`

```python
def merge(self, x: Component, y: Component, merge_left=True) -> Component | None
```

Attempts to merge two components.

Returns:
    None if merge_func returns None or the merge doesn't succeed,
        otherwise the new representative.
