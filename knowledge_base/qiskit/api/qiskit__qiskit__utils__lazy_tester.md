---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/utils/lazy_tester.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/utils/lazy_tester.py
license: Apache-2.0
---

## Module `qiskit/utils/lazy_tester.py`

Lazy testers for optional features.

## `LazyDependencyManager`

```python
class LazyDependencyManager(abc.ABC)
```

A manager for some optional features that are expensive to import, or to verify the
existence of.

These objects can be used as Booleans, such as ``if x``, and will evaluate ``True`` if the
dependency they test for is available, and ``False`` if not.  The presence of the dependency
will only be tested when the Boolean is evaluated, so it can be used as a runtime test in
functions and methods without requiring an import-time test.

These objects also encapsulate the error handling if their dependency is not present, so you can
do things such as::

    from qiskit.utils import LazyImportManager
    HAS_MATPLOTLIB = LazyImportManager("matplotlib")

    @HAS_MATPLOTLIB.require_in_call
    def my_visualisation():
        ...

    def my_other_visualisation():
        # ... some setup ...
        HAS_MATPLOTLIB.require_now("my_other_visualisation")
        ...

    def my_third_visualisation():
        if HAS_MATPLOTLIB:
            from matplotlib import pyplot
        else:
            ...

In all of these cases, ``matplotlib`` is not imported until the functions are entered.  In the
case of the decorator, ``matplotlib`` is tested for import when the function is called for
the first time.  In the second and third cases, the loader attempts to import ``matplotlib``
when the :meth:`require_now` method is called, or when the Boolean context is evaluated.  For
the ``require`` methods, an error is raised if the library is not available.

This is the base class, which provides the Boolean context checking and error management.  The
concrete classes :class:`LazyImportTester` and :class:`LazySubprocessTester` provide convenient
entry points for testing that certain symbols are importable from modules, or certain
command-line tools are available, respectively.

### `__init__`

```python
def __init__(self, *, name=None, callback=None, install=None, msg=None)
```

Args:
    name: the name of this optional dependency.
    callback: a callback that is called immediately after the availability of the library is
        tested with the result.  This will only be called once.
    install: how to install this optional dependency.  Passed to
        :class:`.MissingOptionalLibraryError` as the ``pip_install`` parameter.
    msg: an extra message to include in the error raised if this is required.

### `require_in_call`

```python
def require_in_call(self, feature_or_callable)
```

Create a decorator for callables that requires that the dependency is available when the
decorated function or method is called.

Args:
    feature_or_callable (str or Callable): the name of the feature that requires these
        dependencies.  If this function is called directly as a decorator (for example
        ``@HAS_X.require_in_call`` as opposed to
        ``@HAS_X.require_in_call("my feature")``), then the feature name will be taken to be
        the function name, or class and method name as appropriate.

Returns:
    Callable: a decorator that will make its argument require this dependency before it is
    called.

### `require_in_instance`

```python
def require_in_instance(self, feature_or_class)
```

A class decorator that requires the dependency is available when the class is
initialized.  This decorator can be used even if the class does not define an ``__init__``
method.

Args:
    feature_or_class (str or Type): the name of the feature that requires these
        dependencies.  If this function is called directly as a decorator (for example
        ``@HAS_X.require_in_instance`` as opposed to
        ``@HAS_X.require_in_instance("my feature")``), then the feature name will be taken
        as the name of the class.

Returns:
    Callable: a class decorator that ensures that the wrapped feature is present if the
    class is initialized.

### `require_now`

```python
def require_now(self, feature: str)
```

Eagerly attempt to import the dependencies in this object, and raise an exception if they
cannot be imported.

Args:
    feature: the name of the feature that is requiring these dependencies.

Raises:
    MissingOptionalLibraryError: if the dependencies cannot be imported.

### `disable_locally`

```python
def disable_locally(self)
```

Create a context, during which the value of the dependency manager will be ``False``.  This
means that within the context, any calls to this object will behave as if the dependency is
not available, including raising errors.  It is valid to call this method whether or not the
dependency has already been evaluated.  This is most useful in tests.

## `LazyImportTester`

```python
class LazyImportTester(LazyDependencyManager)
```

A lazy dependency tester for importable Python modules.  Any required objects will only be
imported at the point that this object is tested for its Boolean value.

### `__init__`

```python
def __init__(self, name_map_or_modules: str | dict[str, Iterable[str]] | Iterable[str], *, name: str | None=None, callback: Callable[[bool], None] | None=None, install: str | None=None, msg: str | None=None)
```

Args:
    name_map_or_modules: if a name map, then a dictionary where the keys are modules or
        packages, and the values are iterables of names to try and import from that
        module.  It should be valid to write ``from <module> import <name1>, <name2>, ...``.
        If simply a string or iterable of strings, then it should be valid to write
        ``import <module>`` for each of them.
    name: the name of this optional dependency.
    callback: a callback that is called immediately after the availability of the library is
        tested with the result.  This will only be called once.
    install: how to install this optional dependency.  Passed to
        :class:`.MissingOptionalLibraryError` as the ``pip_install`` parameter.
    msg: an extra message to include in the error raised if this is required.

Raises:
    ValueError: if no modules are given.

## `LazySubprocessTester`

```python
class LazySubprocessTester(LazyDependencyManager)
```

A lazy checker that a command-line tool is available.  The command will only be run once, at
the point that this object is checked for its Boolean value.

### `__init__`

```python
def __init__(self, command: str | Iterable[str], *, name: str | None=None, callback: Callable[[bool], None] | None=None, install: str | None=None, msg: str | None=None)
```

Args:
    command: the strings that make up the command to be run.  For example,
        ``["pdflatex", "-version"]``.
    name: the name of this optional dependency.
    callback: a callback that is called immediately after the availability of the library is
        tested with the result.  This will only be called once.
    install: how to install this optional dependency.  Passed to
        :class:`.MissingOptionalLibraryError` as the ``pip_install`` parameter.
    msg: an extra message to include in the error raised if this is required.

Raises:
    ValueError: if an empty command is given.
