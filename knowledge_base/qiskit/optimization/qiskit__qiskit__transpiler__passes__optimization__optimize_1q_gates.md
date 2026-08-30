---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/optimize_1q_gates.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/optimize_1q_gates.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/optimize_1q_gates.py`

Optimize chains of single-qubit u1, u2, u3 gates by combining them into a single gate.

## `Optimize1qGates`

```python
class Optimize1qGates(TransformationPass)
```

Optimize chains of single-qubit u1, u2, u3 gates by combining them into a single gate.

### `__init__`

```python
def __init__(self, basis=None, eps=1e-15, target=None)
```

Optimize1qGates initializer.

Args:
    basis (list[str]): Basis gates to consider, e.g. `['u3', 'cx']`. For the effects
        of this pass, the basis is the set intersection between the `basis` parameter and
        the set `{'u1','u2','u3', 'u', 'p'}`.
    eps (float): EPS to check against
    target (Target): The :class:`~.Target` representing the target backend, if both
        ``basis`` and ``target`` are specified then this argument will take
        precedence and ``basis`` will be ignored.

### `run`

```python
def run(self, dag)
```

Run the Optimize1qGates pass on `dag`.

Args:
    dag (DAGCircuit): the DAG to be optimized.

Returns:
    DAGCircuit: the optimized DAG.

Raises:
    TranspilerError: if ``YZY`` and ``ZYZ`` angles do not give same rotation matrix.

### `compose_u3`

```python
def compose_u3(theta1, phi1, lambda1, theta2, phi2, lambda2)
```

Return a triple theta, phi, lambda for the product.

u3(theta, phi, lambda)
   = u3(theta1, phi1, lambda1).u3(theta2, phi2, lambda2)
   = Rz(phi1).Ry(theta1).Rz(lambda1+phi2).Ry(theta2).Rz(lambda2)
   = Rz(phi1).Rz(phi').Ry(theta').Rz(lambda').Rz(lambda2)
   = u3(theta', phi1 + phi', lambda2 + lambda')

Return theta, phi, lambda.

### `yzy_to_zyz`

```python
def yzy_to_zyz(xi, theta1, theta2, eps=1e-09)
```

Express a Y.Z.Y single qubit gate as a Z.Y.Z gate.

Solve the equation

.. math::

Ry(theta1).Rz(xi).Ry(theta2) = Rz(phi).Ry(theta).Rz(lambda)

for theta, phi, and lambda.

Return a solution theta, phi, and lambda.
