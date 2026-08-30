---
framework: cirq
api_version: v1.7.0
doc_type: concept
source_path: docs/noise/qcvv/coherent_vs_incoherent_xeb.ipynb
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/docs/noise/qcvv/coherent_vs_incoherent_xeb.ipynb
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

# Coherent vs Incoherent Error with XEB

<table class="tfo-notebook-buttons" align="left">
  <td>
    <a target="_blank" href="https://quantumai.google/cirq/noise/qcvv/coherent_vs_incoherent_xeb>"><img src="https://quantumai.google/site-assets/images/buttons/quantumai_logo_1x.png" />View on QuantumAI</a>
  </td>
  <td>
    <a target="_blank" href="https://colab.research.google.com/github/quantumlib/Cirq/blob/main/docs/noise/qcvv/coherent_vs_incoherent_xeb.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/colab_logo_1x.png" />Run in Google Colab</a>
  </td>
  <td>
    <a target="_blank" href="https://github.com/quantumlib/Cirq/blob/main/docs/noise/qcvv/coherent_vs_incoherent_xeb.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/github_logo_1x.png" />View source on GitHub</a>
  </td>
  <td>
    <a href="https://storage.googleapis.com/tensorflow_docs/Cirq/docs/noise/qcvv/coherent_vs_incoherent_xeb.ipynb"><img src="https://quantumai.google/site-assets/images/buttons/download_icon_1x.png" />Download notebook</a>
  </td>
</table>

This notebook demonstrates how to use Cross-Entropy Benchmarking (XEB) end-to-end to compare coherent gate parameter error and incoherent depolarization error. It will mimic a small device graph of `cirq.GridQubit` pairs and simulate two-qubit XEB benchmarking circuits on them with noise models that introduce coherent and incoherent error before visualizing and comparing the results.

For more information on types of error, see [Average, Pauli and Incoherent Error](../../google/calibration.md#average-pauli-and-incoherent_error). 

For more information on noise and noise models, see [Noise](../).

For more information on how XEB works in detail, see [XEB Theory](./xeb_theory.ipynb) notebook.

## Setup

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

## Generate Random Circuits

First create a circuit library of 20 random, two-qubit circuits which uses `cirq.SQRT_ISWAP` as the entangling two-qubit gate, using `cirq.experiments.random_quantum_circuit_generation.generate_library_of_2q_circuits
`.

```python
from cirq.experiments import random_quantum_circuit_generation as rqcg

RANDOM_SEED = np.random.RandomState(53)

circuit_library = rqcg.generate_library_of_2q_circuits(
    n_library_circuits=20, two_qubit_gate=cirq.SQRT_ISWAP, random_state=RANDOM_SEED
)
max_depth = 100
cycle_depths = np.arange(3, max_depth, 20)
```

## Prepare Noise Models

To compare coherent and incoherent error, use two different noise models, which introduce coherent and incoherent error respectively. Also included are a noiseless model and a "fused" model that combines both coherent and incoherent error, for comparison. See [Noise](../) for the difference between coherent and incoherent error. 

The coherent noise model is represented by a perturbed `SQRT_ISWAP` gate, which implements a slightly different unitary than a true `SQRT_ISWAP`. Perturbed gates are caused by hardware losing its calibrated tuning, which typically occurres naturally over time between device calibrations. 

The incoherent noise model to be compared with is a `cirq.DepolarizingChannel`, representing a low chance (`5e-3`) for the state of each qubit to depolarize after an operation is performed on it, as if a random Pauli operator was applied to it.

An noiseless sampler simply has no noise. 

Finally, the `fused_sampler` adds both coherent and incoherent error to each moment of the circuit, applied in order, according to the `noisy_moment` function of the `FusedNoiseModel` class. It uses the same noise models as the coherent-only and incoherent-only models, perturbation and depolarization, but applies both in sequence. 

Start by creating the necessary elements to create the coherent and fused samplers. The following code shows how `SQRT_ISWAP` can be written as a specific `cirq.PhasedFSimGate`.

```python
# build sqrt_iswap gate from a phased fsim gate
sqrt_iswap_as_phased_fsim = cirq.PhasedFSimGate.from_fsim_rz(
    theta=-np.pi / 4, phi=0, rz_angles_before=(0, 0), rz_angles_after=(0, 0)
)

# check that the unitaries are the same
np.testing.assert_allclose(
    cirq.unitary(sqrt_iswap_as_phased_fsim), cirq.unitary(cirq.SQRT_ISWAP), atol=1e-8
)
```

Next, create a perturbed version of `SQRT_ISWAP`. Note the phi angle uniformly chosen in the range $[0, 2/16*\pi]$, which was previously `0`. Additionally, create the gate substitution function, `_sub_iswap`, which replaces `SQRT_ISWAP` gates in the simulated circuit with the perturbed version.

```python
from collections import defaultdict

phi_angles = defaultdict(lambda: RANDOM_SEED.uniform(low=0, high=2 / 16 * np.pi))


def _sub_iswap(op):
    if op.gate == cirq.SQRT_ISWAP:
        # add coherent error to the phi angle while creating a sqrt iswap gate
        perturbed_sqrt_iswap = cirq.PhasedFSimGate.from_fsim_rz(
            theta=-np.pi / 4,
            phi=phi_angles[op.qubits],
            rz_angles_before=(0, 0),
            rz_angles_after=(0, 0),
        )

        return perturbed_sqrt_iswap.on(*op.qubits)
    return op
```

For the "fused" model, create a `FusedNoiseModel` class, which applies multiple noise models in sequence to each moment. This will create a noise model which incorporates both coherent and incoherent noise.

```python
from typing import Sequence


class FusedNoiseModel(cirq.NoiseModel):
    """A noise model that applies other noise models in sequence"""

    def __init__(self, models: Sequence[cirq.NoiseModel]):
        self.models = models

    def noisy_moment(self, moment: 'cirq.Moment', system_qubits: Sequence['cirq.Qid']):
        """Produce a list of moments by applying each model in sequence to the available moments"""

        moments = [moment]
        for model in self.models:
            new_moments = []
            for moment in moments:
                ret = model.noisy_moment(moment, system_qubits)
                # handle constituent noise models returning lists of or singleton moments
                new_moments.extend([ret] if isinstance(ret, cirq.Moment) else ret)
            moments = new_moments
        return moments
```

Finally, initialize the noise model objects: 

1. For coherent error, use the `_sub_iswap` function to create a `cirq.GateSubstitutionNoiseModel`, which replaces the `SQRT_ISWAP` gate with the perturbed version. 

2. For incoherent error, create a `cirq.ConstantQubitNoiseModel` which depolarizes every qubit in the same way. 

3. The noiseless sampler will have a noise of `None`.

4. Build the fused noise model with the other two from the `FusedNoiseModel` class, applying each constituent noise model in sequence.

... and create the samplers with `cirq.DensityMatrixSimulator` for each noise model.

```python
# create noise models
coherent_noise = cirq.devices.noise_model.GateSubstitutionNoiseModel(_sub_iswap)
incoherent_noise = cirq.ConstantQubitNoiseModel(cirq.depolarize(5e-3))
noiseless = None
fused_noise = FusedNoiseModel([coherent_noise, incoherent_noise])

# create samplers by passing noise models to simulator constructor
coherent_sampler = cirq.DensityMatrixSimulator(noise=coherent_noise)
incoherent_sampler = cirq.DensityMatrixSimulator(noise=incoherent_noise)
noiseless_sampler = cirq.DensityMatrixSimulator(noise=noiseless)
fused_sampler = cirq.DensityMatrixSimulator(noise=fused_noise)

# from here on out, all experiment steps will be performed on
#   samplers and their results in the following order.
samplers = [coherent_sampler, incoherent_sampler, noiseless_sampler, fused_sampler]
noise_titles = ['Coherent', 'Incoherent', 'Noiseless', 'Fused']
```

## Mock a device topology

In order to more closely mimic XEB on real hardware, create a graph of qubits to mimic a small device from a couple `cirq.GridQubit`s. XEB benchmark circuits will be created to test multiple qubit pairs simultaneously on this graph, without overlap. 

In this example, only five of the six created qubits are used in order to produce an irregular/non-rectangular graph, and simplify simulation by using fewer qubits.

```python
import networkx as nx
import itertools

# a set of six example GridQubits
qubits = cirq.GridQubit.rect(3, 2, 4, 3)
# only use the first num_qubits many qubits
num_qubits = 5
qubits = qubits[:num_qubits]

# create graph from adjacent qubits
graph = nx.Graph((q1, q2) for (q1, q2) in itertools.combinations(qubits, 2) if q1.is_adjacent(q2))
pos = {q: (q.row, q.col) for q in qubits}
nx.draw_networkx(graph, pos=pos)
```

Set up the active qubit pair combinations for the sampler function.

```python
combs_by_layer = rqcg.get_random_combinations_for_device(
    n_library_circuits=len(circuit_library),
    n_combinations=10,
    device_graph=graph,
    random_state=RANDOM_SEED,
)
```

## Fidelity Data Collection
### Sample Circuits

The following call will zip together the `circuit_library` circuits according to `combs_by_layer` into larger circuits that evaluate multiple qubit pairs in parallel, before sampling them. Remember that `samplers` contains coherent and incoherent noise samplers, an errorless sampler, and a fused sampler. Mapping `sample_2q_xeb_circuits` to the list of samplers produces sampled data, generated with identical parameters except for the difference in noise model.

```python
import cirq.experiments.xeb_sampling as xeb_sampling
import cirq.experiments.xeb_fitting as xeb_fitting


# use the same circuit library, cycle depths, combinations by layer,
#   random seed and repetitions for both noise models' samplers.
def sample_df(sampler):
    return xeb_sampling.sample_2q_xeb_circuits(
        sampler=sampler,
        circuits=circuit_library,
        cycle_depths=cycle_depths,
        combinations_by_layer=combs_by_layer,
        shuffle=RANDOM_SEED,
        repetitions=1000,
    )


sampled_dfs = list(map(sample_df, samplers))
```

Compute the circuit fidelities from the sampled probabilities for each sampled dataset.

```python
# use the same circuit library and cycle_depths for both
#   noise models' sampled data.
def estimate_fidelities(sampled_df):
    return xeb_fitting.benchmark_2q_xeb_fidelities(
        sampled_df=sampled_df, circuits=circuit_library, cycle_depths=cycle_depths
    )


circuit_fidelities = list(map(estimate_fidelities, sampled_dfs))
```

Estimate the by-layer fidelities from the circuit fidelities for circuits of varying lengths for each set of fidelities.

```python
fitted_fidelities = list(map(xeb_fitting.fit_exponential_decays, circuit_fidelities))
```

## Visualizing Fidelity by Noise Model

### Qubit Pair Heatmaps
The following cell visualizes the by-cycle fidelity error in qubit pair heatmaps.

```python
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(13, 13))
for fidelities, ax, title in zip(fitted_fidelities, axes.flat, noise_titles):
    # pull out the by-layer/cycle fidelity and turn it into error with 1-fidelity.
    heatmap_data = {
        pair: (1.0 - layer_fid) for ((_, _, pair), layer_fid) in fidelities.layer_fid.items()
    }
    cirq.TwoQubitInteractionHeatmap(heatmap_data, vmin=0, vmax=0.025).plot(ax)

    ax.set_title(title)

fig.tight_layout()
fig.show()
```

The heatmaps reveal that the estimated error is quite similar when compared across qubits in the mock device. 

The coherent error heatmap shows the most variation in qubit pair fidelity error, though all values are within `0.003` of each other. The perturbed `SQRT_ISWAP` gate produces a consistent change in angle that interacts differently with the random single-qubit rotations added in the two-qubit circuits of the `circuit_library`, causing this variance.

The incoherent error heatmap shows little to no variation in error. This makes sense because incoherent depolarization error randomly depolarizes in all basis angles at approximately the same rate, meaning consistent error in all cases. Note here that the overall error introduced by the incoherent noise model is much larger than the error introduced by the coherent noise model.  

The errorless case, as expected, has effectively zero error for all qubit pairs, The tiny error seen is caused by rounding errors during simulation.

The fused case shows both the relatively higher error from the incoherent error case, and the higher variance from the coherent error case. Across all qubits, this case produces the highest error seen yet, which makes sense given that both error models are in use simultaneously.

### Circuit Fidelity by Cycle
The qubit pair heatmaps are good, but summarize the fidelity data too much to reveal meaningful patterns. To rectify this, graph the circuit fidelity by cycle, alongside an exponential decay curve from the by-cycle fidelity estimation. For reference, an exponential decay associated with the original depolarization chance of `5e-3` is included. 

First some graphing utilities:

```python
import seaborn as sns

# map colors to qubit pairs
colors = sns.cubehelix_palette(n_colors=graph.number_of_edges())
colors = dict(zip(graph.edges, colors))


def _p_gen(ax, rescale=False, decay=5e-3, color=None, colors=colors, label=None):
    """Create a _p function to graph circuit fidelities by layer.
    It encodes the visualization options:
    - rescale: rescale data under the exponential decay line to range [0,1].
    - decay: exponent defining the exponential decay reference line.
    - color: plot everything in given color, use by-qubit color map otherwise.
    - colors: the by-qubit color map.
    - label: label to give the data in the legend.
    """

    def _p(record):
        """For a row of a fidelity data frame, plot based on encoded options"""

        # pull fidelities from data frame row/record
        data = record.fidelities

        # plot horizontal at 1.0 fidelity
        ax.axhline(1, color='grey', ls='--')

        # compute exponential decay line from record parameters (a, layer_fid)
        # these were computed by previous fitting from fidelity data
        xx = np.linspace(0, record.cycle_depths.max())
        exp = xeb_fitting.exponential_decay(xx, a=record.a, layer_fid=record.layer_fid)

        # rescale data to expand area under exponential reference decay line
        # the range from zero to the reference line becomes the range [0, 1]
        # also plot that reference line in blue, which, once rescaled, is horizontal
        if rescale:
            data = data / ((1 - decay) ** (4 * record.cycle_depths))
            exp = exp / ((1 - decay) ** (4 * xx))
            ax.plot(xx, xx**0, label=r'Normalized Reference', color='blue')
        else:
            ax.plot(xx, (1 - decay) ** (4 * xx), label=r'Exponential Reference', color='blue')

        _, _, pair = record.name
        q0, q1 = pair
        # use qubit pair to color map if color is not supplied, else just use color
        plot_color = colors[pair] if color is None else color
        # use qubit pair as label if not supplied, else just use label
        plot_label = f'{q0}-{q1}' if label is None else label

        # plot the data with the selected color and label
        ax.plot(record.cycle_depths, data, 'o-', color=plot_color, label=plot_label)
        # also plot the data-fitted exponential line
        ax.plot(xx, exp, color=plot_color, alpha=0.3)

    return _p


def extras(ax, title):
    """Add labels, title and legend to an axis"""

    ax.set_ylabel('Circuit fidelity')
    ax.set_xlabel('Cycle Depth $d$')
    ax.set_title(title)
    # create a legend while making sure the handles are unique
    handles, labels = ax.get_legend_handles_labels()
    legend_items = dict(zip(labels, handles))
    ax.legend(legend_items.values(), legend_items.keys(), loc='best')
```

Then use them to graph the different datasets.

```python
fig, axes = plt.subplots(2, 2, figsize=(18, 13))
for fidelities, ax, title in zip(fitted_fidelities, axes.flat, noise_titles):
    fidelities.apply(_p_gen(ax), axis=1)
    extras(ax, title)

fig.tight_layout()
fig.show()
```

The first, coherent error case, once again demonstrates the significant variance in circuit fidelity across the different qubits. This time it also shows that the variance between qubits can itself vary with the number of cycles that have been executed, which wasn't visible in the per-cycle estimation from the heatmaps. Additionally, individual exponential decay curves are fit and shown faded out for each qubit. The data only loosely fits an exponential decay, so using an exponential decay to model this type of coherent gate perturbation error may be imprecise. 

For the incoherent depolarization noise data, very little variance is seen between qubits, and all of them very closely match the reference curve. This empirically reinforces the expectation that a pauli depolarization noise model produces an exponential decay in the overall circuit fidelity. 

Unsurprisingly, the noiseless data produces no decrease in fidelity. 

In the fused case, both coherent perturbation and incoherent depolarization error contribute to the lowest circuit fidelity out of all cases. The overall fidelity is noticeably worse than the exponential reference and the incoherent data, as if they've been added together. It shows meaningfully more variance between qubits than the incoherent data, and this variation somewhat follows the pattern seen in the coherent data, with more variance around cycles 40 and 80, and less near cycles 20 and 60. However, it's somewhat hard to see this pattern given that the data is squashed into the space below the exponential reference curve.

In the following plot, the fused data is shown, rescaled under the expected incoherent error's `5e-3` exponential decay, alongside the original coherent data.

```python
fig, axes = plt.subplots(1, 2, figsize=(18, 6.5), sharey=True)
two_fidelities = [fitted_fidelities[0], fitted_fidelities[3]]
titles = [r'Unscaled Coherent', r'Rescaled Fused']
for fidelities, rescale, ax, title in zip(two_fidelities, [False, True], axes.flat, titles):
    fidelities.apply(_p_gen(ax, rescale=rescale), axis=1)
    extras(ax, title)

fig.tight_layout()
fig.show()
```

The two graphs are almost identical, with the rescaled fused data demonstrating the same patterns of by-qubit and by-cycle variation as the coherent-only data. It seems that the rescaling has approximately eliminated the influence of the incoherent depolarization error portion from the fused error, leaving only the coherent perturbation error. 

However, the two graphs are not exactly identical; there are small differences in the measured fidelities. Remember, both of these datasets were generated with identical circuits, random seeds, and other parameters. The noiseless fidelities plot from before demonstrated that rounding errors produce extremely small variances in fidelities. Even scaled up, it seems as though rounding errors are not sufficient to explain the difference between the coherent and rescaled-fused data. Instead, it is likely that the incoherent and coherent error included in the fused fidelity data are not entirely independent of one another in these benchmarking circuits. They likely interact nontrivially, producing some overlapping or unique error cases that would be found by, respectively, both or neither error model in isolation.

## Characterize Gate Parameters

A classical optimizer can be used to approximate the two-qubit gate parameters that were actually used from the fidelity data. Here, the parameter of interest is the `phi` parameter, which is the one used to perturb `SQRT_ISWAP`. To characterize `phi`, flag it in the `SqrtISwapXEBOptions` object. Don't characterize the others parameters, for runtime reasons. This object, once passed into the optimizer wrapper `characterize_phased_fsim_parameters_with_xeb_by_pair`, denotes that the optimizer expects the two-qubit entangling gate used to be a `SQRT_ISWAP`, and that it will look for parameters to that gate (or the PhasedFSim version of it) which most closely replicate the observed fidelity data. 

In a real experiment, there are certainly additional kinds of coherent error. The following optimization procedure attempts to identify coherent error that produces a consistent change in the parameters of the circuits' two-qubit entangling gate, assuming it is in the `PhasedFSim` family. Other types of error, coherent and otherwise, may confound this process.

```python
import multiprocessing

pool = multiprocessing.get_context('spawn').Pool()
```

```python
# Set which angles to characterize (all)
options = xeb_fitting.SqrtISwapXEBOptions(
    characterize_theta=False,
    characterize_zeta=False,
    characterize_chi=False,
    characterize_gamma=False,
    characterize_phi=True,
)
# Parameterize the sqrt(iswap)s in circuit library
pcircuits = [xeb_fitting.parameterize_circuit(circuit, options) for circuit in circuit_library]


def characterization_result(sampled_df):
    # Run the characterization loop
    return xeb_fitting.characterize_phased_fsim_parameters_with_xeb_by_pair(
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

Perform the coherent error characterization on the sample data, across all used noise models.

Note: This cell will take 8 or so minutes to run on a default Google Colab instance.

```python
%%time
characterization_results = list(map(characterization_result, sampled_dfs))
```

Inspect the characterized parameters estimated for the coherent-only perturbation noise model. Note that, across all qubits, the characterization for the first, coherent error case, has correctly estimated the `phi` parameter to be in the range $[0, 2/16*\pi] = [0, 0.393]$, or very close to it.

```python
characterization_results[0].final_params
```

By additionally inspecting the original `phi_angles` used to add noise, you can see that the characterization was able to correctly estimate each qubit's individual phi value within about $\pm 0.04$ error.

```python
for qubits, phi in phi_angles.items():
    print(qubits, phi)
```

## Visualizing Refitted Fidelities by Noise Model

Finally, plot the original and refit circuit fidelities by cycle, with exponential decay curves, for each of the available datasets.

```python
fig, axes = plt.subplots(2, 2, figsize=(18, 13))
result_dfs = list(map(lambda x: x.fidelities_df, characterization_results))
result_fidelities = list(map(xeb_fitting.fit_exponential_decays, result_dfs))
before_dfs = fitted_fidelities
after_dfs = result_fidelities
for before_df, after_df, ax, title in zip(before_dfs, after_dfs, axes.flat, noise_titles):
    before_df.apply(_p_gen(ax, color='green', label=r'Original Fidelities'), axis=1)
    after_df.apply(_p_gen(ax, color='orange', label=r'Refit Fidelities'), axis=1)
    extras(ax, title)

fig.tight_layout()
fig.show()
```

In the coherent error case, the optimization was able to refit the fidelities very well. The new curves of the refit data almost perfectly match the horizontal line at `1.0` fidelity. The success of this refit means that the estimated parameters for this case are very likely to represent the actual parameters of the gate operation used, which was seen in the fact that the optimization re-discovered the `phi` value that was originally used to perturb `SQRT_ISWAP`. In the real hardware case, identifying these parameters means identifying what unitary the gate control hardware actually implemented. If this unitary is far from the intended one, hardware re-calibration or compensation must be performed in order to improve circuit fidelity. 

In constrast, the optimizer was completely unable to refit the circuit fidelities in the incoherent error case. The refit fidelities find no meaningful fidelity improvement, instead following the same, expected `5e-3` exponential decay as the original fidelities. Unsurprisingly, the optimizer was unable to find any coherent error in the incoherent-only fidelity data. 

The noiseless case also fails, but in a different way. Due to the fact that all of the original fidelities are extremely close to `1.0`, the optimization likely overvalues the miniscule differences in rounding error and overfits its model. 

The fused error case produces refit fidelities that are noticeably improved over the original ones, but only reach up to the exponential reference curve. It seems as though the optimization was able to detect and refit for the coherent error, but not the incoherent error. This means this parameter fitting procedure is still able to find improvements when multiple types of error are present. However, the fused graph again compacts all of the data under the exponential reference curve. The next cell performs the same rescaling as before to inspect the coherent error present in the fused data.

```python
fig, axes = plt.subplots(1, 2, figsize=(18, 6.5), sharey=True)
before_dfs = [fitted_fidelities[0], fitted_fidelities[3]]
after_dfs = [result_fidelities[0], result_fidelities[3]]
titles = [r'Unscaled Coherent', r'Rescaled Fused']
for before_df, after_df, ax, title, rescale in zip(
    before_dfs, after_dfs, axes.flat, titles, [False, True]
):
    before_df.apply(
        _p_gen(ax, color='green', label=r'Original Fidelities', rescale=rescale), axis=1
    )
    after_df.apply(_p_gen(ax, color='orange', label=r'Refit Fidelities', rescale=rescale), axis=1)
    extras(ax, title)

fig.tight_layout()
fig.show()
```

As noted, the optimizer is able to nearly perfectly refit the fidelities in the unscaled coherent error case. 

Rescaling the fused error data provides a similar result in the refit fidelities as in the original ones. The optimizer was unable to produce refit data with curves that follow the constant `1.0` line (which is the `5e-3` exponential decay curve when unscaled). Instead, the variety of orange refit curves around the blue reference line indicate that the presence of the incoherent error acts as a confounding variable to the optimizer, reducing its effectiveness noticeably. 

However, it still performed quite well overall, finding refit fidelities that are significantly better than the original ones. Additionally, the patterns of variance between qubits are similar between the refit fidelities of the coherent and rescaled data. This may imply that the optimizer is finding similar patterns of coherent error in the fused data as in the coherent-only data. Finally, the optimizer was able to identify the coherent error, even though the incoherent error was roughly an order of magnitude larger.

## Conclusion

Cross-Entropy Benchmarking and optimizer refitting has been shown here to effectively characterize patterns of coherent error, to find the (parameters of the) true unitary operation used on individual qubit pairs. Importantly, this is effective even in the case where incoherent error is also acting on the system, but with noticeably reduced accuracy. In a real hardware system, with many interacting sources of error, XEB can still be useful to identify consistent coherent error, but it's important to remember that other error can confound these results.

## What's Next?

Now that you've identified coherent error, what can you do about it? 
- Depending on the parameter(s) identified to be out of tune, you may be able to change the circuits you want to run to compensate for that change.
- In the real hardware case, the device may need to be re-calibrated in order to fix the tuning of particular gate operations on particular qubits. Reach out to your Google contact to let us know!
