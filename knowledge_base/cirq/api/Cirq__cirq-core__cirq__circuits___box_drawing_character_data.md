---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/circuits/_box_drawing_character_data.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/circuits/_box_drawing_character_data.py
license: Apache-2.0
---

## Module `cirq-core/cirq/circuits/_box_drawing_character_data.py`

Exposes structured data about unicode/ascii box drawing characters.

## `box_draw_character`

```python
def box_draw_character(first: BoxDrawCharacterSet | None, second: BoxDrawCharacterSet, *, top: int=0, bottom: int=0, left: int=0, right: int=0) -> str | None
```

Finds a box drawing character based on its connectivity.

For example:

    box_draw_character(
        NORMAL_BOX_CHARS,
        BOLD_BOX_CHARS,
        top=-1,
        right=+1)

evaluates to '┕', which has a normal upward leg and bold rightward leg.

Args:
    first: The character set to use for legs set to -1. If set to None,
        defaults to the same thing as the second character set.
    second: The character set to use for legs set to +1.
    top: Whether the upward leg should be present.
    bottom: Whether the bottom leg should be present.
    left: Whether the left leg should be present.
    right: Whether the right leg should be present.

Returns:
    A box drawing character approximating the desired properties, or None
    if all legs are set to 0.
