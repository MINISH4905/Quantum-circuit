---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/work/collector.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/work/collector.py
license: Apache-2.0
---

## `CircuitSampleJob`

```python
class CircuitSampleJob
```

Describes a sampling task.

### `__init__`

```python
def __init__(self, circuit: cirq.AbstractCircuit, *, repetitions: int, tag: Any=None)
```

Inits CircuitSampleJob.

Args:
    circuit: The circuit to sample from.
    repetitions: How many times to sample the circuit.
    tag: An arbitrary value associated with the job. This value is used
        so that when a job completes and is handed back, it is possible
        to tell what the job was for. For example, the key could be a
        string like "main_run" or "calibration_run", or it could be set
        to the component of the Hamiltonian (e.g. a PauliString) that
        the circuit is supposed to be helping to estimate.

## `Collector`

```python
class Collector(metaclass=abc.ABCMeta)
```

Collects data from a sampler, in parallel, towards some purpose.

Child classes must override the `next_job` and `on_job_result` methods,
which respectively determine what to sample and how to process the results.
Utility methods on the base class such as `collect` and `collect_async` can
then be given a sampler to collect from, and will request samples with some
specified amount of parallelism.

### `next_job`

```python
def next_job(self) -> CIRCUIT_SAMPLE_JOB_TREE | None
```

Determines what to sample next.

This method is called by driving code when more samples can be
requested.

Returns:
    A CircuitSampleJob describing the circuit to sample, how many
    samples to take, and a key value that can be used in the
    `on_job_result` method to recognize which job this is.

    Can also return a nested iterable of such jobs.

    Returning None, an empty list, or any other result which flattens
    into an empty list of work, indicates that the driving code should
    await more results (and pass them into on_job_results) before
    bothering to ask for more jobs again.

### `on_job_result`

```python
def on_job_result(self, job: CircuitSampleJob, result: study.Result) -> None
```

Incorporates sampled results.

This method is called by driving code when sample results have become
available.

The results should be incorporated into the collector's state.

### `collect`

```python
def collect(self, sampler: cirq.Sampler, *, concurrency: int=2, max_total_samples: int | None=None) -> None
```

Collects needed samples from a sampler.

Examples:

    ```
    collector = cirq.PauliStringCollector(...)
    sampler.collect(collector, concurrency=3)
    print(collector.estimated_energy())
    ```

Args:
    sampler: The simulator or service to collect samples from.
    concurrency: Desired number of sampling jobs to have in flight at
        any given time.
    max_total_samples: Optional limit on the maximum number of samples
        to collect.

Returns:
    The collector's result after all desired samples have been
    collected.

### `collect_async`

```python
async def collect_async(self, sampler: cirq.Sampler, *, concurrency: int=2, max_total_samples: int | None=None) -> None
```

Asynchronously collects needed samples from a sampler.

Examples:

    ```
    collector = cirq.PauliStringCollector(...)
    await sampler.collect_async(collector, concurrency=3)
    print(collector.estimated_energy())
    ```

Args:
    sampler: The simulator or service to collect samples from.
    concurrency: Desired number of sampling jobs to have in flight at
        any given time.
    max_total_samples: Optional limit on the maximum number of samples
        to collect.

Returns:
    The collector's result after all desired samples have been
    collected.
