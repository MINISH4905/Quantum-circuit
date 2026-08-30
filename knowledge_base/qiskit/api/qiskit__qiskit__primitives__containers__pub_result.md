---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/containers/pub_result.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/containers/pub_result.py
license: Apache-2.0
---

## Module `qiskit/primitives/containers/pub_result.py`

Base Pub result class

## `PubResult`

```python
class PubResult
```

The result object for a single pub (primitive unified bloc).

Each :class:`.PubResult` is a single element of a greater :class:`.PrimitiveResult`.  Within
this result, there is implementation-defined freeform :attr:`metadata`, and a :class:`.DataBin`
in the :attr:`data` field.

Most likely, you care about accessing the processed data of your execution.  This is in the
:attr:`data` attribute.  The :attr:`metadata` object may contain extra information about the
execution of this pub, including implementation-specific information, which should be documented
by your primitive provider (as opposed to :attr:`.PrimitiveResult.metadata`, which is metadata
about the entire submission).

You typically get instances of this class by iterating over or indexing into a
:class:`.PrimitiveResult`, which is what you get from ``MyPrimitive().run().result()``.

### `__init__`

```python
def __init__(self, data: DataBin, metadata: dict[str, Any] | None=None)
```

Initialize a pub result.

Args:
    data: Result data.
    metadata: Metadata specific to this pub. Keys are expected to be strings.

### `data`

```python
def data(self) -> DataBin
```

Result data for the pub.

### `metadata`

```python
def metadata(self) -> dict
```

Metadata for the pub.
