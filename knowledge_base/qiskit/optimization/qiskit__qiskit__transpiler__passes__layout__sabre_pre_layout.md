---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/layout/sabre_pre_layout.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/layout/sabre_pre_layout.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/layout/sabre_pre_layout.py`

Creating Sabre starting layouts.

## `SabrePreLayout`

```python
class SabrePreLayout(AnalysisPass)
```

Choose a starting layout to use for additional Sabre layout trials.

The pass works by augmenting the coupling map with more and more "extra" edges
until VF2 succeeds to find a perfect graph isomorphism. More precisely, the
augmented coupling map contains edges between nodes that are within a given
distance ``d`` in the original coupling map. The original edges are noise-free
while the additional edges have noise that scales exponentially with the distance.
The value of ``d`` is increased until an isomorphism is found.

Intuitively, a better VF2 layout involves fewer and of shorter-distance extra edges.

Property Set Values Written
---------------------------

``sabre_starting_layouts`` (``list[Layout]``)
    An optional list of :class:`~.Layout` objects to use for additional Sabre layout trials.

**References:**

[1] Henry Zou and Matthew Treinish and Kevin Hartman and Alexander Ivrii and Jake Lishman.
"LightSABRE: A Lightweight and Enhanced SABRE Algorithm"
`arXiv:2409.08368 <https://doi.org/10.48550/arXiv.2409.08368>`__

### `__init__`

```python
def __init__(self, coupling_map: CouplingMap | Target, max_distance: int=2, error_rate: float=0.1, max_trials_vf2: int | None=100, call_limit_vf2: None | int | tuple[int | None, int | None]=None, improve_layout: bool=True, min_distance: int=1)
```

Args:
    coupling_map: Directed graph representing the original coupling map or a target modelling
        the backend (including its connectivity).
    max_distance: The maximum distance for running VF2 with the augmented coupling
        map. In particular, this also specifies the maximum distance between the original nodes
        that become connected in the augmented coupling map.
    error_rate: The error rate to assign to the "extra" edges. A non-zero
        error rate prioritizes VF2 to choose original edges over extra edges.
    max_trials_vf2: Specifies the maximum number of VF2 trials. This option remains primarily
        for legacy reasons since the introduction of on-the-fly scoring in VF2, which was
        introduced in Qiskit 2.3. To bound the time for the pass, set parameters ``max_distance``
        and ``call_limit_vf2`` instead.
    call_limit_vf2: The maximum number of times that the inner VF2 isomorphism search will
        attempt to extend the mapping. If ``None``, then no limit.  If a 2-tuple, then the
        limit starts as the first item, and swaps to the second after the first match is found,
        without resetting the number of steps taken.  This can be used to allow a long search
        for any mapping, but still terminate quickly with a small extension budget if one is
        found.
    improve_layout: Unused (the option became obsolete with the introduction of on-the-fly
        scoring in VF2).
    min_distance: The distance for the first VF2 run with the augmented coupling map. Setting
        ``min_distance > 1`` skips all smaller-distance checks, and in particular skips the
        distance-1 check which corresponds to running the ``VF2Layout`` pass.

Raises:
    TranspilerError: At runtime, if the argument ``coupling_map`` is not provided.

### `run`

```python
def run(self, dag)
```

Run the SabrePreLayout pass on `dag`.

The discovered starting layout is written to the property set
value ``sabre_starting_layouts``.

Args:
    dag (DAGCircuit): DAG to create starting layout for.
