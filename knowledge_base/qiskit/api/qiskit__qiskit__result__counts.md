---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/result/counts.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/result/counts.py
license: Apache-2.0
---

## Module `qiskit/result/counts.py`

A container class for counts from a circuit execution.

## `Counts`

```python
class Counts(dict)
```

A class to store a counts result from a circuit execution.

### `__init__`

```python
def __init__(self, data, time_taken=None, creg_sizes=None, memory_slots=None)
```

Build a counts object

Args:
    data (dict): The dictionary input for the counts. Where the keys
        represent a measured classical value and the value is an
        integer the number of shots with that result.
        All keys must be of the same format. This format must be one of the following.

             * A hexadecimal string of the form ``'0x4a'``
             * A bit string prefixed with ``0b``, for example ``'0b1011'``
             * A bit string with no prefix, for example ``'1011'``
             * A bit string formatted across register and memory slots.
               For example, ``'00 10'``.
             * A dit string, for example ``'02'``. Note for objects created
               with dit strings the ``creg_sizes`` and ``memory_slots``
               kwargs don't work and :meth:`hex_outcomes` and
               :meth:`int_outcomes` also do not work.

    time_taken (float): The duration of the experiment that generated
        the counts in seconds.
    creg_sizes (list): a nested list where the inner element is a list
        of tuples containing both the classical register name and
        classical register size. For example,
        ``[('c_reg', 2), ('my_creg', 4)]``.
    memory_slots (int): The number of total ``memory_slots`` in the
        experiment.
Raises:
    TypeError: If the input key type is not an ``int`` or ``str``, or if the
        input keys are not all of the same type.
    QiskitError: If a dit string key is input with ``creg_sizes`` and/or
        ``memory_slots``.

### `most_frequent`

```python
def most_frequent(self)
```

Return the most frequent count

Returns:
    str: The bit string for the most frequent result
Raises:
    QiskitError: when there is >1 count with the same max counts, or
        an empty object.

### `hex_outcomes`

```python
def hex_outcomes(self)
```

Return a counts dictionary with hexadecimal string keys

Returns:
    dict: A dictionary with the keys as hexadecimal strings instead of
        bitstrings
Raises:
    QiskitError: If the Counts object contains counts for dit strings

### `int_outcomes`

```python
def int_outcomes(self)
```

Build a counts dictionary with integer keys instead of count strings

Returns:
    dict: A dictionary with the keys as integers instead of bitstrings
Raises:
    QiskitError: If the Counts object contains counts for dit strings

### `shots`

```python
def shots(self)
```

Return the number of shots
