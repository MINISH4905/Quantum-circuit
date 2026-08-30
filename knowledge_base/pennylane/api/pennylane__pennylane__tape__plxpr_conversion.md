---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/tape/plxpr_conversion.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/tape/plxpr_conversion.py
license: Apache-2.0
---

## Module `pennylane/tape/plxpr_conversion.py`

Defines a function for converting plxpr to a tape.

## `CollectOpsandMeas`

```python
class CollectOpsandMeas(FlattenedInterpreter)
```

Collect the dropped operations and measurements in a plxpr. Used by ``convert_to_tape``.

.. code-block:: python

    @qp.for_loop(3)
    def loop(i):
        qp.X(i)

    def f(x):
        loop()
        qp.adjoint(qp.S)(0)
        m0 = qp.measure(0)
        qp.RX(2*x, 0)
        return qp.probs(wires=0), qp.expval(qp.Z(1))

>>> from pennylane.tape.plxpr_conversion import CollectOpsandMeas
>>> from jax import make_jaxpr
>>> qp.capture.enable()
>>> plxpr = make_jaxpr(f)(0.5)
>>> collector = CollectOpsandMeas()
>>> collector.eval(plxpr.jaxpr, plxpr.consts, 1.2)
[probs(wires=[0]), expval(Z(1))]
>>> collector.state
{'ops': [X(0), X(1), X(2), Adjoint(S(0)), MidMeasure(wires=[0], postselect=None, reset=False), RX(Array(2.4, dtype=float..., weak_type=True), wires=[0])], 'measurements': [probs(wires=[0]), expval(Z(1))], 'dynamic_wire_map': {}}

After execution, the collected operations and measurements are available in the ``state``
property.

Note that if the same instance is used again, the new operations will be appended to the
same state.

>>> collector = CollectOpsandMeas()
>>> collector(qp.T)(0)
>>> collector.state['ops']
[T(0)]
>>> collector(qp.S)(0)
>>> collector.state['ops']
[T(0), S(0)]

## `plxpr_to_tape`

```python
def plxpr_to_tape(plxpr: 'jax.extend.core.Jaxpr', consts, *args, shots=None) -> QuantumScript
```

Convert a plxpr into a tape.

Args:
    plxpr (jax.extend.core.Jaxpr): a pennylane variant jaxpr
    consts (list): the consts for the jaxpr
    *args : the arguments to execute the plxpr with

Keyword Args:
    shots (None, int, Sequence[int], Shots): the shots for the tape.

Returns:
    QuantumScript: a single quantum script containing the quantum operations and measurements

.. code-block:: python

    @qp.for_loop(3)
    def loop(i):
        qp.X(i)

    def f(x):
        loop()
        qp.adjoint(qp.S)(0)
        m0 = qp.measure(0)
        qp.RX(2*x, 0)
        return qp.probs(wires=0), qp.expval(qp.Z(1))

    qp.capture.enable()

    plxpr = jax.make_jaxpr(f)(0.5)
    tape = qp.tape.plxpr_to_tape(plxpr.jaxpr, plxpr.consts, 1.2)
    print(qp.drawer.tape_text(tape, decimals=2))

.. code-block::

    0: ──X──S†──┤↗├──RX(2.40)─┤  Probs
    1: ──X────────────────────┤  <Z>
    2: ──X────────────────────┤
