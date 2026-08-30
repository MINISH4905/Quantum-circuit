---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/ecr.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/ecr.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/ecr.py`

Two-qubit ZX-rotation gate.

## `ECRGate`

```python
class ECRGate(SingletonGate)
```

An echoed cross-resonance gate.

This gate is maximally entangling and is equivalent to a CNOT up to
single-qubit pre-rotations. The echoing procedure mitigates some
unwanted terms (terms other than ZX) to cancel in an experiment.
More specifically, this gate implements :math:`\frac{1}{\sqrt{2}}(IX-XY)`.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.ecr` method.

Circuit symbol:

.. code-block:: text

                           global phase: 7π/4
         ┌─────────┐            ┌───┐      ┌───┐
    q_0: ┤0        ├       q_0: ┤ S ├───■──┤ X ├
         │   ECR   │   =        ├───┴┐┌─┴─┐└───┘
    q_1: ┤1        ├       q_1: ┤ √X ├┤ X ├─────
         └─────────┘            └────┘└───┘


Matrix representation:

.. math::

    ECR\ q_0, q_1 = \frac{1}{\sqrt{2}}
        \begin{pmatrix}
            0   & 1   &  0  & i \\
            1   & 0   &  -i & 0 \\
            0   & i   &  0  & 1 \\
            -i  & 0   &  1  & 0
        \end{pmatrix}

.. note::

    In Qiskit's convention, higher qubit indices are more significant
    (little endian convention). In the above example we apply the gate
    on (q_0, q_1) which results in the :math:`X \otimes Z` tensor order.
    Instead, if we apply it on (q_1, q_0), the matrix will
    be :math:`Z \otimes X`:

    .. code-block:: text

             ┌─────────┐
        q_0: ┤1        ├
             │   ECR   │
        q_1: ┤0        ├
             └─────────┘

    .. math::

        ECR\ q_0, q_1 = \frac{1}{\sqrt{2}}
            \begin{pmatrix}
                0   & 0   &  1  & i \\
                0   & 0   &  i  & 1 \\
                1   & -i  &  0  & 0 \\
                -i  & 1   &  0  & 0
            \end{pmatrix}

### `__init__`

```python
def __init__(self, label: str | None=None) -> None
```

Args:
    label: An optional label for the gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Return inverse ECR gate (itself).

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as this gate
        is self-inverse.

Returns:
    ECRGate: inverse gate (self-inverse).
