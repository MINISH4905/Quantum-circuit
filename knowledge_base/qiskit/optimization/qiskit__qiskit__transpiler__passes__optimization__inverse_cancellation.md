---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/inverse_cancellation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/inverse_cancellation.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/inverse_cancellation.py`

A generic InverseCancellation pass for any set of gate-inverse pairs.

## `InverseCancellation`

```python
class InverseCancellation(TransformationPass)
```

Cancel specific Gates which are inverses of each other when they occur back-to-
back.

### `__init__`

```python
def __init__(self, gates_to_cancel: list[Gate | tuple[Gate, Gate]] | None=None, run_default: bool=False)
```

Initialize InverseCancellation pass.

Args:
    gates_to_cancel: List describing the gates to cancel. Each element of the
        list is either a single gate or a pair of gates. If a single gate, then
        it should be self-inverse. If a pair of gates, then the gates in the
        pair should be inverses of each other. If ``None`` a default list of
        self-inverse gates and a default list of inverse gate pairs will be used.
        The current default list of self-inverse gates is:

          * :class:`.CXGate`
          * :class:`.ECRGate`
          * :class:`.CYGate`
          * :class:`.CZGate`
          * :class:`.XGate`
          * :class:`.YGate`
          * :class:`.ZGate`
          * :class:`.HGate`
          * :class:`.SwapGate`
          * :class:`.CHGate`
          * :class:`.CCXGate`
          * :class:`.CCZGate`
          * :class:`.RCCXGate`
          * :class:`.CSwapGate`
          * :class:`.C3XGate`

        and the default list of inverse gate pairs is:

          * :class:`.TGate` and :class:`.TdgGate`
          * :class:`.SGate` and :class:`.SdgGate`
          * :class:`.SXGate` and :class:`.SXdgGate`
          * :class:`.CSGate` and :class:`.CSdgGate`

    run_default: If set to true and ``gates_to_cancel`` is set to a list then in
        addition to the gates listed in ``gates_to_cancel`` the default list of gate
        inverses (the same as when ``gates_to_cancel`` is set to ``None``) will be
        run. The order of evaluation is significant in how sequences of gates are
        cancelled and the default gates will be evaluated after the provided gates
        in ``gates_to_cancel``. If ``gates_to_cancel`` is ``None`` this option has
        no impact.

Raises:
    TranspilerError: Input is not a self-inverse gate or a pair of inverse gates.

### `run`

```python
def run(self, dag: DAGCircuit)
```

Run the InverseCancellation pass on `dag`.

Args:
    dag: the directed acyclic graph to run on.

Returns:
    DAGCircuit: Transformed DAG.
