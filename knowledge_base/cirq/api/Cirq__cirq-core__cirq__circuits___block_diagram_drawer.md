---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/circuits/_block_diagram_drawer.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/circuits/_block_diagram_drawer.py
license: Apache-2.0
---

## `Block`

```python
class Block
```

The mutable building block that block diagrams are made of.

### `min_width`

```python
def min_width(self) -> int
```

Minimum width necessary to render the block's contents.

### `min_height`

```python
def min_height(self) -> int
```

Minimum height necessary to render the block's contents.

### `draw_curve`

```python
def draw_curve(self, grid_characters: BoxDrawCharacterSet, *, top: bool=False, left: bool=False, right: bool=False, bottom: bool=False, crossing_char: str | None=None)
```

Draws lines in the box using the given character set.

Supports merging the new lines with the lines from a previous call to
draw_curve, including when they have different character sets (assuming
there exist characters merging the two).

Args:
    grid_characters: The character set to draw the curve with.
    top: Draw topward leg?
    left: Draw leftward leg?
    right: Draw rightward leg?
    bottom: Draw downward leg?
    crossing_char: Overrides the all-legs-present character. Useful for
        ascii diagrams, where the + doesn't always look the clearest.

### `render`

```python
def render(self, width: int, height: int) -> list[str]
```

Returns a list of text lines representing the block's contents.

Args:
    width: The width of the output text. Must be at least as large as
        the block's minimum width.
    height: The height of the output text. Must be at least as large as
        the block's minimum height.

Returns:
    Text pre-split into lines.

## `BlockDiagramDrawer`

```python
class BlockDiagramDrawer
```

Aligns text and curve data placed onto an abstract 2d grid of blocks.

### `mutable_block`

```python
def mutable_block(self, x: int, y: int) -> Block
```

Returns the block at (x, y) so it can be edited.

### `set_col_min_width`

```python
def set_col_min_width(self, x: int, min_width: int)
```

Sets a minimum width for blocks in the column with coordinate x.

### `set_row_min_height`

```python
def set_row_min_height(self, y: int, min_height: int)
```

Sets a minimum height for blocks in the row with coordinate y.

### `render`

```python
def render(self, *, block_span_x: int | None=None, block_span_y: int | None=None, min_block_width: int=0, min_block_height: int=0) -> str
```

Outputs text containing the diagram.

Args:
    block_span_x: The width of the diagram in blocks. Set to None to
        default to using the smallest width that would include all
        accessed blocks and columns with a specified minimum width.
    block_span_y: The height of the diagram in blocks. Set to None to
        default to using the smallest height that would include all
        accessed blocks and rows with a specified minimum height.
    min_block_width: A global minimum width for all blocks.
    min_block_height: A global minimum height for all blocks.

Returns:
    The diagram as a string.
