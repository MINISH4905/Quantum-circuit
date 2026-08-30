---
framework: pennylane
api_version: v0.45.1
doc_type: optimization
source_path: pennylane/transforms/defer_measurements.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/transforms/defer_measurements.py
license: Apache-2.0
---

## Module `pennylane/transforms/defer_measurements.py`

Code for the tape transform implementing the deferred measurement principle.

## `null_postprocessing`

```python
def null_postprocessing(results)
```

A postprocessing function returned by a transform that only converts the batch of results
into a result for a single ``QuantumTape``.

## `defer_measurements`

```python
def defer_measurements(tape: QuantumScript, reduce_postselected: bool=True, allow_postselect: bool=True, num_wires: int | None=None) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Quantum function transform that substitutes operations conditioned on
measurement outcomes to controlled operations.

This transform uses the `deferred measurement principle
<https://en.wikipedia.org/wiki/Deferred_Measurement_Principle>`_ and
applies to qubit-based quantum functions.

Support for mid-circuit measurements is device-dependent. If a device
doesn't support mid-circuit measurements natively, then the QNode will
apply this transform.

.. note::

    The transform uses the :func:`~.ctrl` transform to implement operations
    controlled on mid-circuit measurement outcomes. The set of operations
    that can be controlled as such depends on the set of operations
    supported by the chosen device.

.. note::

    Devices that inherit from :class:`~pennylane.devices.QubitDevice` **must** be initialized
    with an additional wire for each mid-circuit measurement after which the measured
    wire is reused or reset for ``defer_measurements`` to transform the quantum tape
    correctly.

.. note::

    This transform does not change the list of terminal measurements returned by
    the quantum function.

.. note::

    When applying the transform on a quantum function that contains the
    :class:`~.Snapshot` instruction, state information corresponding to
    simulating the transformed circuit will be obtained. No
    post-measurement states are considered.

.. warning::

    :func:`~.pennylane.state` is not supported with the ``defer_measurements`` transform.
    Additionally, :func:`~.pennylane.probs`, :func:`~.pennylane.sample` and
    :func:`~.pennylane.counts` can only be used with ``defer_measurements`` if wires
    or an observable are explicitly specified.

Args:
    tape (QNode or QuantumTape or Callable): a quantum circuit.
    reduce_postselected (bool): Whether to use postselection information to reduce the number
        of operations and control wires in the output tape. Active by default. This is currently
        ignored if program capture is enabled.
    allow_postselect (bool): Whether postselection is allowed. In order to perform postselection
        with ``defer_measurements``, the device must support the :class:`~.Projector` operation.
        Defaults to ``True``. This is currently ignored if program capture is enabled.
    num_wires (int): Optional argument to specify the total number of circuit wires. This is
        only used if program capture is enabled.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[QuantumTape], function]: The
        transformed circuit as described in :func:`qp.transform <pennylane.transform>`.

Raises:
    ValueError: If any measurements with no wires or observable are present
    ValueError: If continuous variable operations or measurements are present
    ValueError: If using the transform with any device other than
        :class:`default.qubit <~pennylane.devices.DefaultQubit>` and postselection is used

**Example**

Suppose we have a quantum function with mid-circuit measurements and
conditional operations:

.. code-block:: python

    def qfunc(par):
        qp.RY(0.123, wires=0)
        qp.Hadamard(wires=1)
        m_0 = qp.measure(1)
        qp.cond(m_0, qp.RY)(par, wires=0)
        return qp.expval(qp.Z(0))

The ``defer_measurements`` transform allows executing such quantum
functions without having to perform mid-circuit measurements:

>>> dev = qp.device('default.qubit', wires=2)
>>> transformed_qfunc = qp.defer_measurements(qfunc)
>>> qnode = qp.QNode(transformed_qfunc, dev)
>>> par = pnp.array(np.pi/2, requires_grad=True)
>>> qnode(par)
tensor(0.434..., requires_grad=True)

We can also differentiate parameters passed to conditional operations:

>>> qp.grad(qnode)(par)
tensor(-0.496... requires_grad=True)

Reusing and resetting measured wires will work as expected with the
``defer_measurements`` transform:

.. code-block:: python

    dev = qp.device("default.qubit", wires=3)

    @qp.qnode(dev)
    def func(x, y):
        qp.RY(x, wires=0)
        qp.CNOT(wires=[0, 1])
        m_0 = qp.measure(1, reset=True)

        qp.cond(m_0, qp.RY)(y, wires=0)
        qp.RX(np.pi/4, wires=1)
        return qp.probs(wires=[0, 1])

Executing this QNode:

>>> pars = pnp.array([0.643, 0.246], requires_grad=True)
>>> func(*pars)
tensor([0.769..., 0.132..., 0.0839..., 0.014...], requires_grad=True)

.. details::
    :title: Usage Details

    By default, ``defer_measurements`` makes use of postselection information of
    mid-circuit measurements in the circuit in order to reduce the number of controlled
    operations and control wires. We can explicitly switch this feature off and compare
    the created circuits with and without this optimization. Consider the following circuit:

    .. code-block:: python

        @qp.qnode(qp.device("default.qubit"))
        def node(x):
            qp.RX(x, 0)
            qp.RX(x, 1)
            qp.RX(x, 2)

            mcm0 = qp.measure(0, postselect=0, reset=False)
            mcm1 = qp.measure(1, postselect=None, reset=True)
            mcm2 = qp.measure(2, postselect=1, reset=False)
            qp.cond(mcm0+mcm1+mcm2==1, qp.RX)(0.5, 3)
            return qp.expval(qp.Z(0) @ qp.Z(3))

    Without the optimization, we find three gates controlled on the three measured
    qubits. They correspond to the combinations of controls that satisfy the condition
    ``mcm0+mcm1+mcm2==1``.

    >>> print(qp.draw(qp.defer_measurements(node, reduce_postselected=False))(0.6)) # doctest: +SKIP
    0: ──RX(0.60)──|0⟩⟨0|─╭●─────────────────────────────────────────────┤ ╭<Z@Z>
    1: ──RX(0.60)─────────│──╭●─╭X───────────────────────────────────────┤ │
    2: ──RX(0.60)─────────│──│──│───|1⟩⟨1|─╭○────────╭●────────╭○────────┤ │
    3: ───────────────────│──│──│──────────├RX(0.50)─├RX(0.50)─├RX(0.50)─┤ ╰<Z@Z>
    4: ───────────────────╰X─│──│──────────├○────────├○────────├●────────┤
    5: ──────────────────────╰X─╰●─────────╰●────────╰○────────╰○────────┤

    If we do not explicitly deactivate the optimization, we obtain a much simpler circuit:

    >>> print(qp.draw(qp.defer_measurements(node))(0.6))
    0: ──RX(0.60)──|0⟩⟨0|─╭●─────────────────┤ ╭<Z@Z>
    1: ──RX(0.60)─────────│──╭●─╭X───────────┤ │
    2: ──RX(0.60)─────────│──│──│───|1⟩⟨1|───┤ │
    3: ───────────────────│──│──│──╭RX(0.50)─┤ ╰<Z@Z>
    4: ───────────────────╰X─│──│──│─────────┤
    5: ──────────────────────╰X─╰●─╰○────────┤

    There is only one controlled gate with only one control wire.

.. details::
    :title: Deferred measurements with program capture

    ``qp.defer_measurements`` can be applied to callables when program capture is enabled. To do so,
    the ``num_wires`` argument must be provided, which should be an integer corresponding to the total
    number of available wires. For ``m`` mid-circuit measurements, ``range(num_wires - m, num_wires)``
    will be the range of wires used to map mid-circuit measurements to ``CNOT`` gates.

    .. warning::

        While the transform includes validation to avoid overlap between wires of the original
        circuit and mid-circuit measurement target wires, if any wires of the original circuit
        are traced, i.e. dependent on dynamic arguments to the transformed workflow, the
        validation may not catch overlaps. Consider the following example:

        .. code-block:: python

            import jax

            qp.capture.enable()

            @qp.capture.expand_plxpr_transforms
            @qp.defer_measurements(num_wires=1)
            def f(n):
                qp.measure(n)

        >>> jax.make_jaxpr(f)(0)
        { lambda ; a:i...[]. let _:AbstractOperator() = CNOT[n_wires=2] a 0:i...[] in () }

        The circuit gets transformed without issue because the concrete value of the measured wire
        is unknown. However, execution with n = 0 would raise an error, as the CNOT wires would
        be (0, 0).

        Thus, users must be cautious when transforming a circuit. **For n total wires and
        c circuit wires, the number of mid-circuit measurements allowed is n - c.**

    Using ``defer_measurements`` with program capture enabled introduces new features and
    restrictions:

    **New features**

    * Arbitrary classical processing of mid-circuit measurement values is now possible. With
      program capture disabled, only limited classical processing, as detailed in the
      documentation for :func:`~pennylane.measure`. With program capture enabled, any unary
      or binary ``jax.numpy`` functions that can be applied to scalars can be used with mid-circuit
      measurements.

    * Using mid-circuit measurements as gate parameters is now possible. This feature currently
      has the following restrictions. First, mid-circuit measurement values cannot be used
      for multiple parameters of the same gate. Second, mid-circuit measurement values
      cannot be used as wires.

      .. code-block:: python

          import jax
          import jax.numpy as jnp

          qp.capture.enable()

          @qp.capture.expand_plxpr_transforms
          @qp.defer_measurements(num_wires=10)
          def f():
              m0 = qp.measure(0)

              phi = jnp.sin(jnp.pi * m0)
              qp.RX(phi, 0)
              return qp.expval(qp.PauliZ(0))

    >>> jax.make_jaxpr(f)() # doctest: +SKIP
    { lambda ; . let
        _:AbstractOperator() = CNOT[n_wires=2] 0:i32[] 9:i32[]
        a:f32[] = mul 0.0:f32[] 3.141592653589793:f32[]
        b:f32[] = sin a
        c:AbstractOperator() = RX[n_wires=1] b 0:i32[]
        _:AbstractOperator() = Controlled[
        control_values=(False,)
        work_wire_type=borrowed
        work_wires=Wires([])
        ] c 9:i32[]
        d:f32[] = mul 1.0:f32[] 3.141592653589793:f32[]
        e:f32[] = sin d
        f:AbstractOperator() = RX[n_wires=1] e 0:i32[]
        _:AbstractOperator() = Controlled[
        control_values=(True,)
        work_wire_type=borrowed
        work_wires=Wires([])
        ] f 9:i32[]
        g:AbstractOperator() = PauliZ[n_wires=1] 0:i32[]
        h:AbstractMeasurement(n_wires=None) = expval_obs g
    in (h,) }
    >>> qp.capture.disable()

    The above dummy example showcases how the transform is applied when the aforementioned
    features are used.

    **What doesn't work**

    * mid-circuit measurement values cannot be used in the condition for a
      :func:`~pennylane.while_loop`.
    * :func:`~pennylane.measure` cannot be used inside the body of loop primitives
      (:func:`~pennylane.while_loop`, :func:`~pennylane.for_loop`).
    * If a branch of :func:`~pennylane.cond` uses mid-circuit measurements as its
      predicate, then all other branches must also use mid-circuit measurement values
      as predicates.
    * For an ``n``-parameter gate, mid-circuit measurement values can only be used
      for 1 of the ``n`` parameters.
    * :func:`~pennylane.measure` can only be used in the bodies of branches of
      :func:`~pennylane.cond` if none of the branches use mid-circuit measurements
      as predicates
    * :func:`~pennylane.measure` cannot be used inside the body of functions
      being transformed with :func:`~pennylane.adjoint` or :func:`~pennylane.ctrl`.
