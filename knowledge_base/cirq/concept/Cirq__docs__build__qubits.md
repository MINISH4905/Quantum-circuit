---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/build/qubits.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/build/qubits.ipynb
license: Apache-2.0
---

```python
# @title Copyright 2020 The Cirq Developers
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

# Qubits

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/build/qubits"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/build/qubits.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/build/qubits.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/build/qubits.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
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

A qubit is the basic unit of quantum information, a quantum bit: a two level system that can exist in superposition of those two possible states. Cirq also supports higher dimensional systems, so called [qudits](qudits.ipynb) that we won't cover here.

In Cirq, a `Qubit` is nothing else than an abstract object that has an identifier, a `cirq.Qid` and some other potential metadata to represent device specific properties that can be used to validate a circuit.
In contrast to real qubits, the Cirq qubit does not have any state. The reason for this is that the actual state of the qubits is maintained in the quantum processor, or, in case of simulation, in the simulated state vector.

```python
qubit = cirq.NamedQubit("myqubit")

# creates an equal superposition of |0> and |1> when simulated
circuit = cirq.Circuit(cirq.H(qubit))

# see the "myqubit" identifier at the left of the circuit
print(circuit)

# run simulation
result = cirq.Simulator().simulate(circuit)

print("result:")
print(result)
```

### Qubit types

There are 3 main qubit types in Cirq:

- `cirq.NamedQubit` - an abstract qubit that only has a name, nothing else. Use this when you don't need anything else and you don't need to create too many qubits in bulk.
- `cirq.LineQubit` - a qubit that is identified by an integer index in a line. Some devices have lines of qubits, `LineQubit` can be useful to represent that. Also `cirq.LineQubit.range(3)` is a very easy way to create 3 qubits.  
- `cirq.GridQubit` - a qubit that is placed on a grid and is identified by the 2D coordinates. Most of Google's chips are represented using `GridQubit`s. 

Some providers provide their own qubit types. For example Pasqal defines a `TwoDQubit` and a `ThreeDQubit` to represent the specific topology of neutral atoms when validating circuits.
