---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/noise/add_noise.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/noise/add_noise.py
license: Apache-2.0
---

## Module `pennylane/noise/add_noise.py`

Transform for adding a noise model to a quantum circuit or device

## `add_noise`

```python
def add_noise(tape, noise_model, level='user')
```

Insert operations according to a provided noise model.

Circuits passed through this quantum transform will be updated to apply the
insertion-based :class:`~.NoiseModel`, which contains mappings
``{BooleanFn: Callable}`` from conditions to the corresponding noise
gates for circuit operations and measurements respectively. First, each condition
in the first mapping of a noise model will be evaluated on the operations
contained within the given circuit. For conditions that evaluate to ``True``,
the noisy gates contained within the ``Callable`` will be inserted after the
operation under consideration. Similar procedure will be followed for each
measurement in the circuit, in case a second mapping is present in the
noise model to indicate readout errors.

Args:
    tape (QNode or QuantumTape or Callable or pennylane.devices.Device): the input circuit or
        device to be transformed.
    noise_model (~pennylane.NoiseModel): noise model according to which noise has to be inserted.
    level (str, int, slice): An indication of which stage in the compile pipeline the
        noise model should be applied to. Only relevant when transforming a ``QNode``. More details
        on the following permissible values can be found in the :func:`~.workflow.get_compile_pipeline` -

        * ``str``: acceptable keys are ``"top"``, ``"user"``, ``"device"``, and ``"gradient"``.
        * ``int``: how many transforms to include, starting from the front of the program.
        * ``slice``: a slice to select out components of the compile pipeline.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[.QuantumTape], function] or device (pennylane.devices.Device):
    Transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

Raises:
    ValueError: argument ``noise_model`` is not a valid noise model.

.. note::

    For a given ``model_map`` and ``meas_map`` within a ``NoiseModel``, if multiple conditionals
    in the given maps evaluate to ``True`` for an operation or measurement process, then the
    noise operations defined via their respective noisy quantum functions will be added in the
    same order in which the conditionals appear in them.

**Example:**

The following QNode can be transformed to add noise to the circuit:

.. code-block:: python

    dev = qp.device("default.mixed", wires=2)

    fcond1 = qp.noise.op_eq(qp.RX) & qp.noise.wires_in([0, 1])
    noise1 = qp.noise.partial_wires(qp.PhaseDamping, 0.4)

    fcond2 = qp.noise.op_in([qp.RX, qp.RZ])
    def noise2(op, **kwargs):
        qp.ThermalRelaxationError(op.parameters[0] * 0.5, kwargs["t1"],  kwargs["t2"], 0.6, op.wires)

    fcond3 = qp.noise.meas_eq(qp.expval) & qp.noise.wires_in([0, 1])
    noise3 = qp.noise.partial_wires(qp.PhaseFlip, 0.2)

    noise_model = qp.NoiseModel(
        {fcond1: noise1, fcond2: noise2}, {fcond3: noise3}, t1=2.0, t2=0.2
    )

    @qp.noise.add_noise(noise_model=noise_model)
    @qp.qnode(dev)
    def circuit(w, x, y, z):
        qp.RX(w, wires=0)
        qp.RY(x, wires=1)
        qp.CNOT(wires=[0, 1])
        qp.RY(y, wires=0)
        qp.RX(z, wires=1)
        return qp.expval(qp.Z(0) @ qp.Z(1))

Executions of this circuit will differ from the noise-free value:

>>> circuit(0.9, 0.4, 0.5, 0.6)
np.float64(0.5440530007721438)
>>> print(qp.draw(circuit)(0.9, 0.4, 0.5, 0.6))
0: ──RX(0.90)──PhaseDamping(0.40)──ThermalRelaxationError(0.45,2.00,0.20,0.60)─╭●──RY(0.50) ···
1: ──RY(0.40)──────────────────────────────────────────────────────────────────╰X──RX(0.60) ···
<BLANKLINE>
0: ··· ──PhaseFlip(0.20)──────────────────────────────────────────────────────────────────┤ ╭<Z@Z>
1: ··· ──PhaseDamping(0.40)──ThermalRelaxationError(0.30,2.00,0.20,0.60)──PhaseFlip(0.20)─┤ ╰<Z@Z>

.. details::
    :title: Tranform Levels
    :href: add-noise-levels

    When transforming an already constructed ``QNode``, the ``add_noise`` transform will be
    added at the end of the "user" transforms by default, i.e., after all the transforms
    that have been manually applied to the QNode up to that point.

    .. code-block:: python

        dev = qp.device("default.mixed", wires=3)

        @qp.metric_tensor
        @qp.transforms.undo_swaps
        @qp.transforms.merge_rotations
        @qp.transforms.cancel_inverses
        @qp.qnode(dev)
        def circuit(w, x, y, z):
            qp.RX(w, wires=0)
            qp.RY(x, wires=1)
            qp.CNOT(wires=[0, 1])
            qp.RY(y, wires=0)
            qp.RX(z, wires=1)
            return qp.expval(qp.Z(0) @ qp.Z(1))

        noisy_circuit = qp.noise.add_noise(circuit, noise_model)

    >>> from pennylane.workflow import get_compile_pipeline
    >>> print(get_compile_pipeline(circuit, level="device")(1,2,3,4))
     CompilePipeline(
      [1] cancel_inverses(),
      [2] merge_rotations(),
      [3] undo_swaps(),
      [4] _expand_metric_tensor(device_wires=Wires([0, 1, 2])),
      [5] metric_tensor(device_wires=Wires([0, 1, 2])),
      [6] defer_measurements(allow_postselect=False),
      [7] decompose(target_gates=..., stopping_condition=<function stopping_condition at 0x...>, name=default.mixed),
      [8] no_sampling(name=backprop + default.mixed),
      [9] validate_device_wires(Wires([0, 1, 2]), name=default.mixed),
      [10] validate_measurements(analytic_measurements=..., sample_measurements=..., name=default.mixed),
      [11] validate_observables(stopping_condition=..., name=default.mixed)
    )

    >>> print(get_compile_pipeline(noisy_circuit, level="device")(1,2,3,4))
    CompilePipeline(
      [1] cancel_inverses(),
      [2] merge_rotations(),
      [3] undo_swaps(),
      [4] _expand_metric_tensor(device_wires=Wires([0, 1, 2])),
      [5] metric_tensor(device_wires=Wires([0, 1, 2])),
      [6] add_noise(...),
      [7] defer_measurements(allow_postselect=False),
      [8] decompose(target_gates=..., stopping_condition=<function stopping_condition at 0x...>, name=default.mixed),
      [9] no_sampling(name=backprop + default.mixed),
      [10] validate_device_wires(Wires([0, 1, 2]), name=default.mixed),
      [11] validate_measurements(analytic_measurements=..., sample_measurements=..., name=default.mixed),
      [12] validate_observables(stopping_condition=..., name=default.mixed)
    )

    However, one can request to insert the ``add_noise`` transform at any specific point in the compile pipeline. By specifying the ``level`` keyword argument while
    transforming a ``QNode``, this transform can be added at a designated level within the compile pipeline, as determined using the
    :func:`get_compile_pipeline<pennylane.workflow.get_compile_pipeline>`. For example, specifying ``None`` will add it at the end, ensuring that the tape is expanded to have no ``Adjoint`` and ``Templates``:

    >>> print(qp.noise.add_noise(circuit, noise_model, level="device").compile_pipeline)
    CompilePipeline(
      [1] cancel_inverses(),
      [2] merge_rotations(),
      [3] undo_swaps(),
      [4] _expand_metric_tensor(device_wires=Wires([0, 1, 2])),
      [5] metric_tensor(device_wires=Wires([0, 1, 2])),
      [6] defer_measurements(allow_postselect=False),
      [7] decompose(target_gates=..., stopping_condition=<function stopping_condition at 0x...>, name=default.mixed),
      [8] no_sampling(name=backprop + default.mixed),
      [9] validate_device_wires(Wires([0, 1, 2]), name=default.mixed),
      [10] validate_measurements(analytic_measurements=..., sample_measurements=..., name=default.mixed),
      [11] validate_observables(stopping_condition=..., name=default.mixed),
      [12] add_noise(..., level=device)
    )

    Other acceptable values for ``level`` are ``"top"``, ``"user"``, ``"device"``, and ``"gradient"``. Among these, `"top"` will allow addition
    to an empty compile pipeline, `"user"` will allow addition at the end of user-specified transforms, `"device"` will allow addition at the
    end of device-specific transforms, and `"gradient"` will allow addition at the end of transforms that expand trainable operations. For example:

    >>> print(qp.noise.add_noise(circuit, noise_model, level="top").compile_pipeline)
    CompilePipeline(
      [1] add_noise(..., level=top)
    )

    >>> print(qp.noise.add_noise(circuit, noise_model, level="user").compile_pipeline)
     CompilePipeline(
      [1] cancel_inverses(),
      [2] merge_rotations(),
      [3] undo_swaps(),
      [4] _expand_metric_tensor(device_wires=Wires([0, 1, 2])),
      [5] metric_tensor(device_wires=Wires([0, 1, 2])),
      [6] add_noise(..., level=user)
    )

    >>> print(qp.noise.add_noise(circuit, noise_model, level="device").compile_pipeline)
    CompilePipeline(
      [1] cancel_inverses(),
      [2] merge_rotations(),
      [3] undo_swaps(),
      [4] _expand_metric_tensor(device_wires=Wires([0, 1, 2])),
      [5] metric_tensor(device_wires=Wires([0, 1, 2])),
      [6] defer_measurements(allow_postselect=False),
      [7] decompose(target_gates=..., stopping_condition=<function stopping_condition at 0x...>, name=default.mixed),
      [8] no_sampling(name=backprop + default.mixed),
      [9] validate_device_wires(Wires([0, 1, 2]), name=default.mixed),
      [10] validate_measurements(analytic_measurements=..., sample_measurements=..., name=default.mixed),
      [11] validate_observables(stopping_condition=..., name=default.mixed),
      [12] add_noise(..., level=device)
    )

    Finally, more precise control over the insertion of the transform can be achieved by specifying an integer or slice for indexing when extracting the compile pipeline. For example, one can do:

    >>> print(qp.noise.add_noise(circuit, noise_model, level=2).compile_pipeline)
    CompilePipeline(
      [1] cancel_inverses(),
      [2] merge_rotations(),
      [3] add_noise(..., level=2)
    )

    >>> print(qp.noise.add_noise(circuit, noise_model, level=slice(1,3)).compile_pipeline)
    CompilePipeline(
      [1] merge_rotations(),
      [2] undo_swaps(),
      [3] add_noise(..., level=slice(1, 3, None))
    )

## `custom_qnode_wrapper`

```python
def custom_qnode_wrapper(self, qnode, targs, tkwargs)
```

QNode execution wrapper for supporting ``add_noise`` with levels
