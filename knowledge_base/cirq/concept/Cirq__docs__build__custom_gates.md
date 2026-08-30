---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/build/custom_gates.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/build/custom_gates.ipynb
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

# Custom gates

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/build/custom_gates"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/build/custom_gates.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/build/custom_gates.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/build/custom_gates.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
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
```

Standard gates such as Pauli gates and `CNOT`s are defined in `cirq.ops` as described [here](gates.ipynb). To use a unitary which is not a standard gate in a circuit, one can create a custom gate as described in this guide.

## General pattern

Gates are classes in Cirq. To define custom gates, we inherit from a base gate class and define a few methods.

The general pattern is to:

  - Inherit from `cirq.Gate`.
  - Define one of the `_num_qubits_` or `_qid_shape_` methods.
  - Define one of the `_unitary_` or `_decompose_` methods.
  

> *Note*: Methods beginning and ending with one or more underscores are *magic methods* and are used by Cirq's protocols or built-in Python functions. More information about magic methods is included at the end of this guide.

We demonstrate these patterns via the following examples.

## From a unitary

One can create a custom Cirq gate from a unitary matrix in the following manner. Here, we define a gate which corresponds to the unitary


$$ U = \frac{1}{\sqrt{2}} \left[ \begin{matrix} 1 & 1 \\ -1 & 1 \end{matrix} \right] . $$

```python
"""Define a custom single-qubit gate."""


class MyGate(cirq.Gate):
    def __init__(self):
        super(MyGate, self)

    def _num_qubits_(self):
        return 1

    def _unitary_(self):
        return np.array([[1.0, 1.0], [-1.0, 1.0]]) / np.sqrt(2)

    def _circuit_diagram_info_(self, args):
        return "G"


my_gate = MyGate()
```

In this example, the `_num_qubits_` method tells Cirq that this gate acts on a single-qubit, and the `_unitary_` method defines the unitary of the gate. The `_circuit_diagram_info_` method tells Cirq how to display the gate in a circuit, as we will see below.

Once this gate is defined, it can be used like any standard gate in Cirq.

```python
"""Use the custom gate in a circuit."""

circ = cirq.Circuit(my_gate.on(cirq.LineQubit(0)))

print("Circuit with custom gates:")
print(circ)
```

When we print the circuit, we see the symbol we specified in the `_circuit_diagram_info_` method.

Circuits with custom gates can be simulated in the same manner as circuits with standard gates.

```python
"""Simulate a circuit with a custom gate."""

sim = cirq.Simulator()

res = sim.simulate(circ)
print(res)
```

```python
"""Define a custom two-qubit gate."""


class AnotherGate(cirq.Gate):
    def __init__(self):
        super(AnotherGate, self)

    def _num_qubits_(self):
        return 2

    def _unitary_(self):
        return np.array(
            [
                [1.0, -1.0, 0.0, 0.0],
                [0.0, 0.0, 1.0, 1.0],
                [1.0, 1.0, 0.0, 0.0],
                [0.0, 0.0, 1.0, -1.0],
            ]
        ) / np.sqrt(2)

    def _circuit_diagram_info_(self, args):
        return "Top wire symbol", "Bottom wire symbol"


this_gate = AnotherGate()
```

Here, the `_circuit_diagram_info_` method returns two symbols (one for each wire) since it is a two-qubit gate.

```python
"""Use the custom two-qubit gate in a circuit."""

circ = cirq.Circuit(this_gate.on(*cirq.LineQubit.range(2)))

print("Circuit with custom two-qubit gate:")
print(circ)
```

As above, this circuit can also be simulated in the expected way.

### With parameters

Custom gates can be defined and used with parameters. For example, to define the gate

$$ R(\theta) = \left[ \begin{matrix} \cos \theta & \sin \theta \\ \sin \theta & - \cos \theta \end{matrix} \right], $$

we can do the following.

```python
"""Define a custom gate with a parameter."""


class RotationGate(cirq.Gate):
    def __init__(self, theta):
        super(RotationGate, self)
        self.theta = theta

    def _num_qubits_(self):
        return 1

    def _unitary_(self):
        return np.array(
            [[np.cos(self.theta), np.sin(self.theta)], [np.sin(self.theta), -np.cos(self.theta)]]
        ) / np.sqrt(2)

    def _circuit_diagram_info_(self, args):
        return f"R({self.theta})"
```

This gate can be used in a circuit as shown below.

```python
"""Use the custom gate in a circuit."""

circ = cirq.Circuit(RotationGate(theta=0.1).on(cirq.LineQubit(0)))

print("Circuit with a custom rotation gate:")
print(circ)
```

## From a known decomposition

Custom gates can also be defined from a known decomposition (of gates). This is useful, for example, when groups of gates appear repeatedly in a circuit, or when a standard decomposition of a gate into primitive gates is known.

We show an example below of a custom swap gate defined from a known decomposition of three CNOT gates.

```python
class MySwap(cirq.Gate):
    def __init__(self):
        super(MySwap, self)

    def _num_qubits_(self):
        return 2

    def _decompose_(self, qubits):
        a, b = qubits
        yield cirq.CNOT(a, b)
        yield cirq.CNOT(b, a)
        yield cirq.CNOT(a, b)

    def _circuit_diagram_info_(self, args):
        return ["CustomSWAP"] * self.num_qubits()


my_swap = MySwap()
```

The `_decompose_` method yields the operations which implement the custom gate. (One can also return a list of operations instead of a generator.)

When we use this gate in a circuit, the individual gates in the decomposition do not appear in the circuit. Instead, the `_circuit_diagram_info_` appears in the circuit. As mentioned, this can be useful for interpreting circuits at a higher level than individual (primitive) gates.

```python
"""Use the custom gate in a circuit."""

qreg = cirq.LineQubit.range(2)
circ = cirq.Circuit(cirq.X(qreg[0]), my_swap.on(*qreg))

print("Circuit:")
print(circ)
```

We can simulate this circuit and verify it indeed swaps the qubits.

```python
"""Simulate the circuit."""

sim.simulate(circ)
```

## More on magic methods and protocols

As mentioned, methods such as `_unitary_` which we have seen are known as "magic
methods." Much of Cirq relies on "magic methods", which are methods prefixed with one or
two underscores and used by Cirq's protocols or built-in Python methods.
For instance,  Python translates `cirq.Z**0.25` into
`cirq.Z.__pow__(0.25)`.  Other uses are specific to cirq and are found in the
protocols subdirectory.  They are defined below.

At minimum, you will need to define either the ``_num_qubits_`` or
``_qid_shape_`` magic method to define the number of qubits (or qudits) used
in the gate.

### Standard Python magic methods

There are many standard magic methods in Python.  Here are a few of the most
important ones used in Cirq:
  * `__str__` for user-friendly string output and  `__repr__` is the Python-friendly string output, meaning that `eval(repr(y))==y` should always be true.
  * `__eq__` and `__hash__` which define whether objects are equal or not.  You
  can also use `cirq.value.value_equality` for objects that have a small list
  of sub-values that can be compared for equality.
  * Arithmetic functions such as `__pow__`, `__mul__`, `__add__` define the
  action of `**`, `*`, and `+` respectively.
   
### `cirq.num_qubits` and `def _num_qubits_`

A `Gate` must implement the `_num_qubits_` (or `_qid_shape_`) method.
This method returns an integer and is used by `cirq.num_qubits` to determine
how many qubits this gate operates on.

### `cirq.qid_shape` and `def _qid_shape_`

A qudit gate or operation must implement the `_qid_shape_` method that returns a
tuple of integers.  This method is used to determine how many qudits the gate or
operation operates on and what dimension each qudit must be.  If only the
`_num_qubits_` method is implemented, the object is assumed to operate only on
qubits. Callers can query the qid shape of the object by calling
`cirq.qid_shape` on it. See [qudit documentation](qudits.ipynb) for more
information.

### `cirq.unitary` and `def _unitary_`

When an object can be described by a unitary matrix, it can expose that unitary
matrix by implementing a `_unitary_(self) -> np.ndarray` method.
Callers can query whether or not an object has a unitary matrix by calling
`cirq.unitary` on it.
The `_unitary_` method may also return `NotImplemented`, in which case
`cirq.unitary` behaves as if the method is not implemented.

### `cirq.decompose` and `def _decompose_`

Operations and gates can be defined in terms of other operations by implementing
a `_decompose_` method that returns those other operations. Operations implement
`_decompose_(self)` whereas gates implement `_decompose_(self, qubits)`
(since gates don't know their qubits ahead of time).

The main requirements on the output of `_decompose_` methods are:

1. DO NOT CREATE CYCLES. The `cirq.decompose` method will iterative decompose until it finds values satisfying a `keep` predicate. Cycles cause it to enter an infinite loop.
2. Head towards operations defined by Cirq, because these operations have good decomposition methods that terminate in single-qubit and two qubit gates.
These gates can be understood by the simulator, optimizers, and other code.
3. All that matters is functional equivalence.
Don't worry about staying within or reaching a particular gate set; it's too hard to predict what the caller will want. Gate-set-aware decomposition is useful, but *this is not the protocol that does that*.
Instead, use features available in the [transformer API](../transform/transformers.ipynb#compiling_to_nisq_targets_cirqcompilationtargetgateset).

For example, `cirq.CCZ` decomposes into a series of `cirq.CNOT` and `cirq.T` operations.
This allows code that doesn't understand three-qubit operation to work with `cirq.CCZ`; by decomposing it into operations they do understand.
As another example, `cirq.TOFFOLI` decomposes into a `cirq.H` followed by a `cirq.CCZ` followed by a `cirq.H`.
Although the output contains a three qubit operation (the CCZ), that operation can be decomposed into two qubit and one qubit operations.
So code that doesn't understand three qubit operations can deal with Toffolis by decomposing them, and then decomposing the CCZs that result from the initial decomposition.

In general, decomposition-aware code consuming operations is expected to recursively decompose unknown operations until the code either hits operations it understands or hits a dead end where no more decomposition is possible.
The `cirq.decompose` method implements logic for performing exactly this kind of recursive decomposition.
Callers specify a `keep` predicate, and optionally specify intercepting and fallback decomposers, and then `cirq.decompose` will repeatedly decompose whatever operations it was given until the operations satisfy the given `keep`.
If `cirq.decompose` hits a dead end, it raises an error.

Cirq doesn't make any guarantees about the "target gate set" decomposition is heading towards.
`cirq.decompose` is not a method
Decompositions within Cirq happen to converge towards X, Y, Z, CZ, PhasedX, specified-matrix gates, and others.
But this set will vary from release to release, and so it is important for consumers of decompositions to look for generic properties of gates,
such as "two qubit gate with a unitary matrix", instead of specific gate types such as CZ gates.

### `cirq.inverse` and `__pow__`

Gates and operations are considered to be *invertible* when they implement a `__pow__` method that returns a result besides `NotImplemented` for an exponent of -1.
This inverse can be accessed either directly as `value**-1`, or via the utility method `cirq.inverse(value)`.
If you are sure that `value` has an inverse, saying `value**-1` is more convenient than saying `cirq.inverse(value)`.
`cirq.inverse` is for cases where you aren't sure if `value` is invertible, or where `value` might be a *sequence* of invertible operations.

`cirq.inverse` has a `default` parameter used as a fallback when `value` isn't invertible.
For example, `cirq.inverse(value, default=None)` returns the inverse of `value`, or else returns `None` if `value` isn't invertible.
(If no `default` is specified and `value` isn't invertible, a `TypeError` is raised.)

When you give `cirq.inverse` a list, or any other kind of iterable thing, it will return a sequence of operations that (if run in order) undoes the operations of the original sequence (if run in order).
Basically, the items of the list are individually inverted and returned in reverse order.
For example, the expression `cirq.inverse([cirq.S(b), cirq.CNOT(a, b)])` will return the tuple `(cirq.CNOT(a, b), cirq.S(b)**-1)`.

Gates and operations can also return values beside `NotImplemented` from their `__pow__` method for exponents besides `-1`.
This pattern is used often by Cirq.
For example, the square root of X gate can be created by raising `cirq.X` to 0.5:

```python
print(cirq.unitary(cirq.X))
# prints
# [[0.+0.j 1.+0.j]
#  [1.+0.j 0.+0.j]]

sqrt_x = cirq.X**0.5
print(cirq.unitary(sqrt_x))
# prints
# [[0.5+0.5j 0.5-0.5j]
#  [0.5-0.5j 0.5+0.5j]]
```

The Pauli gates included in Cirq use the convention ``Z**0.5 ≡ S ≡ np.diag(1, i)``, ``Z**-0.5 ≡ S**-1``, ``X**0.5 ≡ H·S·H``, and the square root of ``Y`` is inferred via the right hand rule.

### `_circuit_diagram_info_(self, args)` and `cirq.circuit_diagram_info(val, [args], [default])`

Circuit diagrams are useful for visualizing the structure of a `Circuit`.
Gates can specify compact representations to use in diagrams by implementing a `_circuit_diagram_info_` method.
For example, this is why SWAP gates are shown as linked '×' characters in diagrams.

The `_circuit_diagram_info_` method takes an `args` parameter of type `cirq.CircuitDiagramInfoArgs` and returns either
a string (typically the gate's name), a sequence of strings (a label to use on each qubit targeted by the gate), or an
instance of `cirq.CircuitDiagramInfo` (which can specify more advanced properties such as exponents and will expand
in the future).

You can query the circuit diagram info of a value by passing it into `cirq.circuit_diagram_info`.
