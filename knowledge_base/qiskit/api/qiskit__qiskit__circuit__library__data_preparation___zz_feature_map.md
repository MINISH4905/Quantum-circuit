---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/data_preparation/_zz_feature_map.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/data_preparation/_zz_feature_map.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/data_preparation/_zz_feature_map.py`

Second-order Pauli-Z expansion circuit.

## `ZZFeatureMap`

```python
class ZZFeatureMap(PauliFeatureMap)
```

Second-order Pauli-Z evolution circuit.

For 3 qubits and 1 repetition and linear entanglement the circuit is represented by:

.. code-block:: text

    ┌───┐┌────────────────┐
    ┤ H ├┤ P(2.0*φ(x[0])) ├──■───────────────────────────■───────────────────────────────────
    ├───┤├────────────────┤┌─┴─┐┌─────────────────────┐┌─┴─┐
    ┤ H ├┤ P(2.0*φ(x[1])) ├┤ X ├┤ P(2.0*φ(x[0],x[1])) ├┤ X ├──■───────────────────────────■──
    ├───┤├────────────────┤└───┘└─────────────────────┘└───┘┌─┴─┐┌─────────────────────┐┌─┴─┐
    ┤ H ├┤ P(2.0*φ(x[2])) ├─────────────────────────────────┤ X ├┤ P(2.0*φ(x[1],x[2])) ├┤ X ├
    └───┘└────────────────┘                                 └───┘└─────────────────────┘└───┘

Here, :math:`\varphi` is a classical non-linear function, which defaults to
:math:`\varphi(x) = x` if :math:`|S| = 1` and
:math:`\varphi(x,y) = (\pi - x)(\pi - y)` if :math:`|S| > 1`, and
:math:`S` is the set of qubit indices describing the connections in the feature map.
See the docstring of :func:`~.pauli_feature_map.pauli_feature_map` for more detail.

Examples:

.. code-block::

     from qiskit.circuit.library import ZZFeatureMap
     prep = ZZFeatureMap(2, reps=1)
     print(prep.decompose())

.. code-block:: text

          ┌───┐┌─────────────┐
     q_0: ┤ H ├┤ P(2.0*x[0]) ├──■──────────────────────────────────────■──
          ├───┤├─────────────┤┌─┴─┐┌────────────────────────────────┐┌─┴─┐
     q_1: ┤ H ├┤ P(2.0*x[1]) ├┤ X ├┤ P(2.0*(pi - x[0])*(pi - x[1])) ├┤ X ├
          └───┘└─────────────┘└───┘└────────────────────────────────┘└───┘

.. code-block::

     from qiskit.circuit.library import EfficientSU2
     classifier = ZZFeatureMap(3).compose(EfficientSU2(3))
     classifier.num_parameters

.. code-block:: text

     27

.. code-block::

     classifier.parameters  # 'x' for the data preparation, 'θ' for the SU2 parameters

.. code-block:: text

     ParameterView([
         ParameterVectorElement(x[0]), ParameterVectorElement(x[1]),
         ParameterVectorElement(x[2]), ParameterVectorElement(θ[0]),
         ParameterVectorElement(θ[1]), ParameterVectorElement(θ[2]),
         ParameterVectorElement(θ[3]), ParameterVectorElement(θ[4]),
         ParameterVectorElement(θ[5]), ParameterVectorElement(θ[6]),
         ParameterVectorElement(θ[7]), ParameterVectorElement(θ[8]),
         ParameterVectorElement(θ[9]), ParameterVectorElement(θ[10]),
         ParameterVectorElement(θ[11]), ParameterVectorElement(θ[12]),
         ParameterVectorElement(θ[13]), ParameterVectorElement(θ[14]),
         ParameterVectorElement(θ[15]), ParameterVectorElement(θ[16]),
         ParameterVectorElement(θ[17]), ParameterVectorElement(θ[18]),
         ParameterVectorElement(θ[19]), ParameterVectorElement(θ[20]),
         ParameterVectorElement(θ[21]), ParameterVectorElement(θ[22]),
         ParameterVectorElement(θ[23])
     ])

.. code-block::

     classifier.count_ops()

.. code-block:: text

    OrderedDict([('ZZFeatureMap', 1), ('EfficientSU2', 1)])

### `__init__`

```python
def __init__(self, feature_dimension: int, reps: int=2, entanglement: str | dict[int, list[tuple[int]]] | Callable[[int], str | dict[int, list[tuple[int]]]]='full', data_map_func: Callable[[np.ndarray], float] | None=None, parameter_prefix: str='x', insert_barriers: bool=False, name: str='ZZFeatureMap') -> None
```

Args:
    feature_dimension: Number of features.
    reps: The number of repeated circuits, has a min. value of 1.
    entanglement: Specifies the entanglement structure. Refer to
        :class:`~qiskit.circuit.library.PauliFeatureMap` for detail.
    data_map_func: A mapping function for the data ``x``.
    parameter_prefix: The prefix used if default parameters are generated.
    insert_barriers: If ``True``, barriers are inserted in between the evolution instructions
        and hadamard layers.
    name: Name of the circuit.

Raises:
    ValueError: If the feature dimension is smaller than 2.
