---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/work/observable_measurement.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/work/observable_measurement.py
license: Apache-2.0
---

## `StoppingCriteria`

```python
class StoppingCriteria(abc.ABC)
```

An abstract object that queries a BitstringAccumulator to figure out
whether that `meas_spec` is complete.

### `more_repetitions`

```python
def more_repetitions(self, accumulator: BitstringAccumulator) -> int
```

Return the number of additional repetitions to take.

StoppingCriteria should be respectful and have some notion of a
maximum number of repetitions per chunk.

## `VarianceStoppingCriteria`

```python
class VarianceStoppingCriteria(StoppingCriteria)
```

Stop sampling when average variance per term drops below a variance bound.

## `RepetitionsStoppingCriteria`

```python
class RepetitionsStoppingCriteria(StoppingCriteria)
```

Stop sampling when the number of repetitions has been reached.

## `CheckpointFileOptions`

```python
class CheckpointFileOptions
```

Options to configure "checkpointing" to save intermediate results.

Args:
    checkpoint: If set to True, save cumulative raw results at the end
        of each iteration of the sampling loop. Load in these results
        with `cirq.read_json`.
    checkpoint_fn: The filename for the checkpoint file. If `checkpoint`
        is set to True and this is not specified, a file in a temporary
        directory will be used.
    checkpoint_other_fn: The filename for another checkpoint file, which
        contains the previous checkpoint. This lets us avoid losing data if
        a failure occurs during checkpoint writing. If `checkpoint`
        is set to True and this is not specified, a file in a temporary
        directory will be used. If `checkpoint` is set to True and
        `checkpoint_fn` is specified but this argument is *not* specified,
        "{checkpoint_fn}.prev.json" will be used.

### `maybe_to_json`

```python
def maybe_to_json(self, obj: Any)
```

Call `cirq.to_json with `value` according to the configuration options in this class.

If `checkpoint=False`, nothing will happen. Otherwise, we will use `checkpoint_fn` and
`checkpoint_other_fn` as the destination JSON file as described in the class docstring.

## `measure_grouped_settings`

```python
def measure_grouped_settings(circuit: cirq.AbstractCircuit, grouped_settings: dict[InitObsSetting, list[InitObsSetting]], sampler: cirq.Sampler, stopping_criteria: StoppingCriteria, *, readout_symmetrization: bool=False, circuit_sweep: cirq.Sweepable=None, readout_calibrations: BitstringAccumulator | None=None, checkpoint: CheckpointFileOptions=CheckpointFileOptions()) -> list[BitstringAccumulator]
```

Measure a suite of grouped InitObsSetting settings.

This is a low-level API for accessing the observable measurement
framework. See also `measure_observables` and `measure_observables_df`.

Args:
    circuit: The circuit. This can contain parameters, in which case
        you should also specify `circuit_sweep`.
    grouped_settings: A series of setting groups expressed as a dictionary.
        The key is the max-weight setting used for preparing single-qubit
        basis-change rotations. The value is a list of settings
        compatible with the maximal setting you desire to measure.
        Automated routing algorithms like `group_settings_greedy` can
        be used to construct this input.
    sampler: A sampler.
    stopping_criteria: A StoppingCriteria object that can report
        whether enough samples have been sampled.
    readout_symmetrization: If set to True, each `meas_spec` will be
        split into two runs: one normal and one where a bit flip is
        incorporated prior to measurement. In the latter case, the
        measured bit will be flipped back classically and accumulated
        together. This causes readout error to appear symmetric,
        p(0|0) = p(1|1).
    circuit_sweep: Additional parameter sweeps for parameters contained
        in `circuit`. The total sweep is the product of the circuit sweep
        with parameter settings for the single-qubit basis-change rotations.
    readout_calibrations: The result of `calibrate_readout_error`.
    checkpoint: Options to set up optional checkpointing of intermediate
        data for each iteration of the sampling loop. See the documentation
        for `CheckpointFileOptions` for more. Load in these results with
        `cirq.read_json`.

Raises:
    ValueError: If readout calibration is specified, but `readout_symmetrization
        is not True.

## `measure_observables`

```python
def measure_observables(circuit: cirq.AbstractCircuit, observables: Iterable[cirq.PauliString], sampler: cirq.Simulator | cirq.Sampler, stopping_criteria: StoppingCriteria, *, readout_symmetrization: bool=False, circuit_sweep: cirq.Sweepable | None=None, grouper: str | GROUPER_T=group_settings_greedy, readout_calibrations: BitstringAccumulator | None=None, checkpoint: CheckpointFileOptions=CheckpointFileOptions()) -> list[ObservableMeasuredResult]
```

Measure a collection of PauliString observables for a state prepared by a Circuit.

If you need more control over the process, please see `measure_grouped_settings` for a
lower-level API. If you would like your results returned as a pandas DataFrame,
please see `measure_observables_df`.

Args:
    circuit: The circuit used to prepare the state to measure. This can contain parameters,
        in which case you should also specify `circuit_sweep`.
    observables: A collection of PauliString observables to measure. These will be grouped
        into simultaneously-measurable groups, see `grouper` argument.
    sampler: The sampler.
    stopping_criteria: A StoppingCriteria object to indicate how precisely to sample
        measurements for estimating observables.
    readout_symmetrization: If set to True, each run will be split into two: one normal and
        one where a bit flip is incorporated prior to measurement. In the latter case, the
        measured bit will be flipped back classically and accumulated together. This causes
        readout error to appear symmetric, p(0|0) = p(1|1).
    circuit_sweep: Additional parameter sweeps for parameters contained in `circuit`. The
        total sweep is the product of the circuit sweep with parameter settings for the
        single-qubit basis-change rotations.
    grouper: Either "greedy" or a function that groups lists of `InitObsSetting`. See the
        documentation for the `grouped_settings` argument of `measure_grouped_settings` for
        full details.
    readout_calibrations: The result of `calibrate_readout_error`.
    checkpoint: Options to set up optional checkpointing of intermediate data for each
        iteration of the sampling loop. See the documentation for `CheckpointFileOptions` for
        more. Load in these results with `cirq.read_json`.

Returns:
    A list of ObservableMeasuredResult; one for each input PauliString.

## `measure_observables_df`

```python
def measure_observables_df(circuit: cirq.AbstractCircuit, observables: Iterable[cirq.PauliString], sampler: cirq.Simulator | cirq.Sampler, stopping_criteria: StoppingCriteria, *, readout_symmetrization: bool=False, circuit_sweep: cirq.Sweepable | None=None, grouper: str | GROUPER_T=group_settings_greedy, readout_calibrations: BitstringAccumulator | None=None, checkpoint: CheckpointFileOptions=CheckpointFileOptions())
```

Measure observables and return resulting data as a Pandas dataframe.

Please see `measure_observables` for argument documentation.
