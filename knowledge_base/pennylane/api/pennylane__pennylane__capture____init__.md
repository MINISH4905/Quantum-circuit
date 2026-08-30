---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/capture/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/capture/__init__.py
license: Apache-2.0
---

## Module `pennylane/capture/__init__.py`

.. currentmodule:: pennylane

This module implements PennyLane's capturing mechanism for hybrid
quantum-classical programs.

.. warning::

    This module is experimental and will change significantly in the future. In addition,
    features herein are intended to be used with Catalyst (specifically, with the
    :func:`~.qjit` decorator).

.. currentmodule:: pennylane.capture

.. autosummary::
    :toctree: api

    ~disable
    ~enable
    ~enabled
    ~pause
    ~determine_abstracted_axes
    ~expand_plxpr_transforms
    ~eval_jaxpr
    ~run_autograph
    ~disable_autograph
    ~PlxprInterpreter
    ~FlatFn
    ~make_plxpr
    ~register_custom_staging_rule
    ~subroutine

The ``primitives`` submodule offers easy access to objects with jax dependencies such as
primitives and abstract types.
It is not available with ``import pennylane``, but the contents can be accessed via manual
import ``from pennylane.capture.primitives import *``.

.. currentmodule:: pennylane.capture.primitives

.. autosummary::
    :toctree: api

    AbstractOperator
    AbstractMeasurement
    adjoint_transform_prim
    cond_prim
    ctrl_transform_prim
    for_loop_prim
    qnode_prim
    while_loop_prim

See also:

.. currentmodule:: pennylane

.. autosummary::
    :toctree: api

    ~tape.plxpr_to_tape


To activate and deactivate the new PennyLane program capturing mechanism, use
the switches ``qp.capture.enable`` and ``qp.capture.disable``.
Whether or not the capturing mechanism is currently being used can be
queried with ``qp.capture.enabled``.
By default, the mechanism is disabled:

.. code-block:: pycon

    >>> import pennylane as qp
    >>> qp.capture.enabled()
    False
    >>> qp.capture.enable()
    >>> qp.capture.enabled()
    True
    >>> qp.capture.disable()
    >>> qp.capture.enabled()
    False

.. note::
    To activate program capture when using :func:`~.qjit`, please set `capture=True`
    instead of using `qp.capture.enable`. By default, `capture=False`.


**Custom Operator Behaviour**

Any operator that inherits from :class:`~.Operator` gains a default ability to be captured
in a Jaxpr. Any positional argument is bound as a tracer, wires are processed out into individual tracers,
and any keyword arguments are passed as keyword metadata.

.. code-block:: python

    class MyOp1(qp.operation.Operator):

        def __init__(self, arg1, wires, key=None):
            super().__init__(arg1, wires=wires)

    def qfunc(a):
        MyOp1(a, wires=(0,1), key="a")

    qp.capture.enable()
    print(jax.make_jaxpr(qfunc)(0.1))

.. code-block::

    { lambda ; a:f32[]. let
        _:AbstractOperator() = MyOp1[key=a n_wires=2] a 0 1
    in () }

But an operator developer may need to override custom behavior for calling ``cls._primitive.bind``
(where ``cls`` indicates the class) if:

* The operator does not accept wires, like :class:`~.SymbolicOp` or :class:`~.CompositeOp`.
* The operator needs to enforce a data / metadata distinction, like :class:`~.PauliRot`.

In such cases, the operator developer can override ``cls._primitive_bind_call``, which
will be called when constructing a new class instance instead of ``type.__call__``.  For example,

.. code-block:: python

    class JustMetadataOp(qp.operation.Operator):

        def __init__(self, metadata):
            super().__init__(wires=[])
            self._metadata = metadata

        @classmethod
        def _primitive_bind_call(cls, metadata):
            return cls._primitive.bind(metadata=metadata)


    def qfunc():
        JustMetadataOp("Y")

    qp.capture.enable()
    print(jax.make_jaxpr(qfunc)())

.. code-block::

    { lambda ; . let _:AbstractOperator() = JustMetadataOp[metadata=Y]  in () }

As you can see, the input ``"Y"``, while being passed as a positional argument, is converted to
metadata within the custom ``_primitive_bind_call`` method.

If needed, developers can also override the implementation method of the primitive like was done with ``Controlled``.
``Controlled`` needs to do so to handle packing and unpacking the control wires.

.. code-block:: python

    class MyCustomOp(qp.operation.Operator):
        pass

    @MyCustomOp._primitive.def_impl
    def _(*args, **kwargs):
        return type.__call__(MyCustomOp, *args, **kwargs)
