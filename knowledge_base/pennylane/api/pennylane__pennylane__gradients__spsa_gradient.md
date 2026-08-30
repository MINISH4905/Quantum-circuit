---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/gradients/spsa_gradient.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/gradients/spsa_gradient.py
license: Apache-2.0
---

## Module `pennylane/gradients/spsa_gradient.py`

This module contains functions for computing the SPSA gradient
of a quantum tape.

## `spsa_grad`

```python
def spsa_grad(tape: QuantumScript, argnum=None, h=1e-05, approx_order=2, n=1, strategy='center', f0=None, validate_params=True, num_directions=1, sampler=_rademacher_sampler, sampler_rng=None) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Transform a circuit to compute the SPSA gradient of all gate
parameters with respect to its inputs. This estimator shifts all parameters
simultaneously and approximates the gradient based on these shifts and a
finite-difference method.

Args:
    tape (QNode or QuantumTape): quantum circuit to differentiate
    argnum (int or list[int] or None): Trainable parameter indices to differentiate
        with respect to. If not provided, the derivatives with respect to all
        trainable parameters are returned. Note that the indices are with respect to
        the list of trainable parameters.
    h (float or tensor_like[float]): Step size for the finite-difference method
        underlying the SPSA. Can be a tensor-like object
        with as many entries as differentiated *gate* parameters
    approx_order (int): The approximation order of the finite-difference method underlying
        the SPSA gradient.
    n (int): compute the :math:`n`-th derivative
    strategy (str): The strategy of the underlying finite difference method. Must be one of
        ``"forward"``, ``"center"``, or ``"backward"``.
        For the ``"forward"`` strategy, the finite-difference shifts occur at the points
        :math:`x_0, x_0+h, x_0+2h,\dots`, where :math:`h` is the stepsize ``h``.
        The ``"backwards"`` strategy is similar, but in
        reverse: :math:`x_0, x_0-h, x_0-2h, \dots`. Finally, the
        ``"center"`` strategy results in shifts symmetric around the
        unshifted point: :math:`\dots, x_0-2h, x_0-h, x_0, x_0+h, x_0+2h,\dots`.
    f0 (tensor_like[float] or None): Output of the evaluated input tape in ``tape``. If
        provided, and the gradient recipe contains an unshifted term, this value is used,
        saving a quantum evaluation.
    validate_params (bool): Whether to validate the tape parameters or not. If ``True``,
        the ``Operation.grad_method`` attribute and the circuit structure will be analyzed
        to determine if the trainable parameters support the finite-difference method,
        inferring that they support SPSA as well.
        If ``False``, the SPSA gradient method will be applied to all parameters without
        checking.
    num_directions (int): Number of sampled simultaneous perturbation vectors. An estimate for
        the gradient is computed for each vector using the underlying finite-difference
        method, and afterwards all estimates are averaged.
    sampler (callable): Sampling method to obtain the simultaneous perturbation directions.
        The sampler should take the following arguments:

        - A ``Sequence[int]`` that contains the indices of those trainable tape parameters
          that will be perturbed, i.e. have non-zero entries in the output vector.

        - An ``int`` that indicates the total number of trainable tape parameters. The
          size of the output vector has to match this input.

        - An ``int`` indicating the iteration counter during the gradient estimation.
          A valid sampling method can, but does not have to, take this counter into
          account. In any case, ``sampler`` has to accept this third argument.

        - The required keyword argument ``rng``, expected to be a NumPy pseudo-random
          number generator, which should be used to sample directions randomly.

        Note that the circuit evaluations in the various sampled directions are *averaged*,
        not simply summed up.

    sampler_rng (Union[np.random.Generator, int, None]): Either a NumPy pseudo-random number
        generator or an integer, which will be used as the PRNG seed. Default is None, which
        creates a NumPy PRNG without a seed. Note that calling ``spsa_grad`` multiple times
        with a seed (i.e., an integer) will result in the same directions being sampled in each
        call. In this case it is advisable to create a NumPy PRNG and pass it to
        ``spsa_grad`` in each call.

Returns:
    qnode (QNode) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will provide the Jacobian in the form of a tensor, a tuple, or a nested tuple depending upon the nesting
    structure of measurements in the original circuit.

**Example**

This gradient transform can be applied directly to :class:`QNode <pennylane.QNode>`
objects:

>>> @qp.qnode(dev)
... def circuit(params):
...     qp.RX(params[0], wires=0)
...     qp.RY(params[1], wires=0)
...     qp.RX(params[2], wires=0)
...     return qp.expval(qp.Z(0)), qp.var(qp.Z(0))
>>> params = np.array([0.1, 0.2, 0.3], requires_grad=True)
>>> qp.gradients.spsa_grad(circuit)(params)
(tensor([ 0.18488771, -0.18488771, -0.18488771], requires_grad=True),
 tensor([-0.33357922,  0.33357922,  0.33357922], requires_grad=True))

Note that the SPSA gradient is a statistical estimator that uses a given number of
function evaluations that does not depend on the number of parameters. While this
bounds the cost of the estimation, it also implies that the returned values are not
exact (even with ``shots=None``) and that they will fluctuate.
See the usage details below for more information.

.. details::
    :title: Usage Details

    The number of directions in which the derivative is computed to estimate the gradient
    can be controlled with the keyword argument ``num_directions``. For the QNode above,
    a more precise gradient estimation from ``num_directions=20`` directions yields

    >>> qp.gradients.spsa_grad(circuit, num_directions=20)(params)
    (tensor([-0.53976776, -0.34385475, -0.46106048], requires_grad=True),
     tensor([0.97386303, 0.62039169, 0.83185731], requires_grad=True))

    We may compare this to the more precise values obtained from finite differences:

    >>> qp.gradients.finite_diff(circuit)(params)
    (tensor([-0.38751724, -0.18884792, -0.38355708], requires_grad=True),
     tensor([0.69916868, 0.34072432, 0.69202365], requires_grad=True))

    As we can see, the SPSA output is a rather coarse approximation to the true
    gradient, and this although the parameter-shift rule for three parameters uses
    just six circuit evaluations, much fewer than SPSA! Consequentially, SPSA is
    not necessarily useful for small circuits with few parameters, but will pay off
    for large circuits where other gradient estimators require unfeasibly many circuit
    executions.

    This quantum gradient transform can also be applied to low-level
    :class:`~.QuantumTape` objects. This will result in no implicit quantum
    device evaluation. Instead, the processed tapes, and post-processing
    function, which together define the gradient are directly returned:

    >>> ops = [qp.RX(params[0], 0), qp.RY(params[1], 0), qp.RX(params[2], 0)]
    >>> measurements = [qp.expval(qp.Z(0)), qp.var(qp.Z(0))]
    >>> tape = qp.tape.QuantumTape(ops, measurements)
    >>> gradient_tapes, fn = qp.gradients.spsa_grad(tape)
    >>> gradient_tapes
    [<QuantumScript: wires=[0], params=3>, <QuantumScript: wires=[0], params=3>]

    This can be useful if the underlying circuits representing the gradient
    computation need to be analyzed. Here we see that for ``num_directions=1``,
    the default, we obtain two tapes.

    Note that ``argnum`` refers to the index of a parameter within the list of trainable
    parameters. For example, if we have:

    >>> tape = qp.tape.QuantumScript(
    ...     [qp.RX(1.2, wires=0), qp.RY(2.3, wires=0), qp.RZ(3.4, wires=0)],
    ...     [qp.expval(qp.Z(0))],
    ...     trainable_params = [1, 2]
    ... )
    >>> qp.gradients.spsa_grad(tape, argnum=1)

    The code above will differentiate the third parameter rather than the second.

    The output tapes can then be evaluated and post-processed to retrieve
    the gradient:

    >>> dev = qp.device("default.qubit")
    >>> fn(qp.execute(gradient_tapes, dev, None))
    ((tensor(0.18488771, requires_grad=True),
      tensor(-0.18488771, requires_grad=True),
      tensor(-0.18488771, requires_grad=True)),
     (tensor(-0.33357922, requires_grad=True),
      tensor(0.33357922, requires_grad=True),
      tensor(0.33357922, requires_grad=True)))

    This gradient transform is compatible with devices that use shot vectors for execution.

    >>> shots = (10, 100, 1000)
    >>> dev = qp.device("default.qubit")
    >>> @qp.set_shots(shots=shots)
    >>> @qp.qnode(dev)
    ... def circuit(params):
    ...     qp.RX(params[0], wires=0)
    ...     qp.RY(params[1], wires=0)
    ...     qp.RX(params[2], wires=0)
    ...     return qp.expval(qp.Z(0)), qp.var(qp.Z(0))
    >>> params = np.array([0.1, 0.2, 0.3], requires_grad=True)
    >>> qp.gradients.spsa_grad(circuit, h=1e-2)(params)
    ((array([ 10.,  10., -10.]), array([-18., -18.,  18.])),
     (array([-5., -5.,  5.]), array([ 8.9,  8.9, -8.9])),
     (array([ 1.5,  1.5, -1.5]), array([-2.667, -2.667,  2.667])))

    The outermost tuple contains results corresponding to each element of the shot vector,
    as is also visible by the increasing precision.
    Note that the stochastic approximation and the fluctuations from the shot noise
    of the device accumulate, leading to a very coarse-grained estimate for the gradient.
