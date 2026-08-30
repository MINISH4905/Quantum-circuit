---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/symplectic/pauli_list.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/symplectic/pauli_list.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/symplectic/pauli_list.py`

Optimized list of Pauli operators

## `PauliList`

```python
class PauliList(BasePauli, LinearMixin, GroupMixin)
```

List of N-qubit Pauli operators.

This class is an efficient representation of a list of
:class:`Pauli` operators. It supports 1D numpy array indexing
returning a :class:`Pauli` for integer indexes or a
:class:`PauliList` for slice or list indices.

**Initialization**

A PauliList object can be initialized in several ways.

    ``PauliList(list[str])``
        where strings are same representation with :class:`~qiskit.quantum_info.Pauli`.

    ``PauliList(Pauli) and PauliList(list[Pauli])``
        where Pauli is :class:`~qiskit.quantum_info.Pauli`.

    ``PauliList.from_symplectic(z, x, phase)``
        where ``z`` and ``x`` are 2 dimensional boolean ``numpy.ndarrays`` and ``phase`` is
        an integer in ``[0, 1, 2, 3]``.

For example,

.. plot::
   :include-source:
   :nofigs:
   :context: reset

    import numpy as np

    from qiskit.quantum_info import Pauli, PauliList

    # 1. init from list[str]
    pauli_list = PauliList(["II", "+ZI", "-iYY"])
    print("1. ", pauli_list)

    pauli1 = Pauli("iXI")
    pauli2 = Pauli("iZZ")

    # 2. init from Pauli
    print("2. ", PauliList(pauli1))

    # 3. init from list[Pauli]
    print("3. ", PauliList([pauli1, pauli2]))

    # 4. init from np.ndarray
    z = np.array([[True, True], [False, False]])
    x = np.array([[False, True], [True, False]])
    phase = np.array([0, 1])
    pauli_list = PauliList.from_symplectic(z, x, phase)
    print("4. ", pauli_list)

.. code-block:: text

    1.  ['II', 'ZI', '-iYY']
    2.  ['iXI']
    3.  ['iXI', 'iZZ']
    4.  ['YZ', '-iIX']

**Data Access**

The individual Paulis can be accessed and updated using the ``[]``
operator which accepts integer, lists, or slices for selecting subsets
of PauliList. If integer is given, it returns Pauli not PauliList.

.. plot::
   :include-source:
   :nofigs:
   :context:

    pauli_list = PauliList(["XX", "ZZ", "IZ"])
    print("Integer: ", repr(pauli_list[1]))
    print("List: ", repr(pauli_list[[0, 2]]))
    print("Slice: ", repr(pauli_list[0:2]))

.. code-block:: text

    Integer:  Pauli('ZZ')
    List:  PauliList(['XX', 'IZ'])
    Slice:  PauliList(['XX', 'ZZ'])

**Iteration**

Rows in the Pauli table can be iterated over like a list. Iteration can
also be done using the label or matrix representation of each row using the
:meth:`label_iter` and :meth:`matrix_iter` methods.

### `__init__`

```python
def __init__(self, data: Pauli | list)
```

Initialize the PauliList.

Args:
    data (Pauli or list): input data for Paulis. If input is a list each item in the list
                          must be a Pauli object or Pauli str.

Raises:
    QiskitError: if input array is invalid shape.

Additional Information:
    The input array is not copied so multiple Pauli tables
    can share the same underlying array.

### `settings`

```python
def settings(self)
```

Return settings.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Convert to numpy array

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

### `__eq__`

```python
def __eq__(self, other)
```

Entrywise comparison of Pauli equality.

### `equiv`

```python
def equiv(self, other: PauliList | Pauli) -> np.ndarray
```

Entrywise comparison of Pauli equivalence up to global phase.

Args:
    other (PauliList or Pauli): a comparison object.

Returns:
    np.ndarray: An array of ``True`` or ``False`` for entrywise equivalence
                of the current table.

### `phase`

```python
def phase(self)
```

Return the phase exponent of the PauliList.

### `x`

```python
def x(self)
```

The x array for the symplectic representation.

### `z`

```python
def z(self)
```

The z array for the symplectic representation.

### `shape`

```python
def shape(self)
```

The full shape of the :meth:`array`

### `size`

```python
def size(self)
```

The number of Pauli rows in the table.

### `__len__`

```python
def __len__(self)
```

Return the number of Pauli rows in the table.

### `__getitem__`

```python
def __getitem__(self, index)
```

Return a view of the PauliList.

### `__setitem__`

```python
def __setitem__(self, index, value)
```

Update PauliList.

### `delete`

```python
def delete(self, ind: int | list, qubit: bool=False) -> PauliList
```

Return a copy with Pauli rows deleted from table.

When deleting qubits the qubit index is the same as the
column index of the underlying :attr:`X` and :attr:`Z` arrays.

Args:
    ind (int or list): index(es) to delete.
    qubit (bool): if ``True`` delete qubit columns, otherwise delete
                  Pauli rows (Default: ``False``).

Returns:
    PauliList: the resulting table with the entries removed.

Raises:
    QiskitError: if ``ind`` is out of bounds for the array size or
                 number of qubits.

### `insert`

```python
def insert(self, ind: int, value: PauliList, qubit: bool=False) -> PauliList
```

Insert Paulis into the table.

When inserting qubits the qubit index is the same as the
column index of the underlying :attr:`X` and :attr:`Z` arrays.

Args:
    ind (int): index to insert at.
    value (PauliList): values to insert.
    qubit (bool): if ``True`` insert qubit columns, otherwise insert
                  Pauli rows (Default: ``False``).

Returns:
    PauliList: the resulting table with the entries inserted.

Raises:
    QiskitError: if the insertion index is invalid.

### `argsort`

```python
def argsort(self, weight: bool=False, phase: bool=False) -> np.ndarray
```

Return indices for sorting the rows of the table.

The default sort method is lexicographic sorting by qubit number.
By using the `weight` kwarg the output can additionally be sorted
by the number of non-identity terms in the Pauli, where the set of
all Paulis of a given weight are still ordered lexicographically.

Args:
    weight (bool): Optionally sort by weight if ``True`` (Default: ``False``).
    phase (bool): Optionally sort by phase before weight or order
                  (Default: ``False``).

Returns:
    array: the indices for sorting the table.

### `sort`

```python
def sort(self, weight: bool=False, phase: bool=False) -> PauliList
```

Sort the rows of the table.

The default sort method is lexicographic sorting by qubit number.
By using the `weight` kwarg the output can additionally be sorted
by the number of non-identity terms in the Pauli, where the set of
all Paulis of a given weight are still ordered lexicographically.

**Example**

Consider sorting all a random ordering of all 2-qubit Paulis

.. plot::
   :include-source:
   :nofigs:

    from numpy.random import shuffle
    from qiskit.quantum_info.operators import PauliList

    # 2-qubit labels
    labels = ['II', 'IX', 'IY', 'IZ', 'XI', 'XX', 'XY', 'XZ',
              'YI', 'YX', 'YY', 'YZ', 'ZI', 'ZX', 'ZY', 'ZZ']
    # Shuffle Labels
    shuffle(labels)
    pt = PauliList(labels)
    print('Initial Ordering')
    print(pt)

    # Lexicographic Ordering
    srt = pt.sort()
    print('Lexicographically sorted')
    print(srt)

    # Weight Ordering
    srt = pt.sort(weight=True)
    print('Weight sorted')
    print(srt)

.. code-block:: text

    Initial Ordering
    ['YX', 'ZZ', 'XZ', 'YI', 'YZ', 'II', 'XX', 'XI', 'XY', 'YY', 'IX', 'IZ',
     'ZY', 'ZI', 'ZX', 'IY']
    Lexicographically sorted
    ['II', 'IX', 'IY', 'IZ', 'XI', 'XX', 'XY', 'XZ', 'YI', 'YX', 'YY', 'YZ',
     'ZI', 'ZX', 'ZY', 'ZZ']
    Weight sorted
    ['II', 'IX', 'IY', 'IZ', 'XI', 'YI', 'ZI', 'XX', 'XY', 'XZ', 'YX', 'YY',
     'YZ', 'ZX', 'ZY', 'ZZ']

Args:
    weight (bool): optionally sort by weight if ``True`` (Default: ``False``).
    phase (bool): Optionally sort by phase before weight or order
                  (Default: ``False``).

Returns:
    PauliList: a sorted copy of the original table.

### `unique`

```python
def unique(self, return_index: bool=False, return_counts: bool=False) -> PauliList
```

Return unique Paulis from the table.

**Example**

.. plot::
   :include-source:
   :nofigs:

    from qiskit.quantum_info.operators import PauliList

    pt = PauliList(['X', 'Y', '-X', 'I', 'I', 'Z', 'X', 'iZ'])
    unique = pt.unique()
    print(unique)

.. code-block:: text

    ['X', 'Y', '-X', 'I', 'Z', 'iZ']

Args:
    return_index (bool): If ``True``, also return the indices that
                         result in the unique array.
                         (Default: ``False``)
    return_counts (bool): If ``True``, also return the number of times
                          each unique item appears in the table.

Returns:
    PauliList: unique
        the table of the unique rows.

    unique_indices: np.ndarray, optional
        The indices of the first occurrences of the unique values in
        the original array. Only provided if ``return_index`` is ``True``.

    unique_counts: np.array, optional
        The number of times each of the unique values comes up in the
        original array. Only provided if ``return_counts`` is ``True``.

### `tensor`

```python
def tensor(self, other: PauliList) -> PauliList
```

Return the tensor product with each Pauli in the list.

Args:
    other (PauliList): another PauliList.

Returns:
    PauliList: the list of tensor product Paulis.

Raises:
    QiskitError: if other cannot be converted to a PauliList, does
                 not have either 1 or the same number of Paulis as
                 the current list.

### `expand`

```python
def expand(self, other: PauliList) -> PauliList
```

Return the expand product of each Pauli in the list.

Args:
    other (PauliList): another PauliList.

Returns:
    PauliList: the list of tensor product Paulis.

Raises:
    QiskitError: if other cannot be converted to a PauliList, does
                 not have either 1 or the same number of Paulis as
                 the current list.

### `compose`

```python
def compose(self, other: PauliList, qargs: None | list=None, front: bool=False, inplace: bool=False) -> PauliList
```

Return the composition self∘other for each Pauli in the list.

Args:
    other (PauliList): another PauliList.
    qargs (None or list): qubits to apply dot product on (Default: ``None``).
    front (bool): If True use `dot` composition method [default: ``False``].
    inplace (bool): If ``True`` update in-place (default: ``False``).

Returns:
    PauliList: the list of composed Paulis.

Raises:
    QiskitError: if other cannot be converted to a PauliList, does
                 not have either 1 or the same number of Paulis as
                 the current list, or has the wrong number of qubits
                 for the specified ``qargs``.

### `dot`

```python
def dot(self, other: PauliList, qargs: None | list=None, inplace: bool=False) -> PauliList
```

Return the composition other∘self for each Pauli in the list.

Args:
    other (PauliList): another PauliList.
    qargs (None or list): qubits to apply dot product on (Default: ``None``).
    inplace (bool): If True update in-place (default: ``False``).

Returns:
    PauliList: the list of composed Paulis.

Raises:
    QiskitError: if other cannot be converted to a PauliList, does
                 not have either 1 or the same number of Paulis as
                 the current list, or has the wrong number of qubits
                 for the specified ``qargs``.

### `conjugate`

```python
def conjugate(self)
```

Return the conjugate of each Pauli in the list.

### `transpose`

```python
def transpose(self)
```

Return the transpose of each Pauli in the list.

### `adjoint`

```python
def adjoint(self)
```

Return the adjoint of each Pauli in the list.

### `inverse`

```python
def inverse(self)
```

Return the inverse of each Pauli in the list.

### `commutes`

```python
def commutes(self, other: BasePauli, qargs: list | None=None) -> bool
```

Return True for each Pauli that commutes with other.

Args:
    other (PauliList): another PauliList operator.
    qargs (list): qubits to apply dot product on (default: ``None``).

Returns:
    bool: ``True`` if Paulis commute, ``False`` if they anti-commute.

### `anticommutes`

```python
def anticommutes(self, other: BasePauli, qargs: list | None=None) -> bool
```

Return ``True`` if the other Pauli anticommutes with this one.

Args:
    other (PauliList): another PauliList operator.
    qargs (list): qubits to apply dot product on (default: ``None``).

Returns:
    bool: ``True`` if Paulis anticommute, ``False`` if they commute.

### `commutes_with_all`

```python
def commutes_with_all(self, other: PauliList) -> np.ndarray
```

Return indexes of rows that commute ``other``.

If ``other`` is a multi-row Pauli list the returned vector indexes rows
of the current PauliList that commute with *all* Paulis in other.
If no rows satisfy the condition the returned array will be empty.

Args:
    other (PauliList): a single Pauli or multi-row PauliList.

Returns:
    array: index array of the commuting rows.

### `anticommutes_with_all`

```python
def anticommutes_with_all(self, other: PauliList) -> np.ndarray
```

Return indexes of rows that anticommute with the other Pauli list.

If ``other`` is a multi-row Pauli list the returned vector indexes rows
of the current PauliList that anti-commute with *all* Paulis in other.
If no rows satisfy the condition the returned array will be empty.

Args:
    other (PauliList): a single Pauli or multi-row PauliList.

Returns:
    array: index array of the anti-commuting rows.

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
    frame (string): ``'h'`` for Heisenberg (default) or ``'s'`` for Schrödinger framework.

Returns:
    PauliList: the Pauli :math:`C^\dagger.P.C` (Heisenberg picture)
    or the Pauli :math:`C.P.C^\dagger` (Schrödinger picture).

Raises:
    QiskitError: if the Clifford number of qubits and qargs don't match.

### `to_labels`

```python
def to_labels(self, array: bool=False)
```

Convert a PauliList to a list Pauli string labels.

For large PauliLists converting using the ``array=True``
kwarg will be more efficient since it allocates memory for
the full Numpy array of labels in advance.

.. list-table:: Pauli Representations
    :header-rows: 1

    * - Label
      - Symplectic
      - Matrix
    * - ``"I"``
      - :math:`[0, 0]`
      - :math:`\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}`
    * - ``"X"``
      - :math:`[1, 0]`
      - :math:`\begin{bmatrix} 0 & 1 \\ 1 & 0  \end{bmatrix}`
    * - ``"Y"``
      - :math:`[1, 1]`
      - :math:`\begin{bmatrix} 0 & -i \\ i & 0  \end{bmatrix}`
    * - ``"Z"``
      - :math:`[0, 1]`
      - :math:`\begin{bmatrix} 1 & 0 \\ 0 & -1  \end{bmatrix}`

Args:
    array (bool): return a Numpy array if ``True``, otherwise
                  return a list (Default: ``False``).

Returns:
    list or array: The rows of the PauliList in label form.

### `to_matrix`

```python
def to_matrix(self, sparse: bool=False, array: bool=False) -> list
```

Convert to a list or array of Pauli matrices.

For large PauliLists converting using the ``array=True``
kwarg will be more efficient since it allocates memory a full
rank-3 Numpy array of matrices in advance.

.. list-table:: Pauli Representations
    :header-rows: 1

    * - Label
      - Symplectic
      - Matrix
    * - ``"I"``
      - :math:`[0, 0]`
      - :math:`\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}`
    * - ``"X"``
      - :math:`[1, 0]`
      - :math:`\begin{bmatrix} 0 & 1 \\ 1 & 0  \end{bmatrix}`
    * - ``"Y"``
      - :math:`[1, 1]`
      - :math:`\begin{bmatrix} 0 & -i \\ i & 0  \end{bmatrix}`
    * - ``"Z"``
      - :math:`[0, 1]`
      - :math:`\begin{bmatrix} 1 & 0 \\ 0 & -1  \end{bmatrix}`

Args:
    sparse (bool): if ``True`` return sparse CSR matrices, otherwise
                   return dense Numpy arrays (Default: ``False``).
    array (bool): return as rank-3 numpy array if ``True``, otherwise
                  return a list of Numpy arrays (Default: ``False``).

Returns:
    list: A list of dense Pauli matrices if ``array=False`` and ``sparse=False``.
    list: A list of sparse Pauli matrices if ``array=False`` and ``sparse=True``.
    array: A dense rank-3 array of Pauli matrices if ``array=True``.

### `label_iter`

```python
def label_iter(self)
```

Return a label representation iterator.

This is a lazy iterator that converts each row into the string
label only as it is used. To convert the entire table to labels use
the :meth:`to_labels` method.

Returns:
    LabelIterator: label iterator object for the PauliList.

### `matrix_iter`

```python
def matrix_iter(self, sparse: bool=False)
```

Return a matrix representation iterator.

This is a lazy iterator that converts each row into the Pauli matrix
representation only as it is used. To convert the entire table to
matrices use the :meth:`to_matrix` method.

Args:
    sparse (bool): optionally return sparse CSR matrices if ``True``,
                   otherwise return Numpy array matrices
                   (Default: ``False``)

Returns:
    MatrixIterator: matrix iterator object for the PauliList.

### `from_symplectic`

```python
def from_symplectic(cls, z: np.ndarray, x: np.ndarray, phase: np.ndarray | None=0) -> PauliList
```

Construct a PauliList from a symplectic data.

Args:
    z (np.ndarray): 2D boolean Numpy array.
    x (np.ndarray): 2D boolean Numpy array.
    phase (np.ndarray or None):  1D integer array from Z_4.

Returns:
    PauliList: the constructed PauliList.

### `noncommutation_graph`

```python
def noncommutation_graph(self, qubit_wise: bool) -> rx.PyGraph
```

Create the non-commutation graph of this PauliList.

This transforms the measurement operator grouping problem into graph coloring problem. The
constructed graph contains one node for each Pauli. The nodes will be connecting for any two
Pauli terms that do _not_ commute.

Args:
    qubit_wise (bool): whether the commutation rule is applied to the whole operator,
        or on a per-qubit basis.

Returns:
    rustworkx.PyGraph: the non-commutation graph with nodes for each Pauli and edges
        indicating a non-commutation relation. Each node will hold the index of the Pauli
        term it corresponds to in its data. The edges of the graph hold no data.

### `group_qubit_wise_commuting`

```python
def group_qubit_wise_commuting(self) -> list[PauliList]
```

Partition a PauliList into sets of mutually qubit-wise commuting Pauli strings.

Returns:
    list[PauliList]: List of PauliLists where each PauliList contains commutable Pauli operators.

### `group_commuting`

```python
def group_commuting(self, qubit_wise: bool=False) -> list[PauliList]
```

Partition a PauliList into sets of commuting Pauli strings.

Args:
    qubit_wise (bool): whether the commutation rule is applied to the whole operator,
        or on a per-qubit basis.  For example:

        .. plot::
           :include-source:
           :nofigs:

            >>> from qiskit.quantum_info import PauliList
            >>> op = PauliList(["XX", "YY", "IZ", "ZZ"])
            >>> op.group_commuting()
            [PauliList(['XX', 'YY']), PauliList(['IZ', 'ZZ'])]
            >>> op.group_commuting(qubit_wise=True)
            [PauliList(['XX']), PauliList(['YY']), PauliList(['IZ', 'ZZ'])]

Returns:
    list[PauliList]: List of PauliLists where each PauliList contains commuting Pauli operators.
