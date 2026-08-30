---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/experiments/t2_decay_experiment.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/experiments/t2_decay_experiment.py
license: Apache-2.0
---

## `t2_decay`

```python
def t2_decay(sampler: cirq.Sampler, *, qubit: cirq.Qid, experiment_type: ExperimentType=ExperimentType.RAMSEY, num_points: int, max_delay: cirq.DURATION_LIKE, min_delay: cirq.DURATION_LIKE=None, repetitions: int=1000, delay_sweep: study.Sweep | None=None, num_pulses: list[int] | None=None) -> cirq.experiments.T2DecayResult
```

Runs a t2 transverse relaxation experiment.

Initializes a qubit into a superposition state, evolves the system using
rules determined by the experiment type and by the delay parameters,
then rotates back for measurement.  This will measure the phase decoherence
decay.  This experiment has three types of T2 metrics, each which measure
a different slice of the noise spectrum.

For the Ramsey experiment type (often denoted T2*), the state will be
prepared with a square root Y gate (`cirq.Y ** 0.5`) and then waits for
a variable amount of time.  After this time, it will do basic state
tomography to measure the expectation of the Pauli-X and Pauli-Y operators
by performing either a `cirq.Y ** -0.5` or `cirq.X ** 0.5`.  The square of
these two measurements is summed to determine the length of the Bloch
vector. This experiment measures the phase decoherence of the system under
free evolution.

For the Hahn echo experiment (often denoted T2 or spin echo), the state
will also be prepared with a square root Y gate (`cirq.Y ** 0.5`).
However, during the mid-point of the delay time being measured, a pi-pulse
(`cirq.X`) gate will be applied to cancel out inhomogeneous dephasing.
The same method of measuring the final state as Ramsey experiment is applied
after the second half of the delay period.  See the animation on the wiki
page https://en.wikipedia.org/wiki/Spin_echo for a visual illustration
of this experiment.

CPMG, or the Carr-Purcell-Meiboom-Gill sequence, involves using a sqrt(Y)
followed by a sequence of pi pulses (X gates) in a specific timing pattern:

    π/2, t, π, 2t, π, ... 2t, π, t

The first pulse, a sqrt(Y) gate, will put the qubit's state on the Bloch
equator.  After a delay, successive X gates will refocus dehomogenous
phase effects by causing them to precess in opposite directions and
averaging their effects across the entire pulse train.

This pulse pattern has two variables that can be adjusted.  The first,
denoted as 't' in the above sequence, is delay, which can be specified
with `delay_min` and `delay_max` or by using a `delay_sweep`, similar to
the other experiments.  The second variable is the number of pi pulses
(X gates).  This can be specified as a list of integers using the
`num_pulses` parameter.  If multiple different pulses are specified,
the data will be presented in a data frame with two
indices (delay_ns and num_pulses).

See the following reference for more information about CPMG pulse trains:
Meiboom, S., and D. Gill, “Modified spin-echo method for measuring nuclear
relaxation times”, Rev. Sci. Inst., 29, 688–691 (1958).
https://doi.org/10.1063/1.1716296

Note that interpreting T2 data is fairly tricky and subtle, as it can
include other effects that need to be accounted for.  For instance,
amplitude damping (T1) will present as T2 noise and needs to be
appropriately compensated for to find a true measure of T2.  Due to this
subtlety and lack of standard way to interpret the data, the fitting
of the data to an exponential curve and the extrapolation of an actual
T2 time value is left as an exercise to the reader.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    qubit: The qubit under test.
    experiment_type: The type of T2 test to run.
    num_points: The number of evenly spaced delays to test.
    max_delay: The largest delay to test.
    min_delay: The smallest delay to test. Defaults to no delay.
    repetitions: The number of repetitions of the circuit
         for each delay and for each tomography result.
    delay_sweep: Optional range of time delays to sweep across.  This should
         be a SingleSweep using the 'delay_ns' with values in integer number
         of nanoseconds.  If specified, this will override the max_delay and
         min_delay parameters.  If not specified, the experiment will sweep
         from min_delay to max_delay with linear steps.
    num_pulses: For CPMG, a list of the number of pulses to use.
         If multiple pulses are specified, each will be swept on.

Returns:
    A T2DecayResult object that stores and can plot the data.

Raises:
    ValueError: If invalid parameters are specified, negative repetitions, max
        less than min durations, negative min delays, or an unsupported experiment
        configuraiton.

## `T2DecayResult`

```python
class T2DecayResult
```

Results from a T2 decay experiment.

This object is a container for the measurement results in each basis
for each amount of delay.  These can be used to calculate Pauli
expectation values, length of the Bloch vector, and various fittings of
the data to calculate estimated T2 phase decay times.

### `__init__`

```python
def __init__(self, x_basis_data: pd.DataFrame, y_basis_data: pd.DataFrame)
```

Inits T2DecayResult.

Args:
    x_basis_data: Data frame in x basis with three columns: delay_ns,
        false_count, and true_count.
    y_basis_data: Data frame in y basis with three columns: delay_ns,
        false_count,  and true_count.

Raises:
    ValueError: If the supplied data does not have the proper columns.

### `expectation_pauli_x`

```python
def expectation_pauli_x(self) -> pd.DataFrame
```

A data frame with delay_ns, value columns.

This value contains the expectation of the Pauli X operator as
estimated by measurement outcomes.

### `expectation_pauli_y`

```python
def expectation_pauli_y(self) -> pd.DataFrame
```

A data frame with delay_ns, value columns.

This value contains the expectation of the Pauli X operator as
estimated by measurement outcomes.

### `plot_expectations`

```python
def plot_expectations(self, ax: plt.Axes | None=None, **plot_kwargs: Any) -> plt.Axes
```

Plots the expectation values of Pauli operators versus delay time.

Args:
    ax: the plt.Axes to plot on. If not given, a new figure is created,
        plotted on, and shown.
    **plot_kwargs: Arguments to be passed to 'plt.Axes.plot'.

Returns:
    The plt.Axes containing the plot.

### `plot_bloch_vector`

```python
def plot_bloch_vector(self, ax: plt.Axes | None=None, **plot_kwargs: Any) -> plt.Axes
```

Plots the estimated length of the Bloch vector versus time.

This plot estimates the Bloch Vector by squaring the Pauli expectation
value of X and adding it to the square of the Pauli expectation value of
Y.  This essentially projects the state into the XY plane.

Note that Z expectation is not considered, since T1 related amplitude
damping will generally push this value towards |0>
(expectation <Z> = -1) which will significantly distort the T2 numbers.

Args:
    ax: the plt.Axes to plot on. If not given, a new figure is created,
        plotted on, and shown.
    **plot_kwargs: Arguments to be passed to 'plt.Axes.plot'.

Returns:
    The plt.Axes containing the plot.
