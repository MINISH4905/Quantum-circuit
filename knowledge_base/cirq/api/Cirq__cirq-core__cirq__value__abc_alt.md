---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/value/abc_alt.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/value/abc_alt.py
license: Apache-2.0
---

## Module `cirq-core/cirq/value/abc_alt.py`

A more flexible abstract base class metaclass ABCMetaImplementAnyOneOf.

## `alternative`

```python
def alternative(*, requires: str, implementation: T) -> Callable[[T], T]
```

A decorator indicating an abstract method with an alternative default implementation.

This decorator may be used multiple times on the same function to specify
multiple alternatives.  If multiple alternatives are available, the
outermost (lowest line number) alternative is used.

Usage:
    class Parent(metaclass=ABCMetaImplementAnyOneOf):
        def _default_do_a_using_b(self, ...):
            ...
        def _default_do_a_using_c(self, ...):
            ...

        # Abstract method with alternatives
        @alternative(requires='do_b', implementation=_default_do_a_using_b)
        @alternative(requires='do_c', implementation=_default_do_a_using_c)
        def do_a(self, ...):
            '''Method docstring.'''

        # Abstract or concrete methods `do_b` and `do_c`:
        ...

    class Child(Parent):
        def do_b(self):
            ...

    child = Child()
    child.do_a(...)

Arguments:
    requires: The name of another abstract method in the same class that
        `implementation` needs to be implemented.
    implementation: A function that uses the method named by requires to
        implement the default behavior of the wrapped abstract method.  This
        function must have the same signature as the decorated function.

## `ABCMetaImplementAnyOneOf`

```python
class ABCMetaImplementAnyOneOf(abc.ABCMeta)
```

A metaclass extending `abc.ABCMeta` for defining flexible abstract base classes

This metadata allows the declaration of an abstract base classe (ABC)
with more flexibility in which methods must be overridden.

Use this metaclass in the same way as `abc.ABCMeta` to create an ABC.

In addition to the decorators in the` abc` module, the decorator
`@alternative(...)` may be used.
