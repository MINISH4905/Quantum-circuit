---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/capture/patching.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/capture/patching.py
license: Apache-2.0
---

## Module `pennylane/capture/patching.py`

This module provides utilities for surgical, temporary patching of objects
at runtime using context managers. This approach is inspired by Catalyst's
patching system and allows for controlled, scoped modifications without
global side effects.

## `Patcher`

```python
class Patcher
```

Context manager for temporarily patching object attributes.

This class provides a clean way to temporarily replace attributes on objects
within a specific scope. All changes are automatically reverted when exiting
the context, ensuring no global side effects.

Args:
    *patch_data: Variable number of tuples (obj, attr_name, new_value) where:
        - obj: The object to patch
        - attr_name: Name of the attribute to replace
        - new_value: The temporary value to use within the context

Example:
    >>> import math
    >>> with Patcher((math, "pi", 3.0)):
    ...     print(math.pi)  # prints 3.0
    >>> print(math.pi)  # prints 3.141592653589793

Example with multiple patches:
    >>> with Patcher(
    ...     (math, "pi", 3.0),
    ...     (math, "e", 2.0),
    ... ):
    ...     print(math.pi, math.e)  # prints 3.0 2.0

### `__init__`

```python
def __init__(self, *patch_data)
```

Initialize the patcher with patch specifications.

Args:
    *patch_data: Tuples of (object, attribute_name, new_value)

### `__enter__`

```python
def __enter__(self)
```

Apply all patches and backup original values.

### `__exit__`

```python
def __exit__(self, _type, _value, _traceback)
```

Restore all original values when exiting the context.
