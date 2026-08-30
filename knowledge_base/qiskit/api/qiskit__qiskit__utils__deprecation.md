---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/utils/deprecation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/utils/deprecation.py
license: Apache-2.0
---

## Module `qiskit/utils/deprecation.py`

Deprecation utilities

## `deprecate_func`

```python
def deprecate_func(*, since: str, additional_msg: str | None=None, pending: bool=False, package_name: str='Qiskit', removal_timeline: str='no earlier than 3 months after the release date', is_property: bool=False, stacklevel: int=2)
```

Decorator to indicate a function has been deprecated.

It should be placed beneath other decorators like `@staticmethod` and property decorators.

When deprecating a class, set this decorator on its `__init__` function.

Args:
    since: The version the deprecation started at. If the deprecation is pending, set
        the version to when that started; but later, when switching from pending to
        deprecated, update ``since`` to the new version.
    additional_msg: Put here any additional information, such as what to use instead.
        For example, "Instead, use the function ``new_func`` from the module
        ``<my_module>.<my_submodule>``, which is similar but uses GPU acceleration."
    pending: Set to ``True`` if the deprecation is still pending.
    package_name: The package name shown in the deprecation message (e.g. the PyPI package name).
    removal_timeline: How soon can this deprecation be removed? Expects a value
        like "no sooner than 6 months after the latest release" or "in release 9.99".
    is_property: If the deprecated function is a `@property`, set this to True so that the
        generated message correctly describes it as such. (This isn't necessary for
        property setters, as their docstring is ignored by Python.)
    stacklevel: Stack level passed to :func:`warnings.warn`.
Returns:
    Callable: The decorated callable.

## `deprecate_arg`

```python
def deprecate_arg(name: str, *, since: str, additional_msg: str | None=None, deprecation_description: str | None=None, pending: bool=False, package_name: str='Qiskit', new_alias: str | None=None, predicate: Callable[[Any], bool] | None=None, removal_timeline: str='no earlier than 3 months after the release date')
```

Decorator to indicate an argument has been deprecated in some way.

This decorator may be used multiple times on the same function, once per deprecated argument.
It should be placed beneath other decorators like ``@staticmethod`` and property decorators.

Args:
    name: The name of the deprecated argument.
    since: The version the deprecation started at. If the deprecation is pending, set
        the version to when that started; but later, when switching from pending to
        deprecated, update `since` to the new version.
    deprecation_description: What is being deprecated? E.g. "Setting my_func()'s `my_arg`
        argument to `None`." If not set, will default to "{func_name}'s argument `{name}`".
    additional_msg: Put here any additional information, such as what to use instead
        (if new_alias is not set). For example, "Instead, use the argument `new_arg`,
        which is similar but does not impact the circuit's setup."
    pending: Set to `True` if the deprecation is still pending.
    package_name: The package name shown in the deprecation message (e.g. the PyPI package name).
    new_alias: If the arg has simply been renamed, set this to the new name. The decorator will
        dynamically update the `kwargs` so that when the user sets the old arg, it will be
        passed in as the `new_alias` arg.
    predicate: Only log the runtime warning if the predicate returns True. This is useful to
        deprecate certain values or types for an argument, e.g.
        `lambda my_arg: isinstance(my_arg, dict)`. Regardless of if a predicate is set, the
        runtime warning will only log when the user specifies the argument.
    removal_timeline: How soon can this deprecation be removed? Expects a value
        like "no sooner than 6 months after the latest release" or "in release 9.99".

Returns:
    Callable: The decorated callable.

## `add_deprecation_to_docstring`

```python
def add_deprecation_to_docstring(func: Callable, msg: str, *, since: str | None, pending: bool) -> None
```

Dynamically insert the deprecation message into ``func``'s docstring.

Args:
    func: The function to modify.
    msg: The full deprecation message.
    since: The version the deprecation started at.
    pending: Is the deprecation still pending?
