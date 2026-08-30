---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/merge_adjacent_barriers.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/merge_adjacent_barriers.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/merge_adjacent_barriers.py`

Return a circuit with any adjacent barriers merged together.

## `MergeAdjacentBarriers`

```python
class MergeAdjacentBarriers(TransformationPass)
```

Return a circuit with any adjacent barriers merged together.

Only barriers which can be merged without affecting the barrier structure
of the DAG will be merged.

Not all redundant barriers will necessarily be merged, only adjacent
barriers are merged.

For example, the circuit::

    qr = QuantumRegister(3, 'q')
    circuit = QuantumCircuit(qr)
    circuit.barrier(qr[0])
    circuit.barrier(qr[1])
    circuit.barrier(qr)

Will be transformed into a circuit corresponding to::

    circuit.barrier(qr[0])
    circuit.barrier(qr)

i.e,

.. code-block:: text

          ░  ░             ░  ░
    q_0: ─░──░─      q_0: ─░──░─
          ░  ░             ░  ░
    q_1: ─░──░─  =>  q_1: ────░─
          ░  ░                ░
    q_2: ────░─      q_2: ────░─
             ░

after one iteration of the pass. These two barriers were not merged by the
first pass as they are not adjacent in the initial circuit.

The pass then can be reapplied to merge the newly adjacent barriers.

### `run`

```python
def run(self, dag)
```

Run the MergeAdjacentBarriers pass on `dag`.
