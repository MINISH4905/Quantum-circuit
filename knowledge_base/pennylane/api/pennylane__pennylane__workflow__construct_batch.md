---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/workflow/construct_batch.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/workflow/construct_batch.py
license: Apache-2.0
---

## Module `pennylane/workflow/construct_batch.py`

Contains a function extracting the tapes at postprocessing at any stage of a transform program.

## `get_transform_program`

```python
def get_transform_program(qnode, level='device', gradient_fn='unset')
```

Extract a transform program at a designated level.

.. warning::
    This function has been deprecated and is superceded by :func:`~.workflow.get_compile_pipeline`. Access to this function will be removed in v0.46.

Args:
    qnode (QNode): the qnode to get the transform program for.
    level (str, int, slice): An indication of what transforms to use from the full program.

        - ``"device"``: Uses the entire transformation pipeline.
        - ``"top"``: Ignores transformations and returns the original tape as defined.
        - ``"user"``: Includes transformations that are manually applied by the user.
        - ``"gradient"``: Extracts the gradient-level tape.
        - ``int``: Can also accept an integer, corresponding to a number of transforms in the program. ``level=0`` corresponds to the start of the program.
        - ``slice``: Can also accept a ``slice`` object to select an arbitrary subset of the transform program.

    gradient_fn (None, str, Transform): The processed gradient fn for the workflow.

Returns:
    CompilePipeline: the transform program corresponding to the requested level.

.. details::
    :title: Usage Details

    The transforms are organized as:

    .. image:: ../../_static/transforms_order.png
        :align: center
        :width: 800px
        :target: javascript:void(0);

    where ``transform1`` is first applied to the ``QNode`` followed by ``transform2``.  First, user transforms are run on the tapes,
    followed by the gradient expansion, followed by the device expansion. "Final" transforms, like ``param_shift`` and ``metric_tensor``,
    always occur at the end of the program, despite being part of user transforms. Note that when requesting a level by name
    (e.g. "gradient" or "device"), the preceding levels would be applied as well.

    .. code-block:: python

        dev = qp.device('default.qubit')

        @qp.metric_tensor # final transform
        @qp.transforms.merge_rotations # transform 2
        @qp.transforms.cancel_inverses # transform 1
        @qp.qnode(dev, diff_method="parameter-shift", gradient_kwargs={"shifts": np.pi / 4})
        def circuit():
            return qp.expval(qp.Z(0))

    By default, we get the full transform program. This can be explicitly specified by ``level="device"``.

    >>> print(qp.workflow.get_transform_program(circuit))
    CompilePipeline(
      [1] cancel_inverses(),
      [2] merge_rotations(),
      [3] _expand_metric_tensor(device_wires=None),
      [4] metric_tensor(device_wires=None),
      [5] _expand_transform_param_shift(shifts=0.7853981633974483),
      [6] defer_measurements(allow_postselect=True),
      [7] decompose(stopping_condition=..., device_wires=None, target_gates=..., name=default.qubit),
      [8] device_resolve_dynamic_wires(wires=None, allow_resets=False),
      [9] validate_device_wires(None, name=default.qubit),
      [10] validate_measurements(analytic_measurements=..., sample_measurements=..., name=default.qubit),
      [11] _conditional_broadcast_expand()
    )

    The ``"user"`` transforms are the ones manually applied to the qnode, :func:`~.cancel_inverses`,
    :func:`~.merge_rotations` and :func:`~.metric_tensor`.

    >>> print(qp.workflow.get_transform_program(circuit, level="user"))
    CompilePipeline(
      [1] cancel_inverses(),
      [2] merge_rotations(),
      [3] _expand_metric_tensor(device_wires=None),
      [4] metric_tensor(device_wires=None)
    )

    The ``_expand_transform_param_shift`` is the ``"gradient"`` transform.
    This expands all trainable operations to a state where the parameter shift transform can operate on them. For example,
    it will decompose any parametrized templates into operators that have generators. Note how ``metric_tensor`` is still
    present at the very end of resulting program.

    >>> print(qp.workflow.get_transform_program(circuit, level="gradient"))
    CompilePipeline(
      [1] cancel_inverses(),
      [2] merge_rotations(),
      [3] _expand_metric_tensor(device_wires=None),
      [4] metric_tensor(device_wires=None),
      [5] _expand_transform_param_shift(shifts=0.7853981633974483)
    )

    ``"top"`` and ``0`` both return empty transform programs.

    >>> print(qp.workflow.get_transform_program(circuit, level="top"))
    CompilePipeline()
    >>> print(qp.workflow.get_transform_program(circuit, level=0))
    CompilePipeline()

    The ``level`` can also be any integer, corresponding to a number of transforms in the program.

    >>> print(qp.workflow.get_transform_program(circuit, level=2))
    CompilePipeline(
      [1] cancel_inverses(),
      [2] merge_rotations()
    )

    ``level`` can also accept a ``slice`` object to select out any arbitrary subset of the
    transform program.  This allows you to select different starting transforms or strides.
    For example, you can skip the first transform or reverse the order:

    >>> print(qp.workflow.get_transform_program(circuit, level=slice(1,3)))
    CompilePipeline(
      [1] merge_rotations(),
      [2] _expand_metric_tensor(device_wires=None)
    )
    >>> print(qp.workflow.get_transform_program(circuit, level=slice(None, None, -1)))
    CompilePipeline(
      [1] _conditional_broadcast_expand(),
      [2] validate_measurements(analytic_measurements=..., sample_measurements=..., name=default.qubit),
      [3] validate_device_wires(None, name=default.qubit),
      [4] device_resolve_dynamic_wires(wires=None, allow_resets=False),
      [5] decompose(stopping_condition=..., device_wires=None, target_gates=..., name=default.qubit),
      [6] defer_measurements(allow_postselect=True),
      [7] _expand_transform_param_shift(shifts=0.7853981633974483),
      [8] metric_tensor(device_wires=None),
      [9] _expand_metric_tensor(device_wires=None),
      [10] merge_rotations(),
      [11] cancel_inverses()
    )

    You can get creative and pick a single category of transforms as follows, excluding
    any preceding transforms (and the final transform if it exists):

    >>> user_prog = qp.workflow.get_transform_program(circuit, level="user")
    >>> grad_prog = qp.workflow.get_transform_program(circuit, level="gradient")
    >>> dev_prog = qp.workflow.get_transform_program(circuit, level="device")
    >>> print(grad_prog[len(user_prog) - 1 : -1])
    CompilePipeline(
      [1] metric_tensor(device_wires=None)
    )
    >>> print(dev_prog[len(grad_prog) - 1 : -1])
    CompilePipeline(
      [1] _expand_transform_param_shift(shifts=0.7853981633974483),
      [2] defer_measurements(allow_postselect=True),
      [3] decompose(stopping_condition=..., device_wires=None, target_gates=..., name=default.qubit),
      [4] device_resolve_dynamic_wires(wires=None, allow_resets=False),
      [5] validate_device_wires(None, name=default.qubit),
      [6] validate_measurements(analytic_measurements=..., sample_measurements=..., name=default.qubit)
    )

## `construct_batch`

```python
def construct_batch(qnode: QNode | TorchLayer, level: str | int | slice='user') -> Callable
```

Construct the batch of tapes and post processing for a designated stage in the transform program.

Args:
    qnode (QNode): the qnode we want to get the tapes and post-processing for.
    level (str, int, slice): An indication of what transforms to apply before
        drawing. Check :func:`~.workflow.get_transform_program` for more
        information on the allowed values and usage details of this argument.

Returns:
    Callable:
        A function with the same call signature as the initial quantum function.
        This function returns a batch (tuple) of tapes and postprocessing function.

.. seealso:: :func:`pennylane.workflow.get_transform_program` to inspect the contents of the transform program for a specified level.

.. details::
    :title: Usage Details

    Suppose we have a QNode with several user transforms.

    .. code-block:: python

        from pennylane.workflow import construct_batch

        dev = qp.device('default.qubit')

        @qp.transforms.undo_swaps
        @qp.transforms.merge_rotations
        @qp.transforms.cancel_inverses
        @qp.qnode(dev, diff_method="parameter-shift", gradient_kwargs = {"shifts": np.pi/4})
        def circuit(x):
            qp.RandomLayers(qp.numpy.array([[1.0, 2.0]]), wires=(0,1))
            qp.RX(x, wires=0)
            qp.RX(-x, wires=0)
            qp.SWAP((0,1))
            qp.X(0)
            qp.X(0)
            return qp.expval(qp.X(0) + qp.Y(0))

    We can inspect what the device will execute with:

    >>> batch, fn = construct_batch(circuit, level="device")(1.23)
    >>> batch[0].circuit
    [RY(1.0, wires=[1]),
     RX(2.0, wires=[0]),
     expval(X(0) + Y(0))]

    These tapes can be natively executed by the device. However, with non-backprop devices the parameters
    will need to be converted to NumPy with :func:`~.convert_to_numpy_parameters`.

    >>> fn(dev.execute(batch))
    (np.float64(-0.9092974268256817),)

    Or what the parameter shift gradient transform will be applied to:

    >>> batch, fn = construct_batch(circuit, level="gradient")(1.23)
    >>> batch[0].circuit
    [RY(tensor(1., requires_grad=True), wires=[1]),
     RX(tensor(2., requires_grad=True), wires=[0]),
     expval(X(0) + Y(0))]

    We can inspect what was directly captured from the qfunc with ``level=0``.

    >>> batch, fn = construct_batch(circuit, level=0)(1.23)
    >>> batch[0].circuit
    [RandomLayers(tensor([[1., 2.]], requires_grad=True), wires=[0, 1]),
     RX(1.23, wires=[0]),
     RX(-1.23, wires=[0]),
     SWAP(wires=[0, 1]),
     X(0),
     X(0),
     expval(X(0) + Y(0))]

    And iterate though stages in the transform program with different integers.
    If we request ``level=1``, the ``cancel_inverses`` transform has been applied.

    >>> batch, fn = construct_batch(circuit, level=1)(1.23)
    >>> batch[0].circuit
    [RandomLayers(tensor([[1., 2.]], requires_grad=True), wires=[0, 1]),
     RX(1.23, wires=[0]),
     RX(-1.23, wires=[0]),
     SWAP(wires=[0, 1]),
     expval(X(0) + Y(0))]

    We can also slice into a subset of the transform program.  ``slice(1, None)`` would skip the first user
    transform ``cancel_inverses``:

    >>> batch, fn = construct_batch(circuit, level=slice(1,None))(1.23)
    >>> batch[0].circuit
    [RY(1.0, wires=[1]), RX(2.0, wires=[0]), X(0), X(0), expval(X(0) + Y(0))]
