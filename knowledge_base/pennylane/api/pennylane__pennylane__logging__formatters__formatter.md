---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/logging/formatters/formatter.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/logging/formatters/formatter.py
license: Apache-2.0
---

## Module `pennylane/logging/formatters/formatter.py`

The PennyLane log-level formatters are defined here with default options, and ANSI-terminal color-codes.

## `ColorScheme`

```python
class ColorScheme(NamedTuple)
```

Utility class to contain level-controlled color-codes for log messages.

## `build_code_rgb`

```python
def build_code_rgb(rgb: tuple[int, int, int], rgb_bg: tuple[int, int, int] | None=None)
```

Utility function to generate the appropriate ANSI RGB codes for a given set of foreground (font) and background colors.

## `bash_ansi_codes`

```python
def bash_ansi_codes()
```

Utility function to generate a bash command for all ANSI color-codes in 24-bit format using both foreground and background colors.

## `DefaultFormatter`

```python
class DefaultFormatter(Formatter)
```

This formatter has the default rules used for formatting PennyLane log messages.

## `DynamicFormatter`

```python
class DynamicFormatter(Formatter)
```

This formatter has the default rules used for formatting PennyLane log messages, with a dynamically updated log format rule

## `SimpleFormatter`

```python
class SimpleFormatter(Formatter)
```

This formatter has a simplified layout and rules used for formatting PennyLane log messages.
