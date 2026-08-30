---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/litinski_transformation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/litinski_transformation.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/litinski_transformation.py`

Move clifford gates to the end of the circuit, changing rotation gates to multi-qubit rotations.

## `LitinskiTransformation`

```python
class LitinskiTransformation(TransformationPass)
```

Applies Litinski transform to a circuit.

The transform applies to a circuit containing Clifford, single-qubit :math:`R_Z`-rotation,
:math:`R_X`-rotation and :math:`R_Y`-rotation gates,
(including :math:`Phase`, :math:`T` and :math:`T^\dagger`), Pauli product rotations,
Pauli product measurements, and standard :math:`Z`-measurements.
The transform moves Clifford gates to the end of the circuit, including single-qubit rotation gates,
Pauli product rotations and Pauli product measurements, whose angle is a multiple of :math:`\pi/2`.
In the process, it transforms :math:`R_Z`-rotations,
:math:`R_X`-rotation and :math:`R_Y`-rotation gates to
Pauli product rotations, and :math:`Z`-measurements to Pauli product measurements.

The pass supports all of the Clifford gates in the list returned by
:func:`.get_clifford_gate_names`:

``["id", "x", "y", "z", "h", "s", "sdg", "sx", "sxdg", "cx", "cz", "cy",
"swap","iswap", "ecr", "dcx"]``

In addition, the rotation gates above with angles that are integral multiples of :math:`\pi/2`
within the given tolerance are also considered Clifford.


Example:

.. plot::
    :include-source:
    :nofigs:

    from qiskit import generate_preset_pass_manager
    from qiskit.circuit import QuantumCircuit
    from qiskit.circuit.library import PauliProductMeasurement, PauliProductRotationGate
    from qiskit.quantum_info import Pauli
    from qiskit.transpiler.passes import LitinskiTransformation

    litinski = LitinskiTransformation(fix_clifford=False, use_ppr=True)

    rz_basis = ["rz", "h", "x", "cx"]
    pm = generate_preset_pass_manager(basis_gates=rz_basis)
    pm.optimization.append(litinski)

    qc = QuantumCircuit(3, 1)
    qc.h(0)
    qc.rz(1.23, 0)
    qc.cx(0, 1)
    qc.t(1)
    qc.append(PauliProductRotationGate(Pauli("XY"), 0.456), [1, 2])
    qc.cx(1, 2)
    qc.append(PauliProductMeasurement(Pauli("ZX")), [0, 1], [0])
    qc.measure(2, 0)


    pbc = pm.run(qc)

References:

[1] Litinski. A Game of Surface Codes.
`Quantum 3, 128 (2019) <https://quantum-journal.org/papers/q-2019-03-05-128>`_

### `__init__`

```python
def __init__(self, fix_clifford: bool=True, insert_barrier: bool=False, use_ppr: bool | None=None, approximation_degree: float=1.0)
```

Args:
    fix_clifford: If ``False`` (non-default), the returned circuit contains
        only :class:`.PauliEvolution` gates, with the final Clifford gates omitted.
        Note that in this case the operators of the original and synthesized
        circuits will generally not be equivalent.
    insert_barrier: If ``True`` and ``fix_clifford=True``, insert a barrier between the
        circuit and the final cliffords. This argument has no effect if
        ``fix_clifford=False``.
    use_ppr: If ``True``, use :class:`.PauliProductRotationGate` to represent
        the Pauli rotation gates. This is encouraged to improve performance using a fully
        Rust-backed path. If ``False`` or ``None``, use :class:`.PauliEvolutionGate`.
    approximation_degree: Used in the tolerance computations,
        to check how much a PPR or a rotation gate is close to a Clifford.
        This gives the threshold for the average gate fidelity.

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the LitinskiTransformation pass on ``dag``.

Args:
    dag: The input DAG.

Returns:
    The output DAG.

Raises:
    TranspilerError: If the circuit contains gates not supported by the pass.
