---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/layout/sabre_layout.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/layout/sabre_layout.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/layout/sabre_layout.py`

Layout selection using the SABRE bidirectional search approach from Li et al.

## `SabreLayout`

```python
class SabreLayout(TransformationPass)
```

Choose a Layout via iterative bidirectional routing of the input circuit.

Starting with a random initial `Layout`, the algorithm does a full routing
of the circuit (via the `routing_pass` method) to end up with a
`final_layout`. This final_layout is then used as the initial_layout for
routing the reverse circuit. The algorithm iterates a number of times until
it finds an initial_layout that reduces full routing cost.

This method exploits the reversibility of quantum circuits, and tries to
include global circuit information in the choice of initial_layout.

By default, this pass will run both layout and routing and will transform the
circuit so that the layout is applied to the input dag (meaning that the output
circuit will have ancilla qubits allocated for unused qubits on the coupling map
and the qubits will be reordered to match the mapped physical qubits) and then
routing will be applied (inserting :class:`~.SwapGate` objects to account for limited
connectivity). This is unlike most other layout passes which are :class:`~.AnalysisPass`
objects and just find an initial layout and set that on the property set. This is
done because by default the pass will run parallel seed trials with different random
seeds for selecting the random initial layout and then selecting the routed output
which results in the least number of swap gates needed.

You can use the ``routing_pass`` argument to have this pass operate as a typical
layout pass. When specified this will use the specified routing pass to select an
initial layout only and will not run multiple seed trials.

In addition to starting with a random initial `Layout` the pass can also take in
an additional list of starting layouts which will be used for additional
trials. If the ``sabre_starting_layouts`` is present in the property set
when this pass is run, that will be used for additional trials. There will still
be ``layout_trials`` of full random starting layouts run and the contents of
``sabre_starting_layouts`` will be run in addition to those. The output which results
in the lowest amount of swap gates (whether from the random trials or the property
set starting point) will be used. The value for this property set field should be a
list of :class:`.Layout` objects representing the starting layouts to use. If a
virtual qubit is missing from an :class:`.Layout` object in the list a random qubit
will be selected.

Property Set Fields Read
------------------------

``sabre_starting_layouts`` (``list[Layout]``)
    An optional list of :class:`~.Layout` objects to use for additional layout trials. This is
    in addition to the full random trials specified with the ``layout_trials`` argument.

Property Set Values Written
---------------------------

``layout`` (:class:`.Layout`)
    The chosen initial mapping of virtual to physical qubits, including the ancilla allocation.

``final_layout`` (:class:`.Layout`)
    A permutation of how swaps have been applied to the input qubits at the end of the circuit.

**References:**

[1] Henry Zou and Matthew Treinish and Kevin Hartman and Alexander Ivrii and Jake Lishman.
"LightSABRE: A Lightweight and Enhanced SABRE Algorithm"
`arXiv:2409.08368 <https://doi.org/10.48550/arXiv.2409.08368>`__
[2] Li, Gushu, Yufei Ding, and Yuan Xie. "Tackling the qubit mapping problem
for NISQ-era quantum devices." ASPLOS 2019.
`arXiv:1809.02573 <https://arxiv.org/pdf/1809.02573.pdf>`_

### `__init__`

```python
def __init__(self, coupling_map, routing_pass=None, seed=None, max_iterations=3, swap_trials=None, layout_trials=None, skip_routing=False)
```

SabreLayout initializer.

Args:
    coupling_map (Union[CouplingMap, Target]): directed graph representing a coupling map.
    routing_pass (BasePass): the routing pass to use while iterating.
        If specified this pass operates as an :class:`~.AnalysisPass` and
        will only populate the ``layout`` field in the property set and
        the input dag is returned unmodified. This argument is mutually
        exclusive with the ``swap_trials`` and the ``layout_trials``
        arguments and if this is specified at the same time as either
        argument an error will be raised.
    seed (int): seed for setting a random first trial layout.
    max_iterations (int): number of forward-backward iterations.
    swap_trials (int): The number of trials to run of
        :class:`~.SabreSwap` for each iteration. This is equivalent to
        the ``trials`` argument on :class:`~.SabreSwap`. If this is not
        specified (and ``routing_pass`` isn't set) by default the number
        of physical CPUs on your local system will be used. For
        reproducibility between environments it is best to set this
        to an explicit number because the output will potentially depend
        on the number of trials run. This option is mutually exclusive
        with the ``routing_pass`` argument and an error will be raised
        if both are used.
    layout_trials (int): The number of random seed trials to run
        layout with. When > 1 the trial that results in the output with
        the fewest swap gates will be selected. If this is not specified
        (and ``routing_pass`` is not set) then the number of local
        physical CPUs will be used as the default value. This option is
        mutually exclusive with the ``routing_pass`` argument and an error
        will be raised if both are used. An additional 3 or 4 trials
        depending on the ``coupling_map`` value are run with common layouts
        on top of the random trial count specified by this value.
    skip_routing (bool): If this is set ``True`` and ``routing_pass`` is not used
        then routing will not be applied to the output circuit.  Only the layout
        will be set in the property set. This is a tradeoff to run custom
        routing with multiple layout trials, as using this option will cause
        SabreLayout to run the routing stage internally but not use that result.

Raises:
    TranspilerError: If both ``routing_pass`` and ``swap_trials`` or
    both ``routing_pass`` and ``layout_trials`` are specified

### `run`

```python
def run(self, dag)
```

Run the SabreLayout pass on `dag`.

Args:
    dag (DAGCircuit): DAG to find layout for.

Returns:
   DAGCircuit: The output dag if swap mapping was run
    (otherwise the input dag is returned unmodified).

Raises:
    TranspilerError: if dag wider than the target.
