---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qubit/state_preparation.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qubit/state_preparation.py
license: Apache-2.0
---

## Module `pennylane/ops/qubit/state_preparation.py`

This submodule contains the discrete-variable quantum operations concerned
with preparing a certain state on the device.

## `BasisState`

```python
class BasisState(StatePrepBase)
```

BasisState(state, wires)
Prepares a single computational basis state.

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 1
* Gradient recipe: None

.. note::

    If the ``BasisState`` operation is not supported natively on the
    target device, PennyLane will attempt to decompose the operation
    into :class:`~.PauliX` operations.

.. note::

    When called in the middle of a circuit, the action of the operation is defined
    as :math:`U|0\rangle = |\psi\rangle`

Args:
    state (tensor_like): Binary input of shape ``(len(wires), )``. For example, if ``state=np.array([0, 1, 0])`` or ``state=2`` (equivalent to 010 in binary), the quantum system will be prepared in the state :math:`|010 \rangle`.

    wires (Sequence[int] or int): the wire(s) the operation acts on
    id (str): Custom label given to an operator instance. Can be useful for some applications where the instance has to be identified.

**Example**

>>> dev = qp.device('default.qubit', wires=2)
>>> @qp.qnode(dev)
... def example_circuit():
...     qp.BasisState(np.array([1, 1]), wires=range(2))
...     return qp.state()
>>> print(example_circuit())
[0.+0.j 0.+0.j 0.+0.j 1.+0.j]

### `compute_decomposition`

```python
def compute_decomposition(state: TensorLike, wires: WiresLike) -> list[Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.BasisState.decomposition`.

Args:
    state (array): the basis state to be prepared
    wires (Iterable, Wires): the wire(s) the operation acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.BasisState.compute_decomposition([1,0], wires=(0,1))
[X(0)]

### `state_vector`

```python
def state_vector(self, wire_order: WiresLike | None=None) -> TensorLike
```

Returns a statevector of shape ``(2,) * num_wires``.

## `StatePrep`

```python
class StatePrep(StatePrepBase)
```

StatePrep(state, wires, pad_with = None, normalize = False, validate_norm = False)
Prepare subsystems using a state vector in the computational basis.

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 1
* Gradient recipe: None

.. note::

    If the ``StatePrep`` operation is not supported natively on the
    target device, PennyLane will attempt to decompose the operation
    using the method developed by Möttönen et al. (Quantum Info. Comput.,
    2005).

.. note::

    When called in the middle of a circuit, the action of the operation is defined
    as :math:`U|0\rangle = |\psi\rangle`

Args:
    state (array[complex] or csr_matrix): the state vector to prepare
    wires (Sequence[int] or int): the wire(s) the operation acts on
    pad_with (float or complex): if not ``None``, ``state`` is padded with this constant to be of size :math:`2^n`, where
        :math:`n` is the number of wires.
    normalize (bool): whether to normalize the state vector. To represent a valid quantum state vector, the L2-norm
        of ``state`` must be one. The argument ``normalize`` can be set to ``True`` to normalize the state automatically.
    id (str): custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified
    validate_norm (bool): whether to validate the norm of the input state


Example:

    StatePrep encodes a normalized :math:`2^n`-dimensional state vector into a state
    of :math:`n` qubits:

    .. code-block:: python

        import pennylane as qp

        dev = qp.device('default.qubit', wires=2)

        @qp.qnode(dev)
        def circuit(state=None):
            qp.StatePrep(state, wires=range(2))
            return qp.expval(qp.Z(0)), qp.state()

        res, state = circuit([1/2, 1/2, 1/2, 1/2])

    The final state of the device is - up to a global phase - equivalent to the input passed to the circuit:

    >>> state
    array([0.5+0.j, 0.5+0.j, 0.5+0.j, 0.5+0.j])

.. details::
    :title: Usage Details

    **Differentiating with respect to the state**

    Due to non-trivial classical processing to construct the state preparation circuit,
    the state argument is, in general, **not differentiable**.

    **Normalization**

    The template will raise an error if the state input is not normalized.
    One can set ``normalize=True`` to automatically normalize it:

    .. code-block:: python

        @qp.qnode(dev)
        def circuit(state=None):
            qp.StatePrep(state, wires=range(2), normalize=True)
            return qp.expval(qp.Z(0)), qp.state()

        res, state = circuit([15, 15, 15, 15])

    >>> state
    array([0.5+0.j, 0.5+0.j, 0.5+0.j, 0.5+0.j])

    **Padding**

    If the dimension of the state vector is smaller than the number of amplitudes,
    one can automatically pad it with a constant for the missing dimensions using the ``pad_with`` option:

    .. code-block:: python

        from math import sqrt

        @qp.qnode(dev)
        def circuit(state=None):
            qp.StatePrep(state, wires=range(2), pad_with=0.)
            return qp.expval(qp.Z(0)), qp.state()

        res, state = circuit([1/sqrt(2), 1/sqrt(2)])

    >>> state
    array([0.70710678+0.j, 0.70710678+0.j, 0.        +0.j, 0.        +0.j])

    **Sparse state input**
    `state` can also be provided as a sparse matrix.  The state will be implicitly
    zero-padded to the full Hilbert space dimension.

    .. code-block:: pycon

        >>> init_state = sp.sparse.csr_matrix([0, 0, 1, 0])
        >>> qsv_op = qp.StatePrep(init_state, wires=[1, 2])
        >>> wire_order = [0, 1, 2]
        >>> ket = qsv_op.state_vector(wire_order=wire_order)
        >>> print(ket)  # Sparse representation
        <Compressed Sparse Row sparse array of dtype 'int64'
            with 1 stored elements and shape (1, 8)>
          Coords    Values
          (0, 2)    1
        >>> print(ket.toarray().flatten())  # Dense representation
        [0 0 1 0 0 0 0 0]

        # Normalization also works with sparse inputs:
        >>> init_state_sparse = sp.sparse.csr_matrix([1, 1, 1, 1]) # Unnormalized
        >>> qsv_op_norm = qp.StatePrep(init_state_sparse, wires=range(2), normalize=True)
        >>> ket_norm = qsv_op_norm.state_vector()
        >>> print(ket_norm.toarray().flatten()) # Normalized dense representation
        [0.5 0.5 0.5 0.5]

### `compute_decomposition`

```python
def compute_decomposition(state: TensorLike, wires: WiresLike, **kwargs) -> list[Operator]
```

Representation of the operator as a product of other operators (static method). :

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.StatePrep.decomposition`.

Args:
    state (array[complex]): a state vector of size 2**len(wires)
    wires (Iterable, Wires): the wire(s) the operation acts on

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> qp.StatePrep.compute_decomposition(np.array([1, 0, 0, 0]), wires=range(2))
[MottonenStatePreparation(array([1, 0, 0, 0]), wires=[0, 1])]

## `QubitDensityMatrix`

```python
class QubitDensityMatrix(Operation)
```

QubitDensityMatrix(state, wires)
Prepare subsystems using the given density matrix.
If not all the wires are specified, remaining dimension is filled by :math:`\mathrm{tr}_{in}(\rho)`,
where :math:`\rho` is the full system density matrix before this operation and :math:`\mathrm{tr}_{in}` is a
partial trace over the subsystem to be replaced by input state.

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 1
* Gradient recipe: None

.. note::

    Exception raised if the ``QubitDensityMatrix`` operation is not supported natively on the
    target device.

Args:
    state (array[complex]): a density matrix of size ``(2**len(wires), 2**len(wires))``
    wires (Sequence[int] or int): the wire(s) the operation acts on
    id (str): custom label given to an operator instance,
        can be useful for some applications where the instance has to be identified.

.. details::
    :title: Usage Details

    Example:

    .. code-block:: python

        import pennylane as qp
        nr_wires = 2
        rho = np.zeros((2 ** nr_wires, 2 ** nr_wires), dtype=np.complex128)
        rho[0, 0] = 1  # initialize the pure state density matrix for the |0><0| state

        dev = qp.device("default.mixed", wires=2)
        @qp.qnode(dev)
        def circuit():
            qp.QubitDensityMatrix(rho, wires=[0, 1])
            return qp.state()

    Running this circuit:

    >>> circuit()
    array([[1.+0.j, 0.+0.j, 0.+0.j, 0.+0.j],
           [0.+0.j, 0.+0.j, 0.+0.j, 0.+0.j],
           [0.+0.j, 0.+0.j, 0.+0.j, 0.+0.j],
           [0.+0.j, 0.+0.j, 0.+0.j, 0.+0.j]])
