---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/controlled_sequence.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/controlled_sequence.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/controlled_sequence.py`

Contains the ControlledSequence template.

## `ControlledSequence`

```python
class ControlledSequence(SymbolicOp, Operation)
```

Creates a sequence of controlled gates raised to decreasing powers of 2. Can be used as
a sub-block in building a `quantum phase estimation <https://en.wikipedia.org/wiki/Quantum_phase_estimation_algorithm>`__
circuit.

Given an :class:`~.Operator` and a list of control wires, this template creates a sequence of
controlled gates, one for each control wire, with the base :class:`~.Operator` raised to
decreasing powers of 2:

.. figure:: ../../_static/templates/subroutines/big_ctrl.png
    :align: center
    :width: 40%
    :target: javascript:void(0);

Args:
    base (Operator): the phase estimation unitary, specified as an :class:`~.Operator`
    control (Union[Wires, Sequence[int], or int]): the wires to be used for control

Raises:
    ValueError: if the wires in ``control`` and wires on the ``base`` operator share a common
        element

.. seealso:: :class:`~.QuantumPhaseEstimation`

**Example**

.. code-block:: python

    dev = qp.device("default.qubit", wires = 4)

    @qp.qnode(dev)
    def circuit():

        for i in range(3):
            qp.Hadamard(wires = i)

        qp.ControlledSequence(qp.RX(0.25, wires = 3), control = [0, 1, 2])

        qp.adjoint(qp.QFT)(wires = range(3))

        return qp.probs(wires = range(3))

>>> print(circuit()) # doctest: +SKIP
[0.9206 0.0264 0.0073 0.0042 0.0036 0.0042 0.0073 0.0264]

### `control`

```python
def control(self)
```

The control wires for the sequence

### `control_wires`

```python
def control_wires(self)
```

The control wires for the sequence

### `compute_decomposition`

```python
def compute_decomposition(*_, base=None, control_wires=None, lazy=False, **__)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.CtrlSequence.decomposition`.

Args:
    base (Operator): the operator that acts as the base for the sequence
    control_wires (Any or Iterable[Any]): the control wires for the sequence

Returns:
    list[.Operator]: decomposition of the operator

**Example**

.. code-block:: python

    dev = qp.device("default.qubit")
    op = qp.ControlledSequence(qp.RX(0.25, wires = 3), control = [0, 1, 2])

    @qp.qnode(dev)
    def circuit():
        op.decomposition()
        return qp.state()

>>> print(qp.draw(circuit, wire_order=[0,1,2,3])())
0: ─╭●────────────────────────────┤  State
1: ─│─────────╭●──────────────────┤  State
2: ─│─────────│─────────╭●────────┤  State
3: ─╰RX(1.00)─╰RX(0.50)─╰RX(0.25)─┤  State

To display the operators as powers of the base operator without further simplification,
the `compute_decomposition` method can be used with `lazy=True`.

.. code-block:: python

    dev = qp.device("default.qubit")
    op = qp.ControlledSequence(qp.RX(0.25, wires = 3), control = [0, 1, 2])

    @qp.qnode(dev)
    def circuit():
        op.compute_decomposition(base=op.base, control_wires=op.control, lazy=True)
        return qp.state()

>>> print(qp.draw(circuit, wire_order=[0,1,2,3])())
0: ─╭(RX(0.25))⁴───────────────────────────┤  State
1: ─│────────────╭(RX(0.25))²──────────────┤  State
2: ─│────────────│────────────╭(RX(0.25))¹─┤  State
3: ─╰(RX(0.25))⁴─╰(RX(0.25))²─╰(RX(0.25))¹─┤  State
