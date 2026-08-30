---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/containers/data_bin.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/containers/data_bin.py
license: Apache-2.0
---

## Module `qiskit/primitives/containers/data_bin.py`

Dataclass tools for data namespaces (bins)

## `DataBin`

```python
class DataBin(ShapedMixin)
```

The main data return from a single pub out of :class:`.PubResult`.

You access the data within this object either by attribute access (``data_bin.my_field``) or by
:class:`dict`-like string keys (``data_bin["my_field"]``).  This class behaves as a Python
immutable mapping, so you can (for example) query the available keys with :meth:`keys`, and
iterate through both keys and values with :meth:`items`.

This class will have different attributes and keys, depending on the primitive used and the
pub submitted.  These "special" attributes will have names that match the keys.  For example, if
you submitted a :class:`.SamplerV2` job, typically the attributes and keys are the names of the
:class:`.ClassicalRegister` objects that were in the circuit defining this pub.

All of the attributes and keys have the same shape associated with them, which is the
n-dimensional shape of the corresponding pub.  The attributes and keys will typically either be
:class:`.BitArray` or :class:`numpy.ndarray` instances, depending on the primitive used and the
input pub.

Users do not typically construct this class themselves.  Instead, you receive it as the
:attr:`.PubResult.data` field for a single pub's result out of a complete execution.

Examples:

.. plot::
   :include-source:
   :nofigs:

    import numpy as np
    from qiskit.primitives import DataBin, BitArray

    data = DataBin(
        alpha=BitArray.from_samples(["0010"]),
        beta=np.array([1.2])
    )

    print("alpha data:", data.alpha)
    print("beta data:", data.beta)

.. code-block::

    alpha data: BitArray(<shape=(), num_shots=1, num_bits=2>)
    beta data: [1.2]

### `__init__`

```python
def __init__(self, *, shape: ShapeInput=(), **data)
```

Args:
    data: Name/value data to place in the data bin.
    shape: The leading shape common to all entries in the data bin. This defaults to
        the trivial leading shape of ``()`` that is compatible with all objects.

Raises:
    ValueError: If a name overlaps with a method name on this class.
    ValueError: If some value is inconsistent with the provided shape.

### `keys`

```python
def keys(self) -> KeysView[str]
```

Return a view of field names.

### `values`

```python
def values(self) -> ValuesView[Any]
```

Return a view of values.

### `items`

```python
def items(self) -> ItemsView[str, Any]
```

Return a view of field names and values

## `make_data_bin`

```python
def make_data_bin(fields: Iterable[tuple[str, type]], shape: tuple[int, ...] | None=None) -> type[DataBin]
```

Return the :class:`~DataBin` type.

.. note::
    This class used to return a subclass of :class:`~DataBin`. However, that caused confusion
    and didn't have a useful purpose. Several internal projects made use of this internal
    function prior to qiskit 1.1. This function will be removed once these internal projects
    have made the appropriate changes.

Args:
    fields: Tuples ``(name, type)`` specifying the attributes of the returned class.
    shape: The intended shape of every attribute of this class.

Returns:
    The :class:`DataBin` type.
