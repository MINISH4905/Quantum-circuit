---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/gradients/hadamard_gradient.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/gradients/hadamard_gradient.py
license: Apache-2.0
---

## Module `pennylane/gradients/hadamard_gradient.py`

This module contains functions for computing the Hadamard-test gradient
of a qubit-based quantum tape.

## `hadamard_grad`

```python
def hadamard_grad(tape: QuantumScript, argnum=None, aux_wire=None, device_wires=None, mode: Literal['standard', 'reversed', 'direct', 'reversed-direct', 'auto']='standard') -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Transform a circuit to compute the Hadamard test gradient of all gates
with respect to their inputs.

.. warning::
    Providing a value of ``None`` to ``aux_wire`` of ``qp.gradients.hadamard_grad`` with ``mode="reversed"``
    or ``mode="standard"`` has been deprecated and will no longer be supported in 0.46. An ``aux_wire`` will
    no longer be automatically assigned.

Args:
    tape (QNode or QuantumTape): quantum circuit to differentiate
    argnum (int or list[int] or None): Trainable tape parameter indices to differentiate
        with respect to. If not provided, the derivatives with respect to all
        trainable parameters are returned. Note that the indices are with respect to
        the list of trainable parameters.
    aux_wire (pennylane.wires.Wires or None): Auxiliary wire to be used for the Hadamard tests.
        If ``None`` (the default) and ``mode`` is "standard" or "reversed", a suitable wire
        is inferred from the wires used in the original circuit and ``device_wires``.
    device_wires (pennylane.wires.Wires): Wires of the device that are going to be used for the
        gradient. Facilitates finding a default for ``aux_wire`` if ``aux_wire`` is ``None``.
    mode (str): Specifies the gradient computation mode. Accepted values are
        ``"standard"``, ``"reversed"``, ``"direct"``, ``"reversed-direct"``, or ``"auto"``. Defaults to ``"standard"``.
        The ``"auto"`` mode chooses the method that leads to the
        fewest total executions, based on the circuit observable and whether or not an
        auxiliary wire has been provided.

Returns:
    qnode (QNode) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.
    Executing this circuit will provide the Jacobian in the form of a tensor, a tuple, or a
    nested tuple depending upon the nesting structure of measurements in the original circuit.

For a variational evolution :math:`U(\mathbf{p}) \vert 0\rangle` with :math:`N` parameters
:math:`\mathbf{p}`, consider the expectation value of an observable :math:`O`:

.. math::

    f(\mathbf{p})  = \langle \hat{O} \rangle(\mathbf{p}) = \langle 0 \vert
    U(\mathbf{p})^\dagger \hat{O} U(\mathbf{p}) \vert 0\rangle.


The gradient of this expectation value can be calculated via the Hadamard test gradient:

.. math::

    \frac{\partial f}{\partial \mathbf{p}} = -2 \Im[\bra{0} \hat{O} G \ket{0}] = i \left(\bra{0} \hat{O} G \ket{
    0} - \bra{0} G\hat{O} \ket{0}\right) = -2 \bra{+}\bra{0} \texttt{ctrl}\left(G^{\dagger}\right) (\hat{Y} \otimes \hat{O}) \texttt{ctrl}\left(G\right)
    \ket{+}\ket{0}

Here, :math:`G` is the generator of the unitary :math:`U`. ``hadamard_grad`` will work on any :math:`U` so long
as it has a generator :math:`G` defined (i.e., ``op.has_generator == True``). Otherwise, it will try to decompose
into gates where this is satisfied.

**Example**

This transform can be registered directly as the quantum gradient transform
to use during autodifferentiation:

>>> import jax
>>> dev = qp.device("default.qubit")
>>> @qp.qnode(dev, diff_method="hadamard", gradient_kwargs={"mode": "standard", "aux_wire": 1})
... def circuit(params):
...     qp.RX(params[0], wires=0)
...     qp.RY(params[1], wires=0)
...     qp.RX(params[2], wires=0)
...     return qp.expval(qp.Z(0)), qp.probs(wires=0)
>>> params = jax.numpy.array([0.1, 0.2, 0.3])
>>> jax.jacobian(circuit)(params)
(Array([-0.3875172 , -0.18884787, -0.38355705], dtype=float64), Array([[-0.1937586 , -0.09442393, -0.19177853],
       [ 0.1937586 ,  0.09442393,  0.19177853]], dtype=float64))

.. details::
    :title: Usage Details

    This gradient method can work with any operator that has a generator:

    .. code-block:: pycon

        >>> dev = qp.device('default.qubit')
        >>> @qp.qnode(dev)
        ... def circuit(x):
        ...     qp.evolve(qp.X(0) @ qp.X(1) + qp.Z(0) @ qp.Z(1) + qp.H(0), x )
        ...     return qp.expval(qp.Z(0))
        ...
        >>> print( qp.draw(qp.gradients.hadamard_grad(circuit, aux_wire=2))(qp.numpy.array(0.5)) )
        0: ─╭Exp(-0.50j 𝓗)─╭X────┤ ╭<Z@Y>
        1: ─╰Exp(-0.50j 𝓗)─│─────┤ │
        2: ──H─────────────╰●──H─┤ ╰<Z@Y>
        <BLANKLINE>
        0: ─╭Exp(-0.50j 𝓗)─╭X@X────┤ ╭<Z@Y>
        1: ─╰Exp(-0.50j 𝓗)─├X@X────┤ │
        2: ──H─────────────╰●────H─┤ ╰<Z@Y>
        <BLANKLINE>
        0: ─╭Exp(-0.50j 𝓗)─╭Z────┤ ╭<Z@Y>
        1: ─╰Exp(-0.50j 𝓗)─│─────┤ │
        2: ──H─────────────╰●──H─┤ ╰<Z@Y>
        <BLANKLINE>
        0: ─╭Exp(-0.50j 𝓗)─╭Z@Z────┤ ╭<Z@Y>
        1: ─╰Exp(-0.50j 𝓗)─├Z@Z────┤ │
        2: ──H─────────────╰●────H─┤ ╰<Z@Y>

    This gradient transform can be applied directly to :class:`QNode <pennylane.QNode>`
    objects. However, for performance reasons, we recommend providing the gradient transform
    as the ``diff_method`` argument of the QNode decorator, and differentiating with your
    preferred machine learning framework.

    >>> dev = qp.device("default.qubit")
    >>> @qp.qnode(dev)
    ... def circuit(params):
    ...     qp.RX(params[0], wires=0)
    ...     qp.RY(params[1], wires=0)
    ...     qp.RX(params[2], wires=0)
    ...     return qp.expval(qp.Z(0))
    >>> params = qp.numpy.array([0.1, 0.2, 0.3], requires_grad=True)
    >>> qp.gradients.hadamard_grad(circuit, mode="auto", aux_wire=1)(params)
    tensor([-0.3875172 , -0.18884787, -0.38355704], requires_grad=True)

    This quantum gradient transform can also be applied to low-level
    :class:`~.QuantumTape` objects. This will result in no implicit quantum
    device evaluation. Instead, the processed tapes, and post-processing
    function, which together define the gradient are directly returned:

    >>> ops = [qp.RX(params[0], 0), qp.RY(params[1], 0), qp.RX(params[2], 0)]
    >>> measurements = [qp.expval(qp.Z(0))]
    >>> tape = qp.tape.QuantumTape(ops, measurements)
    >>> gradient_tapes, fn = qp.gradients.hadamard_grad(tape, mode="auto", aux_wire=1)
    >>> gradient_tapes
    [<QuantumScript: wires=[0, 1], params=3>,
     <QuantumScript: wires=[0, 1], params=3>,
     <QuantumScript: wires=[0, 1], params=3>]

    This can be useful if the underlying circuits representing the gradient
    computation need to be analyzed.

    Note that ``argnum`` refers to the index of a parameter within the list of trainable
    parameters. For example, if we have:

    >>> tape = qp.tape.QuantumScript(
    ...     [qp.RX(1.2, wires=0), qp.RY(2.3, wires=0), qp.RZ(3.4, wires=0)],
    ...     [qp.expval(qp.Z(0))],
    ...     trainable_params = [1, 2]
    ... )
    >>> qp.gradients.hadamard_grad(tape, argnum=1, mode="auto", aux_wire=1)  # doctest: +SKIP

    The code above will differentiate the third parameter rather than the second.

    The output tapes can then be evaluated and post-processed to retrieve the gradient:

    >>> dev = qp.device("default.qubit")
    >>> fn(qp.execute(gradient_tapes, dev, None))
    [np.float64(-0.3875172020222171), np.float64(-0.18884787122715604), np.float64(-0.38355704238148114)]

    This transform can be registered directly as the quantum gradient transform
    to use during autodifferentiation:

    >>> dev = qp.device("default.qubit")
    >>> @qp.qnode(dev, interface="jax", diff_method="hadamard", gradient_kwargs={"mode": "standard", "aux_wire": 1})
    ... def circuit(params):
    ...     qp.RX(params[0], wires=0)
    ...     qp.RY(params[1], wires=0)
    ...     qp.RX(params[2], wires=0)
    ...     return qp.expval(qp.Z(0))
    >>> params = jax.numpy.array([0.1, 0.2, 0.3])
    >>> jax.jacobian(circuit)(params)
    Array([-0.3875172 , -0.18884787, -0.38355705], dtype=float64)

    If you use custom wires on your device, and you want to use the "standard" or "reversed" modes, you need to pass an auxiliary wire.

    >>> dev_wires = ("a", "c")
    >>> dev = qp.device("default.qubit", wires=dev_wires)
    >>> gradient_kwargs = {"aux_wire": "c"}
    >>> @qp.qnode(dev, interface="jax", diff_method="hadamard", gradient_kwargs=gradient_kwargs)
    >>> def circuit(params):
    ...    qp.RX(params[0], wires="a")
    ...    qp.RY(params[1], wires="a")
    ...    qp.RX(params[2], wires="a")
    ...    return qp.expval(qp.Z("a"))
    >>> params = jax.numpy.array([0.1, 0.2, 0.3])
    >>> jax.jacobian(circuit)(params)
    Array([-0.3875172 , -0.18884787, -0.38355705], dtype=float64)

.. details::
    :title: Variants of the standard hadamard gradient

    This gradient method has three modes that are adaptations of the standard Hadamard gradient
    method (these are outlined in detail in `arXiv:2408.05406 <https://arxiv.org/pdf/2408.05406>`__).

    **Reversed mode**

    With the ``"reversed"`` mode, the observable being measured and the generators of the unitary
    operations in the circuit are reversed; the generators are now the observables, and the Pauli
    decomposition of the observables are now gates in the circuit:

    .. code-block:: pycon

        >>> dev = qp.device('default.qubit')
        >>> @qp.qnode(dev)
        ... def circuit(x):
        ...     qp.evolve(qp.X(0) @ qp.X(1) + qp.Z(0) @ qp.Z(1) + qp.H(0), x)
        ...     return qp.expval(qp.Z(0))
        ...
        >>> grad = qp.gradients.hadamard_grad(circuit, mode='reversed', aux_wire=2)
        >>> print(qp.draw(grad)(qp.numpy.array(0.5)))
        0: ─╭Exp(-0.50j 𝓗)─╭Z────┤ ╭<(-1.00*𝓗)@Y>
        1: ─╰Exp(-0.50j 𝓗)─│─────┤ ├<(-1.00*𝓗)@Y>
        2: ──H─────────────╰●──H─┤ ╰<(-1.00*𝓗)@Y>

    **Direct mode**

    With the ``"direct"`` mode, the additional auxiliary qubit needed in the standard Hadamard gradient
    is exchanged for additional circuit executions:

    .. code-block:: pycon

        >>> grad = qp.gradients.hadamard_grad(circuit, mode='direct')
        >>> print(qp.draw(grad)(qp.numpy.array(0.5)))
        0: ─╭Exp(-0.50j 𝓗)──Exp(-0.79j X)─┤  <Z>
        1: ─╰Exp(-0.50j 𝓗)────────────────┤
        <BLANKLINE>
        0: ─╭Exp(-0.50j 𝓗)──Exp(0.79j X)─┤  <Z>
        1: ─╰Exp(-0.50j 𝓗)───────────────┤
        <BLANKLINE>
        0: ─╭Exp(-0.50j 𝓗)─╭Exp(-0.79j X@X)─┤  <Z>
        1: ─╰Exp(-0.50j 𝓗)─╰Exp(-0.79j X@X)─┤
        <BLANKLINE>
        0: ─╭Exp(-0.50j 𝓗)─╭Exp(0.79j X@X)─┤  <Z>
        1: ─╰Exp(-0.50j 𝓗)─╰Exp(0.79j X@X)─┤
        <BLANKLINE>
        0: ─╭Exp(-0.50j 𝓗)──Exp(-0.79j Z)─┤  <Z>
        1: ─╰Exp(-0.50j 𝓗)────────────────┤
        <BLANKLINE>
        0: ─╭Exp(-0.50j 𝓗)──Exp(0.79j Z)─┤  <Z>
        1: ─╰Exp(-0.50j 𝓗)───────────────┤
        <BLANKLINE>
        0: ─╭Exp(-0.50j 𝓗)─╭Exp(-0.79j Z@Z)─┤  <Z>
        1: ─╰Exp(-0.50j 𝓗)─╰Exp(-0.79j Z@Z)─┤
        <BLANKLINE>
        0: ─╭Exp(-0.50j 𝓗)─╭Exp(0.79j Z@Z)─┤  <Z>
        1: ─╰Exp(-0.50j 𝓗)─╰Exp(0.79j Z@Z)─┤

    **Reversed direct mode**

    The ``"reversed-direct"`` mode is a combination of the ``"direct"`` and ``"reversed"`` modes,
    where the role of the observable and the generators of the unitary operations in the circuit
    swap, and the additional auxiliary qubit is exchanged for additional circuit executions:

    .. code-block:: pycon

        >>> grad = qp.gradients.hadamard_grad(circuit, mode='reversed-direct')
        >>> print(qp.draw(grad)(qp.numpy.array(0.5)))
        0: ─╭Exp(-0.50j 𝓗)──Exp(-0.79j Z)─┤ ╭<-1.00*𝓗>
        1: ─╰Exp(-0.50j 𝓗)────────────────┤ ╰<-1.00*𝓗>
        <BLANKLINE>
        0: ─╭Exp(-0.50j 𝓗)──Exp(0.79j Z)─┤ ╭<-1.00*𝓗>
        1: ─╰Exp(-0.50j 𝓗)───────────────┤ ╰<-1.00*𝓗>

    **Auto mode**

    Using auto mode will result in an automatic selection of the method which results in the fewest
    total executions, given the wires available. Any auxiliary wires must be provided explicitly.
    This method takes into account the number of observables and the number of generators involved
    in each problem to choose whether the standard or reversed order is preferred. It also takes
    into account whether we have one or multiple measurements, and whether we have an auxiliary wire.

    ===============  ===============  ==============================
    Auxiliary Wire   Standard Order   Method
    ===============  ===============  ==============================
    False            True             Direct Hadamard test
    False            False            Reversed direct Hadamard test
    True             True             Hadamard test
    True             False            Reversed Hadamard test
    ===============  ===============  ==============================

    i.e. in the below, the direct method is automatically selected. We can verify that it is the
    most efficient choice. We don't supply an auxilliary wire, so we are choosing between ``direct``
    and ``reversed-direct`` modes.

    >>> dev = qp.device('default.qubit')
    >>> @qp.qnode(dev)
    ... def circuit(x):
    ...     qp.evolve(qp.X(0) @ qp.X(1), x)
    ...     return qp.expval(qp.Z(0) @ qp.Z(1) + qp.Y(0))
    >>> grad = qp.gradients.hadamard_grad(circuit, mode='auto')
    >>> print(qp.draw(grad)(qp.numpy.array(0.5)))
    0: ─╭Exp(-0.50j X@X)─╭Exp(-0.79j X@X)─┤ ╭<𝓗>
    1: ─╰Exp(-0.50j X@X)─╰Exp(-0.79j X@X)─┤ ╰<𝓗>
    <BLANKLINE>
    0: ─╭Exp(-0.50j X@X)─╭Exp(0.79j X@X)─┤ ╭<𝓗>
    1: ─╰Exp(-0.50j X@X)─╰Exp(0.79j X@X)─┤ ╰<𝓗>

    >>> grad = qp.gradients.hadamard_grad(circuit, mode='reversed-direct')
    >>> print(qp.draw(grad)(qp.numpy.array(0.5)))
    0: ─╭Exp(-0.50j X@X)─╭Exp(-0.79j Z@Z)─┤ ╭<-1.00*X@X>
    1: ─╰Exp(-0.50j X@X)─╰Exp(-0.79j Z@Z)─┤ ╰<-1.00*X@X>
    <BLANKLINE>
    0: ─╭Exp(-0.50j X@X)─╭Exp(0.79j Z@Z)─┤ ╭<-1.00*X@X>
    1: ─╰Exp(-0.50j X@X)─╰Exp(0.79j Z@Z)─┤ ╰<-1.00*X@X>
    <BLANKLINE>
    0: ─╭Exp(-0.50j X@X)──Exp(-0.79j Y)─┤ ╭<-1.00*X@X>
    1: ─╰Exp(-0.50j X@X)────────────────┤ ╰<-1.00*X@X>
    <BLANKLINE>
    0: ─╭Exp(-0.50j X@X)──Exp(0.79j Y)─┤ ╭<-1.00*X@X>
    1: ─╰Exp(-0.50j X@X)───────────────┤ ╰<-1.00*X@X>

## `processing_fn`

```python
def processing_fn(results: ResultBatch, tape, coeffs, generators_per_parameter)
```

Post processing function for computing a hadamard gradient.
