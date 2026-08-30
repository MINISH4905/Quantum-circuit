---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/hardware/aqt/getting_started.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/hardware/aqt/getting_started.ipynb
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

# AQT Cirq Tutorial

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/hardware/aqt/getting_started"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/hardware/aqt/getting_started.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/hardware/aqt/getting_started.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/hardware/aqt/getting_started.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
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

[AQT](https://www.aqt.eu) supports Cirq as a third party software development kit and offers access to quantum computing devices and simulators in the backend. Visit [www.aqt.eu](https://www.aqt.eu/qc-systems/) to find available resources and information on how to get access to them.

After the Cirq installation has finished successfully, you are ready to use the offline simulator or different backends through the use of an access token and the corresponding parameters, as in the following getting started tutorial.

## Use your AQT credentials

```python
import cirq
from cirq.aqt.aqt_device import get_aqt_device
from cirq.aqt.aqt_sampler import AQTSampler

access_token = 'MY_TOKEN'
```

Where `MY_TOKEN` is your access token for the AQT Arnica API. Then you can retrieve the information which workspaces and quantum resources are available for you:

```python
AQTSampler.fetch_resources(access_token)
```

Then you can specify the workspace and resource you want to send your quantum circuits to.

```python
workspace = 'WORKSPACE_NAME'
resource = 'RESOURCE_NAME'
aqt_sampler = AQTSampler(workspace=workspace, resource=resource, access_token=access_token)

device, qubits = get_aqt_device(2)
print(device)
```

## Sample a quantum circuit

You can then use that device in Cirq. For example, preparing the Bell state

$$ |\psi\rangle=\frac{1}{\sqrt{2}}(|00\rangle-\mathrm{i}|11\rangle) $$

by writing

```python
circuit = cirq.Circuit(cirq.XX(qubits[0], qubits[1]) ** 0.5)
device.validate_circuit(circuit)
print(circuit, qubits)
```

This circuit can then be sampled on the real-hardware backend as well as on a simulator.

```python
aqt_sweep = aqt_sampler.run(circuit, repetitions=100)
print(aqt_sweep)
```

**Note:** At the moment, the ```run()``` method of the AQTSampler implicitly performs measurements on all qubits at the end of the circuit, so explicit measurement operations aren't _required_. In fact, using explicit measurements apart from _exactly one at the end_ will cause the AQTSampler to fail. More fine-grained measurement operations will be added to the AQT Arnica API in the future.

## Offline simulation of AQT devices

The AQT simulators are capable of running ideal simulations (without a noise model) and real simulations (with a noise model) of a quantum circuit. Using a simulator with noise model allows you to estimate the performance of running a circuit on the real hardware. Switching between the two simulation types is done by setting the simulate_ideal flag, as in the example below.

For running a simulation without noise model use

```python
from cirq.aqt.aqt_sampler import AQTSamplerLocalSimulator

aqt_sampler = AQTSamplerLocalSimulator(simulate_ideal=True)
```

whereas for a simulation with noise model use

```python
from cirq.aqt.aqt_sampler import AQTSamplerLocalSimulator

aqt_sampler = AQTSamplerLocalSimulator(simulate_ideal=False)
```

Then you can use the Sampler Simulator as you would the regular one, for example:

```python
aqt_sweep = aqt_sampler.run(circuit, repetitions=100)
print(aqt_sweep)
```
