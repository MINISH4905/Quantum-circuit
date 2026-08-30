---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/experiments/single_qubit_readout_calibration.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/experiments/single_qubit_readout_calibration.py
license: Apache-2.0
---

## Module `cirq-core/cirq/experiments/single_qubit_readout_calibration.py`

Single qubit readout experiments using parallel or isolated statistics.

## `SingleQubitReadoutCalibrationResult`

```python
class SingleQubitReadoutCalibrationResult
```

Result of estimating single qubit readout error.

Attributes:
    zero_state_errors: A dictionary from qubit to probability of measuring
        a 1 when the qubit is initialized to |0⟩.
    one_state_errors: A dictionary from qubit to probability of measuring
        a 0 when the qubit is initialized to |1⟩.
    repetitions: The number of repetitions that were used to estimate the
        probabilities.
    timestamp: The time the data was taken, in seconds since the epoch.

### `plot_heatmap`

```python
def plot_heatmap(self, axs: tuple[plt.Axes, plt.Axes] | None=None, annotation_format: str='0.1%', **plot_kwargs: Any) -> tuple[plt.Axes, plt.Axes]
```

Plot a heatmap of the readout errors. If qubits are not cirq.GridQubits, throws an error.

Args:
    axs: a tuple of the plt.Axes to plot on. If not given, a new figure is created,
        plotted on, and shown.
    annotation_format: The format string for the numbers in the heatmap.
    **plot_kwargs: Arguments to be passed to 'cirq.Heatmap.plot()'.
Returns:
    The two plt.Axes containing the plot.

Raises:
    ValueError: axs does not contain two plt.Axes
    TypeError: qubits are not cirq.GridQubits

### `plot_integrated_histogram`

```python
def plot_integrated_histogram(self, ax: plt.Axes | None=None, cdf_on_x: bool=False, axis_label: str='Readout error rate', semilog: bool=True, median_line: bool=True, median_label: str | None='median', mean_line: bool=False, mean_label: str | None='mean', show_zero: bool=False, title: str | None=None, **kwargs) -> plt.Axes
```

Plot the readout errors using cirq.integrated_histogram().

Args:
    ax: The axis to plot on. If None, we generate one.
    cdf_on_x: If True, flip the axes compared the above example.
    axis_label: Label for x axis (y-axis if cdf_on_x is True).
    semilog: If True, force the x-axis to be logarithmic.
    median_line: If True, draw a vertical line on the median value.
    median_label: If drawing median line, optional label for it.
    mean_line: If True, draw a vertical line on the mean value.
    mean_label: If drawing mean line, optional label for it.
    title: Title of the plot. If None, we assign "N={len(data)}".
    show_zero: If True, moves the step plot up by one unit by prepending 0
        to the data.
    **kwargs: Kwargs to forward to `ax.step()`. Some examples are
        color: Color of the line.
        linestyle: Linestyle to use for the plot.
        lw: linewidth for integrated histogram.
        ms: marker size for a histogram trace.
Returns:
    The axis that was plotted on.

### `readout_result_for_qubits`

```python
def readout_result_for_qubits(self, readout_qubits: list[ops.Qid]) -> SingleQubitReadoutCalibrationResult
```

Builds a calibration result for the specific readout qubits.

## `estimate_single_qubit_readout_errors`

```python
def estimate_single_qubit_readout_errors(sampler: cirq.Sampler, *, qubits: Iterable[cirq.Qid], repetitions: int=1000) -> SingleQubitReadoutCalibrationResult
```

Estimate single-qubit readout error.

For each qubit, prepare the |0⟩ state and measure. Calculate how often a 1
is measured. Also, prepare the |1⟩ state and calculate how often a 0 is
measured. The state preparations and measurements are done in parallel,
i.e., for the first experiment, we actually prepare every qubit in the |0⟩
state and measure them simultaneously.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    qubits: The qubits being tested.
    repetitions: The number of measurement repetitions to perform.

Returns:
    A SingleQubitReadoutCalibrationResult storing the readout error
    probabilities as well as the number of repetitions used to estimate
    the probabilities. Also stores a timestamp indicating the time when
    data was finished being collected from the sampler.

## `estimate_parallel_single_qubit_readout_errors`

```python
def estimate_parallel_single_qubit_readout_errors(sampler: cirq.Sampler, *, qubits: Iterable[cirq.Qid], trials: int=20, repetitions: int=1000, trials_per_batch: int | None=None, bit_strings: np.ndarray | None=None) -> SingleQubitReadoutCalibrationResult
```

Estimate single qubit readout error using parallel operations.

For each trial, prepare and then measure a random computational basis
bitstring on qubits using gates in parallel.
Returns a SingleQubitReadoutCalibrationResult which can be used to
compute readout errors for each qubit.

Args:
    sampler: The `cirq.Sampler` used to run the circuits.
    qubits: The qubits being tested.
    repetitions: The number of measurement repetitions to perform for
        each trial.
    trials: The number of bitstrings to prepare.
    trials_per_batch:  If provided, split the experiment into batches
        with this number of trials in each batch.
    bit_strings: Optional numpy array of shape (trials, qubits) where the
        first dimension is the number of the trial and the second
        dimension is the qubit (ordered by the qubit order from
        the qubits parameter).  Each value should be a 0 or 1 which
        specifies which state the qubit should be prepared into during
        that trial.  If not provided, the function will generate random
        bit strings for you.

Returns:
    A SingleQubitReadoutCalibrationResult storing the readout error
    probabilities as well as the number of repetitions used to estimate
    the probabilities. Also stores a timestamp indicating the time when
    data was finished being collected from the sampler.  Note that,
    if there did not exist a trial where a given qubit was set to |0〉,
    the zero-state error will be set to `nan` (not a number).  Likewise
    for qubits with no |1〉trial and one-state error.

Raises:
    ValueError: If the number of trials, repetitions, or trials_per batch is
        negative, or if bit_strings is not a numpy array or of the wrong
        shape.
