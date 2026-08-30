---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/simulate/simulation.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/simulate/simulation.ipynb
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

# Simulation

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/simulate/simulation"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/simulate/simulation.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/simulate/simulation.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/simulate/simulation.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
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

Cirq comes with built-in Python simulators for testing
small circuits. The two main types of simulations that Cirq
supports are pure state and mixed state. The pure state simulations
are supported by `cirq.Simulator` and the mixed state
simulators are supported by `cirq.DensityMatrixSimulator`.

The names *pure state simulator* and *mixed state
simulators* refer to the fact that these simulations are
for quantum circuits; including unitary, measurements, and noise
that keeps the evolution in a pure state (i.e. a single quantum state)
or a mixed state (a mix of quantum states, each with a classical
probability). Noisy evolutions are supported by the pure state
simulator, as long as they preserve the purity of the state. If you are interested in truly noisy simulation that may not preserve purity, see the [Noisy Simulation](./noisy_simulation.ipynb) page. 

Some external high-performance simulators also provide an interface
to Cirq. These can often provide results faster than Cirq's
built-in simulators, especially when working with larger circuits.
For details on these tools, see the
[external simulators section](#external-simulators).

## Introduction to pure state simulation

Here is a simple circuit:

```python
q0 = cirq.GridQubit(0, 0)
q1 = cirq.GridQubit(1, 0)


def basic_circuit(meas=True):
    sqrt_x = cirq.X**0.5
    yield sqrt_x(q0), sqrt_x(q1)
    yield cirq.CZ(q0, q1)
    yield sqrt_x(q0), sqrt_x(q1)
    if meas:
        yield cirq.measure(q0, key='q0'), cirq.measure(q1, key='q1')


circuit = cirq.Circuit()
circuit.append(basic_circuit())

print(circuit)
```

You can simulate this by creating a ``cirq.Simulator`` and
passing the circuit into its ``run`` method:

```python
simulator = cirq.Simulator()
result = simulator.run(circuit)

print(result)
```

The method `run()` returns a
[`Result`](https://github.com/quantumlib/Cirq/blob/dd1b1a4a0e26775bf94eb567591397f1f989ca55/cirq-core/cirq/study/result.py#L85).
As you can see, the object `result` contains the result of any
measurements for the simulation run.

The actual measurement results depend on the `random` seed generator (`numpy`).
You can set this seed by passing an integer or `numpy.RandomState` as the
`seed` parameter in the `Simulator` constructor.

Another run can result in a different set of measurement results:

```python
result = simulator.run(circuit)

print(result)
```

The `run()` methods (`run()` and `run_sweep()`) are designed to mimic what
running a program on a quantum computer is actually like. `result` only
contains measurement data, and the complete state vector is hidden.

### Accessing the state vector

To access the full state vector, the `simulate()` methods
(`simulate()`, `simulate_sweep()`, `simulate_moment_steps()`)
can be used instead. This behavior is only possible in
simulation, but can be useful for debugging a circuit:

```python
import numpy as np

circuit = cirq.Circuit()
circuit.append(basic_circuit(False))
result = simulator.simulate(circuit, qubit_order=[q0, q1])

print(np.around(result.final_state_vector, 3))
```

`simulate()` returns a `SimulationTrialResult` containing
the final state, as seen above. The built-in Cirq simulator returns a
[`StateVectorTrialResult`](https://github.com/quantumlib/Cirq/blob/dd1b1a4a0e26775bf94eb567591397f1f989ca55/cirq-core/cirq/sim/state_vector_simulator.py#L147)
,
which includes a number of utilities for analyzing the final state
vector.

Note that the simulator uses numpy's `float32` precision
(which is `complex64` for complex numbers) by default,
but that the simulator can take in a  `dtype` of `np.complex128`
if higher precision is needed.

### Expectation values

For applications that measure expectation values of observables,
the `simulate_expectation_values()` method provides a simple
interface for returning just the desired expectation values.
This can be more efficient than returning the entire state vector,
particularly when handling multiple results at once, or when using
an external simulator.

```python
XX_obs = cirq.X(q0) * cirq.X(q1)
ZZ_obs = cirq.Z(q0) * cirq.Z(q1)
ev_list = simulator.simulate_expectation_values(
    cirq.Circuit(basic_circuit(False)), observables=[XX_obs, ZZ_obs]
)
print(ev_list)
```

`simulate_expectation_values()` returns a list of
expectation values, one for each observable provided.

## Qubit and Amplitude Ordering

The `qubit_order` argument to the simulator's `run()` method
determines the ordering of some results, such as the
amplitudes in the final wave function. The `qubit_order` argument is optional: when it is omitted, qubits are ordered
ascending by their name (i.e., what `str(qubit)` returns).

The simplest `qubit_order` value you can provide is a list of
the qubits in the desired order. Any qubits from the circuit
that are not in the list will be ordered using the
default `str(qubit)` ordering, but come after qubits that are in
the list. Be aware that all qubits in the list are included in
the simulation, even if they are not operated on by the circuit.

The mapping from the order of the qubits to the order of the
amplitudes in the wave function can be tricky to understand.
Basically, it is the same as the ordering used by `numpy.kron`:

```python
outside = [1, 10]
inside = [1, 2]
print(np.kron(outside, inside))
```

More concretely, the `k`'th amplitude in the wave function
will correspond to the `k`'th case that would be encountered
when nesting loops over the possible values of each qubit.

The first qubit's computational basis values are looped over
in the outermost loop, the last qubit's computational basis
values are looped over in the inner-most loop, etc.:

```python
i = 0
for first in [0, 1]:
    for second in [0, 1]:
        print('amps[{}] is for first={}, second={}'.format(i, first, second))
        i += 1
```

You can check that this is in fact the ordering with a
circuit that flips one qubit out of two:

```python
q_stay = cirq.NamedQubit('q_stay')
q_flip = cirq.NamedQubit('q_flip')
c = cirq.Circuit(cirq.X(q_flip))

# first qubit in order flipped
result = simulator.simulate(c, qubit_order=[q_flip, q_stay])
print(abs(result.final_state_vector).round(3))
```

```python
# second qubit in order flipped
result = simulator.simulate(c, qubit_order=[q_stay, q_flip])
print(abs(result.final_state_vector).round(3))
```

## Stepping through a circuit

When debugging, it is useful to not just see the end
result of a circuit, but to inspect the state of the system
at different steps in the circuit.  

To support this, Cirq provides a method to return an iterator
over a `Moment` by `Moment` simulation.  This method is named `simulate_moment_steps`:

```python
circuit = cirq.Circuit()
circuit.append(basic_circuit())
for i, step in enumerate(simulator.simulate_moment_steps(circuit)):
    print('state at step %d: %s' % (i, np.around(step.state_vector(copy=True), 3)))
```

The object returned by the `moment_steps` iterator is a
`StepResult`. This object has the state along with any
measurements that occurred before or during that step.

### Alternate stepping behavior

For simulators that do not support `simulate_moment_steps`,
it is possible to replicate this behavior by splitting
the circuit into "chunks" and passing the results of each
chunk as the initial state for the next chunk:

```python
chunks = [cirq.Circuit(moment) for moment in basic_circuit()]
next_state = 0  # represents the all-zero state
for i, chunk in enumerate(chunks):
    result = simulator.simulate(chunk, initial_state=next_state)
    next_state = result.final_state_vector
    print(f'state at step {i}: {np.around(next_state, 3)}')
```

The added cost of passing state vectors around like this
is nontrivial; for this reason, this workaround should
only be used with simulators that do not support
`simulate_moment_steps`.

## Parameterized values and studies

In addition to circuit gates with fixed values, Cirq also
supports gates which can have `Symbol` values (see
[Gates](../build/gates.ipynb)). These are values that can be resolved
at runtime. 

For simulators, these values are resolved by
providing a `cirq.ParamResolver`.  A `cirq.ParamResolver` provides
a map from the `Symbol`'s name to its assigned value.

```python
import sympy

rot_w_gate = cirq.X ** sympy.Symbol('x')
circuit = cirq.Circuit()
circuit.append([rot_w_gate(q0), rot_w_gate(q1)])
print(circuit)
for y in range(5):
    resolver = cirq.ParamResolver({'x': y / 4.0})
    result = simulator.simulate(circuit, resolver)
    print(f"params:{result.params}, state vector:{np.round(result.final_state_vector, 2)}")
```

In the previous example, the symbol `x` is used in two gates, and then the resolver
provides this value at run time.

Parameterized values are most useful in defining what is called a
"sweep", which is a sequence of trials, where each
trial is a run with a particular set of parameter values.

Running a sweep returns a `Result` for each set of fixed parameter
values and repetitions.  

For instance:

```python
resolvers = [cirq.ParamResolver({'x': y / 2.0}) for y in range(3)]
circuit = cirq.Circuit()
circuit.append([rot_w_gate(q0), rot_w_gate(q1)])
circuit.append([cirq.measure(q0, key='q0'), cirq.measure(q1, key='q1')])
results = simulator.run_sweep(program=circuit, params=resolvers, repetitions=2)
for result in results:
    print(f"params:{result.params}")
    print(f"measurements:")
    print(result)
```

The previous example demonstrates that assigning different values to gate parameters yields
different results for each trial in the sweep, and that each trial is repeated
`repetitions` times.  See [Parameter Sweeps](./params.ipynb) for more information on sweeping and parameters.

## Mixed state simulations

In addition to pure state simulation, Cirq also supports
simulation of mixed states. 

Even though this simulator is not as efficient as the pure state simulators,
they allow for a larger class of noisy circuits to be run as well as keeping
track of the simulation's density matrix. This fact can allow for more exact
simulations: the density matrix can represent all possible results of a
noisy circuit, while the pure-state simulator can only sample from these
results.

Mixed state simulation is supported by the
`cirq.DensityMatrixSimulator` class.

Here is a simple example of simulating a channel using the
mixed state simulator:

```python
q = cirq.NamedQubit('a')
circuit = cirq.Circuit(cirq.H(q), cirq.amplitude_damp(0.2)(q), cirq.measure(q))
simulator = cirq.DensityMatrixSimulator()
result = simulator.run(circuit, repetitions=100)
print(result.histogram(key='a'))
```

The previous example creates a state in an equal superposition of 0 and 1, then applies amplitude damping which takes 1 to 0 with something like a probability of 0.2. 

You can see that, instead of about 50 percent of the timing being in 0, about 20 percent of the 1 has been converted into 0, so you end up with total around 60 percent in the 0 state.

Like the pure state simulators, the mixed state simulator supports `run()` and `run_sweeps()` methods. 

The `cirq.DensityMatrixSimulator` also supports getting access to the density matrix of the circuit at the end of simulating the circuit, or when stepping through the circuit.  These are done by the `simulate()` and `simulate_sweep()` methods, or, for stepping through the circuit, via the `simulate_moment_steps` method. For example, you can simulate creating an equal superposition followed by an amplitude damping channel with a gamma of 0.2 by:

```python
q = cirq.NamedQubit('a')
circuit = cirq.Circuit(cirq.H(q), cirq.amplitude_damp(0.2)(q))
simulator = cirq.DensityMatrixSimulator()
result = simulator.simulate(circuit)
print(np.around(result.final_density_matrix, 3))
```

Note: The density matrix at the end of the simulation is accessible via `final_density_matrix`.

## External simulators

There are a few high-performance circuit simulators which
provide an interface for simulating Cirq `Circuit`s.
These projects are listed below, along with their PyPI package
name and a description of simulator methods that they support.

For most users we recommend [qsim](https://github.com/quantumlib/qsim),
but each simulator is optimized for specific use cases. Before choosing
a simulator, make sure it supports the behavior that you need!

| Project name | PyPI package | Description |
| --- | --- | --- |
| [qsim](https://github.com/quantumlib/qsim) | qsimcirq | Implements `cirq.SimulatesAmplitudes`, `cirq.SimulatesFinalState`, and `cirq.SimulatesExpectationValues`. Recommended for deep circuits with up to 30 qubits (consumes 8GB RAM). Larger circuits are possible, but RAM usage doubles with each additional qubit. |
| [qsimh](https://github.com/quantumlib/qsim/blob/main/qsimcirq/qsimh_simulator.py) | qsimcirq | Implements `cirq.SimulatesAmplitudes`. Intended for heavy parallelization across several computers; Cirq users should generally prefer qsim. |
| [quimb](https://quimb.readthedocs.io/en/latest/) | quimb | Not based on `cirq.Simulator`; instead uses a Cirq-to-quimb translation layer provided in `contrib/quimb`. In addition to circuit simulation, this allows the use of quimb circuit-analysis tools on Cirq circuits. |
| [qFlex](https://github.com/ngnrsaa/qflex) | qflexcirq | Implements `cirq.SimulatesAmplitudes`. RAM usage is highly dependent on the number of two-qubit gates in the circuit. Not recommended - prefer qsim or quimb. |
