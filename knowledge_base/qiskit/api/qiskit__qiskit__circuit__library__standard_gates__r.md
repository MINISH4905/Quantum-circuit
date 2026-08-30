---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/r.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/r.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/r.py`

Rotation around an axis in x-y plane.

## `RGate`

```python
class RGate(Gate)
```

Rotation :math:`\theta` around the :math:`\cos(\phi)x + \sin(\phi)y` axis.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.r` method.

Circuit symbol:

.. code-block:: text

           ┌────────┐
    q_0:   ┤ R(θ,ϕ) ├ 
           └────────┘


Matrix representation:

.. math::

    \newcommand{\rotationangle}{\frac{\theta}{2}}

    R(\theta, \phi) = e^{-i \rotationangle \left(\cos{\phi} x + \sin{\phi} y\right)} =
        \begin{pmatrix}
            \cos\left(\rotationangle\right) & -i e^{-i \phi} \sin\left(\rotationangle\right) \\
            -i e^{i \phi} \sin\left(\rotationangle\right) & \cos\left(\rotationangle\right)
        \end{pmatrix}

### `__init__`

```python
def __init__(self, theta: ParameterValueType, phi: ParameterValueType, label: str | None=None)
```

Args:
    theta: The rotation angle :math:`\theta`.
    phi: The angle specifying the rotation axis, given by :math:`\cos(\phi) x + \sin(\phi)y`.
    label: An optional label for the gate.

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Invert this gate as: :math:`R(θ, φ)^{\dagger} = R(-θ, φ)`

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.RGate` with an inverted parameter value.

Returns:
    RGate: inverse gate.

### `__array__`

```python
def __array__(self, dtype=None, copy=None)
```

Return a numpy.array for the R gate.
