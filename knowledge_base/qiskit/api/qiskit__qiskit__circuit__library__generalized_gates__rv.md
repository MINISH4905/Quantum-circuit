---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/rv.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/rv.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/rv.py`

Rotation around an arbitrary axis on the Bloch sphere.

## `RVGate`

```python
class RVGate(Gate)
```

Rotation around arbitrary rotation axis :math:`\vec{v}` where :math:`\|\vec{v}\|_2` is
angle of rotation in radians.

Can be applied to a :class:`~qiskit.circuit.QuantumCircuit`
with the :meth:`~qiskit.circuit.QuantumCircuit.rv` method.

Circuit symbol:

.. code-block:: text

         ┌─────────────────┐
    q_0: ┤ RV(v_x,v_y,v_z) ├
         └─────────────────┘

Matrix representation:

.. math::

    \newcommand{\rotationangle}{\frac{\|\vec{v}\|_2}{2}}
        R(\vec{v}) = e^{-i \vec{v}\cdot\vec{\sigma} / 2} =
            \begin{pmatrix}
                \cos\left(\rotationangle\right)
                -i \frac{v_z}{\|\vec{v}\|_2} \sin\left(\rotationangle\right)
                & -(i \frac{v_x}{\|\vec{v}\|_2}
                + \frac{v_y}{\|\vec{v}\|_2}) \sin\left(\rotationangle\right) \\
                -(i \frac{v_x}{\|\vec{v}\|_2}
                - \frac{v_y}{\|\vec{v}\|_2}) \sin\left(\rotationangle\right)
                & \cos\left(\rotationangle\right)
                + i \frac{v_z}{\|\vec{v}\|_2} \sin\left(\rotationangle\right)
            \end{pmatrix}

### `__init__`

```python
def __init__(self, v_x: float, v_y: float, v_z: float, basis: str='U')
```

Args:
    v_x: x-component
    v_y: y-component
    v_z: z-component
    basis: basis (see
        :class:`~qiskit.synthesis.one_qubit.one_qubit_decompose.OneQubitEulerDecomposer`)

### `inverse`

```python
def inverse(self, annotated: bool=False)
```

Invert this gate.

### `to_matrix`

```python
def to_matrix(self) -> numpy.ndarray
```

Return a numpy.array for the R(v) gate.
