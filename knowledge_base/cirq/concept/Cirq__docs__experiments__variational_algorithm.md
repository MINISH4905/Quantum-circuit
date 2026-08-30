---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/experiments/variational_algorithm.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/experiments/variational_algorithm.ipynb
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

# Quantum variational algorithm

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/experiments/variational_algorithm"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/experiments/variational_algorithm.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/experiments/variational_algorithm.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/experiments/variational_algorithm.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

In this tutorial, we use the variational quantum eigensolver [[1]](https://arxiv.org/abs/1304.3061) (VQE) in Cirq to optimize a simple Ising model.

```python
try:
    import cirq
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    print("installed cirq.")
    import cirq
```

## Background: Variational Quantum Algorithm

The [variational method](https://en.wikipedia.org/wiki/Variational_method_(quantum_mechanics)) in quantum theory is a classical method for finding low energy states of a quantum system. The rough idea of this method is that one defines a trial wave function (sometimes called an *ansatz*) as a function of some parameters, and then one finds the values of these parameters that minimize the expectation value of the energy with respect to these parameters. This minimized ansatz is then an approximation to the lowest energy eigenstate, and the expectation value serves as an upper bound on the energy of the ground state.

In the last few years (see [[1]](https://arxiv.org/abs/1304.3061) and [[2]](https://arxiv.org/abs/1507.08969), for example), it has been realized that quantum computers can mimic the classical technique and that a quantum computer does so with certain advantages. In particular, when one applies the classical variational method to a system of $n$ qubits, an exponential number (in $n$) of complex numbers is necessary to generically represent the wave function of the system. However, with a quantum computer, one can directly produce this state using a parameterized quantum circuit with less than exponential parameters, and then use repeated measurements to estimate the expectation value of the energy.

This idea has led to a class of algorithms known as variational quantum algorithms. Indeed this approach is not just limited to finding low energy eigenstates, but minimizing any objective function that can be expressed as a quantum observable. It is an open question to identify under what conditions these quantum variational algorithms will succeed, and exploring this class of algorithms is a key part of the research for noisy intermediate-scale quantum computers [[3]](https://arxiv.org/abs/1801.00862).

The classical problem we will focus on is the 2D +/- Ising model with transverse field ([ISING](http://iopscience.iop.org/article/10.1088/0305-4470/15/10/028/meta)). This problem is NP-complete. It is highly unlikely that quantum computers will be able to efficiently solve it across all instances because it is generally believed that quantum computers cannot solve all NP-complete problems in polynomial time. Yet this type of problem is illustrative of the general class of problems that Cirq is designed to tackle.


Let's define the problem. Consider the energy function

$E(s_1,\dots,s_n) = \sum_{\langle i,j \rangle} J_{i,j}s_i s_j + \sum_i h_i s_i$

where here each $s_i, J_{i,j}$, and $h_i$ are either +1 or -1. Here each index i is associated with a bit on a square lattice, and the $\langle i,j \rangle$ notation means sums over neighboring bits on this lattice. The problem we would like to solve is, given $J_{i,j}$, and $h_i$, find an assignment of $s_i$ values that minimize $E$.

How does a variational quantum algorithm work for this? One approach is to consider $n$ qubits and associate them with each of the bits in the classical problem. This maps the classical problem onto the quantum problem of minimizing the expectation value of the observable

$H=\sum_{\langle i,j \rangle} J_{i,j} Z_i Z_j + \sum_i h_iZ_i$

Then one defines a set of parameterized quantum circuits, i.e., a quantum circuit where the gates (or more general quantum operations) are parameterized by some values. This produces an ansatz state

$|\psi(p_1, p_2, \dots, p_k)\rangle$

where $p_i$ are the parameters that produce this state (here we assume a pure state, but mixed states are of course possible).

The variational algorithm then works by noting that one can obtain the value of the objective function for a given ansatz state by

1. Prepare the ansatz state.
2. Make a measurement which samples from some terms in H.
3. Goto 1.

Note that one cannot always measure $H$ directly (without the use of quantum phase estimation). So one often relies on the linearity of expectation values to measure parts of $H$ in step 2. One always needs to repeat the measurements to obtain an estimate of the expectation value. How many measurements needed to achieve a given accuracy is beyond the scope of this tutorial, but Cirq can help investigate this question.

The above shows that one can use a quantum computer to obtain estimates of the objective function for the ansatz. This can then be used in an outer loop to try to obtain parameters for the lowest value of the objective function. For these best parameter, one can then use that best ansatz to produce samples of solutions to the problem, which obtain a hopefully good approximation for the lowest possible value of the objective function.

## Create a circuit on a Grid

To build the above variational quantum algorithm using Cirq, one begins by building the appropriate circuit.  Because the problem we have defined has a natural structure on a grid, we will use Cirq’s built-in `cirq.GridQubit`s as our qubits. We will demonstrate some of how this works in an interactive Python environment, the following code can be run in series in a Python environment where you have Cirq installed.  For more about circuits and how to create them, see the [Tutorial](../start/basics.ipynb) or the [Circuits](../build/circuits.ipynb) page.

```python
# define the length and width of the grid.
length = 3

# define qubits on the grid.
qubits = cirq.GridQubit.square(length)

print(qubits)
```

Here we see that we've created a bunch of `cirq.GridQubits`, which have a row and column, indicating their position on a grid.

Now that we have some qubits, let us construct a `cirq.Circuit` on these qubits. For example, suppose we want to apply the Hadamard gate `cirq.H` to every qubit whose row index plus column index is even, and an `cirq.X` gate to every qubit whose row index plus column index is odd. To do this, we write:

```python
circuit = cirq.Circuit()
circuit.append(cirq.H(q) for q in qubits if (q.row + q.col) % 2 == 0)
circuit.append(cirq.X(q) for q in qubits if (q.row + q.col) % 2 == 1)

print(circuit)
```

## Creating the Ansatz

One convenient pattern is to use a python [Generator](https://wiki.python.org/moin/Generators) for defining sub-circuits or layers in our algorithm.  We will define a function that takes in the relevant parameters and then yields the operations for the sub-circuit, and then this can be appended to the `cirq.Circuit`:

```python
def rot_x_layer(length, half_turns):
    """Yields X rotations by half_turns on a square grid of given length."""

    # Define the gate once and then re-use it for each Operation.
    rot = cirq.XPowGate(exponent=half_turns)

    # Create an X rotation Operation for each qubit in the grid.
    for i in range(length):
        for j in range(length):
            yield rot(cirq.GridQubit(i, j))


# Create the circuit using the rot_x_layer generator
circuit = cirq.Circuit()
circuit.append(rot_x_layer(2, 0.1))
print(circuit)
```

Another important concept here is that the rotation gate is specified in *half turns* ($ht$). For a rotation about `X`, the gate is:

$\cos(ht * \pi) I + i \sin(ht * \pi) X$

There is a lot of freedom defining a variational ansatz. Here we will do a variation on a QAOA strategy [[4]](https://arxiv.org/abs/1411.4028) and define an ansatz related to the problem we are trying to solve.

First, we need to choose how the instances of the problem are represented. These are the values $J$ and $h$ in the Hamiltonian definition. We represent them as two-dimensional arrays (lists of lists). For $J$ we use two such lists, one for the row links and one for the column links.

Here is a snippet that we can use to generate random problem instances:

```python
import random


def rand2d(rows, cols):
    return [[random.choice([+1, -1]) for _ in range(cols)] for _ in range(rows)]


def random_instance(length):
    # transverse field terms
    h = rand2d(length, length)
    # links within a row
    jr = rand2d(length - 1, length)
    # links within a column
    jc = rand2d(length, length - 1)
    return (h, jr, jc)


h, jr, jc = random_instance(3)
print(f'transverse fields: {h}')
print(f'row j fields: {jr}')
print(f'column j fields: {jc}')
```

In the code above, the actual values will be different for each individual run because they are using `random.choice`.

Given this definition of the problem instance, we can now introduce our ansatz. It will consist of one step of a circuit made up of:

0\. Apply an initial mixing step that puts all the qubits into the $|+\rangle=\frac{1}{\sqrt{2}}(|0\rangle+|1\rangle)$ state.

```python
def prepare_plus_layer(length):
    for i in range(length):
        for j in range(length):
            yield cirq.H(cirq.GridQubit(i, j))
```

1\. Apply a `cirq.ZPowGate` for the same parameter for all qubits where the transverse field term $h$ is $+1$.

```python
def rot_z_layer(h, half_turns):
    """Yields Z rotations by half_turns conditioned on the field h."""
    gate = cirq.ZPowGate(exponent=half_turns)
    for i, h_row in enumerate(h):
        for j, h_ij in enumerate(h_row):
            if h_ij == 1:
                yield gate(cirq.GridQubit(i, j))
```

2\. Apply a `cirq.CZPowGate` for the same parameter between all qubits where the coupling field term $J$ is $+1$. If the field is $-1$, apply `cirq.CZPowGate` conjugated by $X$ gates on all qubits.

```python
def rot_11_layer(jr, jc, half_turns):
    """Yields rotations about |11> conditioned on the jr and jc fields."""
    cz_gate = cirq.CZPowGate(exponent=half_turns)
    for i, jr_row in enumerate(jr):
        for j, jr_ij in enumerate(jr_row):
            q = cirq.GridQubit(i, j)
            q_1 = cirq.GridQubit(i + 1, j)
            if jr_ij == -1:
                yield cirq.X(q)
                yield cirq.X(q_1)
            yield cz_gate(q, q_1)
            if jr_ij == -1:
                yield cirq.X(q)
                yield cirq.X(q_1)

    for i, jc_row in enumerate(jc):
        for j, jc_ij in enumerate(jc_row):
            q = cirq.GridQubit(i, j)
            q_1 = cirq.GridQubit(i, j + 1)
            if jc_ij == -1:
                yield cirq.X(q)
                yield cirq.X(q_1)
            yield cz_gate(q, q_1)
            if jc_ij == -1:
                yield cirq.X(q)
                yield cirq.X(q_1)
```

3\. Apply an `cirq.XPowGate` for the same parameter for all qubits. This is the method `rot_x_layer` we have written above.

Putting all together, we can create a step that uses just three parameters. Below is the code, which uses the generator for each of the layers (note to advanced Python users: this code does not contain a bug in using `yield` due to the auto flattening of the `OP_TREE concept`. Typically, one would want to use `yield` from here, but this is not necessary):

```python
def initial_step(length):
    yield prepare_plus_layer(length)


def one_step(h, jr, jc, x_half_turns, h_half_turns, j_half_turns):
    length = len(h)
    yield rot_z_layer(h, h_half_turns)
    yield rot_11_layer(jr, jc, j_half_turns)
    yield rot_x_layer(length, x_half_turns)


h, jr, jc = random_instance(3)

circuit = cirq.Circuit()
circuit.append(initial_step(len(h)))
circuit.append(one_step(h, jr, jc, 0.1, 0.2, 0.3))
print(circuit)
```

Here we see that we have chosen particular parameter values $(0.1, 0.2, 0.3)$.

## Simulation

In Cirq, the simulators make a distinction between a *run* and a *simulation*. A *run* only allows for a simulation that mimics the actual quantum hardware. For example, it does not allow for access to the amplitudes of the wave function of the system, since that is not experimentally accessible. *Simulate* commands, however, are broader and allow different forms of simulation. When prototyping small circuits, it is useful to execute *simulate* methods, but one should be wary of relying on them when running against actual hardware.

```python
simulator = cirq.Simulator()
circuit = cirq.Circuit()
circuit.append(initial_step(len(h)))
circuit.append(one_step(h, jr, jc, 0.1, 0.2, 0.3))
circuit.append(cirq.measure(*qubits, key='x'))
results = simulator.run(circuit, repetitions=100)
print(results.histogram(key='x'))
```

Note that we have run the simulation 100 times and produced a histogram of the counts of the measurement results. What are the keys in the histogram counter? Note that we have passed in the order of the qubits. This ordering is then used to translate the order of the measurement results to a register using a [big endian representation](https://en.wikipedia.org/wiki/Endianness).

For our optimization problem, we want to calculate the value of the objective function for a given result run. One way to do this is using the raw measurement data from the result of `simulator.run`. Another way to do this is to provide to the histogram a method to calculate the objective: this will then be used as the key for the returned `Counter`.

```python
import numpy as np


def energy_func(length, h, jr, jc):
    def energy(measurements):
        # Reshape measurement into array that matches grid shape.
        meas_list_of_lists = [measurements[i * length : (i + 1) * length] for i in range(length)]
        # Convert true/false to +1/-1.
        pm_meas = 1 - 2 * np.array(meas_list_of_lists).astype(np.int32)

        tot_energy = np.sum(pm_meas * h)
        for i, jr_row in enumerate(jr):
            for j, jr_ij in enumerate(jr_row):
                tot_energy += jr_ij * pm_meas[i, j] * pm_meas[i + 1, j]
        for i, jc_row in enumerate(jc):
            for j, jc_ij in enumerate(jc_row):
                tot_energy += jc_ij * pm_meas[i, j] * pm_meas[i, j + 1]
        return tot_energy

    return energy


print(results.histogram(key='x', fold_func=energy_func(3, h, jr, jc)))
```

One can then calculate the expectation value over all repetitions:

```python
def obj_func(result):
    energy_hist = result.histogram(key='x', fold_func=energy_func(3, h, jr, jc))
    return np.sum([k * v for k, v in energy_hist.items()]) / result.repetitions


print(f'Value of the objective function {obj_func(results)}')
```

### Parameterizing the Ansatz

Now that we have constructed a variational ansatz and shown how to simulate it using Cirq, we can think about optimizing the value. 

On quantum hardware, one would most likely want to have the optimization code as close to the hardware as possible. As the classical hardware that is allowed to inter-operate with the quantum hardware becomes better specified, this language will be better defined. Without this specification, however, Cirq also provides a useful concept for optimizing the looping in many optimization algorithms. This is the fact that many of the value in the gate sets can, instead of being specified by a float, be specified by a `sympy.Symbol`, and this `sympy.Symbol` can be substituted for a value specified at execution time.

Luckily for us, we have written our code so that using parameterized values is as simple as passing `sympy.Symbol` objects where we previously passed float values.

```python
import sympy

circuit = cirq.Circuit()
alpha = sympy.Symbol('alpha')
beta = sympy.Symbol('beta')
gamma = sympy.Symbol('gamma')
circuit.append(initial_step(len(h)))
circuit.append(one_step(h, jr, jc, alpha, beta, gamma))
circuit.append(cirq.measure(*qubits, key='x'))
print(circuit)
```

Note now that the circuit's gates are parameterized.

Parameters are specified at runtime using a `cirq.ParamResolver`, which is just a dictionary from `Symbol` keys to runtime values. 

For instance:

```python
resolver = cirq.ParamResolver({'alpha': 0.1, 'beta': 0.3, 'gamma': 0.7})
resolved_circuit = cirq.resolve_parameters(circuit, resolver)
```

resolves the parameters to actual values in the circuit.

Cirq also has the concept of a *sweep*. A sweep is a collection of parameter resolvers. This runtime information is very useful when one wants to run many circuits for many different parameter values. Sweeps can be created to specify values directly (this is one way to get classical information into a circuit), or a variety of helper methods. For example suppose we want to evaluate our circuit over an equally spaced grid of parameter values. We can easily create this using `cirq.LinSpace`.

```python
sweep = (
    cirq.Linspace(key='alpha', start=0.1, stop=0.9, length=5)
    * cirq.Linspace(key='beta', start=0.1, stop=0.9, length=5)
    * cirq.Linspace(key='gamma', start=0.1, stop=0.9, length=5)
)
results = simulator.run_sweep(circuit, params=sweep, repetitions=100)
for result in results:
    print(result.params.param_dict, obj_func(result))
```

### Finding the Minimum

Now we have all the code, we do a simple grid search over values to find a minimal value. Grid search is not the best optimization algorithm, but is here simply illustrative.

```python
sweep_size = 10
sweep = (
    cirq.Linspace(key='alpha', start=0.0, stop=1.0, length=sweep_size)
    * cirq.Linspace(key='beta', start=0.0, stop=1.0, length=sweep_size)
    * cirq.Linspace(key='gamma', start=0.0, stop=1.0, length=sweep_size)
)
results = simulator.run_sweep(circuit, params=sweep, repetitions=100)

min = None
min_params = None
for result in results:
    value = obj_func(result)
    if min is None or value < min:
        min = value
        min_params = result.params
print(f'Minimum objective value is {min}.')
```

We've created a simple variational quantum algorithm using Cirq. Where to go next? Perhaps you can play around with the above code and work on analyzing the algorithms performance. Add new parameterized circuits and build an end to end program for analyzing these circuits.

## References

[[1]](https://arxiv.org/abs/1304.3061) Alberto Peruzzo et al., "A variational eigenvalue solver on a photonic quantum processor", Nature Communications 5, no. 1 (2014): 4213.

[[2]](https://arxiv.org/abs/1507.08969) Dave Wecker et al., "Progress towards practical quantum variational algorithms" Physical Review A 92, no. 4 (2015): 042303.

[[3]](https://arxiv.org/abs/1801.00862) John Preskill., "Quantum Computing in the NISQ era and beyond", Quantum 2, (2018): 79.

[[4]](https://arxiv.org/abs/1411.4028) Edward Farhi et al., "A Quantum Approximate Optimization Algorithm", arXiv:1411.4028 (2014).
