---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/_compat.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/_compat.py
license: Apache-2.0
---

## Module `cirq-core/cirq/_compat.py`

Workarounds for compatibility issues between versions and libraries.

## `with_debug`

```python
def with_debug(value: bool) -> Iterator[None]
```

Sets the value of global constant `cirq.__cirq_debug__` within the context.

If `__cirq_debug__` is set to False, all validations in Cirq are disabled to optimize
performance. Users should use the `cirq.with_debug` context manager instead of manually
mutating the value of `__cirq_debug__` flag. On exit, the context manager resets the
value of `__cirq_debug__` flag to what it was before entering the context manager.

## `cached_method`

```python
def cached_method(method: TFunc | None=None, *, maxsize: int=128) -> Any
```

Decorator that adds a per-instance LRU cache for a method.

Can be applied with or without parameters to customize the underlying cache:

    @cached_method
    def foo(self, name: str) -> int:
        ...

    @cached_method(maxsize=1000)
    def bar(self, name: str) -> int:
        ...

## `proper_repr`

```python
def proper_repr(value: Any) -> str
```

Overrides sympy and numpy returning repr strings that don't parse.

## `dataclass_repr`

```python
def dataclass_repr(value: Any, namespace: str='cirq') -> str
```

Create a Cirq-style repr for a dataclass.

Args:
    value: The dataclass. We respect the `repr` attribute of dataclass fields if you deign
        to omit a field from the repr.
    namespace: The Python namespace or module name to prepend with a "." to the class name.
        This is the key difference between the default dataclass-generated __repr__.

Returns:
    A representation suitable for the __repr__ method of a dataclass.

## `proper_eq`

```python
def proper_eq(a: Any, b: Any) -> bool
```

Compares objects for equality, working around __eq__ not always working.

For example, in numpy a == b broadcasts and returns an array instead of
doing what np.array_equal(a, b) does. This method uses np.array_equal(a, b)
when dealing with numpy arrays.

## `deprecated`

```python
def deprecated(*, deadline: str, fix: str, name: str | None=None) -> Callable[[Callable], Callable]
```

Marks a function as deprecated.

Args:
    deadline: The version where the function will be deleted. It should be a minor version
        (e.g. "v0.7").
    fix: A complete sentence describing what the user should be using
        instead of this particular function (e.g. "Use cos instead.")
    name: How to refer to the function.
        Defaults to `func.__qualname__`.

Returns:
    A decorator that decorates functions with a deprecation warning.

## `deprecated_class`

```python
def deprecated_class(*, deadline: str, fix: str, name: str | None=None) -> Callable[[type], type]
```

Marks a class as deprecated.

Args:
    deadline: The version where the function will be deleted. It should be a minor version
        (e.g. "v0.7").
    fix: A complete sentence describing what the user should be using
        instead of this particular function (e.g. "Use cos instead.")
    name: How to refer to the class.
        Defaults to `class.__qualname__`.

Returns:
    A decorator that decorates classes with a deprecation warning.

## `deprecated_parameter`

```python
def deprecated_parameter(*, deadline: str, fix: str, func_name: str | None=None, parameter_desc: str, match: Callable[[tuple[Any, ...], dict[str, Any]], bool], rewrite: Callable[[tuple[Any, ...], dict[str, Any]], tuple[tuple[Any, ...], dict[str, Any]]] | None=None) -> Callable[[Callable], Callable]
```

Marks a function parameter as deprecated.

Also handles rewriting the deprecated parameter into the new signature.

Args:
    deadline: The version where the function will be deleted. It should be a minor version
        (e.g. "v0.7").
    fix: A complete sentence describing what the user should be using
        instead of this particular function (e.g. "Use cos instead.")
    func_name: How to refer to the function.
        Defaults to `func.__qualname__`.
    parameter_desc: The name and type of the parameter being deprecated,
        e.g. "janky_count" or "janky_count keyword" or
        "positional janky_count".
    match: A lambda that takes args, kwargs and determines if the
        deprecated parameter is present or not. This determines whether or
        not the deprecation warning is printed, and also whether or not
        rewrite is called.
    rewrite: Returns new args/kwargs that don't use the deprecated
        parameter. Defaults to making no changes.

Returns:
    A decorator that decorates functions with a parameter deprecation
        warning.

## `deprecate_attributes`

```python
def deprecate_attributes(module_name: str, deprecated_attributes: dict[str, tuple[str, str]])
```

Replace module with a wrapper that gives warnings for deprecated attributes.

Args:
    module_name: Absolute name of the module that deprecates attributes.
    deprecated_attributes: A dictionary from attribute name to a tuple of
        strings, where the first string gives the version that the attribute
        will be removed in, and the second string describes what the user
        should do instead of accessing this deprecated attribute.

Returns:
    Wrapped module with deprecated attributes. Use of these attributes
    will cause a warning for these deprecated attributes.

## `DeprecatedModuleLoader`

```python
class DeprecatedModuleLoader(importlib.abc.Loader)
```

A Loader for deprecated modules.

It wraps an existing Loader instance, to which it delegates the loading. On top of that
it ensures that the sys.modules cache has both the deprecated module's name and the
new module's name pointing to the same exact ModuleType instance.

Args:
    loader: the loader to be wrapped
    old_module_name: the deprecated module's fully qualified name
    new_module_name: the new module's fully qualified name

### `__init__`

```python
def __init__(self, loader: Any, old_module_name: str, new_module_name: str)
```

A module loader that uses an existing module loader and intercepts
the execution of a module.

## `DeprecatedModuleFinder`

```python
class DeprecatedModuleFinder(importlib.abc.MetaPathFinder)
```

A module finder to handle deprecated module references.

It sends a deprecation warning when a deprecated module is asked to be found.
It is meant to be used as a wrapper around existing MetaPathFinder instances.

Args:
    new_module_name: The new module's fully qualified name.
    old_module_name: The deprecated module's fully qualified name.
    deadline: The deprecation deadline.
    broken_module_exception: If specified, an exception to throw if
        the module is found.

### `__init__`

```python
def __init__(self, new_module_name: str, old_module_name: str, deadline: str, broken_module_exception: BaseException | None)
```

An aliasing module finder that uses existing module finders to find a python
module spec and intercept the execution of matching modules.

### `find_spec`

```python
def find_spec(self, fullname: str, path: Any=None, target: Any=None) -> Any
```

Finds the specification of a module.

This is an implementation of the importlib.abc.MetaPathFinder.find_spec method.
See https://docs.python.org/3/library/importlib.html#importlib.abc.MetaPathFinder.

Args:
    fullname: name of the module.
    path: if presented, this is the parent module's submodule search path.
    target: When passed in, target is a module object that the finder may use to make a more
        educated guess about what spec to return. We don't use it here, just pass it along
        to the wrapped finder.

## `deprecated_submodule`

```python
def deprecated_submodule(*, new_module_name: str, old_parent: str, old_child: str, deadline: str, create_attribute: bool)
```

Creates a deprecated module reference recursively for a module.

For `new_module_name` (e.g. cirq_google) creates an alias (e.g cirq.google) in Python's module
cache. It also recursively checks for the already imported submodules (e.g. cirq_google.api) and
creates the alias for them too (e.g. cirq.google.api). With this method it is possible to create
an alias that really looks like a module, e.g you can do things like
`from cirq.google import api` - which would be otherwise impossible.

Note that this method will execute `new_module_name` in order to ensure that it is in the module
cache.

Args:
    new_module_name: Absolute module name for the new module.
    old_parent: The current module that had the original submodule.
    old_child: The submodule that is being relocated.
    deadline: The version of Cirq where the module will be removed.
    create_attribute: If True, the submodule will be added as a deprecated attribute to the
        old_parent module.

Returns:
    None

## `block_overlapping_deprecation`

```python
def block_overlapping_deprecation(match_regex: str)
```

Context to block deprecation warnings raised within it.

Useful if a function call might raise more than one warning,
where only one warning is desired.

Args:
    match_regex: DeprecationWarnings with message fields matching
        match_regex will be blocked.
