---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/consolidate_blocks.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/consolidate_blocks.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/consolidate_blocks.py`

Replace each block of consecutive gates by a single Unitary node.

## `ConsolidateBlocks`

```python
class ConsolidateBlocks(TransformationPass)
```

Replace each block of consecutive gates by a single Unitary node.

Pass to consolidate sequences of uninterrupted gates acting on
the same qubits into a :class:`.UnitaryGate` node, to be resynthesized later,
to a potentially more optimal subcircuit. The typical mode of operation of this pass is to run
the analysis of the input :class:`.DAGCircuit` to find all the two qubit blocks in the circuit
and then determine based on an internal heuristic whether that block should be consolidated to
a :class:`.UnitaryGate` or not. However if either ``block_list`` or ``run_list`` are set in the
property set then this pass will not do its own analysis of the DAG.

There are two legacy modes of operation for this pass based on whether either ``block_list`` or
``run_list`` is set in the property set when this pass is run. ``block_list`` should contain a
list of lists of node indices where each inner list represents a collection of blocks to be
potentially consolidated into a :class:`.UnitaryGate`. These blocks can be any number of qubits
but in previous Qiskit releases' preset pass managers it was typically two and set by the
:class:`.Collect2qBlocks` pass. There is a also the :class:`.CollectMultiQBlocks` transpiler pass
which will set ``blocks_list`` with blocks found for an arbitrary number of qubits. The other property
set key ``run_list`` is a list of lists of "runs" which are single qubit blocks to consolidate. This
was potentially set by the :class:`.Collect1qRuns` transpiler pass.
This functionality for "runs" has been mostly superseded by the :class:`.Optimize1qGatesDecomposition`
transpiler pass and that should typically be used instead for a more thorough and performant
method of simplifying single qubit runs.

This pass reads the :class:`.PropertySet` key ``ConsolidateBlocks_qubit_map`` which it uses to
communicate with recursive worker instances of itself for control-flow operations.  The key
should never be observable in a user-facing :class:`.PassManager` pipeline (it is only set in
internal :class:`.PassManager` instances), but the pass may return incorrect results or error if
another pass sets this key.

### `__init__`

```python
def __init__(self, kak_basis_gate: Gate | None=None, force_consolidate: bool=False, basis_gates: list[str] | None=None, approximation_degree: float | None=1.0, target: Target | None=None)
```

ConsolidateBlocks initializer.

If ``kak_basis_gate`` is not ``None`` it will be used as the basis gate for KAK decomposition.
Otherwise, if ``basis_gates`` is not ``None`` a basis gate will be chosen from this list.
Otherwise, the basis gate will be :class:`.CXGate`.

Args:
    kak_basis_gate: Basis gate for KAK decomposition.
    force_consolidate: Force block consolidation.
    basis_gates: Basis gates from which to choose a KAK gate.
    approximation_degree: a float between :math:`[0.0, 1.0]`. Lower approximates more.
    target: The target object for the compilation target backend.

### `run`

```python
def run(self, dag)
```

Run the ConsolidateBlocks pass on `dag`.

Iterate over each block and replace it with an equivalent Unitary
on the same wires.
