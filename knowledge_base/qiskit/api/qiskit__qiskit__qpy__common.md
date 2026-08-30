---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/qpy/common.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/qpy/common.py
license: Apache-2.0
---

## Module `qiskit/qpy/common.py`

Common functions across several serialization and deserialization modules.

## `read_generic_typed_data`

```python
def read_generic_typed_data(file_obj)
```

Read a single data chunk from the file like object.

Args:
    file_obj (File): A file like object that contains the QPY binary data.

Returns:
    tuple: Tuple of type key binary and the bytes object of the single data.

## `read_sequence`

```python
def read_sequence(file_obj, deserializer, **kwargs)
```

Read a sequence of data from the file like object.

Args:
    file_obj (File): A file like object that contains the QPY binary data.
    deserializer (Callable): Deserializer callback that can handle input object type.
        This must take type key and binary data of the element and return object.
    kwargs: Options set to the deserializer.

Returns:
    list: Deserialized object.

## `read_mapping`

```python
def read_mapping(file_obj, deserializer, **kwargs)
```

Read a mapping from the file like object.

.. note::

    This function must be used to make a binary data of mapping
    which include QPY serialized values.
    It's easier to use JSON serializer followed by encoding for standard data formats.
    This only supports flat dictionary and key must be string.

Args:
    file_obj (File): A file like object that contains the QPY binary data.
    deserializer (Callable): Deserializer callback that can handle mapping item.
        This must take type key and binary data of the mapping value and return object.
    kwargs: Options set to the deserializer.

Returns:
    dict: Deserialized object.

## `read_type_key`

```python
def read_type_key(file_obj)
```

Read a type key from the file like object.

Args:
    file_obj (File): A file like object that contains the QPY binary data.

Returns:
    bytes: Type key.

## `write_generic_typed_data`

```python
def write_generic_typed_data(file_obj, type_key, data_binary)
```

Write statically typed binary data to the file like object.

Args:
    file_obj (File): A file like object to write data.
    type_key (Enum): Object type of the data.
    data_binary (bytes): Binary data to write.

## `write_sequence`

```python
def write_sequence(file_obj, sequence, serializer, **kwargs)
```

Write a sequence of data in the file like object.

Args:
    file_obj (File): A file like object to write data.
    sequence (Sequence): Object to serialize.
    serializer (Callable): Serializer callback that can handle input object type.
        This must return type key and binary data of each element.
    kwargs: Options set to the serializer.

## `write_mapping`

```python
def write_mapping(file_obj, mapping, serializer, **kwargs)
```

Write a mapping in the file like object.

.. note::

    This function must be used to make a binary data of mapping
    which include QPY serialized values.
    It's easier to use JSON serializer followed by encoding for standard data formats.
    This only supports flat dictionary and key must be string.

Args:
    file_obj (File): A file like object to write data.
    mapping (Mapping): Object to serialize.
    serializer (Callable): Serializer callback that can handle mapping item.
        This must return type key and binary data of the mapping value.
    kwargs: Options set to the serializer.

## `write_type_key`

```python
def write_type_key(file_obj, type_key)
```

Write a type key in the file like object.

Args:
    file_obj (File): A file like object that contains the QPY binary data.
    type_key (bytes): Type key to write.

## `data_to_binary`

```python
def data_to_binary(obj, serializer, **kwargs)
```

Convert object into binary data with specified serializer.

Args:
    obj (any): Object to serialize.
    serializer (Callable): Serializer callback that can handle input object type.
    kwargs: Options set to the serializer.

Returns:
    bytes: Binary data.

## `sequence_to_binary`

```python
def sequence_to_binary(sequence, serializer, **kwargs)
```

Convert sequence into binary data with specified serializer.

Args:
    sequence (Sequence): Object to serialize.
    serializer (Callable): Serializer callback that can handle input object type.
        This must return type key and binary data of each element.
    kwargs: Options set to the serializer.

Returns:
    bytes: Binary data.

## `mapping_to_binary`

```python
def mapping_to_binary(mapping, serializer, **kwargs)
```

Convert mapping into binary data with specified serializer.

.. note::

    This function must be used to make a binary data of mapping
    which include QPY serialized values.
    It's easier to use JSON serializer followed by encoding for standard data formats.
    This only supports flat dictionary and key must be string.

Args:
    mapping (Mapping): Object to serialize.
    serializer (Callable): Serializer callback that can handle mapping item.
        This must return type key and binary data of the mapping value.
    kwargs: Options set to the serializer.

Returns:
    bytes: Binary data.

## `data_from_binary`

```python
def data_from_binary(binary_data, deserializer, **kwargs)
```

Load object from binary data with specified deserializer.

Args:
    binary_data (bytes): Binary data to deserialize.
    deserializer (Callable): Deserializer callback that can handle input object type.
    kwargs: Options set to the deserializer.

Returns:
    any: Deserialized object.

## `sequence_from_binary`

```python
def sequence_from_binary(binary_data, deserializer, **kwargs)
```

Load object from binary sequence with specified deserializer.

Args:
    binary_data (bytes): Binary data to deserialize.
    deserializer (Callable): Deserializer callback that can handle input object type.
        This must take type key and binary data of the element and return object.
    kwargs: Options set to the deserializer.

Returns:
    any: Deserialized sequence.

## `mapping_from_binary`

```python
def mapping_from_binary(binary_data, deserializer, **kwargs)
```

Load object from binary mapping with specified deserializer.

.. note::

    This function must be used to make a binary data of mapping
    which include QPY serialized values.
    It's easier to use JSON serializer followed by encoding for standard data formats.
    This only supports flat dictionary and key must be string.

Args:
    binary_data (bytes): Binary data to deserialize.
    deserializer (Callable): Deserializer callback that can handle mapping item.
        This must take type key and binary data of the mapping value and return object.
    kwargs: Options set to the deserializer.

Returns:
    dict: Deserialized object.

## `load_symengine_payload`

```python
def load_symengine_payload(payload: bytes)
```

Load a symengine expression from it's serialized cereal payload.
