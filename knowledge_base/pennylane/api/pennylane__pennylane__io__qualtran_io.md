---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/io/qualtran_io.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/io/qualtran_io.py
license: Apache-2.0
---

## Module `pennylane/io/qualtran_io.py`

This submodule contains the adapter class for Qualtran-PennyLane interoperability.

## `bloq_registers`

```python
def bloq_registers(bloq: 'qt.Bloq')
```

Reads a `Qualtran Bloq <https://qualtran.readthedocs.io/en/latest/bloqs/index.html#bloqs-library>`_
signature and returns a dictionary mapping the Bloq's register names to :class:`~.Wires`.

.. note::
    This function requires the latest version of Qualtran. We recommend installing the latest
    release via ``pip``:

    .. code-block:: console

        pip install qualtran

The keys of the returned dictionary are the register names in the Qualtran Bloq. The
values are :class:`~.Wires` objects with a length equal to the bitsize of its respective
register. The wires are indexed in ascending order, starting from 0.

This function makes it easy to access the wires that a Bloq acts on and use them to precisely
control how gates connect.

Args:
    bloq (Bloq): an initialized Qualtran ``Bloq`` to be wrapped as a PennyLane operator

Returns:
    dict: A dictionary mapping the names of the Bloq's registers to :class:`~.Wires`
    objects with the same lengths as the bitsizes of their respective registers.

Raises:
    TypeError: bloq must be an instance of ``Bloq``.

**Example**

This example shows how to find the estimation wires of a textbook Quantum Phase Estimation Bloq.

>>> from qualtran.bloqs.phase_estimation import RectangularWindowState, TextbookQPE
>>> from qualtran.bloqs.basic_gates import ZPowGate
>>> textbook_qpe_small = TextbookQPE(ZPowGate(exponent=2 * 0.234), RectangularWindowState(3))
>>> qp.bloq_registers(textbook_qpe_small)
{'q': Wires([0]), 'qpe_reg': Wires([1, 2, 3])}

## `FromBloq`

```python
class FromBloq(Operation)
```

An adapter for using a `Qualtran Bloq <https://qualtran.readthedocs.io/en/latest/bloqs/index.html#bloqs-library>`__
as a PennyLane :class:`~.Operation`.

.. note::
    This class requires the latest version of Qualtran. We recommend installing the latest
    release via ``pip``:

    .. code-block:: console

        pip install qualtran

Args:
    bloq (qualtran.Bloq): an initialized Qualtran ``Bloq`` to be wrapped as a PennyLane operator
    wires (WiresLike): The wires the operator acts on. The number of wires can be determined by using the
        signature of the ``Bloq`` using ``bloq.signature.n_qubits()``.

Raises:
    TypeError: bloq must be an instance of ``Bloq``.

**Example**

This example shows how to use ``qp.FromBloq``:

>>> from qualtran.bloqs.basic_gates import CNOT
>>> qualtran_cnot = qp.FromBloq(CNOT(), wires=[0, 1])
>>> qualtran_cnot.matrix()
array([[1.+0.j, 0.+0.j, 0.+0.j, 0.+0.j],
   [0.+0.j, 1.+0.j, 0.+0.j, 0.+0.j],
   [0.+0.j, 0.+0.j, 0.+0.j, 1.+0.j],
   [0.+0.j, 0.+0.j, 1.+0.j, 0.+0.j]])

This example shows how to use ``qp.FromBloq`` inside a device:

>>> from qualtran.bloqs.basic_gates import CNOT
>>> dev = qp.device("default.qubit") # Execute on device
>>> @qp.qnode(dev)
... def circuit():
...     qp.FromBloq(CNOT(), wires=[0, 1])
...     return qp.state()
>>> circuit()
array([1.+0.j, 0.+0.j, 0.+0.j, 0.+0.j])

.. details::
    :title: Advanced Example

    This example shows how to use ``qp.FromBloq`` to implement a textbook Quantum Phase Estimation Bloq inside a device:

    .. code-block::

        from qualtran.bloqs.phase_estimation import RectangularWindowState, TextbookQPE
        from qualtran.bloqs.chemistry.trotter.ising import IsingXUnitary, IsingZZUnitary
        from qualtran.bloqs.chemistry.trotter.trotterized_unitary import TrotterizedUnitary

        # Parameters for the TrotterizedUnitary
        nsites = 5
        j_zz, gamma_x = 2, 0.1
        zz_bloq = IsingZZUnitary(nsites=nsites, angle=0.02 * j_zz)
        x_bloq = IsingXUnitary(nsites=nsites, angle=0.01 * gamma_x)
        trott_unitary = TrotterizedUnitary(
            bloqs=(x_bloq, zz_bloq),  timestep=0.01,
            indices=(0, 1, 0), coeffs=(0.5 * gamma_x, j_zz, 0.5 * gamma_x)
        )

        # Instantiate the TextbookQPE and pass in the unitary
        textbook_qpe = TextbookQPE(trott_unitary, RectangularWindowState(3))

        # Execute on device
        dev = qp.device("default.qubit")
        @qp.qnode(dev)
        def circuit():
            qp.FromBloq(textbook_qpe, wires=range(textbook_qpe.signature.n_qubits()))
            return qp.probs(wires=[5, 6, 7])

        circuit()

.. details::
    :title: Usage Details

    The decomposition of a ``Bloq`` wrapped in ``qp.FromBloq`` may use more wires than expected.
    For example, when we wrap Qualtran's ``CZPowGate``, we get

    >>> from qualtran.bloqs.basic_gates import CZPowGate
    >>> qp.FromBloq(CZPowGate(0.468, eps=1e-11), wires=[0, 1]).decomposition()
    [FromBloq(And, wires=Wires([0, 1, 'alloc_free_2'])),
    FromBloq(Z**0.468, wires=Wires(['alloc_free_2'])),
    FromBloq(And†, wires=Wires([0, 1, 'alloc_free_2']))]

    This behaviour results from the decomposition of ``CZPowGate`` as defined in Qualtran,
    which allocates and frees a wire in the same ``bloq``. In this situation,
    PennyLane automatically allocates this wire under the hood, and that additional wire is
    named ``alloc_free_{idx}``. The indexing starts at the length of the wires defined in the
    signature, which in the case of ``CZPowGate`` is :math:`2`. Due to the current
    limitations of PennyLane, these wires cannot be accessed manually or mapped.

### `has_matrix`

```python
def has_matrix(self) -> bool
```

Return if the ``Bloq`` has a valid matrix representation.

## `ToBloq`

```python
class ToBloq(Bloq)
```

An adapter to convert a PennyLane :class:`~.QNode`, ``Qfunc``, or :class:`~.Operation` to a
`Qualtran Bloq <https://qualtran.readthedocs.io/en/latest/bloqs/index.html#bloqs-library>`__.

.. note::
    This class requires the latest version of Qualtran. We recommend installing the latest
    release via ``pip``:

    .. code-block:: console

        pip install qualtran

Args:
    op (QNode| Qfunc | Operation): a PennyLane ``QNode``, ``Qfunc``, or operator to be wrapped
        as a Qualtran Bloq.
    map_ops (bool): Whether to map operations to a Qualtran Bloq. Operations are wrapped
        as a ``ToBloq`` when ``False``. Default is ``True``.
    custom_mapping (dict | None): Dictionary to specify a mapping between a PennyLane operator and a
        Qualtran Bloq. A default mapping is used if not defined.
    call_graph (str): Specifies how to build the call graph. If ``'estimator'``, the call
        graph is built using the resource functionality of the :mod:`~.estimator` module. If ``'decomposition'``, the
        call graph is built via the PennyLane decomposition. Default is ``'estimator'``.

Raises:
    TypeError: ``op`` must be an instance of :class:`~.Operation`, :class:`~.QNode`, or a quantum function.
    ValueError: If ``call_graph`` is not ``'estimator'`` or ``'decomposition'``.

.. seealso:: :func:`~.to_bloq` for the recommended way to convert from PennyLane objects to
    their Qualtran equivalents

**Example**

This example shows how to use ``qp.ToBloq``:

>>> from qualtran.resource_counting.generalizers import generalize_rotation_angle
>>> op = qp.QuantumPhaseEstimation(
...     qp.RX(0.2, wires=[0]), estimation_wires=[1, 2]
... )
>>> op_as_bloq = qp.ToBloq(op)
>>> graph, sigma = op_as_bloq.call_graph(generalize_rotation_angle)
>>> sigma
{Hadamard(): 4,
Controlled(subbloq=Rx(angle=0.2, eps=1e-11), ctrl_spec=CtrlSpec(qdtypes=(QBit(),), cvs=(array(1),))): 3,
TwoBitSwap(): 1,
CNOT(): 2,
ZPowGate(exponent=\phi, eps=5e-12): 2,
ZPowGate(exponent=\phi, eps=1e-11): 1}

### `signature`

```python
def signature(self) -> 'qt.Signature'
```

Compute and return Qualtran signature for given op or QNode.

### `decompose_bloq`

```python
def decompose_bloq(self)
```

Decompose the bloq using the op's decomposition or the tape of the QNode

### `build_call_graph`

```python
def build_call_graph(self, ssa)
```

Build Qualtran call graph for this Bloq.

The call graph is built based on the ``call_graph_mode`` specified at initialization:

- ``'estimator'``: Uses :func:`~pennylane.estimator.estimate` to get gate counts.
- ``'decomposition'``: Builds the call graph via the PennyLane decomposition.

## `to_bloq`

```python
def to_bloq(circuit, map_ops: bool=True, custom_mapping: dict=None, call_graph='estimator', **kwargs)
```

Converts a PennyLane :class:`~.QNode`, ``Qfunc``, or :class:`~.Operation` to the corresponding `Qualtran Bloq <https://qualtran.readthedocs.io/en/latest/bloqs/index.html#bloqs-library>`__.

.. note::
    This class requires the latest version of Qualtran. We recommend installing the latest
    release via ``pip``:

    .. code-block:: console

        pip install qualtran

Args:
    circuit (QNode| Qfunc | Operation): a PennyLane ``QNode``, ``Qfunc``, or operator to be wrapped
        as a Qualtran Bloq.
    map_ops (bool): Whether to map operations to a Qualtran Bloq. Operations are wrapped
        as a ``ToBloq`` when ``False``. Default is ``True``.
    custom_mapping (dict | None): Dictionary to specify a mapping between a PennyLane operator and a
        Qualtran Bloq. A default mapping is used if not defined.
    call_graph (str): Specifies how to build the call graph. If ``'estimator'``, the call
        graph is built using the resource functionality of the :mod:`~.estimator` module. If ``'decomposition'``, the
        call graph is built via the PennyLane decomposition. Default is ``'estimator'``.

Returns:
    Bloq: The Qualtran Bloq that corresponds to the given circuit or :class:`~.Operation` and
    options.

Raises:
    ValueError: If ``call_graph`` is not ``'estimator'`` or ``'decomposition'``.

.. seealso:: :class:`~.ToBloq` for the Bloq objects created when no Qualtran equivalent is found

**Example**

This example shows how to use ``qp.to_bloq``:

>>> from qualtran.resource_counting.generalizers import generalize_rotation_angle
>>> op = qp.QuantumPhaseEstimation(
...     qp.RX(0.2, wires=[0]), estimation_wires=[1, 2]
... )
>>> op_as_bloq = qp.to_bloq(op)
>>> graph, sigma = op_as_bloq.call_graph(generalize_rotation_angle)
>>> sigma
{Allocate(dtype=QFxp(bitsize=2, num_frac=2, signed=False), dirty=False): 1,
Hadamard(): 4,
Controlled(subbloq=Rx(angle=0.2, eps=1e-11), ctrl_spec=CtrlSpec(qdtypes=(QBit(),), cvs=(array(1),))): 3,
And(cv1=1, cv2=1, uncompute=True): 1,
And(cv1=1, cv2=1, uncompute=False): 1,
ZPowGate(exponent=\phi, eps=1e-10): 1,
TwoBitSwap(): 1}

.. details::
    :title: Usage Details

    Some PennyLane operators don't have a direct equivalent in Qualtran. For example, in Qualtran, there
    are many varieties of Quantum Phase Estimation. When ``qp.to_bloq`` is called on
    :class:`~pennylane.QuantumPhaseEstimation`, a smart default is chosen.

    >>> qp.to_bloq(qp.QuantumPhaseEstimation(
    ...     unitary=qp.RX(0.1, wires=0), estimation_wires=range(1, 5)
    ... ))
    TextbookQPE(unitary=Rx(angle=0.1, eps=1e-11), ctrl_state_prep=RectangularWindowState(bitsize=4), qft_inv=Adjoint(subbloq=QFTTextBook(bitsize=4, with_reverse=True)))

    Note that the chosen Qualtran Bloq may not be an exact equivalent. If an exact
    equivalent is needed, we recommend setting ``map_ops`` to ``False``.
    This will wrap the input PennyLane operator as a Qualtran Bloq, enabling Qualtran functions
    such as ``decompose_bloq`` or ``call_graph``. To toggle between seeing the decompositions
    from PennyLane or from the :mod:`~.estimator` module, set ``call_graph`` to either
    ``'decomposition'`` or ``'estimator'`` respectively.

    >>> qp.to_bloq(qp.QuantumPhaseEstimation(
    ...     unitary=qp.RX(0.1, wires=0), estimation_wires=range(1, 5)
    ... ), map_ops=False)
    ToBloq(QuantumPhaseEstimation)


    Alternatively, users can provide a custom mapping that maps a PennyLane operator to a
    specific Qualtran Bloq. It is recommended to map operators at the high level, rather than
    attempt to map operators that appear in the operator's decomposition.

    >>> from qualtran.bloqs.phase_estimation import TextbookQPE
    >>> from qualtran.bloqs.phase_estimation.lp_resource_state import LPResourceState
    >>> op = qp.QuantumPhaseEstimation(
    ...         unitary=qp.RX(0.1, wires=0), estimation_wires=range(1, 5)
    ...     )
    >>> custom_mapping = {
    ...     op : TextbookQPE(
    ...         unitary=qp.to_bloq(qp.RX(0.1, wires=0)),
    ...         ctrl_state_prep=LPResourceState(4),
    ...     )
    ... }
    >>> qp.to_bloq(op, custom_mapping=custom_mapping)
    TextbookQPE(unitary=Rx(angle=0.1, eps=1e-11), ctrl_state_prep=LPResourceState(bitsize=4), qft_inv=Adjoint(subbloq=QFTTextBook(bitsize=4, with_reverse=True)))
