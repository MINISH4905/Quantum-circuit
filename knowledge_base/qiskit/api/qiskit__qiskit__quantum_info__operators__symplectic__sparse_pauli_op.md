---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/symplectic/sparse_pauli_op.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/symplectic/sparse_pauli_op.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/symplectic/sparse_pauli_op.py`

N-Qubit Sparse Pauli Operator class.

## `SparsePauliOp`

```python
class SparsePauliOp(LinearOp)
```

Sparse N-qubit operator in a Pauli basis representation.

This is a sparse representation of an N-qubit matrix
:class:`~qiskit.quantum_info.Operator` in terms of N-qubit
:class:`~qiskit.quantum_info.PauliList` and complex coefficients.

It can be used for performing operator arithmetic for hundreds of qubits
if the number of non-zero Pauli basis terms is sufficiently small.

The Pauli basis components are stored as a
:class:`~qiskit.quantum_info.PauliList` object and can be accessed
using the :attr:`~SparsePauliOp.paulis` attribute. The coefficients
are stored as a complex Numpy array vector and can be accessed using
the :attr:`~SparsePauliOp.coeffs` attribute.

.. rubric:: Data type of coefficients

The default ``dtype`` of the internal ``coeffs`` Numpy array is ``complex128``.  Users can
configure this by passing ``np.ndarray`` with a different dtype.  For example, a parameterized
:class:`SparsePauliOp` can be made as follows:

.. plot::
   :include-source:
   :nofigs:

    >>> import numpy as np
    >>> from qiskit.circuit import ParameterVector
    >>> from qiskit.quantum_info import SparsePauliOp

    >>> SparsePauliOp(["II", "XZ"], np.array(ParameterVector("a", 2)))
    SparsePauliOp(['II', 'XZ'],
          coeffs=[ParameterExpression(1.0*a[0]), ParameterExpression(1.0*a[1])])

.. note::

  Parameterized :class:`SparsePauliOp` does not support the following methods:

  - ``to_matrix(sparse=True)`` since ``scipy.sparse`` cannot have objects as elements.
  - ``to_operator()`` since :class:`~.quantum_info.Operator` does not support objects.
  - ``sort``, ``argsort`` since :class:`.ParameterExpression` does not support comparison.
  - ``equiv`` since :class:`.ParameterExpression` cannot be converted into complex.
  - ``chop`` since :class:`.ParameterExpression` does not support absolute value.

### `__init__`

```python
def __init__(self, data: PauliList | SparsePauliOp | Pauli | list | str, coeffs: np.ndarray | None=None, *, ignore_pauli_phase: bool=False, copy: bool=True)
```

Initialize an operator object.

Args:
    data (PauliList or SparsePauliOp or Pauli or list or str): Pauli list of
        terms.  A list of Pauli strings or a Pauli string is also allowed.
    coeffs (np.ndarray): complex coefficients for Pauli terms.

        .. note::

            If ``data`` is a :obj:`~SparsePauliOp` and ``coeffs`` is not ``None``, the value
            of the ``SparsePauliOp.coeffs`` will be ignored, and only the passed keyword
            argument ``coeffs`` will be used.

    ignore_pauli_phase (bool): if true, any ``phase`` component of a given :obj:`~PauliList`
        will be assumed to be zero.  This is more efficient in cases where a
        :obj:`~PauliList` has been constructed purely for this object, and it is already
        known that the phases in the ZX-convention are zero.  It only makes sense to pass
        this option when giving :obj:`~PauliList` data.  (Default: False)
    copy (bool): copy the input data if True, otherwise assign it directly, if possible.
        (Default: True)

Raises:
    QiskitError: If the input data or coeffs are invalid.

### `__eq__`

```python
def __eq__(self, other)
```

Entrywise comparison of two SparsePauliOp operators

### `equiv`

```python
def equiv(self, other: SparsePauliOp, atol: float | None=None) -> bool
```

Check if two SparsePauliOp operators are equivalent.

Args:
    other (SparsePauliOp): an operator object.
    atol: Absolute numerical tolerance for checking equivalence.

Returns:
    bool: True if the operator is equivalent to ``self``.

### `settings`

```python
def settings(self) -> dict
```

Return settings.

### `size`

```python
def size(self)
```

The number of Pauli of Pauli terms in the operator.

### `__len__`

```python
def __len__(self)
```

Return the size.

### `paulis`

```python
def paulis(self)
```

Return the PauliList.

### `coeffs`

```python
def coeffs(self)
```

Return the Pauli coefficients.

### `coeffs`

```python
def coeffs(self, value)
```

Set Pauli coefficients.

### `__getitem__`

```python
def __getitem__(self, key)
```

Return a view of the SparsePauliOp.

### `__setitem__`

```python
def __setitem__(self, key, value)
```

Update SparsePauliOp.

### `is_unitary`

```python
def is_unitary(self, atol: float | None=None, rtol: float | None=None) -> bool
```

Return True if operator is a unitary matrix.

This method checks whether the operator composed with its adjoint equals
the identity, up to the provided tolerance. The tolerance is used when
simplifying the composed operator and checking if the result is the identity.

Args:
    atol (float): Optional. Absolute tolerance for checking if
                  coefficients are zero (Default: 1e-8).
    rtol (float): Optional. Relative tolerance for checking if
                  coefficients are zero (Default: 1e-5).

Returns:
    bool: True if the operator is unitary, False otherwise.

### `simplify`

```python
def simplify(self, atol: float | None=None, rtol: float | None=None) -> SparsePauliOp
```

Simplify PauliList by combining duplicates and removing zeros.

Args:
    atol (float): Optional. Absolute tolerance for checking if
                  coefficients are zero (Default: 1e-8).
    rtol (float): Optional. relative tolerance for checking if
                  coefficients are zero (Default: 1e-5).

Returns:
    SparsePauliOp: the simplified SparsePauliOp operator.

### `argsort`

```python
def argsort(self, weight: bool=False)
```

Return indices for sorting the rows of the table.

Returns the composition of permutations in the order of sorting
by coefficient and sorting by Pauli.
By using the `weight` kwarg the output can additionally be sorted
by the number of non-identity terms in the Pauli, where the set of
all Pauli's of a given weight are still ordered lexicographically.

**Example**

Here is an example of how to use SparsePauliOp argsort.

.. plot::
   :include-source:
   :nofigs:

    import numpy as np
    from qiskit.quantum_info import SparsePauliOp

    # 2-qubit labels
    labels = ["XX", "XX", "XX", "YI", "II", "XZ", "XY", "XI"]
    # coeffs
    coeffs = [2.+1.j, 2.+2.j, 3.+0.j, 3.+0.j, 4.+0.j, 5.+0.j, 6.+0.j, 7.+0.j]

    # init
    spo = SparsePauliOp(labels, coeffs)
    print('Initial Ordering')
    print(spo)

    # Lexicographic Ordering
    srt = spo.argsort()
    print('Lexicographically sorted')
    print(srt)

    # Lexicographic Ordering
    srt = spo.argsort(weight=False)
    print('Lexicographically sorted')
    print(srt)

    # Weight Ordering
    srt = spo.argsort(weight=True)
    print('Weight sorted')
    print(srt)

.. code-block:: text

    Initial Ordering
    SparsePauliOp(['XX', 'XX', 'XX', 'YI', 'II', 'XZ', 'XY', 'XI'],
                  coeffs=[2.+1.j, 2.+2.j, 3.+0.j, 3.+0.j, 4.+0.j, 5.+0.j, 6.+0.j, 7.+0.j])
    Lexicographically sorted
    [4 7 0 1 2 6 5 3]
    Lexicographically sorted
    [4 7 0 1 2 6 5 3]
    Weight sorted
    [4 7 3 0 1 2 6 5]

Args:
    weight (bool): optionally sort by weight if True (Default: False).
    By using the weight kwarg the output can additionally be sorted
    by the number of non-identity terms in the Pauli.

Returns:
    array: the indices for sorting the table.

### `sort`

```python
def sort(self, weight: bool=False)
```

Sort the rows of the table.

After sorting the coefficients using numpy's argsort, sort by Pauli.
Pauli sort takes precedence.
If Pauli is the same, it will be sorted by coefficient.
By using the `weight` kwarg the output can additionally be sorted
by the number of non-identity terms in the Pauli, where the set of
all Pauli's of a given weight are still ordered lexicographically.

**Example**

Here is an example of how to use SparsePauliOp sort.

.. plot::
   :include-source:
   :nofigs:

    import numpy as np
    from qiskit.quantum_info import SparsePauliOp

    # 2-qubit labels
    labels = ["XX", "XX", "XX", "YI", "II", "XZ", "XY", "XI"]
    # coeffs
    coeffs = [2.+1.j, 2.+2.j, 3.+0.j, 3.+0.j, 4.+0.j, 5.+0.j, 6.+0.j, 7.+0.j]

    # init
    spo = SparsePauliOp(labels, coeffs)
    print('Initial Ordering')
    print(spo)

    # Lexicographic Ordering
    srt = spo.sort()
    print('Lexicographically sorted')
    print(srt)

    # Lexicographic Ordering
    srt = spo.sort(weight=False)
    print('Lexicographically sorted')
    print(srt)

    # Weight Ordering
    srt = spo.sort(weight=True)
    print('Weight sorted')
    print(srt)

.. code-block:: text

    Initial Ordering
    SparsePauliOp(['XX', 'XX', 'XX', 'YI', 'II', 'XZ', 'XY', 'XI'],
                  coeffs=[2.+1.j, 2.+2.j, 3.+0.j, 3.+0.j, 4.+0.j, 5.+0.j, 6.+0.j, 7.+0.j])
    Lexicographically sorted
    SparsePauliOp(['II', 'XI', 'XX', 'XX', 'XX', 'XY', 'XZ', 'YI'],
                  coeffs=[4.+0.j, 7.+0.j, 2.+1.j, 2.+2.j, 3.+0.j, 6.+0.j, 5.+0.j, 3.+0.j])
    Lexicographically sorted
    SparsePauliOp(['II', 'XI', 'XX', 'XX', 'XX', 'XY', 'XZ', 'YI'],
                  coeffs=[4.+0.j, 7.+0.j, 2.+1.j, 2.+2.j, 3.+0.j, 6.+0.j, 5.+0.j, 3.+0.j])
    Weight sorted
    SparsePauliOp(['II', 'XI', 'YI', 'XX', 'XX', 'XX', 'XY', 'XZ'],
                  coeffs=[4.+0.j, 7.+0.j, 3.+0.j, 2.+1.j, 2.+2.j, 3.+0.j, 6.+0.j, 5.+0.j])

Args:
    weight (bool): optionally sort by weight if True (Default: False).
    By using the weight kwarg the output can additionally be sorted
    by the number of non-identity terms in the Pauli.

Returns:
    SparsePauliOp: a sorted copy of the original table.

### `chop`

```python
def chop(self, tol: float=1e-14) -> SparsePauliOp
```

Set real and imaginary parts of the coefficients to 0 if ``< tol`` in magnitude.

For example, the operator representing ``1+1e-17j X + 1e-17 Y`` with a tolerance larger
than ``1e-17`` will be reduced to ``1 X`` whereas :meth:`.SparsePauliOp.simplify` would
return ``1+1e-17j X``.

If both the real and imaginary part of a coefficient is 0 after chopping, the
corresponding Pauli is removed from the operator.

Args:
    tol (float): The absolute tolerance to check whether a real or imaginary part should
        be set to 0.

Returns:
    SparsePauliOp: This operator with chopped coefficients.

### `sum`

```python
def sum(ops: list[SparsePauliOp]) -> SparsePauliOp
```

Sum of SparsePauliOps.

This is a specialized version of the builtin ``sum`` function for SparsePauliOp
with smaller overhead.

Args:
    ops (list[SparsePauliOp]): a list of SparsePauliOps.

Returns:
    SparsePauliOp: the SparsePauliOp representing the sum of the input list.

Raises:
    QiskitError: if the input list is empty.
    QiskitError: if the input list includes an object that is not SparsePauliOp.
    QiskitError: if the numbers of qubits of the objects in the input list do not match.

### `from_operator`

```python
def from_operator(obj: Operator, atol: float | None=None, rtol: float | None=None) -> SparsePauliOp
```

Construct from an Operator object.

Note that the cost of this construction is exponential in general because the number of
possible Pauli terms in the decomposition is exponential in the number of qubits.

Internally this uses an implementation of the "tensorized Pauli decomposition" presented in
`Hantzko, Binkowski and Gupta (2023) <https://arxiv.org/abs/2310.13421>`__.

Args:
    obj (Operator): an N-qubit operator.
    atol (float): Optional. Absolute tolerance for checking if coefficients are zero
        (Default: 1e-8).  Since the comparison is to zero, in effect the tolerance used is
        the maximum of ``atol`` and ``rtol``.
    rtol (float): Optional. relative tolerance for checking if coefficients are zero
        (Default: 1e-5).  Since the comparison is to zero, in effect the tolerance used is
        the maximum of ``atol`` and ``rtol``.

Returns:
    SparsePauliOp: the SparsePauliOp representation of the operator.

Raises:
    QiskitError: if the input operator is not an N-qubit operator.

### `from_list`

```python
def from_list(obj: Iterable[tuple[str, complex]], dtype: type | None=None, *, num_qubits: int | None=None) -> SparsePauliOp
```

Construct from a list of Pauli strings and coefficients.

For example, the 5-qubit Hamiltonian

.. math::

    H = Z_1 X_4 + 2 Y_0 Y_3

can be constructed as

.. plot::
   :include-source:
   :nofigs:

    from qiskit.quantum_info import SparsePauliOp

    # via tuples and the full Pauli string
    op = SparsePauliOp.from_list([("XIIZI", 1), ("IYIIY", 2)])

Args:
    obj (Iterable[Tuple[str, complex]]): The list of 2-tuples specifying the Pauli terms.
    dtype (type | None): Data type for the coefficients. If ``None`` (default), the dtype is
        automatically inferred.
    num_qubits (int): The number of qubits of the operator (Default: None).

Returns:
    SparsePauliOp: The SparsePauliOp representation of the Pauli terms.

Raises:
    QiskitError: If an empty list is passed and num_qubits is None.
    QiskitError: If num_qubits and the objects in the input list do not match.

### `from_sparse_list`

```python
def from_sparse_list(obj: Iterable[tuple[str, list[int], complex]], num_qubits: int, do_checks: bool=True, dtype: type | None=None) -> SparsePauliOp
```

Construct from a list of local Pauli strings and coefficients.

Each list element is a 3-tuple of a local Pauli string, indices where to apply it,
and a coefficient.

For example, the 5-qubit Hamiltonian

.. math::

    H = Z_1 X_4 + 2 Y_0 Y_3

can be constructed as

.. plot::
   :include-source:
   :nofigs:

    from qiskit.quantum_info import SparsePauliOp

    # via triples and local Paulis with indices
    op = SparsePauliOp.from_sparse_list([("ZX", [1, 4], 1), ("YY", [0, 3], 2)], num_qubits=5)

    # equals the following construction from "dense" Paulis
    op = SparsePauliOp.from_list([("XIIZI", 1), ("IYIIY", 2)])

Args:
    obj (Iterable[tuple[str, list[int], complex]]): The list 3-tuples specifying the Paulis.
    num_qubits (int): The number of qubits of the operator.
    do_checks (bool): Whether to perform validity checks on the input indices.
    dtype (type | None): Data type for the coefficients. If ``None`` (default), the dtype is
        automatically inferred.


Returns:
    SparsePauliOp: The SparsePauliOp representation of the Pauli terms.

Raises:
    QiskitError: If the number of qubits is incompatible with the indices of the Pauli terms.
    QiskitError: If the designated qubit is already assigned.

### `from_sparse_observable`

```python
def from_sparse_observable(obs: SparseObservable) -> SparsePauliOp
```

Initialize from a :class:`.SparseObservable`.

.. warning::

    A :class:`.SparseObservable` can efficiently represent eigenstate projectors
    (such as :math:`|0\langle\rangle 0|`), but a :class:`.SparsePauliOp` **cannot**.
    If the input ``obs`` has :math:`n` single-qubit projectors, the resulting
    :class:`.SparsePauliOp` will use :math:`2^n` terms, which is an exponentially
    expensive representation that can quickly run out of memory.

Args:
    obs: The :class:`.SparseObservable` to convert.

Returns:
    A :class:`.SparsePauliOp` version of the observable.

### `to_list`

```python
def to_list(self, array: bool=False)
```

Convert to a list Pauli string labels and coefficients.

For operators with a lot of terms converting using the ``array=True``
kwarg will be more efficient since it allocates memory for
the full Numpy array of labels in advance.

Args:
    array (bool): return a Numpy array if True, otherwise
                  return a list (Default: False).

Returns:
    list or array: List of pairs (label, coeff) for rows of the PauliList.

### `to_sparse_list`

```python
def to_sparse_list(self)
```

Convert to a sparse Pauli list format with elements (pauli, qubits, coefficient).

### `to_matrix`

```python
def to_matrix(self, sparse: bool=False, force_serial: bool=False) -> np.ndarray
```

Convert to a dense or sparse matrix.

Args:
    sparse: if ``True`` return a sparse CSR matrix, otherwise return dense Numpy
        array (the default).
    force_serial: if ``True``, use an unthreaded implementation, regardless of the state of
        the `Qiskit threading-control environment variables
        <https://quantum.cloud.ibm.com/docs/guides/configure-qiskit-local#environment-variables>`__.
        By default, this will use threaded parallelism over the available CPUs.

Returns:
    array: A dense matrix if `sparse=False`.
    csr_matrix: A sparse matrix in CSR format if `sparse=True`.

### `to_operator`

```python
def to_operator(self) -> Operator
```

Convert to a matrix Operator object

### `label_iter`

```python
def label_iter(self)
```

Return a label representation iterator.

This is a lazy iterator that converts each term in the SparsePauliOp
into a tuple (label, coeff). To convert the entire table to labels
use the :meth:`to_labels` method.

Returns:
    LabelIterator: label iterator object for the SparsePauliOp.

### `matrix_iter`

```python
def matrix_iter(self, sparse: bool=False)
```

Return a matrix representation iterator.

This is a lazy iterator that converts each term in the SparsePauliOp
into a matrix as it is used. To convert to a single matrix use the
:meth:`to_matrix` method.

Args:
    sparse (bool): optionally return sparse CSR matrices if True,
                   otherwise return Numpy array matrices
                   (Default: False)

Returns:
    MatrixIterator: matrix iterator object for the PauliList.

### `noncommutation_graph`

```python
def noncommutation_graph(self, qubit_wise: bool) -> rx.PyGraph
```

Create the non-commutation graph of this SparsePauliOp.

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

### `group_commuting`

```python
def group_commuting(self, qubit_wise: bool=False) -> list[SparsePauliOp]
```

Partition a SparsePauliOp into sets of commuting Pauli strings.

Args:
    qubit_wise (bool): whether the commutation rule is applied to the whole operator,
        or on a per-qubit basis.  For example:

        .. plot::
           :include-source:
           :nofigs:

            >>> from qiskit.quantum_info import SparsePauliOp
            >>> op = SparsePauliOp.from_list([("XX", 2), ("YY", 1), ("IZ",2j), ("ZZ",1j)])
            >>> op.group_commuting()
            [SparsePauliOp(["IZ", "ZZ"], coeffs=[0.+2.j, 0.+1j]),
             SparsePauliOp(["XX", "YY"], coeffs=[2.+0.j, 1.+0.j])]
            >>> op.group_commuting(qubit_wise=True)
            [SparsePauliOp(['XX'], coeffs=[2.+0.j]),
             SparsePauliOp(['YY'], coeffs=[1.+0.j]),
             SparsePauliOp(['IZ', 'ZZ'], coeffs=[0.+2.j, 0.+1.j])]

Returns:
    list[SparsePauliOp]: List of SparsePauliOp where each SparsePauliOp contains
        commuting Pauli operators.

### `parameters`

```python
def parameters(self) -> ParameterView
```

Return the free ``Parameter``\s in the coefficients.

### `assign_parameters`

```python
def assign_parameters(self, parameters: Mapping[Parameter, complex | ParameterExpression] | Sequence[complex | ParameterExpression], inplace: bool=False) -> SparsePauliOp | None
```

Bind the free ``Parameter``\s in the coefficients to provided values.

.. note::
    If all the parameters in the circuit are bound to numeric values, the coefficients array
    will be returned with a :class:`complex` dtype.

Args:
    parameters: The values to bind the parameters to.
    inplace: If ``False``, a copy of the operator with the bound parameters is returned.
        If ``True`` the operator itself is modified.

Returns:
    A copy of the operator with bound parameters, if ``inplace`` is ``False``, otherwise
    ``None``.

### `apply_layout`

```python
def apply_layout(self, layout: TranspileLayout | list[int] | None, num_qubits: int | None=None) -> SparsePauliOp
```

Apply a transpiler layout to this :class:`~.SparsePauliOp`

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
    A new :class:`.SparsePauliOp` with the provided layout applied

## `sparsify_label`

```python
def sparsify_label(pauli_string)
```

Return a sparse format of a Pauli string, e.g. "XIIIZ" -> ("XZ", [0, 4]).
