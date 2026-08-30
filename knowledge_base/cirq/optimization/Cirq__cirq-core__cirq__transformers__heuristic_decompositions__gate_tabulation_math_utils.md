---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/heuristic_decompositions/gate_tabulation_math_utils.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/heuristic_decompositions/gate_tabulation_math_utils.py
license: Apache-2.0
---

## `random_qubit_unitary`

```python
def random_qubit_unitary(shape: Sequence[int]=(), randomize_global_phase: bool=False, rng: np.random.RandomState | None=None) -> np.ndarray
```

Random qubit unitary distributed over the Haar measure.

The implementation is vectorized for speed.

Args:
    shape: The broadcasted shape of the output. This is used to generate
        a tensor of random unitaries with dimensions tuple(shape) + (2,2).
    randomize_global_phase: (Default False) If True, a global phase is also
        sampled randomly. This corresponds to sampling over U(2) instead of
        SU(2).
    rng: Random number generator to be used in sampling. Default is
        numpy.random.

## `vector_kron`

```python
def vector_kron(first: np.ndarray, second: np.ndarray) -> np.ndarray
```

Vectorized implementation of kron for square matrices.

## `kak_vector_infidelity`

```python
def kak_vector_infidelity(k_vec_a: np.ndarray, k_vec_b: np.ndarray, ignore_equivalent_vectors: bool=False) -> np.ndarray
```

The locally invariant infidelity between two KAK vectors.

This is the quantity

$$
\min 1 - F_e( \exp(i k_a · (XX,YY,ZZ)) kL \exp(i k_b · (XX,YY,ZZ)) kR)
$$

where $F_e$ is the entanglement (process) fidelity and the minimum is taken
over all 1-local unitaries kL, kR.

Args:
    k_vec_a: A 3-vector or tensor of 3-vectors with shape (...,3).
    k_vec_b: A 3-vector or tensor of 3-vectors with shape (...,3). If both
        k_vec_a and k_vec_b are tensors, their shapes must be compatible
        for broadcasting.
    ignore_equivalent_vectors: If True, the calculation ignores any other
        KAK vectors that are equivalent to the inputs under local unitaries.
        The resulting infidelity is then only an upper bound to the true
        infidelity.

Returns:
    An ndarray storing the locally invariant infidelity between the inputs.
    If k_vec_a or k_vec_b is a tensor, the result is vectorized.

## `in_weyl_chamber`

```python
def in_weyl_chamber(kak_vec: np.ndarray) -> np.ndarray
```

Whether a given collection of coordinates is within the Weyl chamber.

Args:
    kak_vec: A numpy.ndarray tensor encoding a KAK 3-vector. Input may be
        broadcastable with shape (...,3).

Returns:
    np.ndarray of boolean values denoting whether the given coordinates
    are in the Weyl chamber.

## `weyl_chamber_mesh`

```python
def weyl_chamber_mesh(spacing: float) -> np.ndarray
```

Cubic mesh of points in the Weyl chamber.

Args:
    spacing: Euclidean distance between neighboring KAK vectors.

Returns:
    np.ndarray of shape (N,3) corresponding to the points in the Weyl
    chamber.

Raises:
    ValueError: If the spacing is so small (less than 1e-3) that this
        would build a mesh of size about 1GB.

## `kak_vector_to_unitary`

```python
def kak_vector_to_unitary(vector: np.ndarray) -> np.ndarray
```

Convert a KAK vector to its unitary matrix equivalent.

Args:
    vector: A KAK vector shape (..., 3). (Input may be vectorized).

Returns:
    unitary: Corresponding 2-qubit unitary, of the form
       $exp( i k_x \sigma_x \sigma_x + i k_y \sigma_y \sigma_y
            + i k_z \sigma_z \sigma_z)$.
       matrix or tensor of matrices of shape (..., 4,4).

## `unitary_entanglement_fidelity`

```python
def unitary_entanglement_fidelity(U_actual: np.ndarray, U_ideal: np.ndarray) -> np.ndarray
```

Entanglement fidelity between two unitaries.

For unitary matrices, this is related to the average unitary fidelity F
as

:math:`F = \frac{F_e d + 1}{d + 1}`
where d is the matrix dimension.

Args:
    U_actual : Matrix whose fidelity to U_ideal will be computed. This may
        be a non-unitary matrix, i.e. the projection of a larger unitary
        matrix into the computational subspace.
    U_ideal : Unitary matrix to which U_actual will be compared.

Both arguments may be vectorized, in that their shapes may be of the form
(...,M,M) (as long as both shapes can be broadcast together).

Returns:
    The entanglement fidelity between the two unitaries. For inputs with
    shape (...,M,M), the output has shape (...).
