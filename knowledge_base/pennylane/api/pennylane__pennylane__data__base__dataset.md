---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/base/dataset.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/base/dataset.py
license: Apache-2.0
---

## Module `pennylane/data/base/dataset.py`

Contains the :class:`~pennylane.data.Dataset` base class, and `qp.data.Attribute` class
for declaratively defining dataset classes.

## `Field`

```python
class Field(Generic[T])
```

The Field class is used to declaratively define the
attributes of a Dataset subclass, in a similar way to
dataclasses. This class should not be used directly,
use the ``field()`` function instead.

Attributes:
    attribute_type: The ``DatasetAttribute`` class for this attribute
    info: Attribute info

## `field`

```python
def field(attribute_type: type[DatasetAttribute[HDF5Any, T, Any]] | Literal[UNSET]=UNSET, doc: str | None=None, py_type: Any | None=None, **kwargs) -> Any
```

Used to define fields on a declarative Dataset.

Args:
    attribute_type: ``DatasetAttribute`` class for this attribute. If not provided,
        type may be derived from the type annotation on the class.
    doc: Documentation for the attribute
    py_type: Type annotation or string describing this object's type. If not
        provided, the annotation on the class will be used
    kwargs: Extra arguments to ``AttributeInfo``

Returns:
    Field:

.. seealso:: :class:`~.Dataset`, :func:`~.data.attribute`

**Example**

The datasets declarative API allows us to create subclasses
of :class:`Dataset` that define the required attributes, or 'fields', and
their associated type and documentation:

.. code-block:: python

    class QuantumOscillator(qp.data.Dataset, data_name="quantum_oscillator", identifiers=["mass", "force_constant"]):
        """Dataset describing a quantum oscillator."""

        mass: float = qp.data.field(doc = "The mass of the particle")
        force_constant: float = qp.data.field(doc = "The force constant of the oscillator")
        hamiltonian: qp.Hamiltonian = qp.data.field(doc = "The hamiltonian of the particle")
        energy_levels: np.ndarray = qp.data.field(doc = "The first 1000 energy levels of the system")

The ``data_name`` keyword argument specifies a category or descriptive name for the dataset type, and the ``identifiers``
keyword argument specifies fields that function as parameters, i.e., they determine the behaviour
of the system.

When a ``QuantumOscillator`` dataset is created, its attributes will have the documentation from the field
definition:

>>> dataset = QuantumOscillator(
...     mass=1,
...     force_constant=0.5,
...     hamiltonian=qp.X(0),
...     energy_levels=np.array([0.1, 0.2])
... )
>>> dataset.attr_info["mass"]["doc"]
'The mass of the particle'

## `Dataset`

```python
class Dataset(MapperMixin, _DatasetTransform)
```

Base class for Datasets.

### `__init__`

```python
def __init__(self, bind: HDF5Group | None=None, *, data_name: str | None=None, identifiers: tuple[str, ...] | None=None, **attrs: Any)
```

Load a dataset from a HDF5 Group or initialize a new Dataset.

Args:
    bind: The HDF5 group that contains this dataset. If None, a new
        group will be created in memory. Any attributes that already exist
        in ``bind`` will be loaded into this dataset.
    data_name: String describing the type of data this datasets contains, e.g
        'qchem' for quantum chemistry. Defaults to the data name defined by
        the class, this is 'generic' for base datasets.
    identifiers: Tuple of names of attributes of this dataset that will serve
        as its parameters
    **attrs: Attributes to add to this dataset.

### `open`

```python
def open(cls, filepath: str | Path, mode: Literal['w', 'w-', 'a', 'r', 'copy']='r') -> 'Dataset'
```

Open existing dataset or create a new one at ``filepath``.

Args:
    filepath: Path to dataset file
    mode: File handling mode. Possible values are "w-" (create, fail if file
        exists), "w" (create, overwrite existing), "a" (append existing,
        create if doesn't exist), "r" (read existing, must exist), and "copy",
        which loads the dataset into memory and detaches it from the underlying
        file. Default is "r".
Returns:
    Dataset object from file

### `close`

```python
def close(self) -> None
```

Close the underlying dataset file. The dataset will
become inaccessible.

### `data_name`

```python
def data_name(self) -> str
```

Returns the data name (category) of this dataset.

### `identifiers`

```python
def identifiers(self) -> Mapping[str, str]
```

Returns this dataset's parameters.

### `info`

```python
def info(self) -> AttributeInfo
```

Return metadata associated with this dataset.

### `bind`

```python
def bind(self) -> HDF5Group
```

Return the HDF5 group that contains this dataset.

### `attrs`

```python
def attrs(self) -> Mapping[str, DatasetAttribute]
```

Returns all attributes of this Dataset.

### `attr_info`

```python
def attr_info(self) -> Mapping[str, AttributeInfo]
```

Returns a mapping of the ``AttributeInfo`` for each of this dataset's attributes.

### `list_attributes`

```python
def list_attributes(self) -> list[str]
```

Returns a list of this dataset's attributes.

### `read`

```python
def read(self, source: str | Union[Path, 'Dataset'], attributes: Iterable[str] | None=None, *, overwrite: bool=False) -> None
```

Load dataset from HDF5 file at filepath.

Args:
    source: Dataset, or path to HDF5 file containing dataset, from which
        to read attributes
    attributes: Optional list of attributes to copy. If None, all attributes
        will be copied.
    overwrite: Whether to overwrite attributes that already exist in this
        dataset.

### `write`

```python
def write(self, dest: str | Union[Path, 'Dataset'], mode: Literal['w', 'w-', 'a']='a', attributes: Iterable[str] | None=None, *, overwrite: bool=False) -> None
```

Write dataset to HDF5 file at filepath.

Args:
    dest: HDF5 file, or path to HDF5 file containing dataset, to write
        attributes to
    mode: File handling mode, if ``source`` is a file system path. Possible
        values are "w-" (create, fail if file exists), "w" (create, overwrite existing),
        and "a" (append existing, create if doesn't exist). Default is "w-".
    attributes: Optional list of attributes to copy. If None, all attributes
        will be copied. Note that identifiers will always be copied.
    overwrite: Whether to overwrite attributes that already exist in this
        dataset.

### `__init_subclass__`

```python
def __init_subclass__(cls, *, data_name: str | None=None, identifiers: tuple[str, ...] | None=None) -> None
```

Initializes the ``fields`` dict of a Dataset subclass using
the declared ``Attributes`` and their type annotations.
