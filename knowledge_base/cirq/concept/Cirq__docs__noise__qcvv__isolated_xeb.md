---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/noise/qcvv/isolated_xeb.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/noise/qcvv/isolated_xeb.ipynb
license: Apache-2.0
---

##### Copyright 2021 The Cirq Developers

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

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/noise/qcvv/isolated_xeb"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/noise/qcvv/isolated_xeb.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/noise/qcvv/isolated_xeb.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/noise/qcvv/isolated_xeb.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
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

# Isolated XEB

This notebook demonstrates how to use the functionality in `cirq.experiments` to run Isolated XEB end-to-end. "Isolated" means we do one pair of qubits at a time.

```python
import cirq
import numpy as np
```

## Set up Random Circuits

We create a library of 20 random, two-qubit `circuits` using the sqrt(ISWAP) gate on the two qubits we've chosen.

```python
from cirq.experiments import random_quantum_circuit_generation as rqcg

circuits = rqcg.generate_library_of_2q_circuits(
    n_library_circuits=20,
    two_qubit_gate=cirq.ISWAP**0.5,
    q0=cirq.GridQubit(4, 4),
    q1=cirq.GridQubit(4, 5),
)
print(len(circuits))
```

```python
# We will truncate to these lengths
max_depth = 100
cycle_depths = np.arange(3, max_depth, 20)
cycle_depths
```

### Set up a `Sampler`.

For demonstration, we'll use a density matrix simulator to sample noisy samples. However, input a `device_name` (and have an authenticated Google Cloud project name set as your `GOOGLE_CLOUD_PROJECT` environment variable) to run on a real device.

```python
device_name = None  # change me!

if device_name is None:
    sampler = cirq.DensityMatrixSimulator(noise=cirq.depolarize(5e-3))
else:
    import cirq_google as cg

    sampler = cg.get_engine_sampler(device_name, gate_set_name='sqrt_iswap')
    device = cg.get_engine_device(device_name)

    import cirq.contrib.routing as ccr

    graph = ccr.gridqubits_to_graph_device(device.qubits)
    pos = {q: (q.row, q.col) for q in graph.nodes}
    import networkx as nx

    nx.draw_networkx(graph, pos=pos)
```

## Take Data

```python
from cirq.experiments.xeb_sampling import sample_2q_xeb_circuits

sampled_df = sample_2q_xeb_circuits(
    sampler=sampler, circuits=circuits, cycle_depths=cycle_depths, repetitions=10_000
)
sampled_df
```

## Benchmark fidelities

```python
from cirq.experiments.xeb_fitting import benchmark_2q_xeb_fidelities

fids = benchmark_2q_xeb_fidelities(
    sampled_df=sampled_df, circuits=circuits, cycle_depths=cycle_depths
)
fids
```

```python
%matplotlib inline
from matplotlib import pyplot as plt

# Exponential reference
xx = np.linspace(0, fids['cycle_depth'].max())
plt.plot(xx, (1 - 5e-3) ** (4 * xx), label=r'Exponential Reference')


def _p(fids):
    plt.plot(fids['cycle_depth'], fids['fidelity'], 'o-', label=fids.name)


fids.name = 'Sampled'
_p(fids)

plt.ylabel('Circuit fidelity')
plt.xlabel('Cycle Depth $d$')
plt.legend(loc='best')
```

## Optimize `PhasedFSimGate` parameters

We know what circuits we requested, and in this simulated example, we know what coherent error has happened. But in a real experiment, there is likely unknown coherent error that you would like to characterize. Therefore, we make the five angles in `PhasedFSimGate` free parameters and use a classical optimizer to find which set of parameters best describes the data we collected from the noisy simulator (or device, if this was a real experiment).

```python
import multiprocessing

pool = multiprocessing.get_context('spawn').Pool()
```

```python
from cirq.experiments.xeb_fitting import (
    parameterize_circuit,
    characterize_phased_fsim_parameters_with_xeb,
    SqrtISwapXEBOptions,
)

# Set which angles we want to characterize (all)
options = SqrtISwapXEBOptions(
    characterize_theta=True,
    characterize_zeta=True,
    characterize_chi=True,
    characterize_gamma=True,
    characterize_phi=True,
)
# Parameterize the sqrt(iswap)s in our circuit library
pcircuits = [parameterize_circuit(circuit, options) for circuit in circuits]

# Run the characterization loop
characterization_result = characterize_phased_fsim_parameters_with_xeb(
    sampled_df,
    pcircuits,
    cycle_depths,
    options,
    pool=pool,
    # ease tolerance so it converges faster:
    fatol=5e-3,
    xatol=5e-3,
)
```

```python
characterization_result.final_params
```

```python
characterization_result.fidelities_df
```

```python
from cirq.experiments.xeb_fitting import before_and_after_characterization

before_after_df = before_and_after_characterization(fids, characterization_result)
before_after_df
```

```python
from cirq.experiments.xeb_fitting import exponential_decay

for i, row in before_after_df.iterrows():
    plt.axhline(1, color='grey', ls='--')
    plt.plot(row['cycle_depths_0'], row['fidelities_0'], '*', color='red')
    plt.plot(row['cycle_depths_c'], row['fidelities_c'], 'o', color='blue')

    xx = np.linspace(0, np.max(row['cycle_depths_0']))
    plt.plot(xx, exponential_decay(xx, a=row['a_0'], layer_fid=row['layer_fid_0']), color='red')
    plt.plot(xx, exponential_decay(xx, a=row['a_c'], layer_fid=row['layer_fid_c']), color='blue')

    plt.show()
```
