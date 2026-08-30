---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/synthesis/synthesize_rz_rotations.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/synthesis/synthesize_rz_rotations.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/synthesis/synthesize_rz_rotations.py`

Synthesize RZ gates to Clifford+T efficiently

## `SynthesizeRZRotations`

```python
class SynthesizeRZRotations(TransformationPass)
```

Replace RZ gates with Clifford+T decompositions.

This pass replaces all single-qubit RZ rotation gates with floating-point
angles by equivalent Clifford+T sequences.

Internally, the pass synthesizes `RZ(\theta)` for a general `\theta` by
reducing the angle modulo `\pi/2`: the circuit for `RZ(\theta)` can be
constructed from a circuit for `RZ(\theta mod pi/2)` by appending appropriate
Clifford gates. Importantly, the pass also caches synthesis results and reuses
them for angles that are within a given tolerance of each other.

For example::

  from qiskit.circuit import QuantumCircuit
  from qiskit.transpiler.passes import SynthesizeRZRotations
  from qiskit.quantum_info import Operator
  from numpy import pi

  # The following quantum circuit consists of 5 Clifford gates
  # and three single-qubit RZ rotations gates

  qc = QuantumCircuit(4)
  qc.cx(0, 1)
  qc.rz(9*pi/4, 0)
  qc.cz(0, 1)
  qc.rz(3*pi/8, 1)
  qc.h(1)
  qc.s(2)
  qc.rz(13*pi/2, 2)
  qc.cz(2, 0)
  qc.rz(5*pi/3, 3)

  qct = SynthesizeRZRotations()(qc)

  # The transformed circuit consists of Clifford, T and Tdg gates
  clifford_t_names = get_clifford_gate_names() + ["t"] + ["tdg"]
  assert(set(qct.count_ops().keys()).issubset(set(clifford_t_names)))

  # The circuits before and after the transformation are equivalent
  # (with the default value of approximation_degree used by SynthesizeRZRotations)
  assert Operator(qc) == Operator(qct)

### `__init__`

```python
def __init__(self, approximation_degree: float | None=None, synthesis_error: float | None=None, cache_error: float | None=None)
```

If both ``synthesis_error`` and ``cache_error`` are provided, they specify the error budget
for approximate synthesis and for caching respectively. If either value is not
specified, the total allowed error is derived from ``approximation_degree``, and
suitable values for ``synthesis_error`` and ``cache_error`` are computed automatically.

Args:
    approximation_degree: Controls the overall degree of approximation. Defaults
        to ``1 - 1e-10``.
    synthesis_error: Maximum allowed error for the approximate synthesis of
        :math:`RZ(\theta)`. If specified, must be in the range ``(0, 1]``.
    cache_error: Maximum allowed error when reusing a cached synthesis
        result for angles close to :math:`\theta`. If specified, must be in the
        range ``[0, 1]``.

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the SynthesizeRZRotations pass on `dag`.
