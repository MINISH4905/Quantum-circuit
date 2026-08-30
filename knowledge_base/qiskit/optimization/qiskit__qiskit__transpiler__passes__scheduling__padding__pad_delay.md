---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/scheduling/padding/pad_delay.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/scheduling/padding/pad_delay.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/scheduling/padding/pad_delay.py`

Padding pass to insert Delay to the empty slots.

## `PadDelay`

```python
class PadDelay(BasePadding)
```

Padding idle time with Delay instructions.

Consecutive delays will be merged in the output of this pass.

.. plot::
   :include-source:
   :nofigs:

    from qiskit import QuantumCircuit
    from qiskit.transpiler import InstructionDurations

    durations = InstructionDurations([("x", None, 160), ("cx", None, 800)])

    qc = QuantumCircuit(2)
    qc.delay(100, 0)
    qc.x(1)
    qc.cx(0, 1)

The ASAP-scheduled circuit output may become

.. code-block:: text

         ┌────────────────┐
    q_0: ┤ Delay(160[dt]) ├──■──
         └─────┬───┬──────┘┌─┴─┐
    q_1: ──────┤ X ├───────┤ X ├
               └───┘       └───┘

Note that the additional idle time of 60dt on the ``q_0`` wire coming from the duration difference
between ``Delay`` of 100dt (``q_0``) and ``XGate`` of 160 dt (``q_1``) is absorbed in
the delay instruction on the ``q_0`` wire, i.e. in total 160 dt.

See :class:`BasePadding` pass for details.

### `__init__`

```python
def __init__(self, fill_very_end: bool=True, target: Target=None, durations: InstructionDurations=None)
```

Create new padding delay pass.

Args:
    fill_very_end: Set ``True`` to fill the end of circuit with delay.
    target: The :class:`~.Target` representing the target backend.
        If it is supplied and does not support delay instruction on a qubit,
        padding passes do not pad any idle time of the qubit.
    durations: The instruction durations. This is mostly for legacy applications without
        a :class:`.Target`. The ``target`` argument should typically be used instead of
        this and if both are specified ``target`` will supersede this argument.
