---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/google/best_practices.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/google/best_practices.ipynb
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

# Best practices

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/google/best_practices"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/google/best_practices.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/google/best_practices.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/google/best_practices.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

```python
try:
    import cirq
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    import cirq

    print("installed cirq.")
```

```python
import cirq_google as cg
import sympy
```

This section lists some best practices for creating a circuit that performs well
on Google hardware devices. This is an area of active research, so users are
encouraged to try multiple approaches to improve results.

This guide is split into three parts:
*  Getting your circuit to run
*  Making it run faster
*  Lowering error

## Getting a circuit to run on hardware

In order to run on hardware, the circuit must only use qubits and gates that the
device supports.  Using inactive qubits, non-adjacent qubits, or non-native
gates will immediately cause a circuit to fail.

Validating a circuit with a device, such as
`cg.Sycamore.validate_circuit(circuit)` will test a lot of these
conditions.  Calling the `validate_circuit` function will work with any
device, including those retrieved directly from the API using the
[engine object](./specification.md#conversion-to-cirq.device), which can help
identify any qubits used in the circuit that have been disabled on the actual
device.

### Using built-in transformers as a first pass

Using built-in transformers will allow you to compile to the correct gate set. As they are
automated solutions, they will not always perform as well as a hand-crafted solution, but
they provide a good starting point for creating a circuit that is likely to run successfully
on hardware. Best practice is to inspect the circuit after optimization to make sure
that it has compiled without unintended consequences.

```python
# Create your circuit here
my_circuit = cirq.Circuit()

# Convert the circuit to run on a Google target gateset.
# The google specific `cirq.CompilationTargetGateset` specifies the target gateset
# and a sequence of appropriate optimization routines that should be executed to compile
# a circuit to run on this target.
sycamore_circuit = cirq.optimize_for_target_gateset(my_circuit, gateset=cg.SycamoreTargetGateset())
```

### Using CircuitOperation to reduce circuit size

Particularly large batches (or sweeps) of circuits may encounter errors when
sent to Quantum Engine due to an upper limit on request size. If the circuits
in question have a repetitive structure, `cirq.CircuitOperation`s can be used
to reduce the request size and avoid this limit.

```python
# Repeatedly apply Hadamard and measurement to 10 qubits.
my_circuit = cirq.Circuit()
qubits = cirq.GridQubit.rect(2, 5)
for i in range(100):
    my_circuit.append(cirq.H.on_each(*qubits))
    for qb in qubits:
        my_circuit.append(cirq.measure(qb, key=cirq.MeasurementKey.parse_serialized(f'{i}:m{qb}')))

print(my_circuit)

# The same circuit, but defined using CircuitOperations.
# This is ~1000x smaller when serialized!
q = cirq.NamedQubit("q")
sub_circuit = cirq.FrozenCircuit(cirq.H(q), cirq.measure(q, key='m'))
circuit_op = cirq.CircuitOperation(sub_circuit).repeat(100)
short_circuit = cirq.Circuit(
    circuit_op.with_qubits(q).with_measurement_key_mapping({'m': f'm{q}'}) for q in qubits
)
print(short_circuit)
```

When compiling circuits with `CircuitOperation`s, providing a context
with `deep=True` will preserve the `CircuitOperation`s while
optimizing their contents. This is useful for producing a concise,
device-compatible circuit.

```python
syc_circuit = cirq.optimize_for_target_gateset(
    short_circuit, gateset=cg.SycamoreTargetGateset(), context=cirq.TransformerContext(deep=True)
)
print(syc_circuit)
```

## Running circuits faster

The following sections give tips and tricks that allow you to improve your
repetition rate (how many repetitions per second the device will run).

This will allow you to make the most out of limited time on the
device by getting results faster. The shorter experiment time may
also reduce error due to drift of qubits away from calibration.

There are costs to sending circuits over the network, to compiling each
circuit into waveforms, to initializing the device,
and to sending results back over the network.
These tips will aid you in removing some of this overhead by combining your
circuits into sweeps or batches.

### Use sweeps when possible

Round trip network time to and from the engine typically adds latency on the order of a second
to the overall computation time.  Reducing the number of trips and allowing the engine to
properly batch circuits can improve the throughput of your calculations.  One way to do this
is to use parameter sweeps to send multiple variations of a circuit at once.

One example is to turn single-qubit gates on or off by using parameter sweeps.
For instance, the following code illustrates how to combine measuring in the
Z basis or the X basis in one circuit.

```python
q = cirq.GridQubit(1, 1)
sampler = cirq.Simulator()

# STRATEGY #1: Have a separate circuit and sample call for each basis.
circuit_z = cirq.Circuit(cirq.measure(q, key='out'))
circuit_x = cirq.Circuit(cirq.H(q), cirq.measure(q, key='out'))
samples_z = sampler.sample(circuit_z, repetitions=5)
samples_x = sampler.sample(circuit_x, repetitions=5)

print("Measurement in Z Basis:", samples_z, sep="\n")
print("Measurement in X Basis:", samples_x, sep="\n")
```

```python
# STRATEGY #2: Have a parameterized circuit.
circuit_sweep = cirq.Circuit(cirq.H(q) ** sympy.Symbol('t'), cirq.measure(q, key='out'))

samples_sweep = sampler.sample(circuit_sweep, repetitions=5, params=[{'t': 0}, {'t': 1}])
print(samples_sweep)
```

One word of caution is there is a limit to the total number of repetitions.  Take some care
that your parameter sweeps, especially products of sweeps, do not become so excessively large
that they exceed this limit.

### Use batches if sweeps are not possible

The sampler has a method called `run_batch()` that can be used to send multiple
circuits in a single request.  This can be used to increase the efficiency
of your program so that more repetitions are completed per second.

The circuits that are grouped into the same batch must
measure the same qubits and have the same number of repetitions for each
circuit.  Otherwise, the circuits will not be batched together
on the device, and there will be no gain in efficiency.

### Flatten sympy formulas into symbols

Symbols are extremely useful for constructing parameterized circuits (see above).  However,
only some sympy formulas can be serialized for network transport to the engine.
Currently, sums and products of symbols, including linear combinations, are supported.
See `cirq_google.arg_func_langs` for details.

The sympy library is also infamous for being slow, so avoid using complicated formulas if you
care about performance.  Avoid using parameter resolvers that have formulas in them.

One way to eliminate formulas in your gates is to flatten your expressions.
The following example shows how to take a gate with a formula and flatten it
to a single symbol with the formula pre-computed for each value of the sweep:

```python
# Suppose we have a gate with a complicated formula.  (e.g. "2^t - 1")
# This formula cannot be serialized
# It could potentially encounter sympy slowness.
gate_with_formula = cirq.XPowGate(exponent=2 ** sympy.Symbol('t') - 1)
sweep = cirq.Linspace('t', start=0, stop=1, length=5)

# Instead of sweeping the formula, we will pre-compute the values of the formula
# at every point and store it a new symbol called '<2**t - 1>'
sweep_for_gate, flat_sweep = cirq.flatten_with_sweep(gate_with_formula, sweep)

print(repr(sweep_for_gate))

print(list(flat_sweep.param_tuples()))
```

## Improving circuit fidelity

The following tips and tricks show how to modify your circuit to
reduce error rates by following good circuit design principles that
minimize the length of circuits.

Quantum Engine will execute a circuit as faithfully as possible.
This means that moment structure will be preserved. That is, all gates in a
moment are guaranteed to be executed before those in any later moment and
after gates in previous moments.  Many of these tips focus on having a
good moment structure that avoids problematic missteps that can cause
unwanted noise and error.

Note: See the [Circuit optimization, gate alignment, and spin echoes tutorial](../tutorials/google/spin_echoes.ipynb) for an example of the best practices discussed in this section.

### Short gate depth

In the current NISQ (noisy intermediate-scale quantum) era, gates and devices still
have significant error. Both gate errors and T1 decay rate can cause long circuits
to have noise that overwhelms any signal in the circuit.

The recommended gate depths vary significantly with the structure of the circuit itself
and will likely increase as the devices improve. Total circuit fidelity can be roughly
estimated by multiplying the fidelity for all gates in the circuit. For example,
using a error rate of 0.5% per gate, a circuit of depth 20 and width 20 could be estimated
at 0.995^(20 * 20) = 0.135. Using separate error rates per gates (i.e. based on calibration
metrics) or a more complicated noise model can result in more accurate error estimation.

### Terminal Measurements

Make sure that measurements are kept in the same moment as the final moment in
the circuit.  Make sure that any circuit optimizers do not alter this by
incorrectly pushing measurements forward. This behavior can be avoided by
measuring all qubits with a single gate or by adding
the measurement gate after all optimizers have run.

Currently, only terminal measurements are supported by the hardware.  If you
absolutely need intermediate measurements for your application, reach out to
your Google sponsor to see if they can help devise a proper circuit using
intermediate measurements.


### Keep qubits busy

Qubits that remain idle for long periods tend to dephase and decohere. Inserting a
[Spin Echo](https://en.wikipedia.org/wiki/Spin_echo) into your circuit onto
qubits that have long idle periods, such as a pair
of involutions, such as two successive Pauli Y gates, will generally increase
performance of the circuit.

Be aware that this should be done after calling
`cirq.optimize_for_target_gateset`, since this function will 'optimize'
these operations out of the circuit. You can also tag the spin echo operations with a no-compile tag, and include these tags in `context.tags_to_ignore`, so that the transformer ignores all tagged operations marked with any of `context.tags_to_ignore`. 

### Delay initialization of qubits

The |0⟩ state is more robust than the |1⟩ state. As a result, one should
not initialize a qubit to |1⟩ at the beginning of the circuit until shortly
before other gates are applied to it.

### Align single-qubit and two-qubit layers

Devices are generally calibrated to circuits that alternate single-qubit gates with
two-qubit gates in each layer. Staying close to this paradigm will often improve
performance of circuits.  This will also reduce the circuit's total duration,
since the duration of a moment is its longest gate.  Making sure that each layer
contains similar gates of the same duration can be challenging, but it will
likely have a measurable impact on the fidelity of your circuit.

Devices generally operate in the Z basis, so that rotations around the Z axis will become
book-keeping measures rather than physical operations on the device. These
virtual Z operations have zero duration and have no cost, if they add no moments
to your circuit.  In order to guarantee that they do not add moments, you can
make sure that virtual Z are aggregated into their own layer.  Alternatively,
you can use the `cirq.eject_z` optimizer to propagate these Z gates forward through
commuting operators.

See the function `cirq.stratified_circuit` for an automated way to organize gates
into moments with similar gates.

### Qubit picking

On current NISQ devices, qubits cannot be considered identical.  Different
qubits can have vastly different performance and can vary greatly from day
to day.  It is important for experiments to have a dynamic method to
pick well-performing qubits that maximize the fidelity of the experiment.
There are several techniques that can assist with this.

*   Analyze calibration metrics:  performance of readout, single-qubit, and
two-qubit gates are measured as a side effect of running the device's
calibration procedure.  These metrics can be used as a baseline to evaluate
circuit performance or identify outliers to avoid.  This data can be inspected
programmatically by retrieving metrics from the [API](calibration.md) or
[visually by applying a cirq.Heatmap](../tutorials/google/visualizing_calibration_metrics.ipynb)
to that data or by using the built-in
heatmaps in the Cloud console page for the processor.  Note that, since this
data is only taken during calibration (e.g. at most daily), drifts and other
concerns may affect the values significantly, so these metrics should only be
used as a first approximation.  There is no substitute for actually running characterizations
on the device.
*   Loschmidt echo:  Running a small circuit on a string of qubits and then
applying the circuit's inverse can be used as a quick but effective way to
judge qubit quality.  See
[this tutorial](../tutorials/google/echoes.ipynb) for instructions.
*   XEB:  Cross-entropy benchmarking is another way to gauge qubit performance
on a set of random circuits.  See tutorials on
[parallel XEB](../noise/qcvv/parallel_xeb.ipynb)
or [isolated XEB](../noise/qcvv/isolated_xeb.ipynb) for instructions.


### Refitting gates

Virtual Z gates (or even single qubit gates) can be added to adjust for errors
in two qubit gates.  Two qubit gates can have errors due to drift, coherent
error, unintended cross-talk, or other sources.  Refitting these gates and
adjusting the circuit for the observed unitary of the two qubit gate
compared to the ideal unitary can substantially improve results.
However, this approach can use a substantial amount of resources.

This technique involves two distinct steps.  The first is *characterization*,
which is to identify the true behavior of the two-qubit gate.  This typically
involves running many varied circuits involving the two qubit gate in a method
(either periodic or random) to identify the parameters of the gate's behavior.

Entangling gates used in Google's architecture fall into a general category of FSim gates,
standing for *Fermionic simulation*.  The generalized version of this gate can
be parameterized into 5 angles, or degrees of freedom.  Characterization will
attempt to identify the values of these five angles.

The second step is calibrating (or refitting) the gate.  Out of the five angles
that comprise the generalized FSim gate, three can be corrected for by adding
Z rotations before or after the gate.  Since these gates are propagated forward
automatically, they add no duration or error to the circuit and can essentially
be added "for free".  See the [devices page](devices.md#virtual_z_gates) for more
information on Virtual Z gates.  Note that it is important to keep the single-qubit and
two-qubit gates aligned (see above) while performing this procedure so that
the circuit stays the same duration.

For more on calibration and detailed instructions on how to perform these procedures, see the following tutorials:

* [XEB calibration theory](../noise/qcvv/xeb_theory.ipynb)
* [Floquet calibration](https://www.youtube.com/watch?v=hYDWOz1r2Ys&t=243s)
