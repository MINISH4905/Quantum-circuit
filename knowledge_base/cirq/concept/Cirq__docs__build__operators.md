---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/build/operators.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/build/operators.ipynb
license: Apache-2.0
---

##### Copyright 2020 The Cirq Developers

```python
# @title Licensed under the Apache License, Version 2.0 (the "License");
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

# Operators and observables

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/build/operators"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/build/operators.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/build/operators.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/build/operators.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

```python
try:
    import cirq
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    print("installed cirq.")
    import cirq

import numpy as np
import sympy.parsing.sympy_parser as sympy_parser
```

This guide is directed at those already familiar with quantum operations (operators) and observables who want to know how to use them in Cirq. The following table shows an overview of operators.

| Operator | Cirq representation | Guides | Examples | 
|-----|-------|--------|-----|
| Unitary operators | Any class implementing the `_unitary_` and `_has_unitary_` protocol | [Protocols](protocols.ipynb), [Gates and operations](gates.ipynb), [Custom gates](custom_gates.ipynb) | `cirq.Gate` <br> `cirq.X(qubit)` <br> `cirq.CNOT(q0, q1)` <br> `cirq.MatrixGate.on(qubit)` <br> `cirq.Circuit` (if it only contains unitary operations)  |
| Measurements | `cirq.measure` and `cirq.MeasurementGate`  | [Gates and operations](gates.ipynb) | `cirq.measure(cirq.LineQubit(0))` |  
| Quantum channels | <ul> <li>Kraus operators (any class implementing the `_kraus_` and `_has_kraus_` protocol)</li><li>Unitary mixtures (any class implementing the `_mixture_` and `_has_mixture_` protocol)</li> </ul> | [Protocols](protocols.ipynb) | `cirq.DepolarizingChannel(p=0.2)(q0)` <br> `cirq.X.with_probability(0.5)`|

Cirq also supports observables on qubits that can be used to calculate expectation values on a given state.

* You can use `cirq.PauliString` to express them,
* Or you can use `cirq.PauliSum` with real coefficients.

## Operators

Quantum operations (or just *operators*) include unitary gates, measurements, and noisy channels. Operators that act on a given set of qubits implement `cirq.Operation` which supports the Kraus operator representation

$$
\rho \mapsto \sum_{k} A_k \rho A_k^\dagger .
$$

Here, $\sum_{k} A_k^\dagger A_k = I$ and $\rho$ is a quantum state. Operators are defined in the `cirq.ops` module.

### Unitary operators

Standard unitary operators used in quantum information can be found in `cirq.ops`, for example Pauli-$X$ as shown below.

```python
qubit = cirq.LineQubit(0)
unitary_operation = cirq.ops.X.on(qubit)  # cirq.X can also be used for cirq.ops.X
print(unitary_operation)
```

Cirq makes a distinction between gates (independent of qubits) and operations (gates acting on qubits). Thus `cirq.X` is a gate where `cirq.X.on(qubit)` is an operation. See the [guide on gates](gates.ipynb) for more details and additional common unitaries defined in Cirq.

> **Note**: The method `cirq.X.on_each` is a utility to apply `cirq.X` to multiple qubits. Similarly for other operations.

Every `cirq.Operation` supports the `cirq.channel` protocol which returns its Kraus operators. (Read more about [protocols](protocols.ipynb) in Cirq.)

```python
kraus_ops = cirq.kraus(unitary_operation)
print(f"Kraus operators of {unitary_operation.gate} are:", *kraus_ops, sep="\n")
```

Unitary operators also support the `cirq.unitary` protocol.

```python
unitary = cirq.unitary(cirq.ops.X)
print(f"Unitary of {unitary_operation.gate} is:\n", unitary)
```

Unitary gates can be raised to powers, for example to implement a $\sqrt{X}$ operation.

```python
sqrt_not = cirq.X ** (1 / 2)
print(cirq.unitary(sqrt_not))
```

Any gate can be controlled via `cirq.ControlledGate` as follows.

```python
controlled_hadamard = cirq.ControlledGate(sub_gate=cirq.H, num_controls=1)
print(cirq.unitary(controlled_hadamard).round(3))
```

Custom gates can be defined as described in [this guide](custom_gates.ipynb). Some common subroutines which consist of several operations are pre-defined - e.g., `cirq.qft` returns the operations to implement the quantum Fourier transform.

### Measurements

Cirq supports measurements in the computational basis.

```python
measurement = cirq.MeasurementGate(num_qubits=1, key="key")
print("Measurement:", measurement)
```

The `key` can be used to identify results of measurements when [simulating circuits](../simulate/simulation.ipynb). A measurement gate acting on a qubit forms an operation.

```python
measurement_operation = measurement.on(qubit)
print(measurement_operation)
```

> **Note**: The function `cirq.measure` is a utility to measure a single qubit, and the function `cirq.measure_each` is a utility to measure multiple qubits.

Again measurement operations implement `cirq.Operation` so the `cirq.channel` protocol can be used to get the Kraus operators.

```python
kraus_ops = cirq.kraus(measurement)
print(f"Kraus operators of {measurement} are:", *kraus_ops, sep="\n\n")
```

The functions `cirq.measure_state_vector` and `cirq.measure_density_matrix` can be used to perform computational basis measurements on state vectors and density matrices, respectively, represented by NumPy arrays.

```python
psi = np.ones(shape=(2,)) / np.sqrt(2)
print("Wavefunction:\n", psi.round(3))
```

```python
results, psi_prime = cirq.measure_state_vector(psi, indices=[0])

print("Measured:", results[0])
print("Resultant state:\n", psi_prime)
```

```python
rho = np.ones(shape=(2, 2)) / 2.0
print("State:\n", rho)
```

```python
measurements, rho_prime = cirq.measure_density_matrix(rho, indices=[0])

print("Measured:", measurements[0])
print("Resultant state:\n", rho_prime)
```

These functions do not modify the input state (`psi` or `rho`) unless the optional argument `out` is provided as the input state.

### Noisy channels

Like common unitary gates, Cirq defines many common noisy channels, for example the depolarizing channel below.

```python
depo_channel = cirq.DepolarizingChannel(p=0.01, n_qubits=1)
print(depo_channel)
```

Just like unitary gates and measurements, noisy channels implement `cirq.Operation`, and we can always use `cirq.channel` to get the Kraus operators.

```python
kraus_ops = cirq.kraus(depo_channel)
print(f"Kraus operators of {depo_channel} are:", *[op.round(2) for op in kraus_ops], sep="\n\n")
```

Some channels can be written

$$
\rho \mapsto \sum_k p_k U_k \rho U_k ^\dagger
$$

where real numbers $p_k$ form a probability distribution and $U_k$ are unitary. Such a *probabilistic mixture* of unitaries supports the `cirq.mixture` protocol which returns $p_k$ and $U_k$. An example is shown below for the bit-flip channel $\rho \mapsto (1 - p) \rho + p X \rho X$.

```python
bit_flip = cirq.bit_flip(p=0.05)
probs, unitaries = cirq.mixture(bit_flip)

for prob, unitary in cirq.mixture(bit_flip):
    print(f"With probability {prob}, apply \n{unitary}\n")
```

> **Note**: Any unitary gate/operation supports `cirq.mixture` because it can be interpreted as applying a single unitary with probability one.

Custom noisy channels can be defined as described in [this guide](../simulate/noisy_simulation.ipynb).

### In circuits

Any `cirq.Operation` (pre-defined or user-defined) can be placed in a `cirq.Circuit`. An example with a unitary, noisy channel, and measurement is shown below.

```python
circuit = cirq.Circuit(cirq.H(qubit), cirq.depolarize(p=0.01).on(qubit), cirq.measure(qubit))
print(circuit)
```

The general input to the circuit constructor is a `cirq.OP_TREE`, i.e., an operation or nested collection of operations. Circuits can be manipulated as described in the [circuits guide](circuits.ipynb) and simulated as described in the [simulation guide](../simulate/simulation.ipynb).

### Alternate representations

In addition to the above representations for operators. Cirq also supports some more non-standard representations as well. To convert a set of kraus operators to a choi representation you can do:

```python
depo_channel = cirq.DepolarizingChannel(p=0.01, n_qubits=1)
kraus_rep = cirq.kraus(depo_channel)
print(kraus_rep)
```

```python
choi_rep = cirq.kraus_to_choi(kraus_rep)
print(choi_rep)
```

And to get the superoperator representation you can do:

```python
super_rep = cirq.kraus_to_superoperator(kraus_rep)
print(super_rep)
```
