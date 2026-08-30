---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/state_preparations/state_prep_mps.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/state_preparations/state_prep_mps.py
license: Apache-2.0
---

## Module `pennylane/templates/state_preparations/state_prep_mps.py`

Contains the MPSPrep template.

## `right_canonicalize_mps`

```python
def right_canonicalize_mps(mps)
```

Transform a matrix product state (MPS) into its right-canonical form.

A right-canonicalized MPS is a matrix product state in which the constituent tensors, :math:`A^{(j)}`, satisfy
the following orthonormality condition [Eq. (21) of `arXiv:2310.18410 <https://arxiv.org/pdf/2310.18410>`_]:

.. math::

    \sum_{d_{j,1}, d_{j,2}} A^{(j)}_{d_{j, 0}, d_{j, 1}, d_{j, 2}} \left( A^{(j)}_{d'_{j, 0}, d_{j, 1}, d_{j, 2}} \right)^* = \delta_{d_{j, 0}, d'_{j, 0}},

where :math:`d_{i,j}` denotes the :math:`j` dimension of the :math:`i` tensor and :math:`\delta` is the Kronecker delta.


Args:
    mps (list[TensorLike]): List of tensors representing the MPS.

Returns:
    List of tensors representing the MPS in right-canonical form with the same dimensions as the initial MPS.

.. seealso:: :class:`~.MPSPrep`.

**Example**

.. code-block::

    n_sites = 4

    import numpy as np

    mps = ([np.ones((2, 4))] +
           [np.ones((4, 2, 4)) for _ in range(1, n_sites - 1)] +
           [np.ones((4, 2))])

    mps_rc = qp.right_canonicalize_mps(mps)

    # Check that the right-canonical definition is fulfilled
    for i in range(1, n_sites - 1):
        tensor = mps_rc[i]
        contraction_matrix = np.tensordot(tensor, tensor.conj(), axes=([1, 2], [1, 2]))
        assert np.allclose(contraction_matrix, np.eye(tensor.shape[0]))

.. details::
    :title: Usage Details

    The input MPS must be a list of :math:`n` tensors :math:`[A^{(0)}, ..., A^{(n-1)}]`
    with shapes :math:`d_0, ..., d_{n-1}`, respectively. The first and last tensors have rank :math:`2`
    while the intermediate tensors have rank :math:`3`.

    The first tensor must have the shape :math:`d_0 = (d_{0,0}, d_{0,1})` where :math:`d_{0,0}`
    and :math:`d_{0,1}`  correspond to the physical dimension of the site and an auxiliary bond
    dimension connecting it to the next tensor, respectively.

    The last tensor must have the shape :math:`d_{n-1} = (d_{n-1,0}, d_{n-1,1})` where :math:`d_{n-1,0}`
    and :math:`d_{n-1,1}` represent the auxiliary dimension from the previous site and the physical
    dimension of the site, respectively.

    The intermediate tensors must have the shape :math:`d_j = (d_{j,0}, d_{j,1}, d_{j,2})`, where:

    - :math:`d_{j,0}` is the bond dimension connecting to the previous tensor
    - :math:`d_{j,1}` is the physical dimension of the site
    - :math:`d_{j,2}` is the bond dimension connecting to the next tensor

    Note that the bond dimensions must match between adjacent tensors such that :math:`d_{j-1,2} = d_{j,0}`.

    Additionally, the physical dimension of the site should always be fixed at :math:`2`
    (since the dimension of a qubit is :math:`2`), while the other dimensions must be powers of two.

    The following example shows a valid MPS input containing four tensors with
    dimensions :math:`[(2,2), (2,2,4), (4,2,2), (2,2)]` which satisfy the criteria described above.

    .. code-block::

        mps = [
            np.array([[0.0, 0.107], [0.994, 0.0]]),
            np.array(
                [
                    [[0.0, 0.0, 0.0, -0.0], [1.0, 0.0, 0.0, -0.0]],
                    [[0.0, 1.0, 0.0, -0.0], [0.0, 0.0, 0.0, -0.0]],
                ]
            ),
            np.array(
                [
                    [[-1.0, 0.0], [0.0, 0.0]],
                    [[0.0, 0.0], [0.0, 1.0]],
                    [[0.0, -1.0], [0.0, 0.0]],
                    [[0.0, 0.0], [1.0, 0.0]],
                ]
            ),
            np.array([[-1.0, -0.0], [-0.0, -1.0]]),
        ]

## `MPSPrep`

```python
class MPSPrep(Operation)
```

Prepares an initial state from a matrix product state (MPS) representation.

.. note::

    This operator is natively supported on the ``lightning.tensor`` device, which is designed to run MPS
    structures efficiently. For other devices, this operation prepares the state vector represented by the
    MPS using a gate-based decomposition from Eq. (23) in `arXiv:2310.18410
    <https://arxiv.org/pdf/2310.18410>`_, which requires the right canonicalization of the MPS using
    the :func:`~.right_canonicalize_mps` function and defining auxiliary qubits with ``work_wires``.

Args:
    mps (list[TensorLike]):  list of arrays of rank-3 and rank-2 tensors representing an MPS state
        as a product of site matrices. See the usage details section for more information.

    wires (Sequence[int]): wires that the template acts on. It should match the number of MPS tensors.
    work_wires (Sequence[int]): list of extra qubits needed in the decomposition. If the maximum dimension
        of the MPS tensors is :math:`2^k`, then :math:`k` ``work_wires`` will be needed. If no ``work_wires`` are given,
        this operator can only be executed on the ``lightning.tensor`` device. Default is ``None``.

    right_canonicalize (bool): indicates whether a conversion to right-canonical form should be performed to the MPS.
        Default is ``False``.


.. seealso:: :func:`~.right_canonicalize_mps`.

**Example**

Example using the ``lightning.tensor`` device:

.. code-block:: python

    mps = [
        np.array([[0.0, 0.107], [0.994, 0.0]]),
        np.array(
            [
                [[0.0, 0.0], [1.0, 0.0]],
                [[0.0, 1.0], [0.0, 0.0]],
            ]
        ),
        np.array([[-1.0, -0.0], [-0.0, -1.0]]),
    ]

.. code-block::

    dev = qp.device("lightning.tensor", wires=3)
    @qp.qnode(dev)
    def circuit():
        qp.MPSPrep(mps, wires = [0,1,2])
        return qp.state()

>>> print(circuit()) # doctest: +SKIP
[ 0.        +0.j -0.10705513+0.j  0.        +0.j  0.        +0.j
0.        +0.j  0.        +0.j -0.99451217+0.j  0.        +0.j]

Example using the ``default.qubit`` device:

.. code-block:: python

    dev = qp.device("default.qubit", wires=4)
    @qp.qnode(dev)
    def circuit():
        qp.MPSPrep(mps, wires = [1,2,3], work_wires = [0])
        return qp.state()

>>> print(circuit()[:8]) # doctest: +SKIP
[ 0.        +0.j -0.10702756+0.j  0.        +0.j  0.        +0.j
  0.        +0.j  0.        +0.j -0.99425605+0.j  0.        +0.j]

.. details::
    :title: Usage Details

    The input MPS must be a list of :math:`n` tensors :math:`[A^{(0)}, ..., A^{(n-1)}]`
    with shapes :math:`d_0, ..., d_{n-1}`, respectively. The first and last tensors have rank :math:`2`
    while the intermediate tensors have rank :math:`3`.

    The first tensor must have the shape :math:`d_0 = (d_{0,0}, d_{0,1})` where :math:`d_{0,0}`
    and :math:`d_{0,1}`  correspond to the physical dimension of the site and an auxiliary bond
    dimension connecting it to the next tensor, respectively.

    The last tensor must have the shape :math:`d_{n-1} = (d_{n-1,0}, d_{n-1,1})` where :math:`d_{n-1,0}`
    and :math:`d_{n-1,1}` represent the auxiliary dimension from the previous site and the physical
    dimension of the site, respectively.

    The intermediate tensors must have the shape :math:`d_j = (d_{j,0}, d_{j,1}, d_{j,2})`, where:

    - :math:`d_{j,0}` is the bond dimension connecting to the previous tensor
    - :math:`d_{j,1}` is the physical dimension of the site
    - :math:`d_{j,2}` is the bond dimension connecting to the next tensor

    Note that the bond dimensions must match between adjacent tensors such that :math:`d_{j-1,2} = d_{j,0}`.

    Additionally, the physical dimension of the site should always be fixed at :math:`2`
    (since the dimension of a qubit is :math:`2`), while the other dimensions must be powers of two.

    The following example shows a valid MPS input containing four tensors with
    dimensions :math:`[(2,2), (2,2,4), (4,2,2), (2,2)]` which satisfy the criteria described above.

    .. code-block::

        mps = [
            np.array([[0.0, 0.107], [0.994, 0.0]]),
            np.array(
                [
                    [[0.0, 0.0, 0.0, -0.0], [1.0, 0.0, 0.0, -0.0]],
                    [[0.0, 1.0, 0.0, -0.0], [0.0, 0.0, 0.0, -0.0]],
                ]
            ),
            np.array(
                [
                    [[-1.0, 0.0], [0.0, 0.0]],
                    [[0.0, 0.0], [0.0, 1.0]],
                    [[0.0, -1.0], [0.0, 0.0]],
                    [[0.0, 0.0], [1.0, 0.0]],
                ]
            ),
            np.array([[-1.0, -0.0], [-0.0, -1.0]]),
        ]

### `mps`

```python
def mps(self)
```

list representing the MPS input

### `compute_decomposition`

```python
def compute_decomposition(mps, wires, work_wires, right_canonicalize=False)
```

Representation of the operator as a product of other operators.
The decomposition follows Eq. (23) in `arXiv:2310.18410 <https://arxiv.org/pdf/2310.18410>`_.

Args:
    mps (list[Array]):  list of arrays of rank-3 and rank-2 tensors representing an MPS state as a
        product of site matrices.

    wires (Sequence[int]): wires that the template acts on. It should match the number of MPS tensors.
    work_wires (Sequence[int]): list of extra qubits needed in the decomposition. If the maximum dimension
        of the MPS tensors is ``2^k``, then k ``work_wires`` will be needed. If no ``work_wires`` are given,
        this operator can only be executed on the ``lightning.tensor`` device. Default is ``None``.

    right_canonicalize (bool): Indicates whether a conversion to right-canonical form should be performed
        to the mps. Default is ``False``.

Returns:
    list[.Operator]: Decomposition of the operator
