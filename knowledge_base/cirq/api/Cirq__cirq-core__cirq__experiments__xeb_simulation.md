---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/experiments/xeb_simulation.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/experiments/xeb_simulation.py
license: Apache-2.0
---

## Module `cirq-core/cirq/experiments/xeb_simulation.py`

Estimation of fidelity associated with experimental circuit executions.

## `simulate_2q_xeb_circuits`

```python
def simulate_2q_xeb_circuits(circuits: Sequence[cirq.Circuit], cycle_depths: Sequence[int], param_resolver: cirq.ParamResolverOrSimilarType=None, pool: multiprocessing.pool.Pool | futures.Executor | None=None, simulator: cirq.SimulatesIntermediateState | None=None) -> pd.DataFrame
```

Simulate two-qubit XEB circuits.

These ideal probabilities can be benchmarked against potentially noisy
results from `sample_2q_xeb_circuits`.

Args:
    circuits: A library of two-qubit circuits generated from
        `random_rotations_between_two_qubit_circuit` of sufficient length for `cycle_depths`.
    cycle_depths: A sequence of cycle depths at which we will truncate each of the `circuits`
        to simulate.
    param_resolver: If circuits contain parameters, resolve according to this ParamResolver
        prior to simulation
    pool: If provided, execute the simulations in parallel.
    simulator: A noiseless simulator used to simulate the circuits. By default, this is
        `cirq.Simulator`. The simulator must support the `cirq.SimulatesIntermediateState`
        interface.

Returns:
    A dataframe with index ['circuit_i', 'cycle_depth'] and column
    "pure_probs" containing the pure-state probabilities for each row.
