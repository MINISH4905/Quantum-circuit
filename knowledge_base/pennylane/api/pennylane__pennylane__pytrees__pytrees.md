---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/pytrees/pytrees.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/pytrees/pytrees.py
license: Apache-2.0
---

## Module `pennylane/pytrees/pytrees.py`

An internal module for working with pytrees.

## `flatten_list`

```python
def flatten_list(obj: list)
```

Flatten a list.

## `flatten_tuple`

```python
def flatten_tuple(obj: tuple)
```

Flatten a tuple.

## `flatten_dict`

```python
def flatten_dict(obj: dict)
```

Flatten a dictionary.

## `unflatten_list`

```python
def unflatten_list(data, _) -> list
```

Unflatten a list.

## `unflatten_tuple`

```python
def unflatten_tuple(data, _) -> tuple
```

Unflatten a tuple.

## `unflatten_dict`

```python
def unflatten_dict(data, metadata) -> dict
```

Unflatten a dictionary.

## `register_pytree`

```python
def register_pytree(pytree_type: type, flatten_fn: FlattenFn, unflatten_fn: UnflattenFn, *, namespace: str='qp')
```

Register a type with all available pytree backends.

Current backends are jax and pennylane.

Args:
    pytree_type (type): the type to register, such as ``qp.RX``
    flatten_fn (Callable): a function that splits an object into trainable leaves and hashable metadata.
    unflatten_fn (Callable): a function that reconstructs an object from its leaves and metadata.
    namespace (str): A prefix for the name under which this type will be registered.

Returns:
    None

Side Effects:
    ``pytree`` type becomes registered with available backends.

.. seealso:: :func:`~.flatten`, :func:`~.unflatten`.

## `is_pytree`

```python
def is_pytree(type_: type[Any]) -> bool
```

Returns True if ``type_`` is a registered Pytree.

## `get_typename`

```python
def get_typename(pytree_type: type[Any]) -> str
```

Return the typename under which ``pytree_type``
was registered.

Raises:
    TypeError: If ``pytree_type`` is not a Pytree.

>>> get_typename(list)
'builtins.list'
>>> import pennylane
>>> get_typename(pennylane.PauliX)
'qp.PauliX'

## `get_typename_type`

```python
def get_typename_type(typename: str) -> type[Any]
```

Return the Pytree type with given ``typename``.

Raises:
    ValueError: If ``typename`` is not the name of a
        pytree type.

>>> import pennylane
>>> get_typename_type("builtins.list")
<class 'list'>
>>> get_typename_type("qp.PauliX")
<class 'pennylane.ops.qubit.non_parametric_ops.PauliX'>

## `PyTreeStructure`

```python
class PyTreeStructure
```

A pytree data structure, holding the type, metadata, and child pytree structures.

>>> op = qp.adjoint(qp.RX(0.1, 0))
>>> data, structure = qp.pytrees.flatten(op)
>>> structure
PyTreeStructure(AdjointOperation, (), (PyTreeStructure(RX, (Wires([0]), ()), (PyTreeStructure(),)),))

A leaf is defined as just a ``PyTreeStructure`` with ``type_=None``.

### `is_leaf`

```python
def is_leaf(self) -> bool
```

Whether or not the structure is a leaf.

## `flatten`

```python
def flatten(obj: Any, is_leaf: Callable[[Any], bool] | None=None) -> tuple[list[Any], PyTreeStructure]
```

Flattens a pytree into leaves and a structure.

Args:
    obj (Any): any object.
    is_leaf (Callable[[Any], bool] | None = None): an optionally specified
        function that will be called at each flattening step. It should return
        a boolean, with ``True`` stopping the traversal and the whole subtree being
        treated as a leaf, and ``False`` indicating the flattening should traverse
        the current object.

Returns:
    List[Any], Union[Structure, Leaf]: a list of leaves and a structure representing the object

See also :func:`~.unflatten`.

**Example**

>>> op = qp.adjoint(qp.Rot(1.2, 2.3, 3.4, wires=0))
>>> data, structure = flatten(op)
>>> data
[1.2, 2.3, 3.4]

>>> structure
PyTreeStructure(AdjointOperation, (), (PyTreeStructure(Rot, (Wires([0]), ()), (PyTreeStructure(), PyTreeStructure(), PyTreeStructure())),))

## `unflatten`

```python
def unflatten(data: list[Any], structure: PyTreeStructure) -> Any
```

Bind data to a structure to reconstruct a pytree object.

Args:
    data (Iterable): iterable of numbers and numeric arrays
    structure (Structure, Leaf): The pytree structure object

Returns:
    A repacked pytree.

.. seealso:: :func:`~.flatten`

**Example**

>>> op = qp.adjoint(qp.Rot(1.2, 2.3, 3.4, wires=0))
>>> data, structure = flatten(op)
>>> unflatten([-2, -3, -4], structure)
Adjoint(Rot(-2, -3, -4, wires=[0]))
