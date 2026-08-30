---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/study/result.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/study/result.py
license: Apache-2.0
---

## Module `cirq-core/cirq/study/result.py`

Defines trial results.

## `Result`

```python
class Result(abc.ABC)
```

The results of multiple executions of a circuit with fixed parameters.

### `params`

```python
def params(self) -> cirq.ParamResolver
```

A ParamResolver of settings used for this result.

### `measurements`

```python
def measurements(self) -> Mapping[str, np.ndarray]
```

A mapping from measurement gate key to measurement results.

The value for each key is a 2-D array of booleans, with the first index
running over the repetitions, and the second index running over the
qubits for the corresponding measurements.

### `records`

```python
def records(self) -> Mapping[str, np.ndarray]
```

A mapping from measurement key to measurement records.

The value for each key is a 3-D array of booleans, with the first index
running over circuit repetitions, the second index running over instances
of the measurement key in the circuit, and the third index running over
the qubits for the corresponding measurements.

### `data`

```python
def data(self) -> pd.DataFrame
```

Measurements converted to a pandas dataframe.

The rows in the returned data frame correspond to repetitions of the
circuit, and the columns correspond to measurement keys, where each
element is a big-endian integer representation of measurement outcomes
for the measurement key in that repetition. To convert these ints to
bits see `cirq.big_endian_int_to_bits` and similar functions.

### `dataframe_from_measurements`

```python
def dataframe_from_measurements(measurements: Mapping[str, np.ndarray]) -> pd.DataFrame
```

Converts the given measurements to a pandas dataframe.

This can be used by subclasses as a default implementation for the data
property. Note that subclasses should typically memoize the result to
avoid recomputing.

### `multi_measurement_histogram`

```python
def multi_measurement_histogram(self, *, keys: Iterable[TMeasurementKey], fold_func: Callable[[tuple], T]=cast(Callable[[tuple], T], _tuple_of_big_endian_int)) -> collections.Counter
```

Counts the number of times combined measurement results occurred.

This is a more general version of the 'histogram' method. Instead of
only counting how often results occurred for one specific measurement,
this method tensors multiple measurement results together and counts
how often the combined results occurred.

For example, suppose that:

    - fold_func is not specified
    - keys=['abc', 'd']
    - the measurement with key 'abc' measures qubits a, b, and c.
    - the measurement with key 'd' measures qubit d.
    - the circuit was sampled 3 times.
    - the sampled measurement values were:
        1. a=1 b=0 c=0 d=0
        2. a=0 b=1 c=0 d=1
        3. a=1 b=0 c=0 d=0

Then the counter returned by this method will be:

    collections.Counter({
        (0b100, 0): 2,
        (0b010, 1): 1
    })


Where '0b100' is binary for '4' and '0b010' is binary for '2'. Notice
that the bits are combined in a big-endian way by default, with the
first measured qubit determining the highest-value bit.

Args:
    fold_func: A function used to convert sampled measurement results
        into countable values. The input is a tuple containing the
        list of bits measured by each measurement specified by the
        keys argument. If this argument is not specified, it defaults
        to returning tuples of integers, where each integer is the big
        endian interpretation of the bits a measurement sampled.
    keys: Keys of measurements to include in the histogram.

Returns:
    A counter indicating how often measurements sampled various
    results.

### `histogram`

```python
def histogram(self, *, key: TMeasurementKey, fold_func: Callable[[tuple], T] | None=None, fold_base: int | Iterable[int] | None=None) -> collections.Counter
```

Counts the number of times a measurement result occurred.

For example, suppose that:

    - fold_func is not specified
    - key='abc'
    - the measurement with key 'abc' measures qubits a, b, and c.
    - the circuit was sampled 3 times.
    - the sampled measurement values were:
        1. a=1 b=0 c=0
        2. a=0 b=1 c=0
        3. a=1 b=0 c=0

Then the counter returned by this method will be:

    collections.Counter({
        0b100: 2,
        0b010: 1
    })

Where '0b100' is binary for '4' and '0b010' is binary for '2'. Notice
that the bits are combined in a big-endian way by default, with the
first measured qubit determining the highest-value bit.

Args:
    key: Keys of measurements to include in the histogram.
    fold_func: A function used to convert a sampled measurement result
        into a countable value. The input is a list of bits sampled
        together by a measurement. If this argument is not specified,
        it defaults to interpreting the bits as a big endian
        integer.
    fold_base: A convenience argument for interpreting qudit
        measurement results. Specifies the base (or per-digit bases)
        used to convert measurement digits to an integer. Cannot be
        specified together with fold_func.

Returns:
    A counter indicating how often a measurement sampled various
    results.

## `ResultDict`

```python
class ResultDict(Result)
```

A Result created from a dict mapping measurement keys to measured values.

Stores results of executing a circuit for multiple repetitions with one
fixed set of parameters. The values for each measurement key are stored as a
2D numpy array. The first (row) index in each array is the repetition
number, and the second (column) index is the qubit.

Attributes:
    params: A ParamResolver of settings used when sampling result.

### `__init__`

```python
def __init__(self, *, params: resolver.ParamResolver | None=None, measurements: Mapping[str, np.ndarray] | None=None, records: Mapping[str, np.ndarray] | None=None) -> None
```

Inits Result.

Args:
    params: A ParamResolver of settings used for this result.
    measurements: A dictionary from measurement gate key to measurement
        results. The value for each key is a 2-D array of booleans,
        with the first index running over the repetitions, and the
        second index running over the qubits for the corresponding
        measurements.
    records: A dictionary from measurement gate key to measurement
        results. The value for each key is a 3D array of booleans,
        with the first index running over the repetitions, the second
        index running over "instances" of that key in the circuit, and
        the last index running over the qubits for the corresponding
        measurements.
