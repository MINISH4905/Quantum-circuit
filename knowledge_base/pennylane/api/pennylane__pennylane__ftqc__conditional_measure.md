---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ftqc/conditional_measure.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ftqc/conditional_measure.py
license: Apache-2.0
---

## Module `pennylane/ftqc/conditional_measure.py`

Contains the condition transform.

## `cond_measure`

```python
def cond_measure(condition: MeasurementValue | bool, true_fn: Callable, false_fn: Callable)
```

Perform a mid-circuit measurement where the basis of the measurement is conditional on the
supplied expression. This conditional expression may involve the results of other mid-circuit
qubit measurements.

Args:
    condition (Union[.MeasurementValue, bool]): a conditional expression that may involve a mid-circuit
       measurement value (see :func:`.pennylane.measure`).
    true_fn (callable): The quantum function or PennyLane operation to
        apply if ``condition`` is ``True``. The callable must create a single mid-circuit measurement.
    false_fn (callable): The quantum function or PennyLane operation to
        apply if ``condition`` is ``False``. The callable must create a single mid-circuit measurement.

.. note::
    The mid-circuit measurements applied on the two branches must both be applied to the same
    wire, and they must have the same settings for `reset` and `postselection`. The two
    branches can differ only in regard to the measurement basis of the applied measurement.

Returns:
    function: A new function that applies the conditional measurements. The returned
    function takes the same input arguments as ``true_fn`` and ``false_fn``.

**Example**

.. code-block:: python

    from pennylane.ftqc import cond_measure, diagonalize_mcms, measure_x, measure_y
    from functools import partial

    dev = qp.device("default.qubit", wires=3)

    @diagonalize_mcms
    @qp.set_shots(shots=1_000)
    @qp.qnode(dev, mcm_method="one-shot")
    def qnode(x, y):
        qp.RY(x, 0)
        qp.Hadamard(1)

        m0 = qp.measure(0)
        m2 = cond_measure(m0, measure_x, measure_y)(1)

        qp.Hadamard(2)
        qp.cond(m2 == 0, qp.RY)(y, wires=2)
        return qp.expval(qp.X(2))


>>> print(qnode(np.pi/3, np.pi/2)) # doctest: +SKIP
0.3914

.. note::

    If the first argument of ``cond_measure`` is a measurement value (e.g., ``m_0``
    in ``qp.cond(m_0, measure_x, measure_y)``), then ``m_0 == 1`` is considered
    internally.

.. warning::

    Expressions with boolean logic flow using operators like ``and``,
    ``or`` and ``not`` are not supported as the ``condition`` argument.

    While such statements may not result in errors, they may result in
    incorrect behaviour.
