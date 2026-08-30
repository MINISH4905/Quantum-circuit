---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/target_gatesets/sqrt_iswap_gateset.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/target_gatesets/sqrt_iswap_gateset.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/target_gatesets/sqrt_iswap_gateset.py`

Target gateset used for compiling circuits to √iSWAP + 1-q rotations + measurement gates.

## `SqrtIswapTargetGateset`

```python
class SqrtIswapTargetGateset(compilation_target_gateset.TwoQubitCompilationTargetGateset)
```

Target gateset accepting √iSWAP + single qubit rotations + measurement gates.

By default, `cirq.SqrtIswapTargetGateset` will accept and compile unknown gates to
the following universal target gateset:
- `cirq.SQRT_ISWAP` / `cirq.SQRT_ISWAP_INV`: The two qubit entangling gate.
- `cirq.PhasedXZGate`: Single qubit rotations.
- `cirq.MeasurementGate`: Measurements.
- `cirq.GlobalPhaseGate`: Global phase.

Optionally, users can also specify additional gates / gate families which should
be accepted by this gateset via the `additional_gates` argument.

When compiling a circuit, any unknown gate, i.e. a gate which is not accepted by
this gateset, will be compiled to the default gateset (i.e. `cirq.SQRT_ISWAP`/
`cirq.cirq.SQRT_ISWAP_INV`, `cirq.PhasedXZGate`, `cirq.MeasurementGate`).

### `__init__`

```python
def __init__(self, *, atol: float=1e-08, required_sqrt_iswap_count: int | None=None, use_sqrt_iswap_inv: bool=False, additional_gates: Sequence[type[cirq.Gate] | cirq.Gate | cirq.GateFamily]=())
```

Initializes `cirq.SqrtIswapTargetGateset`

Args:
    atol: A limit on the amount of absolute error introduced by the decomposition.
    required_sqrt_iswap_count: When specified, the `decompose_to_target_gateset` will
        decompose each operation into exactly this many sqrt-iSWAP gates even if fewer is
        possible (maximum 3). A ValueError will be raised if this number is 2 or lower and
        synthesis of the operation requires more.
    use_sqrt_iswap_inv: If True, `cirq.SQRT_ISWAP_INV` is used as part of the gateset,
        instead of `cirq.SQRT_ISWAP`.
    additional_gates: Sequence of additional gates / gate families which should also
      be "accepted" by this gateset. This is empty by default.

Raises:
    ValueError: If `required_sqrt_iswap_count` is specified and is not 0, 1, 2, or 3.
