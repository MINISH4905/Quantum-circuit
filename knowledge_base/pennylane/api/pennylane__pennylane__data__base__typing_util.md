---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/base/typing_util.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/base/typing_util.py
license: Apache-2.0
---

## Module `pennylane/data/base/typing_util.py`

Contains a sentinel object, common type objects utilities for parsing types
and converting them to strings.

## `UnsetType`

```python
class UnsetType(Enum)
```

Sentintel object - used for defaults where None
may be a valid (non-default) value.

This class is an enum so it may used as a Literal
type annotation, e.g Literal[UNSET].

## `get_type`

```python
def get_type(type_or_obj: object | type) -> type
```

Given an object or an object type, returns the underlying class.

Examples:
    >>> _get_type(list)
    <class 'list'>
    >>> _get_type(List[int])
    <class 'list'>
    >>> _get_type([])
    <class 'list'>

## `get_type_str`

```python
def get_type_str(cls: type | str | None) -> str
```

Return a string representing the type ``cls``.

If cls is a built-in type, such as 'str', returns the unqualified
    name.

If cls is a parametrized generic such as List[str], or a special typing
    form such as Optional[int], returns the string representation of cls.

Otherwise, returns the fully-qualified class name, including the module.

## `resolve_special_type`

```python
def resolve_special_type(type_: Any) -> tuple[type, list[type]] | None
```

Converts special typing forms (Union[...], Optional[...]), and parametrized
generics (List[...], Dict[...]) into a 2-tuple of its base type and arguments.
If ``type_`` is a regular type, or an object, this function will return
``None``.

Note that this function will only perform one level of recursion - the
arguments of nested types will not be resolved:

    >>> resolve_special_type(List[List[int]])
    (<class 'list'>, [<class 'list'>])

Further examples:
    >>> resolve_special_type(Union[str, int])
    (typing.Union, [<class 'str'>, <class 'int'>])
    >>> resolve_special_type(List[int])
    (<class 'list'>, [<class 'int'>])
    >>> resolve_special_type(List)
    (<class 'list'>, [])
    >>> resolve_special_type(list)
    None
