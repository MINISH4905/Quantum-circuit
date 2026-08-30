---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/utils/units.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/utils/units.py
license: Apache-2.0
---

## Module `qiskit/utils/units.py`

SI unit utilities

## `apply_prefix`

```python
def apply_prefix(value: float | ParameterExpression, unit: str) -> float | ParameterExpression
```

Given a SI unit prefix and value, apply the prefix to convert to
standard SI unit.

Args:
    value: The number to apply prefix to.
    unit: String prefix.

Returns:
    Converted value.

.. note::

    This may induce tiny value error due to internal representation of float object.
    See https://docs.python.org/3/tutorial/floatingpoint.html for details.

Raises:
    ValueError: If the ``unit`` isn't recognized.

## `detach_prefix`

```python
def detach_prefix(value: float, decimal: int | None=None) -> tuple[float, str]
```

Given a SI unit value, find the most suitable prefix to scale the value.

For example, the ``value = 1.3e8`` will be converted into a tuple of ``(130.0, "M")``,
which represents a scaled value and auxiliary unit that may be used to display the value.
In above example, that value might be displayed as ``130 MHz`` (unit is arbitrary here).

Example:

    >>> value, prefix = detach_prefix(1e4)
    >>> print(f"{value} {prefix}Hz")
    10 kHz

Args:
    value: The number to find prefix.
    decimal: Optional. An arbitrary integer number to represent a precision of the value.
        If specified, it tries to round the mantissa and adjust the prefix to rounded value.
        For example, 999_999.91 will become 999.9999 k with ``decimal=4``,
        while 1.0 M with ``decimal=3`` or less.

Returns:
    A tuple of scaled value and prefix.

.. note::

    This may induce tiny value error due to internal representation of float object.
    See https://docs.python.org/3/tutorial/floatingpoint.html for details.

Raises:
    ValueError: If the ``value`` is out of range.
    ValueError: If the ``value`` is not real number.
