---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/repr_pretty_tester.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/repr_pretty_tester.py
license: Apache-2.0
---

## `FakePrinter`

```python
class FakePrinter
```

A fake of iPython's PrettyPrinter which captures text added to this printer.

Can be used in tests to test a classes `_repr_pretty_` method:

>>> p = cirq.testing.FakePrinter()
>>> object_under_test = cirq.ResultDict(params=None, measurements={'x': np.array([[0, 1]] )})
>>> s = object_under_test._repr_pretty_(p, cycle=False)
>>> p.text_pretty
'x=0, 1'

Prefer to use `assert_repr_pretty` below.

## `assert_repr_pretty`

```python
def assert_repr_pretty(val: Any, text: str, cycle: bool=False) -> None
```

Assert that the given object has a `_repr_pretty_` method that produces the given text.

Args:
        val: The object to test.
        text: The string that `_repr_pretty_` is expected to return.
        cycle: The value of `cycle` passed to `_repr_pretty_`.  `cycle` represents whether
            the call is made with a potential cycle. Typically one should handle the
            `cycle` equals `True` case by returning text that does not recursively call
            the `_repr_pretty_` to break this cycle.

Raises:
    AssertionError: If `_repr_pretty_` does not pretty print the given text.

## `assert_repr_pretty_contains`

```python
def assert_repr_pretty_contains(val: Any, substr: str, cycle: bool=False) -> None
```

Assert that the given object has a `_repr_pretty_` output that contains the given text.

Args:
        val: The object to test.
        substr: The string that `_repr_pretty_` is expected to contain.
        cycle: The value of `cycle` passed to `_repr_pretty_`.  `cycle` represents whether
            the call is made with a potential cycle. Typically one should handle the
            `cycle` equals `True` case by returning text that does not recursively call
            the `_repr_pretty_` to break this cycle.

Raises:
    AssertionError: If `_repr_pretty_` does not pretty print the given text.
