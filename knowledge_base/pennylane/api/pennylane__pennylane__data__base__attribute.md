---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/base/attribute.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/base/attribute.py
license: Apache-2.0
---

## Module `pennylane/data/base/attribute.py`

Contains the base class for Dataset attribute types, and a class for
attribute metadata.

## `AttributeInfo`

```python
class AttributeInfo(MutableMapping)
```

Contains metadata that may be assigned to a dataset
attribute. Is stored in the HDF5 object's ``attrs`` dict.

Attributes:
    **kwargs: Extra metadata to include. Must be a string, number
        or numpy array

### `save`

```python
def save(self, info: 'AttributeInfo') -> None
```

Inserts the values set in this instance into ``info``.

### `load`

```python
def load(self, info: 'AttributeInfo')
```

Inserts the values set in ``info`` into this instance.

### `py_type`

```python
def py_type(self) -> str | None
```

String representation of this attribute's python type.

### `doc`

```python
def doc(self) -> str | None
```

Documentation for this attribute.

### `bind_key`

```python
def bind_key(cls, __name: str) -> str
```

Returns ``__name`` dot-prefixed with ``attrs_namespace``.

## `DatasetAttribute`

```python
class DatasetAttribute(ABC, Generic[HDF5, ValueType, InitValueType])
```

The DatasetAttribute class provides an interface for converting Python objects to and from a HDF5
array or Group. It uses the registry pattern to maintain a mapping of type_id to
DatasetAttribute, and Python types to compatible AttributeTypes.

### `hdf5_to_value`

```python
def hdf5_to_value(self, bind: HDF5) -> ValueType
```

Parses bind into Python object.

### `value_to_hdf5`

```python
def value_to_hdf5(self, bind_parent: HDF5Group, key: str, value: InitValueType) -> HDF5
```

Converts value into a HDF5 Array or Group under bind_parent[key].

### `__init__`

```python
def __init__(self, value: InitValueType | Literal[UNSET]=UNSET, info: AttributeInfo | None=None, *, parent_and_key: tuple[HDF5Group, str] | None=None)
```

Initialize a new dataset attribute from ``value``.

Args:
    value: Value that will be stored in dataset attribute.
    info: Metadata to attach to attribute.
    parent_and_key: A 2-tuple specifying the HDF5 group that will contain
        this attribute, and its key. If None, attribute will be stored in-memory.

### `__init__`

```python
def __init__(self, *, bind: HDF5)
```

Load previously persisted dataset attribute from ``bind``.

If ``bind`` contains an attribute of a different type, or does not
contain a dataset attribute, a ``TypeError` will be raised.

Args:
    bind: HDF5 object from which existing attribute will be loaded.

### `__init__`

```python
def __init__(self, value: InitValueType | Literal[UNSET]=UNSET, info: AttributeInfo | None=None, *, bind: HDF5 | None=None, parent_and_key: tuple[HDF5Group, str] | None=None) -> None
```

Initialize a new dataset attribute, or load from an existing
hdf5 object.

This constructor can be called two ways: value initialization
or bind initialization.

Value initialization creates the attribute with specified ``value`` in
a new HDF5 object, with optional ``info`` attached. The attribute can
be created in an existing HDF5 group by passing the ``parent_and_key``
argument.

Bind initialization loads an attribute that was previously persisted
in HDF5 object ``bind``.

Note that if ``bind`` is provided, all other arguments will be ignored.

Args:
    value: Value to initialize attribute to
    info: Metadata to attach to attribute
    bind: HDF5 object from which existing attribute will be loaded
    parent_and_key: A 2-tuple specifying the HDF5 group that will contain
        this attribute, and its key.

### `info`

```python
def info(self) -> AttributeInfo
```

Returns the ``AttributeInfo`` for this attribute.

### `bind`

```python
def bind(self) -> HDF5
```

Returns the HDF5 object that contains this attribute's
data.

### `default_value`

```python
def default_value(cls) -> InitValueType | Literal[UNSET]
```

Returns a valid default value for this type, or ``UNSET`` if this type
must be initialized with a value.

### `py_type`

```python
def py_type(cls, value_type: type[InitValueType]) -> str
```

Determines the ``py_type`` of an attribute during value initialization,
if it was not provided in the ``info`` argument. This method returns
``f"{value_type.__module__}.{value_type.__name__}``.

### `consumes_types`

```python
def consumes_types(cls) -> Iterable[type]
```

Returns an iterable of types for which this should be the default
codec. If a value of one of these types is assigned to a Dataset
without specifying a `type_id`, this type will be used.

### `__post_init__`

```python
def __post_init__(self, value: InitValueType) -> None
```

Called after __init__(), only during value initialization. Can be implemented
in subclasses that require additional initialization.

### `get_value`

```python
def get_value(self) -> ValueType
```

Deserializes the mapped value from ``bind``.

### `copy_value`

```python
def copy_value(self) -> ValueType
```

Deserializes the mapped value from ``bind``, and also perform a 'deep-copy'
of any nested values contained in ``bind``.

## `attribute`

```python
def attribute(val: T, doc: str | None=None, **kwargs: Any) -> DatasetAttribute[HDF5Any, T, Any]
```

Creates a dataset attribute that contains both a value and associated metadata.

Args:
    val (any): the dataset attribute value
    doc (str): the docstring that describes the attribute
    **kwargs: Additional keyword arguments may be passed, which represents metadata
        which describes the attribute.

Returns:
    DatasetAttribute: an attribute object

.. seealso:: :class:`~.Dataset`

**Example**

>>> hamiltonian = qp.Hamiltonian([1., 1.], [qp.Z(0), qp.Z(1)])
>>> eigvals, eigvecs = np.linalg.eigh(qp.matrix(hamiltonian))
>>> dataset = qp.data.Dataset(hamiltonian = qp.data.attribute(
...     hamiltonian,
...     doc="The hamiltonian of the system"))
>>> dataset.eigen = qp.data.attribute(
...     {"eigvals": eigvals, "eigvecs": eigvecs},
...     doc="Eigenvalues and eigenvectors of the hamiltonian")

This metadata can then be accessed using the :meth:`~.Dataset.attr_info` mapping:

>>> dataset.attr_info["eigen"]["doc"]
'Eigenvalues and eigenvectors of the hamiltonian'

## `get_attribute_type`

```python
def get_attribute_type(h5_obj: HDF5) -> type[DatasetAttribute[HDF5, Any, Any]]
```

Returns the ``DatasetAttribute`` of the dataset attribute contained
in ``h5_obj``.

## `match_obj_type`

```python
def match_obj_type(type_or_obj: ValueType | type[ValueType]) -> type[DatasetAttribute[HDF5Any, ValueType, ValueType]]
```

Returns an ``DatasetAttribute`` that can accept an object of type ``type_or_obj``
as a value.

Args:
    type_or_obj: A type or an object

Returns:
    DatasetAttribute that can accept ``type_or_obj`` (or an object of that
        type) as a value.

Raises:
    TypeError, if no DatasetAttribute can accept an object of that type
