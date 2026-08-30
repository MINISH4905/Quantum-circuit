---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/experiments/xeb_fitting.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/experiments/xeb_fitting.py
license: Apache-2.0
---

## Module `cirq-core/cirq/experiments/xeb_fitting.py`

Estimation of fidelity associated with experimental circuit executions.

## `benchmark_2q_xeb_fidelities`

```python
def benchmark_2q_xeb_fidelities(sampled_df: pd.DataFrame, circuits: Sequence[cirq.Circuit], cycle_depths: Sequence[int] | None=None, param_resolver: cirq.ParamResolverOrSimilarType=None, pool: multiprocessing.pool.Pool | futures.Executor | None=None) -> pd.DataFrame
```

Simulate and benchmark two-qubit XEB circuits.

This uses the estimator from
`cirq.experiments.fidelity_estimation.least_squares_xeb_fidelity_from_expectations`, but
adapted for use on pandas DataFrames for efficient vectorized operation.

Args:
    sampled_df: The sampled results to benchmark. This is likely produced by a call to
        `sample_2q_xeb_circuits`.
    circuits: The library of circuits corresponding to the sampled results in `sampled_df`.
    cycle_depths: The sequence of cycle depths to benchmark the circuits. If not provided,
        we use the cycle depths found in `sampled_df`. All requested `cycle_depths` must be
        present in `sampled_df`.
    param_resolver: If circuits contain parameters, resolve according to this ParamResolver
        prior to simulation
    pool: If provided, execute the simulations in parallel.

Returns:
    A DataFrame with columns 'cycle_depth' and 'fidelity'.

Raises:
    ValueError: If `cycle_depths` is not a non-empty array or if the `cycle_depths` provided
        includes some values not available in `sampled_df`.

## `phased_fsim_angles_from_gate`

```python
def phased_fsim_angles_from_gate(gate: cirq.Gate) -> dict[str, cirq.TParamVal]
```

For a given gate, return a dictionary mapping '{angle}_default' to its noiseless value
for the five PhasedFSim angles.

## `XEBPhasedFSimCharacterizationOptions`

```python
class XEBPhasedFSimCharacterizationOptions(XEBCharacterizationOptions)
```

Options for calibrating a PhasedFSim-like gate using XEB.

You may want to use more specific subclasses like `SqrtISwapXEBOptions`
which have sensible defaults.

Attributes:
    characterize_theta: Whether to characterize θ angle.
    characterize_zeta: Whether to characterize ζ angle.
    characterize_chi: Whether to characterize χ angle.
    characterize_gamma: Whether to characterize γ angle.
    characterize_phi: Whether to characterize φ angle.
    theta_default: The initial or default value to assume for the θ angle.
    zeta_default: The initial or default value to assume for the ζ angle.
    chi_default: The initial or default value to assume for the χ angle.
    gamma_default: The initial or default value to assume for the γ angle.
    phi_default: The initial or default value to assume for the φ angle.

### `get_initial_simplex_and_names`

```python
def get_initial_simplex_and_names(self, initial_simplex_step_size: float=0.1) -> tuple[np.ndarray, list[str]]
```

Get an initial simplex and parameter names for the optimization implied by these options.

The initial simplex initiates the Nelder-Mead optimization parameter. We
use the standard simplex of `x0 + s*basis_vec` where x0 is given by the
`xxx_default` attributes, s is `initial_simplex_step_size` and `basis_vec`
is a one-hot encoded vector for each parameter for which the `parameterize_xxx`
attribute is True.

We also return a list of parameter names so the Cirq `param_resovler`
can be accurately constructed during optimization.

### `defaults_set`

```python
def defaults_set(self) -> bool
```

Whether the default angles are set.

This only considers angles where characterize_{angle} is True. If all such angles have
{angle}_default set to a value, this returns True. If none of the defaults are set,
this returns False. If some defaults are set, we raise an exception.

### `with_defaults_from_gate`

```python
def with_defaults_from_gate(self, gate: cirq.Gate, gate_to_angles_func=phased_fsim_angles_from_gate) -> XEBPhasedFSimCharacterizationOptions
```

A new Options class with {angle}_defaults inferred from `gate`.

This keeps the same settings for the characterize_{angle} booleans, but will disregard
any current {angle}_default values.

## `SqrtISwapXEBOptions`

```python
def SqrtISwapXEBOptions(*args, **kwargs) -> XEBPhasedFSimCharacterizationOptions
```

Options for calibrating a sqrt(ISWAP) gate using XEB.

## `parameterize_circuit`

```python
def parameterize_circuit(circuit: cirq.Circuit, options: XEBCharacterizationOptions, target_gatefamily: ops.GateFamily | None=None) -> cirq.Circuit
```

Parameterize PhasedFSim-like gates in a given circuit according to
`phased_fsim_options`.

## `XEBCharacterizationResult`

```python
class XEBCharacterizationResult
```

The result of `characterize_phased_fsim_parameters_with_xeb`.

Attributes:
    optimization_results: A mapping from qubit pair to the raw scipy OptimizeResult object
    final_params: A mapping from qubit pair to a dictionary of (angle_name, angle_value)
        key-value pairs
    fidelities_df: A dataframe containing per-cycle_depth and per-pair fidelities after
        fitting the characterization.

## `characterize_phased_fsim_parameters_with_xeb`

```python
def characterize_phased_fsim_parameters_with_xeb(sampled_df: pd.DataFrame, parameterized_circuits: list[cirq.Circuit], cycle_depths: Sequence[int], options: XEBCharacterizationOptions, initial_simplex_step_size: float=0.1, xatol: float=0.001, fatol: float=0.001, verbose: bool=True, pool: multiprocessing.pool.Pool | futures.Executor | None=None) -> XEBCharacterizationResult
```

Run a classical optimization to fit phased fsim parameters to experimental data, and
thereby characterize PhasedFSim-like gates.

Args:
    sampled_df: The DataFrame of sampled two-qubit probability distributions returned
        from `sample_2q_xeb_circuits`.
    parameterized_circuits: The circuits corresponding to those sampled in `sampled_df`,
        but with some gates parameterized, likely by using `parameterize_circuit`.
    cycle_depths: The depths at which circuits were truncated.
    options: A set of options that controls the classical optimization loop
        for characterizing the parameterized gates.
    initial_simplex_step_size: Set the size of the initial simplex for Nelder-Mead.
    xatol: The `xatol` argument for Nelder-Mead. This is the absolute error for convergence
        in the parameters.
    fatol: The `fatol` argument for Nelder-Mead. This is the absolute error for convergence
        in the function evaluation.
    verbose: Whether to print progress updates.
    pool: An optional pool to execute circuit simulations in parallel.

## `characterize_phased_fsim_parameters_with_xeb_by_pair`

```python
def characterize_phased_fsim_parameters_with_xeb_by_pair(sampled_df: pd.DataFrame, parameterized_circuits: list[cirq.Circuit], cycle_depths: Sequence[int], options: XEBCharacterizationOptions, initial_simplex_step_size: float=0.1, xatol: float=0.001, fatol: float=0.001, pool: multiprocessing.pool.Pool | futures.Executor | None=None) -> XEBCharacterizationResult
```

Run a classical optimization to fit phased fsim parameters to experimental data, and
thereby characterize PhasedFSim-like gates grouped by pairs.

This is appropriate if you have run parallel XEB on multiple pairs of qubits.

The optimization is done per-pair. If you have the same pair in e.g. two different
layers the characterization optimization will lump the data together. This is in contrast
with the benchmarking functionality, which will always index on `(layer_i, pair_i, pair)`.

Args:
    sampled_df: The DataFrame of sampled two-qubit probability distributions returned
        from `sample_2q_xeb_circuits`.
    parameterized_circuits: The circuits corresponding to those sampled in `sampled_df`,
        but with some gates parameterized, likely by using `parameterize_circuit`.
    cycle_depths: The depths at which circuits were truncated.
    options: A set of options that controls the classical optimization loop
        for characterizing the parameterized gates.
    initial_simplex_step_size: Set the size of the initial simplex for Nelder-Mead.
    xatol: The `xatol` argument for Nelder-Mead. This is the absolute error for convergence
        in the parameters.
    fatol: The `fatol` argument for Nelder-Mead. This is the absolute error for convergence
        in the function evaluation.
    pool: An optional pool to execute pair optimization in parallel. Each
        optimization (and the simulations therein) runs serially.

## `exponential_decay`

```python
def exponential_decay(cycle_depths: np.ndarray, a: float, layer_fid: float) -> np.ndarray
```

An exponential decay for fitting.

This computes `a * layer_fid**cycle_depths`

Args:
    cycle_depths: The various depths at which fidelity was estimated. This is the independent
        variable in the exponential function.
    a: A scale parameter in the exponential function.
    layer_fid: The base of the exponent in the exponential function.

## `fit_exponential_decays`

```python
def fit_exponential_decays(fidelities_df: pd.DataFrame) -> pd.DataFrame
```

Fit exponential decay curves to a fidelities DataFrame.

Args:
     fidelities_df: A DataFrame that is the result of `benchmark_2q_xeb_fidelities`. It
        may contain results for multiple pairs of qubits identified by the "pair" column.
        Each pair will be fit separately. At minimum, this dataframe must contain
        "cycle_depth", "fidelity", and "pair" columns.

Returns:
    A new, aggregated dataframe with index given by (pair, layer_i, pair_i); columns
    for the fit parameters "a" and "layer_fid"; and nested "cycles_depths" and "fidelities"
    lists (now grouped by pair).

## `before_and_after_characterization`

```python
def before_and_after_characterization(fidelities_df_0: pd.DataFrame, characterization_result: XEBCharacterizationResult) -> pd.DataFrame
```

A convenience function for horizontally stacking results pre- and post- characterization
optimization.

Args:
    fidelities_df_0: A dataframe (before fitting), likely resulting from
        `benchmark_2q_xeb_fidelities`.
    characterization_result: The result of running a characterization. This contains the
        second fidelities dataframe as well as the new parameters.

Returns:
      A joined dataframe with original column names suffixed by "_0" and characterized
      column names suffixed by "_c".
