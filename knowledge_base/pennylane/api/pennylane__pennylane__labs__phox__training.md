---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/phox/training.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/phox/training.py
license: Apache-2.0
---

## Module `pennylane/labs/phox/training.py`

Training utilities for Phox.

## `TrainingOptions`

```python
class TrainingOptions
```

Configuration options for training.

Args:
    unroll_steps (int): How many optimization steps to run on the GPU before yielding
        control back to Python. Higher = Faster. Lower = More interactive/granular logging.
        Defaults to 1 (slow, good for debugging).
    val_kwargs (dict[str, Any] | None): Arguments for the loss function to be used during validation.
    convergence_interval (int): Number of steps over which to check for convergence.
        Defaults to 100.
    random_state (int): Seed for PRNGKey.
    opt_jit (bool): Whether to JIT the optimizer creation (usually False is fine).

## `TrainingResult`

```python
class TrainingResult(NamedTuple)
```

Container for final training results.

## `BatchResult`

```python
class BatchResult(NamedTuple)
```

Result from a single batch (unrolled chunk) of training steps.

## `training_iterator`

```python
def training_iterator(optimizer: str, loss: Callable, stepsize: float, loss_kwargs: dict[str, Any], options: TrainingOptions | None=None) -> Iterator[BatchResult]
```

Generator that yields training results in batches of size 'unroll_steps'.

Args:
    optimizer (str): Name of the optimizer to use. Options are "GradientDescent", "Adam", or "BFGS".
    loss (Callable): The loss function.
    stepsize (float): The learning rate.
    loss_kwargs (dict[str, Any]): Arguments to pass to the loss function.
    options (TrainingOptions | None): Configuration options for training. See :class:`TrainingOptions` for further details.

Yields:
    Iterator[BatchResult]: An iterator over batch results. See :class:`BatchResult` for further details.

## `train`

```python
def train(optimizer: str, loss: Callable, stepsize: float, n_iters: int, loss_kwargs: dict[str, Any], options: TrainingOptions | None=None) -> TrainingResult
```

Main training function.
Manages the loop, accumulation of history, and convergence checks.

Args:
    optimizer (str): Name of the optimizer to use. Options are "GradientDescent", "Adam", or "BFGS".
    loss (Callable): The loss function.
    stepsize (float): The learning rate.
    n_iters (int): Total number of training iterations.
    loss_kwargs (dict[str, Any]): Arguments to pass to the loss function.
    options (TrainingOptions | None): Configuration options for training. See :class:`TrainingOptions` for further details.

Returns:
    TrainingResult: The results of the training process, including final parameters and loss history.
        See :class:`TrainingResult` for further details.
