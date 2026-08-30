---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/containers/primitive_result.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/containers/primitive_result.py
license: Apache-2.0
---

## Module `qiskit/primitives/containers/primitive_result.py`

PrimitiveResult

## `PrimitiveResult`

```python
class PrimitiveResult(Generic[T])
```

A container for multiple pub results and global metadata.

This is the return value from any V2 primitive's ``run().result()``.  This object corresponds to
the *entire* execution, not any single pub; it does not contain any actual data, but may contain
freeform :attr:`metadata` returned by the primitive implementer about the entire submission (as
opposed to :attr:`.PubResult.metadata`, which is metadata about a single pub).

You access the actual data of each individual pub either by iterating through this object (``for
pub_result in primitive_result: ...``), or by direct list-like index access ``pub_result =
primitive_result[0]``.  The type of each individual pub result is :class:`.PubResult`, or
potentially a primitive- and implementation-specific subclass of that.

Most likely, if you submitted a single pub to a primitive like::

    primitive_result = primitive.run([(qc,)]).result()

then the data you care about is in ``primitive_result[0].data``, which is a :class:`.DataBin`.
The object ``primitive_result[0]`` is a :class:`.PubResult`.

### `__init__`

```python
def __init__(self, pub_results: Iterable[T], metadata: dict[str, Any] | None=None)
```

Args:
    pub_results: Pub results.
    metadata: Metadata that is common to all pub results; metadata specific to particular
        pubs should be placed in their metadata fields. Keys are expected to be strings.

### `metadata`

```python
def metadata(self) -> dict[str, Any]
```

The metadata of this primitive result.
