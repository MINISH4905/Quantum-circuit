---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/drawer/utils.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/drawer/utils.py
license: Apache-2.0
---

## Module `pennylane/drawer/utils.py`

This module contains some useful utility functions for circuit drawing.

## `default_wire_map`

```python
def default_wire_map(tape)
```

Create a dictionary mapping used wire labels to non-negative integers

Args:
    tape [~.tape.QuantumTape): the QuantumTape containing operations and measurements

Returns:
    tuple[dict]: A tuple of maps from wires to sequential positive integers. The first map
    includes work wires whereas the second map excludes work wires.

## `default_bit_map`

```python
def default_bit_map(tape)
```

Create a dictionary mapping ``MidMeasure``'s and ``PauliMeasure``'s to indices
corresponding to classical wires. We only add mid-circuit measurements that are used
for classical conditions and for collecting statistics to this dictionary.

Args:
    tape [~.tape.QuantumTape]: the QuantumTape containing operations and measurements

Returns:
    dict: map from mid-circuit measurements to classical wires.

## `convert_wire_order`

```python
def convert_wire_order(tape, wire_order=None, show_all_wires=False)
```

Creates the mapping between wire labels and place in order.

Args:
    tape (~.tape.QuantumTape): the Quantum Tape containing operations and measurements
    wire_order Sequence[Any]: the order (from top to bottom) to print the wires

Keyword Args:
    show_all_wires=False (bool): whether to display all wires in ``wire_order``
        or only include ones used by operations in ``ops``

Returns:
    tuple[dict]: Two maps from wire labels to sequential positive integers. The first map
    includes work wires, the second map excludes work wires.

## `unwrap_controls`

```python
def unwrap_controls(op)
```

Unwraps nested controlled operations for drawing.

Controlled operations may themselves contain controlled operations; check
for any nesting of operators when drawing so that we correctly identify
and label _all_ control and target qubits.

Args:
    op (.Operation): A PennyLane operation.

Returns:
    Wires, List: The control wires of the operation, along with any associated
    control values.

## `cwire_connections`

```python
def cwire_connections(layers, bit_map)
```

Extract the information required for classical control wires.

Args:
    layers (List[List[.Operator, .MeasurementProcess]]): the operations and measurements sorted
        into layers via ``drawable_layers``. Measurement layers may be appended to operation layers.
    bit_map (Dict): Dictionary containing mid-circuit measurements that are used for
        classical conditions or measurement statistics as keys.

Returns:
    dict, dict, dict: The first dictionary is the updated ``bit_map``, potentially with
    some mid-circuit measurements mapped to new (smaller) classical wires. The second and third
    dictionaries have the classical wires as keys and lists of lists as values, with the outer
    list running over different (re)usages of the classical wire. For the second dictionary,
    the inner lists contain the indices of the accessed layers, for the third dictionary,
    they contain the measured quantum wires and the largest quantum wire of conditionally
    applied operations (no entries for terminal statistics of mid-circuit measurements).

>>> from pennylane.drawer.utils import cwire_connections
>>> from pennylane.drawer.drawable_layers import drawable_layers
>>> with qp.queuing.AnnotatedQueue() as q:
...     m0 = qp.measure(0)
...     m1 = qp.measure(1)
...     qp.cond(m0 & m1, qp.Y)(0)
...     qp.cond(m0, qp.S)(3)
>>> tape = qp.tape.QuantumScript.from_queue(q)
>>> bit_map = {m0.measurements[0]: 0, m1.measurements[0]: 1}
>>> layers = drawable_layers(tape, bit_map=bit_map)
>>> new_bit_map, cwire_layers, cwire_wires = cwire_connections(layers, bit_map)
>>> new_bit_map == bit_map # No reusage happening
True
>>> cwire_layers
{0: [[0, 2, 3]], 1: [[1, 2]]}
>>> cwire_wires
{0: [[0, 0, 3]], 1: [[1, 0]]}

From this information, we can see that classical wire ``0`` is active in layers
0, 2, and 3 while classical wire ``1`` is active in layers 1 and 2, with both classical
wires being used only once (the outer lists all have length 1). The first "active"
layer will always be the one with the mid circuit measurement.

## `transform_deferred_measurements_tape`

```python
def transform_deferred_measurements_tape(tape)
```

Helper function to replace MeasurementValues with wires for tapes using
deferred measurements.
