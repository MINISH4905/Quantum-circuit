---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/gradients/parameter_shift.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/gradients/parameter_shift.py
license: Apache-2.0
---

## Module `pennylane/gradients/parameter_shift.py`

This module contains functions for computing the parameter-shift gradient
of a qubit-based quantum tape.

## `expval_param_shift`

```python
def expval_param_shift(tape, argnum=None, shifts=None, gradient_recipes=None, f0=None, broadcast=False)
```

Generate the parameter-shift tapes and postprocessing methods required
    to compute the gradient of a gate parameter with respect to an
    expectation value.

    The returned post-processing function will output tuples instead of
stacking resaults.

    Args:
        tape (.QuantumTape): quantum tape to differentiate
        argnum (int or list[int] or None): Trainable parameter indices to differentiate
            with respect to. If not provided, the derivatives with respect to all
            trainable indices are returned. Note that the indices are with respect to
        the list of trainable parameters.
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
        broadcast (bool): Whether or not to use parameter broadcasting to create the
            a single broadcasted tape per operation instead of one tape per shift angle.

    Returns:
        tuple[list[QuantumTape], function]: A tuple containing a
        list of generated tapes, together with a post-processing
        function to be applied to the results of the evaluated tapes
        in order to obtain the Jacobian matrix.

## `var_param_shift`

```python
def var_param_shift(tape, argnum, shifts=None, gradient_recipes=None, f0=None, broadcast=False)
```

Generate the parameter-shift tapes and postprocessing methods required
to compute the gradient of a gate parameter with respect to a
variance value.

The post-processing function returns a tuple instead of stacking results.

Args:
    tape (.QuantumTape): quantum tape to differentiate
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
    broadcast (bool): Whether or not to use parameter broadcasting to create the
        a single broadcasted tape per operation instead of one tape per shift angle.

Returns:
    tuple[list[QuantumTape], function]: A tuple containing a
    list of generated tapes, together with a post-processing
    function to be applied to the results of the evaluated tapes
    in order to obtain the Jacobian matrix.

## `param_shift`

```python
def param_shift(tape: QuantumScript, argnum=None, shifts=None, gradient_recipes=None, fallback_fn=finite_diff, f0=None, broadcast=False) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Transform a circuit to compute the parameter-shift gradient of all gate
parameters with respect to its inputs.

Args:
    tape (QNode or QuantumTape): quantum circuit to differentiate
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
    broadcast (bool): Whether or not to use parameter broadcasting to create
        a single broadcasted tape per operation instead of one tape per shift angle.

Returns:
    qnode (QNode) or tuple[List[QuantumTape], function]:

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`. Executing this circuit
    will provide the Jacobian in the form of a tensor, a tuple, or a nested tuple depending upon the nesting
    structure of measurements in the original circuit.

For a variational evolution :math:`U(\mathbf{p}) \vert 0\rangle` with
:math:`N` parameters :math:`\mathbf{p}`,
consider the expectation value of an observable :math:`O`:

.. math::

    f(\mathbf{p})  = \langle \hat{O} \rangle(\mathbf{p}) = \langle 0 \vert
    U(\mathbf{p})^\dagger \hat{O} U(\mathbf{p}) \vert 0\rangle.


The gradient of this expectation value can be calculated via the parameter-shift rule:

.. math::

    \frac{\partial f}{\partial \mathbf{p}} = \sum_{\mu=1}^{2R}
    f\left(\mathbf{p}+\frac{2\mu-1}{2R}\pi\right)
    \frac{(-1)^{\mu-1}}{4R\sin^2\left(\frac{2\mu-1}{4R}\pi\right)}

Here, :math:`R` is the number of frequencies with which the parameter :math:`\mathbf{p}`
enters the function :math:`f` via the operation :math:`U`, and we assumed that these
frequencies are equidistant.
For more general shift rules, both regarding the shifts and the frequencies, and
for more technical details, see
`Vidal and Theis (2018) <https://arxiv.org/abs/1812.06323>`_ and
`Wierichs et al. (2022) <https://doi.org/10.22331/q-2022-03-30-677>`_.

**Gradients of variances**

For a variational evolution :math:`U(\mathbf{p}) \vert 0\rangle` with
:math:`N` parameters :math:`\mathbf{p}`,
consider the variance of an observable :math:`O`:

.. math::

    g(\mathbf{p})=\langle \hat{O}^2 \rangle (\mathbf{p}) - [\langle \hat{O}
    \rangle(\mathbf{p})]^2.

We can relate this directly to the parameter-shift rule by noting that

.. math::

    \frac{\partial g}{\partial \mathbf{p}}= \frac{\partial}{\partial
    \mathbf{p}} \langle \hat{O}^2 \rangle (\mathbf{p})
    - 2 f(\mathbf{p}) \frac{\partial f}{\partial \mathbf{p}}.

The derivatives in the expression on the right hand side can be computed via
the shift rule as above, allowing for the computation of the variance derivative.

In the case where :math:`O` is involutory (:math:`\hat{O}^2 = I`), the first
term in the above expression vanishes, and we are simply left with

.. math::

  \frac{\partial g}{\partial \mathbf{p}} = - 2 f(\mathbf{p})
  \frac{\partial f}{\partial \mathbf{p}}.

**Example**

This transform can be registered directly as the quantum gradient transform
to use during autodifferentiation:

.. code-block:: python

    from pennylane import numpy as np

    dev = qp.device("default.qubit")
    @qp.qnode(dev, interface="autograd", diff_method="parameter-shift")
    def circuit(params):
        qp.RX(params[0], wires=0)
        qp.RY(params[1], wires=0)
        qp.RX(params[2], wires=0)
        return qp.expval(qp.Z(0))

>>> params = np.array([0.1, 0.2, 0.3], requires_grad=True)
>>> qp.jacobian(circuit)(params)
array([-0.3875172 , -0.18884787, -0.38355704])

When differentiating QNodes with multiple measurements using Autograd or TensorFlow, the outputs of the QNode first
need to be stacked. The reason is that those two frameworks only allow differentiating functions with array or
tensor outputs, instead of functions that output sequences. In contrast, Jax and Torch require no additional
post-processing.

.. code-block:: python

    import jax

    dev = qp.device("default.qubit")
    @qp.qnode(dev, interface="jax", diff_method="parameter-shift")
    def circuit(params):
        qp.RX(params[0], wires=0)
        qp.RY(params[1], wires=0)
        qp.RX(params[2], wires=0)
        return qp.expval(qp.Z(0)), qp.var(qp.Z(0))

>>> params = jax.numpy.array([0.1, 0.2, 0.3])
>>> jax.jacobian(circuit)(params)
(Array([-0.3875172 , -0.18884787, -0.38355704], dtype=float64),
 Array([0.69916862, 0.34072424, 0.69202359], dtype=float64))

.. note::

    ``param_shift`` performs multiple attempts to obtain the gradient recipes for
    each operation:

    - If an operation has a custom :attr:`~.operation.Operation.grad_recipe` defined,
      it is used.

    - If :attr:`~.operation.Operation.parameter_frequencies` yields a result, the frequencies
      are used to construct the general parameter-shift rule via
      :func:`.generate_shift_rule`.
      Note that by default, the generator is used to compute the parameter frequencies
      if they are not provided via a custom implementation.

    That is, the order of precedence is :attr:`~.operation.Operation.grad_recipe`, custom
    :attr:`~.operation.Operation.parameter_frequencies`, and finally
    :meth:`~.operation.Operation.generator` via the default implementation of the frequencies.

.. warning::

    Note that as the option ``broadcast=True`` adds a broadcasting dimension, it is not compatible
    with circuits that are already broadcasted.
    In addition, operations with trainable parameters are required to support broadcasting.
    One way to check this is through the ``supports_broadcasting`` attribute:

    >>> qp.RX in qp.ops.qubit.attributes.supports_broadcasting
    True

.. details::
    :title: Usage Details

    This gradient transform can be applied directly to :class:`QNode <pennylane.QNode>` objects.
    However, for performance reasons, we recommend providing the gradient transform as the ``diff_method`` argument
    of the QNode decorator, and differentiating with your preferred machine learning framework.

    .. code-block:: python

        @qp.qnode(dev)
        def circuit(params):
            qp.RX(params[0], wires=0)
            qp.RY(params[1], wires=0)
            qp.RX(params[2], wires=0)
            return qp.expval(qp.Z(0)), qp.var(qp.Z(0))

    >>> qp.gradients.param_shift(circuit)(params)
    (Array([-0.3875172 , -0.18884787, -0.38355704], dtype=float64),
     Array([0.69916862, 0.34072424, 0.69202359], dtype=float64))

    This quantum gradient transform can also be applied to low-level
    :class:`~.QuantumTape` objects. This will result in no implicit quantum
    device evaluation. Instead, the processed tapes, and post-processing
    function, which together define the gradient are directly returned:

    >>> ops = [qp.RX(params[0], 0), qp.RY(params[1], 0), qp.RX(params[2], 0)]
    >>> measurements = [qp.expval(qp.Z(0)), qp.var(qp.Z(0))]
    >>> tape = qp.tape.QuantumTape(ops, measurements)
    >>> gradient_tapes, fn = qp.gradients.param_shift(tape)
    >>> gradient_tapes
    [<QuantumScript: wires=[0], params=3>,
     <QuantumScript: wires=[0], params=3>,
     <QuantumScript: wires=[0], params=3>,
     <QuantumScript: wires=[0], params=3>,
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
    >>> qp.gradients.param_shift(tape, argnum=1)

    The code above will differentiate the third parameter rather than the second.

    The output tapes can then be evaluated and post-processed to retrieve
    the gradient:

    >>> dev = qp.device("default.qubit")
    >>> fn(qp.execute(gradient_tapes, dev, None))
    ((Array(-0.3875172, dtype=float64),
      Array(-0.18884787, dtype=float64),
      Array(-0.38355704, dtype=float64)),
     (Array(0.69916862, dtype=float64),
      Array(0.34072424, dtype=float64),
      Array(0.69202359, dtype=float64)))

    This gradient transform is compatible with devices that use shot vectors for execution.

    .. code-block:: python

        shots = (10, 100, 1000)
        dev = qp.device("default.qubit")

        @qp.set_shots(shots=shots)
        @qp.qnode(dev)
        def circuit(params):
            qp.RX(params[0], wires=0)
            qp.RY(params[1], wires=0)
            qp.RX(params[2], wires=0)
            return qp.expval(qp.Z(0)), qp.var(qp.Z(0))

    >>> params = np.array([0.1, 0.2, 0.3], requires_grad=True)
    >>> qp.gradients.param_shift(circuit)(params)
    ((array([-0.2, -0.1, -0.4]), array([0.4, 0.2, 0.8])),
     (array([-0.4 , -0.24, -0.43]), array([0.672 , 0.4032, 0.7224])),
     (array([-0.399, -0.179, -0.387]), array([0.722988, 0.324348, 0.701244])))

    The outermost tuple contains results corresponding to each element of the shot vector.

    When setting the keyword argument ``broadcast`` to ``True``, the shifted
    circuit evaluations for each operation are batched together, resulting in
    broadcasted tapes:

    >>> params = np.array([0.1, 0.2, 0.3], requires_grad=True)
    >>> ops = [qp.RX(params[0], 0), qp.RY(params[1], 0), qp.RX(params[2], 0)]
    >>> measurements = [qp.expval(qp.Z(0))]
    >>> tape = qp.tape.QuantumTape(ops, measurements)
    >>> gradient_tapes, fn = qp.gradients.param_shift(tape, broadcast=True)
    >>> len(gradient_tapes)
    3
    >>> [t.batch_size for t in gradient_tapes]
    [2, 2, 2]

    The postprocessing function will know that broadcasting is used and handle the results accordingly:

    >>> fn(qp.execute(gradient_tapes, dev, None))
    (tensor(-0.3875172, requires_grad=True),
     tensor(-0.18884787, requires_grad=True),
     tensor(-0.38355704, requires_grad=True))

    An advantage of using ``broadcast=True`` is a speedup:

    .. code-block:: python

        import timeit
        @qp.qnode(qp.device("default.qubit"))
        def circuit(params):
            qp.RX(params[0], wires=0)
            qp.RY(params[1], wires=0)
            qp.RX(params[2], wires=0)
            return qp.expval(qp.Z(0))

    >>> number = 100
    >>> serial_call = "qp.gradients.param_shift(circuit, broadcast=False)(params)"
    >>> timeit.timeit(serial_call, globals=globals(), number=number) / number
    0.020183045039993887
    >>> broadcasted_call = "qp.gradients.param_shift(circuit, broadcast=True)(params)"
    >>> timeit.timeit(broadcasted_call, globals=globals(), number=number) / number
    0.01244492811998498

    This speedup grows with the number of shifts and qubits until all preprocessing and
    postprocessing overhead becomes negligible. While it will depend strongly on the details
    of the circuit, at least a small improvement can be expected in most cases.
    Note that ``broadcast=True`` requires additional memory by a factor of the largest
    batch_size of the created tapes.

    Shot vectors and multiple return measurements are supported with ``broadcast=True``.
