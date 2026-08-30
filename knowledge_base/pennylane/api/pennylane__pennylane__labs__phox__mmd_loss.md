---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/phox/mmd_loss.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/phox/mmd_loss.py
license: Apache-2.0
---

## Module `pennylane/labs/phox/mmd_loss.py`

MMD loss utilities for Phox.

## `MMDConfig`

```python
class MMDConfig
```

Hyperparameters for Maximum Mean Discrepancy (MMD) loss calculation.

Args:
    bandwidth (float | Sequence[float]): RBF kernel bandwidth(s) for the MMD calculation.
        If a sequence is provided, the loss will be computed for each bandwidth and either
        averaged or returned as a list depending on ``return_per_bandwidth``.
    n_ops (int): The number of binary operators (observables) to sample when approximating
        the MMD loss.
    wires (Sequence[int] | None, optional): The specific wires (qubits) to evaluate the
        MMD over. If ``None``, the calculation defaults to using all available qubits.
        Defaults to ``None``.
    sqrt_loss (bool, optional): If ``True``, computes the square root of the absolute
        reduced MMD loss. Defaults to ``False``.
    return_per_bandwidth (bool, optional): If ``True``, returns a list containing the
        individual loss estimates for each bandwidth. If ``False``, returns the scalar
        average across all specified bandwidths. Defaults to ``False``.

## `median_heuristic`

```python
def median_heuristic(samples: ArrayLike) -> float
```

Compute a robust median-distance heuristic for RBF bandwidth selection.

Args:
    samples (ArrayLike): Dataset with shape ``(n_samples, n_features)``.

Returns:
    float: Median non-zero pairwise Euclidean distance. Returns ``1.0`` when all
    pairwise distances are zero.

Raises:
    ValueError: If fewer than two samples are provided.

## `mmd_loss`

```python
def mmd_loss(params: ArrayLike, circuit_config: CircuitConfig, mmd_config: MMDConfig, target_data: ArrayLike, key: ArrayLike | None=None) -> jnp.ndarray | list[jnp.ndarray]
```

Estimate MMD loss using configuration dataclasses.

Args:
    params (ArrayLike): Trainable circuit parameters.
    circuit_config (CircuitConfig): Circuit configuration used to build the expval function.
    mmd_config (MMDConfig): Hyperparameters for the MMD computation.
    target_data (ArrayLike): Binary target samples with shape ``(m, n_qubits)``.
    key (ArrayLike | None): Optional runtime PRNG key override for the training loop.

Returns:
    jnp.ndarray | list[jnp.ndarray]: Scalar average across ``sigma`` values by default,
    or list of per-sigma estimates when ``return_per_bandwidth=True``.

Raises:
    ValueError: If effective ``n_samples <= 1``.
