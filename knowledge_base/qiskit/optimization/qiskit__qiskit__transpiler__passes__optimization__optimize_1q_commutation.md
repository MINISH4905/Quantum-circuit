---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/optimize_1q_commutation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/optimize_1q_commutation.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/optimize_1q_commutation.py`

Reduce 1Q gate complexity by commuting through 2Q gates and resynthesizing.

## `Optimize1qGatesSimpleCommutation`

```python
class Optimize1qGatesSimpleCommutation(TransformationPass)
```

Optimizes 1Q gate strings interrupted by 2Q gates by commuting the components and
resynthesizing the results.  The commutation rules are stored in ``commutation_table``.

NOTE: In addition to those mentioned in ``commutation_table``, this pass has some limitations:
      + Does not handle multiple commutations in a row without intermediate progress.
      + Can only commute into positions where there are pre-existing runs.
      + Does not exhaustively test all the different ways commuting gates can be assigned to
        either side of a barrier to try to find low-depth configurations.  (This is particularly
        evident if all the gates in a run commute with both the predecessor and the successor
        barriers.)

### `__init__`

```python
def __init__(self, basis=None, run_to_completion=False, target=None)
```

Args:
    basis (List[str]): See also `Optimize1qGatesDecomposition`.
    run_to_completion (bool): If `True`, this pass retries until it is unable to do any more
        work.  If `False`, it finds and performs one optimization, and for full optimization
        the user is obligated to re-call the pass until the output stabilizes.
    target (Target): The :class:`~.Target` representing the target backend, if both
        ``basis`` and this are specified then this argument will take
        precedence and ``basis`` will be ignored.

### `run`

```python
def run(self, dag)
```

Args:
    dag (DAGCircuit): the DAG to be optimized.

Returns:
    DAGCircuit: the optimized DAG.

## `mov_list`

```python
def mov_list(destination, source)
```

Replace `destination` in-place with `source`.
