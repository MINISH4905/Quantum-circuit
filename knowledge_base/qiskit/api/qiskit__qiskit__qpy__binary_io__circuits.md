---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/qpy/binary_io/circuits.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qpy/binary_io/circuits.py
license: Apache-2.0
---

## Module `qiskit/qpy/binary_io/circuits.py`

Binary IO for circuit objects.

## `write_circuit`

```python
def write_circuit(file_obj, circuit, metadata_serializer=None, use_symengine=False, version=common.QPY_VERSION, annotation_factories=None, use_rust=True)
```

Write a single QuantumCircuit object in the file like object.

Args:
    file_obj (FILE): The file like object to write the circuit data in.
    circuit (QuantumCircuit): The circuit data to write.
    metadata_serializer (JSONEncoder): An optional JSONEncoder class that
        will be passed the :attr:`.QuantumCircuit.metadata` dictionary for
        ``circuit`` and will be used as the ``cls`` kwarg
        on the ``json.dump()`` call to JSON serialize that dictionary.
    use_symengine (bool): If True, symbolic objects will be serialized using symengine's
        native mechanism. This is a faster serialization alternative, but not supported in all
        platforms. Please check that your target platform is supported by the symengine library
        before setting this option, as it will be required by qpy to deserialize the payload.
    version (int): The QPY format version to use for serializing this circuit
    annotation_factories (dict): a mapping of namespaces to zero-argument factory functions that
        produce instances of :class:`.annotation.QPYSerializer`.
    use_rust (bool): whether to use the rust based serialization engine. On by default.

## `read_circuit`

```python
def read_circuit(file_obj, version, metadata_deserializer=None, use_symengine=False, annotation_factories=None, use_rust=True)
```

Read a single QuantumCircuit object from the file like object.

Args:
    file_obj (FILE): The file like object to read the circuit data from.
    version (int): QPY version.
    metadata_deserializer (JSONDecoder): An optional JSONDecoder class
        that will be used for the ``cls`` kwarg on the internal
        ``json.load`` call used to deserialize the JSON payload used for
        the :attr:`.QuantumCircuit.metadata` attribute for a circuit
        in the file-like object. If this is not specified the circuit metadata will
        be parsed as JSON with the stdlib ``json.load()`` function using
        the default ``JSONDecoder`` class.
    use_symengine (bool): If True, symbolic objects will be de-serialized using
        symengine's native mechanism. This is a faster serialization alternative, but not
        supported in all platforms. Please check that your target platform is supported by
        the symengine library before setting this option, as it will be required by qpy to
        deserialize the payload.
    annotation_factories (dict): mapping of namespaces to factory functions for custom
        annotation deserializer objects.
    use_rust (bool): whether to use the rust based deserialization engine. On by default.
Returns:
    QuantumCircuit: The circuit object from the file.

Raises:
    QpyError: Invalid register.
