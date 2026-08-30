---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/core/transform.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/core/transform.py
license: Apache-2.0
---

## Module `pennylane/transforms/core/transform.py`

This module defines the data structure that encapsulates a quantum transform.

## `specific_apply_transform`

```python
def specific_apply_transform(transform, obj, *targs, **tkwargs)
```

The default behavior for Transform._apply_transform. By default, it dispatches to the
generic registration.

## `generic_apply_transform`

```python
def generic_apply_transform(obj, transform, *targs, **tkwargs)
```

Apply a generic transform to a generic type of object.

When called with an object that is not a valid dispatch target (e.g., not a QNode, tape, etc.),
this returns a BoundTransform with the supplied args and kwargs. This enables patterns like:

>>> from pennylane.transforms import decompose, merge_rotations
>>> decompose(gate_set=qp.gate_sets.ALL_OPS) + merge_rotations(1e-6)
CompilePipeline(
  [1] <decompose(gate_set=All PennyLane Gates)>,
  [2] <merge_rotations(1e-06)>
)

where transforms are called with just configuration parameters and combined into a CompilePipeline.

## `Transform`

```python
class Transform
```

Generalizes a function that transforms tapes to work with additional circuit-like
objects such as a :class:`~.QNode`.

``transform`` should be applied to a function that transforms tapes. Once validated,
the result will be an object that is able to transform PennyLane's range of circuit-like
objects: :class:`~.QuantumTape`, quantum function and :class:`~.QNode`. A circuit-like
object can be transformed either via decoration or by passing it functionally through
the created transform.

Args:
    tape_transform (Callable | None): The input quantum transform must be a function
        that satisfies the following requirements:

        * Accepts a :class:`~.QuantumScript` as its first input and returns a sequence
          of :class:`~.QuantumScript` and a processing function.

        * The transform must have the following structure (type hinting is optional):
          ``my_tape_transform(tape: qp.tape.QuantumScript, ...) -> tuple[qp.tape.QuantumScriptBatch, qp.typing.PostprocessingFn]``

    pass_name (str | None): the name of the associated MLIR pass to be applied when
        Catalyst is used. See Usage Details for more information.

Keyword Args:
    expand_transform=None (Optional[Callable]): An optional transform that is applied directly
        before the input transform. It must be a function that satisfies the same requirements as
        ``tape_transform``.
    classical_cotransform=None (Optional[Callable]): A classical co-transform is a function to
        post-process the classical jacobian and the quantum jacobian and has the signature:
        ``my_cotransform(qjac, cjac, tape) -> tensor_like``
    is_informative=False (bool): Whether or not a transform is informative. If true, the transform
        is queued at the end of the compile pipeline and the tapes or qnode aren't executed.
    final_transform=False (bool): Whether or not the transform is terminal. If true, the transform
        is queued at the end of the compile pipeline. ``is_informative`` supersedes ``final_transform``.
    use_argnum_in_expand=False (bool): Whether to use ``argnum`` of the tape to determine trainable
        parameters during the expansion transform process.
    plxpr_transform=None (Optional[Callable]): Function for transforming plxpr. **Experimental**

**Example**

First define an input tape transform with the necessary structure defined above. In this example,
we copy the tape and sum the results of the execution of the two tapes.

.. code-block:: python

    from pennylane.tape import QuantumScript, QuantumScriptBatch
    from pennylane.typing import PostprocessingFn

    def my_quantum_transform(tape: QuantumScript) -> tuple[QuantumScriptBatch, PostprocessingFn]:
        tape1 = tape
        tape2 = tape.copy()

        def post_processing_fn(results):
            return qp.math.sum(results)

        return [tape1, tape2], post_processing_fn

We want to be able to apply this transform on both a ``qfunc`` and a :class:`pennylane.QNode` and will
use ``transform`` to achieve this. ``transform`` validates the signature of your input quantum transform
and makes it capable of transforming ``qfunc`` and :class:`pennylane.QNode` in addition to quantum tapes.
Let's define a circuit as a :class:`pennylane.QNode`:

.. code-block:: python

    dev = qp.device("default.qubit")

    @qp.qnode(device=dev)
    def qnode_circuit(a):
        qp.Hadamard(wires=0)
        qp.CNOT(wires=[0, 1])
        qp.X(0)
        qp.RZ(a, wires=1)
        return qp.expval(qp.Z(0))

We first apply ``transform`` to ``my_quantum_transform``:

>>> dispatched_transform = qp.transform(my_quantum_transform)

Now you can use the dispatched transform directly on a :class:`pennylane.QNode`.

For :class:`pennylane.QNode`, the dispatched transform populates the ``CompilePipeline`` of your QNode. The
transform and its processing function are applied in the execution.

>>> transformed_qnode = dispatched_transform(qnode_circuit)
>>> transformed_qnode
<QNode: device='<default.qubit device at ...>', interface='auto', diff_method='best', shots='Shots(total=None)'>

>>> print(transformed_qnode.compile_pipeline)
CompilePipeline(
  [1] my_quantum_transform()
)

If we apply ``dispatched_transform`` a second time to the :class:`pennylane.QNode`, we would add
it to the compile pipeline again and therefore the transform would be applied twice before execution.

>>> transformed_qnode = dispatched_transform(transformed_qnode)
>>> print(transformed_qnode.compile_pipeline)
CompilePipeline(
  [1] my_quantum_transform(),
  [2] my_quantum_transform()
)

When a transformed QNode is executed, the QNode's compile pipeline is applied to the generated tape
and creates a sequence of tapes to be executed. The execution results are then post-processed in the
reverse order of the compile pipeline to obtain the final results.

.. details::
    :title: Setup inputs

    The ``setup_inputs`` function will independently applied prior to any application of
    the transform. This allows for validation of the inputs, separation into positional and
    keyword arguments, and specification of a call signature and docstring for transforms
    without a tape definition.

    .. code-block:: python

        def my_transform_setup(a, b=1, metadata : str = "my_value"):
            "Docstring for my_transform."
            return (a, b), {"metadata": metadata}

        my_transform = qp.transform(pass_name="my_pass", setup_inputs=my_transform_setup)

        @qp.qnode(qp.device('default.qubit', wires=4))
        def circuit():
            return qp.expval(qp.Z(0))

    This allows us to perform eager input validation and set default values.

    >>> my_transform(circuit)
    Traceback (most recent call last):
        ...
    TypeError: <transform: my_pass> missing 1 required positional argument: 'a'
    >>> new_circuit = my_transform(circuit, a=2)
    >>> new_circuit.compile_pipeline[0]
    <my_pass(2, 1, metadata=my_value)>

    We will also have a docstring and signature. If a tape transform is present, the signature will
    be determined by that.

    >>> my_transform.__doc__
    'Docstring for my_transform.'
    >>> import inspect
    >>> inspect.signature(my_transform)
    <Signature (a, b=1, metadata: str = 'my_value')>

.. details::
    :title: Dispatch a transform onto a batch of tapes

    We can compose multiple transforms when working in the tape paradigm and apply them to more than
    one tape. The following example demonstrates how to apply a transform to a batch of tapes.

    **Example**

    In this example, we apply sequentially a transform to a tape and another one to a batch of tapes.
    We then execute the transformed tapes on a device and post-process the results.

    .. code-block:: python

        import pennylane as qp

        H = qp.PauliY(2) @ qp.PauliZ(1) + 0.5 * qp.PauliZ(2) + qp.PauliZ(1)
        measurement = [qp.expval(H)]
        operations = [qp.Hadamard(0), qp.RX(0.2, 0), qp.RX(0.6, 0), qp.CNOT((0, 1))]
        tape = qp.tape.QuantumTape(operations, measurement)

        batch1, function1 = qp.transforms.split_non_commuting(tape)
        batch2, function2 = qp.transforms.merge_rotations(batch1)

        dev = qp.device("default.qubit", wires=3)
        result = dev.execute(batch2)

    The first ``split_non_commuting`` transform splits the original tape, returning a batch of
    tapes ``batch1`` and a processing function ``function1``. The second ``merge_rotations``
    transform is applied to the batch of tapes returned by the first transform. It returns a
    new batch of tapes ``batch2``, each of which has been transformed by the second transform,
    and a processing function ``function2``.

    >>> batch2
    (<QuantumTape: wires=[0, 1, 2], params=1>, <QuantumTape: wires=[0, 1, 2], params=1>)

    >>> type(function2)
    <class 'function'>

    We can combine the processing functions to post-process the results of the execution.

    >>> function1(function2(result))
    np.float64(0.499...)

.. details::
    :title: Signature of a transform

    A dispatched transform is able to handle several PennyLane circuit-like objects:

    - :class:`pennylane.QNode`
    - a quantum function (callable)
    - :class:`pennylane.tape.QuantumScript`
    - a batch of :class:`pennylane.tape.QuantumScript`
    - :class:`pennylane.devices.Device`.

    For each object, the transform will be applied in a different way, but it always preserves the
    underlying tape-based quantum transform behaviour.

    The return of a dispatched transform depends upon which of the above objects is passed as an input:

    - For a :class:`~.QNode` input, the underlying transform is added to the QNode's
      :class:`~.CompilePipeline` and the return is the transformed :class:`~.QNode`.
      For each execution of the :class:`pennylane.QNode`, it first applies the compile pipeline on
      the original captured circuit. Then the transformed circuits are executed by a device and
      finally the post-processing function is applied on the results.

      When experimental program capture is enabled, transforming a :class:`~.QNode` returns
      a new function to which the transform has been added as a higher-order primitive.

    - For a quantum function (callable) input, the transform builds the tape when the quantum function
      is executed and then applies itself to the tape. The resulting tape is then converted back
      to a quantum function (callable). It therefore returns a transformed quantum function (Callable).
      The limitation is that the underlying transform can only return a sequence containing a single
      tape, because quantum functions only support a single circuit.

      When experimental program capture is enabled, transforming a function (callable) returns a new
      function to which the transform has been added as a higher-order primitive.

    - For a :class:`~.QuantumScript, the underlying quantum transform is directly applied on the
      :class:`~.QuantumScript`. It returns a sequence of :class:`~.QuantumScript` and a processing
      function to be applied after execution.

    - For a batch of :class:`pennylane.tape.QuantumScript`, the quantum transform is mapped across
      all the tapes. It returns a sequence of :class:`~.QuantumScript` and a processing function to
      be applied after execution. Each tape in the sequence is transformed by the transform.

    - For a :class:`~.devices.Device`, the transform is added to the device's compile pipeline
      and a transformed :class:`pennylane.devices.Device` is returned. The transform is added
      to the end of the device program and will be last in the overall compile pipeline.

.. details::
    :title: Transforms with Catalyst

    If a compilation pass is written in MLIR, using it in a ``qjit``'d workflow requires that
    it have a transform with a matching ``pass_name``. This ensures that the transform is
    properly applied as part of the lower-level compilation.

    For example, we can create a transform that will apply the ``cancel-inverses`` pass, like the
    in-built ``qp.transforms.cancel_inverses`` transform.

    .. code-block:: python

        my_transform = qp.transform(pass_name="cancel-inverses")

        @qp.qjit
        @my_transform
        @qp.qnode(qp.device('lightning.qubit', wires=4))
        def circuit():
            qp.X(0)
            qp.X(0)
            return qp.expval(qp.Z(0))

    We can see that the instruction to apply ``"cancel-inverses"`` is present in the initial MLIR.

    >>> circuit()
    Array(1., dtype=float64)
    >>> print(circuit.mlir[200:600])
    tensor<f64>
    }
    module @module_circuit {
        module attributes {transform.with_named_sequence} {
        transform.named_sequence @__transform_main(%arg0: !transform.op<"builtin.module">) {
            %0 = transform.apply_registered_pass "cancel-inverses" to %arg0 : (!transform.op<"builtin.module">) -> !transform.op<"builtin.module">
            transform.yield
        }
        }
        func.func public @circui

    Transforms can have both tape-based and ``pass_name``-based definitions. For example, the
    transform below called ``my_transform`` has both definitions. In this case, the MLIR pass
    will take precedence when being ``qjit``'d if only MLIR passes can occur after.

    .. code-block:: python

        from functools import partial

        @partial(qp.transform, pass_name="my-pass-name")
        def my_transform(tape):
            return (tape, ), lambda res: res[0]

    Note that any transform with only a ``pass_name`` definition *must* occur after any purely tape-based
    transform, as tape transforms occur prior to lowering to MLIR.

    >>> @qp.qjit
    ... @qp.defer_measurements
    ... @qp.transform(pass_name="cancel-inverses")
    ... @qp.qnode(qp.device('lightning.qubit', wires=4))
    ... def c():
    ...     qp.X(0)
    ...     qp.X(0)
    ...     return qp.expval(qp.Z(0))
    ...
    Traceback (most recent call last):
        ...
    ValueError: <cancel-inverses()> without a tape definition occurs before tape transform <defer_measurements()>.

### `pass_name`

```python
def pass_name(self) -> None | str
```

The name of the equivalent MLIR pass.

### `register`

```python
def register(self)
```

Returns a decorator for registering a specific application behavior for a given transform
and a new class.

.. code-block:: python

    @qp.transform
    def printer(tape):
        print("I have a tape: ", tape)
        return (tape, ), lambda x: x[0]

    @printer.register
    def _(obj: qp.operation.Operator, *targs, **tkwargs):
        print("I have an operator:", obj)
        return obj

>>> printer(qp.X(0))
I have an operator: X(0)
X(0)

### `generic_apply_transform`

```python
def generic_apply_transform(self, obj, *targs, **tkwargs)
```

generic_apply_transform(obj, *targs, **tkwargs)
Generic application of a transform that forms the default for all transforms.

Args:
    obj: The object we want to transform
    *targs: The arguments for the transform
    **tkwargs: The keyword arguments for the transform.

### `generic_register`

```python
def generic_register(arg)
```

Returns a decorator for registering a default application behavior for a transform for a new class.

Given a special new class, we can register how transforms should apply to them via:

.. code-block:: python

    class Subroutine:

        def __repr__(self):
            return f"<Subroutine: {self.ops}>"

        def __init__(self, ops):
            self.ops = ops

    from pennylane.transforms.core import Transform

    @Transform.generic_register
    def apply_to_subroutine(obj: Subroutine, transform, *targs, **tkwargs):
        targs, tkwargs = transform.setup_inputs(*targs, **tkwargs)
        tape = qp.tape.QuantumScript(obj.ops)
        batch, _ = transform(tape, *targs, **tkwargs)
        return Subroutine(batch[0].operations)

>>> qp.transforms.cancel_inverses(Subroutine([qp.Y(0), qp.X(0), qp.X(0)]))
<Subroutine: [Y(0)]>

The type can also be explicitly provided like:

.. code-block:: python

    @Transform.generic_register(Subroutine)
    def apply_to_subroutine(obj: Subroutine, transform, *targs, **tkwargs):
        targs, tkwargs = transform.setup_inputs(*targs, **tkwargs)
        tape = qp.tape.QuantumScript(obj.ops)
        batch, _ = transform(tape, *targs, **tkwargs)
        return Subroutine(batch[0].operations)

to more explicitly force registration for a given type.

### `__add__`

```python
def __add__(self, other)
```

Add two transforms to create a CompilePipeline.

### `__mul__`

```python
def __mul__(self, n)
```

Multiply by an integer to create a compile pipeline with this transform repeated.

### `setup_inputs`

```python
def setup_inputs(self, *targs, **tkwargs)
```

Call the setup_inputs function.

### `tape_transform`

```python
def tape_transform(self)
```

The tape transform.

### `expand_transform`

```python
def expand_transform(self)
```

The expand transform.

### `classical_cotransform`

```python
def classical_cotransform(self)
```

The classical co-transform.

### `plxpr_transform`

```python
def plxpr_transform(self)
```

Function for transforming plxpr.

### `is_informative`

```python
def is_informative(self)
```

``True`` if the transform is informative.

### `is_final_transform`

```python
def is_final_transform(self)
```

``True`` if the transformed tapes must be executed.

### `custom_qnode_transform`

```python
def custom_qnode_transform(self, fn)
```

Register a custom QNode execution wrapper function for the batch transform.

**Example**

.. code-block:: python3

    @transform
    def my_transform(tape, *targs, **tkwargs):
        ...
        return tapes, processing_fn

    @my_transform.custom_qnode_transform
    def my_custom_qnode_wrapper(self, qnode, targs, tkwargs):
        new_tkwargs = dict(tkwargs)
        new_tkwargs['shots'] = 100
        return self.generic_apply_transform(qnode, *targs, **new_tkwargs)

The custom QNode execution wrapper must have arguments
``self`` (the batch transform object), ``qnode`` (the input QNode
to transform and execute), ``targs`` and ``tkwargs`` (the transform
arguments and keyword arguments respectively).

It should return a QNode that accepts the *same* arguments as the
input QNode with the transform applied.

The default :meth:`~.generic_apply_transform` method may be called
if only pre- or post-processing dependent on QNode arguments is required.

### `default_qnode_transform`

```python
def default_qnode_transform(self, qnode, targs, tkwargs)
```

The default method that takes in a QNode and returns another QNode
with the transform applied.

## `BoundTransform`

```python
class BoundTransform
```

A transform with bound inputs.

Args:
    transform: Any transform.
    args (Sequence[Any]): The positional arguments to use with the transform.
    kwargs (Dict | None): The keyword arguments for use with the transform.

Keyword Args:
    use_argnum (bool): An advanced option used in conjunction with calculating
        classical cotransforms of jax workflows.

.. seealso:: :func:`~.pennylane.transform`

>>> bound_t = BoundTransform(qp.transforms.merge_rotations, (), {"atol": 1e-4})
>>> bound_t
<merge_rotations(atol=0.0001)>

The class can also be created by directly calling the transform with its inputs:

>>> qp.transforms.merge_rotations(atol=1e-4)
<merge_rotations(atol=0.0001)>

These objects can now directly applied to anything individual transforms can apply to:

.. code-block:: python

    @bound_t
    @qp.qnode(qp.device('null.qubit', wires=2))
    def c(x):
        qp.RX(x, 0)
        qp.RX(-x + 1e-6, 0)
        qp.RY(x, 1)
        qp.RY(-x + 1e-2, 1)
        return qp.probs(wires=(0,1))

If we draw this circuit, we can see that the ``merge_rotations`` transforms was applied with a
tolerance of ``1e-4``.  The ``RX`` gates sufficiently close to zero disappear, while the ``RY`` gates
that are further from zero remain.

>>> print(qp.draw(c)(1.0))
0: ───────────┤ ╭Probs
1: ──RY(0.01)─┤ ╰Probs

Repeated versions of the bound transform can be created with multiplication:

>>> print(bound_t * 3)
CompilePipeline(
  [1] merge_rotations(atol=0.0001),
  [2] merge_rotations(atol=0.0001),
  [3] merge_rotations(atol=0.0001)
)

And it can be used in conjunction with both individual transforms, bound transforms, and
compile pipelines.

>>> print(bound_t + qp.transforms.cancel_inverses)
CompilePipeline(
  [1] merge_rotations(atol=0.0001),
  [2] cancel_inverses()
)
>>> print(bound_t + qp.transforms.cancel_inverses + bound_t)
CompilePipeline(
  [1] merge_rotations(atol=0.0001),
  [2] cancel_inverses(),
  [3] merge_rotations(atol=0.0001)
)

### `tape_transform`

```python
def tape_transform(self) -> Callable | None
```

The raw tape transform definition for the transform.

### `transform`

```python
def transform(self) -> Callable | None
```

The raw tape transform definition of the transform.

.. warning::
    This property is deprecated and will be removed in v0.46.
    Please use :attr:`~.BoundTransform.tape_transform` instead.

### `expand_transform`

```python
def expand_transform(self) -> BoundTransform | None
```

The expand_transform associated with this transform.

### `pass_name`

```python
def pass_name(self) -> None | str
```

The name of the corresponding Catalyst pass, if it exists.

### `args`

```python
def args(self) -> tuple
```

The stored quantum transform's ``args``.

### `kwargs`

```python
def kwargs(self) -> dict
```

The stored quantum transform's ``kwargs``.

### `classical_cotransform`

```python
def classical_cotransform(self) -> None | Callable
```

The stored quantum transform's classical co-transform.

### `plxpr_transform`

```python
def plxpr_transform(self) -> None | Callable
```

The stored quantum transform's PLxPR transform.

**UNMAINTAINED AND EXPERIMENTAL**

### `is_informative`

```python
def is_informative(self) -> bool
```

Whether or not a transform is informative. If true the transform is queued at the end
of the transform program and the tapes or qnode aren't executed.

This property is rare, but used by such transforms as ``qp.transforms.commutation_dag``.

### `is_final_transform`

```python
def is_final_transform(self) -> bool
```

Whether or not the transform must be the last one to be executed
in a ``CompilePipeline``.

This property is ``True`` for most gradient transforms.

### `__add__`

```python
def __add__(self, other)
```

Add two transforms to create a CompilePipeline.

### `__mul__`

```python
def __mul__(self, n)
```

Multiply by an integer to create a pipeline with this transform repeated.

## `apply_to_callable`

```python
def apply_to_callable(obj: Callable, transform, *targs, **tkwargs)
```

Apply a transform to a Callable object.
