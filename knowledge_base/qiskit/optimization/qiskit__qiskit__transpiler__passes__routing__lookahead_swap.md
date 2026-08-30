---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/routing/lookahead_swap.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/routing/lookahead_swap.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/routing/lookahead_swap.py`

Map input circuit onto a backend topology via insertion of SWAPs.

## `LookaheadSwap`

```python
class LookaheadSwap(TransformationPass)
```

Map input circuit onto a backend topology via insertion of SWAPs.

Implementation of Sven Jandura's swap mapper submission for the 2018 Qiskit
Developer Challenge, adapted to integrate into the transpiler architecture.

The role of the swapper pass is to modify the starting circuit to be compatible
with the target device's topology (the set of two-qubit gates available on the
hardware.) To do this, the pass will insert SWAP gates to relocate the virtual
qubits for each upcoming gate onto a set of coupled physical qubits. However, as
SWAP gates are particularly lossy, the goal is to accomplish this remapping while
introducing the fewest possible additional SWAPs.

This algorithm searches through the available combinations of SWAP gates by means
of a narrowed best first/beam search, described as follows:

- Start with a layout of virtual qubits onto physical qubits.
- Find any gates in the input circuit which can be performed with the current
  layout and mark them as mapped.
- For all possible SWAP gates, calculate the layout that would result from their
  application and rank them according to the distance of the resulting layout
  over upcoming gates (see _calc_layout_distance.)
- For the four (search_width) highest-ranking SWAPs, repeat the above process on
  the layout that would be generated if they were applied.
- Repeat this process down to a depth of four (search_depth) SWAPs away from the
  initial layout, for a total of 256 (search_width^search_depth) prospective
  layouts.
- Choose the layout which maximizes the number of two-qubit which could be
  performed. Add its mapped gates, including the SWAPs generated, to the
  output circuit.
- Repeat the above until all gates from the initial circuit are mapped.

For more details on the algorithm, see Sven's blog post:
https://medium.com/qiskit/improving-a-quantum-compiler-48410d7a7084

### `__init__`

```python
def __init__(self, coupling_map, search_depth=4, search_width=4, fake_run=False)
```

LookaheadSwap initializer.

Args:
    coupling_map (Union[CouplingMap, Target]): CouplingMap of the target backend.
    search_depth (int): lookahead tree depth when ranking best SWAP options.
    search_width (int): lookahead tree width when ranking best SWAP options.
    fake_run (bool): if true, it will only pretend to do routing, i.e., no
        swap is effectively added.

### `run`

```python
def run(self, dag)
```

Run the LookaheadSwap pass on `dag`.

Args:
    dag (DAGCircuit): the directed acyclic graph to be mapped
Returns:
    DAGCircuit: A dag mapped to be compatible with the coupling_map in
        the property_set.
Raises:
    TranspilerError: if the coupling map or the layout are not
    compatible with the DAG, or if the coupling_map=None
