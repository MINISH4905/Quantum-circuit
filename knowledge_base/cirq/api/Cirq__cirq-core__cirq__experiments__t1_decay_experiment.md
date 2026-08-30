---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/experiments/t1_decay_experiment.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/experiments/t1_decay_experiment.py
license: Apache-2.0
---

## `t1_decay`

```python
def t1_decay(sampler: cirq.Sampler, *, qubit: cirq.Qid, num_points: int, max_delay: cirq.DURATION_LIKE, min_delay: cirq.DURATION_LIKE=None, repetitions: int=1000) -> cirq.experiments.T1DecayResult
```

Runs a t1 decay experiment.

Initializes a qubit into the |1⟩ state, waits for a variable amount of time,
and measures the qubit. Plots how often the |1⟩ state is observed for each
amount of waiting.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    qubit: The qubit under test.
    num_points: The number of evenly spaced delays to test.
    max_delay: The largest delay to test.
    min_delay: The smallest delay to test. Defaults to no delay.
    repetitions: The number of repetitions of the circuit for each delay.

Returns:
    A T1DecayResult object that stores and can plot the data.

Raises:
    ValueError: If the supplied parameters are not valid: negative repetitions,
        max delay less than min, or min delay less than 0.

## `T1DecayResult`

```python
class T1DecayResult
```

Results from a Rabi oscillation experiment.

### `__init__`

```python
def __init__(self, data: pd.DataFrame)
```

Inits T1DecayResult.

Args:
    data: A data frame with three columns:
        delay_ns, false_count, true_count.

### `data`

```python
def data(self) -> pd.DataFrame
```

A data frame with delay_ns, false_count, true_count columns.

### `constant`

```python
def constant(self) -> float
```

The t1 decay constant.

### `plot`

```python
def plot(self, ax: plt.Axes | None=None, include_fit: bool=False, **plot_kwargs: Any) -> plt.Axes
```

Plots the excited state probability vs the amount of delay.

Args:
    ax: the plt.Axes to plot on. If not given, a new figure is created,
        plotted on, and shown.
    include_fit: boolean to include exponential decay fit on graph
    **plot_kwargs: Arguments to be passed to 'plt.Axes.plot'.

Returns:
    The plt.Axes containing the plot.
