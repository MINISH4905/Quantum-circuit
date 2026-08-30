---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/preset_passmanagers/level2.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/preset_passmanagers/level2.py
license: Apache-2.0
---

## Module `qiskit/transpiler/preset_passmanagers/level2.py`

Pass manager for optimization level 2, providing medium optimization.

Level 2 pass manager: medium optimization by noise adaptive qubit mapping and
gate cancellation using commutativity rules.

## `level_2_pass_manager`

```python
def level_2_pass_manager(pass_manager_config: PassManagerConfig) -> StagedPassManager
```

Level 2 pass manager: medium optimization by initial layout selection and
gate cancellation using commutativity rules.

This pass manager applies the user-given initial layout. If none is given, a search
for a perfect layout (i.e. one that satisfies all 2-qubit interactions) is conducted.
If no such layout is found, qubits are laid out on the most densely connected subset
which also exhibits the best gate fidelities.

The pass manager then transforms the circuit to match the coupling constraints.
It is then unrolled to the basis, and any flipped cx directions are fixed.
Finally, optimizations in the form of commutative gate cancellation and redundant
reset removal are performed.

Args:
    pass_manager_config: configuration of the pass manager.

Returns:
    a level 2 pass manager.

Raises:
    TranspilerError: if the passmanager config is invalid.
