---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/common_channels.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/common_channels.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/common_channels.py`

Quantum channels that are commonly used in the literature.

## `AsymmetricDepolarizingChannel`

```python
class AsymmetricDepolarizingChannel(raw_types.Gate)
```

A channel that depolarizes asymmetrically along different directions.

This channel applies one of $4^n$ disjoint possibilities: nothing (the
identity channel) or one of the $4^n - 1$ pauli gates.

This channel evolves a density matrix via

$$
\sum_i p_i P_i \rho P_i
$$

where i varies from $0$ to $4^n-1$ and $P_i$ represents n-qubit Pauli operator
(including identity). The input $\rho$ is the density matrix before the
depolarization.

Note: prior to Cirq v0.14, this class contained `num_qubits` as a property.
This violates the contract of `cirq.Gate` so it was removed.  One can
instead get the number of qubits by calling the method `num_qubits`.

### `__init__`

```python
def __init__(self, p_x: float | None=None, p_y: float | None=None, p_z: float | None=None, error_probabilities: dict[str, float] | None=None, tol: float=1e-08) -> None
```

The asymmetric depolarizing channel.

Args:
    p_x: The probability that a Pauli X and no other gate occurs.
    p_y: The probability that a Pauli Y and no other gate occurs.
    p_z: The probability that a Pauli Z and no other gate occurs.
    error_probabilities: Dictionary of string (Pauli operator) to its
        probability. If the identity is missing from the list, it will
        be added so that the total probability mass is 1.
    tol: The tolerance used making sure the total probability mass is
        equal to 1.

Examples of calls:
    * Single qubit: AsymmetricDepolarizingChannel(0.2, 0.1, 0.3)
    * Single qubit: AsymmetricDepolarizingChannel(p_z=0.3)
    * Two qubits: AsymmetricDepolarizingChannel(
                        error_probabilities={'XX': 0.2})

Raises:
    ValueError: if the args or the sum of args are not probabilities.

### `p_i`

```python
def p_i(self) -> float
```

The probability that an Identity I and no other gate occurs.

### `p_x`

```python
def p_x(self) -> float
```

The probability that a Pauli X and no other gate occurs.

### `p_y`

```python
def p_y(self) -> float
```

The probability that a Pauli Y and no other gate occurs.

### `p_z`

```python
def p_z(self) -> float
```

The probability that a Pauli Z and no other gate occurs.

### `error_probabilities`

```python
def error_probabilities(self) -> dict[str, float]
```

A dictionary from Pauli gates to probability

## `asymmetric_depolarize`

```python
def asymmetric_depolarize(p_x: float | None=None, p_y: float | None=None, p_z: float | None=None, error_probabilities: dict[str, float] | None=None, tol: float=1e-08) -> AsymmetricDepolarizingChannel
```

Returns an `AsymmetricDepolarizingChannel` with the given parameters.

This channel applies one of $4^n$ disjoint possibilities: nothing (the
identity channel) or one of the $4^n - 1$ pauli gates.

This channel evolves a density matrix via

$$
\sum_i p_i P_i \rho P_i
$$

where i varies from $0$ to $4^n-1$ and $P_i$ represents n-qubit Pauli operator
(including identity). The input $\rho$ is the density matrix before the
depolarization.

Args:
    p_x: The probability that a Pauli X and no other gate occurs.
    p_y: The probability that a Pauli Y and no other gate occurs.
    p_z: The probability that a Pauli Z and no other gate occurs.
    error_probabilities: Dictionary of string (Pauli operator) to its
        probability. If the identity is missing from the list, it will
        be added so that the total probability mass is 1.
    tol: The tolerance used making sure the total probability mass is
        equal to 1.

Examples of calls:

*     Single qubit: `AsymmetricDepolarizingChannel(0.2, 0.1, 0.3)`
*     Single qubit: `AsymmetricDepolarizingChannel(p_z=0.3)`
*     Two qubits: `AsymmetricDepolarizingChannel(error_probabilities={'XX': 0.2})`

Raises:
    ValueError: if the args or the sum of the args are not probabilities.

## `DepolarizingChannel`

```python
class DepolarizingChannel(raw_types.Gate)
```

A channel that depolarizes one or several qubits.

This channel applies one of $4^n$ disjoint possibilities: nothing (the
identity channel) or one of the $4^n - 1$ pauli gates. The disjoint
probabilities of the non-identity Pauli gates are all the same,
$p / (4^n - 1)$, and the identity is done with probability $1 - p$. The
supplied probability must be a valid probability or else this
constructor will raise a ValueError.


This channel evolves a density matrix via

$$
\rho \rightarrow (1 - p) \rho + p / (4^n - 1) \sum _i P_i \rho P_i
$$

where $P_i$ are the $4^n - 1$ Pauli gates (excluding the identity).

### `__init__`

```python
def __init__(self, p: float, n_qubits: int=1) -> None
```

Constructs a depolarization channel on several qubits.

Args:
    p: The probability that one of the Pauli gates is applied. Each of
        the Pauli gates is applied independently with probability
        $p / (4^n - 1)$.
    n_qubits: the number of qubits.

Raises:
    ValueError: if p is not a valid probability.

### `p`

```python
def p(self) -> float
```

The probability that one of the Pauli gates is applied.

Each of the Pauli gates is applied independently with probability
$p / (4^n - 1)$, where $n$ is `n_qubits`.

### `n_qubits`

```python
def n_qubits(self) -> int
```

The number of qubits

## `depolarize`

```python
def depolarize(p: float, n_qubits: int=1) -> DepolarizingChannel
```

Returns a DepolarizingChannel with given probability of error.

This channel applies one of $4^n$ disjoint possibilities: nothing (the
identity channel) or one of the $4^n - 1$ pauli gates. The disjoint
probabilities of the non-identity Pauli gates are all the same,
$p / (4^n - 1)$, and the identity is done with probability 1 - p. The
supplied probability must be a valid probability or else this constructor
will raise a ValueError.

This channel evolves a density matrix via

$$
\rho \rightarrow (1 - p) \rho + p / (4^n - 1) \sum _i P_i \rho P_i
$$

where $P_i$ are the $4^n - 1$ Pauli gates (excluding the identity).

Args:
    p: The probability that one of the Pauli gates is applied. Each of
        the Pauli gates is applied independently with probability
        $p / (4^n - 1)$, where $n$ is n_qubits.
    n_qubits: The number of qubits.

Raises:
    ValueError: if p is not a valid probability.

## `GeneralizedAmplitudeDampingChannel`

```python
class GeneralizedAmplitudeDampingChannel(raw_types.Gate)
```

Dampen qubit amplitudes through non ideal dissipation.

This channel models the effect of energy dissipation into the environment
as well as the environment depositing energy into the system.

Construct a channel to model energy dissipation into the environment
as well as the environment depositing energy into the system. The
probabilities with which the energy exchange occur are given by `gamma`,
and the probability of the environment being not excited is given by
`p`.

The stationary state of this channel is the diagonal density matrix
with probability `p` of being |0⟩ and probability `1-p` of being |1⟩.

This channel evolves a density matrix via

$$
\rho \rightarrow \sum_{i=0}^3 M_i \rho M_i^\dagger
$$

with

$$
\begin{aligned}
M_0 =& \sqrt{p} \begin{bmatrix}
                    1 & 0  \\
                    0 & \sqrt{1 - \gamma}
                \end{bmatrix}
\\
M_1 =& \sqrt{p} \begin{bmatrix}
                    0 & \sqrt{\gamma} \\
                    0 & 0
               \end{bmatrix}
\\
M_2 =& \sqrt{1-p} \begin{bmatrix}
                    \sqrt{1-\gamma} & 0 \\
                     0 & 1
                  \end{bmatrix}
\\
M_3 =& \sqrt{1-p} \begin{bmatrix}
                     0 & 0 \\
                     \sqrt{\gamma} & 0
                 \end{bmatrix}
\end{aligned}
$$

### `__init__`

```python
def __init__(self, p: float, gamma: float) -> None
```

The generalized amplitude damping channel.

Args:
    p: the probability of the environment being not excited
    gamma: the probability of energy transfer

Raises:
    ValueError: if gamma or p is not a valid probability.

### `p`

```python
def p(self) -> float
```

The probability of the environment being not excited.

### `gamma`

```python
def gamma(self) -> float
```

The probability of energy transfer.

## `generalized_amplitude_damp`

```python
def generalized_amplitude_damp(p: float, gamma: float) -> GeneralizedAmplitudeDampingChannel
```

Returns a GeneralizedAmplitudeDampingChannel with probabilities gamma and p.

This channel evolves a density matrix via:

$$
\rho \rightarrow M_0 \rho M_0^\dagger + M_1 \rho M_1^\dagger
      + M_2 \rho M_2^\dagger + M_3 \rho M_3^\dagger
$$

With:

$$
\begin{aligned}
M_0 =& \sqrt{p} \begin{bmatrix}
                    1 & 0  \\
                    0 & \sqrt{1 - \gamma}
               \end{bmatrix}
\\
M_1 =& \sqrt{p} \begin{bmatrix}
                    0 & \sqrt{\gamma} \\
                    0 & 0
               \end{bmatrix}
\\
M_2 =& \sqrt{1-p} \begin{bmatrix}
                    \sqrt{1-\gamma} & 0 \\
                     0 & 1
                  \end{bmatrix}
\\
M_3 =& \sqrt{1-p} \begin{bmatrix}
                     0 & 0 \\
                     \sqrt{\gamma} & 0
                 \end{bmatrix}
\end{aligned}
$$

Args:
    gamma: the probability of the interaction being dissipative.
    p: the probability of the qubit and environment exchanging energy.

Raises:
    ValueError: gamma or p is not a valid probability.

## `AmplitudeDampingChannel`

```python
class AmplitudeDampingChannel(raw_types.Gate)
```

Dampen qubit amplitudes through dissipation.

This channel models the effect of energy dissipation to the
surrounding environment.  The probability of
energy exchange occurring is given by gamma.

This channel evolves a density matrix as follows:

$$
\rho \rightarrow M_0 \rho M_0^\dagger + M_1 \rho M_1^\dagger
$$

With:

$$
\begin{aligned}
M_0 =& \begin{bmatrix}
        1 & 0  \\
        0 & \sqrt{1 - \gamma}
      \end{bmatrix}
\\
M_1 =& \begin{bmatrix}
        0 & \sqrt{\gamma} \\
        0 & 0
      \end{bmatrix}
\end{aligned}
$$

### `__init__`

```python
def __init__(self, gamma: float) -> None
```

Construct an amplitude damping channel.

Args:
    gamma: the probability of the interaction being dissipative.

Raises:
    ValueError: if gamma is not a valid probability.

### `gamma`

```python
def gamma(self) -> float
```

The probability of the interaction being dissipative.

## `amplitude_damp`

```python
def amplitude_damp(gamma: float) -> AmplitudeDampingChannel
```

Returns an AmplitudeDampingChannel with the given probability gamma.

This channel evolves a density matrix via:

$$
\rho \rightarrow M_0 \rho M_0^\dagger + M_1 \rho M_1^\dagger
$$

With:

$$
\begin{aligned}
M_0 =& \begin{bmatrix}
        1 & 0  \\
        0 & \sqrt{1 - \gamma}
      \end{bmatrix}
\\
M_1 =& \begin{bmatrix}
        0 & \sqrt{\gamma} \\
        0 & 0
      \end{bmatrix}
\end{aligned}
$$

Args:
    gamma: the probability of the interaction being dissipative.

Raises:
    ValueError: if gamma is not a valid probability.

## `ResetChannel`

```python
class ResetChannel(raw_types.Gate)
```

Reset a qubit back to its |0⟩ state.

The reset channel is equivalent to performing an unobserved measurement
which then controls a bit flip onto the targeted qubit.

This channel evolves a density matrix as follows:

$$
\rho \rightarrow M_0 \rho M_0^\dagger + M_1 \rho M_1^\dagger
$$

With:

$$
\begin{aligned}
M_0 =& \begin{bmatrix}
        1 & 0  \\
        0 & 0
      \end{bmatrix}
\\
M_1 =& \begin{bmatrix}
        0 & 1 \\
        0 & 0
      \end{bmatrix}
\end{aligned}
$$

### `__init__`

```python
def __init__(self, dimension: int=2) -> None
```

Construct channel that resets to the zero state.

Args:
    dimension: Specify this argument when resetting a qudit.  There will
        be `dimension` number of dimension by dimension matrices
        describing the channel, each with a 1 at a different position in
        the top row.

### `dimension`

```python
def dimension(self) -> int
```

The dimension of the qudit being reset.

## `reset`

```python
def reset(qubit: cirq.Qid) -> raw_types.Operation
```

Returns a `cirq.ResetChannel` on the given qubit.

This can also be used with the alias `cirq.R`.

## `reset_each`

```python
def reset_each(*qubits: cirq.Qid) -> list[raw_types.Operation]
```

Returns a list of `cirq.ResetChannel` instances on the given qubits.

## `PhaseDampingChannel`

```python
class PhaseDampingChannel(raw_types.Gate)
```

Dampen qubit phase.

This channel models phase damping which is the loss of quantum
information without the loss of energy.

Construct a channel that enacts a phase damping constant gamma.

This channel evolves a density matrix via:

$$
\rho \rightarrow M_0 \rho M_0^\dagger + M_1 \rho M_1^\dagger
$$

With:

$$
\begin{aligned}
M_0 =& \begin{bmatrix}
        1 & 0 \\
        0 & \sqrt{1 - \gamma}
      \end{bmatrix}
\\
M_1 =& \begin{bmatrix}
        0 & 0 \\
        0 & \sqrt{\gamma}
      \end{bmatrix}
\end{aligned}
$$

### `__init__`

```python
def __init__(self, gamma: float) -> None
```

Construct a channel that dampens qubit phase.

Args:
    gamma: The damping constant.
Raises:
    ValueError: if gamma is not a valid probability.

### `gamma`

```python
def gamma(self) -> float
```

The damping constant.

## `phase_damp`

```python
def phase_damp(gamma: float) -> PhaseDampingChannel
```

Creates a PhaseDampingChannel with damping constant gamma.

This channel evolves a density matrix via:

$$
\rho \rightarrow M_0 \rho M_0^\dagger + M_1 \rho M_1^\dagger
$$

With:

$$
\begin{aligned}
M_0 =& \begin{bmatrix}
        1 & 0  \\
        0 & \sqrt{1 - \gamma}
      \end{bmatrix}
\\
M_1 =& \begin{bmatrix}
        0 & 0 \\
        0 & \sqrt{\gamma}
      \end{bmatrix}
\end{aligned}
$$

Args:
    gamma: The damping constant.

Raises:
    ValueError: is gamma is not a valid probability.

## `PhaseFlipChannel`

```python
class PhaseFlipChannel(raw_types.Gate)
```

Probabilistically flip the sign of the phase of a qubit.

This channel evolves a density matrix via:

$$
\rho \rightarrow M_0 \rho M_0^\dagger + M_1 \rho M_1^\dagger
$$

With:

$$
\begin{aligned}
M_0 =& \sqrt{1 - p} \begin{bmatrix}
                    1 & 0  \\
                    0 & 1
                \end{bmatrix}
\\
M_1 =& \sqrt{p} \begin{bmatrix}
                    1 & 0 \\
                    0 & -1
                \end{bmatrix}
\end{aligned}
$$

### `__init__`

```python
def __init__(self, p: float) -> None
```

Construct a channel that probabilistically flips the sign of the phase.
Args:
    p: the probability of a phase flip.

Raises:
    ValueError: if p is not a valid probability.

### `p`

```python
def p(self) -> float
```

The probability of a phase flip.

## `phase_flip`

```python
def phase_flip(p: float | None=None) -> common_gates.ZPowGate | PhaseFlipChannel
```

Returns a PhaseFlipChannel that flips a qubit's phase with probability p.

If `p` is None, return a guaranteed phase flip in the form of a Z operation.

This channel evolves a density matrix via:

$$
\rho \rightarrow M_0 \rho M_0^\dagger + M_1 \rho M_1^\dagger
$$

With:

$$
\begin{aligned}
M_0 =& \sqrt{1 - p} \begin{bmatrix}
                    1 & 0  \\
                    0 & 1
                \end{bmatrix}
\\
M_1 =& \sqrt{p} \begin{bmatrix}
                    1 & 0 \\
                    0 & -1
                \end{bmatrix}
\end{aligned}
$$

Args:
    p: the probability of a phase flip.

Raises:
    ValueError: if p is not a valid probability.

## `BitFlipChannel`

```python
class BitFlipChannel(raw_types.Gate)
```

Probabilistically flip a qubit from 1 to 0 state or vice versa.

Construct a channel that flips a qubit with probability p.

This channel evolves a density matrix via:

$$
\rho \rightarrow M_0 \rho M_0^\dagger + M_1 \rho M_1^\dagger
$$

With:

$$
\begin{aligned}
    M_0 =& \sqrt{1 - p} \begin{bmatrix}
                        1 & 0  \\
                        0 & 1
                   \end{bmatrix}
    \\
    M_1 =& \sqrt{p} \begin{bmatrix}
                        0 & 1 \\
                        1 & 0
                     \end{bmatrix}
    \end{aligned}
$$

### `__init__`

```python
def __init__(self, p: float) -> None
```

Construct a channel that probabilistically flips a qubit.

Args:
    p: the probability of a bit flip.

Raises:
    ValueError: if p is not a valid probability.

### `p`

```python
def p(self) -> float
```

The probability of a bit flip.

## `bit_flip`

```python
def bit_flip(p: float | None=None) -> common_gates.XPowGate | BitFlipChannel
```

Construct a BitFlipChannel that flips a qubit state with probability p.

If p is None, this returns a guaranteed flip in the form of an X operation.

This channel evolves a density matrix via

$$
\rho \rightarrow M_0 \rho M_0^\dagger + M_1 \rho M_1^\dagger
$$

With

$$
\begin{aligned}
M_0 =& \sqrt{1-p} \begin{bmatrix}
                    1 & 0 \\
                    0 & 1
               \end{bmatrix}
\\
M_1 =& \sqrt{p} \begin{bmatrix}
                    0 & 1 \\
                    1 & 0
                 \end{bmatrix}
\end{aligned}
$$

Args:
    p: the probability of a bit flip.

Raises:
    ValueError: if p is not a valid probability.
