---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/core.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/core.py
license: Apache-2.0
---

## Module `pennylane/templates/core.py`

This module contains the abstractions for defining subroutines.

.. currentmodule:: pennylane.templates.core

.. autosummary::
    :toctree: api

    ~Subroutine
    ~SubroutineOp
    ~AbstractArray
    ~change_op_basis_subroutine_resource_rep
    ~adjoint_subroutine_resource_rep
    ~subroutine_resource_rep

## `AbstractArray`

```python
class AbstractArray
```

An abstract representation of an array that contains the shape and dtype
attributes necessary for resource calculations.

This class is used with :func:`~pennylane.templates.subroutine_resource_rep`
for specifying abstract information about a :class:`~.Subroutine` for
purposes of resource calculations used with graph decompositions.

Args:
    shape (tuple(int)): the dimensions of the array. ``()`` corresponds to a scalar.
    dtype (type): the data type of the array. Defaults to ``np.dtype(int)`` for easier use in specifying
    wires.

## `change_op_basis_subroutine_resource_rep`

```python
def change_op_basis_subroutine_resource_rep(compute: 'Operator | CompressedResourceOp | Subroutine', target: 'Operator | CompressedResourceOp | Subroutine', uncompute: 'Operator | CompressedResourceOp | Subroutine'=None) -> CompressedResourceOp
```

Generate a :class:`~pennylane.decomposition.CompressedResourceOp` similar to :func:`~.change_op_basis_resource_rep` that is more
specifically targeted for use with :class:`~.Subroutine` instances.

If any of `compute`, `target`, or `uncompute` are subroutines, they should be provided as partials, with any parameters bound
in advance.

Args:
    compute (Operator | pennylane.decomposition.resources.CompressedResourceOp | Subroutine): the compute operator or subroutine.
    target (Operator | pennylane.decomposition.resources.CompressedResourceOp | Subroutine): the target operator or subroutine.
    uncompute (Operator | pennylane.decomposition.resources.CompressedResourceOp | Subroutine | None): the optional uncompute operator or subroutine.
Returns:
    pennylane.decomposition.CompressedResourceOp: a condensed representation of the :func:`~.change_op_basis` involving a subroutine that can be
    used in specifying the resources of another operator, template or subroutine.

.. note::

    See :func:`~.subroutine_resource_rep` for more information.

## `adjoint_subroutine_resource_rep`

```python
def adjoint_subroutine_resource_rep(subroutine: 'Subroutine', *args, **kwargs) -> CompressedResourceOp
```

Generate a :class:`~pennylane.decomposition.CompressedResourceOp` similar to :func:`~.adjoint_resource_rep` that is more
specifically targeted for use with :class:`~.Subroutine` instances.

Args:
    subroutine (Subroutine): the subroutine whose adjoint we are going to use in a decomposition.
Returns:
    pennylane.decomposition.CompressedResourceOp: a condensed representation of the subroutine's adjoint that can be used in specifying
    the resources of another function.

.. note::

    See :func:`~pennylane.templates.core.subroutine_resource_rep` for more information.

## `subroutine_resource_rep`

```python
def subroutine_resource_rep(subroutine: 'Subroutine', *args, **kwargs) -> CompressedResourceOp
```

Generate a :class:`~pennylane.decomposition.CompressedResourceOp` similar to
:func:`~pennylane.decomposition.resource_rep` that is more
specifically targeted for use with :class:`~.Subroutine` instances.

Args:
    subroutine (Subroutine): the subroutine we are going to use in a decomposition.

Returns:
    pennylane.decomposition.CompressedResourceOp: a condensed representation of the subroutine
    that can be used in specifying the resources of another function.

.. warning:: Note that the following features only work with tape-based PennyLane, and
    do not work with Catalyst.

Suppose we have a ``Subroutine`` we want to use in the decomposition of another ``Operator``.

.. code-block:: python

    from functools import partial

    def S_resources(params, wires, rotation):
        return {qp.resource_rep(rotation): params.shape[0]}

    @partial(qp.templates.Subroutine, static_argnames="rotation", compute_resources=S_resources)
    def S(params, wires, rotation):
        for x in params:
            rotation(x, wires)

We can add ``S`` to the resources of another ``Operator`` by using this function together with
an abstract form of the arguments it will be called with, using :class:`~.AbstractArray`.

.. code-block:: python

    from pennylane.templates import AbstractArray, subroutine_resource_rep

    class MyOp(qp.operation.Operation):
        pass

    abstract_params = AbstractArray((4, ), float)
    abstract_wires = AbstractArray(()) # a single wire
    S_rep = subroutine_resource_rep(S, abstract_params, abstract_wires, qp.RX)

    @qp.decomposition.register_resources({S_rep: 1})
    def my_op_decomposition(wires):
        # data of shape (4, ) and dtype float
        params = np.array([1.0, 2.0, 3.0, 4.0])
        S(params, wires, qp.RX)

    qp.add_decomps(MyOp, my_op_decomposition)

We can now see ``MyOp`` decompose into the relevant subroutine:

.. code-block:: python

    qp.decomposition.enable_graph()

    @qp.qnode(qp.device('reference.qubit', wires=1))
    def c():
        MyOp(wires=0)
        return qp.state()

>>> print(qp.draw(qp.decompose(c, max_expansion=1))())
0: ──S(M0)─┤  State
<BLANKLINE>
M0 =
[1. 2. 3. 4.]

## `SubroutineOp`

```python
class SubroutineOp(Operation)
```

An operator constructed from a :class:`~.Subroutine` together with its bound arguments.
This class should not be created directly, but is the byproduct of calling a ``Subroutine``.

Args:
    subroutine (Subroutine): the definition of a subroutine from a quantum function
    bound_args (inspect.BoundArguments): the inputs to the subroutine bound to the subroutine's signature
    decomposition (list[Operator]): the decomposition of the subroutine with the given ``bound_args``.
    output (Any): Any output from the subroutine.

### `bound_args`

```python
def bound_args(self) -> BoundArguments
```

The inputs to the Subroutine.

### `output`

```python
def output(self)
```

Test output of the subroutine.

### `subroutine`

```python
def subroutine(self) -> 'Subroutine'
```

The subroutine definition used with this operator.

## `Subroutine`

```python
class Subroutine
```

The definition of a Subroutine, compatible both with program capture and backwards
compatible with operators.

Args:
    definition (Callable): a quantum function that can contain both quantum and classical processing.
        The definition can return purely classical values or the outputs from mid circuit measurements, but
        it cannot return terminal statistics.
    setup_inputs (Callable): An function that can run preprocessing on the inputs before hitting
        definition.  This can be used to make static arguments hashable for compatibility with program capture.
    static_argnames (str | tuple[str]): The name of arguments that are treated as static (trace- and compile-time constant).
    wire_argnames (str | tuple[str]): The name of arguments that represent wire registers.  While the users can
        be more permissive in what they provide to wire arguments, the definition should treat all wire
        arguments as 1D arrays.
    compute_resources (None | Callable): A function for computing resources used by the function.
        It should only calculate the resources from the static arguments, the length of the wire registers,
        and the shape and dtype of the dynamic arguments. In the case of the specific resources
        depending on the specifics of a dynamic argument, a worse case scenario can be used.
    exact_resources (bool): whether or not ``compute_resources`` is exact. Similar to ``register_resources``,
        this option is used purely for testing purposes.

For simple cases, a ``Subroutine`` can simply be created from a single quantum function, like:

.. code-block:: python

    from functools import partial
    from pennylane.templates import Subroutine

    @Subroutine
    def MyTemplate(x, y, wires):
        qp.RX(x, wires[0])
        qp.RY(y, wires[0])

    @qp.qnode(qp.device('default.qubit'))
    def c():
        MyTemplate(0.1, 0.2, 0)
        return qp.state()

    c()

>>> print(qp.draw(c)())
0: ──MyTemplate(0.10,0.20)─┤  State
>>> print(qp.draw(c, level="device")())
0: ──RX(0.10)──RY(0.20)─┤  State
>>> print(qp.specs(c)().resources)
Wire allocations: 1
Total gates: 1
Gate counts:
- MyTemplate: 1
Measurements:
- state(all wires): 1
Depth: 1

For multiple wire register inputs or use of a different name than ``"wires"``, the
``wire_argnames`` can be provided:

.. code-block:: python

    from functools import partial

    @partial(Subroutine, wire_argnames=("register1", "register2"))
    def MultiRegisterTemplate(register1, register2):
        for wire in register1:
            qp.X(wire)
        for wire in register2:
            qp.Z(wire)

>>> print(qp.draw(MultiRegisterTemplate)(0, [1,2]))
0: ─╭MultiRegisterTemplate─┤
1: ─├MultiRegisterTemplate─┤
2: ─╰MultiRegisterTemplate─┤

Static arguments are treated as compile-time constant with ``qp.qjit``, and must
be hashable. These are any inputs that are not numerical data or Operators. In the below
example, the ``pauli_word`` argument is a string that is a static argument.

.. code-block:: python

    @partial(Subroutine, static_argnames="pauli_word")
    def WithStaticArg(x, wires, pauli_word: str):
        qp.PauliRot(x, pauli_word, wires)

**Setup Inputs:**

Sometimes we want to allow the user to be able to provide a static input in a
non-hashable format. For example, the user might provide an input as a ``list``
instead of a ``tuple``.  This can be done by providing the ``setup_inputs`` function.
This function should have the same call signature as the template and return
a tuple of position arguments and a dictionary of keyword arguments.

.. code-block:: python

    def setup_inputs(x, wires, pauli_words):
        return (x, wires, tuple(pauli_words)), {}

    @partial(Subroutine, static_argnames="pauli_words", setup_inputs=setup_inputs)
    def WithSetup(x, wires, pauli_words: list[str] | tuple[str,...]):
        for word in pauli_words:
            qp.PauliRot(x, word, wires)


>>> print(qp.draw(WithSetup)(0.5, [0, 1], ["XX", "XY", "XZ"]))
0: ─╭WithSetup(0.50)─┤
1: ─╰WithSetup(0.50)─┤

``setup_inputs`` can also help us set default values for dynamic inputs. If an input
is numerical (not static), but needs to default to a value contingent on the other inputs, that
is allowed to occur in ``setup_inputs``. This has to happen in ``setup_inputs`` because
a dynamic, numerical input like ``y`` cannot be ``None`` when it hits the quantum function
definition.

.. code-block:: python

    def setup_default_value(y : int | None = None, wires=()):
        if y is None:
            y = len(wires)
        return (y, wires), {}


``setup_inputs`` should only interact with with compile-time information like
static arguments, pytree structures, shapes, and dtypes, and *not* interact with any
numerical values. Any manipulation or checks on values should occur inside the quantum
function definition itself.

.. code-block::

    def BAD(x, wires, metadata):
        if x < 0:
            # do something
        ...

    def GOOD(x, wires, metadata):
        if x.shape == ():
            # do something
        if metadata:
            # do something else
        ...


**Integration with Graph decompositions:**

.. warning::

    Program capture Catalyst only supports graph decompositions for fundamental *Gates* with
    Ahead-Of-Time compiled decomposition rules and simple call signatures. Graph decompositions
    are not available for higher order algorithmic abstractions like ``Subroutine``, or operators
    that decompose to ``Subroutine``, in Catalyst.


To use ``Subroutine`` with graph-based decompositions, we need a function to compute the resources.
A default fallback calculates the resources by calling the subroutine with
dummy parameters created with ``np.empty``. This will be inefficient
and will only work if the dynamic parameters have no additional constraints, such as normalization
or unitarity.
The calculation of resources should only depend on the static arguments, the number of wires
in each register, and the shape and ``dtype`` of the dynamic arguments. This will allow
the calculation of the resources to performed in an abstract way.

.. code-block:: python

    def RXLayerResources(params, wires):
        return {qp.RX: qp.math.shape(params)[0]}

    @partial(qp.templates.Subroutine, compute_resources=RXLayerResources)
    def RXLayer(params, wires):
        for i in range(params.shape[0]):
            qp.RX(params[i], wires[i])

For example, we should be able to calculate the resources using the :class:`~.AbstractArray`
class.

>>> from pennylane.templates import AbstractArray
>>> abstract_params = AbstractArray((10,), float)
>>> abstract_wires = AbstractArray((10,))
>>> RXLayer.compute_resources(abstract_params, abstract_wires)
{<class 'pennylane.ops.qubit.parametric_ops_single_qubit.RX'>: 10}

We can create an ``Operator`` that can decompose to a ``Subroutine`` using :class:`~.AbstractArray`
and :func:`~.subroutine_resource_rep`.

.. code-block:: python

    from pennylane.templates import AbstractArray, subroutine_resource_rep

    class MyOp(qp.operation.Operation):
        pass

    abstract_params = AbstractArray((3, ), float)
    abstract_wires = AbstractArray((3, ))
    rxlayer_rep = subroutine_resource_rep(RXLayer, abstract_params, abstract_wires)

    @qp.decomposition.register_resources({rxlayer_rep: 1})
    def MyOpDecomposition(wires):
        params = np.arange(3, dtype=float)
        RXLayer(params, wires)

    qp.add_decomps(MyOp, MyOpDecomposition)

.. code-block:: python

    @qp.qnode(qp.device('default.qubit'))
    def c():
        MyOp((0,1,2))
        return qp.expval(qp.Z(0))

    qp.decomposition.enable_graph()


>>> print(qp.draw(c)())
0: ─╭MyOp─┤  <Z>
1: ─├MyOp─┤
2: ─╰MyOp─┤
>>> print(qp.draw(qp.decompose(c, max_expansion=1))())
0: ─╭RXLayer(M0)─┤  <Z>
1: ─├RXLayer(M0)─┤
2: ─╰RXLayer(M0)─┤
<BLANKLINE>
M0 =
[0. 1. 2.]
>>> print(qp.draw(qp.decompose(c, max_expansion=2))())
0: ──RX(0.00)─┤  <Z>
1: ──RX(1.00)─┤
2: ──RX(2.00)─┤

**Use of Autograph:**

Autograph converts Python control flow (``if``, ``for``, ``while``, etc.) into PennyLane's
control flow (:func:`~.for_loop`, :func:`~.cond`, :func:`~.while_loop`) that is compatible
with traced arguments. The user's choice of applying autograph on their workflow in :func:`~.qjit`
does not effect the capture of a ``Subroutine``. Autograph should instead be applied manually
with :func:`~.run_autograph` to the quantum function as needed.

For example, is we have the template and ``qjit`` workflow:

.. code-block:: python

    @qp.templates.Subroutine
    def f(x, wires):
        if x < 0:
            qp.X(wires)
        else:
            qp.Y(wires)

    @qp.qjit(autograph=True)
    @qp.qnode(qp.device('lightning.qubit', wires=1))
    def c(x):
        f(x, 0)
        return qp.expval(qp.Z(0))

>>> c(0.5) # doctest: +SKIP
Traceback (most recent call last):
    ...
CaptureError: Autograph must be used when Python control flow is dependent on a dynamic variable
(a function input). Please ensure that autograph is being correctly enabled with
`qp.capture.run_autograph` or disabled with `qp.capture.disable_autograph` or
consider using PennyLane native control flow functions like `qp.for_loop`, `qp.while_loop`,
or `qp.cond`.

In order to support a conditional on a dynamic value, we should either ``run_autograph`` to the
quantum function definition itself or use ``qp.cond`` manually:

.. code-block:: python

    @qp.templates.Subroutine
    @qp.capture.run_autograph
    def UsingAutograph(x, wires):
        if x < 0:
            qp.X(wires)
        else:
            qp.Y(wires)

    @qp.templates.Subroutine
    def UsingCond(x, wires):
        qp.cond(x  > 0, qp.X, qp.Y)(wires)

### `name`

```python
def name(self) -> str
```

A string representation to label the Subroutine.

### `exact_resources`

```python
def exact_resources(self) -> bool
```

Whether or not the ``compute_resources`` function provides the exact resources. Used for testing.

### `signature`

```python
def signature(self) -> Signature
```

"The signature for the definition. Used to preprocess the user inputs.

### `compute_resources`

```python
def compute_resources(self, *args, **kwargs) -> dict
```

Calculate a condensed representation for the resources required for the Subroutine.

### `definition`

```python
def definition(self, *args, **kwargs)
```

The quantum function definition of the subroutine.

### `setup_inputs`

```python
def setup_inputs(self, *args, **kwargs) -> tuple[tuple, dict]
```

Perform and initial setup of the arguments.

### `static_argnames`

```python
def static_argnames(self) -> tuple[str, ...]
```

The names of arguments that are compile time constant.

### `wire_argnames`

```python
def wire_argnames(self) -> tuple[str, ...]
```

The names for the arguments that represent a register of wires.

### `dynamic_argnames`

```python
def dynamic_argnames(self) -> tuple[str, ...]
```

The names of the function arguments that are pytrees of numerical data. These are the arguments
that are not static or wires.

### `operator`

```python
def operator(self, *args, id: str | None=None, **kwargs) -> SubroutineOp
```

Create a ``SubroutineOp`` from the template.

## `CollectedSubroutine`

```python
class CollectedSubroutine(Operation)
```

Represents a single subroutine encountered by CollectOpsandMeas.
While it contains less information than the corresponding :class:`~.SubroutineOp`,
it can be useful for testing the captured plxpr.

The only properties held onto by this "Operator" are name (a string), wires, and
decomposition.
