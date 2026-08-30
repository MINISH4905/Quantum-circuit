---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/device_api.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/device_api.py
license: Apache-2.0
---

## Module `pennylane/devices/device_api.py`

This module contains the Abstract Base Class for the next generation of devices.

## `Device`

```python
class Device(abc.ABC)
```

A device driver that can control one or more backends. A backend can be either a physical
Quantum Processing Unit or a virtual one such as a simulator.

Only the ``execute`` method must be defined to construct a device driver.

.. details::
    :title: Design Motivation

    **Streamlined interface:** Only methods that are required to interact with the rest of PennyLane will be placed in the
    interface. Developers will be able to clearly see what they can change while still having a fully functional device.

    **Reduction of duplicate methods:** Methods that solve similar problems are combined. Only one place will have
    to solve each individual problem.

    **Support for dynamic execution configurations:** Properties such as shots belong to specific executions.

    **Greater coverage for differentiation methods:** Devices can define any order of derivative, the vector jacobian product,
    or the jacobian vector product.  Calculation of derivatives can be done at the same time as execution to allow reuse of intermediate
    results.

.. details::
    :title: Porting from the old interface

    :meth:`pennylane.devices.LegacyDevice.batch_execute` and :meth:`~pennylane.devices.LegacyDevice.execute` are now a single method, :meth:`~.Device.execute`

    :meth:`~.Device.batch_transform` and :meth:`~.Device.expand_fn` are now a single method, :meth:`~.Device.preprocess`

    Shot information is no longer stored on the device, but instead specified on individual input :class:`~.QuantumTape`.

    The old devices defined a :meth:`~.Device.capabilities` dictionary that defined characteristics of the devices and controlled various
    preprocessing and validation steps, such as ``"supports_broadcasting"``.  These capabilities should now be handled by the
    :meth:`~.Device.preprocess` method. For example, if a device does not support broadcasting, ``preprocess`` should
    split a quantum script with broadcasted parameters into a batch of quantum scripts. If the device does not support mid circuit
    measurements, then ``preprocess`` should apply :func:`~.defer_measurements`.  A set of default preprocessing steps will be available
    to make a seamless transition to the new interface.

    A class will be provided to easily construct default preprocessing steps from supported operations, supported observables,
    supported measurement processes, and various capabilities.

    Utility functions will be added to the ``devices`` module to query whether or not the device driver can do certain things, such
    as ``devices.supports_operator(op, dev, native=True)``. These functions will work by checking the behaviour of :meth:`~.Device.preprocess`
    to certain inputs.

    Versioning should be specified by the package containing the device. If an external package includes a PennyLane device,
    then the package requirements should specify the minimum PennyLane version required to work with the device.

.. details::
    :title: The relationship between preprocessing and execution

    The :meth:`~.preprocess` method is assumed to be run before any :meth:`~.execute` or differentiation method.
    If an arbitrary, non-preprocessed circuit is provided, :meth:`~.execute` has no responsibility to perform any
    validation or provide clearer error messages.

    >>> import pennylane as qp
    >>> op = qp.Permute(["c", 3,"a",2,0], wires=[3,2,"a",0,"c"])
    >>> circuit = qp.tape.QuantumScript([op], [qp.state()])
    >>> from pennylane.devices import DefaultQubit
    >>> dev = DefaultQubit()
    >>> dev.execute(circuit)
    Traceback (most recent call last):
    ...
    pennylane.exceptions.MatrixUndefinedError
    >>> angles = qp.numpy.array([1.2, 2.3, 3.4])
    >>> circuit = qp.tape.QuantumScript([qp.Rot(*angles, 0)], [qp.expval(qp.Z(0))])
    >>> config = ExecutionConfig(gradient_method="adjoint")
    >>> dev.compute_derivatives(circuit, config)  # the result will be incorrect
    (array(0.), array(0.), array(0.))
    >>> program, new_config = dev.preprocess(config)
    >>> new_circuit, postprocessing = program([circuit])
    >>> dev.compute_derivatives(new_circuit, new_config)
    ((array(-1.6682...e-18), array(-0.7457...), array(-2.6785...e-18)),)

    Any validation checks or error messages should occur in :meth:`~.preprocess` to avoid failures after expending
    computation resources.

.. details::
    :title: Execution Configuration

    Execution config properties related to configuring a device include:

    * ``device_options``: A dictionary of device specific options. For example, the python device may have ``multiprocessing_mode``
      as a key. These should be documented in the class docstring.

    * ``gradient_method``: A device can choose to have native support for any type of gradient method. If the method
      :meth:`~.supports_derivatives` returns ``True`` for a particular gradient method, it will be treated as a device
      derivative and not handled by pennylane core code.

    * ``gradient_keyword_arguments``: Options for the gradient method.

    * ``derivative_order``: Relevant for requested device derivatives.

    * ``mcm_config``: Options for methods of handling mid-circuit-measures.

### `name`

```python
def name(self) -> str
```

The name of the device or set of devices.

This property can either be the name of the class, or an alias to be used in the :func:`~.device` constructor,
such as ``"default.qubit"`` or ``"lightning.qubit"``.

### `__repr__`

```python
def __repr__(self)
```

String representation.

### `shots`

```python
def shots(self) -> Shots
```

Default shots for execution workflows containing this device.

Note that the device itself should **always** pull shots from the provided :class:`~.QuantumTape` and its
:attr:`~.QuantumTape.shots`, not from this property. This property is used to provide a default at the start of a workflow.

### `wires`

```python
def wires(self) -> Wires
```

The device wires.

Note that wires are optional, and the default value of None means any wires can be used.
If a device has wires defined, they will only be used for certain features. This includes:

* Validation of tapes being executed on the device
* Defining the wires used when evaluating a :func:`~pennylane.state` measurement

### `preprocess`

```python
def preprocess(self, execution_config: ExecutionConfig | None=None) -> tuple[CompilePipeline, ExecutionConfig]
```

Device preprocessing function.

.. warning::

    This function is tracked by machine learning interfaces and should be fully differentiable.
    The ``pennylane.math`` module can be used to construct fully differentiable transformations.

    Additional preprocessing independent of machine learning interfaces can be done inside of
    the :meth:`~.execute` method.

Args:
    execution_config (ExecutionConfig): A datastructure describing the parameters needed to fully describe
        the execution.

Returns:
    CompilePipeline, ExecutionConfig: A compile pileline that is called before execution, and a configuration
        with unset specifications filled in.

Raises:
    Exception: An exception can be raised if the input cannot be converted into a form supported by the device.

Preprocessing program may include:

* expansion to :class:`~.Operator`'s and :class:`~.MeasurementProcess` objects supported by the device.
* splitting a circuit with the measurement of non-commuting observables or Hamiltonians into multiple executions
* splitting circuits with batched parameters into multiple executions
* gradient specific preprocessing, such as making sure trainable operators have generators
* validation of configuration parameters
* choosing a best gradient method and ``grad_on_execution`` value.

**Example**

All the transforms that are part of the preprocessing need to respect the transform contract defined in
:func:`pennylane.transform`.

.. code-block:: python

        from pennylane.tape import QuantumScriptBatch
        from pennylane.typing import PostprocessingFn

        @qp.transform
        def my_preprocessing_transform(tape: qp.tape.QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]:
            # e.g. valid the measurements, expand the tape for the hardware execution, ...

            def blank_processing_fn(results):
                return results[0]

            return [tape], processing_fn

Then we can define the preprocess method on the custom device. The program can accept an arbitrary number of
transforms.

.. code-block:: python

        def preprocess(config):
            program = CompilePipeline()
            program.add_transform(my_preprocessing_transform)
            return program, config

.. seealso:: :func:`~.pennylane.transform.core.transform` and :class:`~.pennylane.transform.core.CompilePipeline`

### `setup_execution_config`

```python
def setup_execution_config(self, config: ExecutionConfig | None=None, circuit: QuantumScript | None=None) -> ExecutionConfig
```

Sets up an ``ExecutionConfig`` that configures the execution behaviour.

The execution config stores information on how the device should perform the execution,
as well as how PennyLane should interact with the device. See :class:`ExecutionConfig`
for all available options and what they mean.

An ``ExecutionConfig`` is constructed from arguments passed to the ``QNode``, and this
method allows the device to update the config object based on device-specific requirements
or preferences. See :ref:`execution_config` for more details.

Args:
    config (ExecutionConfig): The initial ExecutionConfig object that describes the
        parameters needed to configure the execution behaviour.
    circuit (QuantumScript): The quantum circuit to customize the execution config for.

Returns:
    ExecutionConfig: The updated ExecutionConfig object

### `preprocess_transforms`

```python
def preprocess_transforms(self, execution_config: ExecutionConfig | None=None) -> CompilePipeline
```

Returns the compile pileline to preprocess a circuit for execution.

Args:
    execution_config (ExecutionConfig): The execution configuration object

Returns:
    CompilePipeline: A compile pileline that is called before execution

The compile pileline is composed of a list of individual transforms, which may include:

* Decomposition of operations and measurements to what is supported by the device.
* Splitting a circuit with measurements of non-commuting observables or Hamiltonians into multiple executions.
* Splitting a circuit with batched parameters into multiple executions.
* Validation of wires, measurements, and observables.
* Gradient specific preprocessing, such as making sure trainable operators have generators.

**Example**

All transforms that are part of the preprocessing compile pileline need to respect the
transform contract defined in :func:`pennylane.transform`.

.. code-block:: python

    from pennylane.tape import QuantumScriptBatch
    from pennylane.typing import PostprocessingFn

    @qp.transform
    def my_preprocessing_transform(tape: qp.tape.QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]:
        # e.g. valid the measurements, expand the tape for the hardware execution, ...

        def blank_processing_fn(results):
            return results[0]

        return [tape], processing_fn

A compile pileline can hold an arbitrary number of individual transforms:

.. code-block:: python

    def preprocess(self, config):
        program = CompilePipeline()
        program.add_transform(my_preprocessing_transform)
        return program

.. seealso:: :func:`~.pennylane.transform.core.transform` and :class:`~.pennylane.transform.core.CompilePipeline`

### `execute`

```python
def execute(self, circuits: QuantumScriptOrBatch, execution_config: ExecutionConfig | None=None) -> Result | ResultBatch
```

Execute a circuit or a batch of circuits and turn it into results.

Args:
    circuits (Union[QuantumTape, Sequence[QuantumTape]]): the quantum circuits to be executed
    execution_config (ExecutionConfig): a datastructure with additional information required for execution

Returns:
    TensorLike, tuple[TensorLike], tuple[tuple[TensorLike]]: A numeric result of the computation.

**Interface parameters:**

The provided ``circuits`` may contain interface specific data-types like ``torch.Tensor`` or ``jax.Array`` when
:attr:`~.ExecutionConfig.gradient_method` of ``"backprop"`` is requested. If the gradient method is not backpropagation,
then only vanilla numpy parameters or builtins will be present in the circuits.

.. details::
    :title: Return Shape

    See :ref:`Return Type Specification <ReturnTypeSpec>` for more detailed information.

    The result for each :class:`~.QuantumTape` must match the shape specified by :class:`~.QuantumTape.shape`.

    The level of priority for dimensions from outer dimension to inner dimension is:

    1. Quantum Script in batch
    2. Shot choice in a shot vector
    3. Measurement in the quantum script
    4. Parameter broadcasting
    5. Measurement shape for array-valued measurements like probabilities

    For a batch of quantum scripts with multiple measurements, a shot vector, and parameter broadcasting:

    * ``result[0]``: the results for the first script
    * ``result[0][0]``: the first shot number in the shot vector
    * ``result[0][0][0]``: the first measurement in the quantum script
    * ``result[0][0][0][0]``: the first parameter broadcasting choice
    * ``result[0][0][0][0][0]``: the first value for an array-valued measurement

    With the exception of quantum script batches, dimensions with only a single component should be eliminated.

    For example:

    With a single script and a single measurement process, execute should return just the
    measurement value in a numpy array. ``shape`` currently accepts a device, as historically devices
    stored shot information. In the future, this method will accept an ``ExecutionConfig`` instead.

    >>> tape = qp.tape.QuantumScript(measurements=[qp.expval(qp.Z(0))])
    >>> dev.execute(tape)
    np.float64(1.0)

    If execute recieves a batch of scripts, then it should return a tuple of results:

    >>> dev.execute([tape, tape])
    (np.float64(1.0), np.float64(1.0))
    >>> dev.execute([tape])
    (np.float64(1.0),)

    If the script has multiple measurements, then the device should return a tuple of measurements.

    >>> tape = qp.tape.QuantumTape(measurements=[qp.expval(qp.Z(0)), qp.probs(wires=(0,1))])
    >>> dev.execute(tape)
    (np.float64(1.0), array([1., 0., 0., 0.]))

### `supports_derivatives`

```python
def supports_derivatives(self, execution_config: ExecutionConfig | None=None, circuit: QuantumScript | None=None) -> bool
```

Determine whether or not a device provided derivative is potentially available.

Default behaviour assumes first order device derivatives for all circuits exist if :meth:`~.compute_derivatives` is overriden.

Args:
    execution_config (ExecutionConfig): A description of the hyperparameters for the desired computation.
    circuit (None, QuantumTape): A specific circuit to check differentation for.

Returns:
    Bool

The device can support multiple different types of "device derivatives", chosen via ``execution_config.gradient_method``.
For example, a device can natively calculate ``"parameter-shift"`` derivatives, in which case :meth:`~.compute_derivatives`
will be called for the derivative instead of :meth:`~.execute` with a batch of circuits.

>>> config = ExecutionConfig(gradient_method="parameter-shift")
>>> custom_device.supports_derivatives(config)  # doctest: +SKIP
True

In this case, :meth:`~.compute_derivatives` or :meth:`~.execute_and_compute_derivatives` will be called instead of :meth:`~.execute` with
a batch of circuits.

If ``circuit`` is not provided, then the method should return whether or not device derivatives exist for **any** circuit.

**Example:**

For example, the Python device will support device differentiation via the adjoint differentiation algorithm
if the order is ``1`` and the execution occurs with no shots (``shots=None``).

>>> config = ExecutionConfig(derivative_order=1, gradient_method="adjoint")
>>> dev.supports_derivatives(config)  # doctest: +SKIP
True
>>> circuit_analytic = qp.tape.QuantumScript([qp.RX(0.1, wires=0)], [qp.expval(qp.Z(0))], shots=None)
>>> dev.supports_derivatives(config, circuit=circuit_analytic)  # doctest: +SKIP
True
>>> circuit_finite_shots = qp.tape.QuantumScript([qp.RX(0.1, wires=0)], [qp.expval(qp.Z(0))], shots=10)
>>> dev.supports_derivatives(config, circuit = circuit_finite_shots)  # doctest: +SKIP
False

>>> config = ExecutionConfig(derivative_order=2, gradient_method="adjoint")
>>> dev.supports_derivatives(config)  # doctest: +SKIP
False

Adjoint differentiation will only be supported for circuits with expectation value measurements.
If a circuit is provided and it cannot be converted to a form supported by differentiation method by
:meth:`~.Device.preprocess`, then ``supports_derivatives`` should return False.

>>> config = ExecutionConfig(derivative_order=1, gradient_method="adjoint")
>>> circuit = qp.tape.QuantumScript([qp.RX(2.0, wires=0)], [qp.probs(wires=(0,1))])
>>> dev.supports_derivatives(config, circuit=circuit)  # doctest: +SKIP
False

If the circuit is not natively supported by the differentiation method but can be converted into a form
that is supported, it should still return ``True``.  For example, :class:`~.Rot` gates are not natively
supported by adjoint differentation, as they do not have a generator, but they can be compiled into
operations supported by adjoint differentiation. Therefore this method may reproduce compilation
and validation steps performed by :meth:`~.Device.preprocess`.

>>> config = ExecutionConfig(derivative_order=1, gradient_method="adjoint")
>>> circuit = qp.tape.QuantumScript([qp.Rot(1.2, 2.3, 3.4, wires=0)], [qp.expval(qp.Z(0))])
>>> dev.supports_derivatives(config, circuit=circuit)  # doctest: +SKIP
True

**Backpropagation:**

This method is also used be to validate support for backpropagation derivatives. Backpropagation
is only supported if the device is transparent to the machine learning framework from start to finish.

>>> config = ExecutionConfig(gradient_method="backprop")
>>> python_device.supports_derivatives(config)  # doctest: +SKIP
True
>>> cpp_device.supports_derivatives(config)  # doctest: +SKIP
False

### `compute_derivatives`

```python
def compute_derivatives(self, circuits: QuantumScriptOrBatch, execution_config: ExecutionConfig | None=None)
```

Calculate the jacobian of either a single or a batch of circuits on the device.

Args:
    circuits (Union[QuantumTape, Sequence[QuantumTape]]): the circuits to calculate derivatives for
    execution_config (ExecutionConfig): a datastructure with all additional information required for execution

Returns:
    Tuple: The jacobian for each trainable parameter

.. seealso:: :meth:`~.supports_derivatives` and :meth:`~.execute_and_compute_derivatives`.

**Execution Config:**

The execution config has ``gradient_method`` and ``order`` property that describes the order of differentiation requested. If the requested
method or order of gradient is not provided, the device should raise a ``NotImplementedError``. The :meth:`~.supports_derivatives`
method can pre-validate supported orders and gradient methods.

**Return Shape:**

If a batch of quantum scripts is provided, this method should return a tuple with each entry being the gradient of
each individual quantum script. If the batch is of length 1, then the return tuple should still be of length 1, not squeezed.

### `execute_and_compute_derivatives`

```python
def execute_and_compute_derivatives(self, circuits: QuantumScriptOrBatch, execution_config: ExecutionConfig | None=None)
```

Compute the results and jacobians of circuits at the same time.

Args:
    circuits (Union[QuantumTape, Sequence[QuantumTape]]): the circuits or batch of circuits
    execution_config (ExecutionConfig): a datastructure with all additional information required for execution

Returns:
    tuple: A numeric result of the computation and the gradient.

See :meth:`~.execute` and :meth:`~.compute_derivatives` for more information about return shapes and behaviour.
If :meth:`~.compute_derivatives` is defined, this method should be as well.

This method can be used when the result and execution need to be computed at the same time, such as
during a forward mode calculation of gradients. For certain gradient methods, such as adjoint
diff gradients, calculating the result and gradient at the same can save computational work.

### `compute_jvp`

```python
def compute_jvp(self, circuits: QuantumScriptOrBatch, tangents: tuple[Number, ...], execution_config: ExecutionConfig | None=None)
```

The jacobian vector product used in forward mode calculation of derivatives.

Args:
    circuits (Union[QuantumTape, Sequence[QuantumTape]]): the circuit or batch of circuits
    tangents (tensor-like): Gradient vector for input parameters.
    execution_config (ExecutionConfig): a datastructure with all additional information required for execution

Returns:
    Tuple: A numeric result of computing the jacobian vector product

**Definition of jvp:**

If we have a function with jacobian:

.. math::

    \vec{y} = f(\vec{x}) \qquad J_{i,j} = \frac{\partial y_i}{\partial x_j}

The Jacobian vector product is the inner product with the derivatives of :math:`x`, yielding
only the derivatives of the output :math:`y`:

.. math::

    \text{d}y_i = \Sigma_{j} J_{i,j} \text{d}x_j

**Shape of tangents:**

The ``tangents`` tuple should be the same length as ``circuit.get_parameters()`` and have a single number per
parameter. If a number is zero, then the gradient with respect to that parameter does not need to be computed.

### `execute_and_compute_jvp`

```python
def execute_and_compute_jvp(self, circuits: QuantumScriptOrBatch, tangents: tuple[Number, ...], execution_config: ExecutionConfig | None=None)
```

Execute a batch of circuits and compute their jacobian vector products.

Args:
    circuits (Union[QuantumTape, Sequence[QuantumTape]]): circuit or batch of circuits
    tangents (tensor-like): Gradient vector for input parameters.
    execution_config (ExecutionConfig): a datastructure with all additional information required for execution

Returns:
    Tuple, Tuple: A numeric result of execution and of computing the jacobian vector product

.. seealso:: :meth:`~pennylane.devices.Device.execute` and :meth:`~.Device.compute_jvp`

### `supports_jvp`

```python
def supports_jvp(self, execution_config: ExecutionConfig | None=None, circuit: QuantumScript | None=None) -> bool
```

Whether or not a given device defines a custom jacobian vector product.

Args:
    execution_config (ExecutionConfig): A description of the hyperparameters for the desired computation.
    circuit (None, QuantumTape): A specific circuit to check differentation for.

Default behaviour assumes this to be ``True`` if :meth:`~.compute_jvp` is overridden.

### `compute_vjp`

```python
def compute_vjp(self, circuits: QuantumScriptOrBatch, cotangents: tuple[Number, ...], execution_config: ExecutionConfig | None=None)
```

The vector jacobian product used in reverse-mode differentiation.

Args:
    circuits (Union[QuantumTape, Sequence[QuantumTape]]): the circuit or batch of circuits
    cotangents (Tuple[Number, Tuple[Number]]): Gradient-output vector. Must have shape matching the output shape of the
        corresponding circuit. If the circuit has a single output, `cotangents` may be a single number, not an iterable
        of numbers.
    execution_config (ExecutionConfig): a datastructure with all additional information required for execution

Returns:
    tensor-like: A numeric result of computing the vector jacobian product

**Definition of vjp:**

If we have a function with jacobian:

.. math::

    \vec{y} = f(\vec{x}) \qquad J_{i,j} = \frac{\partial y_i}{\partial x_j}

The vector jacobian product is the inner product of the derivatives of the output ``y`` with the
Jacobian matrix. The derivatives of the output vector are sometimes called the **cotangents**.

.. math::

    \text{d}x_i = \Sigma_{i} \text{d}y_i J_{i,j}

**Shape of cotangents:**

The value provided to ``cotangents`` should match the output of :meth:`~.execute`.

### `execute_and_compute_vjp`

```python
def execute_and_compute_vjp(self, circuits: QuantumScriptOrBatch, cotangents: tuple[Number, ...], execution_config: ExecutionConfig | None=None)
```

Calculate both the results and the vector jacobian product used in reverse-mode differentiation.

Args:
    circuits (Union[QuantumTape, Sequence[QuantumTape]]): the circuit or batch of circuits to be executed
    cotangents (Tuple[Number, Tuple[Number]]): Gradient-output vector. Must have shape matching the output shape of the
        corresponding circuit. If the circuit has a single output, `cotangents` may be a single number, not an iterable
        of numbers.
    execution_config (ExecutionConfig): a datastructure with all additional information required for execution

Returns:
    Tuple, Tuple: the result of executing the scripts and the numeric result of computing the vector jacobian product

.. seealso:: :meth:`~pennylane.devices.Device.execute` and :meth:`~.Device.compute_vjp`

### `supports_vjp`

```python
def supports_vjp(self, execution_config: ExecutionConfig | None=None, circuit: QuantumScript | None=None) -> bool
```

Whether or not a given device defines a custom vector jacobian product.

Args:
    execution_config (ExecutionConfig): A description of the hyperparameters for the desired computation.
    circuit (None, QuantumTape): A specific circuit to check differentation for.

Default behaviour assumes this to be ``True`` if :meth:`~.compute_vjp` is overridden.

### `eval_jaxpr`

```python
def eval_jaxpr(self, jaxpr: 'jax.extend.core.Jaxpr', consts: list[TensorLike], *args, execution_config: ExecutionConfig | None=None, shots: Shots=Shots(None)) -> list[TensorLike]
```

An **experimental** method for natively evaluating PLXPR. See the ``capture`` module for more details.

Args:
    jaxpr (jax.extend.core.Jaxpr): Pennylane variant jaxpr containing quantum operations and measurements
    consts (list[TensorLike]): the closure variables ``consts`` corresponding to the jaxpr
    *args (TensorLike): the variables to use with the jaxpr.

Keyword Args:
    execution_config (Optional[ExecutionConfig]): a data structure with additional information required for execution
    shots (Shots): the number of shots to use for the evaluation

Returns:
    list[TensorLike]: the result of evaluating the jaxpr with the given parameters.

### `jaxpr_jvp`

```python
def jaxpr_jvp(self, jaxpr: 'jax.extend.core.Jaxpr', args, tangents, execution_config: ExecutionConfig | None=None)
```

An **experimental** method for computing the results and jvp for PLXPR.
See the ``capture`` module for more details.

Args:
    jaxpr (jax.extend.core.Jaxpr): Pennylane variant jaxpr containing quantum operations
        and measurements
    args (Sequence[TensorLike]): the ``consts`` followed by the normal   arguments
    tangents (Sequence[TensorLike]): the tangents corresponding to ``args``.
        May contain ``jax.interpreters.ad.Zero``.

Keyword Args:
    execution_config (Optional[ExecutionConfig]): a data structure with additional information required for execution

Returns:
    Sequence[TensorLike], Sequence[TensorLike]: the results and jacobian vector products

>>> qp.capture.enable()
>>> import jax
>>> closure_var = jax.numpy.array(0.5)
>>> def f(x):
...     qp.RX(closure_var, 0)
...     qp.RX(x, 1)
...     return qp.expval(qp.Z(0)), qp.expval(qp.Z(1))
>>> jaxpr = jax.make_jaxpr(f)(1.2)
>>> args = (closure_var, 1.2)
>>> zero = jax.interpreters.ad.Zero(jax.core.ShapedArray((), float))
>>> tangents = (zero, 1.0)
>>> config = qp.devices.ExecutionConfig(gradient_method="adjoint")
>>> dev = qp.device('default.qubit', wires=2)
>>> res, jvps = dev.jaxpr_jvp(jaxpr.jaxpr, args, tangents, execution_config=config)
>>> res
[Array(0.87758256, dtype=float64), Array(0.36235775, dtype=float64)]
>>> jvps
[Array(0., dtype=float64), Array(-0.93203909, dtype=float64)]

## `apply_to_device`

```python
def apply_to_device(obj: Device, transform, *targs, **tkwargs)
```

Apply the transform on a device
