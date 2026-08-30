---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/layout/apply_layout.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/layout/apply_layout.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/layout/apply_layout.py`

Transform a circuit with virtual qubits into a circuit with physical qubits.

## `ApplyLayout`

```python
class ApplyLayout(TransformationPass)
```

Apply or update the mapping of virtual qubits to physical qubits in the :class:`.DAGCircuit`.

A "layout" in Qiskit is a mapping of virtual qubits (as the user typically creates circuits in
terms of) to the physical qubits used to represent them on hardware.

This pass has two modes of operation, depending on the state of the ``layout`` and
``post_layout`` keys in the :class:`.PropertySet`:

1. Standard operation: ``post_layout`` is not set.  This takes in a :class:`.DAGCircuit` defined
   over virtual qubits, and rewrites it in terms of physical qubits.  In this case, the
   ``layout`` field must have been chosen by a layout pass (for example :class:`.SetLayout` or
   :class:`.VF2Layout`), and both it and the :class:`.DAGCircuit` must have been expanded with
   ancillas (see :class:`.EnlargeWithAncilla` and :class:`.FullAncillaAllocation`).

2. Improving a layout: ``post_layout`` is set (such as by :class:`.VF2PostLayout`).  In this
   case, the ``post_layout`` must already be the correct size.  It is interpreted as an
   _additional_ relabelling on top of the relabelling that is already applied to the input
   :class:`.DAGCircuit`.

   After the pass runs, the ``layout`` field will be updated to represent the composition of the
   two relabellings, as will the :class:`.DAGCircuit` and any final permutation.  The
   ``post_layout`` field will be removed.

### `run`

```python
def run(self, dag)
```

Run the ApplyLayout pass on ``dag``.

Args:
    dag (DAGCircuit): DAG to map.

Returns:
    DAGCircuit: A mapped DAG (with physical qubits).

Raises:
    TranspilerError: if no layout is found in ``property_set`` or no full physical qubits.
