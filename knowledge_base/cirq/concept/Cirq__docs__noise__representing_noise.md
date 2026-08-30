---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/noise/representing_noise.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/noise/representing_noise.ipynb
license: Apache-2.0
---

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

# Representing noise

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/noise/representing_noise"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/noise/representing_noise.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/noise/representing_noise.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/noise/representing_noise.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
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
```

This doc assumes you have already read the [noisy simulation](../simulate/noisy_simulation.ipynb) tutorial.

Cirq provides several built-in tools for representing noise at multiple levels:
- Channels, to insert as individual noisy operators
- `cirq.NoiseModel`s, for applying noise to entire circuits
- `cirq.MeasurementGate` parameters, for changing measurements results

This doc describes these options and the types of real-world noise they can be used to represent.

## Channels

Errors in hardware can be broadly separated into two categories: _coherent_ and _incoherent_.

**Coherent** errors apply a reversible (but unknown) transformation, such as making every $Z$ gate instead behave as $Z^{1.01}$. This can be represented by inserting [gates](../build/gates.ipynb) into the intended circuit.

**Incoherent** errors cause [decoherence](https://en.wikipedia.org/wiki/Quantum_decoherence#Non-unitary_modelling_examples) of the quantum state, and are irreversible as a result. This is equivalent to applying an operation with some probability $0 < P < 1$, and can be represented with Cirq "channels". [`ops/common_channels.py`](https://github.com/quantumlib/Cirq/blob/main/cirq-core/cirq/ops/common_channels.py) defines channels for some of the most common incoherent errors, which are described below.

### Bit flip

`cirq.BitFlipChannel` (or `cirq.bit_flip`) is equivalent to applying `cirq.X` with a given probability. This channel is best used to represent state-agnostic bit flip errors in the body of a circuit.

```python
q0 = cirq.LineQubit(0)
circuit = cirq.Circuit(cirq.bit_flip(p=0.2).on(q0), cirq.measure(q0, key='result'))
result = cirq.Simulator(seed=0).run(circuit, repetitions=1000)
print(result.histogram(key='result'))
```

For bit flips which depend on the qubit state, see [Amplitude damping](#amplitude-damping).

For measurement error that doesn't affect the quantum state, see [Invert mask](#invert-mask).

### Amplitude damping

`cirq.AmplitudeDampingChannel` (or `cirq.amplitude_damp`) performs a $|1\rangle \rightarrow |0\rangle$ transformation with some probability `gamma`, leaving the existing $|0\rangle$ state alone. This channel is best used to represent an idealized form of energy dissipation, where qubits decay from $|1\rangle$ to $|0\rangle$.

```python
q0 = cirq.LineQubit(0)
circuit = cirq.Circuit(
    cirq.X(q0), cirq.amplitude_damp(gamma=0.2).on(q0), cirq.measure(q0, key='result')
)
result = cirq.Simulator(seed=0).run(circuit, repetitions=1000)
print(result.histogram(key='result'))
```

For state-agnostic bit flips, see [Bit flip](#bit-flip).

### Generalized amplitude damping

`cirq.GeneralizedAmplitudeDampingChannel` (or `cirq.generalized_amplitude_damp`) is a generalized version of `AmplitudeDampingChannel`. It represent a more realistic bidirectional energy dissipation, in which qubits experience not only decay but also spontaneous excitation. In this channel, `gamma` represents the probability of energy transfer (excitation OR decay) and a new parameter `p` gives the probability that the environment is excited.

This is equivalent to excitation with probability `(1-p) * gamma` and decay with probability `p * gamma`.

```python
q0, q1 = cirq.LineQubit.range(2)
circuit = cirq.Circuit(
    cirq.X(q1),
    cirq.generalized_amplitude_damp(gamma=0.2, p=0.2).on_each(q0, q1),
    cirq.measure(q0, key='result_0'),
    cirq.measure(q1, key='result_1'),
)
result = cirq.Simulator(seed=0).run(circuit, repetitions=1000)
print("Starting in |0):", result.histogram(key='result_0'))
print("Starting in |1):", result.histogram(key='result_1'))
```

### Phase flip or damping

`cirq.PhaseFlipChannel` (or `cirq.phase_flip`) is equivalent to applying `cirq.Z` with a given probability `p`. This channel is best used to represent state-agnostic phase flip errors in the body of a circuit.

```python
q0 = cirq.LineQubit(0)
circuit = cirq.Circuit(
    cirq.H(q0), cirq.phase_flip(p=0.2).on(q0), cirq.H(q0), cirq.measure(q0, key='result')
)
result = cirq.Simulator(seed=0).run(circuit, repetitions=1000)
print("Phase flip:", result.histogram(key='result'))
```

`cirq.PhaseDampingChannel` (or `cirq.phase_damp`) is a different way of expressing the same behavior: for any given value of `p`, `PhaseFlipChannel(p=p)` is equivalent to `PhaseDampingChannel(gamma=(1-(2*p-1)**2))`.

```python
q0 = cirq.LineQubit(0)
# Convert p=0.2 to gamma
p = 0.2
gamma = 1 - (2 * p - 1) ** 2
print(f"{gamma=}")
circuit = cirq.Circuit(
    cirq.H(q0), cirq.phase_damp(gamma=gamma).on(q0), cirq.H(q0), cirq.measure(q0, key='result')
)
result = cirq.Simulator(seed=0).run(circuit, repetitions=1000)
print("Phase damp:", result.histogram(key='result'))
```

Note that the results differ despite the same seed and equivalent circuits. This is due to the channels having different operators, which interact differently with Cirq's RNG.

### Depolarization

`cirq.DepolarizingChannel` (or `cirq.depolarize`) is equivalent to applying a randomly-selected Pauli operator to the target qubits. The identity is applied with probability `1-p`; all other Pauli operators have an equal probability `p / (4**n-1)` of being selected. This channel is best used for representing uniformly-distributed decoherence of the target qubit(s) across all Pauli channels.

```python
q0, q1, q2 = cirq.LineQubit.range(3)
circuit = cirq.Circuit(
    cirq.H(q0),  # initialize X basis
    cirq.H(q1),  # initialize Y basis
    cirq.S(q1),
    cirq.depolarize(p=0.2).on_each(q0, q1, q2),
    cirq.H(q0),  # return to Z-basis
    cirq.S(q1) ** -1,
    cirq.H(q1),
    cirq.measure(q0, key='result_0'),
    cirq.measure(q1, key='result_1'),
    cirq.measure(q2, key='result_2'),
)
result = cirq.Simulator(seed=0).run(circuit, repetitions=1000)
# All basis states are equally affected.
print("X basis:", result.histogram(key='result_0'))
print("Y basis:", result.histogram(key='result_1'))
print("Z basis:", result.histogram(key='result_2'))
```

For noise in just the X or Z channels, see [Bit flip](#bit-flip) or [Phase flip](#phase-flip-or-damping) respectively.

### Asymmetric depolarization

`cirq.AsymmetricDepolarizingChannel` (or `cirq.asymmetric_depolarize`) is a generalized version of `DepolarizingChannel` which accepts separate probabilities for X, Y, and Z error. It is best used instead of `DepolarizingChannel` when there is a known, nontrivial discrepancy between the different Pauli error modes.

```python
q0, q1, q2 = cirq.LineQubit.range(3)
asym_depol = cirq.asymmetric_depolarize(p_x=0, p_y=0.05, p_z=0.2)
circuit = cirq.Circuit(
    cirq.H(q0),  # initialize X basis
    cirq.H(q1),  # initialize Y basis
    cirq.S(q1),
    asym_depol.on_each(q0, q1, q2),
    cirq.H(q0),  # return to Z-basis
    cirq.S(q1) ** -1,
    cirq.H(q1),
    cirq.measure(q0, key='result_0'),
    cirq.measure(q1, key='result_1'),
    cirq.measure(q2, key='result_2'),
)
result = cirq.Simulator(seed=0).run(circuit, repetitions=1000)
# Basis states are only affected by error in other bases.
print("X basis:", result.histogram(key='result_0'))
print("Y basis:", result.histogram(key='result_1'))
print("Z basis:", result.histogram(key='result_2'))
```

### Reset

`cirq.Reset` forces a qubit into the $|0\rangle$ state. This is not a noise channel, but rather a hardware operation which commonly consists of measuring the qubit and applying `X` as needed to return it to the $|0\rangle$ state.

```python
q0 = cirq.LineQubit(0)
circuit = cirq.Circuit(cirq.bit_flip(p=0.2).on(q0), cirq.reset(q0), cirq.measure(q0, key='result'))
result = cirq.Simulator(seed=0).run(circuit, repetitions=1000)
print(result.histogram(key='result'))
```

### Custom channels

`cirq.MixedUnitaryChannel` (in [`ops/mixed_unitary_channel.py`](https://github.com/quantumlib/Cirq/blob/main/cirq-core/cirq/ops/mixed_unitary_channel.py)) is a customizable channel which can represent any probabilistic mixture of unitary operators. It accepts an optional measurement key to capture which operator was selected.

```python
q0 = cirq.LineQubit(0)
# equivalent to cirq.bit_flip(p=0.2)
my_channel = cirq.MixedUnitaryChannel(
    [(0.8, cirq.unitary(cirq.I)), (0.2, cirq.unitary(cirq.X))], key='op_num'
)
circuit = cirq.Circuit(my_channel.on(q0), cirq.measure(q0, key='result'))
result = cirq.Simulator(seed=0).run(circuit, repetitions=20)
# `op_num` and `result` are always equal.
print(result)
```

`cirq.KrausChannel` (in [`ops/kraus_channel.py`](https://github.com/quantumlib/Cirq/blob/main/cirq-core/cirq/ops/kraus_channel.py)) is similar, but supports non-unitary operators.

```python
import numpy as np

q0 = cirq.LineQubit(0)
# equivalent to cirq.amplitude_damp(gamma=0.2)
gamma = 0.2
my_channel = cirq.KrausChannel(
    [
        np.array([[0, np.sqrt(gamma)], [0, 0]]),  # decay |1) -> |0)
        np.array([[1, 0], [0, np.sqrt(1 - gamma)]]),  # stay in |1)
    ],
    key='op_num',
)
circuit = cirq.Circuit(cirq.X(q0), my_channel.on(q0), cirq.measure(q0, key='result'))
result = cirq.Simulator(seed=0).run(circuit, repetitions=20)
# `op_num` and `result` are always equal.
print(result)
```

In general, prefer one of the other built-in channels if your use case supports it, as those channels can occasionally be optimized in ways that do not generalize to these channels.

Prefer `MixedUnitaryChannel` if your channel has a mix-of-unitaries description, as it can be simulated more efficiently than `KrausChannel`.

## NoiseModels

Built-in `cirq.NoiseModel` types do not have a shared home like channels, but a couple of commonly-used types are listed here. For more complex experiments, it is often useful to define your own `NoiseModel` subclasses; refer to [`devices/noise_model.py`](https://github.com/quantumlib/Cirq/blob/main/cirq-core/cirq/devices/noise_model.py) to learn more.

### Constant noise

`cirq.ConstantQubitNoiseModel` (in [`devices/noise_model.py`](https://github.com/quantumlib/Cirq/blob/main/cirq-core/cirq/devices/noise_model.py)) is a simple model which will insert the given gate after every operation in the target circuit. When "trivially converting" gates to `NoiseModel`s, this is the model that is used, but it isn't particularly representative of any real-world noise.

```python
q0 = cirq.LineQubit(0)
circuit = cirq.Circuit(
    cirq.I(q0), cirq.measure(q0, key='result_0'), cirq.measure(q0, key='result_1')
)
# Applies noise after every gate, even measurements.
noisy_circuit = circuit.with_noise(cirq.X)
print(noisy_circuit)
result = cirq.Simulator(seed=0).run(noisy_circuit, repetitions=20)
print("First measure:", result.histogram(key='result_0'))
print("Second measure:", result.histogram(key='result_1'))
```

Avoid using this model except for simple tests, as different gates (particularly `cirq.MeasurementGate`) usually have different error.

### Insertion noise

`cirq.devices.InsertionNoiseModel` (in [`devices/insertion_noise_model.py`](https://github.com/quantumlib/Cirq/blob/main/cirq-core/cirq/devices/insertion_noise_model.py)) inspects the circuit for operations matching user-specified identifiers, and inserts the corresponding noise operations after matching operations. This noise model is useful for applying specific noise to specific gates - for example, adding different depolarizing error to 1- and 2-qubit gates.

```python
from cirq.devices import InsertionNoiseModel

q0 = cirq.LineQubit(0)
circuit = cirq.Circuit(cirq.I(q0), cirq.X(q0), cirq.measure(q0, key='result'))
# Apply bitflip noise after each X gate.
target_op = cirq.OpIdentifier(cirq.XPowGate, q0)
insert_op = cirq.bit_flip(p=0.2).on(q0)
noise_model = InsertionNoiseModel(
    ops_added={target_op: insert_op},
    require_physical_tag=False,  # For use outside calibration-to-noise
)
noisy_circuit = circuit.with_noise(noise_model)
print(noisy_circuit)
result = cirq.Simulator(seed=0).run(noisy_circuit, repetitions=1000)
print(result.histogram(key='result'))
```

`InsertionNoiseModel` is primarily used in the calibration-to-noise pipeline, but can be used elsewhere by setting `require_physical_tag=False`, as seen above.

## Measurement parameters

`cirq.MeasurementGate` provides parameters for error which occurs in the classical measurement step instead of in the quantum state, which can be useful for accelerating simulations.

### Invert mask

The `invert_mask` field is a simple list of booleans indicating bits to flip in the final output. This can represent simple bitflip error in measurement, or a correction for that error.

```python
q0 = cirq.LineQubit(0)
circuit = cirq.Circuit(cirq.X(q0), cirq.measure(q0, key='result', invert_mask=[True]))
result = cirq.Simulator(seed=0).run(circuit, repetitions=1000)
print(result.histogram(key='result'))
```

### Confusion map

The `confusion_map` field maps qubit tuples to confusion matrices for those qubits. The confusion matrix for two qubits is:

$$\begin{bmatrix}
Pr(00|00) & Pr(01|00) & Pr(10|00) & Pr(11|00) \\
Pr(00|01) & Pr(01|01) & Pr(10|01) & Pr(11|01) \\
Pr(00|10) & Pr(01|10) & Pr(10|10) & Pr(11|10) \\
Pr(00|11) & Pr(01|11) & Pr(10|11) & Pr(11|11)
\end{bmatrix}$$

where `Pr(ij|pq)` is the probability of observing `ij` if state `pq` was prepared; a `2**n`-square confusion matrix can be provided for any grouping of N qubits.

```python
import numpy as np

q0 = cirq.LineQubit(0)
# 10% chance to report |0) as |1), 20% chance to report |1) as |0).
cmap = {(0,): np.array([[0.9, 0.1], [0.2, 0.8]])}
circuit = cirq.Circuit(cirq.X(q0), cirq.measure(q0, key='result', confusion_map=cmap))
result = cirq.Simulator(seed=0).run(circuit, repetitions=1000)
print(result.histogram(key='result'))
```

This can be used for representing more complex errors in measurement, including probabilistic error on individual qubits and correlated error across multiple qubits.
