---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/_doc.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/_doc.py
license: Apache-2.0
---

## Module `cirq-core/cirq/_doc.py`

Workaround for associating docstrings with public constants.

## `document`

```python
def document(value: T, doc_string: str='') -> T
```

Stores documentation details about the given value.

This method is used to associate a docstring with global constants. It is
also used to indicate that a private method should be included in the public
documentation (e.g. when documenting protocols or arithmetic operations).

The given documentation information is filed under `id(value)` in
`cirq._doc.RECORDED_CONST_DOCS`.

Args:
    value: The value to associate with documentation information.
    doc_string: The doc string to associate with the value. Defaults to the
        value's __doc__ attribute.

Returns:
    The given value.

## `doc_private`

```python
def doc_private(obj: T) -> T
```

A decorator: Generates docs for private methods/functions.

For example:
```
class Try:
  @doc_private
  def _private(self):
    ...
```
As a rule of thumb, private (beginning with `_`) methods/functions are
not documented. This decorator allows to force document a private
method/function.

Args:
  obj: The class-attribute to force the documentation for.
Returns:
  obj
