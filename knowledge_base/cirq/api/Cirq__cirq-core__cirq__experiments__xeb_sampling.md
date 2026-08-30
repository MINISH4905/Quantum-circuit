---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/experiments/xeb_sampling.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/experiments/xeb_sampling.py
license: Apache-2.0
---

## Module `cirq-core/cirq/experiments/xeb_sampling.py`

Estimation of fidelity associated with experimental circuit executions.

## `sample_2q_xeb_circuits`

```python
def sample_2q_xeb_circuits(sampler: cirq.Sampler, circuits: Sequence[cirq.Circuit], cycle_depths: Sequence[int], *, repetitions: int=10000, batch_size: int=9, progress_bar: Callable[..., AbstractContextManager] | None=tqdm.tqdm, combinations_by_layer: list[CircuitLibraryCombination] | None=None, shuffle: cirq.RANDOM_STATE_OR_SEED_LIKE | None=None, dataset_directory: str | None=None) -> pd.DataFrame
```

Sample two-qubit XEB circuits given a sampler.

Args:
    sampler: A Cirq sampler for executing circuits.
    circuits: A library of two-qubit circuits generated from
        `random_rotations_between_two_qubit_circuit` of sufficient length for `cycle_depths`.
    cycle_depths: A sequence of cylce depths at which we will truncate each of the `circuits`
        to execute.
    repetitions: Each (circuit, cycle_depth) will be sampled for this many repetitions.
    batch_size: We call `run_batch` on the sampler, which can speed up execution in certain
        environments. The number of (circuit, cycle_depth) tasks to be run in each batch
        is given by this number.
    progress_bar: A progress context manager following the `tqdm` API or `None` to not report
        progress.
    combinations_by_layer: Either `None` or the result of
        `rqcg.get_random_combinations_for_device`. If this is `None`, the circuits specified
        by `circuits` will be sampled verbatim, resulting in isolated XEB characterization.
        Otherwise, this contains all the random combinations and metadata required to combine
        the circuits in `circuits` into wide, parallel-XEB-style circuits for execution.
    shuffle: If provided, use this random state or seed to shuffle the order in which tasks
        are executed.
    dataset_directory: If provided, save each batch of sampled results to a file
        `{dataset_directory}/xeb.{uuid4()}.json` where uuid4() is a random string. This can be
        used to incrementally save results to be analyzed later.

Returns:
    A pandas dataframe with index given by ['circuit_i', 'cycle_depth'].
    Columns always include "sampled_probs". If `combinations_by_layer` is
    not `None` and you are doing parallel XEB, additional metadata columns
    will be attached to the returned DataFrame.
