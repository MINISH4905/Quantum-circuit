---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/work/sampler.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/work/sampler.py
license: Apache-2.0
---

## Module `cirq-core/cirq/work/sampler.py`

Abstract base class for things sampling quantum circuits.

## `Sampler`

```python
class Sampler(metaclass=value.ABCMetaImplementAnyOneOf)
```

Something capable of sampling quantum circuits. Simulator or hardware.

### `run`

```python
def run(self, program: cirq.AbstractCircuit, param_resolver: cirq.ParamResolverOrSimilarType=None, repetitions: int=1) -> cirq.Result
```

Samples from the given `Circuit`.

This mode of operation for a sampler will provide results
in the form of measurement outcomes.  It will not provide
access to state vectors (even if the underlying
sampling mechanism is a simulator).  This method will substitute
parameters in the `param_resolver` attributes for `sympy.Symbols`
used within the Circuit.  This circuit will be executed a number
of times specified in the `repetitions` attribute, though some
simulated implementations may instead sample from the final
distribution rather than execute the circuit each time.

Args:
    program: The circuit to sample from.
    param_resolver: Parameters to run with the program.
    repetitions: The number of times to sample.

Returns:
    `cirq.Result` that contains all the measurements for a run.

### `run_async`

```python
async def run_async(self, program: cirq.AbstractCircuit, param_resolver: cirq.ParamResolverOrSimilarType=None, repetitions: int=1) -> cirq.Result
```

Asynchronously samples from the given Circuit.

Provides measurement outcomes as a `cirq.Result` object.  This
interface will operate in a similar way to the `run` method
except for executing asynchronously.

Args:
    program: The circuit to sample from.
    param_resolver: Parameters to run with the program.
    repetitions: The number of times to sample.

Returns:
    Result for a run.

### `sample`

```python
def sample(self, program: cirq.AbstractCircuit, *, repetitions: int=1, params: cirq.Sweepable=None) -> pd.DataFrame
```

Samples the given Circuit, producing a pandas data frame.

This interface will operate in a similar way to the `run` method
except that it returns a pandas data frame rather than a `cirq.Result`
object.

Args:
    program: The circuit to sample from.
    repetitions: The number of times to sample the program, for each
        parameter mapping.
    params: Maps symbols to one or more values. This argument can be
        a dictionary, a list of dictionaries, a `cirq.Sweep`, a list of
        `cirq.Sweep`, etc. The program will be sampled `repetition`
        times for each mapping. Defaults to a single empty mapping.

Returns:
    A `pandas.DataFrame` with a row for each sample, and a column for
    each measurement key as well as a column for each symbolic
    parameter.  Measurement results are stored as a big endian integer
    representation with one bit for each measured qubit in the key.
    See `cirq.big_endian_int_to_bits` and similar functions for how
    to convert this integer into bits.
    There is an also index column containing the repetition number,
    for each parameter assignment.

Raises:
    ValueError: If a supplied sweep is invalid.

Examples:
    >>> a, b, c = cirq.LineQubit.range(3)
    >>> sampler = cirq.Simulator()
    >>> circuit = cirq.Circuit(cirq.X(a),
    ...                        cirq.measure(a, key='out'))
    >>> print(sampler.sample(circuit, repetitions=4))
       out
    0    1
    1    1
    2    1
    3    1

    >>> circuit = cirq.Circuit(cirq.X(a),
    ...                        cirq.CNOT(a, b),
    ...                        cirq.measure(a, b, c, key='out'))
    >>> print(sampler.sample(circuit, repetitions=4))
       out
    0    6
    1    6
    2    6
    3    6

    >>> circuit = cirq.Circuit(cirq.X(a)**sympy.Symbol('t'),
    ...                        cirq.measure(a, key='out'))
    >>> print(sampler.sample(
    ...     circuit,
    ...     repetitions=3,
    ...     params=[{'t': 0}, {'t': 1}]))
       t  out
    0  0    0
    1  0    0
    2  0    0
    0  1    1
    1  1    1
    2  1    1

### `run_sweep`

```python
def run_sweep(self, program: cirq.AbstractCircuit, params: cirq.Sweepable, repetitions: int=1) -> Sequence[cirq.Result]
```

Samples from the given Circuit.

This allows for sweeping over different parameter values,
unlike the `run` method.  The `params` argument will provide a
mapping from `sympy.Symbol`s used within the circuit to a set of
values.  Unlike the `run` method, which specifies a single
mapping from symbol to value, this method allows a "sweep" of
values.  This allows a user to specify execution of a family of
related circuits efficiently.

Args:
    program: The circuit to sample from.
    params: Parameters to run with the program.
    repetitions: The number of times to sample.

Returns:
    Result list for this run; one for each possible parameter resolver.

### `run_sweep_async`

```python
async def run_sweep_async(self, program: cirq.AbstractCircuit, params: cirq.Sweepable, repetitions: int=1) -> Sequence[cirq.Result]
```

Asynchronously samples from the given Circuit.

By default, this method invokes `run_sweep` synchronously and simply
exposes its result is an awaitable. Child classes that are capable of
true asynchronous sampling should override it to use other strategies.

Args:
    program: The circuit to sample from.
    params: Parameters to run with the program.
    repetitions: The number of times to sample.

Returns:
    Result list for this run; one for each possible parameter resolver.

### `run_batch_async`

```python
async def run_batch_async(self, programs: Sequence[cirq.AbstractCircuit], params_list: Sequence[cirq.Sweepable] | None=None, repetitions: int | Sequence[int]=1) -> Sequence[Sequence[cirq.Result]]
```

Runs the supplied circuits asynchronously.

Each circuit provided in `programs` will pair with the optional
associated parameter sweep provided in the `params_list`, and be run
with the associated repetitions provided in `repetitions` (if
`repetitions` is an integer, then all runs will have that number of
repetitions). If `params_list` is specified, then the number of
circuits is required to match the number of sweeps. Similarly, when
`repetitions` is a list, the number of circuits is required to match
the length of this list.

By default, this method simply invokes `run_sweep` sequentially for
each (circuit, parameter sweep, repetitions) tuple. Child classes that
are capable of sampling batches more efficiently should override it to
use other strategies. Note that child classes may have certain
requirements that must be met in order for a speedup to be possible,
such as a constant number of repetitions being used for all circuits.
Refer to the documentation of the child class for any such requirements.

Args:
    programs: The circuits to execute as a batch.
    params_list: Parameter sweeps to use with the circuits. The number
        of sweeps should match the number of circuits and will be
        paired in order with the circuits.
    repetitions: Number of circuit repetitions to run. Can be specified
        as a single value to use for all runs, or as a list of values,
        one for each circuit.

Returns:
    A list of lists of TrialResults. The outer list corresponds to
    the circuits, while each inner list contains the TrialResults
    for the corresponding circuit, in the order imposed by the
    associated parameter sweep.

Raises:
    ValueError: If length of `programs` is not equal to the length
        of `params_list` or the length of `repetitions`.

### `sample_expectation_values`

```python
def sample_expectation_values(self, program: cirq.AbstractCircuit, observables: cirq.PauliSumLike | list[cirq.PauliSumLike], *, num_samples: int, params: cirq.Sweepable=None, permit_terminal_measurements: bool=False) -> Sequence[Sequence[float]]
```

Calculates estimated expectation values from samples of a circuit.

Please see also `cirq.work.observable_measurement.measure_observables`
for more control over how to measure a suite of observables.

This method can be run on any device or simulator that supports circuit sampling. Compare
with `simulate_expectation_values` in simulator.py, which is limited to simulators
but provides exact results.

Args:
    program: The circuit which prepares a state from which we sample expectation values.
    observables: A list of observables for which to calculate expectation values.
    num_samples: The number of samples to take. Increasing this value increases the
        statistical accuracy of the estimate.
    params: Parameters to run with the program.
    permit_terminal_measurements: If the provided circuit ends in a measurement, this
        method will generate an error unless this is set to True. This is meant to
        prevent measurements from ruining expectation value calculations.

Returns:
    A list of expectation-value lists. The outer index determines the sweep, and the inner
    index determines the observable. For instance, results[1][3] would select the fourth
    observable measured in the second sweep.

Raises:
    ValueError: If the number of samples was not positive, if empty observables were
        supplied, or if the provided circuit has terminal measurements and
        `permit_terminal_measurements` is true.
