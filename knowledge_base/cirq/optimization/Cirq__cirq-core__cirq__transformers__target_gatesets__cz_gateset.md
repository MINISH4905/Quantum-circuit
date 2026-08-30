---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/target_gatesets/cz_gateset.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/target_gatesets/cz_gateset.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/target_gatesets/cz_gateset.py`

Target gateset used for compiling circuits to CZ + 1-q rotations + measurement gates.

## `CZTargetGateset`

```python
class CZTargetGateset(compilation_target_gateset.TwoQubitCompilationTargetGateset)
```

Target gateset accepting CZ + single qubit rotations + measurement gates.

By default, `cirq.CZTargetGateset` will accept and compile unknown gates to
the following universal target gateset:
- `cirq.CZ` / `cirq.CZPowGate`: The two qubit entangling gate.
- `cirq.PhasedXZGate`: Single qubit rotations.
- `cirq.MeasurementGate`: Measurements.
- `cirq.GlobalPhaseGate`: Global phase.

Optionally, users can also specify additional gates / gate families which should
be accepted by this gateset via the `additional_gates` argument.

When compiling a circuit, any unknown gate, i.e. a gate which is not accepted by
this gateset, will be compiled to the default gateset (i.e. `cirq.CZ`/`cirq.CZPowGate`,
`cirq.PhasedXZGate`, `cirq.MeasurementGate`).

### `__init__`

```python
def __init__(self, *, atol: float=1e-08, allow_partial_czs: bool=False, additional_gates: Sequence[type[cirq.Gate] | cirq.Gate | cirq.GateFamily]=(), preserve_moment_structure: bool=True, reorder_operations: bool=False) -> None
```

Initializes CZTargetGateset

Args:
    atol: A limit on the amount of absolute error introduced by the decomposition.
    allow_partial_czs: If set, all powers of the form `cirq.CZ**t`, and not just
     `cirq.CZ`, are part of this gateset.
    additional_gates: Sequence of additional gates / gate families which should also
      be "accepted" by this gateset. This is empty by default.
    preserve_moment_structure: Whether to preserve the moment structure of the
        circuit during compilation or not.
    reorder_operations: Whether to attempt to reorder the operations in order to reduce
        circuit depth or not (can be True only if preserve_moment_structure=False).
