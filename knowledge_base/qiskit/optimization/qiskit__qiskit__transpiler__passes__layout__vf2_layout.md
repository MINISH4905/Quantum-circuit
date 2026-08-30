---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/layout/vf2_layout.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/layout/vf2_layout.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/layout/vf2_layout.py`

VF2Layout pass to find a layout using subgraph isomorphism

## `VF2LayoutStopReason`

```python
class VF2LayoutStopReason(Enum)
```

Stop reasons for VF2Layout pass.

## `VF2Layout`

```python
class VF2Layout(AnalysisPass)
```

A pass for choosing a Layout of a circuit onto a Coupling graph, as
a subgraph isomorphism problem, solved by VF2++.

If a solution is found that means there is a "perfect layout" and that no
further swap mapping or routing is needed. If a solution is found the layout
will be set in the property set as ``property_set['layout']``. However, if no
solution is found, no ``property_set['layout']`` is set. The stopping reason is
set in ``property_set['VF2Layout_stop_reason']`` in all the cases and will be
one of the values enumerated in ``VF2LayoutStopReason`` which has the
following values:

    * ``"solution found"``: If a perfect layout was found.
    * ``"nonexistent solution"``: If no perfect layout was found.
    * ``">2q gates in basis"``: If VF2Layout can't work with basis

By default, this pass will construct a heuristic scoring map based on
the error rates in the provided ``target`` (or ``properties`` if ``target``
is not provided). However, analysis passes can be run prior to this pass
and set ``vf2_avg_error_map`` in the property set with a :class:`~.ErrorMap`
instance. If a value is ``NaN`` that is treated as an ideal edge
For example if an error map is created as::

    from qiskit.transpiler.passes.layout.vf2_utils import ErrorMap

    error_map = ErrorMap(3)
    error_map.add_error((0, 0), 0.0024)
    error_map.add_error((0, 1), 0.01)
    error_map.add_error((1, 1), 0.0032)

that represents the error map for a 2 qubit target, where the avg 1q error
rate is ``0.0024`` on qubit 0 and ``0.0032`` on qubit 1. Then the avg 2q
error rate for gates that operate on (0, 1) is 0.01 and (1, 0) is not
supported by the target. This will be used for scoring if it's set as the
``vf2_avg_error_map`` key in the property set when :class:`~.VF2Layout` is run.

### `__init__`

```python
def __init__(self, coupling_map=None, strict_direction=False, seed=None, call_limit=None, time_limit=None, max_trials=None, target=None)
```

Initialize a ``VF2Layout`` pass instance

Args:
    coupling_map (CouplingMap): Directed graph representing a coupling map.
    strict_direction (bool): If True, considers the direction of the coupling map.
                             Default is False.
    seed (int | None): shuffle the labelling of physical qubits to node indices in the
        coupling graph, using a given pRNG seed.  ``None`` seeds using OS entropy (and so is
        non-deterministic).  Using ``-1`` disables the shuffling.
    call_limit (None | int | tuple[int | None, int | None]): The maximum number of times
        that the inner VF2 isomorphism search will attempt to extend the mapping. If
        ``None``, then no limit.  If a 2-tuple, then the limit starts as the first item, and
        swaps to the second after the first match is found, without resetting the number of
        steps taken.  This can be used to allow a long search for any mapping, but still
        terminate quickly with a small extension budget if one is found.
    time_limit (float): The total time limit in seconds to run ``VF2Layout``.  This is not
        completely strict; execution will finish on the first isomorphism found (if any)
        _after_ the time limit has been exceeded.  Setting this option breaks determinism of
        the pass.
    max_trials (int): If set, the algorithm terminates after this many _complete_ layouts
        have been seen.  Since the scoring is done on-the-fly, the vast majority of
        candidate layouts are pruned out of the search before ever becoming complete, so
        this option has little meaning.  To set a low limit on the amount of time spent
        improving an initial limit, set a low value for the second item in the
        ``call_limit`` 2-tuple form.
    target (Target): A target representing the backend device to run ``VF2Layout`` on.
        If specified it will supersede a set value for
        ``coupling_map`` if the :class:`.Target` contains connectivity constraints. If the value
        of ``target`` models an ideal backend without any constraints then the value of
        ``coupling_map``
        will be used.

Raises:
    TypeError: At runtime, if neither ``coupling_map`` or ``target`` are provided.

### `run`

```python
def run(self, dag)
```

run the layout method
