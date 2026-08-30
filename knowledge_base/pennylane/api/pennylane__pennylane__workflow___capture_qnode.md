---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/_capture_qnode.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/_capture_qnode.py
license: Apache-2.0
---

## Module `pennylane/workflow/_capture_qnode.py`

This submodule defines a capture compatible call to QNodes.

Workflow Development Status
---------------------------

The non-exhaustive list of unsupported features are:

**Breaking ``vmap``/parameter broadcasting into a non-broadcasted state**. The current workflow assumes
that the device execution can natively handle broadcasted parameters. ``vmap`` and parameter broadcasting
will not work with devices other than default qubit.

>>> @qp.qnode(qp.device('lightning.qubit', wires=1))
... def circuit(x):
...     qp.RX(x, 0)
...     return qp.expval(qp.Z(0))
>>> jax.vmap(circuit)(jax.numpy.array([1.0, 2.0, 3.0]))
Traceback (most recent call last):
    ...
ValueError: Converting a JAX array to a NumPy array not supported when using the JAX JIT.
--------------------
For simplicity, JAX has removed its internal frames from the traceback of the following exception. Set JAX_TRACEBACK_FILTERING=off to include these.

**Grouping commuting measurements and/or splitting up non-commuting measurements.** Currently, each
measurement is fully independent and generated from different raw samples than every other measurement.
To generate multiple measurement from the same samples, we need a way of denoting which measurements
should be taken together. A "Combination measurement process" higher order primitive, or something like it.
We will also need to figure out how to implement splitting up a circuit with non-commuting measurements into
multiple circuits.

>>> @qp.set_shots(shots=5)
... @qp.qnode(qp.device('default.qubit', seed=42, wires=1))
... def circuit():
...     qp.H(0)
...     return qp.sample(wires=0), qp.sample(wires=0)
>>> circuit()
(array([[1],
        [0],
        [1],
        [1],
        [0]]), array([[1],
        [0],
        [1],
        [1],
        [0]]))

**Figuring out what types of data can be sent to the device.** Is the device always
responsible for converting jax arrays to numpy arrays? Is the device responsible for having a
pure-callback boundary if the execution is not jittable? We do have an opportunity here
to have GPU end-to-end simulation on ``lightning.gpu`` and ``lightning.kokkos``.

**Jitting workflows involving qnodes**. While the execution of jaxpr on ``default.qubit`` is
currently jittable, we will need to register a lowering for the qnode primitive.  We will also
need to figure out where to apply a ``jax.pure_callback`` for devices like ``lightning.qubit`` that are
not jittable.

**Result caching**. The new workflow is not capable of caching the results of executions, and we have
not even started thinking about how it might be possible to do so.

**Unknown other features**. The workflow currently has limited testing, so this list of unsupported
features is non-exhaustive.

## `custom_staging_rule`

```python
def custom_staging_rule(jaxpr_trace: pe.DynamicJaxprTrace, source_info, *tracers: pe.DynamicJaxprTracer, **params) -> Sequence[pe.DynamicJaxprTracer] | pe.DynamicJaxprTracer
```

Add new jaxpr equation to the jaxpr_trace and return new tracers.

See capture/intro_to_dynamic_shapes.py for more context and capture.register_custom_staging_rule
for the implementation used on other higher order primitives.

## `capture_qnode`

```python
def capture_qnode(qnode: 'qp.QNode', *args, **kwargs) -> 'qp.typing.Result'
```

A capture compatible call to a QNode. This function is internally used by ``QNode.__call__``.

Args:
    qnode (QNode): a QNode
    args: the arguments the QNode is called with

Keyword Args:
    kwargs (Any): Any keyword arguments accepted by the quantum function

Returns:
    qp.typing.Result: the result of a qnode execution

**Example:**

.. code-block:: python

    qp.capture.enable()
    jax.config.update("jax_enable_x64", True)

    @qp.set_shots(50_000)
    @qp.qnode(qp.device('lightning.qubit', seed=42, wires=1))
    def circuit(x):
        qp.RX(x, wires=0)
        return qp.expval(qp.Z(0)), qp.probs()

    def f(x):
        expval_z, probs = circuit(np.pi * x)
        return 2 * expval_z + probs

    jaxpr = jax.make_jaxpr(f)(0.1)

>>> print(jaxpr)
{ lambda ; a:f64[]. let
    b:f64[] = mul 3.141592653589793:f64[] a
    c:f64[] d:f64[2] = qnode[
      device=<lightning.qubit device (wires=1) at ...>
      execution_config=ExecutionConfig(grad_on_execution=False, use_device_gradient=None, use_device_jacobian_product=False, gradient_method='best', gradient_keyword_arguments={}, device_options={}, interface=<Interface.JAX: 'jax'>, derivative_order=1, mcm_config=MCMConfig(mcm_method=None, postselect_mode=None), convert_to_numpy=True, executor_backend=<class 'pennylane.concurrency.executors.native.multiproc.MPPoolExec'>)
      n_consts=0
      qfunc_jaxpr={ lambda ; e:f64[]. let
          _:AbstractOperator() = RX[n_wires=1] e 0:i64[]
          f:AbstractOperator() = PauliZ[n_wires=1] 0:i64[]
          g:AbstractMeasurement(n_wires=None) = expval_obs f
          h:AbstractMeasurement(n_wires=0) = probs_wires
        in (g, h) }
      qnode=<QNode: device='<lightning.qubit device (wires=1) at ...>', interface='jax', diff_method='best', shots='Shots(total=50000)'>
      shots_len=1
    ] 50000:i64[] b
    i:f64[] = mul 2.0:f64[] c
    j:f64[2] = add i d
  in (j,) }
