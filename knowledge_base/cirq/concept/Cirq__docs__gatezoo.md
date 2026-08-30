---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/gatezoo.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/gatezoo.ipynb
license: Apache-2.0
---

```python
# @title Copyright 2022 The Cirq Developers
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
```

# Gate Zoo

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/gatezoo.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/gatezoo.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/gatezoo.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/gatezoo.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

## Setup

```python
try:
    import cirq
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    print("installed cirq.")

import IPython.display as ipd
import cirq
import inspect


def display_gates(*gates):
    for gate_name in gates:
        ipd.display(ipd.Markdown("---"))
        gate = getattr(cirq, gate_name)
        ipd.display(ipd.Markdown(f"#### cirq.{gate_name}"))
        ipd.display(ipd.Markdown(inspect.cleandoc(gate.__doc__ or "")))
    else:
        ipd.display(ipd.Markdown("---"))
```

Cirq comes with many gates that are standard across quantum computing. This notebook serves as a reference sheet for these gates.

## Single Qubit Gates


### Gate Constants 

Cirq defines constants which are gate instances for particular important single qubit gates.

```python
display_gates("X", "Y", "Z", "H", "S", "T")
```

### Traditional Pauli Rotation Gates

Cirq defines traditional single qubit rotations that are rotations in radiants abougt different Pauli directions.

```python
display_gates("Rx", "Ry", "Rz")
```

### Pauli PowGates

If you think of the `cirq.Z` gate as phasing the state $|1\rangle$ by $-1$, then you might think that the square root of this gate phases the state $|1\rangle$ by $i=\sqrt{-1}$.  The `XPowGate`, `YPowGate` and `ZPowGate`s all act in this manner, phasing the state corresponding to their $-1$ eigenvalue by a prescribed amount.  This ends up being the same as the `Rx`, `Ry`, and `Rz` up to a global phase.

```python
display_gates("XPowGate", "YPowGate", "ZPowGate")
```

### More Single Qubit Gate

Many quantum computing implementations use qubits whose energy eigenstate are the computational basis states. In these cases it is often useful to move `cirq.ZPowGate`'s through other single qubit gates, "phasing" the other gates.  For these scenarios, the following phased gates are useful.

```python
display_gates("PhasedXPowGate", "PhasedXZGate", "HPowGate")
```

## Two Qubit Gates

### Gate Constants

Cirq defines convenient constants for common two qubit gates.

```python
display_gates("CX", "CZ", "SWAP", "ISWAP", "ISWAP_INV", "SQRT_ISWAP", "SQRT_ISWAP_INV")
```

### Parity Gates

If $P$ is a non-identity Pauli matrix, then it has eigenvalues $\pm 1$.  $P \otimes P$ similarly has eigenvalues $\pm 1$ which are the product of the eigenvalues of the single $P$ eigenvalues. In this sense, $P \otimes P$ has an eigenvalue which encodes the parity of the eigenvalues of the two qubits.  If you think of $P \otimes P$ as phasing its $-1$ eigenvectors by $-1$, then you could consider $(P \otimes P)^{\frac{1}{2}}$ as the gate that phases the $-1$ eigenvectors by $\sqrt{-1} =i$.  The Parity gates are exactly these gates for the three different non-identity Paulis.

```python
display_gates("XXPowGate", "YYPowGate", "ZZPowGate")
```

There are also constants that one can use to define the parity gates via exponentiating them.

```python
display_gates("XX", "YY", "ZZ")
```

### Fermionic Gates

If we think of $|1\rangle$ as an excitation, then the gates that preserve the number of excitations are the fermionic gates.  There are two implementations, with differing phase conventions.

```python
display_gates("FSimGate", "PhasedFSimGate")
```

### Two qubit PowGates

Just as `cirq.XPowGate` represents a powering of `cirq.X`, our two qubit gate constants also have corresponding "Pow" versions.

```python
display_gates("SwapPowGate", "ISwapPowGate", "CZPowGate", "CXPowGate", "PhasedISwapPowGate")
```

## Three Qubit Gates

### Gate Constants

Cirq provides constants for common three qubit gates.

```python
display_gates("CCX", "CCZ", "CSWAP")
```

### Three Qubit Pow Gates

Corresponding to some of the above gate constants are the corresponding PowGates.

```python
display_gates("CCXPowGate", "CCZPowGate")
```

## N Qubit Gates

### Do Nothing Gates

Sometimes you just want a gate to represent doing nothing.

```python
display_gates("IdentityGate", "WaitGate")
```

### Measurement Gates

Measurement gates are gates that represent a measurement and can operate on any number of qubits.

```python
display_gates("MeasurementGate")
```

### Matrix Gates

If one has a specific unitary matrix in mind, then one can construct it using matrix gates, or, if the unitary is diagonal, the diagonal gates.

```python
display_gates("MatrixGate", "DiagonalGate", "TwoQubitDiagonalGate", "ThreeQubitDiagonalGate")
```

### Pauli String Gates

Pauli strings are expressions like "XXZ" representing the Pauli operator X operating on the first two qubits, and Z on the last qubit, along with a numeric (or symbolic) coefficient. When the coefficient is a unit complex number, then this is a valid unitary gate.  Similarly one can construct gates which phases the $\pm 1$ eigenvalues of such a Pauli string.

```python
display_gates("DensePauliString", "MutableDensePauliString", "PauliStringPhasorGate")
```

### Algorithm Based Gates

It is useful to define composite gates which correspond to algorithmic primitives, i.e. one can think of the fourier transform as a single unitary gate.

```python
display_gates("BooleanHamiltonianGate", "QuantumFourierTransformGate", "PhaseGradientGate")
```

### Classiscal Permutation Gates

Sometimes you want to represent shuffling of qubits.

```python
display_gates("QubitPermutationGate")
```
