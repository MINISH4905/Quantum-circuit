---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/qis/channels.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/qis/channels.py
license: Apache-2.0
---

## Module `cirq-core/cirq/qis/channels.py`

Tools for analyzing and manipulating quantum channels.

## `kraus_to_choi`

```python
def kraus_to_choi(kraus_operators: Sequence[np.ndarray]) -> np.ndarray
```

Returns the unique Choi matrix corresponding to a Kraus representation of a channel.

Quantum channel E: L(H1) -> L(H2) may be described by a collection of operators A_i, called
Kraus operators, such that

    $$
    E(\rho) = \sum_i A_i \rho A_i^\dagger.
    $$

Kraus representation is not unique. Alternatively, E may be specified by its Choi matrix J(E)
defined as

    $$
    J(E) = (E \otimes I)(|\phi\rangle\langle\phi|)
    $$

where $|\phi\rangle = \sum_i|i\rangle|i\rangle$ is the unnormalized maximally entangled state
and I: L(H1) -> L(H1) is the identity map. Choi matrix is unique for a given channel.

The computation of the Choi matrix from a Kraus representation is essentially a reconstruction
of a matrix from its eigendecomposition. It has the cost of O(kd**4) where k is the number of
Kraus operators and d is the dimension of the input and output Hilbert space.

Args:
    kraus_operators: Sequence of Kraus operators specifying a quantum channel.

Returns:
    Choi matrix of the channel specified by kraus_operators.

## `choi_to_kraus`

```python
def choi_to_kraus(choi: np.ndarray, atol: float=1e-10) -> Sequence[np.ndarray]
```

Returns a Kraus representation of a channel with given Choi matrix.

Quantum channel E: L(H1) -> L(H2) may be described by a collection of operators A_i, called
Kraus operators, such that

    $$
    E(\rho) = \sum_i A_i \rho A_i^\dagger.
    $$

Kraus representation is not unique. Alternatively, E may be specified by its Choi matrix J(E)
defined as

    $$
    J(E) = (E \otimes I)(|\phi\rangle\langle\phi|)
    $$

where $|\phi\rangle = \sum_i|i\rangle|i\rangle$ is the unnormalized maximally entangled state
and I: L(H1) -> L(H1) is the identity map. Choi matrix is unique for a given channel.

The most expensive step in the computation of a Kraus representation from a Choi matrix is
the eigendecomposition of the Choi. Therefore, the cost of the conversion is O(d**6) where
d is the dimension of the input and output Hilbert space.

Args:
    choi: Choi matrix of the channel.
    atol: Tolerance used in checking if choi is positive and in deciding which Kraus
        operators to omit.

Returns:
    Approximate Kraus representation of the quantum channel specified via a Choi matrix.
    Kraus operators with Frobenius norm smaller than atol are omitted.

Raises:
    ValueError: when choi is not a positive square matrix.

## `kraus_to_superoperator`

```python
def kraus_to_superoperator(kraus_operators: Sequence[np.ndarray]) -> np.ndarray
```

Returns the matrix representation of the linear map with given Kraus operators.

Quantum channel E: L(H1) -> L(H2) may be described by a collection of operators A_i, called
Kraus operators, such that

    $$
    E(\rho) = \sum_i A_i \rho A_i^\dagger.
    $$

Kraus representation is not unique. Alternatively, E may be specified by its superoperator
matrix K(E) defined so that

    $$
    K(E) vec(\rho) = vec(E(\rho))
    $$

where the vectorization map $vec$ rearranges d-by-d matrices into d**2-dimensional vectors.
Superoperator matrix is unique for a given channel. It is also called the natural
representation of a quantum channel.

The computation of the superoperator matrix from a Kraus representation involves the sum of
Kronecker products of all Kraus operators. This has the cost of O(kd**4) where k is the number
of Kraus operators and d is the dimension of the input and output Hilbert space.

Args:
    kraus_operators: Sequence of Kraus operators specifying a quantum channel.

Returns:
    Superoperator matrix of the channel specified by kraus_operators.

## `superoperator_to_kraus`

```python
def superoperator_to_kraus(superoperator: np.ndarray, atol: float=1e-10) -> Sequence[np.ndarray]
```

Returns a Kraus representation of a channel specified via the superoperator matrix.

Quantum channel E: L(H1) -> L(H2) may be described by a collection of operators A_i, called
Kraus operators, such that

    $$
    E(\rho) = \sum_i A_i \rho A_i^\dagger.
    $$

Kraus representation is not unique. Alternatively, E may be specified by its superoperator
matrix K(E) defined so that

    $$
    K(E) vec(\rho) = vec(E(\rho))
    $$

where the vectorization map $vec$ rearranges d-by-d matrices into d**2-dimensional vectors.
Superoperator matrix is unique for a given channel. It is also called the natural
representation of a quantum channel.

The most expensive step in the computation of a Kraus representation from a superoperator
matrix is eigendecomposition. Therefore, the cost of the conversion is O(d**6) where d is
the dimension of the input and output Hilbert space.

Args:
    superoperator: Superoperator matrix specifying a quantum channel.
    atol: Tolerance used to check which Kraus operators to omit.

Returns:
    Sequence of Kraus operators of the channel specified by superoperator.
    Kraus operators with Frobenius norm smaller than atol are omitted.

Raises:
    ValueError: If superoperator is not a valid superoperator matrix.

## `choi_to_superoperator`

```python
def choi_to_superoperator(choi: np.ndarray) -> np.ndarray
```

Returns the superoperator matrix of a quantum channel specified via the Choi matrix.

Quantum channel E: L(H1) -> L(H2) may be specified by its Choi matrix J(E) defined as

    $$
    J(E) = (E \otimes I)(|\phi\rangle\langle\phi|)
    $$

where $|\phi\rangle = \sum_i|i\rangle|i\rangle$ is the unnormalized maximally entangled state
and I: L(H1) -> L(H1) is the identity map. Choi matrix is unique for a given channel.
Alternatively, E may be specified by its superoperator matrix K(E) defined so that

    $$
    K(E) vec(\rho) = vec(E(\rho))
    $$

where the vectorization map $vec$ rearranges d-by-d matrices into d**2-dimensional vectors.
Superoperator matrix is unique for a given channel. It is also called the natural
representation of a quantum channel.

A quantum channel can be viewed as a tensor with four indices. Different ways of grouping
the indices into two pairs yield different matrix representations of the channel, including
the superoperator and Choi representations. Hence, the conversion between the superoperator
and Choi matrices is a permutation of matrix elements effected by reshaping the array and
swapping its axes. Therefore, its cost is O(d**4) where d is the dimension of the input and
output Hilbert space.

Args:
    choi: Choi matrix specifying a quantum channel.

Returns:
    Superoperator matrix of the channel specified by choi.

Raises:
    ValueError: If Choi is not Hermitian or is of invalid shape.

## `superoperator_to_choi`

```python
def superoperator_to_choi(superoperator: np.ndarray) -> np.ndarray
```

Returns the Choi matrix of a quantum channel specified via the superoperator matrix.

Quantum channel E: L(H1) -> L(H2) may be specified by its Choi matrix J(E) defined as

    $$
    J(E) = (E \otimes I)(|\phi\rangle\langle\phi|)
    $$

where $|\phi\rangle = \sum_i|i\rangle|i\rangle$ is the unnormalized maximally entangled state
and I: L(H1) -> L(H1) is the identity map. Choi matrix is unique for a given channel.
Alternatively, E may be specified by its superoperator matrix K(E) defined so that

    $$
    K(E) vec(\rho) = vec(E(\rho))
    $$

where the vectorization map $vec$ rearranges d-by-d matrices into d**2-dimensional vectors.
Superoperator matrix is unique for a given channel. It is also called the natural
representation of a quantum channel.

A quantum channel can be viewed as a tensor with four indices. Different ways of grouping
the indices into two pairs yield different matrix representations of the channel, including
the superoperator and Choi representations. Hence, the conversion between the superoperator
and Choi matrices is a permutation of matrix elements effected by reshaping the array and
swapping its axes. Therefore, its cost is O(d**4) where d is the dimension of the input and
output Hilbert space.

Args:
    superoperator: Superoperator matrix specifying a quantum channel.

Returns:
    Choi matrix of the channel specified by superoperator.

Raises:
    ValueError: If superoperator has invalid shape.

## `operation_to_choi`

```python
def operation_to_choi(operation: protocols.SupportsKraus) -> np.ndarray
```

Returns the unique Choi matrix associated with an operation.

Choi matrix J(E) of a linear map E: L(H1) -> L(H2) which takes linear operators
on Hilbert space H1 to linear operators on Hilbert space H2 is defined as

    $$
    J(E) = (E \otimes I)(|\phi\rangle\langle\phi|)
    $$

where $|\phi\rangle = \sum_i|i\rangle|i\rangle$ is the unnormalized maximally
entangled state and I: L(H1) -> L(H1) is the identity map. Note that J(E) is
a square matrix with d1*d2 rows and columns where d1 = dim H1 and d2 = dim H2.

Args:
    operation: Quantum channel.
Returns:
    Choi matrix corresponding to operation.

## `operation_to_superoperator`

```python
def operation_to_superoperator(operation: protocols.SupportsKraus) -> np.ndarray
```

Returns the matrix representation of an operation in standard basis.

Let E: L(H1) -> L(H2) denote a linear map which takes linear operators on Hilbert space H1
to linear operators on Hilbert space H2 and let d1 = dim H1 and d2 = dim H2. Also, let Fij
denote an operator whose matrix has one in ith row and jth column and zeros everywhere else.
Note that d1-by-d1 operators Fij form a basis of L(H1). Similarly, d2-by-d2 operators Fij
form a basis of L(H2). This function returns the matrix of E in these bases.

Args:
    operation: Quantum channel.
Returns:
    Matrix representation of operation.
