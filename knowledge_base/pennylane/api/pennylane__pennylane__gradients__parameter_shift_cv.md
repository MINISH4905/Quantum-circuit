---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/gradients/parameter_shift_cv.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/gradients/parameter_shift_cv.py
license: Apache-2.0
---

## Module `pennylane/gradients/parameter_shift_cv.py`

This module contains functions for computing the parameter-shift gradient
of a CV-based quantum tape.

## `var_param_shift`

```python
def var_param_shift(tape, dev_wires, argnum=None, shifts=None, gradient_recipes=None, f0=None)
```

Partial derivative using the first-order or second-order parameter-shift rule of a tape
consisting of a mixture of expectation values and variances of observables.

Expectation values may be of first- or second-order observables,
but variances can only be taken of first-order variables.

.. warning::

    This method can only be executed on devices that support the
    :class:`~.PolyXP` observable.

Args:
    tape (.QuantumTape): quantum tape to differentiate
    dev_wires (.Wires): wires on the device the parameter-shift method is computed on
    argnum (int or list[int] or None): Trainable parameter indices to differentiate
        with respect to. If not provided, the derivative with respect to all
        trainable indices are returned.
    shifts (list[tuple[int or float]]): List containing tuples of shift values.
        If provided, one tuple of shifts should be given per trainable parameter
        and the tuple should match the number of frequencies for that parameter.
        If unspecified, equidistant shifts are assumed.
    gradient_recipes (tuple(list[list[float]] or None)): List of gradient recipes
        for the parameter-shift method. One gradient recipe must be provided
        per trainable parameter.
    f0 (tensor_like[float] or None): Output of the evaluated input tape. If provided,
        and the gradient recipe contains an unshifted term, this value is used,
        saving a quantum evaluation.

Returns:
    tuple[list[QuantumTape], function]: A tuple containing a
    list of generated tapes, together with a post-processing
    function to be applied to the results of the evaluated tapes
    in order to obtain the Jacobian matrix.

## `second_order_param_shift`

```python
def second_order_param_shift(tape, dev_wires, argnum=None, shifts=None, gradient_recipes=None)
```

Generate the second-order CV parameter-shift tapes and postprocessing methods required
to compute the gradient of a gate parameter with respect to an
expectation value.

.. note::

    The 2nd order method can handle also first-order observables, but
    1st order method may be more efficient unless it's really easy to
    experimentally measure arbitrary 2nd order observables.

.. warning::

    The 2nd order method can only be executed on devices that support the
    :class:`~.PolyXP` observable.

Args:
    tape (.QuantumTape): quantum tape to differentiate
    dev_wires (.Wires): wires on the device the parameter-shift method is computed on
    argnum (int or list[int] or None): Trainable parameter indices to differentiate
        with respect to. If not provided, the derivative with respect to all
        trainable indices are returned.
    shifts (list[tuple[int or float]]): List containing tuples of shift values.
        If provided, one tuple of shifts should be given per trainable parameter
        and the tuple should match the number of frequencies for that parameter.
        If unspecified, equidistant shifts are assumed.
    gradient_recipes (tuple(list[list[float]] or None)): List of gradient recipes
        for the parameter-shift method. One gradient recipe must be provided
        per trainable parameter.

Returns:
    tuple[list[QuantumTape], function]: A tuple containing a
    list of generated tapes, together with a post-processing
    function to be applied to the results of the evaluated tapes
    in order to obtain the Jacobian matrix.

## `param_shift_cv`

```python
def param_shift_cv(tape: QuantumScript, dev, argnum=None, shifts=None, gradient_recipes=None, fallback_fn=finite_diff, f0=None, force_order2=False) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Transform a continuous-variable QNode to compute the parameter-shift gradient of all gate
parameters with respect to its inputs.

Args:
    tape (QNode or QuantumTape): quantum circuit to differentiate
    dev (pennylane.devices.LegacyDeviceFacade): device the parameter-shift method is to be computed on
    argnum (int or list[int] or None): Trainable parameter indices to differentiate
        with respect to. If not provided, the derivative with respect to all
        trainable indices are returned.
    shifts (list[tuple[int or float]]): List containing tuples of shift values.
        If provided, one tuple of shifts should be given per trainable parameter
        and the tuple should match the number of frequencies for that parameter.
        If unspecified, equidistant shifts are assumed.
    gradient_recipes (tuple(list[list[float]] or None)): List of gradient recipes
        for the parameter-shift method. One gradient recipe must be provided

        per trainable parameter.

        This is a tuple with one nested list per parameter. For
        parameter :math:`\phi_k`, the nested list contains elements of the form
        :math:`[c_i, a_i, s_i]` where :math:`i` is the index of the
        term, resulting in a gradient recipe of

        .. math:: \frac{\partial}{\partial\phi_k}f = \sum_{i} c_i f(a_i \phi_k + s_i).

        If ``None``, the default gradient recipe containing the two terms
        :math:`[c_0, a_0, s_0]=[1/2, 1, \pi/2]` and :math:`[c_1, a_1,
        s_1]=[-1/2, 1, -\pi/2]` is assumed for every parameter.
    fallback_fn (None or Callable): a fallback gradient function to use for
        any parameters that do not support the parameter-shift rule.
    f0 (tensor_like[float] or None): Output of the evaluated input tape. If provided,
        and the gradient recipe contains an unshifted term, this value is used,
        saving a quantum evaluation.
    force_order2 (bool): if True, use the order-2 method even if not necessary

Returns:
    qnode (QNode) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will provide the Jacobian in the form of a tensor, a tuple, or a nested tuple depending upon the nesting
    structure of measurements in the original circuit.

This transform supports analytic gradients of Gaussian CV operations using
the parameter-shift rule. This gradient method returns *exact* gradients,
and can be computed directly on quantum hardware.

Analytic gradients of photonic circuits that satisfy
the following constraints with regards to measurements are supported:

* Expectation values are restricted to observables that are first- and
  second-order in :math:`\hat{x}` and :math:`\hat{p}` only.
  This includes :class:`~.X`, :class:`~.P`, :class:`~.QuadOperator`,
  :class:`~.PolyXP`, and :class:`~.NumberOperator`.

  For second-order observables, the device **must support** :class:`~.PolyXP`.

* Variances are restricted to observables that are first-order
  in :math:`\hat{x}` and :math:`\hat{p}` only. This includes :class:`~.X`, :class:`~.P`,
  :class:`~.QuadOperator`, and *some* parameter values of :class:`~.PolyXP`.

  The device **must support** :class:`~.PolyXP`.

.. warning::

    Fock state probabilities (tapes that return :func:`~pennylane.probs` or
    expectation values of :class:`~.FockStateProjector`) are not supported.

In addition, the operations must fulfill the following requirements:

* Only Gaussian operations are differentiable.

* Non-differentiable Fock states and Fock operations may *precede* all differentiable Gaussian,
  operations. For example, the following is permissible:

  .. code-block:: python

      @qp.qnode(dev)
      def circuit(weights):
          # Non-differentiable Fock operations
          qp.FockState(np.array(2, requires_grad=False), wires=0)
          qp.Kerr(np.array(0.654, requires_grad=False), wires=1)

          # differentiable Gaussian operations
          qp.Displacement(weights[0], weights[1], wires=0)
          qp.Beamsplitter(weights[2], weights[3], wires=[0, 1])

          return qp.expval(qp.NumberOperator(0))

* If a Fock operation succeeds a Gaussian operation, the Fock operation must
  not contribute to any measurements. For example, the following is allowed:

  .. code-block:: python

      @qp.qnode(dev)
      def circuit(weights):
          qp.Displacement(weights[0], weights[1], wires=0)
          qp.Beamsplitter(weights[2], weights[3], wires=[0, 1])
          qp.Kerr(np.array(0.654, requires_grad=False), wires=1)  # there is no measurement on wire 1
          return qp.expval(qp.NumberOperator(0))

If any of the above constraints are not followed, the tape cannot be differentiated
via the CV parameter-shift rule. Please use numerical differentiation instead.

**Example**

This transform can be registered directly as the quantum gradient transform
to use during autodifferentiation:

>>> dev = qp.device("default.gaussian", wires=2)
>>> @qp.qnode(dev, diff_method="parameter-shift")
... def circuit(params):
...     qp.Squeezing(params[0], params[1], wires=[0])
...     qp.Squeezing(params[2], params[3], wires=[0])
...     return qp.expval(qp.NumberOperator(0))
>>> params = np.array([0.1, 0.2, 0.3, 0.4], requires_grad=True)
>>> qp.jacobian(circuit)(params)
array([ 0.87516064,  0.01273285,  0.88334834, -0.01273285])

.. details::
    :title: Usage Details

    This gradient transform can be applied directly to :class:`QNode <pennylane.QNode>` objects.
    However, for performance reasons, we recommend providing the gradient transform as the ``diff_method`` argument
    of the QNode decorator, and differentiating with your preferred machine learning framework.

    >>> @qp.qnode(dev)
    ... def circuit(params):
    ...     qp.Squeezing(params[0], params[1], wires=[0])
    ...     qp.Squeezing(params[2], params[3], wires=[0])
    ...     return qp.expval(qp.NumberOperator(0))
    >>> params = np.array([0.1, 0.2, 0.3, 0.4], requires_grad=True)
    >>> qp.gradients.param_shift_cv(circuit, dev)(params)
    tensor([[ 0.87516064,  0.01273285,  0.88334834, -0.01273285]], requires_grad=True)

    This quantum gradient transform can also be applied to low-level
    :class:`~.QuantumTape` objects. This will result in no implicit quantum
    device evaluation. Instead, the processed tapes, and post-processing
    function, which together define the gradient are directly returned:

    >>> r0, phi0, r1, phi1 = [0.4, -0.3, -0.7, 0.2]
    >>> ops = [qp.Squeezing(r0, phi0, wires=0), qp.Squeezing(r1, phi1, wires=0)]
    >>> tape = qp.tape.QuantumTape(ops, [qp.expval(qp.NumberOperator(0))])
    >>> gradient_tapes, fn = qp.gradients.param_shift_cv(tape, dev)
    >>> gradient_tapes
    [<QuantumTape: wires=[0], params=4>,
     <QuantumTape: wires=[0], params=4>,
     <QuantumTape: wires=[0], params=4>,
     <QuantumTape: wires=[0], params=4>]

    This can be useful if the underlying circuits representing the gradient
    computation need to be analyzed.

    The output tapes can then be evaluated and post-processed to retrieve
    the gradient:

    >>> dev = qp.device("default.gaussian", wires=2)
    >>> fn(qp.execute(gradient_tapes, dev, None))
    (-0.32487113372219933,
     -0.4054074025310772,
     -0.8704985300843778,
     0.4054074025310775)
