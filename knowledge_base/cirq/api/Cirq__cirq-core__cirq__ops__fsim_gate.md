---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/fsim_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/fsim_gate.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/fsim_gate.py`

Defines the fermionic simulation gate.

This is the family of two-qubit gates that preserve excitations (number of ON
qubits), ignoring single-qubit gates and global phase. For example, when using
the second quantized representation of electrons to simulate chemistry, this is
a natural gateset because each ON qubit corresponds to an electron and in the
context of chemistry the electron count is conserved over time. This property
applies more generally to fermions, thus the name of the gate.

## `FSimGate`

```python
class FSimGate(gate_features.InterchangeableQubitsGate, raw_types.Gate)
```

Fermionic simulation gate.

Contains all two qubit interactions that preserve excitations, up to
single-qubit rotations and global phase.

The unitary matrix of this gate is:

$$
\begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & a & b & 0 \\
    0 & b & a & 0 \\
    0 & 0 & 0 & c
\end{bmatrix}
$$

where:

$$
a = \cos(\theta)
$$

$$
b = -i \sin(\theta)
$$

$$
c = e^{-i \phi}
$$

Note the difference in sign conventions between FSimGate and the
ISWAP and CZPowGate:

FSimGate(θ, φ) = ISWAP**(-2θ/π) CZPowGate(exponent=-φ/π)

### `__init__`

```python
def __init__(self, theta: cirq.TParamVal, phi: cirq.TParamVal) -> None
```

Inits FSimGate.

Args:
    theta: Swap angle on the ``|01⟩`` ``|10⟩`` subspace, in radians.
        Determined by the strength and duration of the XX+YY
        interaction. Note: uses opposite sign convention to the
        iSWAP gate. Maximum strength (full iswap) is at pi/2.
    phi: Controlled phase angle, in radians. Determines how much the
        ``|11⟩`` state is phased. Note: uses opposite sign convention to
        the CZPowGate. Maximum strength (full cz) is at pi.

## `PhasedFSimGate`

```python
class PhasedFSimGate(gate_features.InterchangeableQubitsGate, raw_types.Gate)
```

General excitation-preserving two-qubit gate.

The unitary matrix of PhasedFSimGate(θ, ζ, χ, γ, φ) is:

$$
\begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & e^{-i \gamma - i \zeta} \cos(\theta) & -i e^{-i \gamma + i\chi} \sin(\theta) & 0 \\
    0 & -i e^{-i \gamma - i \chi} \sin(\theta) & e^{-i \gamma + i \zeta} \cos(\theta) & 0 \\
    0 & 0 & 0 & e^{-2i \gamma - i \phi}
\end{bmatrix}
$$

This parametrization follows eq (18) in https://arxiv.org/abs/2010.07965.
See also eq (43) in https://arxiv.org/abs/1910.11333 for an older variant
which uses the same θ and φ parameters, but has three phase angles that
have different names and opposite sign. Specifically, ∆+ angle corresponds
to -γ, ∆- corresponds to -ζ and ∆-,off corresponds to -χ.

Another useful parametrization of PhasedFSimGate is based on the fact that
the gate is equivalent up to global phase to the following circuit:

    0: ───Rz(α0)───FSim(θ, φ)───Rz(β0)───
                   │
    1: ───Rz(α1)───FSim(θ, φ)───Rz(β1)───

where α0 and α1 are Rz angles to be applied before the core FSimGate,
β0 and β1 are Rz angles to be applied after FSimGate and θ and φ specify
the core FSimGate. Use the static factory function from_fsim_rz to
instantiate the gate using this parametrization.

Note that the θ and φ parameters in the two parametrizations are the same.

The matrix above is block diagonal where the middle block may be any
element of U(2) and the bottom right block may be any element of U(1).
Consequently, five real parameters are required to specify an instance
of PhasedFSimGate. Therefore, the second parametrization is not injective.
Indeed, for any angle δ

    cirq.PhasedFSimGate.from_fsim_rz(θ, φ, (α0, α1), (β0, β1))

and

    cirq.PhasedFSimGate.from_fsim_rz(θ, φ,
                                     (α0 + δ, α1 + δ),
                                     (β0 - δ, β1 - δ))

specify the same gate and therefore the two instances will compare as
equal up to numerical error. Another consequence of the non-injective
character of the second parametrization is the fact that the properties
rz_angles_before and rz_angles_after may return different Rz angles
than the ones used in the call to from_fsim_rz.

This gate is generally not symmetric under exchange of qubits. It becomes
symmetric if both of the following conditions are satisfied:
 * ζ = kπ or θ = π/2 + lπ for k and l integers,
 * χ = kπ or θ = lπ for k and l integers.

### `__init__`

```python
def __init__(self, theta: cirq.TParamVal, zeta: cirq.TParamVal=0.0, chi: cirq.TParamVal=0.0, gamma: cirq.TParamVal=0.0, phi: cirq.TParamVal=0.0) -> None
```

Inits PhasedFSimGate.

Args:
    theta: Swap angle on the ``|01⟩`` ``|10⟩`` subspace, in radians.
        See class docstring above for details.
    zeta: One of the phase angles, in radians. See class
        docstring above for details.
    chi: One of the phase angles, in radians.
        See class docstring above for details.
    gamma: One of the phase angles, in radians. See class
        docstring above for details.
    phi: Controlled phase angle, in radians. See class docstring
        above for details.

### `from_fsim_rz`

```python
def from_fsim_rz(theta: cirq.TParamVal, phi: cirq.TParamVal, rz_angles_before: tuple[cirq.TParamVal, cirq.TParamVal], rz_angles_after: tuple[cirq.TParamVal, cirq.TParamVal]) -> PhasedFSimGate
```

Creates PhasedFSimGate using an alternate parametrization.

Args:
    theta: Swap angle on the ``|01⟩`` ``|10⟩`` subspace, in radians.
        See class docstring above for details.
    phi: Controlled phase angle, in radians. See class docstring
        above for details.
    rz_angles_before: 2-tuple of phase angles to apply to each qubit
        before the core FSimGate. See class docstring for details.
    rz_angles_after: 2-tuple of phase angles to apply to each qubit
        after the core FSimGate. See class docstring for details.

### `from_matrix`

```python
def from_matrix(u: np.ndarray) -> PhasedFSimGate | None
```

Constructs a PhasedFSimGate from unitary.

Args:
    u: A unitary matrix representing a PhasedFSimGate.

Returns:
    - Either PhasedFSimGate with the given unitary or None if
        the matrix is not unitary or if doesn't represent a PhasedFSimGate.

### `rz_angles_before`

```python
def rz_angles_before(self) -> tuple[cirq.TParamVal, cirq.TParamVal]
```

Returns 2-tuple of phase angles applied to qubits before FSimGate.

### `rz_angles_after`

```python
def rz_angles_after(self) -> tuple[cirq.TParamVal, cirq.TParamVal]
```

Returns 2-tuple of phase angles applied to qubits after FSimGate.

### `qubit_index_to_equivalence_group_key`

```python
def qubit_index_to_equivalence_group_key(self, index: int) -> int
```

Returns a key that differs between non-interchangeable qubits.
