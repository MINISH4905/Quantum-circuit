---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/phox/expval_functions.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/phox/expval_functions.py
license: Apache-2.0
---

## Module `pennylane/labs/phox/expval_functions.py`

Pure function implementations for the expectation value functions.

## `CircuitConfig`

```python
class CircuitConfig
```

Configuration data for an IQP circuit simulation.

Args:
    gates (dict[int, list[list[int]]]): Circuit structure mapping parameters to gates.
    observables (ArrayLike): List of Pauli observables mapped to integers (I=0, X=1, Y=2, Z=3).
    n_samples (int): Number of Monte Carlo samples for the estimation of the expectation value.
    key (ArrayLike): Random key for JAX.
    n_qubits (int): Number of qubits.
    init_state_elems (ArrayLike | None): Elements of the initial state (X) - fixed binary matrix.
    init_state_amps (ArrayLike | None): Amplitudes of the initial state (P) - continuous trainable params.
    phase_fn (Callable | None): Optional phase layer function.

## `bitflip_expval`

```python
def bitflip_expval(generators: ArrayLike, params: ArrayLike, ops: ArrayLike) -> tuple[jnp.ndarray, jnp.ndarray]
```

Compute expectation value for the Bitflip noise model.

Args:
    generators (ArrayLike): Binary matrix of shape ``(n_generators, n_qubits)``.
    params (ArrayLike): Error probabilities/parameters $    heta$.
    ops (ArrayLike): Binary matrix representing Pauli Z operators.

Returns:
    tuple[jnp.ndarray, jnp.ndarray]: A tuple containing:
        - Expectation values.
        - A zero array for standard error (since this is analytical).

## `build_expval_func`

```python
def build_expval_func(config: CircuitConfig) -> Callable
```

Factory that returns a flexible pure function for computing expectation values.
The returned closure can optionally take runtime overrides for key, observables, etc.
