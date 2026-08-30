---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/gate_direction.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/gate_direction.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/gate_direction.py`

Rearrange the direction of the 2-qubit gate nodes to match the directed coupling map.

## `GateDirection`

```python
class GateDirection(TransformationPass)
```

Modify asymmetric gates to match the hardware coupling direction.

This pass supports replacements for the `cx`, `cz`, `ecr`, `swap`, `rzx`, `rxx`, `ryy` and
`rzz` gates, using the following identities::

                         ┌───┐┌───┐┌───┐
    q_0: ──■──      q_0: ┤ H ├┤ X ├┤ H ├
         ┌─┴─┐  =        ├───┤└─┬─┘├───┤
    q_1: ┤ X ├      q_1: ┤ H ├──■──┤ H ├
         └───┘           └───┘     └───┘


                      global phase: 3π/2
         ┌──────┐           ┌───┐ ┌────┐┌─────┐┌──────┐┌───┐
    q_0: ┤0     ├     q_0: ─┤ S ├─┤ √X ├┤ Sdg ├┤1     ├┤ H ├
         │  ECR │  =       ┌┴───┴┐├────┤└┬───┬┘│  Ecr │├───┤
    q_1: ┤1     ├     q_1: ┤ Sdg ├┤ √X ├─┤ S ├─┤0     ├┤ H ├
         └──────┘          └─────┘└────┘ └───┘ └──────┘└───┘
    Note: This is done in terms of less-efficient S/SX/Sdg gates instead of the more natural
    `RY(pi /2)` so we have a chance for basis translation to keep things in a discrete basis
    during resynthesis, if that's what's being asked for.


         ┌──────┐          ┌───┐┌──────┐┌───┐
    q_0: ┤0     ├     q_0: ┤ H ├┤1     ├┤ H ├
         │  RZX │  =       ├───┤│  RZX │├───┤
    q_1: ┤1     ├     q_1: ┤ H ├┤0     ├┤ H ├
         └──────┘          └───┘└──────┘└───┘

    cz, swap, rxx, ryy and rzz directions are fixed by reversing their qargs order.

This pass assumes that the positions of the qubits in the :attr:`.DAGCircuit.qubits` attribute
are the physical qubit indices. For example if ``dag.qubits[0]`` is qubit 0 in the
:class:`.CouplingMap` or :class:`.Target`.

### `__init__`

```python
def __init__(self, coupling_map, target=None)
```

GateDirection pass.

Args:
    coupling_map (CouplingMap): Directed graph representing a coupling map.
    target (Target): The backend target to use for this pass. If this is specified
        it will be used instead of the coupling map

### `run`

```python
def run(self, dag)
```

Run the GateDirection pass on `dag`.

Flips the cx nodes to match the directed coupling map. Modifies the
input dag.

Args:
    dag (DAGCircuit): DAG to map.

Returns:
    DAGCircuit: The rearranged dag for the coupling map

Raises:
    TranspilerError: If the circuit cannot be mapped just by flipping the
        cx nodes.
