---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/get_compile_pipeline.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/get_compile_pipeline.py
license: Apache-2.0
---

## Module `pennylane/workflow/get_compile_pipeline.py`

Contains a function for getting the compile pipeline of a given QNode.

## `get_compile_pipeline`

```python
def get_compile_pipeline(qnode: QNode, level: str | int | slice='user') -> Callable[P, CompilePipeline]
```

Create a function that produces the compilation pipeline at the designated level.

.. note::

    If used on a QJIT'd QNode, only user applied transforms are accessible.
    Consequently, ``level="gradient"`` and ``level="device"`` are not supported.

Args:
    qnode (:class:`~.QNode`): The QNode to get the compilation pipeline for.
    level (str, int, slice): Specifies the stage at which to retrieve the compile pipeline. Defaults to ``"user"``.

        - ``"top"``: Returns an empty pipeline representing the initial stage before any transformations are applied.
        - ``"user"``: Only includes transformations that are manually applied by the user.
        - ``"gradient"``: Includes user-specified transformations and any appended gradient-related passes.
        - ``"device"``: The full pipeline (user + gradient + device) as prepared for device execution.
        - ``str``: Includes all transformations up to the name of a specific :func:`~.marker` inserted into the pipeline.
        - ``int``: The number of transformations to include from the start of the pipeline (e.g. ``level=0`` is empty and ``level=3`` extracts the first three transforms).
        - ``slice``: Extract a specific range of transformations using standard 0-based Pythonic indexing (e.g. ``level=slice(1, 4)`` retrieves the second to the fourth transformations).

Returns:
    Callable: A function with the same signature as ``qnode``. When called, the function will return the :class:`~.CompilePipeline` corresponding to the requested level.

**Example:**

.. code-block:: python

    from pennylane.workflow import get_compile_pipeline

    dev = qp.device("default.qubit")

    @qp.transforms.merge_rotations
    @qp.transforms.cancel_inverses
    @qp.qnode(dev)
    def circuit(angle):
        qp.RX(angle, wires=0)
        qp.H(0)
        qp.H(0)
        qp.RX(angle, wires=0)
        return qp.expval(qp.Z(0))

>>> args = (3.14,)
>>> print(get_compile_pipeline(circuit)(*args)) # or level="user"
CompilePipeline(
  [1] cancel_inverses(),
  [2] merge_rotations()
)

.. details::
    :title: Usage Details

    Consider the circuit below which has three user applied transforms (i.e. :func:`~.cancel_inverses`,
    :func:`~.merge_rotations`, and :func:`~.metric_tensor`), a ``"checkpoint"`` marker, and uses
    the parameter-shift gradient method.

    .. code-block:: python

        dev = qp.device("default.qubit")

        @qp.metric_tensor
        @qp.transforms.merge_rotations
        @qp.marker("checkpoint")
        @qp.transforms.cancel_inverses
        @qp.qnode(dev, diff_method="parameter-shift", gradient_kwargs={"shifts": np.pi / 4})
        def circuit(x):
            qp.RX(x, wires=0)
            qp.H(0)
            qp.H(0)
            qp.RX(x, wires=0)
            return qp.expval(qp.Z(0))

    To get the full compile pipeline that is used during execution on this device we can specify ``level="device"``,

    >>> print(get_compile_pipeline(circuit, level="device")(3.14))
    CompilePipeline(
      [1] cancel_inverses(),
       ├─▶ checkpoint
      [2] merge_rotations(),
      [3] _expand_metric_tensor(device_wires=None),
      [4] metric_tensor(device_wires=None),
      [5] _expand_transform_param_shift(shifts=0.7853981633974483),
      [6] defer_measurements(allow_postselect=True),
      [7] decompose(stopping_condition=..., device_wires=None, target_gates=All DefaultQubit Gates, name=default.qubit),
      [8] device_resolve_dynamic_wires(wires=None, allow_resets=False),
      [9] validate_device_wires(None, name=default.qubit),
      [10] validate_measurements(analytic_measurements=..., sample_measurements=..., name=default.qubit),
      [11] _conditional_broadcast_expand()
    )

    As can be seen above, this not only includes the three transforms we manually applied, but also a set of transforms
    used by the device in order to execute the circuit.

    The ``"user"`` level will retrieve the portion of the compile pipeline that was manually applied to the qnode,

    >>> print(get_compile_pipeline(circuit, level="user")(3.14))
    CompilePipeline(
      [1] cancel_inverses(),
       ├─▶ checkpoint
      [2] merge_rotations(),
      [3] _expand_metric_tensor(device_wires=None),
      [4] metric_tensor(device_wires=None)
    )

    The ``"gradient"`` level builds on top of this to then add any relevant gradient transforms,
    which in this case corresponds to ``_expand_transform_param_shift``. This is a transform that
    expands all trainable operations to a state where the parameter shift transform can operate on them.
    For example, it will decompose any parametrized templates into operators that have generators.

    >>> print(get_compile_pipeline(circuit, level="gradient")(3.14))
    CompilePipeline(
      [1] cancel_inverses(),
       ├─▶ checkpoint
      [2] merge_rotations(),
      [3] _expand_metric_tensor(device_wires=None),
      [4] metric_tensor(device_wires=None),
      [5] _expand_transform_param_shift(shifts=0.7853981633974483)
    )

    We can also retrieve our compile pipeline up to a specific stage indicated by the name given to a :func:`qp.marker`,
    which in our example is indicated by the ``"checkpoint"`` marker,

    >>> print(get_compile_pipeline(circuit, level="checkpoint")(3.14))
    CompilePipeline(
      [1] cancel_inverses()
    )

    If ``level`` is ``"top"`` or ``0``, an empty compile pipeline will be returned,

    >>> print(get_compile_pipeline(circuit, level=0)(3.14))
    CompilePipeline()
    >>> print(get_compile_pipeline(circuit, level="top")(3.14))
    CompilePipeline()

    The ``level`` can also be an integer, corresponding to the number of transforms to retrieve from the compile pipeline,

    >>> print(get_compile_pipeline(circuit, level=3)(3.14))
    CompilePipeline(
      [1] cancel_inverses(),
       ├─▶ checkpoint
      [2] merge_rotations(),
      [3] _expand_metric_tensor(device_wires=None)
    )

    ``level`` can also accept a ``slice`` object enabling you to extract a specific range of transformations in the compile pipeline.
    For example, we can retrieve the second to fourth transform with:

    >>> print(get_compile_pipeline(circuit, level=slice(1,4))(3.14))
    CompilePipeline(
       ├─▶ checkpoint
      [1] merge_rotations(),
      [2] _expand_metric_tensor(device_wires=None),
      [3] metric_tensor(device_wires=None)
    )

    Note that standard Pythonic indexing is used meaning that ``level=slice(1, 4)`` corresponds to the second
    to the fourth transform (equivalent to ``level=[2, 3, 4]``). Additionally, the ``"checkpoint"`` marker is
    still in the pipeline as it marks a location in the pipeline rather than being attached to a particular transformation.
