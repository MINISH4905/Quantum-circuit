---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/providers/options.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/providers/options.py
license: Apache-2.0
---

## Module `qiskit/providers/options.py`

Container class for backend options.

## `Options`

```python
class Options(Mapping)
```

Base options object

This class is what all backend options are based
on. The properties of the class are intended to be all dynamically
adjustable so that a user can reconfigure the backend on demand. If a
property is immutable to the user (eg something like number of qubits)
that should be a configuration of the backend class itself instead of the
options.

Instances of this class behave like dictionaries. Accessing an
option with a default value can be done with the `get()` method:

>>> options = Options(opt1=1, opt2=2)
>>> options.get("opt1")
1
>>> options.get("opt3", default="hello")
'hello'

Key-value pairs for all options can be retrieved using the `items()` method:

>>> list(options.items())
[('opt1', 1), ('opt2', 2)]

Options can be updated by name:

>>> options["opt1"] = 3
>>> options.get("opt1")
3

Runtime validators can be registered. See `set_validator`.
Updates through `update_options` and indexing (`__setitem__`) validate
the new value before performing the update and raise `ValueError` if
the new value is invalid.

>>> options.set_validator("opt1", (1, 5))
>>> options["opt1"] = 4
>>> options["opt1"]
4
>>> options["opt1"] = 10  # doctest: +ELLIPSIS
Traceback (most recent call last):
...
ValueError: ...

### `__copy__`

```python
def __copy__(self)
```

Return a copy of the Options.

The returned option and validator values are shallow copies of the originals.

### `set_validator`

```python
def set_validator(self, field, validator_value)
```

Set an optional validator for a field in the options

Setting a validator enables changes to an options values to be
validated for correctness when :meth:`~qiskit.providers.Options.update_options`
is called. For example if you have a numeric field like
``shots`` you can specify a bounds tuple that set an upper and lower
bound on the value such as::

    options.set_validator("shots", (1, 4096))

In this case whenever the ``"shots"`` option is updated by the user
it will enforce that the value is >=1 and <=4096. A ``ValueError`` will
be raised if it's outside those bounds. If a validator is already present
for the specified field it will be silently overridden.

Args:
    field (str): The field name to set the validator on
    validator_value (list or tuple or type): The value to use for the
        validator depending on the type indicates on how the value for
        a field is enforced. If a tuple is passed in it must have a
        length of two and will enforce the min and max value
        (inclusive) for an integer or float value option. If it's a
        list it will list the valid values for a field. If it's a
        ``type`` the validator will just enforce the value is of a
        certain type.
Raises:
    KeyError: If field is not present in the options object
    ValueError: If the ``validator_value`` has an invalid value for a
        given type
    TypeError: If ``validator_value`` is not a valid type

### `update_options`

```python
def update_options(self, **fields)
```

Update options with kwargs
