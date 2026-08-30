---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/pauli/utils.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/pauli/utils.py
license: Apache-2.0
---

## Module `pennylane/pauli/utils.py`

Utility functions used in Pauli arithmetic, partitioning, and measurement reduction schemes utilizing the
symplectic vector-space representation of Pauli words. For information on the symplectic binary
representation of Pauli words and applications, see:

* `arXiv:quant-ph/9705052 <https://arxiv.org/abs/quant-ph/9705052>`_
* `arXiv:1701.08213 <https://arxiv.org/abs/1701.08213>`_
* `arXiv:1907.09386 <https://arxiv.org/abs/1907.09386>`_

## `is_pauli_word`

```python
def is_pauli_word(observable)
```

Checks if an observable instance consists only of Pauli and Identity Operators.

A Pauli word can be either:

* A single pauli operator (see :class:`~.PauliX` for an example).

* A :class:`.Prod` instance containing Pauli operators.

* A :class:`.SProd` instance containing a valid Pauli word.

* A :class:`.Sum` instance with only one term.

.. Warning::

    This function will only confirm that all operators are Pauli or Identity operators,
    and not whether the observable is mathematically a Pauli word.
    If an Observable consists of multiple Pauli operators targeting the same wire, the
    function will return ``True`` regardless of any complex coefficients.


Args:
    observable (~.Operator): the operator to be examined

Returns:
    bool: true if the input observable is a Pauli word, false otherwise.

**Example**

>>> is_pauli_word(qp.Identity(0))
True
>>> is_pauli_word(qp.X(0) @ qp.Z(2))
True
>>> is_pauli_word(qp.Z(0) @ qp.Hadamard(1))
False
>>> is_pauli_word(4 * qp.X(0) @ qp.Z(0))
True

## `are_identical_pauli_words`

```python
def are_identical_pauli_words(pauli_1, pauli_2)
```

Performs a check if two Pauli words have the same ``wires`` and ``name`` attributes.

This is a convenience function that checks if two given :class:`~.Prod`
instances specify the same Pauli word.

Args:
    pauli_1 (Union[Identity, PauliX, PauliY, PauliZ, Prod, SProd]): the first Pauli word
    pauli_2 (Union[Identity, PauliX, PauliY, PauliZ, Prod, SProd]): the second Pauli word

Returns:
    bool: whether ``pauli_1`` and ``pauli_2`` have the same wires and name attributes

Raises:
    TypeError: if ``pauli_1`` or ``pauli_2`` are not :class:`~.Identity`, :class:`~.PauliX`,
        :class:`~.PauliY`, :class:`~.PauliZ`, :class:`~.SProd`, or :class:`~.Prod` instances

**Example**

>>> are_identical_pauli_words(qp.Z(0) @ qp.Z(1), qp.Z(1) @ qp.Z(0))
True
>>> are_identical_pauli_words(qp.I(0) @ qp.X(1), qp.X(1))
True
>>> are_identical_pauli_words(qp.Z(0) @ qp.Z(1), qp.Z(0) @ qp.X(3))
False

## `pauli_to_binary`

```python
def pauli_to_binary(pauli_word, n_qubits=None, wire_map=None, check_is_pauli_word=True)
```

Converts a Pauli word to the binary vector (symplectic) representation.

This functions follows convention that the first half of binary vector components specify
PauliX placements while the last half specify PauliZ placements.

Args:
    pauli_word (Union[Identity, PauliX, PauliY, PauliZ, Prod, SProd]): the Pauli word to be
        converted to binary vector representation
    n_qubits (int): number of qubits to specify dimension of binary vector representation
    wire_map (dict): dictionary containing all wire labels used in the Pauli word as keys, and
        unique integer labels as their values
    check_is_pauli_word (bool): If True (default) then a check is run to verify that pauli_word
        is in fact a Pauli word.

Returns:
    array: the ``2*n_qubits`` dimensional binary vector representation of the input Pauli word

Raises:
    TypeError: if the input ``pauli_word`` is not an instance of Identity, PauliX, PauliY,
        PauliZ or tensor products thereof
    ValueError: if ``n_qubits`` is less than the number of wires acted on by the Pauli word

**Example**

If ``n_qubits`` and ``wire_map`` are both unspecified, the dimensionality of the binary vector
will be ``2 * len(pauli_word.wires)``. Regardless of wire labels, the vector components encoding
Pauli operations will be read from left-to-right in the tensor product when ``wire_map`` is
unspecified, e.g.,

>>> pauli_to_binary(qp.X('a') @ qp.Y('b') @ qp.Z('c'))
array([1., 1., 0., 0., 1., 1.])
>>> pauli_to_binary(qp.X('c') @ qp.Y('a') @ qp.Z('b'))
array([1., 1., 0., 0., 1., 1.])

The above cases have the same binary representation since they are equivalent up to a
relabelling of the wires. To keep binary vector component enumeration consistent with wire
labelling across multiple Pauli words, or define any arbitrary enumeration, one can use
keyword argument ``wire_map`` to set this enumeration.

>>> wire_map = {'a': 0, 'b': 1, 'c': 2}
>>> pauli_to_binary(qp.X('a') @ qp.Y('b') @ qp.Z('c'), wire_map=wire_map)
array([1., 1., 0., 0., 1., 1.])
>>> pauli_to_binary(qp.X('c') @ qp.Y('a') @ qp.Z('b'), wire_map=wire_map)
array([1., 0., 1., 1., 1., 0.])

Now the two Pauli words are distinct in the binary vector representation, as the vector
components are consistently mapped from the wire labels, rather than enumerated
left-to-right.

If ``n_qubits`` is unspecified, the dimensionality of the vector representation will be inferred
from the size of support of the Pauli word,

>>> pauli_to_binary(qp.X(0) @ qp.X(1))
array([1., 1., 0., 0.])
>>> pauli_to_binary(qp.X(0) @ qp.X(5))
array([1., 1., 0., 0.])

Dimensionality higher than twice the support can be specified by ``n_qubits``,

>>> pauli_to_binary(qp.X(0) @ qp.X(1), n_qubits=6)
array([1., 1., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.])
>>> pauli_to_binary(qp.X(0) @ qp.X(5), n_qubits=6)
array([1., 1., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.])

For these Pauli words to have a consistent mapping to vector representation, we once again
need to specify a ``wire_map``.

>>> wire_map = {0:0, 1:1, 5:5}
>>> pauli_to_binary(qp.X(0) @ qp.X(1), n_qubits=6, wire_map=wire_map)
array([1., 1., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.])
>>> pauli_to_binary(qp.X(0) @ qp.X(5), n_qubits=6, wire_map=wire_map)
array([1., 0., 0., 0., 0., 1., 0., 0., 0., 0., 0., 0.])

Note that if ``n_qubits`` is unspecified and ``wire_map`` is specified, the dimensionality of the
vector representation will be inferred from the highest integer in ``wire_map.values()``.

>>> wire_map = {0:0, 1:1, 5:5}
>>> pauli_to_binary(qp.X(0) @ qp.X(5),  wire_map=wire_map)
array([1., 0., 0., 0., 0., 1., 0., 0., 0., 0., 0., 0.])

## `binary_to_pauli`

```python
def binary_to_pauli(binary_vector, wire_map=None)
```

Converts a binary vector of even dimension to an Operator instance.

This functions follows the convention that the first half of binary vector components specify
PauliX placements while the last half specify PauliZ placements.

Args:
    binary_vector (Union[list, tuple, array]): binary vector of even dimension representing a
        unique Pauli word
    wire_map (dict): dictionary containing all wire labels used in the Pauli word as keys, and
        unique integer labels as their values

Returns:
    Union[Prod]: The Pauli word corresponding to the input binary vector.
    Note that if a zero vector is input, then the resulting Pauli word will be
    an :class:`~.Identity` instance.

Raises:
    TypeError: if length of binary vector is not even, or if vector does not have strictly
        binary components

**Example**

If ``wire_map`` is unspecified, the Pauli operations follow the same enumerations as the vector
components, i.e., the ``i`` and ``N+i`` components specify the Pauli operation on wire ``i``,

>>> binary_to_pauli([0,1,1,0,1,0])
Y(1) @ X(2)

An arbitrary labelling can be assigned by using ``wire_map``:

>>> wire_map = {'a': 0, 'b': 1, 'c': 2}
>>> binary_to_pauli([0,1,1,0,1,0], wire_map=wire_map)
Y('b') @ X('c')

Note that the values of ``wire_map``, if specified, must be ``0,1,..., N``,
where ``N`` is the dimension of the vector divided by two, i.e.,
``list(wire_map.values())`` must be ``list(range(len(binary_vector)/2))``.

## `pauli_word_to_string`

```python
def pauli_word_to_string(pauli_word, wire_map=None)
```

Convert a Pauli word to a string.

A Pauli word can be either:

* A single pauli operator (see :class:`~.PauliX` for an example).

* A :class:`.Prod` instance containing Pauli operators.

* A :class:`.SProd` instance containing a Pauli operator.

* A :class:`.Sum` instance with only one term.

Given a Pauli in observable form, convert it into string of
characters from ``['I', 'X', 'Y', 'Z']``. This representation is required for
functions such as :class:`.PauliRot`.

.. warning::

    This method ignores any potential coefficient multiplying the Pauli word:

    >>> qp.pauli.pauli_word_to_string(3 * qp.X(0) @ qp.Y(1))
    'XY'

.. warning::

    This method assumes all Pauli operators are acting on different wires, ignoring
    any extra operators:

    >>> qp.pauli.pauli_word_to_string(qp.X(0) @ qp.Y(0) @ qp.Y(0))
    'X'

Args:
    pauli_word (Operator): an observable, either a single-qubit observable
        representing a Pauli group element, or a tensor product of single-qubit observables.
    wire_map (dict[Union[str, int], int]): dictionary containing all wire labels used in
        the Pauli word as keys, and unique integer labels as their values

Returns:
    str: The string representation of the observable in terms of ``'I'``, ``'X'``, ``'Y'``,
    and/or ``'Z'``.

Raises:
    TypeError: if the input observable is not a proper Pauli word.

**Example**

>>> wire_map = {'a' : 0, 'b' : 1, 'c' : 2}
>>> pauli_word = qp.X('a') @ qp.Y('c')
>>> pauli_word_to_string(pauli_word, wire_map=wire_map)
'XIY'

## `string_to_pauli_word`

```python
def string_to_pauli_word(pauli_string, wire_map=None)
```

Convert a string in terms of ``'I'``, ``'X'``, ``'Y'``, and ``'Z'`` into a Pauli word
for the given wire map.

Args:
    pauli_string (str): A string of characters consisting of ``'I'``, ``'X'``, ``'Y'``, and ``'Z'``
        indicating a Pauli word.
    wire_map (dict[Union[str, int], int]): dictionary containing all wire labels used in
        the Pauli word as keys, and unique integer labels as their values

Returns:
    .Operator: The Pauli word representing of ``pauli_string`` on the wires
    enumerated in the wire map.

**Example**

>>> wire_map = {'a' : 0, 'b' : 1, 'c' : 2}
>>> string_to_pauli_word('XIY', wire_map=wire_map)
X('a') @ Y('c')

## `pauli_word_to_matrix`

```python
def pauli_word_to_matrix(pauli_word, wire_map=None)
```

Convert a Pauli word from a tensor to its matrix representation.

A Pauli word can be either:

* A single pauli operator (see :class:`~.PauliX` for an example).

* A :class:`.Prod` instance containing Pauli operators.

* A :class:`.SProd` instance containing a Pauli operator.

* A :class:`.Sum` instance with only one term.

The matrix representation of a Pauli word has dimension :math:`2^n \times 2^n`,
where :math:`n` is the number of qubits provided in ``wire_map``. For wires
that the Pauli word does not act on, identities must be inserted into the tensor
product at the correct positions.

Args:
    pauli_word (Operator): an observable, either a single-qubit observable
        representing a Pauli group element, or a tensor product of single-qubit observables.
    wire_map (dict[Union[str, int], int]): dictionary containing all wire labels used in
        the Pauli word as keys, and unique integer labels as their values

Returns:
    array[complex]: The matrix representation of the multi-qubit Pauli over the
    specified wire map.

Raises:
    TypeError: if the input observable is not a proper Pauli word.

**Example**

>>> wire_map = {'a' : 0, 'b' : 1}
>>> pauli_word = qp.X('a') @ qp.Y('b')
>>> pauli_word_to_matrix(pauli_word, wire_map=wire_map).astype(np.complex128)
array([[0.+0.j, 0.+0.j, 0.+0.j, 0.-1.j],
       [0.+0.j, 0.+0.j, 0.+1.j, 0.+0.j],
       [0.+0.j, 0.-1.j, 0.+0.j, 0.+0.j],
       [0.+1.j, 0.+0.j, 0.+0.j, 0.+0.j]])

## `is_qwc`

```python
def is_qwc(pauli_vec_1, pauli_vec_2)
```

Checks if two Pauli words in the binary vector representation are qubit-wise commutative.

Args:
    pauli_vec_1 (Union[list, tuple, array]): first binary vector argument in qubit-wise
        commutator
    pauli_vec_2 (Union[list, tuple, array]): second binary vector argument in qubit-wise
        commutator

Returns:
    bool: returns True if the input Pauli words are qubit-wise commutative, returns False
    otherwise

Raises:
    ValueError: if the input vectors are of different dimension, if the vectors are not of even
        dimension, or if the vector components are not strictly binary

**Example**

>>> is_qwc([1,0,0,1,1,0],[1,0,1,0,1,0])
False
>>> is_qwc([1,0,1,1,1,0],[1,0,0,1,1,0])
True

## `are_pauli_words_qwc`

```python
def are_pauli_words_qwc(lst_pauli_words)
```

Given a list of observables assumed to be valid Pauli observables, determine if they are pairwise
qubit-wise commuting.

This implementation has time complexity ~ O(m * n) for m Pauli words and n wires, where n is the
number of distinct wire labels used to represent the Pauli words.

Args:
    lst_pauli_words (list[Operator]): List of observables (assumed to be valid Pauli words).

Returns:
    (bool): True if they are all qubit-wise commuting, false otherwise. If any of the provided
    observables are not valid Pauli words, false is returned.

## `observables_to_binary_matrix`

```python
def observables_to_binary_matrix(observables, n_qubits=None, wire_map=None)
```

Converts a list of Pauli words into a matrix where each row is the binary vector (symplectic)
representation of the ``observables``.

The dimension of the binary vectors (the number of columns) will be implied from the highest wire
being acted on non-trivially by the Pauli words in observables.

Args:
    observables (list[Union[Identity, PauliX, PauliY, PauliZ, Prod, SProd]]): the list
        of Pauli words
    n_qubits (int): number of qubits to specify dimension of binary vector representation
    wire_map (dict): dictionary containing all wire labels used in the Pauli words as keys, and
        unique integer labels as their values


Returns:
    array[array[int]]: a matrix whose rows are Pauli words in binary vector (symplectic) representation.

**Example**

>>> observables_to_binary_matrix([qp.X(0) @ qp.Y(2), qp.Z(0) @ qp.Z(1) @ qp.Z(2)])
array([[1., 1., 0., 0., 1., 0.],
       [0., 0., 0., 1., 1., 1.]])

## `qwc_complement_adj_matrix`

```python
def qwc_complement_adj_matrix(binary_observables)
```

Obtains the adjacency matrix for the complementary graph of the qubit-wise commutativity
graph for a given set of observables in the binary representation.

The qubit-wise commutativity graph for a set of Pauli words has a vertex for each Pauli word,
and two nodes are connected if and only if the corresponding Pauli words are qubit-wise
commuting.

Args:
    binary_observables (array[array[int]]): a matrix whose rows are the Pauli words in the
        binary vector representation

Returns:
    array[array[int]]: the adjacency matrix for the complement of the qubit-wise commutativity graph

Raises:
    ValueError: if input binary observables contain components which are not strictly binary

**Example**

>>> binary_observables = np.array([[1,0,1,0,0,1],
...                                [0,1,1,1,0,1],
...                                [0,0,0,1,0,0]])
>>> qwc_complement_adj_matrix(binary_observables)
array([[0., 1., 1.],
       [1., 0., 0.],
       [1., 0., 0.]])

## `pauli_group`

```python
def pauli_group(n_qubits, wire_map=None)
```

Generate the :math:`n`-qubit Pauli group.

This function enables the construction of the :math:`n`-qubit Pauli group with no
storage involved.  The :math:`n`-qubit Pauli group has size :math:`4^n`,
thus it may not be desirable to construct it in full and store.

The order of iteration is based on the binary symplectic representation of
the Pauli group as :math:`2n`-bit strings. Ordering is done by converting
the integers :math:`0` to :math:`2^{2n}` to binary strings, and converting those
strings to Pauli operators using the :func:`~.binary_to_pauli` method.

Args:
    n_qubits (int): The number of qubits for which to create the group.
    wire_map (dict[Union[str, int], int]): dictionary containing all wire labels
        used in the Pauli word as keys, and unique integer labels as their values.
        If no wire map is provided, wires will be labeled by integers between 0 and ``n_qubits``.

Returns:
    .Operation: The next Pauli word in the group.

**Example**

The ``pauli_group`` generator can be used to loop over the Pauli group as follows.
(Note: in the example below, we display only the first 5 elements for brevity.)

>>> from pennylane.pauli import pauli_group
>>> n_qubits = 3
>>> for p in pauli_group(n_qubits):
...     print(p)
I(0)
Z(2)
Z(1)
Z(1) @ Z(2)
Z(0)
...

The full Pauli group can then be obtained like so:

>>> full_pg = list(pauli_group(n_qubits))

The group can also be created using a custom wire map; if no map is
specified, a default map of label :math:`i` to wire ``i`` as in the example
above will be created. (Note: in the example below, we display only the first
5 elements for brevity.)

>>> wire_map = {'a' : 0, 'b' : 1, 'c' : 2}
>>> for p in pauli_group(n_qubits, wire_map=wire_map):
...     print(p)
I('a')
Z('c')
Z('b')
Z('b') @ Z('c')
Z('a')
...

## `partition_pauli_group`

```python
def partition_pauli_group(n_qubits: int) -> list[list[str]]
```

Partitions the :math:`n`-qubit Pauli group into qubit-wise commuting terms.

The :math:`n`-qubit Pauli group is composed of :math:`4^{n}` terms that can be partitioned into
:math:`3^{n}` qubit-wise commuting groups.

Args:
    n_qubits (int): number of qubits

Returns:
    List[List[str]]: A collection of qubit-wise commuting groups containing Pauli words as
    strings

**Example**

>>> qp.pauli.partition_pauli_group(3)
[['III', 'IIZ', 'IZI', 'IZZ', 'ZII', 'ZIZ', 'ZZI', 'ZZZ'],
 ['IIX', 'IZX', 'ZIX', 'ZZX'],
 ['IIY', 'IZY', 'ZIY', 'ZZY'],
 ['IXI', 'IXZ', 'ZXI', 'ZXZ'],
 ['IXX', 'ZXX'],
 ['IXY', 'ZXY'],
 ['IYI', 'IYZ', 'ZYI', 'ZYZ'],
 ['IYX', 'ZYX'],
 ['IYY', 'ZYY'],
 ['XII', 'XIZ', 'XZI', 'XZZ'],
 ['XIX', 'XZX'],
 ['XIY', 'XZY'],
 ['XXI', 'XXZ'],
 ['XXX'],
 ['XXY'],
 ['XYI', 'XYZ'],
 ['XYX'],
 ['XYY'],
 ['YII', 'YIZ', 'YZI', 'YZZ'],
 ['YIX', 'YZX'],
 ['YIY', 'YZY'],
 ['YXI', 'YXZ'],
 ['YXX'],
 ['YXY'],
 ['YYI', 'YYZ'],
 ['YYX'],
 ['YYY']]

## `qwc_rotation`

```python
def qwc_rotation(pauli_operators)
```

Performs circuit implementation of diagonalizing unitary for a Pauli word.

Args:
    pauli_operators (list[Union[PauliX, PauliY, PauliZ, Identity]]): Single-qubit Pauli
        operations. No Pauli operations in this list may be acting on the same wire.
Raises:
    TypeError: if any elements of ``pauli_operators`` are not instances of
        :class:`~.PauliX`, :class:`~.PauliY`, :class:`~.PauliZ`, or :class:`~.Identity`

**Example**

>>> pauli_operators = [qp.X('a'), qp.Y('b'), qp.Z('c')]
>>> qwc_rotation(pauli_operators)
[RY(-1.5707963267948966, wires=['a']), RX(1.5707963267948966, wires=['b'])]

## `diagonalize_pauli_word`

```python
def diagonalize_pauli_word(pauli_word)
```

Transforms the Pauli word to diagonal form in the computational basis.

Args:
    pauli_word (Operator): the Pauli word to diagonalize in computational basis

Returns:
    Operator: the Pauli word diagonalized in the computational basis

Raises:
    TypeError: if the input is not a Pauli word, i.e., a Pauli operator,
        :class:`~.Identity`, or tensor products thereof

**Example**

>>> diagonalize_pauli_word(qp.X('a') @ qp.Y('b') @ qp.Z('c'))
Z('a') @ Z('b') @ Z('c')

## `diagonalize_qwc_pauli_words`

```python
def diagonalize_qwc_pauli_words(qwc_grouping)
```

Diagonalizes a list of mutually qubit-wise commutative Pauli words.

Args:
    qwc_grouping (list[Operator]): a list of observables containing mutually
        qubit-wise commutative Pauli words

Returns:
    tuple:

        * list[Operation]: an instance of the qwc_rotation template which
          diagonalizes the qubit-wise commuting grouping
        * list[Operator]: list of Pauli string observables diagonal in
          the computational basis

Raises:
    ValueError: if any 2 elements in the input QWC grouping are not qubit-wise commutative

**Example**

>>> qwc_group = [qp.X(0) @ qp.Z(1),
...              qp.X(0) @ qp.Y(3),
...              qp.Z(1) @ qp.Y(3)]
>>> diagonalize_qwc_pauli_words(qwc_group)
([RY(-1.5707963267948966, wires=[0]), RX(1.5707963267948966, wires=[3])],
 [Z(0) @ Z(1),
  Z(0) @ Z(3),
  Z(1) @ Z(3)])

## `diagonalize_qwc_groupings`

```python
def diagonalize_qwc_groupings(qwc_groupings)
```

Diagonalizes a list of qubit-wise commutative groupings of Pauli strings.

Args:
    qwc_groupings (list[list[Operator]]): a list of mutually qubit-wise commutative groupings
        of Pauli string observables

Returns:
    tuple:

        * list[list[Operation]]: a list of instances of the qwc_rotation
          template which diagonalizes the qubit-wise commuting grouping,
          order corresponding to qwc_groupings
        * list[list[Operator]]: a list of QWC groupings diagonalized in the
          computational basis, order corresponding to qwc_groupings

**Example**

>>> qwc_group_1 = [qp.X(0) @ qp.Z(1),
...                qp.X(0) @ qp.Y(3),
...                   qp.Z(1) @ qp.Y(3)]
>>> qwc_group_2 = [qp.Y(0),
...                qp.Y(0) @ qp.X(2),
...                qp.X(1) @ qp.Z(3)]
>>> post_rotations, diag_groupings = diagonalize_qwc_groupings([qwc_group_1, qwc_group_2])
>>> post_rotations
[[RY(-1.5707963267948966, wires=[0]), RX(1.5707963267948966, wires=[3])],
 [RX(1.5707963267948966, wires=[0]),
  RY(-1.5707963267948966, wires=[2]),
  RY(-1.5707963267948966, wires=[1])]]
>>> diag_groupings
[[Z(0) @ Z(1),
 Z(0) @ Z(3),
 Z(1) @ Z(3)],
[Z(0),
 Z(0) @ Z(2),
 Z(1) @ Z(3)]]

## `pauli_eigs`

```python
def pauli_eigs(n)
```

Eigenvalues for :math:`A^{\otimes n}`, where :math:`A` is
Pauli operator, or shares its eigenvalues.

As an example if n==2, then the eigenvalues of a tensor product consisting
of two matrices sharing the eigenvalues with Pauli matrices is returned.

Args:
    n (int): the number of qubits the matrix acts on
Returns:
    list: the eigenvalues of the specified observable
