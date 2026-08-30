---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/routing/sabre_swap.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/routing/sabre_swap.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/routing/sabre_swap.py`

Routing via SWAP insertion using the SABRE method from Li et al.

## `SabreSwap`

```python
class SabreSwap(TransformationPass)
```

Map input circuit onto a backend topology via insertion of SWAPs.

Implementation of the SWAP-based heuristic search from the SABRE qubit
mapping paper [2] (Algorithm 1) with the modifications from the LightSABRE
paper [1]. The heuristic aims to minimize the number of lossy SWAPs inserted
and the depth of the circuit.

This algorithm starts from an initial layout of virtual qubits onto physical
qubits, and iterates over the circuit DAG until all gates are exhausted,
inserting SWAPs along the way. It only considers 2-qubit gates as only those
are germane for the mapping problem (it is assumed that 3+ qubit gates are
already decomposed).

In each iteration, it will first check if there are any gates in the
``front_layer`` that can be directly applied. If so, it will apply them and
remove them from ``front_layer``, and replenish that layer with new gates
if possible. Otherwise, it will try to search for SWAPs, insert the SWAPs,
and update the mapping.

The search for SWAPs is restricted, in the sense that we only consider
physical qubits in the neighborhood of those qubits involved in
``front_layer``. These give rise to a ``swap_candidate_list`` which is
scored according to some heuristic cost function. The best SWAP is
implemented and ``current_layout`` updated.

This transpiler pass adds onto the SABRE algorithm in that it will run
multiple trials of the algorithm with different seeds. The best output,
determined by the trial with the least amount of SWAPs inserted, will
be selected from the random trials.

**References:**

[1] Henry Zou and Matthew Treinish and Kevin Hartman and Alexander Ivrii and Jake Lishman.
"LightSABRE: A Lightweight and Enhanced SABRE Algorithm"
`arXiv:2409.08368 <https://doi.org/10.48550/arXiv.2409.08368>`__
[2] Li, Gushu, Yufei Ding, and Yuan Xie. "Tackling the qubit mapping problem
for NISQ-era quantum devices." ASPLOS 2019.
`arXiv:1809.02573 <https://arxiv.org/pdf/1809.02573.pdf>`_

### `__init__`

```python
def __init__(self, coupling_map, heuristic='basic', seed=None, fake_run=False, trials=None)
```

SabreSwap initializer.

Args:
    coupling_map (Union[CouplingMap, Target]): CouplingMap of the target backend.
    heuristic (str): The type of heuristic to use when deciding best
        swap strategy ('basic' or 'lookahead' or 'decay').
    seed (int): random seed used to tie-break among candidate swaps.
    fake_run (bool): if true, it only pretend to do routing, i.e., no
        swap is effectively added.
    trials (int): The number of seed trials to run sabre with. These will
        be run in parallel (unless the PassManager is already running in
        parallel). If not specified this defaults to the number of physical
        CPUs on the local system. For reproducible results it is recommended
        that you set this explicitly, as the output will be deterministic for
        a fixed number of trials.

Raises:
    TranspilerError: If the specified heuristic is not valid.

Additional Information:

    The search space of possible SWAPs on physical qubits is explored
    by assigning a score to the layout that would result from each SWAP.
    The goodness of a layout is evaluated based on how viable it makes
    the remaining virtual gates that must be applied. A few heuristic
    cost functions are supported

    - 'basic':

    The sum of distances for corresponding physical qubits of
    interacting virtual qubits in the front_layer.

    .. math::

        H_{basic} = \sum_{gate \in F} D[\pi(gate.q_1)][\pi(gate.q2)]

    - 'lookahead':

    This is the sum of two costs: first is the same as the basic cost.
    Second is the basic cost but now evaluated for the
    extended set as well (i.e. :math:`|E|` number of upcoming successors to gates in
    front_layer F). This is weighted by some amount EXTENDED_SET_WEIGHT (W) to
    signify that upcoming gates are less important than the front_layer.

    .. math::

        H_{decay}=\frac{1}{\left|{F}\right|}\sum_{gate \in F} D[\pi(gate.q_1)][\pi(gate.q2)]
            + W*\frac{1}{\left|{E}\right|} \sum_{gate \in E} D[\pi(gate.q_1)][\pi(gate.q2)]

    - 'decay':

    This is the same as 'lookahead', but the whole cost is multiplied by a
    decay factor. This increases the cost if the SWAP that generated the
    trial layout was recently used (i.e. it penalizes increase in depth).

    .. math::

        H_{decay} = max(decay(SWAP.q_1), decay(SWAP.q_2)) {
            \frac{1}{\left|{F}\right|} \sum_{gate \in F} D[\pi(gate.q_1)][\pi(gate.q2)]\\
            + W *\frac{1}{\left|{E}\right|} \sum_{gate \in E} D[\pi(gate.q_1)][\pi(gate.q2)]
            }

### `run`

```python
def run(self, dag)
```

Run the SabreSwap pass on `dag`.

Args:
    dag (DAGCircuit): the directed acyclic graph to be mapped.
Returns:
    DAGCircuit: A dag mapped to be compatible with the coupling_map.
Raises:
    TranspilerError: if the coupling map or the layout are not
    compatible with the DAG, or if the coupling_map=None
