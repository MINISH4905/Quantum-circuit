---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/fourier_transform.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/fourier_transform.py
license: Apache-2.0
---

## `QuantumFourierTransformGate`

```python
class QuantumFourierTransformGate(raw_types.Gate)
```

Switches from the computational basis to the frequency basis.

This gate has the unitary

$$
\frac{1}{2^{n/2}}\sum_{x,y=0}^{2^n-1} \omega^{xy} |x\rangle\langle y|
$$

where
$$
\omega = e^{\frac{2\pi i}{2^n}}
$$

### `__init__`

```python
def __init__(self, num_qubits: int, *, without_reverse: bool=False)
```

Inits QuantumFourierTransformGate.

Args:
    num_qubits: The number of qubits the gate applies to.
    without_reverse: Whether or not to include the swaps at the end
        of the circuit decomposition that reverse the order of the
        qubits. These are technically necessary in order to perform the
        correct effect, but can almost always be optimized away by just
        performing later operations on different qubits.

## `PhaseGradientGate`

```python
class PhaseGradientGate(raw_types.Gate)
```

Phases all computational basis states proportional to the integer value of the state.

The gate `cirq.PhaseGradientGate(n, t)` has the unitary
$$
\sum_{x=0}^{2^n-1} \omega^x |x\rangle \langle x|
$$
where
$$
\omega=e^{2 \pi i/2^n}
$$

This gate makes up a portion of the quantum fourier transform.

## `qft`

```python
def qft(*qubits: cirq.Qid, without_reverse: bool=False, inverse: bool=False) -> cirq.Operation
```

The quantum Fourier transform.

Transforms a qubit register from the computational basis to the frequency
basis.

The inverse quantum Fourier transform is `cirq.qft(*qubits)**-1` or
equivalently `cirq.inverse(cirq.qft(*qubits))`.

Args:
    *qubits: The qubits to apply the qft to.
    without_reverse: When set, swap gates at the end of the qft are omitted.
        This reverses the qubit order relative to the standard qft effect,
        but makes the gate cheaper to apply.
    inverse: If set, the inverse qft is performed instead of the qft.
        Equivalent to calling `cirq.inverse` on the result, or raising it
        to the -1.

Returns:
    A `cirq.Operation` applying the qft to the given qubits.
