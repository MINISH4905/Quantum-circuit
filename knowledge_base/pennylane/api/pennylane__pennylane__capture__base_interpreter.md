---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/capture/base_interpreter.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/capture/base_interpreter.py
license: Apache-2.0
---

## Module `pennylane/capture/base_interpreter.py`

This submodule defines a strategy structure for defining custom plxpr interpreters

## `jaxpr_to_jaxpr`

```python
def jaxpr_to_jaxpr(interpreter: 'PlxprInterpreter', jaxpr: 'jax.extend.core.Jaxpr', consts, *args) -> 'jax.extend.core.ClosedJaxpr'
```

A convenience utility for converting jaxpr to a new jaxpr via an interpreter.

## `PlxprInterpreter`

```python
class PlxprInterpreter
```

A base class for defining plxpr interpreters.

**Examples:**

.. code-block:: python

    import jax
    from pennylane.capture import PlxprInterpreter

    class SimplifyInterpreter(PlxprInterpreter):

        def interpret_operation(self, op):
            new_op = qp.simplify(op)
            if new_op is op:
                # simplify didn't create a new operator, so it didn't get captured
                data, struct = jax.tree_util.tree_flatten(new_op)
                new_op = jax.tree_util.tree_unflatten(struct, data)
            return new_op

        def interpret_measurement(self, measurement):
            new_mp = measurement.simplify()
            if new_mp is measurement:
                new_mp = new_mp._unflatten(*measurement._flatten())
                # if new op isn't queued, need to requeue op.
            return new_mp

Now the interpreter can be used to transform functions and jaxpr:

>>> qp.capture.enable()
>>> interpreter = SimplifyInterpreter()
>>> def f(x):
...     qp.RX(x, 0)**2
...     qp.adjoint(qp.Z(0))
...     return qp.expval(qp.X(0) + qp.X(0))
>>> simplified_f = interpreter(f)
>>> print(qp.draw(simplified_f)(0.5))
0: ──RX(1.00)──Z─┤  <2.00*X>
>>> jaxpr = jax.make_jaxpr(f)(0.5)
>>> interpreter.eval(jaxpr.jaxpr, [], 0.5)
[expval(2.0 * X(0))]

**Handling higher order primitives:**

Two main strategies exist for handling higher order primitives (primitives with jaxpr as metadata).
The first one is structure preserving (tracing the execution preserves the higher order primitive),
and the second one is structure flattening (tracing the execution eliminates the higher order primitive).

Compilation transforms, like the above ``SimplifyInterpreter``, may prefer to handle higher order primitives
via a structure-preserving method. After transforming the jaxpr, the `for_loop` still exists. This maintains
the compact structure of the jaxpr and reduces the size of the program. This behavior is the default.

>>> def g(x):
...     @qp.for_loop(3)
...     def loop(i, x):
...         qp.RX(x, 0) ** i
...         return x
...     loop(1.0)
...     return qp.expval(qp.Z(0) + 3*qp.Z(0))
>>> jax.make_jaxpr(interpreter(g))(0.5)
{ lambda ; a:f32[]. let
    _:f32[] = for_loop[
      args_slice=slice(0, None, None)
      consts_slice=slice(0, 0, None)
      jaxpr_body_fn={ lambda ; b:i32[] c:f32[]. let
        d:f32[] = convert_element_type[new_dtype=float32 weak_type=True] b
        e:f32[] = mul c d
        _:AbstractOperator() = RX[n_wires=1] e 0
      in (c,) }
    ] 0 3 1 1.0
    f:AbstractOperator() = PauliZ[n_wires=1] 0
    g:AbstractOperator() = SProd[_pauli_rep=4.0 * Z(0)] 4.0 f
    h:AbstractMeasurement(n_wires=None) = expval_obs g
  in (h,) }

Accumulation transforms, like device execution or conversion to tapes, may need to flatten out
the higher order primitive to execute it.

.. code-block:: python

    import copy

    class AccumulateOps(PlxprInterpreter):

        def __init__(self, ops=None):
            self.ops = ops

        def setup(self):
            if self.ops is None:
                self.ops = []

        def interpret_operation(self, op):
            self.ops.append(op)

    @AccumulateOps.register_primitive(qp.capture.primitives.for_loop_prim)
    def _(self, start, stop, step, *invals, jaxpr_body_fn, consts_slice, args_slice):
        consts = invals[consts_slice]
        state = invals[args_slice]

        for i in range(start, stop, step):
            state = copy.copy(self).eval(jaxpr_body_fn, consts, i, *state)
        return state

>>> @qp.for_loop(3)
... def loop(i, x):
...     qp.RX(x, i)
...     return x
>>> accumulator = AccumulateOps()
>>> accumulator(loop)(0.5)
>>> accumulator.ops
[RX(0.5, wires=[0]), RX(0.5, wires=[1]), RX(0.5, wires=[2])]

In this case, we need to actually evaluate the jaxpr 3 times using our interpreter. If jax's
evaluation interpreter ran it three times, we wouldn't actually manage to accumulate the operations.

### `register_primitive`

```python
def register_primitive(cls, primitive: 'jax.extend.core.Primitive') -> Callable[[Callable], Callable]
```

Registers a custom method for handling a primitive

Args:
    primitive (jax.extend.core.Primitive): the primitive we want custom behavior for

Returns:
    Callable: a decorator for adding a function to the custom registrations map

Side Effect:
    Calling the returned decorator with a function will place the function into the
    primitive registrations map.

.. code-block:: python

    my_primitive = jax.extend.core.Primitive("my_primitive")

    @Interpreter_Type.register(my_primitive)
    def handle_my_primitive(self: Interpreter_Type, *invals, **params)
        return invals[0] + invals[1] # some sort of custom handling

### `read`

```python
def read(self, var)
```

Extract the value corresponding to a variable.

### `setup`

```python
def setup(self) -> None
```

Initialize the instance before interpreting equations.

Blank by default, this method can initialize any additional instance variables
needed by an interpreter. For example, a device interpreter could initialize a statevector,
or a compilation interpreter could initialize a staging area for the latest operation on each wire.

### `cleanup`

```python
def cleanup(self) -> None
```

Perform any final steps after iterating through all equations.

Blank by default, this method can clean up instance variables. Particularly,
this method can be used to deallocate qubits and registers when converting to
a Catalyst variant jaxpr.

### `interpret_operation`

```python
def interpret_operation(self, op: 'pennylane.operation.Operator')
```

Interpret a PennyLane operation instance.

Args:
    op (Operator): a pennylane operator instance

Returns:
    Any

This method is only called when the operator's output is a dropped variable,
so the output will not affect later equations in the circuit.

See also: :meth:`~.interpret_operation_eqn`.

### `interpret_operation_eqn`

```python
def interpret_operation_eqn(self, eqn: 'jax.extend.core.JaxprEqn')
```

Interpret an equation corresponding to an operator.

Args:
    eqn (jax.extend.core.JaxprEqn): a jax equation for an operator.

See also: :meth:`~.interpret_operation`.

### `interpret_measurement_eqn`

```python
def interpret_measurement_eqn(self, eqn: 'jax.extend.core.JaxprEqn')
```

Interpret an equation corresponding to a measurement process.

Args:
    eqn (jax.extend.core.JaxprEqn)

See also :meth:`~.interpret_measurement`.

### `interpret_measurement`

```python
def interpret_measurement(self, measurement: 'qp.measurement.MeasurementProcess')
```

Interpret a measurement process instance.

Args:
    measurement (MeasurementProcess): a measurement instance.

See also :meth:`~.interpret_measurement_eqn`.

### `eval`

```python
def eval(self, jaxpr: 'jax.extend.core.Jaxpr', consts: Sequence, *args) -> list
```

Evaluate a jaxpr.

Args:
    jaxpr (jax.extend.core.Jaxpr): the jaxpr to evaluate
    consts (list[TensorLike]): the constant variables for the jaxpr
    *args (tuple[TensorLike]): The arguments for the jaxpr.

Returns:
    list[TensorLike]: the results of the execution.

## `handle_adjoint_transform`

```python
def handle_adjoint_transform(self, *invals, jaxpr, lazy, n_consts)
```

Interpret an adjoint transform primitive.

## `handle_ctrl_transform`

```python
def handle_ctrl_transform(self, *invals, n_control, jaxpr, control_values, work_wires, n_consts)
```

Interpret a ctrl transform primitive.

## `handle_for_loop`

```python
def handle_for_loop(self, start, stop, step, *args, jaxpr_body_fn, consts_slice, args_slice, abstract_shapes_slice)
```

Handle a for loop primitive.

## `handle_cond`

```python
def handle_cond(self, *invals, jaxpr_branches, consts_slices, args_slice)
```

Handle a cond primitive.

## `handle_while_loop`

```python
def handle_while_loop(self, *invals, jaxpr_body_fn, jaxpr_cond_fn, body_slice, cond_slice, args_slice)
```

Handle a while loop primitive.

## `handle_qnode`

```python
def handle_qnode(self, *invals, shots_len, qnode, device, execution_config, qfunc_jaxpr, n_consts)
```

Handle a qnode primitive.

## `handle_jacobian`

```python
def handle_jacobian(self, *invals, jaxpr, n_consts, **params)
```

Handle the jacobian primitive.

## `handle_value_and_grad`

```python
def handle_value_and_grad(self, *invals, jaxpr, argnums, **params)
```

Handle the value_and_grad primitive.

## `handle_vjp`

```python
def handle_vjp(self, *invals, jaxpr, argnums, **params)
```

Handle the vector-jacobian-product primitive.

## `handle_jvp`

```python
def handle_jvp(self, *invals, jaxpr, argnums, **params)
```

Handle the jacobian-vector-product primitive.

## `FlattenedInterpreter`

```python
class FlattenedInterpreter(PlxprInterpreter)
```

A variant of PlxprInterpreter that flattens out the control flow for
``for_prim``, ``while_prim``, and ``cond_prim``. Useful for evaluating, instead
of just transforming.

## `flatten_while_loop`

```python
def flatten_while_loop(self, *invals, jaxpr_body_fn, jaxpr_cond_fn, body_slice, cond_slice, args_slice)
```

Handle the while loop by a flattened python strategy.

## `flattened_cond`

```python
def flattened_cond(self, *invals, jaxpr_branches, consts_slices, args_slice)
```

Handle the cond primitive by a flattened python strategy.

## `flattened_for`

```python
def flattened_for(self, start, stop, step, *invals, jaxpr_body_fn, consts_slice, args_slice, abstract_shapes_slice)
```

Handle the for loop by a flattened python strategy.

## `eval_jaxpr`

```python
def eval_jaxpr(jaxpr: 'jax.extend.core.Jaxpr', consts: list, *args) -> list
```

A version of ``jax.core.eval_jaxpr`` that can handle creating arrays with dynamic shapes.

Args:
    jaxpr (jax.extend.core.Jaxpr): a jaxpr
    consts (list[TensorLike]): the constants for the jaxpr
    *args (TensorLike): the arguments for the jaxpr

Returns:
    list[TensorLike]

This function only differs from ``jax.core.eval_jaxpr`` in that it can handle the creation
of dynamically shaped arrays via ``iota`` and ``broadcast_in_dim``.

>>> import jax
>>> jax.config.update("jax_dynamic_shapes", True)
>>> def f(i):
...     return jax.numpy.arange(i)
>>> jaxpr = jax.make_jaxpr(f)(3)
>>> qp.capture.eval_jaxpr(jaxpr.jaxpr, jaxpr.consts, 2)
[Array([0, 1], dtype=int32)]
>>> jax.core.eval_jaxpr(jaxpr.jaxpr, jaxpr.consts, 2)
XlaRuntimeError: error: 'mhlo.dynamic_iota' op can't be translated to XLA HLO
