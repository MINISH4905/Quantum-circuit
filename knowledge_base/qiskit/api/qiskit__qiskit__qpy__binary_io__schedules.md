---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/qpy/binary_io/schedules.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qpy/binary_io/schedules.py
license: Apache-2.0
---

## Module `qiskit/qpy/binary_io/schedules.py`

Read schedule and schedule instructions.

This module is kept post pulse-removal to allow reading legacy
payloads containing pulse gates without breaking the load flow.
The purpose of the `_read` and `_load` methods below is just to advance
the file handle while consuming pulse data.

## `read_schedule_block`

```python
def read_schedule_block(file_obj, version, metadata_deserializer=None, use_symengine=False)
```

Consume a single ScheduleBlock from the file like object.

Args:
    file_obj (File): A file like object that contains the QPY binary data.
    version (int): QPY version.
    metadata_deserializer (JSONDecoder): An optional JSONDecoder class
        that will be used for the ``cls`` kwarg on the internal
        ``json.load`` call used to deserialize the JSON payload used for
        the :attr:`.ScheduleBlock.metadata` attribute for a schedule block
        in the file-like object. If this is not specified the circuit metadata will
        be parsed as JSON with the stdlib ``json.load()`` function using
        the default ``JSONDecoder`` class.
    use_symengine (bool): If True, symbolic objects will be serialized using symengine's
        native mechanism. This is a faster serialization alternative, but not supported in all
        platforms. Please check that your target platform is supported by the symengine library
        before setting this option, as it will be required by qpy to deserialize the payload.
Returns:
    QuantumCircuit: Returns a dummy QuantumCircuit object, containing just name and metadata.
    This function exists just to allow reading legacy payloads containing pulse information
    without breaking the entire load flow.

Raises:
    TypeError: If any of the instructions is invalid data format.
    QiskitError: QPY version is earlier than block support.
