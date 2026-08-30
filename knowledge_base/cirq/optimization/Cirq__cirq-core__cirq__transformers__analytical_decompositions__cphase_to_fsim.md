---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/cphase_to_fsim.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/cphase_to_fsim.py
license: Apache-2.0
---

## `compute_cphase_exponents_for_fsim_decomposition`

```python
def compute_cphase_exponents_for_fsim_decomposition(fsim_gate: cirq.FSimGate) -> Sequence[tuple[float, float]]
```

Returns intervals of CZPowGate exponents valid for FSim decomposition.

Ideal intervals associated with the constraints are closed, but due to
numerical error the caller should not assume the endpoints themselves
are valid for the decomposition. See `decompose_cphase_into_two_fsim`
for details on how FSimGate parameters constrain the phase angle of
CZPowGate.

Args:
    fsim_gate: FSimGate into which CZPowGate would be decomposed.

Returns:
    Sequence of 2-tuples each consisting of the minimum and maximum
    value of the exponent for which CZPowGate can be decomposed into
    two FSimGates. The intervals are cropped to [0, 2]. The function
    returns zero, one or two intervals.

Raises:
    ValueError: if the fsim_gate contains symbolic parameters.

## `decompose_cphase_into_two_fsim`

```python
def decompose_cphase_into_two_fsim(cphase_gate: cirq.CZPowGate, *, fsim_gate: cirq.FSimGate, qubits: Sequence[cirq.Qid] | None=None, atol: float=1e-08) -> Sequence[cirq.Operation]
```

Decomposes CZPowGate into two FSimGates.

This function implements the decomposition described in section VII F I
of https://arxiv.org/abs/1910.11333.

The decomposition results in exactly two FSimGates and a few single-qubit
rotations. It is feasible if and only if one of the following conditions
is met:

    |sin(θ)| <= |sin(δ/4)| <= |sin(φ/2)|
    |sin(φ/2)| <= |sin(δ/4)| <= |sin(θ)|

where:

     θ = fsim_gate.theta,
     φ = fsim_gate.phi,
     δ = -π * cphase_gate.exponent.

Note that the gate parameterizations are non-injective. For the
decomposition to be feasible it is sufficient that one of the
parameter values which correspond to the provided gate satisfies
the constraints. This function will find and use the appropriate
value whenever it exists.

The constraints above imply that certain FSimGates are not suitable
for use in this decomposition regardless of the target CZPowGate. We
reject such gates based on how close |sin(θ)| is to |sin(φ/2)|, see
atol argument below.

This implementation accounts for the global phase.

Args:
    cphase_gate: The CZPowGate to synthesize.
    fsim_gate: The only two qubit gate that is permitted to appear in the
        output.
    qubits: The qubits to apply the resulting operations to. If not set,
        defaults `cirq.LineQubit.range(2)`.
    atol: Tolerance used to determine whether fsim_gate is valid. The gate
        is invalid if the squares of the sines of the theta angle and half
        the phi angle are too close.

Returns:
    Operations equivalent to cphase_gate and consisting solely of two copies
    of fsim_gate and a few single-qubit rotations.

Raises:
    ValueError: Under any of the following circumstances:
        * cphase_gate or fsim_gate is parametrized,
        * cphase_gate and fsim_gate do not satisfy the conditions above,
        * fsim_gate has invalid angles (see atol argument above),
        * incorrect number of qubits are provided.
