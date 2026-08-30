---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/ops/qubit/matrix_ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/ops/qubit/matrix_ops.py
license: Apache-2.0
---

## Module `pennylane/estimator/ops/qubit/matrix_ops.py`

Resource operators for QubitUnitary operation.

## `QubitUnitary`

```python
class QubitUnitary(ResourceOperator)
```

Resource class for the QubitUnitary template.

Args:
    num_wires (int | None): the number of qubits the operation acts upon
    precision (Union[float, None], optional): The precision used when preparing the single qubit
        rotations used to synthesize the n-qubit unitary.
    wires (Sequence[int], None): the wires the operation acts on

Resources:
    The resources are defined by combining the two equalities in `Möttönen and Vartiainen
    (2005), Fig 14 <https://arxiv.org/abs/quant-ph/0504100>`_ , we can express an :math:`n`
    qubit unitary as four :math:`n - 1` qubit unitaries and three multiplexed rotations
    via (:class:`~.pennylane.estimator.templates.subroutines.SelectPauliRot`). Specifically, the cost
    is given by:

    * 1-qubit unitary, can be implemented up to a global phase by composing RX, RY, and RZ gates.
      The cost is given by two :code:`RZ` rotations and one :code:`RY` rotation (``"RZ RY RZ"``).

    * 2-qubit unitary, the cost is described by Figure 2 in `Shende, Markov and Bullock (2004)
      <https://arxiv.org/abs/quant-ph/0308033>`_. The cost is four general single qubit unitaries,
      two :code:`RY` rotations, one :code:`RZ` rotation and three :code:`CNOT` gates.

    * 3-qubit unitary or more, the cost is given according to Figure 14 in `Möttönen and Vartiainen
      (2005), Fig 14 <https://arxiv.org/abs/quant-ph/0504100>`_ , recursively.

.. seealso:: The associated PennyLane operation :class:`~.pennylane.QubitUnitary`.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> qu = qre.QubitUnitary(num_wires=3)
>>> gate_set =["RZ", "RY", "CNOT"]
>>> print(qre.estimate(qu, gate_set))
--- Resources: ---
 Total wires: 3
    algorithmic wires: 3
    allocated wires: 0
         zero state: 0
         any state: 0
 Total gates : 96
  'RZ': 44,
  'RY': 28,
  'CNOT': 24

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_wires (int): the number of qubits the operation acts upon
        * precision (Union[float, None], optional): The precision used when preparing the
          single qubit rotations used to synthesize the n-qubit unitary.

### `resource_rep`

```python
def resource_rep(cls, num_wires, precision=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    num_wires (int): the number of qubits the operation acts upon
    precision (Union[float, None], optional): The precision used when preparing the single
        qubit rotations used to synthesize the n-qubit unitary.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, num_wires, precision=None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    num_wires (int): the number of qubits the operation acts upon
    precision (Union[float, None], optional): The precision used when preparing the single
        qubit rotations used to synthesize the n-qubit unitary.

Resources:
    The resources are defined by combining the two equalities in `Möttönen and Vartiainen
    (2005), Fig 14 <https://arxiv.org/abs/quant-ph/0504100>`_, we can express an :math:`n`-
    qubit unitary as four :math:`n - 1`-qubit unitaries and three multiplexed rotations
    via (:class:`~.pennylane.estimator.templates.subroutines.SelectPauliRot`). Specifically, the cost
    is given by:

    * 1-qubit unitary, can be implemented up to a global phase by composing RX, RY, and RZ gates.
      The cost is given by two :code:`RZ` rotations and one :code:`RY` rotation (``"RZ RY RZ"``).

    * 2-qubit unitary, the cost is described by Figure 2 in `Shende, Markov and Bullock (2004)
      <https://arxiv.org/abs/quant-ph/0308033>`_. The cost is four general single qubit unitaries,
      two :code:`RY` rotations, one :code:`RZ` rotation and three :code:`CNOT` gates.

    * 3-qubit unitary or more, the cost is given according to Figure 14 in `Möttönen and Vartiainen
      (2005), Fig 14 <https://arxiv.org/abs/quant-ph/0504100>`_ , recursively.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.
