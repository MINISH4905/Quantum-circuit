---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/simulate/noisy_simulation.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/simulate/noisy_simulation.ipynb
license: Apache-2.0
---

##### Copyright 2022 The Cirq Developers

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

# Noisy Simulation

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/simulate/noisy_simulation"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/simulate/noisy_simulation.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/simulate/noisy_simulation.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/simulate/noisy_simulation.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

```python
try:
    import cirq
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    print("installed cirq.")
```

For simulation, it is useful to have `Gate` objects that enact noisy quantum evolution. Cirq supports modeling noise via *operator sum* representations of noise (these evolutions are also known as quantum operations or quantum dynamical maps). 

This formalism models evolution of the density matrix $\rho$ via

$$
\rho \rightarrow \sum_{k = 1}^{m} A_k \rho A_k^\dagger
$$

where $A_k$ are known as *Kraus operators*. These operators are not necessarily unitary but must satisfy the trace-preserving property

$$
\sum_k A_k^\dagger A_k = I .
$$

A channel with $m = 1$ unitary Kraus operator is called *coherent* (and is equivalent to a unitary gate operation), otherwise the channel is called *incoherent*. For a given noisy channel, Kraus operators are not necessarily unique. For more details on these operators, see [John Preskill's lecture notes](http://theory.caltech.edu/~preskill/ph219/chap3_15.pdf).

## Common channels

Cirq defines many commonly used quantum channels in [`ops/common_channels.py`](https://github.com/quantumlib/Cirq/blob/main/cirq-core/cirq/ops/common_channels.py). For example, the single-qubit bit-flip channel

$$
\rho \rightarrow (1 - p) \rho + p X \rho X
$$

with parameter $p = 0.1$ can be created as follows.

```python
import cirq

"""Get a single-qubit bit-flip channel."""
bit_flip = cirq.bit_flip(p=0.1)
```

To see the Kraus operators of a channel, the `cirq.kraus` protocol can be used. (See the [protocols guide](../build/protocols.ipynb).)

```python
for i, kraus in enumerate(cirq.kraus(bit_flip)):
    print(f"Kraus operator {i + 1} is:\n", kraus, end="\n\n")
```

As mentioned, all channels are subclasses of `cirq.Gate`s. As such, they can act on qubits and be used in circuits in the same manner as gates.

```python
"""Example of using channels in a circuit."""

# See the number of qubits a channel acts on.
nqubits = bit_flip.num_qubits()
print(f"Bit flip channel acts on {nqubits} qubit(s).\n")

# Apply the channel to each qubit in a circuit.
circuit = cirq.Circuit(bit_flip.on_each(cirq.LineQubit.range(3)))
print(circuit)
```

Channels can even be controlled.

```python
"""Example of controlling a channel."""

# Get the controlled channel.
controlled_bit_flip = bit_flip.controlled(num_controls=1)

# Use it in a circuit.
circuit = cirq.Circuit(controlled_bit_flip(*cirq.LineQubit.range(2)))
print(circuit)
```

In addition to the bit-flip channel, other common channels predefined in Cirq are shown below. Definitions of these channels can be found in their docstrings - e.g., `help(cirq.depolarize)`.

* `cirq.phase_flip`
* `cirq.phase_damp`
* `cirq.amplitude_damp`
* `cirq.depolarize`
* `cirq.asymmetric_depolarize`
* `cirq.reset`

For example, the asymmetric depolarizing channel is defined by

$$
\rho \rightarrow (1-p_x-p_y-p_z) \rho + p_x X \rho X + p_y Y \rho Y + p_z Z \rho Z
$$

and can be instantiated as follows.

```python
"""Get an asymmetric depolarizing channel."""

depo = cirq.asymmetric_depolarize(p_x=0.10, p_y=0.05, p_z=0.15)

circuit = cirq.Circuit(depo(cirq.LineQubit(0)))
print(circuit)
```

## The `kraus` and `mixture` protocols

We have seen the `cirq.kraus` protocol which returns the Kraus operators of a channel. Some channels have the interpretation of randomly applying a single unitary Kraus operator $U_k$ with probability $p_k$, namely

$$
\rho \rightarrow \sum_k p_k U_k \rho U_k^\dagger {\rm ~where~} \sum_k p_k =1 {\rm ~and~ U_k U_k^\dagger= I}.
$$

For example, the bit-flip channel from above

$$
\rho \rightarrow (1 - p) \rho + p X \rho X
$$

can be interpreted as doing nothing (applying identity) with probability $1 - p$ and flipping the bit (applying $X$) with probability $p$. Channels with these interpretations support the `cirq.mixture` protocol. This protocol returns the probabilities and unitary Kraus operators of the channel.

```python
"""Example of using the mixture protocol."""

for prob, kraus in cirq.mixture(bit_flip):
    print(f"With probability {prob}, apply\n", kraus, end="\n\n")
```

Channels that do not have this interpretation do not support the `cirq.mixture` protocol. Such channels apply Kraus operators with probabilities that depend on the state $\rho$. 

An example of a channel which does not support the mixture protocol is the amplitude damping channel with parameter $\gamma$ defined by Kraus operators

$$
M_0 = \begin{bmatrix} 1 & 0  \cr 0 & \sqrt{1 - \gamma} \end{bmatrix} 
\text{and }
M_1 = \begin{bmatrix} 0 & \sqrt{\gamma} \cr 0 & 0 \end{bmatrix} .
$$

```python
"""The amplitude damping channel is an example of a channel without a mixture."""

channel = cirq.amplitude_damp(0.1)

if cirq.has_mixture(channel):
    print(f"Channel {channel} has a _mixture_ or _unitary_ method.")
else:
    print(f"Channel {channel} does not have a _mixture_ or _unitary_ method.")
```

To summarize:

* Every `Gate` in Cirq supports the `cirq.kraus` protocol.
  - If magic method `_kraus_` is not defined, `cirq.kraus` looks for `_mixture_` then for `_unitary_`.
* A subset of channels which support `cirq.kraus` also support the `cirq.mixture` protocol.
  - If magic method `_mixture_` is not defined, `cirq.mixture` looks for `_unitary_`.
* A subset of channels which support `cirq.mixture` also support the `cirq.unitary` protocol.

For concrete examples, consider `cirq.X`, `cirq.BitFlipChannel`, and `cirq.AmplitudeDampingChannel` which are all subclasses of `cirq.Gate`.

* `cirq.X` defines the `_unitary_` method. 
  - As a result, it supports the `cirq.unitary` protocol, the `cirq.mixture` protocol, and the `cirq.kraus` protocol.
* `cirq.BitFlipChannel` defines the `_mixture_` method but not the `_unitary_` method.
  - As a result, it only supports the `cirq.mixture` protocol and the `cirq.kraus` protocol.
* `cirq.AmplitudeDampingChannel` defines the `_kraus_` method, but not the `_mixture_` method or the `_unitary_` method.
  - As a result, it only supports the `cirq.kraus` protocol.

## Custom channels

There are two configurable channel types for channels not defined in `cirq.ops.common_channels`: `MixedUnitaryChannel` and `KrausChannel`.

`MixedUnitaryChannel` takes a list of `(probability, unitary)` tuples and uses it to define the `_mixture_` method.

`KrausChannel` takes a list of Kraus operators and uses it to define the `_channel` method.

Both types also accept a measurement key as an optional parameter. This key will be used to store the index of the selected unitary or Kraus operator in the measurement results.

An example of each type is shown below.

```python
import numpy as np

q0 = cirq.LineQubit(0)
# This is equivalent to a bit-flip error with probability 0.1.
mix = [
    (0.9, np.array([[1, 0], [0, 1]], dtype=np.complex64)),
    (0.1, np.array([[0, 1], [1, 0]], dtype=np.complex64)),
]
bit_flip_mix = cirq.MixedUnitaryChannel(mix)

# This is equivalent to an X-basis measurement.
ops = [np.array([[1, 1], [1, 1]]) * 0.5, np.array([[1, -1], [-1, 1]]) * 0.5]
x_meas = cirq.KrausChannel(ops, key='x')

# These circuits have the same behavior.
circuit = cirq.Circuit(bit_flip_mix.on(q0), cirq.H(q0), x_meas.on(q0))
equiv_circuit = cirq.Circuit(
    cirq.bit_flip(0.1).on(q0),
    cirq.H(q0),
    # Measure in x-basis
    cirq.H(q0),
    cirq.measure(q0, key='x'),
    cirq.H(q0),
)
```

Alternatively, users can define their own channel types. Defining custom channels is similar to defining [custom gates](../build/custom_gates.ipynb).

A minimal example for defining the channel

$$
\rho \mapsto (1 - p) \rho + p Y \rho Y
$$

is shown below.

```python
"""Minimal example of defining a custom channel."""


class BitAndPhaseFlipChannel(cirq.Gate):
    def _num_qubits_(self) -> int:
        return 1

    def __init__(self, p: float) -> None:
        self._p = p

    def _mixture_(self):
        ps = [1.0 - self._p, self._p]
        ops = [cirq.unitary(cirq.I), cirq.unitary(cirq.Y)]
        return tuple(zip(ps, ops))

    def _has_mixture_(self) -> bool:
        return True

    def _circuit_diagram_info_(self, args) -> str:
        return f"BitAndPhaseFlip({self._p})"
```

Note: The `_has_mixture_` magic method is not strictly required but is recommended.

We can now instantiate this channel and get its mixture:

```python
"""Custom channels can be used like any other channels."""

bit_phase_flip = BitAndPhaseFlipChannel(p=0.05)

for prob, kraus in cirq.mixture(bit_phase_flip):
    print(f"With probability {prob}, apply\n", kraus, end="\n\n")
```

Note: Since `_mixture_` is defined, the `cirq.kraus` protocol can also be used.

The custom channel can be used in a circuit just like other predefined channels.

```python
"""Example of using a custom channel in a circuit."""

circuit = cirq.Circuit(bit_phase_flip.on_each(*cirq.LineQubit.range(3)))
circuit
```

Note: If a custom channel does not have a mixture, it should instead define the `_kraus_` magic method to return a sequence of Kraus operators (as `numpy.ndarray`s). Defining a `_has_kraus_` method which returns `True` is optional but recommended.

This method of defining custom channels is the most general, but simple channels such as the custom `BitAndPhaseFlipChannel` can also be created directly from a `Gate` with the convenient `Gate.with_probability` method.

```python
"""Create a channel with Gate.with_probability."""

channel = cirq.Y.with_probability(probability=0.05)
```

This produces the same mixture as the custom `BitAndPhaseFlip` channel above.

```python
for prob, kraus in cirq.mixture(channel):
    print(f"With probability {prob}, apply\n", kraus, end="\n\n")
```

Note that the order of Kraus operators is reversed from above, but this of course does not affect the action of the channel.

## Simulating noisy circuits

### Density matrix simulation

The `cirq.DensityMatrixSimulator` can simulate any noisy circuit (i.e., can apply any quantum channel) because it stores the full density matrix $\rho$. This simulation strategy updates the state $\rho$ by directly applying the Kraus operators of each quantum channel.

```python
"""Simulating a circuit with the density matrix simulator."""

# Get a circuit.
qbit = cirq.GridQubit(0, 0)
circuit = cirq.Circuit(cirq.X(qbit), cirq.amplitude_damp(0.1).on(qbit))

# Display it.
print("Simulating circuit:")
print(circuit)

# Simulate with the density matrix simulator.
dsim = cirq.DensityMatrixSimulator()
rho = dsim.simulate(circuit).final_density_matrix

# Display the final density matrix.
print("\nFinal density matrix:")
print(rho)
```

Note that the density matrix simulator supports the `run` method which only gives access to measurements as well as the `simulate` method (used above) which gives access to the full density matrix.

### Monte Carlo wavefunction simulation

Noisy circuits with arbitrary channels can also be simulated with the `cirq.Simulator`. When simulating such a channel, a single Kraus operator is randomly sampled (according to the probability distribution) and applied to the wavefunction. This method is known as "Monte Carlo (wavefunction) simulation" or "quantum trajectories."

Note: For channels which do not support the `cirq.mixture` protocol, the probability of applying each Kraus operator depends on the state. In contrast, for channels which do support the `cirq.mixture` protocol, the probability of applying each Kraus operator is independent of the state.

```python
"""Simulating a noisy circuit via Monte Carlo simulation."""

# Get a circuit.
qbit = cirq.NamedQubit("Q")
circuit = cirq.Circuit(cirq.bit_flip(p=0.5).on(qbit))

# Display it.
print("Simulating circuit:")
print(circuit)

# Simulate with the cirq.Simulator.
sim = cirq.Simulator()
psi = sim.simulate(circuit).dirac_notation()

# Display the final wavefunction.
print("\nFinal wavefunction:")
print(psi)
```

To see that the output is stochastic, you can run the cell above multiple times. Since $p = 0.5$ in the bit-flip channel, you should get $|0\rangle$ roughly half the time and $|1\rangle$ roughly half the time. The `run` method with many repetitions can also be used to see this behavior.

```python
"""Example of Monte Carlo wavefunction simulation with the `run` method."""

circuit = cirq.Circuit(cirq.bit_flip(p=0.5).on(qbit), cirq.measure(qbit))
res = sim.run(circuit, repetitions=100)
print(res.histogram(key=qbit))
```

## Adding noise to circuits

Often circuits are defined with just unitary operations, but we want to simulate them with noise. There are several methods for inserting noise in Cirq.

For any circuit, the `with_noise` method can be called to insert a channel after every moment.

```python
"""One method to insert noise in a circuit."""

# Define some noiseless circuit.
circuit = cirq.testing.random_circuit(qubits=3, n_moments=3, op_density=1, random_state=11)

# Display the noiseless circuit.
print("Circuit without noise:")
print(circuit)

# Add noise to the circuit.
noisy = circuit.with_noise(cirq.depolarize(p=0.01))

# Display it.
print("\nCircuit with noise:")
print(noisy)
```

This circuit can then be simulated using the methods described above.

The `with_noise` method creates a `cirq.NoiseModel` from its input and adds noise to each moment. A `cirq.NoiseModel` can be explicitly created and used to add noise to a single operation, single moment, or series of moments as follows.

```python
"""Add noise to an operation, moment, or sequence of moments."""

# Create a noise model.
noise_model = cirq.NoiseModel.from_noise_model_like(cirq.depolarize(p=0.01))

# Get a qubit register.
qreg = cirq.LineQubit.range(2)

# Add noise to an operation.
op = cirq.CNOT(*qreg)
noisy_op = noise_model.noisy_operation(op)

# Add noise to a moment.
moment = cirq.Moment(cirq.H.on_each(qreg))
noisy_moment = noise_model.noisy_moment(moment, system_qubits=qreg)

# Add noise to a sequence of moments.
circuit = cirq.Circuit(cirq.H(qreg[0]), cirq.CNOT(*qreg))
noisy_circuit = noise_model.noisy_moments(circuit, system_qubits=qreg)
```

Note: In the last two examples, the argument `system_qubits` can be a subset of the qubits in the moment(s).

The output of each "noisy method" is a `cirq.OP_TREE` which can be converted to a circuit by passing it into the `cirq.Circuit` constructor. For example, we create a circuit from the `noisy_moment` below.

```python
"""Creating a circuit from a noisy cirq.OP_TREE."""

cirq.Circuit(noisy_moment)
```

Another technique is to directly pass a `cirq.NoiseModel`, or a value that can be trivially converted into one, to the density matrix simulator as shown below.

```python
"""Define a density matrix simulator with a `cirq.NOISE_MODEL_LIKE` object."""

noisy_dsim = cirq.DensityMatrixSimulator(noise=cirq.generalized_amplitude_damp(p=0.1, gamma=0.5))
```

This will not explicitly add channels to the circuit being simulated, but the circuit will be simulated as though these channels were present.

Other than these general methods, channels can be added to circuits at any moment just as gates are. The channels can be different, be correlated, act on a subset of qubits, be custom defined, etc.

```python
"""Defining a circuit with multiple noisy channels."""

qreg = cirq.LineQubit.range(4)
circ = cirq.Circuit(
    cirq.H.on_each(qreg),
    cirq.depolarize(p=0.01).on_each(qreg),
    cirq.qft(*qreg),
    bit_phase_flip.on_each(qreg[1::2]),
    cirq.qft(*qreg, inverse=True),
    cirq.reset(qreg[1]),
    cirq.measure(*qreg),
    cirq.bit_flip(p=0.07).controlled(1).on(*qreg[2:]),
)

print("Circuit with multiple channels:\n")
print(circ)
```

Circuits can also be modified with standard methods like `insert` to add channels at any point in the circuit. For example, to model simple state preparation errors, one can add bit-flip channels to the start of the circuit as follows.

```python
"""Example of inserting channels in circuits."""

circ.insert(0, cirq.bit_flip(p=0.1).on_each(qreg))
print(circ)
```

### Simulation with realistic noise

Cirq also provides a couple `NoiseModel`s which are designed to mimic the noise behavior seen on Google quantum hardware devices. As of July 19, 2022, models that mimic the Rainbow or Weber Google quantum processors are publicly available in Cirq. You can instantiate these noise models as follows:

```python
import cirq_google

# See cirq_google.engine.list_virtual_processors() for available processor names
processor_id = "willow_pink"  # or "rainbow" or "weber"
# Load the noise properties for the processor
noise_props = cirq_google.engine.load_device_noise_properties(processor_id)
# Build a noise model from the noise properties
noise_model = cirq_google.NoiseModelFromGoogleNoiseProperties(noise_props)
```

While this `NoiseModel` can be used anywhere other noise models could be used, it is particularly useful in a [Quantum Virtual Machine](./quantum_virtual_machine.ipynb). A QVM combines a realistic noise model and a [Device](../hardware/devices.ipynb) object together and places them behind a `cirq.Engine`-style interface so that you can run circuits almost identically to how you would with a hardware device, and get results that approximate those a hardware device would produce.
