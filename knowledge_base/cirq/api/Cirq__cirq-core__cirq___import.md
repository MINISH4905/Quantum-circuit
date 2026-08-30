---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/_import.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/_import.py
license: Apache-2.0
---

## `InstrumentedFinder`

```python
class InstrumentedFinder(abc.MetaPathFinder)
```

A module finder used to hook the python import statement.

### `__init__`

```python
def __init__(self, finder: Any, module_name: str, wrap_module: Callable[[ModuleType], ModuleType | None], after_exec: Callable[[ModuleType], None])
```

A module finder that uses an existing module finder to find a python
module spec and intercept the execution of matching modules.

Replace finders in `sys.meta_path` with instances of this class to
instrument import statements.

Args:
    finder: The original module finder to wrap.
    module_name: The fully qualified module name to instrument e.g.
        `'pkg.submodule'`.  Submodules of this are also instrumented.
    wrap_module: A callback function that takes a module object before
        it is run and either modifies or replaces it before it is run.
        The module returned by this function will be executed.  If None
        is returned the module is not executed and may be executed
        later.
    after_exec: A callback function that is called with the return value
        of `wrap_module` after that module was executed if `wrap_module`
        didn't return None.

## `InstrumentedLoader`

```python
class InstrumentedLoader(abc.Loader)
```

A module loader used to hook the python import statement.

### `__init__`

```python
def __init__(self, loader: Any, wrap_module: Callable[[ModuleType], ModuleType | None], after_exec: Callable[[ModuleType], None])
```

A module loader that uses an existing module loader and intercepts
the execution of a module.

Use `InstrumentedFinder` to instrument modules with instances of this
class.

Args:
    loader: The original module loader to wrap.
    module_name: The fully qualified module name to instrument e.g.
        `'pkg.submodule'`.  Submodules of this are also instrumented.
    wrap_module: A callback function that takes a module object before
        it is run and either modifies or replaces it before it is run.
        The module returned by this function will be executed.  If None
        is returned the module is not executed and may be executed
        later.
    after_exec: A callback function that is called with the return value
        of `wrap_module` after that module was executed if `wrap_module`
        didn't return None.

## `wrap_module_executions`

```python
def wrap_module_executions(module_name: str, wrap_func: Callable[[ModuleType], ModuleType | None], after_exec: Callable[[ModuleType], None]=lambda m: None, assert_meta_path_unchanged: bool=True)
```

A context manager that hooks python's import machinery within the
context.

`wrap_func` is called before executing the module called `module_name` and
any of its submodules.  The module returned by `wrap_func` will be executed.

## `delay_import`

```python
def delay_import(module_name: str)
```

A context manager that allows the module or submodule named `module_name`
to be imported without the contents of the module executing until the
context manager exits.

## `LazyLoader`

```python
class LazyLoader(ModuleType)
```

Lazily import a module, mainly to avoid pulling in large dependencies.

This class is a modified version of a similar class in TensorFlow.

To use, instead of importing the module normally
    ```
    import heavy_module
    ```
define the module
    ```
    heavy_module = LazyLoader("heavy_module", globals(), "mypackage.heavy_module")
    ```

### `__init__`

```python
def __init__(self, local_name, parent_module_globals, name)
```

Create the LazyLoader module.

Args:
    local_name: The local name that the module will be refered to as.
    parent_module_globals: The globals of the module where this should be imported.
        Typically this will be globals().
    name: The full qualified name of the module.
