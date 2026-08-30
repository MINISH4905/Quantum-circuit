---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/collect_linear_functions.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/collect_linear_functions.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/collect_linear_functions.py`

Replace each sequence of CX and SWAP gates by a single LinearFunction gate.

## `CollectLinearFunctions`

```python
class CollectLinearFunctions(CollectAndCollapse)
```

Collect blocks of linear gates (:class:`.CXGate` and :class:`.SwapGate` gates)
and replaces them by linear functions (:class:`.LinearFunction`).

### `__init__`

```python
def __init__(self, do_commutative_analysis=False, split_blocks=True, min_block_size=2, split_layers=False, collect_from_back=False, max_block_width=None)
```

CollectLinearFunctions initializer.

Args:
    do_commutative_analysis (bool): if True, exploits commutativity relations
        between nodes.
    split_blocks (bool): if True, splits collected blocks into sub-blocks
        over disjoint qubit subsets.
    min_block_size (int): specifies the minimum number of gates in the block
        for the block to be collected.
    split_layers (bool): if True, splits collected blocks into sub-blocks
        over disjoint qubit subsets.
    collect_from_back (bool): specifies if blocks should be collected started
        from the end of the circuit.
    max_block_width (int | None): specifies the maximum width of the block
        (that is, the number of qubits over which the block is defined)
        for the block to be collected.
