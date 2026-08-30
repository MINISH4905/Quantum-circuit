---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/symplectic/pauli.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/symplectic/pauli.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/symplectic/pauli.py`

N-qubit Pauli Operator Class

## `Pauli`

```python
class Pauli(BasePauli)
```

N-qubit Pauli operator.

This class represents an operator :math:`P` from the full :math:`n`-qubit
*Pauli* group

.. math::

    P = (-i)^{q} P_{n-1} \otimes ... \otimes P_{0}

where :math:`q\in \mathbb{Z}_4` and :math:`P_i \in \{I, X, Y, Z\}`
are single-qubit Pauli matrices:

.. math::

    I = \begin{pmatrix} 1 & 0  \\ 0 & 1  \end{pmatrix},
    X = \begin{pmatrix} 0 & 1  \\ 1 & 0  \end{pmatrix},
    Y = \begin{pmatrix} 0 & -i \\ i & 0  \end{pmatrix},
    Z = \begin{pmatrix} 1 & 0  \\ 0 & -1 \end{pmatrix}.

**Initialization**

A Pauli object can be initialized in several ways:

    ``Pauli(obj)``
        where ``obj`` is a Pauli string, ``Pauli`` or
        :class:`~qiskit.quantum_info.ScalarOp` operator, or a Pauli
        gate or :class:`~qiskit.QuantumCircuit` containing only
        Pauli gates.

    ``Pauli((z, x, phase))``
        where ``z`` and ``x`` are boolean ``numpy.ndarrays`` and ``phase`` is
        an integer in ``[0, 1, 2, 3]``.

    ``Pauli((z, x))``
        equivalent to ``Pauli((z, x, 0))`` with trivial phase.

**String representation**

An :math:`n`-qubit Pauli may be represented by a string consisting of
:math:`n` characters from ``['I', 'X', 'Y', 'Z']``, and optionally phase
coefficient in ``['', '-i', '-', 'i']``. For example: ``'XYZ'`` or
``'-iZIZ'``.

In the string representation qubit-0 corresponds to the right-most
Pauli character, and qubit-:math:`(n-1)` to the left-most Pauli
character. For example ``'XYZ'`` represents
:math:`X\otimes Y \otimes Z` with ``'Z'`` on qubit-0,
``'Y'`` on qubit-1, and ``'X'`` on qubit-2.

The string representation can be converted to a ``Pauli`` using the
class initialization (``Pauli('-iXYZ')``). A ``Pauli`` object can be
converted back to the string representation using the
:meth:`to_label` method or ``str(pauli)``.

.. note::

    Using ``str`` to convert a ``Pauli`` to a string will truncate the
    returned string for large numbers of qubits while :meth:`to_label`
    will return the full string with no truncation. The default
    truncation length is 50 characters. The default value can be
    changed by setting the class ``__truncate__`` attribute to an integer
    value. If set to ``0`` no truncation will be performed.

**Array Representation**

The internal data structure of an :math:`n`-qubit Pauli is two
length-:math:`n` boolean vectors :math:`z \in \mathbb{Z}_2^N`,
:math:`x \in \mathbb{Z}_2^N`, and an integer :math:`q \in \mathbb{Z}_4`
defining the Pauli operator

.. math::

    P = (-i)^{q + z\cdot x} Z^z \cdot X^x.

The :math:`k`-th qubit corresponds to the :math:`k`-th entry in the
:math:`z` and :math:`x` arrays

.. math::

    \begin{aligned}
    P &= P_{n-1} \otimes ... \otimes P_{0} \\
    P_k &= (-i)^{z[k] * x[k]} Z^{z[k]}\cdot X^{x[k]}
    \end{aligned}

where ``z[k] = P.z[k]``, ``x[k] = P.x[k]`` respectively.

The :math:`z` and :math:`x` arrays can be accessed and updated using
the :attr:`z` and :attr:`x` properties respectively. The phase integer
:math:`q` can be accessed and updated using the :attr:`phase` property.

**Matrix Operator Representation**

Pauli's can be converted to :math:`(2^n, 2^n)`
:class:`~qiskit.quantum_info.Operator` using the :meth:`to_operator` method,
or to a dense or sparse complex matrix using the :meth:`to_matrix` method.

**Data Access**

The individual qubit Paulis can be accessed and updated using the ``[]``
operator which accepts integer, lists, or slices for selecting subsets
of Paulis. Note that selecting subsets of Pauli's will discard the
phase of the current Pauli.

For example

.. plot::
   :include-source:
   :nofigs:

    from qiskit.quantum_info import Pauli

    P = Pauli('-iXYZ')

    print('P[0] =', repr(P[0]))
    print('P[1] =', repr(P[1]))
    print('P[2] =', repr(P[2]))
    print('P[:] =', repr(P[:]))
    print('P[::-1] =', repr(P[::-1]))

### `__init__`

```python
def __init__(self, data: str | tuple | Pauli | ScalarOp | QuantumCircuit | None=None)
```

Initialize the Pauli.

When using the symplectic array input data both z and x arguments must
be provided, however the first (z) argument can be used alone for string
label, Pauli operator, or :class:`.ScalarOp` input data.

Args:
    data (str or tuple or Pauli or ScalarOp): input data for Pauli. If input is
        a tuple it must be of the form ``(z, x)`` or ``(z, x, phase)`` where
        ``z`` and ``x`` are boolean Numpy arrays, and phase is an integer from
        :math:`\mathbb{Z}_4`.
        If input is a string, it must be a concatenation of a phase and a Pauli string
        (e.g. ``'XYZ', '-iZIZ'``) where a phase string is a combination of at most three
        characters from ``['+', '-', '']``, ``['1', '']``, and ``['i', 'j', '']`` in this order,
        e.g. ``''``, ``'-1j'`` while a Pauli string is 1 or more
        characters of ``'I'``, ``'X'``, ``'Y'``, or ``'Z'``,
        e.g. ``'Z'``, ``'XIYY'``.

Raises:
    QiskitError: if input array is invalid shape.

### `name`

```python
def name(self)
```

Unique string identifier for operation type.

### `num_clbits`

```python
def num_clbits(self)
```

Number of classical bits.

### `__repr__`

```python
def __repr__(self)
```

Display representation.

### `__str__`

```python
def __str__(self)
```

Print representation.

### `set_truncation`

```python
def set_truncation(cls, val: int)
```

Set the max number of Pauli characters to display before truncation.

Args:
    val (int): the number of characters.

.. note::

    Truncation will be disabled if the truncation value is set to 0.

### `__eq__`

```python
def __eq__(self, other)
```

Test if two Paulis are equal.

### `equiv`

```python
def equiv(self, other: Pauli) -> bool
```

Return True if Pauli's are equivalent up to group phase.

Args:
    other (Pauli): an operator object.

Returns:
    bool: True if the Pauli's are equivalent up to group phase.

### `settings`

```python
def settings(self) -> dict
```

Return settings.

### `phase`

```python
def phase(self)
```

Return the group phase exponent for the Pauli.

### `x`

```python
def x(self)
```

The x vector for the Pauli.

### `z`

```python
def z(self)
```

The z vector for the Pauli.

### `__len__`

```python
def __len__(self)
```

Return the number of qubits in the Pauli.

### `__getitem__`

```python
def __getitem__(self, qubits)
```

Return the unsigned Pauli group Pauli for subset of qubits.

### `__setitem__`

```python
def __setitem__(self, qubits, value)
```

Update the Pauli for a subset of qubits.

### `delete`

```python
def delete(self, qubits: int | list) -> Pauli
```

Return a Pauli with qubits deleted.

Args:
    qubits (int or list): qubits to delete from Pauli.

Returns:
    Pauli: the resulting Pauli with the specified qubits removed.

Raises:
    QiskitError: if ind is out of bounds for the array size or
                 number of qubits.

### `insert`

```python
def insert(self, qubits: int | list, value: Pauli) -> Pauli
```

Insert a Pauli at specific qubit value.

Args:
    qubits (int or list): qubits index to insert at.
    value (Pauli): value to insert.

Returns:
    Pauli: the resulting Pauli with the entries inserted.

Raises:
    QiskitError: if the insertion qubits are invalid.

### `__hash__`

```python
def __hash__(self)
```

Make hashable based on string representation.

### `to_label`

```python
def to_label(self) -> str
```

Convert a Pauli to a string label.

.. note::

    The difference between `to_label` and :meth:`__str__` is that
    the latter will truncate the output for large numbers of qubits.

Returns:
    str: the Pauli string label.

### `to_matrix`

```python
def to_matrix(self, sparse: bool=False) -> np.ndarray
```

Convert to a Numpy array or sparse CSR matrix.

Args:
    sparse (bool): if True return sparse CSR matrices, otherwise
                   return dense Numpy arrays (default: False).

Returns:
    array: The Pauli matrix.

### `to_instruction`

```python
def to_instruction(self)
```

Convert to Pauli circuit instruction.

### `compose`

```python
def compose(self, other: Pauli, qargs: list | None=None, front: bool=False, inplace: bool=False) -> Pauli
```

Return the operator composition with another Pauli.

Args:
    other (Pauli): a Pauli object.
    qargs (list or None):  qubits to apply dot product
                          on (default: None).
    front (bool): If True compose using right operator multiplication,
                  instead of left multiplication [default: False].
    inplace (bool): If True update in-place (default: False).

Returns:
    Pauli: The composed Pauli.

Raises:
    QiskitError: if other cannot be converted to an operator, or has
                 incompatible dimensions for specified subsystems.

.. note::
    Composition (``&``) by default is defined as `left` matrix multiplication for
    matrix operators, while :meth:`dot` is defined as `right` matrix
    multiplication. That is that ``A & B == A.compose(B)`` is equivalent to
    ``B.dot(A)`` when ``A`` and ``B`` are of the same type.

    Setting the ``front=True`` kwarg changes this to `right` matrix
    multiplication and is equivalent to the :meth:`dot` method
    ``A.dot(B) == A.compose(B, front=True)``.

### `dot`

```python
def dot(self, other: Pauli, qargs: list | None=None, inplace: bool=False) -> Pauli
```

Return the right multiplied operator self * other.

Args:
    other (Pauli): an operator object.
    qargs (list or None):  qubits to apply dot product
                          on (default: None).
    inplace (bool): If True update in-place (default: False).

Returns:
    Pauli: The operator self * other.

### `inverse`

```python
def inverse(self)
```

Return the inverse of the Pauli.

### `commutes`

```python
def commutes(self, other: Pauli | PauliList, qargs: list | None=None) -> bool
```

Return True if the Pauli commutes with other.

Args:
    other (Pauli or PauliList): another Pauli operator.
    qargs (list): qubits to apply dot product on (default: None).

Returns:
    bool: True if Pauli's commute, False if they anti-commute.

### `anticommutes`

```python
def anticommutes(self, other: Pauli, qargs: list | None=None) -> bool
```

Return True if other Pauli anticommutes with self.

Args:
    other (Pauli): another Pauli operator.
    qargs (list): qubits to apply dot product on (default: None).

Returns:
    bool: True if Pauli's anticommute, False if they commute.

### `evolve`

```python
def evolve(self, other: Pauli | Clifford | QuantumCircuit, qargs: list | None=None, frame: Literal['h', 's']='h') -> Pauli
```

Performs either Heisenberg (default) or Schrödinger picture
evolution of the Pauli by a Clifford and returns the evolved Pauli.

Schrödinger picture evolution can be chosen by passing parameter ``frame='s'``.
This option yields a faster calculation.

Heisenberg picture evolves the Pauli as :math:`P^\prime = C^\dagger.P.C`.

Schrödinger picture evolves the Pauli as :math:`P^\prime = C.P.C^\dagger`.

Args:
    other (Pauli or Clifford or QuantumCircuit): The Clifford operator to evolve by.
    qargs (list): a list of qubits to apply the Clifford to.
    frame (string): ``'h'`` for Heisenberg (default) or ``'s'`` for
        Schrödinger framework.

Returns:
    Pauli: the Pauli :math:`C^\dagger.P.C` (Heisenberg picture)
    or the Pauli :math:`C.P.C^\dagger` (Schrödinger picture).

Raises:
    QiskitError: if the Clifford number of qubits and qargs don't match.

### `apply_layout`

```python
def apply_layout(self, layout: TranspileLayout | list[int] | None, num_qubits: int | None=None) -> Pauli
```

Apply a transpiler layout to this :class:`~.quantum_info.Pauli`

Args:
    layout: Either a :class:`~.TranspileLayout`, a list of integers or None.
            If both layout and num_qubits are none, a copy of the operator is
            returned.
    num_qubits: The number of qubits to expand the operator to. If not
        provided then if ``layout`` is a :class:`~.TranspileLayout` the
        number of the transpiler output circuit qubits will be used by
        default. If ``layout`` is a list of integers the permutation
        specified will be applied without any expansion. If layout is
        None, the operator will be expanded to the given number of qubits.

Returns:
    A new :class:`~.quantum_info.Pauli` with the provided layout applied
