---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/lin_alg_utils.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/lin_alg_utils.py
license: Apache-2.0
---

## Module `cirq-core/cirq/testing/lin_alg_utils.py`

A testing class with utilities for checking linear algebra.

## `random_superposition`

```python
def random_superposition(dim: int, *, random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> np.ndarray[tuple[int], np.dtype[np.complex128]]
```

Returns a random unit-length vector from the uniform distribution.

Args:
    dim: The dimension of the vector.
    random_state: A seed (int) or `np.random.RandomState` class to use when
        generating random values. If not set, defaults to using the module
        methods in `np.random`.

Returns:
    The sampled unit-length vector.

## `random_density_matrix`

```python
def random_density_matrix(dim: int, *, random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> np.ndarray
```

Returns a random density matrix distributed with Hilbert-Schmidt measure.

Args:
    dim: The width and height of the matrix.
    random_state: A seed to use for random number generation.

Returns:
    The sampled density matrix.

Reference:
    'Random Bures mixed states and the distribution of their purity'
    https://arxiv.org/abs/0909.5094

## `random_unitary`

```python
def random_unitary(dim: int, *, random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> np.ndarray
```

Returns a random unitary matrix distributed with Haar measure.

Args:
    dim: The width and height of the matrix.
    random_state: A seed to use for random number generation.

Returns:
    The sampled unitary matrix.

References:
    'How to generate random matrices from the classical compact groups'
    http://arxiv.org/abs/math-ph/0609050

## `random_orthogonal`

```python
def random_orthogonal(dim: int, *, random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> np.ndarray
```

Returns a random orthogonal matrix distributed with Haar measure.

Args:
    dim: The width and height of the matrix.
    random_state: A seed (int) or `np.random.RandomState` class to use when
        generating random values. If not set, defaults to using the module
        methods in `np.random`.

Returns:
    The sampled orthogonal matrix.

References:
    'How to generate random matrices from the classical compact groups'
    http://arxiv.org/abs/math-ph/0609050

## `random_special_unitary`

```python
def random_special_unitary(dim: int, *, random_state: np.random.RandomState | None=None) -> np.ndarray
```

Returns a random special unitary distributed with Haar measure.

Args:
    dim: The width and height of the matrix.
    random_state: A seed (int) or `np.random.RandomState` class to use when
        generating random values. If not set, defaults to using the module
        methods in `np.random`.

Returns:
    The sampled special unitary.

## `random_special_orthogonal`

```python
def random_special_orthogonal(dim: int, *, random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> np.ndarray
```

Returns a random special orthogonal matrix distributed with Haar measure.

Args:
    dim: The width and height of the matrix.
    random_state: A seed (int) or `np.random.RandomState` class to use when
        generating random values. If not set, defaults to using the module
        methods in `np.random`.

Returns:
    The sampled special orthogonal matrix.

## `assert_allclose_up_to_global_phase`

```python
def assert_allclose_up_to_global_phase(actual: np.ndarray, desired: np.ndarray, *, rtol: float=1e-07, atol: float, equal_nan: bool=True, err_msg: str='', verbose: bool=True) -> None
```

Checks if a ~= b * exp(i t) for some t.

Args:
    actual: A numpy array.
    desired: Another numpy array.
    rtol: Relative error tolerance.
    atol: Absolute error tolerance.
    equal_nan: Whether or not NaN entries should be considered equal to
        other NaN entries.
    err_msg: The error message to be printed in case of failure.
    verbose: If True, the conflicting values are appended to the error
        message.

Raises:
    AssertionError: The matrices aren't nearly equal up to global phase.
