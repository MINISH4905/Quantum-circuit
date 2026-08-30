---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/pulse/parametrized_hamiltonian_pytree.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/pulse/parametrized_hamiltonian_pytree.py
license: Apache-2.0
---

## Module `pennylane/pulse/parametrized_hamiltonian_pytree.py`

Module containing the ``JaxParametrizedHamiltonian`` class.

## `ParametrizedHamiltonianPytree`

```python
class ParametrizedHamiltonianPytree
```

Jax pytree class that represents a ``ParametrizedHamiltonian``.

### `from_hamiltonian`

```python
def from_hamiltonian(H: ParametrizedHamiltonian, *, dense: bool=False, wire_order=None)
```

Convert a ``ParametrizedHamiltonian`` into a jax pytree object.

Args:
    H (ParametrizedHamiltonian): parametrized Hamiltonian to convert
    dense (bool, optional): Decide wether a dense/sparse matrix is used. Defaults to False.
    wire_order (list, optional): Wire order of the returned ``JaxParametrizedOperator``.
        Defaults to None.

Returns:
    ParametrizedHamiltonianPytree: pytree object

### `tree_flatten`

```python
def tree_flatten(self)
```

Function used by ``jax`` to flatten the JaxParametrizedOperator.

Returns:
    tuple: tuple containing the matrices and the parametrized coefficients defining the class

### `tree_unflatten`

```python
def tree_unflatten(cls, param_coeffs: tuple, matrices: tuple, reorder_fn: callable)
```

Function used by ``jax`` to unflatten the JaxParametrizedOperator.

Args:
    param_coeffs (tuple): tuple containing the parametrized coefficients of the class
    matrices (tuple): tuple containing the matrices of the class
    reorder_fn(callable): callable or None indicating how parameters should be
        re-orderd to pass to the __call__ method

Returns:
    JaxParametrizedOperator: a JaxParametrizedOperator instance

## `LazyDotPytree`

```python
class LazyDotPytree
```

Jax pytree representing a lazy dot operation.

### `tree_flatten`

```python
def tree_flatten(self)
```

Function used by ``jax`` to flatten the JaxLazyDot operation.

Returns:
    tuple: tuple containing children and the auxiliary data of the class

### `tree_unflatten`

```python
def tree_unflatten(cls, aux_data, children)
```

Function used by ``jax`` to unflatten the ``JaxLazyDot`` pytree.

Args:
    aux_data (None): empty argument
    children (tuple): tuple containing the coefficients and the matrices of the operation

Returns:
    JaxLazyDot: JaxLazyDot instance
