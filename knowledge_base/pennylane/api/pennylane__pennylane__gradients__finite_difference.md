---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/gradients/finite_difference.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/gradients/finite_difference.py
license: Apache-2.0
---

## Module `pennylane/gradients/finite_difference.py`

This module contains functions for computing the finite-difference gradient
of a quantum tape.

## `finite_diff_coeffs`

```python
def finite_diff_coeffs(n, approx_order, strategy)
```

Generate the finite difference shift values and corresponding
term coefficients for a given derivative order, approximation accuracy,
and strategy.

Args:
    n (int): Positive integer specifying the order of the derivative. For example, ``n=1``
        corresponds to the first derivative, ``n=2`` the second derivative, etc.
    approx_order (int): Positive integer referring to the approximation order of the
        returned coefficients, e.g., ``approx_order=1`` corresponds to the
        first-order approximation to the derivative.
    strategy (str): One of ``"forward"``, ``"center"``, or ``"backward"``.
        For the ``"forward"`` strategy, the finite-difference shifts occur at the points
        :math:`x_0, x_0+h, x_0+2h,\dots`, where :math:`h` is some small
        step size. The ``"backwards"`` strategy is similar, but in
        reverse: :math:`x_0, x_0-h, x_0-2h, \dots`. Finally, the
        ``"center"`` strategy results in shifts symmetric around the
        unshifted point: :math:`\dots, x_0-2h, x_0-h, x_0, x_0+h, x_0+2h,\dots`.

Returns:
    array[float]: A ``(2, N)`` array. The first row corresponds to the
    coefficients, and the second row corresponds to the shifts.

**Example**

>>> finite_diff_coeffs(n=1, approx_order=1, strategy="forward")
array([[-1.,  1.],
       [ 0.,  1.]])

For example, this results in the linear combination:

.. math:: \frac{-y(x_0) + y(x_0 + h)}{h}

where :math:`h` is the finite-difference step size.

More examples:

>>> finite_diff_coeffs(n=1, approx_order=2, strategy="center")
array([[-0.5,  0.5],
       [-1. ,  1. ]])
>>> finite_diff_coeffs(n=2, approx_order=2, strategy="center")
array([[-2.,  1.,  1.],
       [ 0., -1.,  1.]])

**Details**

Consider a function :math:`y(x)`. We wish to approximate the :math:`n`-th
derivative at point :math:`x_0`, :math:`y^{(n)}(x_0)`, by sampling the function
at :math:`N<n` distinct points:

.. math:: y^{(n)}(x_0) \approx \sum_{i=1}^N c_i y(x_i)

where :math:`c_i` are coefficients, and :math:`x_i=x_0 + s_i` are the points we sample
the function at.

Consider the Taylor expansion of :math:`y(x_i)` around the point :math:`x_0`:

.. math::

    y^{(n)}(x_0) \approx \sum_{i=1}^N c_i y(x_i)
        &= \sum_{i=1}^N c_i \left[ y(x_0) + y'(x_0)(x_i-x_0) + \frac{1}{2} y''(x_0)(x_i-x_0)^2 + \cdots \right]\\
        & = \sum_{j=0}^m y^{(j)}(x_0) \left[\sum_{i=1}^N \frac{c_i s_i^j}{j!} + \mathcal{O}(s_i^m) \right],

where :math:`s_i = x_i-x_0`. For this approximation to be satisfied, we must therefore have

.. math::

    \sum_{i=1}^N s_i^j c_i = \begin{cases} j!, &j=n\\ 0, & j\neq n\end{cases}.

Thus, to determine the coefficients :math:`c_i \in \{c_1, \dots, c_N\}` for particular
shift values :math:`s_i \in \{s_1, \dots, s_N\}` and derivative order :math:`n`,
we must solve this linear system of equations.

## `finite_diff_jvp`

```python
def finite_diff_jvp(f: Callable, args: tuple, tangents: tuple, *, h: float=1e-07, approx_order: int=1, strategy: Literal['forward', 'backward', 'center']='forward') -> tuple
```

Compute the jvp of a generic function using finite differences.

Args:
    f (Callable): a generic function that returns a pytree of tensors. Note that this

        function should not have keyword arguments.
    args (tuple[TensorLike]): the tuple of arguments to the function ``f``

    tangents (tuple[TensorLike]): the tuple of tangents for the arguments ``args``


Keyword Args:
    h=1e-7 (float): finite difference method step size
    approx_order=1 (int): The approximation order of the finite-difference method to use.
    strategy="forward" (str): The strategy of the finite difference method. Must be one of
        ``"forward"``, ``"center"``, or ``"backward"``.
        For the ``"forward"`` strategy, the finite-difference shifts occur at the points
        :math:`x_0, x_0+h, x_0+2h,\dots`, where :math:`h` is some small
        stepsize. The ``"backwards"`` strategy is similar, but in
        reverse: :math:`x_0, x_0-h, x_0-2h, \dots`. Finally, the
        ``"center"`` strategy results in shifts symmetric around the
        unshifted point: :math:`\dots, x_0-2h, x_0-h, x_0, x_0+h, x_0+2h,\dots`.

Returns:
    tuple(TensorLike, TensorLike): the results and their cotangents


>>> def f(x, y):
...     return 2 * x * y, x**2
>>> args = (0.5, 1.2)
>>> tangents = (1.0, 1.0)
>>> results, dresults = qp.gradients.finite_diff_jvp(f, args, tangents)
>>> results
(1.2, 0.25)
>>> dresults
[np.float64(3.399999999986747), np.float64(1.000001000006634)]

## `finite_diff`

```python
def finite_diff(tape: QuantumScript, argnum=None, h: float=1e-07, approx_order: int=1, n: int=1, strategy: Literal['forward', 'backward', 'center']='forward', f0=None, validate_params: bool=True) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Transform a circuit to compute the finite-difference gradient of all gate parameters with respect to its inputs.

Args:
    tape (QNode or QuantumTape): quantum circuit to differentiate
    argnum (int or list[int] or None): Trainable parameter indices to differentiate
        with respect to. If not provided, the derivatives with respect to all
        trainable parameters are returned. Note that the indices are with respect to
        the list of trainable parameters.
    h (float): finite difference method step size
    approx_order (int): The approximation order of the finite-difference method to use.
    n (int): compute the :math:`n`-th derivative
    strategy (str): The strategy of the finite difference method. Must be one of
        ``"forward"``, ``"center"``, or ``"backward"``.
        For the ``"forward"`` strategy, the finite-difference shifts occur at the points
        :math:`x_0, x_0+h, x_0+2h,\dots`, where :math:`h` is some small
        stepsize. The ``"backwards"`` strategy is similar, but in
        reverse: :math:`x_0, x_0-h, x_0-2h, \dots`. Finally, the
        ``"center"`` strategy results in shifts symmetric around the
        unshifted point: :math:`\dots, x_0-2h, x_0-h, x_0, x_0+h, x_0+2h,\dots`.
    f0 (tensor_like[float] or None): Output of the evaluated input tape. If provided,
        and the gradient recipe contains an unshifted term, this value is used,
        saving a quantum evaluation.
    validate_params (bool): Whether to validate the tape parameters or not. If ``True``,
        the ``Operation.grad_method`` attribute and the circuit structure will be analyzed
        to determine if the trainable parameters support the finite-difference method.
        If ``False``, the finite-difference method will be applied to all parameters.

Returns:
    qnode (QNode) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will provide the Jacobian in the form of a tensor, a tuple, or a nested tuple depending upon the nesting
    structure of measurements in the original circuit.

**Example**

This transform can be registered directly as the quantum gradient transform
to use during autodifferentiation:

>>> dev = qp.device("default.qubit")
>>> @qp.qnode(dev, interface="autograd", diff_method="finite-diff")
... def circuit(params):
...     qp.RX(params[0], wires=0)
...     qp.RY(params[1], wires=0)
...     qp.RX(params[2], wires=0)
...     return qp.expval(qp.Z(0))
>>> params = np.array([0.1, 0.2, 0.3], requires_grad=True)
>>> qp.jacobian(circuit)(params)
array([-0.38751725, -0.18884792, -0.38355708])

When differentiating QNodes with multiple measurements using Autograd or TensorFlow, the outputs of the QNode first
need to be stacked. The reason is that those two frameworks only allow differentiating functions with array or
tensor outputs, instead of functions that output sequences. In contrast, Jax and Torch require no additional
post-processing.

>>> import jax
>>> dev = qp.device("default.qubit")
>>> @qp.qnode(dev, interface="jax", diff_method="finite-diff")
... def circuit(params):
...     qp.RX(params[0], wires=0)
...     qp.RY(params[1], wires=0)
...     qp.RX(params[2], wires=0)
...     return qp.expval(qp.Z(0)), qp.var(qp.Z(0))
>>> params = jax.numpy.array([0.1, 0.2, 0.3])
>>> jax.jacobian(circuit)(params)
(Array([-0.38751727, -0.18884793, -0.3835571 ], dtype=float32),
 Array([0.6991687 , 0.34072432, 0.6920237 ], dtype=float32))


.. details::
    :title: Usage Details

    This gradient transform can be applied directly to :class:`QNode <pennylane.QNode>`
    objects. However, for performance reasons, we recommend providing the gradient transform
    as the ``diff_method`` argument of the QNode decorator, and differentiating with your
    preferred machine learning framework.

    >>> @qp.qnode(dev)
    ... def circuit(params):
    ...     qp.RX(params[0], wires=0)
    ...     qp.RY(params[1], wires=0)
    ...     qp.RX(params[2], wires=0)
    ...     return qp.expval(qp.Z(0)), qp.var(qp.Z(0))
    >>> params = np.array([0.1, 0.2, 0.3], requires_grad=True)
    >>> qp.gradients.finite_diff(circuit)(params)
    (tensor([-0.38751724, -0.18884792, -0.38355708], requires_grad=True),
     tensor([0.69916868, 0.34072432, 0.69202365], requires_grad=True))

    This quantum gradient transform can also be applied to low-level
    :class:`~.QuantumTape` objects. This will result in no implicit quantum
    device evaluation. Instead, the processed tapes, and post-processing
    function, which together define the gradient are directly returned:

    >>> ops = [qp.RX(p, wires=0) for p in params]
    >>> measurements = [qp.expval(qp.Z(0)), qp.var(qp.Z(0))]
    >>> tape = qp.tape.QuantumTape(ops, measurements)
    >>> gradient_tapes, fn = qp.gradients.finite_diff(tape)
    >>> gradient_tapes
    [<QuantumTape: wires=[0], params=3>,
     <QuantumScript: wires=[0], params=3>,
     <QuantumScript: wires=[0], params=3>,
     <QuantumScript: wires=[0], params=3>]

    This can be useful if the underlying circuits representing the gradient
    computation need to be analyzed.

    Note that ``argnum`` refers to the index of a parameter within the list of trainable
    parameters. For example, if we have:

    >>> tape = qp.tape.QuantumScript(
    ...     [qp.RX(1.2, wires=0), qp.RY(2.3, wires=0), qp.RZ(3.4, wires=0)],
    ...     [qp.expval(qp.Z(0))],
    ...     trainable_params = [1, 2]
    ... )
    >>> qp.gradients.finite_diff(tape, argnum=1)

    The code above will differentiate the third parameter rather than the second.

    The output tapes can then be evaluated and post-processed to retrieve the gradient:

    >>> dev = qp.device("default.qubit")
    >>> fn(qp.execute(gradient_tapes, dev, None))
    ((tensor(-0.56464251, requires_grad=True),
      tensor(-0.56464251, requires_grad=True),
      tensor(-0.56464251, requires_grad=True)),
     (tensor(0.93203912, requires_grad=True),
      tensor(0.93203912, requires_grad=True),
      tensor(0.93203912, requires_grad=True)))

    This gradient transform is compatible with devices that use shot vectors for execution.

    >>> shots = (10, 100, 1000)
    >>> dev = qp.device("default.qubit")
    >>> @qp.set_shots(shots=shots)
    ... @qp.qnode(dev)
    ... def circuit(params):
    ...     qp.RX(params[0], wires=0)
    ...     qp.RY(params[1], wires=0)
    ...     qp.RX(params[2], wires=0)
    ...     return qp.expval(qp.Z(0)), qp.var(qp.Z(0))
    >>> params = np.array([0.1, 0.2, 0.3], requires_grad=True)
    >>> qp.gradients.finite_diff(circuit, h=0.1)(params)
    ((array([-2., -2.,  0.]), array([3.6, 3.6, 0. ])),
     (array([1. , 0.2, 0.4]), array([-1.78 , -0.34 , -0.688])),
     (array([-0.9 , -0.22, -0.48]), array([1.5498 , 0.3938 , 0.84672])))

    The outermost tuple contains results corresponding to each element of the shot vector.
