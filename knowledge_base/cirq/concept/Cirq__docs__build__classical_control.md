---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/build/classical_control.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/build/classical_control.ipynb
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

# Classical control

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/build/classical_control"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/build/classical_control.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/build/classical_control.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/build/classical_control.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

## Setup

```python
try:
    import cirq
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq
    import cirq

    print("installed cirq.")
```

While some quantum algorithms can be defined entirely at the quantum level, there are many others (notably including [teleportation](../experiments/textbook_algorithms.ipynb#quantum_teleportation) and [error correction](https://www.nature.com/articles/s41586-021-03588-y)) which rely on classical measurement results from one part of the algorithm to control operations in a later section.

To represent this, Cirq provides the `ClassicallyControlledOperation`. Following the pattern of controlled operations, a classically-controlled version of any `Operation` can be constructed by calling its `with_classical_controls` method with the control condition(s).

## Basic conditions

In the example below, `H` will only be applied to `q1` if the previous measurement "a" returns a 1. More generally, providing some string `"cond"` to `with_classical_controls` creates a `cirq.ClassicallyControlledOperation` with a `cirq.KeyCondition` whose key is `"cond"`. A `KeyCondition` will only trigger, and apply the operation it controls, if a preceding measurement with the same key measured **one or more** qubits in the $|1\rangle$ state.

```python
q0, q1 = cirq.LineQubit.range(2)
circuit = cirq.Circuit(
    cirq.H(q0),
    cirq.measure(q0, key='a'),
    cirq.H(q1).with_classical_controls('a'),
    cirq.measure(q1, key='b'),
)
print(circuit)
print(cirq.Simulator().run(circuit, repetitions=1000).histogram(key='b'))
```

The results from running the circuit on the simulator match expectation. `H` applied to qubit `q0` means that qubit will be $|1\rangle$ half of the time on average. When `H` is then applied to qubit `q1`, (half of the time), `q1` will measure $|1\rangle$ a quarter of the time and $|0\rangle$ three-quarters of the time.

Using just these conditions, we can construct the [quantum teleportation](../experiments/textbook_algorithms.ipynb#quantum_teleportation) circuit:

```python
# Teleports `_message` from Alice to Bob.
alice = cirq.NamedQubit('alice')
bob = cirq.NamedQubit('bob')
message = cirq.NamedQubit('_message')

message_circuit = cirq.Circuit(
    # Create the message.
    cirq.X(message) ** 0.371,
    cirq.Y(message) ** 0.882,
)

teleport_circuit = cirq.Circuit(
    # Create Bell state to be shared between Alice and Bob.
    cirq.H(alice),
    cirq.CNOT(alice, bob),
    # Prepare message circuit
    message_circuit,
    # Bell measurement of the message and Alice's entangled qubit.
    cirq.CNOT(message, alice),
    cirq.H(message),
    cirq.measure(message, key='M'),
    cirq.measure(alice, key='A'),
    # Uses the two classical bits from the Bell measurement to recover the
    # original quantum message on Bob's entangled qubit.
    cirq.X(bob).with_classical_controls('A'),
    cirq.Z(bob).with_classical_controls('M'),
)
print(circuit)

# Simulate the message and teleport circuits for Bloch vectors to compare
#     the state of the teleported qubit before and after teleportation.
sim = cirq.Simulator()
message_bloch_vector = cirq.bloch_vector_from_state_vector(
    sim.simulate(message_circuit).final_state_vector, index=0
)
teleport_bloch_vector = cirq.bloch_vector_from_state_vector(
    sim.simulate(teleport_circuit).final_state_vector, index=2
)
print(f"Message Qubit State: {message_bloch_vector}")
print(f"Teleported Bob's Qubit state: {teleport_bloch_vector}")
```

This example separately simulated the message qubit after its construction, and Bob's qubit after teleportation of the message. The fact that the Bloch vectors of each respective qubit are the same indicate that the circuit successfully teleported the message qubit's state onto Bob's qubit.

## Multi-Qubit Measurements and Bit Masks

The `cirq.KeyedCondition` class limited in that it evaluate a simple function `is the value != 0?`. When doing multi-qubit measurement we often need to do more complex function like applying a bitmask before comparison. The class [cirq.BitMaskKeyCondition](https://github.com/quantumlib/Cirq/blob/ebef9bff978f28b032f54eb5f0a2e1cb9ec6464c/cirq-core/cirq/value/condition.py#L140) provides this functionality allowing us to do:
- `BitMaskKeyCondition('a')` $\rightarrow a \neq 0$
- `BitMaskKeyCondition('a', bitmask=13)` $\rightarrow  (a \& 13) \neq 0$
- `BitMaskKeyCondition('a', bitmask=13, target_value=9)` $\rightarrow  (a \& 13) \neq 9$
- `BitMaskKeyCondition('a', bitmask=13, target_value=9, equal_target=True)` $\rightarrow  (a \& 13) = 9$
- `BitMaskKeyCondition.create_equal_mask('a', 13)` $\rightarrow  (a \& 13) = 13$
- `BitMaskKeyCondition.create_not_equal_mask('a', 13)` $\rightarrow  (a \& 13) \neq 13$

In this example, `X` will be applied to $q_5$ when the bits corresponding to $q_1$, $q_2$, and $q_4$ are $1$ regardless of the values of other bits.

```python
qs = cirq.LineQubit.range(5)
cond = cirq.BitMaskKeyCondition.create_equal_mask('q_{0..4}', bitmask=13)
circuit = cirq.Circuit(
    cirq.H.on_each(qs),
    cirq.measure(qs, key='q_{0..4}'),
    cirq.X(cirq.q(5)).with_classical_controls(cond),
    cirq.measure(cirq.q(5), key='q_5'),
)
circuit
print(cirq.Simulator().run(circuit, repetitions=2**5).data)
```

## Sympy conditions

Cirq also supports more complex control conditions: providing some `sympy` expression `"expr"` to `with_classical_controls` creates a `ClassicallyControlledOperation` with a `SympyCondition`. That condition will only trigger if `"expr"` evaluates to a "truthy" value (`bool(expr) == True`), and uses measurement results to resolve any variables in the expression.

In this example, `X` will only be applied to `q2` if `a == b`; in other words, $|q_0q_1\rangle$ must be either $|00\rangle$ or $|11\rangle$. This is verifiable with the simulated result data, where the `c` measurement key for qubit `q2` is always `1` when `a` and `b` are `00` or `11`, and `0` otherwise.

```python
import sympy

q0, q1, q2 = cirq.LineQubit.range(3)
a, b = sympy.symbols('a b')
sympy_cond = sympy.Eq(a, b)
circuit = cirq.Circuit(
    cirq.H.on_each(q0, q1),
    cirq.measure(q0, key='a'),
    cirq.measure(q1, key='b'),
    cirq.X(q2).with_classical_controls(sympy_cond),
    cirq.measure(q2, key='c'),
)
print(circuit)
results = cirq.Simulator(seed=2).run(circuit, repetitions=8)
print(results.data)
```

### Sympy Complex Boolean Functions

Cirq supports evaluating complex boolean functions on multiqubit measurement keys through Sympy's [indexed objects](https://docs.sympy.org/latest/modules/tensor/indexed.html#sympy.tensor.indexed.Indexed.base).

In this example, `X` will be applied to $q_2$ if and only if the result of the two-qubit measurement of $q_0, q_1$ has two different bits.

```python
m = sympy.IndexedBase('q0_q1')
q0, q1, q2 = cirq.LineQubit.range(3)
sympy_indexed_condition = sympy.Xor(m[0], m[1])
circuit = cirq.Circuit(
    cirq.H.on_each(q0, q1),
    cirq.measure(q0, q1, key='q0_q1'),
    cirq.X(q2).with_classical_controls(sympy_indexed_condition),
    cirq.measure(q2, key='q2'),
)
print(circuit)
results = cirq.Simulator(seed=2).run(circuit, repetitions=8)
print(results.data)
```

## Combining conditions

Multiple conditions of either type can be specified to `with_classical_controls`, in which case the resulting `ClassicallyControlledOperation` will only trigger if _all_ conditions trigger. Similarly, calling `with_classical_controls` on an existing `ClassicallyControlledOperation` will require all new and pre-existing conditions to trigger for the operation to trigger.

```python
q0, q1, q2, q3, q4 = cirq.LineQubit.range(5)
a = sympy.symbols('a')
sympy_cond = sympy.Eq(a, 0)
circuit = cirq.Circuit(
    cirq.H.on_each(q0, q1, q2),
    cirq.measure(q0, q1, key='a'),
    cirq.measure(q2, key='b'),
    cirq.X(q3).with_classical_controls('b', sympy_cond),
    cirq.X(q4).with_classical_controls('b').with_classical_controls(sympy_cond),
    cirq.measure(q3, key='c'),
    cirq.measure(q4, key='d'),
)
print(circuit)
results = cirq.Simulator(seed=1).run(circuit, repetitions=8)
print(results.data)
```

First, remember that the value of a measurement key for multiple qubits will be an integer representative of the bit string of those qubits' measurements. You can see this in the data for `a`, the measurement key for both `q0` and `q1`, which has values in the range `[0, 3]`. The sympy condition `Eq(a, 0)` will then only trigger when both of those qubits individually measure `0`. 

This means that `X(q3).with_classical_controls('b', sympy_cond)` only triggers when `b`'s qubit `q2` measures `1` and `a = 0` is true (`q0` and `q1` measure `0`). This is consistent with the simulated results, for both `c` (`q3`'s key) and `d` (`q4`'s key).

Finally, the fact that `c` and `d` are always identical serves as a reminder that chaining multiple calls of `with_classical_controls()` together is equivalent to calling it once with multiple arguments.

## Variable scope

When used with `cirq.CircuitOperation`, classically controlled operations will be resolved using local repetition IDs, if any. This is the only way to create a non-global variable scope within a circuit. A simple example of this is shown below, where the controls inside and outside a subcircuit rely on measurements in their respective scopes:

```python
q0 = cirq.LineQubit(0)
subcircuit = cirq.FrozenCircuit(cirq.measure(q0, key='a'), cirq.X(q0).with_classical_controls('a'))
circuit = cirq.Circuit(
    cirq.measure(q0, key='a'),
    cirq.CircuitOperation(subcircuit, repetitions=2, use_repetition_ids=True),
    cirq.X(q0).with_classical_controls('a'),
)
print("Original Circuit")
print(circuit)
print("Circuit with nested circuit unrolled.")
print(cirq.CircuitOperation(cirq.FrozenCircuit(circuit)).mapped_circuit(deep=True))
```

The measurement key `a` is present both in the outer circuit and the `FrozenCircuit` nested within it, but these two keys are different due to their different scopes. After unrolling the inner circuit twice, these inner `a`s get prefixed by the repetition number and becomes new, separate measurement keys, `0:a` and `1:a`, that don't interact with each other or the original `a`. 

More complex scoping behavior is described in the [classically controlled operation tests](https://github.com/quantumlib/Cirq/blob/main/cirq-core/cirq/ops/classically_controlled_operation_test.py).

## Using with transformers

Cirq [transformers](../transform/transformers.ipynb) are aware of classical control and will avoid changes which move a control before its corresponding measurement. Additionally, for some simple cases the [`defer_measurements` transformer](https://github.com/quantumlib/Cirq/blob/6e0e164e8ac1c2f28a1f3389370fffb50a4d2a4f/cirq-core/cirq/transformers/measurement_transformers.py#L58) can convert a classically-controlled circuit into a purely-quantum circuit:

```python
q0 = cirq.LineQubit(0)
circuit = cirq.Circuit(
    cirq.measure(q0, key='a'), cirq.X(q1).with_classical_controls('a'), cirq.measure(q1, key='b')
)
deferred = cirq.defer_measurements(circuit)
print("Original circuit:")
print(circuit)
print("Measurement deferred:")
print(deferred)
```

## Compatibility

The Cirq built-in simulators provide support for classical control, but caution should be exercised when exporting these circuits to other environments. `ClassicallyControlledOperation` is fundamentally different from other operations in that it requires access to the measurement results, and simulators or hardware that do not explicitly support this will not be able to run `ClassicallyControlledOperation`s.
