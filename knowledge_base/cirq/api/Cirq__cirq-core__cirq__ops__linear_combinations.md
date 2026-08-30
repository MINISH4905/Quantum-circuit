---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/linear_combinations.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/linear_combinations.py
license: Apache-2.0
---

## `LinearCombinationOfGates`

```python
class LinearCombinationOfGates(value.LinearDict[raw_types.Gate])
```

Represents linear operator defined by a linear combination of gates.

Suppose G1, G2, ..., Gn are gates and b1, b2, ..., bn are complex
numbers. Then

    LinearCombinationOfGates({G1: b1, G2: b2, ..., Gn: bn})

represents the linear operator

    A = b1 G1 + b2 G2 + ... + bn Gn

Note that A may not be unitary or even normal.

Rather than creating LinearCombinationOfGates instance explicitly, one may
use overloaded arithmetic operators. For example,

    cirq.LinearCombinationOfGates({cirq.X: 2, cirq.Z: -2})

is equivalent to

    2 * cirq.X - 2 * cirq.Z

### `__init__`

```python
def __init__(self, terms: Mapping[raw_types.Gate, cirq.TParamValComplex]) -> None
```

Initializes linear combination from a collection of terms.

Args:
    terms: Mapping of gates to coefficients in the linear combination
        being initialized.

### `num_qubits`

```python
def num_qubits(self) -> int | None
```

Returns number of qubits in the domain if known, None if unknown.

### `matrix`

```python
def matrix(self) -> np.ndarray
```

Reconstructs matrix of self using unitaries of underlying gates.

Raises:
    ValueError: If the number of qubits has not been specified.

## `LinearCombinationOfOperations`

```python
class LinearCombinationOfOperations(value.LinearDict[raw_types.Operation])
```

Represents operator defined by linear combination of gate operations.

If G1, ..., Gn are gate operations, {q1_1, ..., q1_k1}, {q2_1, ..., q2_k2},
..., {qn_1, ..., qn_kn} are (not necessarily disjoint) sets of qubits and
b1, b2, ..., bn are complex numbers, then

    LinearCombinationOfOperations({
        G1(q1_1, ..., q1_k1): b1,
        G2(q2_1, ..., q2_k2): b2,
        ...,
        Gn(qn_1, ..., qn_kn): bn})

represents the linear operator

    A = b1 G1(q1_1, ..., q1_k1) +
      + b2 G2(q2_1, ..., q2_k2) +
      + ... +
      + bn Gn(qn_1, ..., qn_kn)

where in each term qubits not explicitly listed are assumed to be acted on
by the identity operator. Note that A may not be unitary or even normal.

### `__init__`

```python
def __init__(self, terms: Mapping[raw_types.Operation, cirq.TParamValComplex]) -> None
```

Initializes linear combination from a collection of terms.

Args:
    terms: Mapping of gate operations to coefficients in the linear
        combination being initialized.

### `qubits`

```python
def qubits(self) -> tuple[raw_types.Qid, ...]
```

Returns qubits acted on self.

### `matrix`

```python
def matrix(self) -> np.ndarray
```

Reconstructs matrix of self using unitaries of underlying operations.

Raises:
    TypeError: if any of the gates in self does not provide a unitary.

## `PauliSum`

```python
class PauliSum
```

Represents operator defined by linear combination of PauliStrings.

Since `cirq.PauliString`s store their own coefficients, this class
does not implement the `cirq.LinearDict` interface. Instead, you can
add and subtract terms and then iterate over the resulting
(simplified) expression.

Under the hood, this class is backed by a LinearDict with coefficient-less
PauliStrings as keys. PauliStrings are reconstructed on-the-fly during
iteration.  Note the ordering of Pauli gates and qubits in such reconstructed
strings may differ from the order in PauliStrings that were combined in PauliSum.

PauliSums can be constructed explicitly:


>>> a, b = cirq.GridQubit.rect(1, 2)
>>> psum = cirq.PauliSum.from_pauli_strings([
...     cirq.PauliString(-1, cirq.X(a), cirq.Y(b)),
...     cirq.PauliString(2, cirq.Z(a), cirq.Z(b)),
...     cirq.PauliString(0.5, cirq.Y(a), cirq.Y(b))
... ])
>>> print(psum)
-1.000*X(q(0, 0))*Y(q(0, 1))+2.000*Z(q(0, 0))*Z(q(0, 1))+0.500*Y(q(0, 0))*Y(q(0, 1))


or implicitly:


>>> a, b = cirq.GridQubit.rect(1, 2)
>>> psum = cirq.X(a) * cirq.X(b) + 3.0 * cirq.Y(a)
>>> print(psum)
1.000*X(q(0, 0))*X(q(0, 1))+3.000*Y(q(0, 0))

basic arithmetic and expectation operations are supported as well:


>>> a, b = cirq.GridQubit.rect(1, 2)
>>> psum = cirq.X(a) * cirq.X(b) + 3.0 * cirq.Y(a)
>>> two_psum = 2 * psum
>>> four_psum = two_psum + two_psum
>>> print(four_psum)
4.000*X(q(0, 0))*X(q(0, 1))+12.000*Y(q(0, 0))


>>> expectation = four_psum.expectation_from_state_vector(
...     np.array([0.707106, 0, 0, 0.707106], dtype=complex),
...     qubit_map={a: 0, b: 1}
... )
>>> print(f'{expectation:.1f}')
4.0+0.0j

### `__init__`

```python
def __init__(self, linear_dict: value.LinearDict[UnitPauliStringT] | None=None)
```

Construct a PauliSum from a linear dictionary.

Note, the preferred method of constructing PauliSum objects is either implicitly
or via the `from_pauli_strings` function.

Args:
    linear_dict: Set of  (`cirq.Qid`, `cirq.Pauli`) tuples to construct the sum
        from.

Raises:
    ValueError: If structure of `linear_dict` contains tuples other than the
        form (`cirq.Qid`, `cirq.Pauli`).

### `wrap`

```python
def wrap(val: PauliSumLike) -> PauliSum
```

Convert a `cirq.PauliSumLike` object to a PauliSum

Attempts to convert an existing int, float, complex, `cirq.PauliString`,
`cirq.PauliSum` or `cirq.SingleQubitPauliStringGateOperation` into
a `cirq.PauliSum` object. For example:


>>> my_psum = cirq.PauliSum.wrap(2.345)
>>> my_psum
cirq.PauliSum(cirq.LinearDict({frozenset(): (2.345+0j)}))


Args:
    `cirq.PauliSumLike` to convert to PauliSum.

Returns:
    PauliSum representation of `val`.

### `from_pauli_strings`

```python
def from_pauli_strings(cls, terms: PauliString | list[PauliString]) -> PauliSum
```

Returns a PauliSum by combining `cirq.PauliString` terms.

Args:
    terms: `cirq.PauliString` or List of `cirq.PauliString`s to use inside
        of this PauliSum object.
Returns:
    PauliSum object representing the addition of all the `cirq.PauliString`
        terms in `terms`.

### `from_boolean_expression`

```python
def from_boolean_expression(cls, boolean_expr: sympy.Expr, qubit_map: Mapping[str, cirq.Qid]) -> PauliSum
```

Builds the Hamiltonian representation of a Boolean expression.

This is based on "On the representation of Boolean and real functions as Hamiltonians for
quantum computing" by Stuart Hadfield, https://arxiv.org/abs/1804.09130

Args:
    boolean_expr: A Sympy expression containing symbols and Boolean operations
    qubit_map: map of string (boolean variable name) to qubit.

Return:
    The PauliSum that represents the Boolean expression.

Raises:
    ValueError: If `boolean_expr` is of an unsupported type.

### `qubits`

```python
def qubits(self) -> tuple[raw_types.Qid, ...]
```

The sorted list of qubits used in this PauliSum.

### `with_qubits`

```python
def with_qubits(self, *new_qubits: cirq.Qid) -> PauliSum
```

Return a new PauliSum on `new_qubits`.

Args:
    *new_qubits: `cirq.Qid` objects to replace existing
        qubit objects in this PauliSum.

Returns:
    PauliSum with new_qubits replacing the previous
        qubits.

Raises:
    ValueError: If len(new_qubits) != len(self.qubits).

### `copy`

```python
def copy(self) -> PauliSum
```

Return a copy of this PauliSum.

Returns: A copy of this PauliSum.

### `matrix`

```python
def matrix(self, qubits: Iterable[raw_types.Qid] | None=None) -> np.ndarray
```

Returns the matrix of this PauliSum in computational basis of qubits.

Args:
    qubits: Ordered collection of qubits that determine the subspace
        in which the matrix representation of the Pauli sum is to
        be computed. If none is provided the default ordering of
        `self.qubits` is used.  Qubits present in `qubits` but absent from
        `self.qubits` are acted on by the identity.

Returns:
    np.ndarray representing the matrix of this PauliSum expression.

Raises:
    TypeError: if any of the gates in self does not provide a unitary.

### `sparse_matrix`

```python
def sparse_matrix(self, qubits: Iterable[raw_types.Qid] | None=None) -> sparse.csr_matrix
```

Returns the sparse matrix of this `PauliSum` in the computational basis of the qubits.

For each term we build the sparse matrix via direct bit-manipulation
(see `PauliString.sparse_matrix`) and collect its non-zero entries as
COO (COOrdinate) triplets (data, row, col).  All triplets are
concatenated and a single sparse matrix is built at the end, avoiding
the overhead of adding sparse matrices term-by-term.

Args:
    qubits: Ordered collection of qubits that determine the subspace
        in which the matrix representation of the Pauli sum is to
        be computed. If none is provided the default ordering of
        `self.qubits` is used.  Qubits present in `qubits` but absent from
        `self.qubits` are acted on by the identity.

Returns:
    A `scipy.sparse.csr_matrix` representing the Pauli sum.

### `expectation_from_state_vector`

```python
def expectation_from_state_vector(self, state_vector: np.ndarray, qubit_map: Mapping[raw_types.Qid, int], *, atol: float=1e-07, check_preconditions: bool=True) -> float
```

Evaluate the expectation of this PauliSum given a state vector.

See `PauliString.expectation_from_state_vector`.

Args:
    state_vector: An array representing a valid state vector.
    qubit_map: A map from all qubits used in this PauliSum to the
        indices of the qubits that `state_vector` is defined over.
    atol: Absolute numerical tolerance.
    check_preconditions: Whether to check that `state_vector` represents
        a valid state vector.

Returns:
    The expectation value of the input state.

Raises:
    NotImplementedError: If any of the coefficients are imaginary,
        so that this is not Hermitian.
    TypeError: If the input state is not a complex type.
    ValueError: If the input vector is not the correct size or shape.

### `expectation_from_density_matrix`

```python
def expectation_from_density_matrix(self, state: np.ndarray, qubit_map: Mapping[raw_types.Qid, int], *, atol: float=1e-07, check_preconditions: bool=True) -> float
```

Evaluate the expectation of this PauliSum given a density matrix.

See `PauliString.expectation_from_density_matrix`.

Args:
    state: An array representing a valid  density matrix.
    qubit_map: A map from all qubits used in this PauliSum to the
        indices of the qubits that `state` is defined over.
    atol: Absolute numerical tolerance.
    check_preconditions: Whether to check that `state` represents a
        valid density matrix.

Returns:
    The expectation value of the input state.

Raises:
    NotImplementedError: If any of the coefficients are imaginary,
        so that this is not Hermitian.
    TypeError: If the input state is not a complex type.
    ValueError: If the input vector is not the correct size or shape.

## `ProjectorSum`

```python
class ProjectorSum
```

List of mappings representing a sum of projector operators.

### `__init__`

```python
def __init__(self, linear_dict: value.LinearDict[frozenset[tuple[raw_types.Qid, int]]] | None=None)
```

Constructor for ProjectorSum

Args:
    linear_dict: A linear dictionary from a set of tuples of (Qubit, integer) to a complex
        number. The tuple is a projector onto the qubit and the complex number is the
        weight of these projections.

### `from_projector_strings`

```python
def from_projector_strings(cls, terms: ProjectorString | list[ProjectorString]) -> ProjectorSum
```

Builds a ProjectorSum from one or more ProjectorString(s).

Args:
    terms: Either a single ProjectorString or a list of ProjectorStrings.

Returns:
    A ProjectorSum.

### `matrix`

```python
def matrix(self, projector_qids: Iterable[raw_types.Qid] | None=None) -> sparse.csr_matrix
```

Returns the matrix of self in the computational basis of the qubits.

Args:
    projector_qids: Ordered collection of qubits that determine the subspace in which the
        matrix representation of the ProjectorSum is to be computed. Qbits absent from
        self.qubits are acted on by the identity. Defaults to the qubits of the
        projector_dict.

Returns:
    A sparse matrix that is the projection in the specified basis.

### `expectation_from_state_vector`

```python
def expectation_from_state_vector(self, state_vector: np.ndarray, qid_map: Mapping[raw_types.Qid, int]) -> float
```

Compute the expectation value of this ProjectorSum given a state vector.

Projects the state vector onto the sum of projectors and computes the expectation of the
measurements.

Args:
    state_vector: An array representing a valid state vector.
    qid_map: A map from all qubits used in this ProjectorSum to the indices of the qubits
        that `state_vector` is defined over.

Returns:
    The expectation value of the input state.

### `expectation_from_density_matrix`

```python
def expectation_from_density_matrix(self, state: np.ndarray, qid_map: Mapping[raw_types.Qid, int]) -> float
```

Expectation of the sum of projections from a density matrix.

Projects the density matrix onto the sum of projectors and computes the expectation of the
measurements.

Args:
    state: An array representing a valid  density matrix.
    qid_map: A map from all qubits used in this ProjectorSum to the indices of the qubits
        that `state_vector` is defined over.

Returns:
    The expectation value of the input state.
