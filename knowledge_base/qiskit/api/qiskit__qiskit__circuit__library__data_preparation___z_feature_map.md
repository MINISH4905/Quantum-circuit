---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/data_preparation/_z_feature_map.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/data_preparation/_z_feature_map.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/data_preparation/_z_feature_map.py`

Create a new first-order Pauli-Z expansion circuit.

## `ZFeatureMap`

```python
class ZFeatureMap(PauliFeatureMap)
```

The first order Pauli Z-evolution circuit.

On 3 qubits and with 2 repetitions the circuit is represented by:

.. code-block:: text

    ┌───┐┌─────────────┐┌───┐┌─────────────┐
    ┤ H ├┤ P(2.0*x[0]) ├┤ H ├┤ P(2.0*x[0]) ├
    ├───┤├─────────────┤├───┤├─────────────┤
    ┤ H ├┤ P(2.0*x[1]) ├┤ H ├┤ P(2.0*x[1]) ├
    ├───┤├─────────────┤├───┤├─────────────┤
    ┤ H ├┤ P(2.0*x[2]) ├┤ H ├┤ P(2.0*x[2]) ├
    └───┘└─────────────┘└───┘└─────────────┘

This is a sub-class of :class:`~qiskit.circuit.library.PauliFeatureMap` where the Pauli
strings are fixed as `['Z']`. As a result the first order expansion will be a circuit without
entangling gates.

Examples:

    >>> prep = ZFeatureMap(3, reps=3, insert_barriers=True)
    >>> print(prep.decompose())
         ┌───┐ ░ ┌─────────────┐ ░ ┌───┐ ░ ┌─────────────┐ ░ ┌───┐ ░ ┌─────────────┐
    q_0: ┤ H ├─░─┤ P(2.0*x[0]) ├─░─┤ H ├─░─┤ P(2.0*x[0]) ├─░─┤ H ├─░─┤ P(2.0*x[0]) ├
         ├───┤ ░ ├─────────────┤ ░ ├───┤ ░ ├─────────────┤ ░ ├───┤ ░ ├─────────────┤
    q_1: ┤ H ├─░─┤ P(2.0*x[1]) ├─░─┤ H ├─░─┤ P(2.0*x[1]) ├─░─┤ H ├─░─┤ P(2.0*x[1]) ├
         ├───┤ ░ ├─────────────┤ ░ ├───┤ ░ ├─────────────┤ ░ ├───┤ ░ ├─────────────┤
    q_2: ┤ H ├─░─┤ P(2.0*x[2]) ├─░─┤ H ├─░─┤ P(2.0*x[2]) ├─░─┤ H ├─░─┤ P(2.0*x[2]) ├
         └───┘ ░ └─────────────┘ ░ └───┘ ░ └─────────────┘ ░ └───┘ ░ └─────────────┘

    >>> data_map = lambda x: x[0]*x[0] + 1  # note: input is an array
    >>> prep = ZFeatureMap(3, reps=1, data_map_func=data_map)
    >>> print(prep.decompose())
         ┌───┐┌──────────────────────┐
    q_0: ┤ H ├┤ P(2.0*x[0]**2 + 2.0) ├
         ├───┤├──────────────────────┤
    q_1: ┤ H ├┤ P(2.0*x[1]**2 + 2.0) ├
         ├───┤├──────────────────────┤
    q_2: ┤ H ├┤ P(2.0*x[2]**2 + 2.0) ├
         └───┘└──────────────────────┘

    >>> from qiskit.circuit.library import TwoLocal
    >>> ry = TwoLocal(3, "ry", "cz", reps=1)
    >>> classifier = ZFeatureMap(3, reps=1) + ry
    >>> print(classifier.decompose())
         ┌───┐┌─────────────┐┌──────────┐      ┌──────────┐
    q_0: ┤ H ├┤ P(2.0*x[0]) ├┤ RY(θ[0]) ├─■──■─┤ RY(θ[3]) ├────────────
         ├───┤├─────────────┤├──────────┤ │  │ └──────────┘┌──────────┐
    q_1: ┤ H ├┤ P(2.0*x[1]) ├┤ RY(θ[1]) ├─■──┼──────■──────┤ RY(θ[4]) ├
         ├───┤├─────────────┤├──────────┤    │      │      ├──────────┤
    q_2: ┤ H ├┤ P(2.0*x[2]) ├┤ RY(θ[2]) ├────■──────■──────┤ RY(θ[5]) ├
         └───┘└─────────────┘└──────────┘                  └──────────┘

### `__init__`

```python
def __init__(self, feature_dimension: int, reps: int=2, data_map_func: Callable[[np.ndarray], float] | None=None, parameter_prefix: str='x', insert_barriers: bool=False, name: str='ZFeatureMap') -> None
```

Args:
    feature_dimension: The number of features
    reps: The number of repeated circuits. Defaults to 2, has a minimum value of 1.
    data_map_func: A mapping function for data x which can be supplied to override the
        default mapping from :meth:`self_product`.
    parameter_prefix: The prefix used if default parameters are generated.
    insert_barriers: If True, barriers are inserted in between the evolution instructions
        and hadamard layers.
    name: Name of the circuit.
