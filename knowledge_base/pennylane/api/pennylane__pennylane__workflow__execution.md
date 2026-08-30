---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/execution.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/execution.py
license: Apache-2.0
---

## Module `pennylane/workflow/execution.py`

Contains the general execute function, for executing tapes on devices with auto-
differentiation support.

## `execute`

```python
def execute(tapes: QuantumScriptBatch, device: SupportedDeviceAPIs, diff_method: Callable | SupportedDiffMethods | Transform | None=None, interface: Interface | str | None=Interface.AUTO, *, grad_on_execution: bool | Literal['best']='best', cache: bool | dict | Cache | Literal['auto'] | None='auto', cachesize: int=10000, max_diff: int=1, device_vjp: bool | None=False, postselect_mode: Literal['hw-like', 'fill-shots'] | None=None, mcm_method: Literal['deferred', 'one-shot', 'tree-traversal'] | None=None, gradient_kwargs: dict | None=None, transform_program: CompilePipeline | None=None, executor_backend: ExecBackends | str | None=None) -> ResultBatch
```

A function for executing a batch of tapes on a device with compatibility for auto-differentiation.

Args:
    tapes (Sequence[.QuantumTape]): batch of tapes to execute
    device (pennylane.devices.Device): Device to use to execute the batch of tapes.
        If the device does not provide a ``batch_execute`` method,
        by default the tapes will be executed in serial.
    diff_method (Optional[str | Transform]): The gradient transform function to use
        for backward passes. If "device", the device will be queried directly
        for the gradient (if supported).
    interface (str, Interface): The interface that will be used for classical auto-differentiation.
        This affects the types of parameters that can exist on the input tapes.
        Available options include ``autograd``, ``torch``, ``tf``, ``jax``, and ``auto``.
    transform_program(.CompilePipeline): A transform program to be applied to the initial tape.
    grad_on_execution (bool, str): Whether the gradients should be computed
        on the execution or not. It only applies
        if the device is queried for the gradient; gradient transform
        functions available in ``qp.gradients`` are only supported on the backward
        pass. The 'best' option chooses automatically between the two options and is default.
    cache="auto" (str or bool or dict or Cache): Whether to cache evalulations.
        ``"auto"`` indicates to cache only when ``max_diff > 1``. This can result in
        a reduction in quantum evaluations during higher order gradient computations.
        If ``True``, a cache with corresponding ``cachesize`` is created for each batch
        execution. If ``False``, no caching is used. You may also pass your own cache
        to be used; this can be any object that implements the special methods
        ``__getitem__()``, ``__setitem__()``, and ``__delitem__()``, such as a dictionary.
    cachesize (int): the size of the cache.
    max_diff (int): If ``diff_method`` is a gradient transform, this option specifies
        the maximum number of derivatives to support. Increasing this value allows
        for higher-order derivatives to be extracted, at the cost of additional
        (classical) computational overhead during the backward pass.
    device_vjp=False (Optional[bool]): whether or not to use the device-provided Jacobian
        product if it is available.
    postselect_mode (Optional[str]): Configuration for handling shots with mid-circuit measurement
        postselection. Use ``"hw-like"`` to discard invalid shots and ``"fill-shots"`` to
        keep the same number of shots. Default is ``None``.
    mcm_method (Optional[str]): Strategy to use when executing circuits with mid-circuit measurements.
        ``"deferred"`` is ignored. If mid-circuit measurements are found in the circuit,
        the device will use ``"tree-traversal"`` if specified and the ``"one-shot"`` method
        otherwise. For usage details, please refer to the
        :doc:`dynamic quantum circuits page </introduction/dynamic_quantum_circuits>`.
    gradient_kwargs (Optional[dict]): dictionary of keyword arguments to pass when
        determining the gradients of tapes.
    executor_backend (Optional[str | ExecBackends]): concurrent task-based executor for function dispatch.
        If supported by a device, the configured executor provides an abstraction for task-based function execution, which can provide speed-ups for computationally demanding execution. Defaults to ``None``.


Returns:
    list[tensor_like[float]]: A nested list of tape results. Each element in
    the returned list corresponds in order to the provided tapes.

**Example**

Consider the following cost function:

.. code-block:: python

    dev = qp.device("lightning.qubit", wires=2)

    def cost_fn(params, x):
        ops1 = [qp.RX(params[0], wires=0), qp.RY(params[1], wires=0)]
        measurements1 = [qp.expval(qp.Z(0))]
        tape1 = qp.tape.QuantumTape(ops1, measurements1)

        ops2 = [
            qp.RX(params[2], wires=0),
            qp.RY(x[0], wires=1),
            qp.CNOT(wires=(0,1))
        ]
        measurements2 = [qp.probs(wires=0)]
        tape2 = qp.tape.QuantumTape(ops2, measurements2)

        tapes = [tape1, tape2]

        # execute both tapes in a batch on the given device
        res = qp.execute(tapes, dev, diff_method=qp.gradients.param_shift, max_diff=2)

        return res[0] + res[1][0] - res[1][1]

In this cost function, two **independent** quantum tapes are being
constructed; one returning an expectation value, the other probabilities.
We then batch execute the two tapes, and reduce the results to obtain
a scalar.

Let's execute this cost function while tracking the gradient:

>>> params = pnp.array([0.1, 0.2, 0.3], requires_grad=True)
>>> x = pnp.array([0.5], requires_grad=True)
>>> print(cost_fn(params, x))
1.93...

Since the ``execute`` function is differentiable, we can
also compute the gradient:

>>> print(qp.grad(cost_fn)(params, x)) # doctest: +SKIP
(array([-0.0978434 , -0.19767681, -0.29552021]), array([5.37764278e-17]))

Finally, we can also compute any nth-order derivative. Let's compute the Jacobian
of the gradient (that is, the Hessian):

>>> x.requires_grad = False
>>> print(qp.jacobian(qp.grad(cost_fn))(params, x)) # doctest: +SKIP
[[-0.97517033  0.01983384  0.        ]
 [ 0.01983384 -0.97517033  0.        ]
 [ 0.          0.         -0.95533649]]
