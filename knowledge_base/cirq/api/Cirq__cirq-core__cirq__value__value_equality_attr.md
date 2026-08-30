---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/value/value_equality_attr.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/value/value_equality_attr.py
license: Apache-2.0
---

## Module `cirq-core/cirq/value/value_equality_attr.py`

Defines `@cirq.value_equality`, for easy __eq__/__hash__ methods.

## `value_equality`

```python
def value_equality(cls: type | None=None, *, unhashable: bool=False, distinct_child_types: bool=False, manual_cls: bool=False, approximate: bool=False) -> Callable[[type], type] | type
```

Implements __eq__/__ne__/__hash__ via a _value_equality_values_ method.

_value_equality_values_ is a method that the decorated class must implement.

_value_equality_approximate_values_ is a method that the decorated class
might implement if special support for approximate equality is required.
This is only used when approximate argument is set. When approximate
argument is set and _value_equality_approximate_values_ is not defined,
_value_equality_values_ values are used for approximate equality.
For example, this can be used to compare periodic values like angles: the
angle value can be wrapped with `PeriodicValue`. When returned as part of
approximate values a special normalization will be done automatically to
guarantee correctness.

Note that the type of the decorated value is included as part of the value
equality values. This is so that completely separate classes with identical
equality values (e.g. a Point2D and a Vector2D) don't compare as equal.
Further note that this means that child types of the decorated type will be
considered equal to each other, though this behavior can be changed via
the 'distinct_child_types` argument. The type logic is implemented behind
the scenes by a `_value_equality_values_cls_` method added to the class.

Args:
    cls: The type to decorate. Automatically passed in by python when using
        the @cirq.value_equality decorator notation on a class.
    unhashable: When set, the __hash__ method will be set to None instead of
        to a hash of the equality class and equality values. Useful for
        mutable types such as dictionaries.
    distinct_child_types: When set, classes that inherit from the decorated
        class will not be considered equal to it. Also, different child
        classes will not be considered equal to each other. Useful for when
        the decorated class is an abstract class or trait that is helping to
        define equality for many conceptually distinct concrete classes.
    manual_cls: When set, the method '_value_equality_values_cls_' must be
        implemented. This allows a new class to compare as equal to another
        existing class that is also using value equality, by having the new
        class return the existing class' type.
        Incompatible with `distinct_child_types`.
    approximate: When set, the decorated class will be enhanced with
        `_approx_eq_` implementation and thus start to support the
        `SupportsApproximateEquality` protocol.

Raises:
    TypeError: If the class decorated does not implement the required
        `_value_equality_values` method or, if `manual_cls` is True,
        the class does not implement `_value_equality_values_cls_`.
    ValueError: If both `distinct_child_types` and `manual_cls` are
        specified.
