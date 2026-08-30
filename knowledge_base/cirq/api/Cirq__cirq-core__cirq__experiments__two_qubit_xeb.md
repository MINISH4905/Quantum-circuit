---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/experiments/two_qubit_xeb.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/experiments/two_qubit_xeb.py
license: Apache-2.0
---

## Module `cirq-core/cirq/experiments/two_qubit_xeb.py`

Provides functions for running and analyzing two-qubit XEB experiments.

## `qubits_and_pairs`

```python
def qubits_and_pairs(sampler: cirq.Sampler, qubits: Sequence[cirq.GridQubit] | None=None, pairs: Sequence[tuple[cirq.GridQubit, cirq.GridQubit]] | None=None) -> tuple[Sequence[cirq.GridQubit], Sequence[tuple[cirq.GridQubit, cirq.GridQubit]]]
```

Extract qubits and pairs from sampler.


If qubits are not provided, then they are extracted from the pairs (if given) or the sampler.
If pairs are not provided then all pairs of adjacent qubits are used.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    qubits: Optional list of qubits.
    pairs: Optional list of pair to use.

Returns:
    - Qubits to use.
    - Pairs of qubits to use.

Raises:
    ValueError: If qubits are not specified and can't be deduced from other arguments.

## `TwoQubitXEBResult`

```python
class TwoQubitXEBResult
```

Results from an XEB experiment.

### `plot_heatmap`

```python
def plot_heatmap(self, ax: plt.Axes | None=None, **plot_kwargs) -> plt.Axes
```

plot the heatmap of XEB errors.

Args:
    ax: the plt.Axes to plot on. If not given, a new figure is created,
        plotted on, and shown.
    **plot_kwargs: Arguments to be passed to 'plt.Axes.plot'.

Returns:
    The plt.Axes that was plotted on.

### `plot_fitted_exponential`

```python
def plot_fitted_exponential(self, q0: cirq.GridQubit, q1: cirq.GridQubit, ax: plt.Axes | None=None, **plot_kwargs) -> plt.Axes
```

plot the fitted model to for xeb error of a qubit pair.

Args:
    q0: first qubit.
    q1: second qubit.
    ax: the plt.Axes to plot on. If not given, a new figure is created,
        plotted on, and shown.
    **plot_kwargs: Arguments to be passed to 'plt.Axes.plot'.

Returns:
    The plt.Axes that was plotted on.

### `xeb_fidelity`

```python
def xeb_fidelity(self, q0: cirq.GridQubit, q1: cirq.GridQubit) -> float
```

Return the XEB fidelity of a qubit pair.

### `xeb_error`

```python
def xeb_error(self, q0: cirq.GridQubit, q1: cirq.GridQubit) -> float
```

Return the XEB error of a qubit pair.

### `all_errors`

```python
def all_errors(self) -> dict[tuple[cirq.GridQubit, cirq.GridQubit], float]
```

Return the XEB error of all qubit pairs.

### `plot_histogram`

```python
def plot_histogram(self, ax: plt.Axes | None=None, **plot_kwargs) -> plt.Axes
```

plot a histogram of all xeb errors.

Args:
    ax: the plt.Axes to plot on. If not given, a new figure is created,
        plotted on, and shown.
    **plot_kwargs: Arguments to be passed to 'plt.Axes.plot'.

Returns:
    The plt.Axes that was plotted on.

### `pauli_error`

```python
def pauli_error(self) -> dict[tuple[cirq.GridQubit, cirq.GridQubit], float]
```

Return the Pauli error of all qubit pairs.

## `InferredXEBResult`

```python
class InferredXEBResult
```

Uses the results from XEB and RB to compute inferred two-qubit Pauli errors.

The result of running just XEB combines both two-qubit and single-qubit error rates,
this class computes inferred errors which are the result of removing the single qubit errors
from the two-qubit errors.

### `single_qubit_pauli_error`

```python
def single_qubit_pauli_error(self) -> Mapping[cirq.Qid, float]
```

Return the single-qubit Pauli error for all qubits (RB results).

### `two_qubit_pauli_error`

```python
def two_qubit_pauli_error(self) -> Mapping[tuple[cirq.GridQubit, cirq.GridQubit], float]
```

Return the two-qubit Pauli error for all pairs.

### `inferred_pauli_error`

```python
def inferred_pauli_error(self) -> Mapping[tuple[cirq.GridQubit, cirq.GridQubit], float]
```

Return the inferred Pauli error for all pairs.

### `inferred_decay_constant`

```python
def inferred_decay_constant(self) -> Mapping[tuple[cirq.GridQubit, cirq.GridQubit], float]
```

Return the inferred decay constant for all pairs.

### `inferred_xeb_error`

```python
def inferred_xeb_error(self) -> Mapping[tuple[cirq.GridQubit, cirq.GridQubit], float]
```

Return the inferred XEB error for all pairs.

### `plot_heatmap`

```python
def plot_heatmap(self, target_error: str='pauli', ax: plt.Axes | None=None, **plot_kwargs) -> plt.Axes
```

plot the heatmap of the target errors.

Args:
    target_error: The error to draw. Must be one of 'xeb', 'pauli', or 'decay_constant'
    ax: the plt.Axes to plot on. If not given, a new figure is created,
        plotted on, and shown.
    **plot_kwargs: Arguments to be passed to 'plt.Axes.plot'.

### `plot_histogram`

```python
def plot_histogram(self, target_error: str='pauli', ax: plt.Axes | None=None, kind: str='two_qubit', **plot_kwargs) -> plt.Axes
```

plot a histogram of target error.

Args:
    target_error: The error to draw. Must be one of 'xeb', 'pauli', or 'decay_constant'
    ax: the plt.Axes to plot on. If not given, a new figure is created,
        plotted on, and shown.
    kind: Whether to plot the single-qubit RB errors ('single_qubit') or the
        two-qubit inferred errors ('two_qubit') or both ('both').
    **plot_kwargs: Arguments to be passed to 'plt.Axes.plot'.

Returns:
    The plt.Axes that was plotted on.

Raises:
    ValueError: If
        - `kind` is not one of 'single_qubit', 'two_qubit', or 'both'.
        - `target_error` is not one of 'pauli', 'xeb', or 'decay_constant'
        - single qubit error is requested and `target_error` is not 'pauli'.

## `parallel_xeb_workflow`

```python
def parallel_xeb_workflow(sampler: cirq.Sampler, qubits: Sequence[cirq.GridQubit] | None=None, entangling_gate: cirq.Gate=ops.CZ, n_repetitions: int=10 ** 4, n_combinations: int=10, n_circuits: int=20, cycle_depths: Sequence[int]=(5, 25, 50, 100, 200, 300), random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None, ax: plt.Axes | None=None, pairs: Sequence[tuple[cirq.GridQubit, cirq.GridQubit]] | None=None, pool: multiprocessing.pool.Pool | futures.Executor | None=None, batch_size: int=9, tags: Sequence[Any]=(), **plot_kwargs) -> tuple[pd.DataFrame, Sequence[cirq.Circuit], pd.DataFrame]
```

A utility method that runs the full XEB workflow.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    qubits: Qubits under test. If none, uses all qubits on the sampler's device.
    entangling_gate: The entangling gate to use.
    n_repetitions: The number of repetitions to use.
    n_combinations: The number of combinations to generate.
    n_circuits: The number of circuits to generate.
    cycle_depths: The cycle depths to use.
    random_state: The random state to use.
    ax: the plt.Axes to plot the device layout on. If not given,
        no plot is created.
    pairs: Pairs to use. If not specified, use all pairs between adjacent qubits.
    pool: An optional pool.
    batch_size: We call `run_batch` on the sampler, which can speed up execution in certain
        environments. The number of (circuit, cycle_depth) tasks to be run in each batch
        is given by this number.
    tags: Tags to add to two qubit operations.
    **plot_kwargs: Arguments to be passed to 'plt.Axes.plot'.

Returns:
    - A DataFrame with columns 'cycle_depth' and 'fidelity'.
    - The circuits used to perform XEB.
    - A pandas dataframe with index given by ['circuit_i', 'cycle_depth'].
        Columns always include "sampled_probs". If `combinations_by_layer` is
        not `None` and you are doing parallel XEB, additional metadata columns
        will be attached to the returned DataFrame.

Raises:
    ValueError: If qubits are not specified and the sampler has no device.

## `parallel_two_qubit_xeb`

```python
def parallel_two_qubit_xeb(sampler: cirq.Sampler, qubits: Sequence[cirq.GridQubit] | None=None, entangling_gate: cirq.Gate=ops.CZ, n_repetitions: int=10 ** 4, n_combinations: int=10, n_circuits: int=20, cycle_depths: Sequence[int]=(5, 25, 50, 100, 200, 300), random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None, ax: plt.Axes | None=None, pairs: Sequence[tuple[cirq.GridQubit, cirq.GridQubit]] | None=None, batch_size: int=9, tags: Sequence[Any]=(), **plot_kwargs) -> TwoQubitXEBResult
```

A convenience method that runs the full XEB workflow.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    qubits: Qubits under test. If none, uses all qubits on the sampler's device.
    entangling_gate: The entangling gate to use.
    n_repetitions: The number of repetitions to use.
    n_combinations: The number of combinations to generate.
    n_circuits: The number of circuits to generate.
    cycle_depths: The cycle depths to use.
    random_state: The random state to use.
    ax: the plt.Axes to plot the device layout on. If not given,
        no plot is created.
    pairs: Pairs to use. If not specified, use all pairs between adjacent qubits.
    batch_size: We call `run_batch` on the sampler, which can speed up execution in certain
        environments. The number of (circuit, cycle_depth) tasks to be run in each batch
        is given by this number.
    tags: Tags to add to two qubit operations.
    **plot_kwargs: Arguments to be passed to 'plt.Axes.plot'.
Returns:
    A TwoQubitXEBResult object representing the results of the experiment.
Raises:
    ValueError: If qubits are not specified and the sampler has no device.

## `run_rb_and_xeb`

```python
def run_rb_and_xeb(sampler: cirq.Sampler, qubits: Sequence[cirq.GridQubit] | None=None, repetitions: int=10 ** 3, num_circuits: int=20, num_clifford_range: Sequence[int]=tuple(np.logspace(np.log10(5), np.log10(1000), 5, dtype=int)), entangling_gate: cirq.Gate=ops.CZ, depths_xeb: Sequence[int]=(5, 25, 50, 100, 200, 300), xeb_combinations: int=10, random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None, pairs: Sequence[tuple[cirq.GridQubit, cirq.GridQubit]] | None=None, batch_size: int=9, tags: Sequence[Any]=()) -> InferredXEBResult
```

A convenience method that runs both RB and XEB workflows.

Args:
    sampler: The quantum engine or simulator to run the circuits.
    qubits: Qubits under test. If none, uses all qubits on the sampler's device.
    repetitions: The number of repetitions to use for RB and XEB.
    num_circuits: The number of circuits to generate for RB and XEB.
    num_clifford_range: The different numbers of Cliffords in the RB study.
    entangling_gate: The entangling gate to use.
    depths_xeb: The cycle depths to use for XEB.
    xeb_combinations: The number of combinations to generate for XEB.
    random_state: The random state to use.
    pairs: Pairs to use. If not specified, use all pairs between adjacent qubits.
    batch_size: We call `run_batch` on the sampler, which can speed up execution in certain
        environments. The number of (circuit, cycle_depth) tasks to be run in each batch
        is given by this number.
    tags: Tags to add to two qubit operations.

Returns:
    An InferredXEBResult object representing the results of the experiment.

Raises:
    ValueError: If qubits are not specified and the sampler has no device.
