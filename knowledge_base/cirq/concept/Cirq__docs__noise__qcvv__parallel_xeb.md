---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/noise/qcvv/parallel_xeb.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/noise/qcvv/parallel_xeb.ipynb
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
    <a target="_blank" href="https://quantumai.google/cirq/noise/qcvv/parallel_xeb"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/noise/qcvv/parallel_xeb.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/noise/qcvv/parallel_xeb.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/noise/qcvv/parallel_xeb.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
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

# Parallel XEB
This notebook demonstrates how to use the functionality in `cirq.experiments` to run parallel XEB end-to-end. "Parallel" means we characterize multiple pairs simultaneously.

```python
import cirq
import numpy as np

%matplotlib inline
from matplotlib import pyplot as plt
```

# Parallel XEB with library functions
The entire XEB workflow can be run by calling `cirq.experiments.parallel_two_qubit_xeb` and the combined single-qubit randomized benchmarking (RB) and XEB workflows can be run by calling `cirq.experiments.run_rb_and_xeb`.

```python
# Simulation
qubits = cirq.GridQubit.rect(3, 2, 4, 3)
result = cirq.experiments.parallel_two_qubit_xeb(
    sampler=cirq.DensityMatrixSimulator(
        noise=cirq.depolarize(5e-3), dtype=np.complex128
    ),  # Any simulator or a ProcessorSampler.
    qubits=qubits,
)
```

```python
# The returned result is an instance of the `TwoQubitXEBResult` class which provides visualization methods like
result.plot_heatmap()
# plot the heatmap of XEB errors
result.plot_fitted_exponential(*qubits[:2])
# plot the fitted model of xeb error of a qubit pair.
result.plot_histogram();  # plot a histogram of all xeb errors.
```

```python
# `TwoQubitXEBResult` also has methods to retrieve errors.
print('pauli errors:', result.pauli_error())
print('xeb errors:', result.xeb_error(*qubits[:2]))
print('xeb fidelity:', result.xeb_fidelity(*qubits[:2]))
```

The `run_rb_and_xeb` method returns an object of type [InferredXEBResult](https://github.com/quantumlib/Cirq/blob/bc766606b94744f80da435c522d16a34529ae671/cirq-core/cirq/experiments/two_qubit_xeb.py#L188C7-L188C24) which is like [TwoQubitXEBResult](https://github.com/quantumlib/Cirq/blob/bc766606b94744f80da435c522d16a34529ae671/cirq-core/cirq/experiments/two_qubit_xeb.py#L56) except that it removes the single-qubit errors obtained from the single-qubit randomized benchmarking (RB) experiment to isolate the error from the two qubit gate.

# Step by step XEB
The rest of this notebook explains how the `parallel_two_qubit_xeb` works internally. Note that the notebook uses `SQRT_ISWAP` as the entangling gate while `parallel_two_qubit_xeb` and `run_rb_and_xeb` default to `CZ`.

## Set up Random Circuits

We create a library of 10 random, two-qubit `circuits` using the sqrt(ISWAP) gate. These library circuits will be mixed-and-matched among all the pairs on the device we aim to characterize.

```python
from cirq.experiments import random_quantum_circuit_generation as rqcg

circuit_library = rqcg.generate_library_of_2q_circuits(
    n_library_circuits=20, two_qubit_gate=cirq.ISWAP**0.5, random_state=52
)
print(len(circuit_library))
```

```python
# We will truncate to these lengths
max_depth = 100
cycle_depths = np.arange(3, max_depth, 20)
cycle_depths
```

## Determine the device topology

We will run on all pairs from a given device topology. Below, you can supply a `device_name` if you're authenticated to run on Google QCS. In that case, we will get the device object from the cloud endpoint and turn it into a graph of qubits. Otherwise, we mock a device graph by allocating arbitrary `cirq.GridQubit`s to turn into a graph.

```python
device_name = None  # change me!

import cirq.contrib.routing as ccr
import networkx as nx

if device_name is None:
    qubits = cirq.GridQubit.rect(3, 2, 4, 3)
    # Delete one qubit from the rectangular arangement to
    # 1) make it irregular 2) simplify simulation.
    qubits = qubits[:-1]
    sampler = cirq.DensityMatrixSimulator(noise=cirq.depolarize(5e-3))
    graph = ccr.gridqubits_to_graph_device(qubits)
else:
    import cirq_google as cg

    sampler = cg.get_engine_sampler(device_name, gate_set_name='sqrt_iswap')
    device = cg.get_engine_device(device_name)
    qubits = sorted(device.qubits)
    graph = ccr.gridqubits_to_graph_device(device.qubits)


pos = {q: (q.row, q.col) for q in qubits}
nx.draw_networkx(graph, pos=pos)
```

## Set up our combinations
We take the library of two-qubit circuits in `circuit_library` and mix-and-match to sampled in parallel.

We will pass `combs_by_layer` and `circuit_library` to the sampling function which will "zip" the circuits according to these combinations. The outer list corresponds to the four `cirq.GridInteractionLayer`s (one of four for the degree-four GridQubit-implied graph). The inner `combinations` matrix is a `(n_combinations, n_pairs)` ndarray of integers which index into the circuit library.

```python
combs_by_layer = rqcg.get_random_combinations_for_device(
    n_library_circuits=len(circuit_library), n_combinations=10, device_graph=graph, random_state=53
)
combs_by_layer
```

### Visualize
Here, we draw the four layers' active pairs.

```python
fig, axes = plt.subplots(2, 2, figsize=(9, 6))
for comb_layer, ax in zip(combs_by_layer, axes.reshape(-1)):
    active_qubits = np.array(comb_layer.pairs).reshape(-1)
    colors = ['red' if q in active_qubits else 'blue' for q in graph.nodes]
    nx.draw_networkx(graph, pos=pos, node_color=colors, ax=ax)
    nx.draw_networkx_edges(
        graph, pos=pos, edgelist=comb_layer.pairs, width=3, edge_color='red', ax=ax
    )

plt.tight_layout()
```

## Take Data

The following call will execute the zipped circuits and sample bitstrings.

```python
from cirq.experiments.xeb_sampling import sample_2q_xeb_circuits

sampled_df = sample_2q_xeb_circuits(
    sampler=sampler,
    circuits=circuit_library,
    cycle_depths=cycle_depths,
    combinations_by_layer=combs_by_layer,
    shuffle=np.random.RandomState(52),
    repetitions=10_000,
)
sampled_df
```

## Benchmark Fidelities

```python
from cirq.experiments.xeb_fitting import benchmark_2q_xeb_fidelities

fids = benchmark_2q_xeb_fidelities(
    sampled_df=sampled_df, circuits=circuit_library, cycle_depths=cycle_depths
)
fids
```

```python
from cirq.experiments.xeb_fitting import fit_exponential_decays, exponential_decay

fidelities = fit_exponential_decays(fids)
```

```python
heatmap_data = {}

for (_, _, pair), fidelity in fidelities.layer_fid.items():
    heatmap_data[pair] = 1.0 - fidelity

cirq.TwoQubitInteractionHeatmap(heatmap_data).plot();
```

```python
for i, record in fidelities.iterrows():
    plt.axhline(1, color='grey', ls='--')
    plt.plot(record['cycle_depths'], record['fidelities'], 'o')
    xx = np.linspace(0, np.max(record['cycle_depths']))
    plt.plot(xx, exponential_decay(xx, a=record['a'], layer_fid=record['layer_fid']))
    plt.show()
```

```python
import seaborn as sns

# Give each pair its own color
colors = sns.cubehelix_palette(n_colors=graph.number_of_edges())
colors = dict(zip(graph.edges, colors))

# Exponential reference
xx = np.linspace(0, fids['cycle_depth'].max())
plt.plot(xx, (1 - 5e-3) ** (4 * xx), label=r'Exponential Reference', color='black')


# Plot each pair
def _p(fids):
    q0, q1 = fids.name
    plt.plot(
        fids['cycle_depth'],
        fids['fidelity'],
        'o-',
        label=f'{q0}-{q1}',
        color=colors[fids.name],
        alpha=0.5,
    )


fids.groupby('pair').apply(_p)

plt.ylabel('Circuit fidelity')
plt.xlabel('Cycle Depth $d$')
plt.legend(loc='best')
plt.tight_layout()
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
    characterize_phased_fsim_parameters_with_xeb_by_pair,
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
pcircuits = [parameterize_circuit(circuit, options) for circuit in circuit_library]

# Run the characterization loop
characterization_result = characterize_phased_fsim_parameters_with_xeb_by_pair(
    sampled_df,
    pcircuits,
    cycle_depths,
    options,
    pool=pool,
    # ease tolerance so it converges faster:
    fatol=1e-2,
    xatol=1e-2,
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
for i, row in before_after_df.iterrows():
    plt.axhline(1, color='grey', ls='--')
    plt.plot(row['cycle_depths_0'], row['fidelities_0'], '*', color='red')
    plt.plot(row['cycle_depths_c'], row['fidelities_c'], 'o', color='blue')

    xx = np.linspace(0, np.max(row['cycle_depths_0']))
    plt.plot(
        xx,
        exponential_decay(xx, a=row['a_0'], layer_fid=row['layer_fid_0']),
        color='red',
        label=f'f_0 = {row["layer_fid_0"]:.3f}',
    )
    plt.plot(
        xx,
        exponential_decay(xx, a=row['a_c'], layer_fid=row['layer_fid_c']),
        color='blue',
        label=f'f_c = {row["layer_fid_c"]:.3f}',
    )

    plt.xlabel('Cycle Depth')
    plt.ylabel('Fidelity')
    plt.legend(loc='best')
    plt.tight_layout()
    plt.show()
```
