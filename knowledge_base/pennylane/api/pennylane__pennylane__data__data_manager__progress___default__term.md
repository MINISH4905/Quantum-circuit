---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/data_manager/progress/_default/term.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/data_manager/progress/_default/term.py
license: Apache-2.0
---

## Module `pennylane/data/data_manager/progress/_default/term.py`

Functions wrapping ANSI terminal control sequences. See:
https://en.wikipedia.org/wiki/ANSI_escape_code#CSI_(Control_Sequence_Introducer)_sequences

## `cursor_up`

```python
def cursor_up(n: int) -> str
```

Return 'A' control sequence, which to moves the cursor up ``n`` columns.

>>> cursor_up(2)
'[2;A'

## `erase_line`

```python
def erase_line() -> str
```

Return 'K' control sequence, which erases the current line starting from
the cursor.

>>> erase_line()
'[0;K'
