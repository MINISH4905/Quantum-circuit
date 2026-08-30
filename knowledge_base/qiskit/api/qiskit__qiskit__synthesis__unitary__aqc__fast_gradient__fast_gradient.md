---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/unitary/aqc/fast_gradient/fast_gradient.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/unitary/aqc/fast_gradient/fast_gradient.py
license: Apache-2.0
---

## Module `qiskit/synthesis/unitary/aqc/fast_gradient/fast_gradient.py`

Implementation of the fast objective function class.

## `FastCNOTUnitObjective`

```python
class FastCNOTUnitObjective(CNOTUnitObjective)
```

Implementation of objective function and gradient calculator, which is
similar to
:class:`~qiskit.transpiler.aqc.DefaultCNOTUnitObjective`
but several times faster.

### `objective`

```python
def objective(self, param_values: np.ndarray) -> float
```

Computes the objective function and some intermediate data for
the subsequent gradient computation.
See description of the base class method.

### `gradient`

```python
def gradient(self, param_values: np.ndarray) -> np.ndarray
```

Computes the gradient of objective function.
See description of the base class method.
