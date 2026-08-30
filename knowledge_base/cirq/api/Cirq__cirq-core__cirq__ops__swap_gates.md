---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/swap_gates.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/swap_gates.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/swap_gates.py`

SWAP and ISWAP gates.

This module creates Gate instances for the following gates:
    SWAP: the swap gate.
    ISWAP: a swap gate with a phase on the swapped subspace.
    ISWAP_INV: the inverse of the ISWAP gate.
    SQRT_ISWAP: square root of the ISWAP gate.
    SQRT_ISWAP_INV: inverse square root of the ISWAP gate.

Each of these are implemented as EigenGates, which means that they can be
raised to a power (i.e. SQRT_ISWAP_INV=cirq.ISWAP**-0.5). See the definition in
EigenGate.

## `SwapPowGate`

```python
class SwapPowGate(gate_features.InterchangeableQubitsGate, eigen_gate.EigenGate)
```

The SWAP gate, possibly raised to a power. Exchanges qubits.

SwapPowGate()**t = SwapPowGate(exponent=t) and acts on two qubits in the
computational basis as the matrix:

$$
\begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & g c & -i g s & 0 \\
    0 & -i g s & g c & 0 \\
    0 & 0 & 0 & 1
\end{bmatrix}
$$

where:

$$
c = \cos\left(\frac{\pi t}{2}\right)
$$
$$
s = \sin\left(\frac{\pi t}{2}\right)
$$
$$
g = e^{\frac{i \pi t}{2}}
$$

`cirq.SWAP`, the swap gate, is an instance of this gate at exponent=1.

## `ISwapPowGate`

```python
class ISwapPowGate(gate_features.InterchangeableQubitsGate, eigen_gate.EigenGate)
```

Rotates the |01⟩ vs |10⟩ subspace of two qubits around its Bloch X-axis.

When exponent=1, swaps the two qubits and phases |01⟩ and |10⟩ by i. More
generally, this gate's matrix is defined as follows:

    ISWAP**t ≡ exp(+i π t (X⊗X + Y⊗Y) / 4)

which is given by the matrix:

$$
\begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & c & i s & 0 \\
    0 & i s & c & 0 \\
    0 & 0 & 0 & 1
\end{bmatrix}
$$

where

$$
c = \cos\left(\frac{\pi t}{2}\right)
$$
$$
s = \sin\left(\frac{\pi t}{2}\right)
$$

`cirq.ISWAP`, the swap gate that applies i to the |01⟩ and |10⟩ states,
is an instance of this gate at exponent=1.

References:
    "What is the matrix of the iSwap gate?"
    https://quantumcomputing.stackexchange.com/questions/2594/

## `riswap`

```python
def riswap(rads: value.TParamVal) -> ISwapPowGate
```

Returns gate with matrix exp(+i angle_rads (X⊗X + Y⊗Y) / 2).
