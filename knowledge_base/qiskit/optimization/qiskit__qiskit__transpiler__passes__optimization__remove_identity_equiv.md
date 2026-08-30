---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/remove_identity_equiv.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/remove_identity_equiv.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/remove_identity_equiv.py`

Transpiler pass to drop gates with negligible effects.

## `RemoveIdentityEquivalent`

```python
class RemoveIdentityEquivalent(TransformationPass)
```

Remove gates with negligible effects.

Removes gates whose effect is close to an identity operation up to a global phase
and up to the specified tolerance. Parameterized gates are not considered by this pass.

For a cutoff fidelity :math:`f`, this pass removes gates whose average
gate fidelity with respect to the identity is below :math:`f`. Concretely,
a gate :math:`G` is removed if :math:`\bar F < f` where

.. math::

    \bar{F} = \frac{1 + d F_{\text{process}}}{1 + d},\

    F_{\text{process}} = \frac{|\mathrm{Tr}(G)|^2}{d^2}

where :math:`d = 2^n` is the dimension of the gate for :math:`n` qubits.

This function is multithreaded and will potentially launch a thread pool with threads
equal to the number of CPUs by default. You can tune the number of threads with the
``RAYON_NUM_THREADS`` environment variable. For example, setting ``RAYON_NUM_THREADS=4``
would limit the thread pool to 4 threads.

### `__init__`

```python
def __init__(self, *, approximation_degree: float | None=1.0, target: None | Target=None) -> None
```

Initialize the transpiler pass.

Args:
    approximation_degree: The degree to approximate for the equivalence check. This can be a
        floating point value between 0 and 1, or ``None``. If the value is 1 this does not
        approximate above the floating point precision. For a value < 1 this is used as a
        scaling factor for the cutoff fidelity. If the value is ``None`` this approximates up
        to the fidelity for the gate specified in ``target``. In case no ``target`` is set
        we approximate up to ``16 * machine_eps`` as default to account for accumulations
        on few-qubit systems.

    target: If ``approximation_degree`` is set to ``None`` and a :class:`.Target` is provided
        for this field the tolerance for determining whether an operation is equivalent to
        identity will be set to the reported error rate in the target. If
        ``approximation_degree`` (the default) this has no effect, if
        ``approximation_degree=None`` it uses the error rate specified in the ``Target`` for
        the gate being evaluated, and a numeric value other than 1 with ``target`` set is
        used as a scaling factor of the target's error rate.
