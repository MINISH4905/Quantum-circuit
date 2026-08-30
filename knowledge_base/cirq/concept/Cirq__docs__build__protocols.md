---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/build/protocols.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/build/protocols.ipynb
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

# Protocols

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/build/protocols"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/build/protocols.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/build/protocols.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/build/protocols.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
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

# Introduction

Cirq's protocols are very similar concept to Python's built-in protocols that were introduced in [PEP 544](https://www.python.org/dev/peps/pep-0544/).
Python's built-in protocols are extremely convenient. For example, behind all the for loops and list comprehensions you can find the Iterator protocol.
As long as an object has the `__iter__()` magic method that returns an iterator object, it has iterator support.
An iterator object has to define `__iter__()` and `__next__()` magic methods, that defines the iterator protocol.
The `iter(val)` builtin function returns an iterator for `val` if it defines the above methods, otherwise throws a `TypeError`. Cirq protocols work similarly.

A canonical Cirq protocol example is the `unitary` protocol that allows to check the unitary matrix of values that support the protocol by calling `cirq.unitary(val)`.

```python
print(cirq.X)
print("cirq.X unitary:\n", cirq.unitary(cirq.X))

a, b = cirq.LineQubit.range(2)
circuit = cirq.Circuit(cirq.X(a), cirq.Y(b))
print(circuit)
print("circuit unitary:\n", cirq.unitary(circuit))
```

When an object does not support a given protocol, an error is thrown.

```python
try:
    print(cirq.unitary(a))  ## error!
except Exception as e:
    print("As expected, a qubit does not have a unitary. The error: ")
    print(e)
```

## What is a protocol? 

A protocol is a combination of the following two items: 
- a `SupportsXYZ` class, which defines and documents all the magic functions that need to be implemented in order to support that given protocol 
- the entrypoint function(s), which are exposed to the main cirq namespace as `cirq.xyz()`

Note: While the protocol is technically both of these things, we refer to the public utility functions interchangeably as protocols. See the list of them below.


## Cirq's protocols

For a complete list of Cirq protocols, refer to the `cirq.protocols` package. 
Here we provide a list of frequently used protocols for debugging, simulation and testing.


| Protocol | Description | 
|----------|-------|
|`cirq.act_on`| Allows an object (operations or gates) to act on a state, particularly within simulators. |
|`cirq.apply_channel`| High performance evolution under a channel evolution. |
|`cirq.apply_mixture`| High performance evolution under a mixture of unitaries evolution. |
|`cirq.apply_unitaries`| Apply a series of unitaries onto a state tensor. |
|`cirq.apply_unitary`| High performance left-multiplication of a unitary effect onto a tensor. |
|`cirq.approx_eq`| Approximately compares two objects. |
|`cirq.circuit_diagram_info`| Retrieves information for drawing operations within circuit diagrams. |
|`cirq.commutes`| Determines whether two values commute. |
|`cirq.control_keys`| Gets the keys that the value is classically controlled by. |
|`cirq.definitely_commutes`| Determines whether two values definitely commute. |
|`cirq.decompose`| Recursively decomposes a value into `cirq.Operation`s meeting a criteria. |
|`cirq.decompose_once`| Decomposes a value into operations, if possible. |
|`cirq.decompose_once_with_qubits`| Decomposes a value into operations on the given qubits. |
|`cirq.equal_up_to_global_phase`| Determine whether two objects are equal up to global phase. |
|`cirq.has_kraus`| Returns whether the value has a Kraus representation. |
|`cirq.has_mixture`| Returns whether the value has a mixture representation. |
|`cirq.has_stabilizer_effect`| Returns whether the input has a stabilizer effect. |
|`cirq.has_unitary`| Determines whether the value has a unitary effect. |
|`cirq.inverse`| Returns the inverse `val**-1` of the given value, if defined. |
|`cirq.is_measurement`| Determines whether or not the given value is a measurement. |
|`cirq.is_parameterized`| Returns whether the object is parameterized with any Symbols. |
|`cirq.kraus`| Returns a Kraus representation of the given channel. |
|`cirq.measurement_key`| Get the single measurement key for the given value. |
|`cirq.measurement_keys`| Gets the measurement keys of measurements within the given value. |
|`cirq.mixture`| Return a sequence of tuples representing a probabilistic unitary. |
|`cirq.num_qubits`| Returns the number of qubits, qudits, or qids `val` operates on. |
|`cirq.parameter_names`| Returns parameter names for this object. |
|`cirq.parameter_symbols`| Returns parameter symbols for this object. |
|`cirq.pauli_expansion`| Returns coefficients of the expansion of val in the Pauli basis. |
|`cirq.phase_by`| Returns a phased version of the effect. |
|`cirq.pow`| Returns `val**factor` of the given value, if defined. |
|`cirq.qasm`| Returns QASM code for the given value, if possible. |
|`cirq.qid_shape`| Returns a tuple describing the number of quantum levels of each |
|`cirq.quil`| Returns the QUIL code for the given value. |
|`cirq.read_json`| Read a JSON file that optionally contains cirq objects. |
|`cirq.resolve_parameters`| Resolves symbol parameters in the effect using the param resolver. |
|`cirq.to_json`| Write a JSON file containing a representation of obj. |
|`cirq.trace_distance_bound`| Returns a maximum on the trace distance between this effect's input |
|`cirq.trace_distance_from_angle_list`| Given a list of arguments of the eigenvalues of a unitary matrix, |
|`cirq.unitary`| Returns a unitary matrix describing the given value. |
|`cirq.validate_mixture`| Validates that the mixture's tuple are valid probabilities. |


### Quantum operator representation protocols

The following family of protocols is an important and frequently used set of features of Cirq and it is worthwhile mentioning them and how they interact with each other. They are, in the order of increasing generality:

* `*unitary`
* `*kraus`
* `*mixture`

All these protocols make it easier to work with different representations of quantum operators, namely: 
- finding that representation (`unitary`, `kraus`, `mixture`), 
- determining whether the operator has that representation (`has_*`) 
- and applying them (`apply_*`) on a state vector. 

#### Unitary 

The `*unitary` protocol is the least generic, as only unitary operators should implement it. The `cirq.unitary` function returns the matrix representation of the operator in the computational basis. We saw an example of the unitary protocol above, but let's see the unitary matrix of the Pauli-Y operator as well:

```python
print(cirq.unitary(cirq.Y))
```

#### Mixture 

The `*mixture` protocol should be implemented by operators that are _unitary-mixtures_. These probabilistic operators are represented by a list of tuples ($p_i$, $U_i$), where each unitary effect $U_i$ occurs with a certain probability $p_i$, and $\sum p_i = 1$. Probabilities are a Python float between 0.0 and 1.0, and the unitary matrices are numpy arrays.

Constructing simple probabilistic gates in Cirq is easiest with the `with_probability` method.

```python
probabilistic_x = cirq.X.with_probability(0.3)

for p, op in cirq.mixture(probabilistic_x):
    print(f"probability: {p}")
    print("operator:")
    print(op)
```

In case an operator does not implement `SupportsMixture`, but does implement `SupportsUnitary`, `*mixture` functions fall back to the `*unitary` methods. It is easy to see that a unitary operator $U$ is just a "mixture" of a single unitary with probability $p=1$.

```python
# cirq.Y has a unitary effect but does not implement SupportsMixture
# thus mixture protocols will return ((1, cirq.unitary(Y)))
print(cirq.mixture(cirq.Y))
print(cirq.has_mixture(cirq.Y))
```

#### Channel 


The `kraus` representation is the operator sum representation of a quantum operator (a channel):  

$$
  \rho \rightarrow \sum_{k=0}^{r-1} A_k \rho A_k^\dagger
$$

These matrices are required to satisfy the trace preserving condition

$$
        \sum_{k=0}^{r-1} A_k^\dagger A_k = I
$$

where $I$ is the identity matrix. The matrices $A_k$ are sometimes called Kraus or noise operators.
    
The `cirq.kraus` returns a tuple of numpy arrays, one for each of the Kraus operators:

```python
cirq.kraus(cirq.DepolarizingChannel(p=0.3))
```

In case the operator does not implement `SupportsKraus`, but it does implement `SupportsMixture`, the `*kraus` protocol will generate the Kraus operators based on the  `*mixture` representation. 

$$
((p_0, U_0),(p_1, U_1),\ldots,(p_n, U_n)) \rightarrow (\sqrt{p_0}U_0, \sqrt{p_1}U_1, \ldots, \sqrt{p_n}U_n)
$$

Thus for example `((0.25, X), (0.75, I)) -> (0.5 X, sqrt(0.75) I)`:

```python
cirq.kraus(cirq.X.with_probability(0.25))
```

In the simplest case of a unitary operator, `cirq.kraus` returns a one-element tuple with the same unitary as returned by `cirq.unitary`:

```python
print(cirq.kraus(cirq.Y))
print(cirq.unitary(cirq.Y))
print(cirq.has_kraus(cirq.Y))
```
