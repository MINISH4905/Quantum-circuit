---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/dense_pauli_string.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/dense_pauli_string.py
license: Apache-2.0
---

## `BaseDensePauliString`

```python
class BaseDensePauliString(raw_types.Gate, metaclass=abc.ABCMeta)
```

Parent class for `cirq.DensePauliString` and `cirq.MutableDensePauliString`.

`cirq.BaseDensePauliString` is an abstract base class, which is used to implement
`cirq.DensePauliString` and `cirq.MutableDensePauliString`. The non-mutable version
is used as the corresponding gate for `cirq.PauliString` operation and the mutable
version is mainly used for efficiently manipulating dense pauli strings.

See the docstrings of `cirq.DensePauliString` and `cirq.MutableDensePauliString` for more
details.

Examples:
>>> print(cirq.DensePauliString('XXIY'))
+XXIY

>>> print(cirq.MutableDensePauliString('IZII', coefficient=-1))
-IZII (mutable)

>>> print(cirq.DensePauliString([0, 1, 2, 3],
...                             coefficient=sympy.Symbol('t')))
t*IXYZ

### `__init__`

```python
def __init__(self, pauli_mask: Iterable[cirq.PAULI_GATE_LIKE] | np.ndarray, *, coefficient: cirq.TParamValComplex=1)
```

Initializes a new dense pauli string.

Args:
    pauli_mask: A specification of the Pauli gates to use. This argument
        can be a string like "IXYYZ", or a numeric list like
        [0, 1, 3, 2] with I=0, X=1, Y=2, Z=3=X|Y.

        The internal representation is a 1-dimensional uint8 numpy array
        containing numeric values. If such a numpy array is given, and
        the pauli string is mutable, the argument will be used directly
        instead of being copied.
    coefficient: A complex number. Usually +1, -1, 1j, or -1j but other
        values are supported.

### `pauli_mask`

```python
def pauli_mask(self) -> np.ndarray
```

A 1-dimensional uint8 numpy array giving a specification of Pauli gates to use.

### `coefficient`

```python
def coefficient(self) -> cirq.TParamValComplex
```

A complex coefficient or symbol.

### `one_hot`

```python
def one_hot(cls, *, index: int, length: int, pauli: cirq.PAULI_GATE_LIKE) -> Self
```

Creates a dense pauli string with only one non-identity Pauli.

Args:
    index: The index of the Pauli that is not an identity.
    length: The total length of the string to create.
    pauli: The pauli gate to put at the hot index. Can be set to either
        a string ('X', 'Y', 'Z', 'I'), a cirq gate (`cirq.X`,
        `cirq.Y`, `cirq.Z`, or `cirq.I`), or an integer (0=I, 1=X, 2=Y,
        3=Z).

### `eye`

```python
def eye(cls, length: int) -> Self
```

Creates a dense pauli string containing only identity gates.

Args:
    length: The length of the dense pauli string.

### `tensor_product`

```python
def tensor_product(self, other: BaseDensePauliString) -> Self
```

Concatenates dense pauli strings and multiplies their coefficients.

Args:
    other: The dense pauli string to place after the end of this one.

Returns:
    A dense pauli string with the concatenation of the paulis from the
    two input pauli strings, and the product of their coefficients.

### `sparse`

```python
def sparse(self, qubits: Sequence[cirq.Qid] | None=None) -> cirq.PauliString
```

A `cirq.PauliString` version of this dense pauli string.

Args:
    qubits: The qubits to apply the Paulis to. Defaults to
        `cirq.LineQubit.range(len(self))`.

Returns:
    A `cirq.PauliString` with the non-identity operations from
    this dense pauli string applied to appropriate qubits.

Raises:
    ValueError: If the number of qubits supplied does not match that of
        this instance.

### `frozen`

```python
def frozen(self) -> DensePauliString
```

A `cirq.DensePauliString` with the same contents.

### `mutable_copy`

```python
def mutable_copy(self) -> MutableDensePauliString
```

A `cirq.MutableDensePauliString` with the same contents.

### `copy`

```python
def copy(self, coefficient: cirq.TParamValComplex | None=None, pauli_mask: None | str | Iterable[int] | np.ndarray=None) -> Self
```

Returns a copy with possibly modified contents.

Args:
    coefficient: The new coefficient value. If not specified, defaults
        to the current `coefficient` value.
    pauli_mask: The new `pauli_mask` value. If not specified, defaults
        to the current pauli mask value.

Returns:
    A copied instance.

## `DensePauliString`

```python
class DensePauliString(BaseDensePauliString)
```

An immutable string of Paulis, like `XIXY`, with a coefficient.

A `DensePauliString` represents a multi-qubit pauli operator, i.e. a tensor product of single
qubits Pauli gates (including the `cirq.IdentityGate`), each of which would act on a
different qubit. When applied on qubits, a `DensePauliString` results in `cirq.PauliString`
as an operation.

Note that `cirq.PauliString` only stores a tensor product of non-identity `cirq.Pauli`
operations whereas `cirq.DensePauliString` also supports storing the `cirq.IdentityGate`.

For example,

>>> dps = cirq.DensePauliString('XXIY')
>>> print(dps) # 4 qubit pauli operator with 'X' on first 2 qubits, 'I' on 3rd and 'Y' on 4th.
+XXIY
>>> ps = dps.on(*cirq.LineQubit.range(4)) # When applied on qubits, we get a `cirq.PauliString`.
>>> print(ps) # Note that `cirq.PauliString` only preserves non-identity operations.
X(q(0))*X(q(1))*Y(q(3))

This can optionally take a coefficient, for example:

>>> dps = cirq.DensePauliString("XX", coefficient=3)
>>> print(dps) # Represents 3 times the operator XX acting on two qubits.
(3+0j)*XX
>>> print(dps.on(*cirq.LineQubit.range(2))) # Coefficient is propagated to `cirq.PauliString`.
(3+0j)*X(q(0))*X(q(1))

If the coefficient has magnitude of 1, the resulting operator is a unitary and thus is
also a `cirq.Gate`.

Note that `DensePauliString` is an immutable object. If you need a mutable version of
dense pauli strings, see `cirq.MutableDensePauliString`.

## `MutableDensePauliString`

```python
class MutableDensePauliString(BaseDensePauliString)
```

A mutable string of Paulis, like `XIXY`, with a coefficient.

`cirq.MutableDensePauliString` is a mutable version of `cirq.DensePauliString`.
It exists mainly to help mutate dense pauli strings efficiently, instead of always creating
a copy, and then converting back to a frozen `cirq.DensePauliString` representation.

For example:

>>> mutable_dps = cirq.MutableDensePauliString('XXZZ')
>>> mutable_dps[:2] = 'YY' # `cirq.MutableDensePauliString` supports item assignment.
>>> print(mutable_dps)
+YYZZ (mutable)

See docstrings of `cirq.DensePauliString` for more details on dense pauli strings.
