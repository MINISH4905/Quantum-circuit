---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/jacobian_products.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/jacobian_products.py
license: Apache-2.0
---

## Module `pennylane/workflow/jacobian_products.py`

Defines classes that take the vjps, jvps, and jacobians of circuits.

## `JacobianProductCalculator`

```python
class JacobianProductCalculator(abc.ABC)
```

Provides methods for calculating the JVP/VJP between the Jacobians of tapes and tangents/cotangents.

### `execute_and_compute_jvp`

```python
def execute_and_compute_jvp(self, tapes: QuantumScriptBatch, tangents: Sequence[Sequence[TensorLike]]) -> tuple[ResultBatch, tuple]
```

Calculate both the results for a batch of tapes and the jvp.

This method is required to compute JVPs in the JAX interface.

Args:
    tapes (Sequence[.QuantumScript | .QuantumTape]): The batch of tapes to take the derivatives of
    tangents (Sequence[Sequence[TensorLike]]): the tangents for the parameters of the tape.
        The ``i`` th tangent corresponds to the ``i`` th tape, and the ``j`` th entry into a
        tangent entry corresponds to the ``j`` th trainable parameter of the tape.

Returns:
    ResultBatch, TensorLike: the results of the execution and the jacobian vector product

**Examples:**

For an instance of :class:`~.JacobianProductCalculator` ``jpc``, we have:

>>> tape0 = qp.tape.QuantumScript([qp.RX(0.1, wires=0)], [qp.expval(qp.Z(0))])
>>> tape1 = qp.tape.QuantumScript([qp.RY(0.2, wires=0)], [qp.expval(qp.Z(0))])
>>> batch = (tape0, tape1)
>>> tangents0 = (1.5, )
>>> tangents1 = (2.0, )
>>> tangents = (tangents0, tangents1)
>>> device = qp.device('default.qubit')
>>> config = qp.devices.ExecutionConfig()
>>> jpc = DeviceDerivatives(device, config)
>>> results, jvps = jpc.execute_and_compute_jvp(batch, tangents)
>>> expected_results = (np.cos(0.1), np.cos(0.2))
>>> qp.math.allclose(results, expected_results)
True
>>> jvps
(array(-0.149...), array(-0.3973...))
>>> expected_jvps = 1.5 * -np.sin(0.1), 2.0 * -np.sin(0.2)
>>> qp.math.allclose(jvps, expected_jvps)
True

While this method could support non-scalar parameters in theory, no implementation currently supports
jacobians with non-scalar parameters.

### `compute_vjp`

```python
def compute_vjp(self, tapes: QuantumScriptBatch, dy: Sequence[Sequence[TensorLike]]) -> tuple
```

Compute the vjp for a given batch of tapes.

This method is used by autograd, torch, and tensorflow to compute VJPs.

Args:
    tapes (tuple[.QuantumScript]): the batch of tapes to take the derivatives of
    dy (tuple[tuple[TensorLike]]): the derivatives of the results of an execution.
        The ``i``th entry (cotangent) corresponds to the ``i`` th tape, and the ``j`` th entry of the ``i`` th
        cotangent corresponds to the ``j`` th return value of the ``i`` th tape.

Returns:
    TensorLike: the vector jacobian product.

**Examples:**

For an instance of :class:`~.JacobianProductCalculator` ``jpc``, we have:

>>> tape0 = qp.tape.QuantumScript([qp.RX(0.1, wires=0)], [qp.expval(qp.Z(0))])
>>> tape1 = qp.tape.QuantumScript([qp.RY(0.2, wires=0)], [qp.expval(qp.Z(0)), qp.expval(qp.X(0))])
>>> batch = (tape0, tape1)
>>> dy0 = (0.5, )
>>> dy1 = (2.0, 3.0)
>>> dys = (dy0, dy1)
>>> vjps = jpc.compute_vjp(batch, dys)
>>> vjps
(array([-0.049...]), array([2.542...]))
>>> expected_vjp0 = 0.5 * -np.sin(0.1)
>>> qp.math.allclose(vjps[0], expected_vjp0)
True
>>> expected_vjp1 = 2.0 * -np.sin(0.2) + 3.0 * np.cos(0.2)
>>> qp.math.allclose(vjps[1], expected_vjp1)
True

While this method could support non-scalar parameters in theory, no implementation currently supports
jacobians with non-scalar parameters.

### `compute_jacobian`

```python
def compute_jacobian(self, tapes: QuantumScriptBatch) -> tuple
```

Compute the full Jacobian for a batch of tapes.

This method is required to compute Jacobians in the ``tensorflow`` interface

Args:
    tapes (tuple[.QuantumScript]): the batch of tapes to take the derivatives of

**Examples:**

For an instance of :class:`~.JacobianProductCalculator` ``jpc``, we have:

>>> tape0 = qp.tape.QuantumScript([qp.RX(0.1, wires=0)], [qp.expval(qp.Z(0))])
>>> tape1 = qp.tape.QuantumScript([qp.RY(0.2, wires=0)], [qp.expval(qp.Z(0)), qp.expval(qp.X(0))])
>>> batch = (tape0, tape1)
>>> jpc.compute_jacobian(batch)
(array(-0.0998...), (array(-0.198...), array(0.980...)))

While this method could support non-scalar parameters in theory, no implementation currently supports
jacobians with non-scalar parameters.

### `execute_and_compute_jacobian`

```python
def execute_and_compute_jacobian(self, tapes: QuantumScriptBatch) -> tuple[ResultBatch, tuple]
```

Compute the results and the full Jacobian for a batch of tapes.

This method is required to compute Jacobians in the ``jax-jit`` interface

Args:
    tapes (tuple[.QuantumScript]): the batch of tapes to take the derivatives of

**Examples:**

For an instance of :class:`~.JacobianProductCalculator` ``jpc``, we have:

>>> tape0 = qp.tape.QuantumScript([qp.RX(0.1, wires=0)], [qp.expval(qp.Z(0))])
>>> tape1 = qp.tape.QuantumScript([qp.RY(0.2, wires=0)], [qp.expval(qp.Z(0)), qp.expval(qp.X(0))])
>>> batch = (tape0, tape1)
>>> results, jacs = jpc.execute_and_compute_jacobian(batch)
>>> results
(np.float64(0.995...), (np.float64(0.980...), np.float64(0.198...)))
>>> jacs
(array(-0.099...), (array(-0.198...), array(0.980...)))

While this method could support non-scalar parameters in theory, no implementation currently supports
jacobians with non-scalar parameters.

## `NoGradients`

```python
class NoGradients(JacobianProductCalculator)
```

A jacobian product calculator that raises errors when a vjp or jvp is requested.

## `TransformJacobianProducts`

```python
class TransformJacobianProducts(JacobianProductCalculator)
```

Compute VJPs, JVPs and Jacobians via a gradient transform :class:`~.Transform`.

Args:
    inner_execute (Callable[[Tuple[QuantumTape]], ResultBatch]): a function that
        executes the batch of circuits and returns their results.
    gradient_transform (.Transform): the gradient transform to use.
    gradient_kwargs (dict): Any keyword arguments for the gradient transform.

Keyword Args:
    cache_full_jacobian=False (bool): Whether or not to compute the full jacobian and cache it,
        instead of treating each call as independent. This keyword argument is used to patch problematic
        autograd behaviour when caching is turned off. In this case, caching will be based on the identity
        of the batch, rather than the potentially expensive :attr:`~.QuantumScript.hash` that is used
        by the cache.

>>> inner_execute = qp.device('default.qubit').execute
>>> gradient_transform = qp.gradients.param_shift
>>> kwargs = {"broadcast": True}
>>> jpc = TransformJacobianProducts(inner_execute, gradient_transform, kwargs)

## `DeviceDerivatives`

```python
class DeviceDerivatives(JacobianProductCalculator)
```

Calculate jacobian products via a device provided jacobian.  This class relies on
``qp.devices.Device.compute_derivatives``.

Args:

    device (pennylane.devices.Device): the device for execution and derivatives.
        Must support first order gradients with the requested configuration.
    execution_config (pennylane.devices.ExecutionConfig): a datastructure containing the options needed to fully
       describe the execution. Only used with :class:`pennylane.devices.Device` from the new device interface.

**Examples:**

>>> device = qp.device('default.qubit')
>>> config = qp.devices.ExecutionConfig(gradient_method="adjoint")
>>> jpc = DeviceDerivatives(device, config)

This same class can also be used with the old device interface.

>>> device = qp.device('lightning.qubit', wires=5)
>>> gradient_kwargs = {"method": "adjoint_jacobian"}
>>> config = qp.devices.ExecutionConfig(gradient_keyword_arguments=gradient_kwargs)
>>> jpc_lightning = DeviceDerivatives(device, config)

**Technical comments on caching and calculating the gradients on execution:**

In order to store results and Jacobians for the backward pass during the forward pass,
the ``_jacs_cache`` and ``_results_cache`` properties are ``LRUCache`` objects with a maximum size of 10.
In the current execution pipeline, only one batch will be used per instance, but a size of 10 adds some extra
flexibility for future uses.

Note that batches of identically looking :class:`~.QuantumScript` s that are different instances will be cached separately.
This is because the ``hash`` of  :class:`~.QuantumScript` is expensive, as it requires inspecting all its constituents,
which is not worth the effort in this case.

When a forward pass with :meth:`~.execute_and_cache_jacobian` is called, both the results and the jacobian for the object are stored.

>>> tape = qp.tape.QuantumScript([qp.RX(1.0, wires=0)], [qp.expval(qp.Z(0))])
>>> batch = (tape,)
>>> with device.tracker:
...     results = jpc.execute_and_cache_jacobian(batch)
>>> results
(np.float64(0.540...,)
>>> jpc._jacs_cache
LRUCache({(<QuantumScript: wires=[0], params=1>,): (array(-0.841...),)}, maxsize=10, currsize=1)

Then when the vjp, jvp, or jacobian is requested, that cached value is used instead of requesting from
the device again.

>>> with device.tracker:
...     vjp = jpc.compute_vjp(batch , (0.5, ) )
>>> device.tracker.totals
{}
>>> vjp
(array([-0.4207...]),)

### `execute_and_cache_jacobian`

```python
def execute_and_cache_jacobian(self, tapes: QuantumScriptBatch)
```

Forward pass used to cache the results and jacobians.

Args:
    tapes (tuple[`~.QuantumScript`]): the batch of tapes to execute and take derivatives of

Returns:
    ResultBatch: the results of the execution.

Side Effects:
    Caches both the results and jacobian into ``_results_cache`` and ``_jacs_cache``.

### `execute_and_compute_jvp`

```python
def execute_and_compute_jvp(self, tapes: QuantumScriptBatch, tangents)
```

Calculate both the results for a batch of tapes and the jvp.

This method is required to compute JVPs in the JAX interface.

Args:
    tapes (tuple[`~.QuantumScript`]): The batch of tapes to take the derivatives of
    tangents (Sequence[Sequence[TensorLike]]): the tangents for the parameters of the tape.
        The ``i`` th tangent corresponds to the ``i`` th tape, and the ``j`` th entry into a
        tangent entry corresponds to the ``j`` th trainable parameter of the tape.

Returns:
    ResultBatch, TensorLike: the results of the execution and the jacobian vector product

Side Effects:
    caches newly computed results or jacobians if they were not already cached.

**Examples:**

For an instance of :class:`~.DeviceDerivatives` ``jpc``, we have:

>>> tape0 = qp.tape.QuantumScript([qp.RX(0.1, wires=0)], [qp.expval(qp.Z(0))])
>>> tape1 = qp.tape.QuantumScript([qp.RY(0.2, wires=0)], [qp.expval(qp.Z(0))])
>>> batch = (tape0, tape1)
>>> tangents0 = (1.5, )
>>> tangents1 = (2.0, )
>>> tangents = (tangents0, tangents1)
>>> results, jvps = jpc.execute_and_compute_jvp(batch, tangents)
>>> expected_results = (np.cos(0.1), np.cos(0.2))
>>> qp.math.allclose(results, expected_results)
True
>>> jvps
(array(-0.149...), array(-0.397...))
>>> expected_jvps = 1.5 * -np.sin(0.1), 2.0 * -np.sin(0.2)
>>> qp.math.allclose(jvps, expected_jvps)
True

While this method could support non-scalar parameters in theory, no implementation currently supports
jacobians with non-scalar parameters.

### `compute_vjp`

```python
def compute_vjp(self, tapes, dy)
```

Compute the vjp for a given batch of tapes.

This method is used by autograd, torch, and tensorflow to compute VJPs.

Args:
    tapes (tuple[`~.QuantumScript`]): the batch of tapes to take the derivatives of
    dy (tuple[tuple[TensorLike]]): the derivatives of the results of an execution.
        The ``i`` th entry (cotangent) corresponds to the ``i`` th tape, and the ``j`` th entry of the ``i`` th
        cotangent corresponds to the ``j`` th return value of the ``i`` th tape.

Returns:
    TensorLike: the vector jacobian product.

Side Effects:
    caches the newly computed jacobian if it wasn't already present in the cache.

**Examples:**

For an instance of :class:`~.DeviceDerivatives` ``jpc``, we have:

>>> tape0 = qp.tape.QuantumScript([qp.RX(0.1, wires=0)], [qp.expval(qp.Z(0))])
>>> tape1 = qp.tape.QuantumScript([qp.RY(0.2, wires=0)], [qp.expval(qp.Z(0)), qp.expval(qp.X(0))])
>>> batch = (tape0, tape1)
>>> dy0 = (0.5, )
>>> dy1 = (2.0, 3.0)
>>> dys = (dy0, dy1)
>>> vjps = jpc.compute_vjp(batch, dys)
>>> vjps
(array([-0.0499...]), array([2.54...]))
>>> expected_vjp0 = 0.5 * -np.sin(0.1)
>>> qp.math.allclose(vjps[0], expected_vjp0)
True
>>> expected_jvp1 = 2.0 * -np.sin(0.2) + 3.0 * np.cos(0.2)
>>> qp.math.allclose(vjps[1], expected_vjp1)
True

While this method could support non-scalar parameters in theory, no implementation currently supports
jacobians with non-scalar parameters.

### `compute_jacobian`

```python
def compute_jacobian(self, tapes)
```

Compute the full Jacobian for a batch of tapes.

This method is required to compute Jacobians in the ``jax-jit`` interface

Args:
    tapes: the batch of tapes to take the Jacobian of

Returns:
    TensorLike: the full jacobian

Side Effects:
    caches the newly computed jacobian if it wasn't already present in the cache.

**Examples:**

For an instance of :class:`~.DeviceDerivatives` ``jpc``, we have:

>>> tape0 = qp.tape.QuantumScript([qp.RX(0.1, wires=0)], [qp.expval(qp.Z(0))])
>>> tape1 = qp.tape.QuantumScript([qp.RY(0.2, wires=0)], [qp.expval(qp.Z(0)), qp.expval(qp.X(0))])
>>> batch = (tape0, tape1)
>>> jpc.compute_jacobian(batch)
(array(-0.0998...), (array(-0.198...), array(0.980...)))

While this method could support non-scalar parameters in theory, no implementation currently supports
jacobians with non-scalar parameters.

## `DeviceJacobianProducts`

```python
class DeviceJacobianProducts(JacobianProductCalculator)
```

Compute jacobian products using the native device methods.

Args:
    device (pennylane.devices.Device): the device for execution and derivatives.
        Must define both the vjp and jvp.
    execution_config (pennylane.devices.ExecutionConfig): a datastructure containing the options needed to fully
       describe the execution.

>>> dev = qp.device('default.qubit')
>>> config = qp.devices.ExecutionConfig(gradient_method="adjoint")
>>> jpc = DeviceJacobianProducts(dev, config)

This class relies on :meth:`~.devices.Device.compute_vjp` and :meth:`~.devices.Device.execute_and_compute_jvp`,
and works strictly for the newer device interface :class:`~.devices.Device`.  This contrasts :class:`~.DeviceDerivatives`
which works for both device interfaces and requests the full jacobian from the device.
