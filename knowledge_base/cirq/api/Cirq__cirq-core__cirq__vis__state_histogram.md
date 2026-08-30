---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/vis/state_histogram.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/vis/state_histogram.py
license: Apache-2.0
---

## Module `cirq-core/cirq/vis/state_histogram.py`

Tool to visualize the results of a study.

## `get_state_histogram`

```python
def get_state_histogram(result: result.Result) -> np.ndarray
```

Computes a state histogram from a single result with repetitions.

Args:
    result: The trial result containing measurement results from which the
            state histogram should be computed.

Returns:
    The state histogram (a numpy array) corresponding to the trial result.

## `plot_state_histogram`

```python
def plot_state_histogram(data: result.Result | collections.Counter | Sequence[SupportsFloat], ax: plt.Axes | None=None, *, tick_label: Sequence[str] | None=None, xlabel: str | None='qubit state', ylabel: str | None='result count', title: str | None='Result State Histogram') -> plt.Axes
```

Plot the state histogram from either a single result with repetitions or
   a histogram computed using `result.histogram()` or a flattened histogram
   of measurement results computed using `get_state_histogram`.

Args:
    data:   The histogram values to plot. Possible options are:
            `result.Result`: Histogram is computed using
                `get_state_histogram` and all 2 ** num_qubits values are
                plotted, including 0s.
            `collections.Counter`: Only (key, value) pairs present in
                collection are plotted.
            `Sequence[SupportsFloat]`: Values in the input sequence are
                plotted. i'th entry corresponds to height of the i'th
                bar in histogram.
    ax:      The Axes to plot on. If not given, a new figure is created,
             plotted on, and shown.
    tick_label: Tick labels for the histogram plot in case input is not
                `collections.Counter`. By default, label for i'th entry
                 is |i>.
    xlabel:  Label for the x-axis.
    ylabel:  Label for the y-axis.
    title:   Title of the plot.

Returns:
    The axis that was plotted on.
