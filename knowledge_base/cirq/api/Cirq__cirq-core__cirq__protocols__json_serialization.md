---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/json_serialization.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/json_serialization.py
license: Apache-2.0
---

## `JsonResolver`

```python
class JsonResolver(Protocol)
```

Protocol for json resolver functions passed to read_json.

## `SupportsJSON`

```python
class SupportsJSON(Protocol)
```

An object that can be turned into JSON dictionaries.

The magic method `_json_dict_` must return a trivially json-serializable
type or other objects that support the SupportsJSON protocol.

During deserialization, a class must be able to be resolved (see
the docstring for `read_json`) and must be able to be (re-)constructed
from the serialized parameters. If the type defines a classmethod
`_from_json_dict_`, that will be called. Otherwise, the `cirq_type` key
will be popped from the dictionary and used as kwargs to the type's
constructor.

## `HasJSONNamespace`

```python
class HasJSONNamespace(Protocol)
```

An object which prepends a namespace to its JSON cirq_type.

Classes which implement this method have the following cirq_type format:

    f"{obj._json_namespace_()}.{obj.__class__.__name__}

Classes outside of Cirq or its submodules MUST implement this method to be
used in type serialization.

## `obj_to_dict_helper`

```python
def obj_to_dict_helper(obj: Any, attribute_names: Iterable[str]) -> dict[str, Any]
```

Construct a dictionary containing attributes from obj

This is useful as a helper function in objects implementing the
SupportsJSON protocol, particularly in the `_json_dict_` method.

In addition to keys and values specified by `attribute_names`, the
returned dictionary has an additional key "cirq_type" whose value
is the string name of the type of `obj`.

Args:
    obj: A python object with attributes to be placed in the dictionary.
    attribute_names: The names of attributes to serve as keys in the
        resultant dictionary. The values will be the attribute values.

## `dataclass_json_dict`

```python
def dataclass_json_dict(obj: Any) -> dict[str, Any]
```

Return a dictionary suitable for `_json_dict_` from a dataclass.

Dataclasses keep track of their relevant fields, so we can automatically generate these.

Dataclasses are implemented with somewhat complex metaprogramming, and tooling (PyCharm, mypy)
have special cases for dealing with classes decorated with @dataclass. There is very little
support (and no plans for support) for decorators that wrap @dataclass (like
@cirq.json_serializable_dataclass) or combining additional decorators with @dataclass.
Although not as elegant, you may want to consider explicitly defining `_json_dict_` on your
dataclasses which simply `return dataclass_json_dict(self)`.

## `attrs_json_dict`

```python
def attrs_json_dict(obj: Any) -> dict[str, Any]
```

Return a dictionary suitable for `_json_dict_` from an attrs dataclass.

## `CirqEncoder`

```python
class CirqEncoder(json.JSONEncoder)
```

Extend json.JSONEncoder to support Cirq objects.

This supports custom serialization. For details, see the documentation
for the SupportsJSON protocol.

In addition to serializing objects that implement the SupportsJSON
protocol, this encoder deals with common, basic types:

 - Python complex numbers get saved as a dictionary keyed by 'real'
   and 'imag'.
 - Numpy ndarrays are converted to lists to use the json module's
   built-in support for lists.
 - Preliminary support for Sympy objects. Currently only sympy.Symbol.
   See https://github.com/quantumlib/Cirq/issues/2014

## `ObjectHook`

```python
class ObjectHook
```

Callable to be used as object_hook during deserialization.

## `SerializableByKey`

```python
class SerializableByKey(SupportsJSON)
```

Protocol for objects that can be serialized to a key + context.

In serialization, objects that inherit from this type will only be fully
defined once (the "context"). Thereafter, a unique integer key will be used
to identify that object.

## `json_namespace`

```python
def json_namespace(type_obj: type) -> str
```

Returns a namespace for JSON serialization of `type_obj`.

Types can provide custom namespaces with `_json_namespace_`; otherwise, a
Cirq type will not include a namespace in its cirq_type. Non-Cirq types
must provide a namespace for serialization in Cirq.

Args:
    type_obj: Type to retrieve the namespace from.

Returns:
    The namespace to prepend `type_obj` with in its JSON cirq_type.

Raises:
    ValueError: if `type_obj` is not a Cirq type and does not explicitly
        define its namespace with _json_namespace_.

## `json_cirq_type`

```python
def json_cirq_type(type_obj: type) -> str
```

Returns a string type for JSON serialization of `type_obj`.

This method is not part of the base serialization path. Together with
`cirq_type_from_json`, it can be used to provide type-object serialization
for classes that need it.

## `factory_from_json`

```python
def factory_from_json(type_str: str, resolvers: Sequence[JsonResolver] | None=None) -> ObjectFactory
```

Returns a factory for constructing objects of type `type_str`.

DEFAULT_RESOLVERS is updated dynamically as cirq submodules are imported.

Args:
    type_str: string representation of the type to deserialize.
    resolvers: list of JsonResolvers to use in type resolution. If this is
        left blank, DEFAULT_RESOLVERS will be used.

Returns:
    An ObjectFactory that can be called to construct an object whose type
    matches the name `type_str`.

Raises:
    ValueError: if type_str does not have a match in `resolvers`.

## `cirq_type_from_json`

```python
def cirq_type_from_json(type_str: str, resolvers: Sequence[JsonResolver] | None=None) -> type
```

Returns a type object for JSON deserialization of `type_str`.

This method is not part of the base deserialization path. Together with
`json_cirq_type`, it can be used to provide type-object deserialization
for classes that need it.

Args:
    type_str: string representation of the type to deserialize.
    resolvers: list of JsonResolvers to use in type resolution. If this is
        left blank, DEFAULT_RESOLVERS will be used.

Returns:
    The type object T for which json_cirq_type(T) matches `type_str`.

Raises:
    ValueError: if type_str does not have a match in `resolvers`, or if the
        match found is a factory method instead of a type.

## `to_json`

```python
def to_json(obj: Any, file_or_fn: None | IO | pathlib.Path | str=None, *, indent: int | None=2, separators: tuple[str, str] | None=None, cls: type[json.JSONEncoder]=CirqEncoder) -> str | None
```

Write a JSON file containing a representation of obj.

The object may be a cirq object or have data members that are cirq
objects which implement the SupportsJSON protocol.

Args:
    obj: An object which can be serialized to a JSON representation.
    file_or_fn: A filename (if a string or `pathlib.Path`) to write to, or
        an IO object (such as a file or buffer) to write to, or `None` to
        indicate that the method should return the JSON text as its result.
        Defaults to `None`.
    indent: Pretty-print the resulting file with this indent level.
        Passed to json.dump.
    separators: Passed to json.dump; key-value pairs delimiters defined as
        `(item_separator, key_separators)` tuple. Note that any non-standard
        operators (':', ',') will cause `read_json` to fail.
    cls: Passed to json.dump; the default value of CirqEncoder
        enables the serialization of Cirq objects which implement
        the SupportsJSON protocol. To support serialization of 3rd
        party classes, prefer adding the `_json_dict_` magic method
        to your classes rather than overriding this default.

## `read_json`

```python
def read_json(file_or_fn: None | IO | pathlib.Path | str=None, *, json_text: str | None=None, resolvers: Sequence[JsonResolver] | None=None) -> Any
```

Read a JSON file that optionally contains cirq objects.

Args:
    file_or_fn: A filename (if a string or `pathlib.Path`) to read from, or
        an IO object (such as a file or buffer) to read from, or `None` to
        indicate that `json_text` argument should be used. Defaults to
        `None`.
    json_text: A string representation of the JSON to parse the object from,
        or else `None` indicating `file_or_fn` should be used. Defaults to
        `None`.
    resolvers: A list of functions that are called in order to turn
        the serialized `cirq_type` string into a constructable class.
        By default, top-level cirq objects that implement the SupportsJSON
        protocol are supported. You can extend the list of supported types
        by pre-pending custom resolvers. Each resolver should return `None`
        to indicate that it cannot resolve the given cirq_type and that
        the next resolver should be tried.

Raises:
    ValueError: If either none of `file_or_fn` and `json_text` is specified,
        or both are specified.

## `to_json_gzip`

```python
def to_json_gzip(obj: Any, file_or_fn: None | IO | pathlib.Path | str=None, *, indent: int=2, cls: type[json.JSONEncoder]=CirqEncoder) -> bytes | None
```

Write a gzipped JSON file containing a representation of obj.

The object may be a cirq object or have data members that are cirq
objects which implement the SupportsJSON protocol.

Args:
    obj: An object which can be serialized to a JSON representation.
    file_or_fn: A filename (if a string or `pathlib.Path`) to write to, or
        an IO object (such as a file or buffer) to write to, or `None` to
        indicate that the method should return the JSON text as its result.
        Defaults to `None`.
    indent: Pretty-print the resulting file with this indent level.
        Passed to json.dump.
    cls: Passed to json.dump; the default value of CirqEncoder
        enables the serialization of Cirq objects which implement
        the SupportsJSON protocol. To support serialization of 3rd
        party classes, prefer adding the _json_dict_ magic method
        to your classes rather than overriding this default.

## `read_json_gzip`

```python
def read_json_gzip(file_or_fn: None | IO | pathlib.Path | str=None, *, gzip_raw: bytes | None=None, resolvers: Sequence[JsonResolver] | None=None) -> Any
```

Read a gzipped JSON file that optionally contains cirq objects.

Args:
    file_or_fn: A filename (if a string or `pathlib.Path`) to read from, or
        an IO object (such as a file or buffer) to read from, or `None` to
        indicate that `gzip_raw` argument should be used. Defaults to
        `None`.
    gzip_raw: Bytes representing the raw gzip input to unzip and parse
        or else `None` indicating `file_or_fn` should be used. Defaults to
        `None`.
    resolvers: A list of functions that are called in order to turn
        the serialized `cirq_type` string into a constructable class.
        By default, top-level cirq objects that implement the SupportsJSON
        protocol are supported. You can extend the list of supported types
        by pre-pending custom resolvers. Each resolver should return `None`
        to indicate that it cannot resolve the given cirq_type and that
        the next resolver should be tried.

Raises:
    ValueError: If either none of `file_or_fn` and `gzip_raw` is specified,
        or both are specified.
