---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/devices/default_qubit.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/devices/default_qubit.py
license: Apache-2.0
---

## Module `pennylane/devices/default_qubit.py`

The default.qubit device is PennyLane's standard qubit-based device.

## `stopping_condition`

```python
def stopping_condition(op: Operator, allow_mcms=True) -> bool
```

Specify whether or not an Operator object is supported by the device.

## `observable_accepts_sampling`

```python
def observable_accepts_sampling(obs: Operator) -> bool
```

Verifies whether an observable supports sample measurement

## `observable_accepts_analytic`

```python
def observable_accepts_analytic(obs: Operator, is_expval=False) -> bool
```

Verifies whether an observable supports analytic measurement

## `accepted_sample_measurement`

```python
def accepted_sample_measurement(m: MeasurementProcess) -> bool
```

Specifies whether a measurement is accepted when sampling.

## `accepted_analytic_measurement`

```python
def accepted_analytic_measurement(m: MeasurementProcess) -> bool
```

Specifies whether a measurement is accepted when analytic.

## `null_postprocessing`

```python
def null_postprocessing(results)
```

An empty post-processing function.

## `all_state_postprocessing`

```python
def all_state_postprocessing(results, measurements, wire_order)
```

Process a state measurement back into the original measurements.

## `no_counts`

```python
def no_counts(tape)
```

Throws an error on counts measurements.

## `adjoint_state_measurements`

```python
def adjoint_state_measurements(tape: QuantumScript, device_vjp=False) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Perform adjoint measurement preprocessing.

* Allows a tape with only expectation values through unmodified
* Raises an error if non-expectation value measurements exist and any have diagonalizing gates
* Turns the circuit into a state measurement + classical postprocesssing for arbitrary measurements

Args:
    tape (QuantumTape): the input circuit

## `adjoint_ops`

```python
def adjoint_ops(op: Operator) -> bool
```

Specify whether or not an Operator is supported by adjoint differentiation.

## `adjoint_observables`

```python
def adjoint_observables(obs: Operator) -> bool
```

Specifies whether or not an observable is compatible with adjoint differentiation on DefaultQubit.

## `DefaultQubit`

```python
class DefaultQubit(Device)
```

A PennyLane device written in Python and capable of backpropagation derivatives.

Args:
    wires (int, Iterable[Number, str]): Number of wires present on the device, or iterable that
        contains unique labels for the wires as numbers (i.e., ``[-1, 0, 2]``) or strings
        (``['auxiliary', 'q1', 'q2']``). Default ``None`` if not specified.
    shots (int, Sequence[int], Sequence[Union[int, Sequence[int]]]): The default number of shots
        to use in executions involving this device.
    seed (Union[str, None, int, array_like[int], SeedSequence, BitGenerator, Generator, jax.random.PRNGKey]): A
        seed-like parameter matching that of ``seed`` for ``numpy.random.default_rng``, or
        a request to seed from numpy's global random number generator.
        The default, ``seed="global"`` pulls a seed from NumPy's global generator. ``seed=None``
        will pull a seed from the OS entropy.
        If a ``jax.random.PRNGKey`` is passed as the seed, a JAX-specific sampling function using
        ``jax.random.choice`` and the ``PRNGKey`` will be used for sampling rather than
        ``numpy.random.default_rng``.
    max_workers (int): A :class:`~pennylane.concurrency.executors.base.RemoteExec` executes tapes asynchronously
        using a pool of at most ``max_workers`` processes. If ``max_workers`` is ``None``,
        only the current process executes tapes. If you experience any
        issue, say using JAX, TensorFlow, Torch, try setting ``max_workers`` to ``None``.

**Example:**

.. code-block:: python

    import pennylane as qp

    n_layers = 5
    n_wires = 10
    num_qscripts = 5

    shape = qp.StronglyEntanglingLayers.shape(n_layers=n_layers, n_wires=n_wires)
    rng = qp.numpy.random.default_rng(seed=42)

    qscripts = []
    for i in range(num_qscripts):
        params = rng.random(shape)
        op = qp.StronglyEntanglingLayers(params, wires=range(n_wires))
        qs = qp.tape.QuantumScript([op], [qp.expval(qp.Z(0))])
        qscripts.append(qs)

>>> dev = DefaultQubit()
>>> program, execution_config = dev.preprocess()
>>> new_batch, post_processing_fn = program(qscripts)
>>> results = dev.execute(new_batch, execution_config=execution_config)
>>> post_processing_fn(results)
(tensor(-0.0006889, requires_grad=True),
tensor(0.02557631, requires_grad=True),
tensor(-0.00385673, requires_grad=True),
tensor(0.13397051, requires_grad=True),
tensor(-0.0378067, requires_grad=True))

This device currently supports backpropagation derivatives:

>>> from pennylane.devices import ExecutionConfig
>>> dev.supports_derivatives(ExecutionConfig(gradient_method="backprop"))
True

For example, we can use jax to jit computing the derivative:

.. code-block:: python

    import jax

    @jax.jit
    def f(x):
        qs = qp.tape.QuantumScript([qp.RX(x, 0)], [qp.expval(qp.Z(0))])
        program, execution_config = dev.preprocess()
        new_batch, post_processing_fn = program([qs])
        results = dev.execute(new_batch, execution_config=execution_config)
        return post_processing_fn(results)[0]

>>> f(jax.numpy.array(1.2))
Array(0.362..., dtype=float64)
>>> jax.grad(f)(jax.numpy.array(1.2))
Array(-0.932..., dtype=float64, weak_type=True)

.. details::
    :title: Tracking

    ``DefaultQubit`` tracks:

    * ``executions``: the number of unique circuits that would be required on quantum hardware
    * ``shots``: the number of shots
    * ``resources``: the :class:`~.resource.Resources` for the executed circuit.
    * ``simulations``: the number of simulations performed. One simulation can cover multiple QPU executions, such as for non-commuting measurements and batched parameters.
    * ``batches``: The number of times :meth:`~.execute` is called.
    * ``results``: The results of each call of :meth:`~.execute`
    * ``derivative_batches``: How many times :meth:`~.compute_derivatives` is called.
    * ``execute_and_derivative_batches``: How many times :meth:`~.execute_and_compute_derivatives` is called
    * ``vjp_batches``: How many times :meth:`~.compute_vjp` is called
    * ``execute_and_vjp_batches``: How many times :meth:`~.execute_and_compute_vjp` is called
    * ``jvp_batches``: How many times :meth:`~.compute_jvp` is called
    * ``execute_and_jvp_batches``: How many times :meth:`~.execute_and_compute_jvp` is called
    * ``derivatives``: How many circuits are submitted to :meth:`~.compute_derivatives` or :meth:`~.execute_and_compute_derivatives`.
    * ``vjps``: How many circuits are submitted to :meth:`~.compute_vjp` or :meth:`~.execute_and_compute_vjp`
    * ``jvps``: How many circuits are submitted to :meth:`~.compute_jvp` or :meth:`~.execute_and_compute_jvp`


.. details::
    :title: Accelerate calculations with concurrent executors

    Suppose one has a processor with 5 cores or more, these scripts can be executed in
    parallel as follows

    >>> dev = DefaultQubit(max_workers=5)
    >>> program, execution_config = dev.preprocess()
    >>> new_batch, post_processing_fn = program(qscripts)
    >>> results = dev.execute(new_batch, execution_config=execution_config)
    >>> post_processing_fn(results)
    (np.float64(-0.0006888975950538057),
    np.float64(0.025576307134457466),
    np.float64(-0.0038567269892758604),
    np.float64(0.13397051468601484),
    np.float64(-0.03780669772690465))

    If you monitor your CPU usage, you should see 5 new Python processes pop up to
    crunch through those ``QuantumScript``'s. Beware not oversubscribing your machine.
    This may happen if a single device already uses many cores, if NumPy uses a multi-
    threaded BLAS library like MKL or OpenBLAS for example. The number of threads per
    process times the number of processes should not exceed the number of cores on your
    machine. You can control the number of threads per process with the environment
    variables:

    * ``OMP_NUM_THREADS``
    * ``MKL_NUM_THREADS``
    * ``OPENBLAS_NUM_THREADS``

    where the last two are specific to the MKL and OpenBLAS libraries specifically.

    .. warning::

        Concurrent executors using the multiprocessing backend (default) may fail depending on your platform and environment (Python shell,
        script with a protected entry point, Jupyter notebook, etc.) This may be solved
        changing the so-called start method. The supported start methods are the following:

        * Windows (win32): spawn (default).
        * macOS (darwin): spawn (default), fork, forkserver.
        * Linux (unix): spawn, fork (default), forkserver.

        which can be changed with ``multiprocessing.set_start_method()``. For example,
        if multiprocessing fails on macOS in your Jupyter notebook environment, try
        restarting the session and adding the following at the beginning of the file:

        .. code-block:: py

            import multiprocessing
            multiprocessing.set_start_method("fork")

        Additional information can be found in the
        `multiprocessing doc <https://docs.python.org/3/library/multiprocessing.html#contexts-and-start-methods>`_.

### `name`

```python
def name(self)
```

The name of the device.

### `get_prng_keys`

```python
def get_prng_keys(self, num: int=1)
```

Get ``num`` new keys with ``jax.random.split``.

A user may provide a ``jax.random.PRNGKey`` as a random seed.
It will be used by the device when executing circuits with finite shots.
The JAX RNG is notably different than the NumPy RNG as highlighted in the
`JAX documentation <https://jax.readthedocs.io/en/latest/jax-101/05-random-numbers.html>`_.
JAX does not keep track of a global seed or key, but needs one anytime it draws from a random number distribution.
Generating randomness therefore requires changing the key every time, which is done by "splitting" the key.
For example, when executing ``n`` circuits, the ``PRNGkey`` is split ``n`` times into 2 new keys
using ``jax.random.split`` to simulate a non-deterministic behaviour.
The device seed is modified in-place using the first key, and the second key is fed to the
circuit, and hence can be discarded after returning the results.
This same key may be split further down the stack if necessary so that no one key is ever
reused.

### `reset_prng_key`

```python
def reset_prng_key(self)
```

Reset the RNG key to its initial value.

### `supports_derivatives`

```python
def supports_derivatives(self, execution_config: ExecutionConfig | None=None, circuit: QuantumScript | None=None) -> bool
```

Check whether or not derivatives are available for a given configuration and circuit.

``DefaultQubit`` supports backpropagation derivatives with analytic results, as well as
adjoint differentiation.

Args:
    execution_config (ExecutionConfig): The configuration of the desired derivative calculation
    circuit (QuantumTape): An optional circuit to check derivatives support for.

Returns:
    Bool: Whether or not a derivative can be calculated provided the given information

### `preprocess_transforms`

```python
def preprocess_transforms(self, execution_config: ExecutionConfig | None=None) -> CompilePipeline
```

This function defines the device compile pileline to be applied and an updated device configuration.

Args:
    execution_config (ExecutionConfig | None): A data structure describing the
        parameters needed to fully describe the execution.

Returns:
    CompilePipeline:

### `supports_jvp`

```python
def supports_jvp(self, execution_config: ExecutionConfig | None=None, circuit: QuantumScript | None=None) -> bool
```

Whether or not this device defines a custom jacobian vector product.

``DefaultQubit`` supports backpropagation derivatives with analytic results, as well as
adjoint differentiation.

Args:
    execution_config (ExecutionConfig): The configuration of the desired derivative calculation
    circuit (QuantumTape): An optional circuit to check derivatives support for.

Returns:
    bool: Whether or not a derivative can be calculated provided the given information

### `supports_vjp`

```python
def supports_vjp(self, execution_config: ExecutionConfig | None=None, circuit: QuantumScript | None=None) -> bool
```

Whether or not this device defines a custom vector jacobian product.

``DefaultQubit`` supports backpropagation derivatives with analytic results, as well as
adjoint differentiation.

Args:
    execution_config (ExecutionConfig): A description of the hyperparameters for the desired computation.
    circuit (None, QuantumTape): A specific circuit to check differentation for.

Returns:
    bool: Whether or not a derivative can be calculated provided the given information

### `compute_vjp`

```python
def compute_vjp(self, circuits: QuantumScriptOrBatch, cotangents: tuple[Number, ...], execution_config: ExecutionConfig | None=None)
```

The vector jacobian product used in reverse-mode differentiation. ``DefaultQubit`` uses the
adjoint differentiation method to compute the VJP.

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

The value provided to ``cotangents`` should match the output of :meth:`~.execute`. For computing the full Jacobian,
the cotangents can be batched to vectorize the computation. In this case, the cotangents can have the following
shapes. ``batch_size`` below refers to the number of entries in the Jacobian:

* For a state measurement, the cotangents must have shape ``(batch_size, 2 ** n_wires)``
* For ``n`` expectation values, the cotangents must have shape ``(n, batch_size)``. If ``n = 1``,
  then the shape must be ``(batch_size,)``.
