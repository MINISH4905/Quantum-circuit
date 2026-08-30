---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/simulate/qvm_builder_code.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/simulate/qvm_builder_code.ipynb
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

# QVM Creation Template

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/simulate/qvm_builder_code"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/simulate/qvm_builder_code.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/simulate/qvm_builder_code.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/simulate/qvm_builder_code.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

This notebook includes a couple of clean and succinct code blocks that you can build on or copy and paste elsewhere in order to make use of the [Quantum Virtual Machine](./quantum_virtual_machine.ipynb) without worrying about how it works inside.

## **Install** Cirq and qsim

```python
# @title Install `cirq_google` and `qsimcirq`

try:
    import cirq
    import cirq_google
except ImportError:
    print("installing cirq...")
    !pip install --quiet cirq-google
    print("installed cirq.")
    import cirq
    import cirq_google

try:
    import qsimcirq
except ImportError:
    print("installing qsimcirq...")
    !pip install --quiet qsimcirq
    print(f"installed qsimcirq.")
    import qsimcirq

import time
```

## Create a **Quantum Virtual Machine**.

Instantiate a `cirq.SimulatedLocalEngine` that uses the [Virtual Engine Interface](./virtual_engine_interface.ipynb).

```python
# @title Choose a processor ("willow_pink" or "rainbow" or "weber")
# (see cirq_google.engine.list_virtual_processors() for available names)
processor_id = "willow_pink"  # @param {type:"string"}

# Instantiate an engine.
sim_engine = cirq_google.engine.create_default_noisy_quantum_virtual_machine(
    processor_id=processor_id, simulator_class=qsimcirq.QSimSimulator
)
print(
    "Your quantum virtual machine",
    processor_id,
    "is ready, here is the qubit grid:",
    "\n========================\n",
)
print(sim_engine.get_processor(processor_id).get_device())
```

## **Create** a device-ready circuit.

To learn how to create a device ready circuit, have a look at the [QVM Circuit Preparation](./qvm_basic_example.ipynb) page.

```python
# create your device ready circuit here!
q0 = cirq.GridQubit(6, 3)
your_circuit = cirq.Circuit([(cirq.X**0.5)(q0), cirq.measure(q0)])
print(your_circuit)
```

## **Execute** Your circuit on the Quantum Virtual Machine.

```python
# @title Enter the name of your device ready circuit and execute it on the Quantum Virtual Machine
circuit = your_circuit  # @param

reps = 3000
start = time.time()
results = sim_engine.get_sampler(processor_id).run(circuit, repetitions=reps)
elapsed = time.time() - start

print('Circuit successfully executed on your quantum virtual machine', processor_id)
print(f'QVM runtime: {elapsed:.04g}s ({reps} reps)')
print('You can now print or plot "results"')
```

```python
print(f"measurements: {results.histogram(key=q0)}")
```
