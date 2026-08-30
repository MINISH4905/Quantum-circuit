---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/utils/classtools.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/utils/classtools.py
license: Apache-2.0
---

## Module `qiskit/utils/classtools.py`

Tools useful for creating decorators, and other high-level callables.

## `wrap_method`

```python
def wrap_method(cls: type, name: str, *, before: Callable | None=None, after: Callable | None=None)
```

Wrap the functionality the instance- or class method ``cls.name`` with additional behavior
``before`` and ``after``.

This mutates ``cls``, replacing the attribute ``name`` with the new functionality.  This is
useful when creating class decorators.  The method is allowed to be defined on any parent class
instead.

If either ``before`` or ``after`` are given, they should be callables with a compatible
signature to the method referred to.  They will be called immediately before or after the method
as appropriate, and any return value will be ignored.

Args:
    cls: the class to modify.
    name: the name of the method on the class to wrap.
    before: a callable that should be called before the method that is being wrapped.
    after: a callable that should be called after the method that is being wrapped.

Raises:
    ValueError: if the named method is not defined on the class or any parent class.
