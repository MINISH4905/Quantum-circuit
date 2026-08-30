---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/gradients/metric_tensor.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/gradients/metric_tensor.py
license: Apache-2.0
---

## Module `pennylane/gradients/metric_tensor.py`

Contains the metric_tensor batch_transform which wraps multiple
methods of computing the metric tensor.

## `metric_tensor`

```python
def metric_tensor(tape: QuantumScript, argnum=None, approx=None, allow_nonunitary=True, aux_wire=None, device_wires=None) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Returns a function that computes the metric tensor of a given QNode or quantum tape.

The metric tensor convention we employ here has the following form:

.. math::

    \text{metric_tensor}_{i, j} = \text{Re}\left[ \langle \partial_i \psi(\bm{\theta}) | \partial_j \psi(\bm{\theta}) \rangle
    - \langle \partial_i \psi(\bm{\theta}) | \psi(\bm{\theta}) \rangle \langle \psi(\bm{\theta}) | \partial_j \psi(\bm{\theta}) \rangle \right]

with short notation :math:`| \partial_j \psi(\bm{\theta}) \rangle := \frac{\partial}{\partial \theta_j}| \psi(\bm{\theta}) \rangle`.
It is closely related to the quantum fisher information matrix, see :func:`~.pennylane.gradients.quantum_fisher` and eq. (27) in `arxiv:2103.15191 <https://arxiv.org/abs/2103.15191>`_.


.. note::

    Only gates that have a single parameter and define a ``generator`` are supported.
    All other parametrized gates will be decomposed if possible.

    The ``generator`` of all parametrized operations, with respect to which the
    tensor is computed, are assumed to be Hermitian.
    This is the case for unitary single-parameter operations.

Args:
    tape (QNode or QuantumTape): quantum circuit to find the metric tensor of
    argnum (int or Sequence[int] or None): Trainable tape-parameter indices with respect to which
        the metric tensor is computed. If ``argnum=None``, the metric tensor with respect to all
        trainable parameters is returned. Excluding tape-parameter indices from this list reduces
        the computational cost and the corresponding metric-tensor elements will be set to 0.

    approx (str): Which approximation of the metric tensor to compute.

        - If ``None``, the full metric tensor is computed

        - If ``"block-diag"``, the block-diagonal approximation is computed, reducing
          the number of evaluated circuits significantly.

        - If ``"diag"``, only the diagonal approximation is computed, slightly
          reducing the classical overhead but not the quantum resources
          (compared to ``"block-diag"``).

    allow_nonunitary (bool): Whether non-unitary operations are allowed in circuits
        created by the transform. Only relevant if ``approx`` is ``None``.
        Should be set to ``True`` if possible to reduce cost.
    aux_wire (None or int or str or Sequence or pennylane.wires.Wires): Auxiliary wire to
        be used for Hadamard tests. If ``None`` (the default), a suitable wire is inferred
        from the (number of) used wires in the original circuit and ``device_wires``,
        if the latter are given.
    device_wires (.wires.Wires): Wires of the device that is going to be used for the
        metric tensor. Facilitates finding a default for ``aux_wire`` if ``aux_wire``
        is ``None``.
    hybrid (bool): Specifies whether classical processing inside a QNode
        should be taken into account when transforming a QNode.

        - If ``True``, and classical processing is detected, the Jacobian of the classical
          processing will be computed and included. When evaluated, the
          returned metric tensor will be with respect to the QNode arguments.
          The output shape can vary widely.

        - If ``False``, any internal QNode classical processing will be
          **ignored**. When evaluated, the returned metric tensor will be with
          respect to the **gate** arguments, and not the QNode arguments.
          The output shape is a single two-dimensional tensor.

Returns:
    qnode (QNode) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will provide the metric tensor in the form of a tensor.

The block-diagonal part of the metric tensor always is computed using the
covariance-based approach. If no approximation is selected,
the off block-diagonal is computed using Hadamard tests.

.. warning::

    Performing the Hadamard tests requires a device
    that has an additional wire as compared to the wires on which the
    original circuit was defined. This wire may be specified via ``aux_wire``.
    The available wires on the device may be specified via ``device_wires``.

    By default (that is, if ``device_wires=None`` ), contiguous wire
    numbering and usage is assumed and the additional
    wire is set to the next wire of the device after the circuit wires.

    If the given or inferred ``aux_wire`` does not exist on the device,
    a warning is raised and the block-diagonal approximation is computed instead.
    It is significantly cheaper in this case to explicitly set ``approx="block-diag"`` .

.. note::

    When used with Catalyst, the classical component of the circuit is not included.
    This matches the results of setting ``hybrid=False``.

    For example,

    >>> from jax import numpy as jnp
    >>> @qp.qnode(qp.device('lightning.qubit', wires=4))
    ... def c(x, y):
    ...     qp.RX(2*x, 0)
    ...     qp.RY(y, 0)
    ...     return qp.expval(qp.Z(0))
    ...
    >>> qp.qjit(qp.metric_tensor(c))(jnp.array(0.5), jnp.array(0.6))
    Array([[0.25      , 0.        ],
            [0.        , 0.07298165]], dtype=float64)
    >>> qp.metric_tensor(c, argnums=(0,1))(jnp.array(0.5), jnp.array(0.6))
    (Array(1., dtype=float64), Array(0.07298165, dtype=float64))
    >>> qp.metric_tensor(c, hybrid=False)(qp.numpy.array(0.5), qp.numpy.array(0.6))
    array([[0.25      , 0.        ],
            [0.        , 0.07298165]])

    Here you can see that the ``qjit`` and ``hybrid=False`` options did not postprocess
    the metric tensor to match the shape of the arguments, and they do not include the factor
    of ``4`` from the derivative of ``2*x``.


The flag ``allow_nonunitary`` should be set to ``True`` whenever the device with
which the metric tensor is computed supports non-unitary operations.
This will avoid additional decompositions of gates, in turn avoiding a potentially
large number of additional Hadamard test circuits to be run.
State vector simulators, for example, often allow applying operations that are
not unitary.
On a real QPU, setting this flag to ``True`` may cause exceptions because the
computation of the metric tensor will request invalid operations on a quantum
device.

**Example**

Consider the following QNode:

.. code-block:: python

    dev = qp.device("default.qubit", wires=3)

    @qp.qnode(dev, interface="autograd")
    def circuit(weights):
        qp.RX(weights[0], wires=0)
        qp.RY(weights[1], wires=0)
        qp.CNOT(wires=[0, 1])
        qp.RZ(weights[2], wires=1)
        qp.RZ(weights[3], wires=0)
        return qp.expval(qp.Z(0) @ qp.Z(1)), qp.expval(qp.Y(1))

We can use the ``metric_tensor`` transform to generate a new function that returns the
metric tensor of this QNode:

>>> mt_fn = qp.metric_tensor(circuit)
>>> weights = np.array([0.1, 0.2, 0.4, 0.5], requires_grad=True)
>>> mt_fn(weights)
tensor([[ 0.25  ,  0.    , -0.0497, -0.0497],
        [ 0.    ,  0.2475,  0.0243,  0.0243],
        [-0.0497,  0.0243,  0.0123,  0.0123],
        [-0.0497,  0.0243,  0.0123,  0.0123]], requires_grad=True)

In order to save cost, one might want to compute only the block-diagonal part of
the metric tensor, which requires significantly fewer executions of quantum functions
and does not need an auxiliary wire on the device. This can be done using the
``approx`` keyword:

>>> mt_fn = qp.metric_tensor(circuit, approx="block-diag")
>>> weights = np.array([0.1, 0.2, 0.4, 0.5], requires_grad=True)
>>> mt_fn(weights)
tensor([[0.25  , 0.    , 0.    , 0.    ],
        [0.    , 0.2475, 0.    , 0.    ],
        [0.    , 0.    , 0.0123, 0.0123],
        [0.    , 0.    , 0.0123, 0.0123]], requires_grad=True)

These blocks are given by parameter groups that belong to groups of commuting gates.

The tensor can be further restricted to the diagonal via ``approx="diag"``. However,
this will not save further quantum function evolutions but only classical postprocessing.

The returned metric tensor is also fully differentiable in all interfaces.
For example, we can compute the gradient of the Frobenius norm of the metric tensor
with respect to the QNode ``weights`` :

>>> norm_fn = lambda x: qp.math.linalg.norm(mt_fn(x), ord="fro")
>>> grad_fn = qp.grad(norm_fn)
>>> grad_fn(weights)
array([-0.0282246 ,  0.01340413,  0.        ,  0.        ])

.. details::
    :title: Usage Details

    This transform can also be applied to low-level
    :class:`~.QuantumTape` objects. This will result in no implicit quantum
    device evaluation. Instead, the processed tapes, and post-processing
    function, which together define the metric tensor are directly returned:

    >>> params = np.array([1.7, 1.0, 0.5], requires_grad=True)
    >>> ops = [
    ...     qp.RX(params[0], wires=0),
    ...     qp.RY(params[1], wires=0),
    ...     qp.CNOT(wires=(0,1)),
    ...     qp.PhaseShift(params[2], wires=1),
    ...     ]
    >>> measurements = [qp.expval(qp.X(0))]
    >>> tape = qp.tape.QuantumTape(ops, measurements)
    >>> tapes, fn = qp.metric_tensor(tape)
    >>> tapes
    [<QuantumTape: wires=[0, 1], params=0>,
     <QuantumTape: wires=[0, 1], params=1>,
     <QuantumTape: wires=[0, 1], params=3>,
     <QuantumTape: wires=[2, 0], params=1>,
     <QuantumTape: wires=[2, 0, 1], params=2>,
     <QuantumTape: wires=[2, 0, 1], params=2>]

    This can be useful if the underlying circuits representing the metric tensor
    computation need to be analyzed. We clearly can distinguish the first three
    tapes used for the block-diagonal from the last three tapes that use the
    auxiliary wire ``2`` , which was not used by the original tape.

    The output tapes can then be evaluated and post-processed to retrieve
    the metric tensor:

    >>> dev = qp.device("default.qubit", wires=3)
    >>> fn(qp.execute(tapes, dev, None))
    tensor([[ 0.25      ,  0.        ,  0.42073549],
            [ 0.        ,  0.00415023, -0.26517488],
            [ 0.42073549, -0.26517488,  0.24878844]], requires_grad=True)

    The first term of the off block-diagonal entries of the full metric tensor are
    computed with Hadamard tests. This first term reads

    .. math ::

        \mathfrak{Re}\left\{\langle \partial_i\psi|\partial_j\psi\rangle\right\}

    and can be computed using an augmented circuit with an additional qubit.
    See for example the appendix of `McArdle et al. (2019) <https://doi.org/10.1038/s41534-019-0187-2>`__
    for details.
    The block-diagonal of the tensor is computed using the covariance matrix approach.

    In addition, we may extract the factors for the second terms
    :math:`\langle \psi|\partial_j\psi\rangle`
    of the *off block-diagonal* tensor from the quantum function output for the covariance matrix!

    This means that in total only the tapes for the first terms of the off block-diagonal
    are required in addition to the circuits for the block diagonal.

    .. warning::

        The ``argnum`` argument can be used to restrict the parameters which are taken into account
        for computing the metric tensor.
        When the metric tensor of a QNode is computed, the ordering of the parameters has to be
        specified as they appear in the corresponding QuantumTape.

    **Example**

    Consider the following QNode in which parameters are used out of order:

    .. code-block:: python

        dev = qp.device("default.qubit")
        @qp.qnode(dev, interface="autograd")
        def circuit(weights):
            qp.RX(weights[1], wires=0)
            qp.RY(weights[0], wires=0)
            qp.CNOT(wires=[0, 1])
            qp.RZ(weights[2], wires=1)
            qp.RZ(weights[3], wires=0)
            return qp.expval(qp.Z(0))

        weights = np.array([0.1, 0.2, 0.4, 0.5], requires_grad=True)
        mt = qp.metric_tensor(circuit, argnum=(0, 2, 3))(weights)

    >>> print(mt)
    [[ 0.          0.          0.          0.        ]
     [ 0.          0.25       -0.02495835 -0.02495835]
     [ 0.         -0.02495835  0.01226071  0.01226071]
     [ 0.         -0.02495835  0.01226071  0.01226071]]

    Because the 0-th element of ``weights`` appears second in the QNode and therefore in the
    underlying tape, it is the 1st tape parameter.
    By setting ``argnum = (0, 2, 3)`` we exclude the 0-th element of ``weights`` from the computation
    of the metric tensor and not the 1st element, as one might expect.

## `qnode_execution_wrapper`

```python
def qnode_execution_wrapper(self, qnode, targs, tkwargs)
```

Here, we overwrite the QNode execution wrapper in order
to take into account that classical processing may be present
inside the QNode.
