---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/qnode.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/qnode.py
license: Apache-2.0
---

## Module `pennylane/workflow/qnode.py`

This module contains the QNode class and qnode decorator.

## `QNode`

```python
class QNode
```

Represents a quantum node in the hybrid computational graph.

A *quantum node* contains a :ref:`quantum function <intro_vcirc_qfunc>` (corresponding to
a `variational circuit <https://pennylane.ai/qml/glossary/variational_circuit>`__)
and the computational device it is executed on.

The QNode calls the quantum function to construct a :class:`~.QuantumTape` instance representing
the quantum circuit.

Args:
    func (Callable): a quantum function
    device (~.Device): a PennyLane-compatible device
    interface (str): The interface that will be used for classical backpropagation.
        This affects the types of objects that can be passed to/returned from the QNode. See
        ``qp.math.SUPPORTED_INTERFACE_USER_INPUT`` for a list of all accepted strings.

        * ``"autograd"``: Allows autograd to backpropagate
          through the QNode. The QNode accepts default Python types
          (floats, ints, lists, tuples, dicts) as well as NumPy array arguments,
          and returns NumPy arrays.

        * ``"torch"``: Allows PyTorch to backpropagate
          through the QNode. The QNode accepts and returns Torch tensors.

        * ``"tf"``: Allows TensorFlow in eager mode to backpropagate
          through the QNode. The QNode accepts and returns
          TensorFlow ``tf.Variable`` and ``tf.tensor`` objects.

        * ``"jax"``: Allows JAX to backpropagate
          through the QNode. The QNode accepts and returns
          JAX ``Array`` objects.

        * ``None``: The QNode accepts default Python types
          (floats, ints, lists, tuples, dicts) as well as NumPy array arguments,
          and returns NumPy arrays. It does not connect to any
          machine learning library automatically for backpropagation.

        * ``"auto"``: The QNode automatically detects the interface from the input values of
          the quantum function.

    diff_method (str or .Transform): The method of differentiation to use in
        the created QNode. Can either be a :class:`~.Transform`, which includes all
        quantum gradient transforms in the :mod:`qp.gradients <.gradients>` module, or a string. The following
        strings are allowed:

        * ``"best"``: Best available method. Uses classical backpropagation or the
          device directly to compute the gradient if supported, otherwise will use
          the analytic parameter-shift rule where possible with finite-difference as a fallback.

        * ``"device"``: Queries the device directly for the gradient.
          Only allowed on devices that provide their own gradient computation.

        * ``"backprop"``: Use classical backpropagation. Only allowed on
          simulator devices that are classically end-to-end differentiable,
          for example :class:`default.qubit <~.DefaultQubit>`. Note that
          the returned QNode can only be used with the machine-learning
          framework supported by the device.

        * ``"adjoint"``: Uses an `adjoint method <https://arxiv.org/abs/2009.02823>`__ that
          reverses through the circuit after a forward pass by iteratively applying the inverse
          (adjoint) gate. Only allowed on supported simulator devices such as
          :class:`default.qubit <~.DefaultQubit>`.

        * ``"parameter-shift"``: Use the analytic parameter-shift
          rule for all supported quantum operation arguments, with finite-difference
          as a fallback.

        * ``"hadamard"``: Use the standard analytic hadamard gradient test rule for
          all supported quantum operation arguments. More info is in the documentation
          for :func:`qp.gradients.hadamard_grad <.gradients.hadamard_grad>`. Reversed,
          direct, and reversed-direct modes can be selected via a ``"mode"`` in ``gradient_kwargs``.

        * ``"finite-diff"``: Uses numerical finite-differences for all quantum operation
          arguments.

        * ``"spsa"``: Uses a simultaneous perturbation of all operation arguments to approximate
          the derivative.

        * ``None``: QNode cannot be differentiated. Works the same as ``interface=None``.

    grad_on_execution (bool, str): Whether the gradients should be computed on the execution or not.
        Only applies if the device is queried for the gradient; gradient transform
        functions available in ``qp.gradients`` are only supported on the backward
        pass. The 'best' option chooses automatically between the two options and is default.
    cache="auto" (str or bool or dict or Cache): Whether to cache evalulations.
        ``"auto"`` indicates to cache only when ``max_diff > 1``. This can result in
        a reduction in quantum evaluations during higher order gradient computations.
        If ``True``, a cache with corresponding ``cachesize`` is created for each batch
        execution. If ``False``, no caching is used. You may also pass your own cache
        to be used; this can be any object that implements the special methods
        ``__getitem__()``, ``__setitem__()``, and ``__delitem__()``, such as a dictionary.
    cachesize (int): The size of any auto-created caches. Only applies when ``cache=True``.
    max_diff (int): If ``diff_method`` is a gradient transform, this option specifies
        the maximum number of derivatives to support. Increasing this value allows
        for higher order derivatives to be extracted, at the cost of additional
        (classical) computational overhead during the backwards pass.
    device_vjp (bool): Whether or not to use the device-provided Vector Jacobian Product (VJP).
        A value of ``None`` indicates to use it if the device provides it, but use the full jacobian otherwise.
    postselect_mode (str | None): Configuration for handling shots with mid-circuit measurement postselection. If
        ``"hw-like"``, invalid shots will be discarded and only results for valid shots will be returned.
        If ``"fill-shots"``, results corresponding to the original number of shots will be returned. The
        default is ``None``, in which case the device will automatically choose the best configuration. For
        usage details, please refer to the :doc:`dynamic quantum circuits page </introduction/dynamic_quantum_circuits>`.
    mcm_method (str | None): The strategy for applying mid-circuit measurements.
        Available methods include ``"deferred"`` (to use the deferred
        measurement principle), ``"one-shot"`` (to execute the circuit
        for each shot separately when using finite shots), and
        ``"tree-traversal"`` (visits the tree of possible MCM sequences,
        only supported on ``default.qubit`` and ``lightning.qubit``).
        If not provided, the device will select the method automatically.
        For usage details, refer to the :doc:`dynamic quantum circuits page </introduction/dynamic_quantum_circuits>`.
    gradient_kwargs (dict): A dictionary of keyword arguments that are passed to the differentiation
        method. Please refer to the :mod:`qp.gradients <.gradients>` module for details
        on supported options for your chosen gradient transform.
    static_argnums (int | Sequence[int]): *Only applicable when the experimental capture mode is enabled.*
        An ``int`` or collection of ``int``\ s that specify which positional arguments to treat as static.
    executor_backend (ExecBackends | str): The backend executor for concurrent function execution. This argument
        allows for selective control of how to run data-parallel/task-based parallel functions via a defined execution
        environment. All supported options can be queried using
        :func:`qp.concurrency.executors.get_supported_backends <.concurrency.executors.get_supported_backends>`.
        The default value is :class:`~.concurrency.executors.native.multiproc.MPPoolExec`.

**Example**

QNodes can be created by decorating a quantum function:

>>> dev = qp.device("default.qubit", wires=1)
>>> @qp.qnode(dev)
... def circuit(x):
...     qp.RX(x, wires=0)
...     return qp.expval(qp.Z(0))

or by instantiating the class directly:

>>> def circuit(x):
...     qp.RX(x, wires=0)
...     return qp.expval(qp.Z(0))
>>> dev = qp.device("default.qubit", wires=1)
>>> qnode = qp.QNode(circuit, dev)

.. details::
    :title: Parameter broadcasting
    :href: parameter-broadcasting

    QNodes can be executed simultaneously for multiple parameter settings, which is called
    *parameter broadcasting* or *parameter batching*.
    We start with a simple example and briefly look at the scenarios in which broadcasting is
    possible and useful. Finally we give rules and conventions regarding the usage of
    broadcasting, together with some more complex examples.
    Also see the :class:`~.pennylane.operation.Operator` documentation for implementation
    details.

    **Example**

    Again consider the following ``circuit``:

    >>> dev = qp.device("default.qubit", wires=1)
    >>> @qp.qnode(dev)
    ... def circuit(x):
    ...     qp.RX(x, wires=0)
    ...     return qp.expval(qp.Z(0))

    If we want to execute it at multiple values ``x``,
    we may pass those as a one-dimensional array to the QNode:

    >>> x = np.array([np.pi / 6, np.pi * 3 / 4, np.pi * 7 / 6])
    >>> circuit(x)
    array([ 0.866... , -0.707..., -0.866...])

    The resulting array contains the QNode evaluations at the single values:

    >>> [circuit(x_val) for x_val in x]
    [np.float64(0.866...), np.float64(-0.707...), np.float64(-0.866...)]

    In addition to the results being stacked into one ``tensor`` already, the broadcasted
    execution actually is performed in one simulation of the quantum circuit, instead of
    three sequential simulations.

    **Benefits & Supported QNodes**

    Parameter broadcasting can be useful to simplify the execution syntax with QNodes. More
    importantly though, the simultaneous execution via broadcasting can be significantly
    faster than iterating over parameters manually. If we compare the execution time for the
    above QNode ``circuit`` between broadcasting and manual iteration for an input size of
    ``100``, we find a speedup factor of about :math:`30`.
    This speedup is a feature of classical simulators, but broadcasting may reduce
    the communication overhead for quantum hardware devices as well.

    A QNode supports broadcasting if all operators that receive broadcasted parameters do so.
    (Operators that are used in the circuit but do not receive broadcasted inputs do not need
    to support it.) A list of supporting operators is available in
    :obj:`~.pennylane.ops.qubit.attributes.supports_broadcasting`.
    Whether or not broadcasting delivers an increased performance will depend on whether the
    used device is a classical simulator and natively supports this.

    If a device does not natively support broadcasting, it will execute broadcasted QNode calls
    by expanding the input arguments into separate executions. That is, every device can
    execute QNodes with broadcasting, but only supporting devices will benefit from it.

    **Usage**

    The first example above is rather simple. Broadcasting is possible in more complex
    scenarios as well, for which it is useful to understand the concept in more detail.
    The following rules and conventions apply:

    *There is at most one broadcasting axis*

    The broadcasted input has (exactly) one more axis than the operator(s) which receive(s)
    it would usually expect. For example, most operators expect a single scalar input and the
    *broadcasted* input correspondingly is a 1D array:

    >>> x = np.array([1., 2., 3.])
    >>> op = qp.RX(x, wires=0) # Additional axis of size 3.

    An operator ``op`` that supports broadcasting indicates the expected number of
    axes--or dimensions--in its attribute ``op.ndim_params``. This attribute is a tuple with
    one integer per argument of ``op``. The batch size of a broadcasted operator is stored
    in ``op.batch_size``:

    >>> op.ndim_params # RX takes one scalar input.
    (0,)
    >>> op.batch_size # The broadcasting axis has size 3.
    3

    The broadcasting axis is always the leading axis of an argument passed to an operator:

    >>> from scipy.stats import unitary_group
    >>> U = np.stack([unitary_group.rvs(4) for _ in range(3)])
    >>> U.shape # U stores three two-qubit unitaries, each of shape 4x4
    (3, 4, 4)
    >>> op = qp.QubitUnitary(U, wires=[0, 1])
    >>> op.batch_size
    3

    Stacking multiple broadcasting axes is *not* supported.

    *Multiple operators are broadcasted simultaneously*

    It is possible to broadcast multiple parameters simultaneously. In this case, the batch
    size of the broadcasting axes must match, and the parameters are combined like in Python's
    ``zip`` function. Non-broadcasted parameters do not need
    to be augmented manually but can simply be used as one would in individual QNode
    executions:

    .. code-block:: python

        @qp.qnode(qp.device("default.qubit", wires=4))
        def circuit(x, y, U):
            qp.QubitUnitary(U, wires=[0, 1, 2, 3])
            qp.RX(x, wires=0)
            qp.RY(y, wires=1)
            qp.RX(x, wires=2)
            qp.RY(y, wires=3)
            return qp.expval(qp.Z(0) @ qp.X(1) @ qp.Z(2) @ qp.Z(3))

        x = np.array([0.4, 2.1, -1.3])
        y = 2.71
        gates = [qp.X(0), qp.Y(1), qp.Z(3)]
        U = np.stack([g.matrix(wire_order=range(4)) for g in gates])

    This circuit takes three arguments, and the first two are used twice each. ``x`` and
    ``U`` will lead to a batch size of ``3`` for the ``RX`` rotations and the multi-qubit
    unitary, respectively. The input ``y`` is a ``float`` value and will be used together with
    all three values in ``x`` and ``U``. We obtain three output values:

    >>> result = circuit(x, y, U)
    >>> result
    array([ 0.322...,  0.0968..., -0.027...])

    This is equivalent to iterating over all broadcasted arguments using ``zip``:

    >>> [circuit(x_val, y, U_val) for x_val, U_val in zip(x, U)]
    [np.float64(0.322...), np.float64(0.0968...), np.float64(-0.0271...)]

    In the same way it is possible to broadcast multiple arguments of a single operator,
    for example:

    >>> qp.Rot.ndim_params # Rot takes three scalar arguments
    (0, 0, 0)
    >>> x = np.array([0.4, 2.3, -0.1]) # Broadcast the first argument with size 3
    >>> y = 1.6 # Do not broadcast the second argument
    >>> z = np.array([1.2, -0.5, 2.5]) # Broadcast the third argument with size 3
    >>> op = qp.Rot(x, y, z, wires=0)
    >>> op.batch_size
    3

    *Broadcasting does not modify classical processing*

    Note that classical processing in QNodes will happen *before* broadcasting is taken into
    account. This means, that while *operators* always interpret the first axis as the
    broadcasting axis, QNodes do not necessarily do so:

    .. code-block:: python

        @qp.qnode(qp.device("default.qubit"))
        def circuit_unpacking(x):
            qp.RX(x[0], wires=0)
            qp.RY(x[1], wires=1)
            qp.RZ(x[2], wires=1)
            return qp.expval(qp.Z(0) @ qp.X(1))

        x = np.array([[1, 2], [3, 4], [5, 6]])

    The prepared parameter ``x`` has shape ``(3, 2)``, corresponding to the three operations
    and a batch size of ``2``:

    >>> circuit_unpacking(x)
    array([0.021..., 0.302...])

    If we were to iterate manually over the parameter settings, we probably would put the
    batching axis in ``x`` first. This is not the behaviour with parameter broadcasting
    because it does not modify the unpacking step within the QNode, so that ``x`` is
    unpacked *first* and the unpacked elements are expected to contain the
    broadcasted parameters for each operator individually;
    if we attempted to put the broadcasting axis of size ``2`` first, the
    indexing of ``x`` would fail in the ``RZ`` rotation within the QNode.

### `__repr__`

```python
def __repr__(self) -> str
```

String representation.

### `shots`

```python
def shots(self) -> Shots
```

Default shots for execution workflows.

Note that this property is not able to be set directly; only `set_shots` can modify it.

### `interface`

```python
def interface(self) -> str
```

The interface used by the QNode

### `transform_program`

```python
def transform_program(self) -> CompilePipeline
```

The transform program used by the QNode.

.. warning::

    The ``transform_program`` property of the QNode has been renamed to ``compile_pipeline``.
    Access through ``transform_program`` will be removed in PennyLane v0.46.

### `compile_pipeline`

```python
def compile_pipeline(self) -> CompilePipeline
```

The compile pipeline used by the QNode.

### `update`

```python
def update(self, **kwargs) -> QNode
```

Returns a new QNode instance but with updated settings (e.g., a different `diff_method`). Any settings not specified will retain their original value.

.. note::
    The QNode`s transform program cannot be updated using this method.

Keyword Args:
    **kwargs: The provided keyword arguments must match that of :meth:`QNode.__init__`.
        The list of supported gradient keyword arguments can be found at ``qp.gradients.SUPPORTED_GRADIENT_KWARGS``.

Returns:
    qnode (QNode): new QNode with updated settings


Raises:
    ValueError: if provided keyword arguments are invalid

**Example**

Let's begin by defining a ``QNode`` object,

.. code-block:: python

    dev = qp.device("default.qubit")

    @qp.qnode(dev, diff_method="parameter-shift")
    def circuit(x):
        qp.RZ(x, wires=0)
        qp.CNOT(wires=[0, 1])
        qp.RY(x, wires=1)
        return qp.expval(qp.PauliZ(1))

If we wish to try out a new configuration without having to repeat the
boilerplate above, we can use the ``QNode.update`` method. For example,
we can update the differentiation method and execution arguments,

>>> new_circuit = circuit.update(diff_method="adjoint", device_vjp=True)
>>> print(new_circuit.diff_method)
adjoint
>>> print(new_circuit.execute_kwargs["device_vjp"])
True

Similarly, if we wish to re-configure the interface used for execution,

>>> new_circuit= circuit.update(interface="torch")
>>> new_circuit(1)
tensor(0.5403, dtype=torch.float64)

### `update_shots`

```python
def update_shots(self, shots: int | Shots) -> QNode
```

Update the number of shots used by the QNode.

Args:
    shots (int or Shots): The new number of shots to use.

Returns:
    qnode (QNode): new QNode with updated shots

### `construct`

```python
def construct(self, args, kwargs) -> qp.tape.QuantumScript
```

Call the quantum function with a tape context, ensuring the operations get queued.

## `qnode`

```python
def qnode(device, **kwargs) -> Callable[[Callable], QNode]
```

Docstring will be updated below.

## `apply_transform_to_qnode`

```python
def apply_transform_to_qnode(obj: QNode, transform, *targs, **tkwargs) -> QNode
```

The default behavior for applying a transform to a QNode.
