---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/noise/insert_ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/noise/insert_ops.py
license: Apache-2.0
---

## Module `pennylane/noise/insert_ops.py`

Provides transforms for inserting operations into quantum circuits.

## `insert`

```python
def insert(tape: QuantumScript, op: Callable | type[Operation], op_args: tuple | float, position: str | list | type[Operation]='all', before: bool=False) -> tuple[QuantumScriptBatch, PostprocessingFn]
```

Insert an operation into specified points in an input circuit.

Circuits passed through this transform will be updated to have the operation, specified by the
``op`` argument, added according to the positioning specified in the ``position`` argument. Only
single qubit operations are permitted to be inserted.

The type of ``op`` can be either a single operation or a quantum
function acting on a single wire. A quantum function can be used
to specify a sequence of operations acting on a single qubit (see the usage details
for more information).

Args:
    tape (QNode or QuantumTape or Callable or pennylane.devices.Device): the input circuit to be transformed.
    op (callable or Type[Operation]): the single-qubit operation, or sequence of operations
        acting on a single qubit, to be inserted into the circuit
    op_args (tuple or float): the arguments fed to the operation, either as a tuple or a single
        float
    position (str or PennyLane operation or list of operations): Specification of where to add the operation.
        Should be one of: ``"all"`` to add the operation after all gates (except state preparations);
        ``"start"`` to add the operation to all wires at the start of the circuit (but after state preparations);
        ``"end"`` to add the operation to all wires at the end of the circuit;
        list of operations to add the operation before or after depending on ``before``.
    before (bool): Whether to add the operation before the given operation(s) in ``position``.
        Default is ``False`` and the operation is inserted after.

Returns:
    qnode (QNode) or quantum function (Callable) or tuple[List[.QuantumTape], function] or device (pennylane.devices.Device):

    The transformed circuit as described in :func:`qp.transform <pennylane.transform>`.


Raises:
    ValueError: if a single operation acting on multiple wires is passed to ``op``
    ValueError: if the requested ``position`` argument is not ``'start'``, ``'end'`` or
        ``'all'`` OR PennyLane Operation

**Example:**

The following QNode can be transformed to add noise to the circuit:

.. code-block:: python

    dev = qp.device("default.mixed", wires=2)

    @qp.noise.insert(op=qp.AmplitudeDamping, op_args=0.2, position="end")
    @qp.qnode(dev)
    def f(w, x, y, z):
        qp.RX(w, wires=0)
        qp.RY(x, wires=1)
        qp.CNOT(wires=[0, 1])
        qp.RY(y, wires=0)
        qp.RX(z, wires=1)
        return qp.expval(qp.Z(0) @ qp.Z(1))

Executions of this circuit will differ from the noise-free value:

>>> f(0.9, 0.4, 0.5, 0.6)
np.float64(0.7548469968854761)
>>> print(qp.draw(f)(0.9, 0.4, 0.5, 0.6))
0: ──RX(0.90)─╭●──RY(0.50)──AmplitudeDamping(0.20)─┤ ╭<Z@Z>
1: ──RY(0.40)─╰X──RX(0.60)──AmplitudeDamping(0.20)─┤ ╰<Z@Z>

.. details::
    :title: Usage Details

    **Specifying the operation as a quantum function:**

    Instead of specifying ``op`` as a single :class:`~.Operation`, we can instead define a
    quantum function. For example:

    .. code-block:: python

        def op(x, y, wires):
            qp.RX(x, wires=wires)
            qp.PhaseShift(y, wires=wires)

    This operation can be inserted into the following circuit:

    .. code-block:: python

        dev = qp.device("default.qubit", wires=2)

        @qp.qnode(dev)
        @qp.noise.insert(op=op, op_args=[0.2, 0.3], position="end")
        def f(w, x, y, z):
            qp.RX(w, wires=0)
            qp.RY(x, wires=1)
            qp.CNOT(wires=[0, 1])
            qp.RY(y, wires=0)
            qp.RX(z, wires=1)
            return qp.expval(qp.Z(0) @ qp.Z(1))

    To check this, let's print out the circuit:

    >>> print(qp.draw(f)(0.9, 0.4, 0.5, 0.6))
    0: ──RX(0.90)─╭●──RY(0.50)──RX(0.20)──Rϕ(0.30)─┤ ╭<Z@Z>
    1: ──RY(0.40)─╰X──RX(0.60)──RX(0.20)──Rϕ(0.30)─┤ ╰<Z@Z>

    **Transforming tapes:**

    Consider the following tape:

    .. code-block:: python

        ops = [
            qp.RX(0.9, wires=0),
            qp.RY(0.4, wires=1),
            qp.CNOT((0,1)),
            qp.RY(0.5, wires=0),
            qp.RX(0.6, wires=1)
        ]
        measurements = [qp.expval(qp.Z(0) @ qp.Z(1))]
        tape = qp.tape.QuantumTape(ops, measurements)

    We can add the :class:`~.AmplitudeDamping` channel to the end of the circuit using:

    >>> from pennylane.noise import insert
    >>> [noisy_tape], _ = insert(tape, qp.AmplitudeDamping, 0.05, position="end")
    >>> print(qp.drawer.tape_text(noisy_tape, decimals=2))
    0: ──RX(0.90)─╭●──RY(0.50)──AmplitudeDamping(0.05)─┤ ╭<Z@Z>
    1: ──RY(0.40)─╰X──RX(0.60)──AmplitudeDamping(0.05)─┤ ╰<Z@Z>

    **Transforming devices:**

    Consider the following QNode:

    .. code-block:: python

        dev = qp.device("default.mixed", wires=2)

        def f(w, x, y, z):
            qp.RX(w, wires=0)
            qp.RY(x, wires=1)
            qp.CNOT(wires=[0, 1])
            qp.RY(y, wires=0)
            qp.RX(z, wires=1)
            return qp.expval(qp.Z(0) @ qp.Z(1))

        qnode = qp.QNode(f, dev)

    Execution of the circuit on ``dev`` will be noise-free:

    >>> qnode(0.9, 0.4, 0.5, 0.6)
    np.float64(0.8624353588253786)

    However, noise can be easily added to the device:

    >>> dev_noisy = qp.noise.insert(dev, qp.AmplitudeDamping, 0.2)
    >>> qnode_noisy = qp.QNode(f, dev_noisy)
    >>> qnode_noisy(0.9, 0.4, 0.5, 0.6)
    np.float64(0.7294543367428854)
