---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/timeline/stylesheet.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/timeline/stylesheet.py
license: Apache-2.0
---

## Module `qiskit/visualization/timeline/stylesheet.py`

Stylesheet for timeline drawer.

# TODO merge this docstring with pulse drawer.

The stylesheet `QiskitTimelineStyle` is initialized with the hard-corded default values in
`default_style`.

The `QiskitTimelineStyle` is a wrapper class of python dictionary with
the nested keys written such as `<type>.<group>.<item>` to represent a specific item
from many configuration options. This key representation is imitative of
`rcParams` of `matplotlib`.  However, the `QiskitTimelineStyle` does not need to be compatible
with the `rcParams` because the timeline stylesheet is heavily specialized to the context of
the scheduled circuit visualization.

Type of stylesheet is broadly separated into `formatter`, `generator` and `layout`.
The formatter is a nested dictionary of drawing parameters to control the appearance of
each visualization element. This data structure is similar to the `rcParams` of `matplotlib`.

The generator is a list of callback functions that generates drawings from
a given data source and the formatter. Each item can take multiple functions so that
several drawing data, for example, box, text, etc..., are generated from the single data source.
The layout is a callback function that determines the appearance of the output image.
Because a single stylesheet doesn't generate multiple images with different appearance,
only one layout function can be chosen for each stylesheet.

## `QiskitTimelineStyle`

```python
class QiskitTimelineStyle(dict)
```

Stylesheet for pulse drawer.

### `formatter`

```python
def formatter(self)
```

Return formatter field of style dictionary.

### `generator`

```python
def generator(self)
```

Return generator field of style dictionary.

### `layout`

```python
def layout(self)
```

Return layout field of style dictionary.

## `IQXStandard`

```python
class IQXStandard(dict)
```

Standard timeline stylesheet.

- Show time buckets.
- Show only operand name.
- Show bit name.
- Show barriers.
- Show idle timeline.
- Show gate link.
- Remove classical bits.

## `IQXSimple`

```python
class IQXSimple(dict)
```

Simple timeline stylesheet.

- Show time buckets.
- Show bit name.
- Show gate link.
- Remove idle timeline.
- Remove classical bits.

## `IQXDebugging`

```python
class IQXDebugging(dict)
```

Timeline stylesheet for programmers. Show details of instructions.

- Show time buckets.
- Show operand name, qubits, and parameters.
- Show barriers.
- Show delays.
- Show idle timeline.
- Show bit name.
- Show gate link.

## `default_style`

```python
def default_style() -> dict[str, Any]
```

Define default values of the timeline stylesheet.
