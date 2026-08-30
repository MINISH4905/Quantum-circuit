---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/pauli_string.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/pauli_string.py
license: Apache-2.0
---

## `PauliString`

```python
class PauliString(raw_types.Operation, Generic[TKey])
```

Represents a multi-qubit pauli operator or pauli observable.

`cirq.PauliString` represents a multi-qubit pauli operator, i.e.
a tensor product of single qubit (non identity) pauli operations,
each acting on a different qubit. For  example,

- X(0) * Y(1) * Z(2): Represents a pauli string which is a tensor product of
                      `cirq.X(q0)`, `cirq.Y(q1)` and `cirq.Z(q2)`.

If more than one pauli operation acts on the same set of qubits, their composition is
immediately reduced to an equivalent (possibly multi-qubit) Pauli operator. Also, identity
operations are dropped by the `PauliString` class. For example:

>>> a, b = cirq.LineQubit.range(2)
>>> print(cirq.X(a) * cirq.Y(b)) # Tensor product of Pauli's acting on different qubits.
X(q(0))*Y(q(1))
>>> print(cirq.X(a) * cirq.Y(a)) # Composition is reduced to an equivalent PauliString.
1j*Z(q(0))
>>> print(cirq.X(a) * cirq.I(b)) # Identity operations are dropped by default.
X(q(0))
>>> print(cirq.PauliString()) # String representation of an "empty" PaulString is "I".
I

`cirq.PauliString` is often used to represent:
- Pauli operators: Can be inserted into circuits as multi qubit operations.
- Pauli observables: Can be measured using either `cirq.measure_single_paulistring`/
                    `cirq.measure_paulistring_terms`; or using the observable
                    measurement framework in `cirq.measure_observables`.

PauliStrings can be constructed via various different ways, some examples are
given as follows:

>>> a, b, c = cirq.LineQubit.range(3)
>>> print(cirq.PauliString([cirq.X(a), cirq.X(a)]))
I
>>> print(cirq.PauliString(-1, cirq.X(a), cirq.Y(b), cirq.Z(c)))
-X(q(0))*Y(q(1))*Z(q(2))
>>> print(-1 * cirq.X(a) * cirq.Y(b) * cirq.Z(c))
-X(q(0))*Y(q(1))*Z(q(2))
>>> print(cirq.PauliString({a: cirq.X}, [-2, 3, cirq.Y(a)]))
-6j*Z(q(0))
>>> print(cirq.PauliString({a: cirq.I, b: cirq.X}))
X(q(1))
>>> print(cirq.PauliString({a: cirq.Y}, qubit_pauli_map={a: cirq.X}))
1j*Z(q(0))

Note that `cirq.PauliString`s are immutable objects. If you need a mutable version
of pauli strings, see `cirq.MutablePauliString`.

### `__init__`

```python
def __init__(self, *contents: cirq.PAULI_STRING_LIKE, qubit_pauli_map: dict[TKey, cirq.Pauli] | None=None, coefficient: cirq.TParamValComplex=1)
```

Initializes a new `PauliString` operation.

Args:
    *contents: A value or values to convert into a pauli string. This
        can be a number, a pauli operation, a dictionary from qubit to
        pauli/identity gates, or collections thereof. If a list of
        values is given, they are each individually converted and then
        multiplied from left to right in order.
    qubit_pauli_map: Initial dictionary mapping qubits to pauli
        operations. Defaults to the empty dictionary. Note that, unlike
        dictionaries passed to contents, this dictionary must not
        contain any identity gate values. Further note that this
        argument specifies values that are logically *before* factors
        specified in `contents`; `contents` are *right* multiplied onto
        the values in this dictionary.
    coefficient: Initial scalar coefficient or symbol. Defaults to 1.

Raises:
    TypeError: If the `qubit_pauli_map` has values that are not Paulis.

### `coefficient`

```python
def coefficient(self) -> cirq.TParamValComplex
```

A scalar coefficient or symbol.

### `equal_up_to_coefficient`

```python
def equal_up_to_coefficient(self, other: cirq.PauliString) -> bool
```

Returns true of `self` and `other` are equal pauli strings, ignoring the coefficient.

### `get`

```python
def get(self, key: Any, default: TDefault | None=None) -> pauli_gates.Pauli | TDefault | None
```

Returns the `cirq.Pauli` operation acting on qubit `key` or `default` if none exists.

### `gate`

```python
def gate(self) -> cirq.DensePauliString
```

Returns a `cirq.DensePauliString`

### `keys`

```python
def keys(self) -> KeysView[TKey]
```

Returns the sequence of qubits on which this pauli string acts.

### `qubits`

```python
def qubits(self) -> tuple[TKey, ...]
```

Returns a tuple of qubits on which this pauli string acts.

### `with_qubits`

```python
def with_qubits(self, *new_qubits: cirq.Qid) -> PauliString
```

Returns a new `PauliString` with `self.qubits` mapped to `new_qubits`.

Args:
    new_qubits: The new qubits to replace `self.qubits` by.

Returns:
    `PauliString` with mapped qubits.

Raises:
    ValueError: If `len(new_qubits) != len(self.qubits)`.

### `with_coefficient`

```python
def with_coefficient(self, new_coefficient: cirq.TParamValComplex) -> PauliString
```

Returns a new `PauliString` with `self.coefficient` replaced with `new_coefficient`.

### `values`

```python
def values(self) -> ValuesView[pauli_gates.Pauli]
```

Ordered sequence of `cirq.Pauli` gates acting on `self.keys()`.

### `items`

```python
def items(self) -> ItemsView[TKey, pauli_gates.Pauli]
```

Returns (cirq.Qid, cirq.Pauli) pairs representing 1-qubit operations of pauli string.

### `frozen`

```python
def frozen(self) -> cirq.PauliString
```

Returns a `cirq.PauliString` with the same contents.

### `mutable_copy`

```python
def mutable_copy(self) -> cirq.MutablePauliString
```

Returns a new `cirq.MutablePauliString` with the same contents.

### `matrix`

```python
def matrix(self, qubits: Iterable[TKey] | None=None) -> np.ndarray
```

Returns the matrix of self in the computational basis of the qubits.

Args:
    qubits: Ordered collection of qubits that determine the subspace
        in which the matrix representation of the Pauli string is to
        be computed. Qubits absent from `self.qubits` are acted on by
        the identity. Defaults to `self.qubits`.

Raises:
    NotImplementedError: If this `PauliString` is parameterized.

### `sparse_matrix`

```python
def sparse_matrix(self, qubits: Iterable[TKey] | None=None) -> sparse.csr_matrix
```

Returns the sparse matrix of self in the computational basis of the qubits.

Uses a direct bit-manipulation algorithm that avoids Kronecker products
by computing row/col indices and phases for each basis state directly.

Args:
    qubits: Ordered collection of qubits that determine the subspace
        in which the matrix representation of the Pauli string is to
        be computed. Qubits absent from `self.qubits` are acted on by
        the identity. Defaults to `self.qubits`.

Returns:
    A `scipy.sparse.csr_matrix` representing the Pauli string.

Raises:
    NotImplementedError: If this `PauliString` is parameterized.
    AssertionError: If an unexpected Pauli gate instance is encountered.

### `expectation_from_state_vector`

```python
def expectation_from_state_vector(self, state_vector: np.ndarray, qubit_map: Mapping[TKey, int], *, atol: float=1e-07, check_preconditions: bool=True) -> float
```

Evaluate the expectation of this PauliString given a state vector.

Compute the expectation value of this PauliString with respect to a
state vector. By convention expectation values are defined for Hermitian
operators, and so this method will fail if this PauliString is
non-Hermitian.

`state` must be an array representation of a state vector and have
shape `(2 ** n, )` or `(2, 2, ..., 2)` (n entries) where `state` is
expressed over n qubits.

`qubit_map` must assign an integer index to each qubit in this
PauliString that determines which bit position of a computational basis
state that qubit corresponds to. For example if `state` represents
$|0\rangle |+\rangle$ and `q0, q1 = cirq.LineQubit.range(2)` then:

    cirq.X(q0).expectation(state, qubit_map={q0: 0, q1: 1}) = 0
    cirq.X(q0).expectation(state, qubit_map={q0: 1, q1: 0}) = 1

Args:
    state_vector: An array representing a valid state vector.
    qubit_map: A map from all qubits used in this PauliString to the
        indices of the qubits that `state_vector` is defined over.
    atol: Absolute numerical tolerance.
    check_preconditions: Whether to check that `state_vector` represents
        a valid state vector.

Returns:
    The expectation value of the input state.

Raises:
    NotImplementedError: If this PauliString is non-Hermitian or
        parameterized.
    TypeError: If the input state is not complex.
    ValueError: If the input state does not have the correct shape.

### `expectation_from_density_matrix`

```python
def expectation_from_density_matrix(self, state: np.ndarray, qubit_map: Mapping[TKey, int], *, atol: float=1e-07, check_preconditions: bool=True) -> float
```

Evaluate the expectation of this PauliString given a density matrix.

Compute the expectation value of this PauliString with respect to an
array representing a density matrix. By convention expectation values
are defined for Hermitian operators, and so this method will fail if
this PauliString is non-Hermitian.

`state` must be an array representation of a density matrix and have
shape `(2 ** n, 2 ** n)` or `(2, 2, ..., 2)` (2*n entries), where
`state` is expressed over n qubits.

`qubit_map` must assign an integer index to each qubit in this
PauliString that determines which bit position of a computational basis
state that qubit corresponds to. For example if `state` represents
$|0\rangle |+\rangle$ and `q0, q1 = cirq.LineQubit.range(2)` then:

    cirq.X(q0).expectation(state, qubit_map={q0: 0, q1: 1}) = 0
    cirq.X(q0).expectation(state, qubit_map={q0: 1, q1: 0}) = 1

Args:
    state: An array representing a valid  density matrix.
    qubit_map: A map from all qubits used in this PauliString to the
        indices of the qubits that `state` is defined over.
    atol: Absolute numerical tolerance.
    check_preconditions: Whether to check that `state` represents a
        valid density matrix.

Returns:
    The expectation value of the input state.

Raises:
    NotImplementedError: If this PauliString is non-Hermitian or
        parameterized.
    TypeError: If the input state is not complex.
    ValueError: If the input state does not have the correct shape.

### `zip_items`

```python
def zip_items(self, other: cirq.PauliString[TKey]) -> Iterator[tuple[TKey, tuple[pauli_gates.Pauli, pauli_gates.Pauli]]]
```

Combines pauli operations from pauli strings in a qubit-by-qubit fashion.

For every qubit that has a `cirq.Pauli` operation acting on it in both `self` and `other`,
the method yields a tuple corresponding to `(qubit, (pauli_in_self, pauli_in_other))`.

Args:
    other: The other `cirq.PauliString` to zip pauli operations with.

Returns:
    A sequence of `(qubit, (pauli_in_self, pauli_in_other))` tuples for every `qubit`
    that has a `cirq.Pauli` operation acting on it in both `self` and `other.

### `zip_paulis`

```python
def zip_paulis(self, other: cirq.PauliString) -> Iterator[tuple[pauli_gates.Pauli, pauli_gates.Pauli]]
```

Combines pauli operations from pauli strings in a qubit-by-qubit fashion.

For every qubit that has a `cirq.Pauli` operation acting on it in both `self` and `other`,
the method yields a tuple corresponding to `(pauli_in_self, pauli_in_other)`.

Args:
    other: The other `cirq.PauliString` to zip pauli operations with.

Returns:
    A sequence of `(pauli_in_self, pauli_in_other)` tuples for every `qubit`
    that has a `cirq.Pauli` operation acting on it in both `self` and `other.

### `__array_ufunc__`

```python
def __array_ufunc__(self, ufunc, method, *inputs, **kwargs)
```

Override numpy behavior.

### `map_qubits`

```python
def map_qubits(self, qubit_map: dict[TKey, TKeyNew]) -> cirq.PauliString[TKeyNew]
```

Replaces every qubit `q` in `self.qubits` with `qubit_map[q]`.

Args:
    qubit_map: A map from qubits in the pauli string to new qubits.

Returns:
    A new `PauliString` with remapped qubits.

Raises:
    ValueError: If the map does not contain an entry for all qubits in the pauli string.

### `to_z_basis_ops`

```python
def to_z_basis_ops(self) -> Iterator[raw_types.Operation]
```

Returns single qubit operations to convert the qubits to the computational basis.

### `dense`

```python
def dense(self, qubits: Sequence[TKey]) -> cirq.DensePauliString
```

Returns a `cirq.DensePauliString` version of this Pauli string.

This method satisfies the invariant `P.dense(qubits).on(*qubits) == P`.

Args:
    qubits: The implicit sequence of qubits used by the dense pauli
        string. Specifically, if the returned dense Pauli string was
        applied to these qubits (via its `on` method) then the result
        would be a Pauli string equivalent to the receiving Pauli
        string.

Returns:
    A `cirq.DensePauliString` instance `D` such that `D.on(*qubits)`
    equals the receiving `cirq.PauliString` instance `P`.

Raises:
    ValueError: If the number of qubits is too small.

### `conjugated_by`

```python
def conjugated_by(self, clifford: cirq.OP_TREE) -> PauliString
```

Returns the Pauli string conjugated by a clifford operation.

The product-of-Paulis $P$ conjugated by the Clifford operation $C$ is

    $$
    C^\dagger P C
    $$

For example, conjugating a +Y operation by an S operation results in a
+X operation (as opposed to a -X operation).

In a circuit diagram where `P` is a pauli string observable immediately
after a Clifford operation `C`, the pauli string `P.conjugated_by(C)` is
the equivalent pauli string observable just before `C`.

    --------------------------C---P---

    = ---C---P------------------------

    = ---C---P---------C^-1---C-------

    = ---C---P---C^-1---------C-------

    = --(C^-1 · P · C)--------C-------

    = ---P.conjugated_by(C)---C-------

Analogously, a Pauli product P can be moved from before a Clifford C in
a circuit diagram to after the Clifford C by conjugating P by the
inverse of C:

    ---P---C---------------------------

    = -----C---P.conjugated_by(C^-1)---

Args:
    clifford: The Clifford operation to conjugate by. This can be an
        individual operation, or a tree of operations.

        Note that the composite Clifford operation defined by a sequence
        of operations is equivalent to a circuit containing those
        operations in the given order. Somewhat counter-intuitively,
        this means that the operations in the sequence are conjugated
        onto the Pauli string in reverse order. For example,
        `P.conjugated_by([C1, C2])` is equivalent to
        `P.conjugated_by(C2).conjugated_by(C1)`.

Examples:
    >>> a, b = cirq.LineQubit.range(2)
    >>> print(cirq.X(a).conjugated_by(cirq.CZ(a, b)))
    X(q(0))*Z(q(1))
    >>> print(cirq.X(a).conjugated_by(cirq.S(a)))
    -Y(q(0))
    >>> print(cirq.X(a).conjugated_by([cirq.H(a), cirq.CNOT(a, b)]))
    Z(q(0))*X(q(1))

Returns:
    The Pauli string conjugated by the given Clifford operation.

### `after`

```python
def after(self, ops: cirq.OP_TREE) -> cirq.PauliString
```

Determines the equivalent pauli string after some operations.

If the PauliString is $P$ and the Clifford operation is $C$, then the
result is $C P C^\dagger$.

Args:
    ops: A stabilizer operation or nested collection of stabilizer
        operations.

Returns:
    The result of propagating this pauli string from before to after the
    given operations.

### `before`

```python
def before(self, ops: cirq.OP_TREE) -> cirq.PauliString
```

Determines the equivalent pauli string before some operations.

If the PauliString is $P$ and the Clifford operation is $C$, then the
result is $C^\dagger P C$.

Args:
    ops: A stabilizer operation or nested collection of stabilizer
        operations.

Returns:
    The result of propagating this pauli string from after to before the
    given operations.

### `pass_operations_over`

```python
def pass_operations_over(self, ops: Iterable[cirq.Operation], after_to_before: bool=False) -> PauliString
```

Determines how the Pauli string changes when conjugated by Cliffords.

The output and input pauli strings are related by a circuit equivalence.
In particular, this circuit:

    ───ops───INPUT_PAULI_STRING───

will be equivalent to this circuit:

    ───OUTPUT_PAULI_STRING───ops───

up to global phase (assuming `after_to_before` is not set).

If ops together have matrix C, the Pauli string has matrix P, and the
output Pauli string has matrix P', then P' == C^-1 P C up to
global phase.

Setting `after_to_before` inverts the relationship, so that the output
is the input and the input is the output. Equivalently, it inverts C.

Args:
    ops: The operations to move over the string.
    after_to_before: Determines whether the operations start after the
        pauli string, instead of before (and so are moving in the
        opposite direction).

## `SingleQubitPauliStringGateOperation`

```python
class SingleQubitPauliStringGateOperation(gate_operation.GateOperation, PauliString)
```

An operation to represent single qubit pauli gates applied to a qubit.

Satisfies the contract of both `cirq.GateOperation` and `cirq.PauliString`. Relies
implicitly on the fact that PauliString({q: X}) compares as equal to
GateOperation(X, [q]).

## `MutablePauliString`

```python
class MutablePauliString(Generic[TKey])
```

Mutable version of `cirq.PauliString`, used mainly for efficiently mutating pauli strings.

`cirq.MutablePauliString` is a mutable version of `cirq.PauliString`, which is often
useful for mutating pauli strings efficiently instead of always creating a copy. Note
that, unlike `cirq.PauliString`, `MutablePauliString` is not a `cirq.Operation`.

It exists mainly to help mutate pauli strings efficiently and then convert back to a
frozen `cirq.PauliString` representation, which can then be used as operators or
observables.

### `__init__`

```python
def __init__(self, *contents: cirq.PAULI_STRING_LIKE, coefficient: cirq.TParamValComplex=1, pauli_int_dict: dict[TKey, int] | None=None)
```

Initializes a new `MutablePauliString`.

Args:
    *contents: A value or values to convert into a pauli string. This
        can be a number, a pauli operation, a dictionary from qubit to
        pauli/identity gates, or collections thereof. If a list of
        values is given, they are each individually converted and then
        multiplied from left to right in order.
    coefficient: Initial scalar coefficient or symbol. Defaults to 1.
    pauli_int_dict: Initial dictionary mapping qubits to integers corresponding
        to pauli operations. Defaults to the empty dictionary. Note that, unlike
        dictionaries passed to contents, this dictionary must not contain values
        corresponding to identity gates; i.e. all integer values must be between
        [1, 3]. Further note that this argument specifies values that are logically
        *before* factors specified in `contents`; `contents` are *right* multiplied
        onto the values in this dictionary.

Raises:
    ValueError: If the `pauli_int_dict` has integer values `v` not satisfying `1 <= v <= 3`.

### `keys`

```python
def keys(self) -> Set[TKey]
```

Returns the sequence of qubits on which this pauli string acts.

### `values`

```python
def values(self) -> Iterator[cirq.Pauli]
```

Ordered sequence of `cirq.Pauli` gates acting on `self.keys()`.

### `frozen`

```python
def frozen(self) -> cirq.PauliString
```

Returns a `cirq.PauliString` with the same contents.

For example, this is useful because `cirq.PauliString` is an operation
whereas `cirq.MutablePauliString` is not.

### `mutable_copy`

```python
def mutable_copy(self) -> cirq.MutablePauliString
```

Returns a new `cirq.MutablePauliString` with the same contents.

### `items`

```python
def items(self) -> Iterator[tuple[TKey, cirq.Pauli]]
```

Returns (cirq.Qid, cirq.Pauli) pairs representing 1-qubit operations of pauli string.

### `get`

```python
def get(self, key: TKey, default=None) -> cirq.Pauli | TDefault | None
```

Returns the `cirq.Pauli` operation acting on qubit `key` or `default` if none exists.

### `inplace_before`

```python
def inplace_before(self, ops: cirq.OP_TREE) -> cirq.MutablePauliString
```

Propagates the pauli string from after to before a Clifford effect.

If the old value of the MutablePauliString is $P$ and the Clifford
operation is $C$, then the new value of the MutablePauliString is
$C^\dagger P C$.

Args:
    ops: A stabilizer operation or nested collection of stabilizer
        operations.

Returns:
    The mutable pauli string that was mutated.

### `inplace_after`

```python
def inplace_after(self, ops: cirq.OP_TREE) -> cirq.MutablePauliString
```

Propagates the pauli string from before to after a Clifford effect.

If the old value of the MutablePauliString is $P$ and the Clifford
operation is $C$, then the new value of the MutablePauliString is
$C P C^\dagger$.

Args:
    ops: A stabilizer operation or nested collection of stabilizer
        operations.

Returns:
    The mutable pauli string that was mutated.

Raises:
    NotImplementedError: If any ops decompose into an unsupported
        Clifford gate.

### `inplace_left_multiply_by`

```python
def inplace_left_multiply_by(self, other: cirq.PAULI_STRING_LIKE) -> cirq.MutablePauliString
```

Left-multiplies a pauli string into this pauli string.

Args:
    other: A pauli string or `cirq.PAULI_STRING_LIKE` to left-multiply
        into `self`.

Returns:
    The `self` mutable pauli string that was mutated.

Raises:
    TypeError: `other` was not a `cirq.PAULI_STRING_LIKE`. `self`
        was not mutated.

### `inplace_right_multiply_by`

```python
def inplace_right_multiply_by(self, other: cirq.PAULI_STRING_LIKE) -> cirq.MutablePauliString
```

Right-multiplies a pauli string into this pauli string.

Args:
    other: A pauli string or `cirq.PAULI_STRING_LIKE` to right-multiply
        into `self`.

Returns:
    The `self` mutable pauli string that was mutated.

Raises:
    TypeError: `other` was not a `cirq.PAULI_STRING_LIKE`. `self`
        was not mutated.

### `transform_qubits`

```python
def transform_qubits(self, func: Callable[[TKey], TKeyNew], *, inplace: bool=False) -> cirq.MutablePauliString[TKeyNew]
```

Returns a `MutablePauliString` with transformed qubits.

Args:
    func: The qubit transformation to apply.
    inplace: If false (the default), creates a new mutable pauli string
        to store the result. If true, overwrites this mutable pauli
        string's contents. Defaults to false for consistency with
        `cirq.PauliString.transform_qubits` in situations where the
        pauli string being used may or may not be mutable.

Returns:
    A transformed MutablePauliString.
    If inplace=True, returns `self`.
    If inplace=False, returns a new instance.

### `__imul__`

```python
def __imul__(self, other: cirq.PAULI_STRING_LIKE) -> cirq.MutablePauliString
```

Left-multiplies a pauli string into this pauli string.

Args:
    other: A pauli string or `cirq.PAULI_STRING_LIKE` to left-multiply
        into `self`.

Returns:
    The `self` mutable pauli string that was successfully mutated.

    If `other` is not a `cirq.PAULI_STRING_LIKE`, `self` is not mutated
    and `NotImplemented` is returned.

### `__mul__`

```python
def __mul__(self, other: cirq.PAULI_STRING_LIKE) -> cirq.PauliString
```

Multiplies two pauli-string-likes together.

The result is not mutable.

### `__rmul__`

```python
def __rmul__(self, other: cirq.PAULI_STRING_LIKE) -> cirq.PauliString
```

Multiplies two pauli-string-likes together.

The result is not mutable.
