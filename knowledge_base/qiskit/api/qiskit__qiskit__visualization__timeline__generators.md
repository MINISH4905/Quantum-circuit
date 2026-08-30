---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/visualization/timeline/generators.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/visualization/timeline/generators.py
license: Apache-2.0
---

## Module `qiskit/visualization/timeline/generators.py`

A collection of functions that generate drawings from formatted input data.
See :py:mod:`~qiskit.visualization.timeline.types` for more info on the required data.

An end-user can write arbitrary functions that generate custom drawings.
Generators in this module are called with the `formatter` kwarg. This data provides
the stylesheet configuration.


There are 4 types of generators in this module.

1. generator.gates

In this stylesheet entry the input data is `types.ScheduledGate` and generates gate objects
such as time buckets and gate name annotations.

The function signature of the generator is restricted to:

    ```python

    def my_object_generator(
            gate: types.ScheduledGate,
            formatter: Dict[str, Any]) -> List[ElementaryData]:

        # your code here: create and return drawings related to the gate object.
    ```

If a generator object has the attribute ``accepts_program`` set to ``True``, then the generator will
be called with an additional keyword argument ``program: QuantumCircuit``.

2. generator.bits

In this stylesheet entry the input data is `types.Bits` and generates timeline objects
such as zero line and name of bit associated with the timeline.

The function signature of the generator is restricted to:

    ```python

    def my_object_generator(
            bit: types.Bits,
            formatter: Dict[str, Any]) -> List[ElementaryData]:

        # your code here: create and return drawings related to the bit object.
    ```

If a generator object has the attribute ``accepts_program`` set to ``True``, then the generator will
be called with an additional keyword argument ``program: QuantumCircuit``.

3. generator.barriers

In this stylesheet entry the input data is `types.Barrier` and generates barrier objects
such as barrier lines.

The function signature of the generator is restricted to:

    ```python

    def my_object_generator(
            barrier: types.Barrier,
            formatter: Dict[str, Any]) -> List[ElementaryData]:

        # your code here: create and return drawings related to the barrier object.
    ```

If a generator object has the attribute ``accepts_program`` set to ``True``, then the generator will
be called with an additional keyword argument ``program: QuantumCircuit``.

4. generator.gate_links

In this stylesheet entry the input data is `types.GateLink` and generates barrier objects
such as barrier lines.

The function signature of the generator is restricted to:

    ```python

    def my_object_generator(
            link: types.GateLink,
            formatter: Dict[str, Any]) -> List[ElementaryData]:

        # your code here: create and return drawings related to the link object.
    ```

If a generator object has the attribute ``accepts_program`` set to ``True``, then the generator will
be called with an additional keyword argument ``program: QuantumCircuit``.

Arbitrary generator function satisfying the above format can be accepted.
Returned `ElementaryData` can be arbitrary subclasses that are implemented in
the plotter API.

## `gen_sched_gate`

```python
def gen_sched_gate(gate: types.ScheduledGate, formatter: dict[str, Any]) -> list[drawings.TextData | drawings.BoxData]
```

Generate time bucket or symbol of scheduled gate.

If gate duration is zero or frame change a symbol is generated instead of time box.
The face color of gates depends on the operand type.

Stylesheet:
    - The `gate` style is applied for finite duration gate.
    - The `frame_change` style is applied for zero duration gate.
    - The `gate_face_color` style is applied for face color.

Args:
    gate: Gate information source.
    formatter: Dictionary of stylesheet settings.

Returns:
    List of `TextData` or `BoxData` drawings.

## `gen_full_gate_name`

```python
def gen_full_gate_name(gate: types.ScheduledGate, formatter: dict[str, Any], program: QuantumCircuit | None=None) -> list[drawings.TextData]
```

Generate gate name.

Parameters and associated bits are also shown.

Stylesheet:
    - `gate_name` style is applied.
    - `gate_latex_repr` key is used to find the latex representation of the gate name.

Args:
    gate: Gate information source.
    formatter: Dictionary of stylesheet settings.
    program: Optional program that the bits are a part of.

Returns:
    List of `TextData` drawings.

## `gen_short_gate_name`

```python
def gen_short_gate_name(gate: types.ScheduledGate, formatter: dict[str, Any]) -> list[drawings.TextData]
```

Generate gate name.

Only operand name is shown.

Stylesheet:
    - `gate_name` style is applied.
    - `gate_latex_repr` key is used to find the latex representation of the gate name.

Args:
    gate: Gate information source.
    formatter: Dictionary of stylesheet settings.

Returns:
    List of `TextData` drawings.

## `gen_timeslot`

```python
def gen_timeslot(bit: types.Bits, formatter: dict[str, Any]) -> list[drawings.BoxData]
```

Generate time slot of associated bit.

Stylesheet:
    - `timeslot` style is applied.

Args:
    bit: Bit object associated to this drawing.
    formatter: Dictionary of stylesheet settings.

Returns:
    List of `BoxData` drawings.

## `gen_bit_name`

```python
def gen_bit_name(bit: types.Bits, formatter: dict[str, Any], program: QuantumCircuit | None=None) -> list[drawings.TextData]
```

Generate bit label.

Stylesheet:
    - `bit_name` style is applied.

Args:
    bit: Bit object associated to this drawing.
    formatter: Dictionary of stylesheet settings.
    program: Optional program that the bits are a part of.

Returns:
    List of `TextData` drawings.

## `gen_barrier`

```python
def gen_barrier(barrier: types.Barrier, formatter: dict[str, Any]) -> list[drawings.LineData]
```

Generate barrier line.

Stylesheet:
    - `barrier` style is applied.

Args:
    barrier: Barrier instruction.
    formatter: Dictionary of stylesheet settings.

Returns:
    List of `LineData` drawings.

## `gen_gate_link`

```python
def gen_gate_link(link: types.GateLink, formatter: dict[str, Any]) -> list[drawings.GateLinkData]
```

Generate gate link line.

Line color depends on the operand type.

Stylesheet:
    - `gate_link` style is applied.
    - The `gate_face_color` style is applied for line color.

Args:
    link: Gate link object.
    formatter: Dictionary of stylesheet settings.

Returns:
    List of `GateLinkData` drawings.
