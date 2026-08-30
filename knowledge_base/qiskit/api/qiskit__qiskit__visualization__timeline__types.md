---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/timeline/types.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/timeline/types.py
license: Apache-2.0
---

## Module `qiskit/visualization/timeline/types.py`

Special data types.

## `BoxType`

```python
class BoxType(str, Enum)
```

Box type.

SCHED_GATE: Box that represents occupation time by gate.
DELAY: Box associated with delay.
TIMELINE: Box that represents time slot of a bit.

## `LineType`

```python
class LineType(str, Enum)
```

Line type.

BARRIER: Line that represents barrier instruction.
GATE_LINK: Line that represents a link among gates.

## `SymbolType`

```python
class SymbolType(str, Enum)
```

Symbol type.

FRAME: Symbol that represents zero time frame change (Rz) instruction.

## `LabelType`

```python
class LabelType(str, Enum)
```

Label type.

GATE_NAME: Label that represents name of gate.
DELAY: Label associated with delay.
GATE_PARAM: Label that represents parameter of gate.
BIT_NAME: Label that represents name of bit.

## `AbstractCoordinate`

```python
class AbstractCoordinate(Enum)
```

Abstract coordinate that the exact value depends on the user preference.

RIGHT: The horizontal coordinate at t0 shifted by the left margin.
LEFT: The horizontal coordinate at tf shifted by the right margin.
TOP: The vertical coordinate at the top of the canvas.
BOTTOM: The vertical coordinate at the bottom of the canvas.

## `Plotter`

```python
class Plotter(str, Enum)
```

Name of timeline plotter APIs.

MPL: Matplotlib plotter interface. Show timeline in 2D canvas.
