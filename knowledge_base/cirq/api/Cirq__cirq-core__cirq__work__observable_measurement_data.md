---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/work/observable_measurement_data.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/work/observable_measurement_data.py
license: Apache-2.0
---

## `ObservableMeasuredResult`

```python
class ObservableMeasuredResult
```

The result of an observable measurement.

A list of these is returned by `measure_observables`, or see `flatten_grouped_results` for
transformation of `measure_grouped_settings` BitstringAccumulators into these objects.

This is a flattened form of the contents of a `BitstringAccumulator` which may group many
simultaneously-observable settings into one object. As such, `BitstringAccumulator` has more
advanced support for covariances between simultaneously-measured observables which is dropped
when you flatten into these objects.

Args:
    setting: The setting for which this object contains results
    mean: The mean of the observable specified by `setting`.
    variance: The variance of the observable specified by `setting`.
    repetitions: The number of circuit repetitions used to estimate `setting`.
    circuit_params: The parameters used to resolve the circuit used to prepare the state that
        is being measured.

### `as_dict`

```python
def as_dict(self) -> dict[str, Any]
```

Return the contents of this class as a dictionary.

This makes records suitable for construction of a Pandas dataframe. The circuit parameters
are flattened into the top-level of this dictionary.

## `BitstringAccumulator`

```python
class BitstringAccumulator
```

A mutable container of bitstrings and associated metadata populated
during a `measure_observables` run.

This object contains all raw results and can be serialized via JSON to
keep a record of your experiment results. There are also various
utility methods that can be used to chain a series of BitstringAccumulator
results into a form more suitable for analysis like a pandas DataFrame.

By default, this will be initialized empty. This should only be mutated
by calling `consume_results`. Do not mutate values directly.

Args:
    meas_spec: The specification with the particular run used to
        gather these bitstrings. There should be a 1-to-1 correspondence
        between bitstring accumulators and circuits run on a quantum
        sampler.
    simul_settings: The list of settings consistent with this
        measurement spec, usually the result of grouping a list
        of requested settings. This list need not be exhausted:
        any setting consistent with the `meas_spec` can be queried
        with methods that take a setting as argument (e.g. `mean`,
        `variance`) whether or not they are provided up-front in
        `simul_settings`. Those methods that do *not* take a setting
        as an argument (e.g. `means`, `variances`) will report all values
        for the settings in `simul_settings`.
    qubit_to_index: A mapping from qubits to contiguous indices starting
        from zero. This allows us to store bitstrings as a 2d numpy array.
    bitstrings: The bitstrings to record.
    chunksizes: This class accumulates bitstrings from potentially several
        "chunked" processor runs. Each chunk has a certain number of
        repetitions, recorded in this array. This theoretically
        allows you to re-split up the bitstring array should the need
        arise. The total number of repetitions is the sum of this 1d array.
    timestamps: We record a timestamp for each request/chunk. This
        1d array will have the same length as `chunksizes`.
    readout_calibration: The result of `calibrate_readout_error`. When requesting
        means and variances, if this is not `None`, we will use the
        calibrated value to correct the requested quantity. This is a
        `BitstringAccumulator` containing the results of measuring Z
        observables with readout symmetrization enabled. This class
        does *not* validate that both this parameter and the
        `BitstringAccumulator` under construction contain measurements taken
        with readout symmetrization turned on.

### `consume_results`

```python
def consume_results(self, bitstrings)
```

Add bitstrings sampled according to `meas_spec`.

We don't validate that bitstrings were sampled correctly according
to `meas_spec` (how could we?) so please be careful. Consider
using `measure_observables` rather than calling this method yourself.

### `results`

```python
def results(self) -> Iterable[ObservableMeasuredResult]
```

Yield individual setting results as `ObservableMeasuredResult`
objects.

### `records`

```python
def records(self)
```

Yield individual setting results as dictionary records.

This is suitable for passing to pd.DataFrame constructor, perhaps
after chaining these results with those from other BitstringAccumulators.

### `covariance`

```python
def covariance(self, *, atol=1e-08) -> np.ndarray
```

Compute the covariance matrix for the estimators of all settings.

Like `variance`, this is the covariance of the sampling distribution
of the sample mean. Practically, it is the 'normal' covariance
divided by the number of observations (bitstrings).

Args:
    atol: The absolute tolerance for asserting coefficients are real.

Raises:
    ValueError: If there are no measurements.

### `variance`

```python
def variance(self, setting: InitObsSetting, *, atol: float=1e-08)
```

Compute the variance of the estimators of the given setting.

This is the normal variance divided by the number of samples to estimate
the certainty of our estimate of the mean. It is the standard error
of the mean, squared.

This uses `ddof=1` during the call to `np.var` for an unbiased estimator
of the variance in a hypothetical infinite population for consistency
with `BitstringAccumulator.covariance()` but differs from the default
for `np.var`.

Args:
    setting: The initial state and observable.
    atol: The absolute tolerance for asserting coefficients are real.

Raises:
    ValueError: If there were no measurements.

### `stderr`

```python
def stderr(self, setting: InitObsSetting, *, atol: float=1e-08)
```

The standard error of the estimators for `setting`.

### `means`

```python
def means(self, *, atol: float=1e-08) -> np.ndarray
```

Estimates of the means of the settings in this accumulator.

### `mean`

```python
def mean(self, setting: InitObsSetting, *, atol: float=1e-08)
```

Estimates of the mean of `setting`.

## `flatten_grouped_results`

```python
def flatten_grouped_results(grouped_results: list[BitstringAccumulator]) -> list[ObservableMeasuredResult]
```

Flatten a collection of BitstringAccumulators into a list of ObservableMeasuredResult.

Raw results are contained in BitstringAccumulator which contains
structure related to how the observables were measured (i.e. their
grouping). This can be important for taking covariances into account.
This function removes that structure, giving a flat list of results
which may be easier to work with.

Args:
    grouped_results: A list of BitstringAccumulators, probably returned
        from `measure_observables` or `measure_grouped_settings`.
