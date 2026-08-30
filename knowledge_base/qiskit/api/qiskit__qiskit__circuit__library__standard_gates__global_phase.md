---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/global_phase.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/global_phase.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/global_phase.py`

Global Phase Gate

## `GlobalPhaseGate`

```python
class GlobalPhaseGate(Gate)
```

The global phase gate (:math:`e^{i\theta}`).

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`

Mathematical representation:

.. math::
    \text{GlobalPhaseGate}\ =
        \begin{pmatrix}
            e^{i\theta}
        \end{pmatrix}

### `__init__`

```python
def __init__(self, phase: ParameterValueType, label: str | None=None)
```

Args:
    phase: The value of phase it takes.
    label: An optional label for the gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverse GlobalPhaseGate gate.

:math:`\text{GlobalPhaseGate}(\lambda)^{\dagger} = \text{GlobalPhaseGate}(-\lambda)`

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        is always another :class:`.GlobalPhaseGate` with an inverted
        parameter value.

Returns:
    GlobalPhaseGate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the global_phase gate.
