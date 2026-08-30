---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/circuits/text_diagram_drawer.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/circuits/text_diagram_drawer.py
license: Apache-2.0
---

## `TextDiagramDrawer`

```python
class TextDiagramDrawer
```

A utility class for creating simple text diagrams.

### `write`

```python
def write(self, x: int, y: int, text: str, transposed_text: str | None=None) -> None
```

Adds text to the given location.

Args:
    x: The column in which to write the text.
    y: The row in which to write the text.
    text: The text to write at location (x, y).
    transposed_text: Optional text to write instead, if the text
        diagram is transposed.

### `content_present`

```python
def content_present(self, x: int, y: int) -> bool
```

Determines if a line or printed text is at the given location.

### `grid_line`

```python
def grid_line(self, x1: int, y1: int, x2: int, y2: int, emphasize: bool=False, doubled: bool=False) -> None
```

Adds a vertical or horizontal line from (x1, y1) to (x2, y2).

Horizontal line is selected on equality in the second coordinate and
vertical line is selected on equality in the first coordinate.

Raises:
    ValueError: If line is neither horizontal nor vertical.

### `vertical_line`

```python
def vertical_line(self, x: float, y1: float, y2: float, emphasize: bool=False, doubled: bool=False) -> None
```

Adds a line from (x, y1) to (x, y2).

### `horizontal_line`

```python
def horizontal_line(self, y: float, x1: float, x2: float, emphasize: bool=False, doubled: bool=False) -> None
```

Adds a line from (x1, y) to (x2, y).

### `transpose`

```python
def transpose(self) -> cirq.TextDiagramDrawer
```

Returns the same diagram, but mirrored across its diagonal.

### `width`

```python
def width(self) -> int
```

Determines how many entry columns are in the diagram.

### `height`

```python
def height(self) -> int
```

Determines how many entry rows are in the diagram.

### `force_horizontal_padding_after`

```python
def force_horizontal_padding_after(self, index: int, padding: float) -> None
```

Change the padding after the given column.

### `force_vertical_padding_after`

```python
def force_vertical_padding_after(self, index: int, padding: float) -> None
```

Change the padding after the given row.

### `insert_empty_columns`

```python
def insert_empty_columns(self, x: int, amount: int=1) -> None
```

Insert a number of columns after the given column.

### `insert_empty_rows`

```python
def insert_empty_rows(self, y: int, amount: int=1) -> None
```

Insert a number of rows after the given row.

### `render`

```python
def render(self, horizontal_spacing: int=1, vertical_spacing: int=1, crossing_char: str | None=None, use_unicode_characters: bool=True) -> str
```

Outputs text containing the diagram.

### `vstack`

```python
def vstack(cls, diagrams: Sequence[cirq.TextDiagramDrawer], padding_resolver: Callable[[Sequence[int | None]], int] | None=None)
```

Vertically stack text diagrams.

Args:
    diagrams: The diagrams to stack, ordered from bottom to top.
    padding_resolver: A function that takes a list of paddings
        specified for a column and returns the padding to use in the
        stacked diagram. If None, defaults to raising ValueError if the
        diagrams to stack contain inconsistent padding in any column,
        including if some specify a padding and others don't.

Raises:
    ValueError: Inconsistent padding cannot be resolved.

Returns:
    The vertically stacked diagram.

### `hstack`

```python
def hstack(cls, diagrams: Sequence[cirq.TextDiagramDrawer], padding_resolver: Callable[[Sequence[int | None]], int] | None=None)
```

Horizontally stack text diagrams.

Args:
    diagrams: The diagrams to stack, ordered from left to right.
    padding_resolver: A function that takes a list of paddings
        specified for a row and returns the padding to use in the
        stacked diagram. Defaults to raising ValueError if the diagrams
        to stack contain inconsistent padding in any row, including
        if some specify a padding and others don't.

Raises:
    ValueError: Inconsistent padding cannot be resolved.

Returns:
    The horizontally stacked diagram.
