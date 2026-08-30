---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/eject_phased_paulis.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/eject_phased_paulis.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/eject_phased_paulis.py`

Transformer pass that pushes 180° rotations around axes in the XY plane later in the circuit.

## `eject_phased_paulis`

```python
def eject_phased_paulis(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, atol: float=1e-08, eject_parameterized: bool=False) -> cirq.Circuit
```

Transformer pass to push X, Y, PhasedX & (certain) PhasedXZ gates to the end of the circuit.

As the gates get pushed, they may absorb Z gates, cancel against other
X, Y, or PhasedX gates with exponent=1, and cause phase kickback operations
across CZs (which can then be removed by the `cirq.eject_z` transformation).

`cirq.PhasedXZGate` with `z_exponent=0` (i.e. equivalent to PhasedXPow) or with `x_exponent=0`
and `axis_phase_exponent=0` (i.e. equivalent to ZPowGate) are also supported.
To eject `PhasedXZGates` with arbitrary x/z/axis exponents, run
`cirq.eject_z(cirq.eject_phased_paulis(cirq.eject_z(circuit)))`.

Args:
    circuit: Input circuit to transform.
    context: `cirq.TransformerContext` storing common configurable options for transformers.
    atol: Maximum absolute error tolerance. The optimization is permitted to simply drop
        negligible combinations gates with a threshold determined by this tolerance.
    eject_parameterized: If True, the optimization will attempt to eject parameterized gates
        as well.  This may result in other gates parameterized by symbolic expressions.
Returns:
      Copy of the transformed input circuit.
