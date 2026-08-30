---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/ops/qubit/qchem_ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/ops/qubit/qchem_ops.py
license: Apache-2.0
---

## Module `pennylane/estimator/ops/qubit/qchem_ops.py`

Resource operators for qchem operations.

## `SingleExcitation`

```python
class SingleExcitation(ResourceOperator)
```

Resource class for the SingleExcitation gate.

Args:
    precision (float, optional): error threshold for Clifford + T decomposition of this operation
    wires (Sequence[int], optional): the wires the operation acts on

Resources:
    The resources are obtained by decomposing the following matrix into fundamental gates.

    .. math:: U(\phi) = \begin{bmatrix}
                1 & 0 & 0 & 0 \\
                0 & \cos(\phi/2) & -\sin(\phi/2) & 0 \\
                0 & \sin(\phi/2) & \cos(\phi/2) & 0 \\
                0 & 0 & 0 & 1
            \end{bmatrix}.

    This transformation can be expressed with the following decomposition:

    .. code-block:: bash

        0: ──T†──H───S─╭X──RZ-─╭X──S†──H──T─┤
        1: ──T†──S†──H─╰●──RY──╰●──H───S──T─┤

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.SingleExcitation`.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> se = qre.SingleExcitation()
>>> print(qre.estimate(se))
--- Resources: ---
 Total wires: 2
    algorithmic wires: 2
    allocated wires: 0
         zero state: 0
         any state: 0
 Total gates : 108
  'T': 92,
  'CNOT': 2,
  'Z': 4,
  'S': 6,
  'Hadamard': 4

### `resource_decomp`

```python
def resource_decomp(cls, precision=None) -> list[GateCount]
```

Returns a list of GateCount objects representing the operator's resources.

Args:
    precision (float, optional): error threshold for clifford plus T decomposition of this operation

Resources:
    The resources are obtained by decomposing the following matrix into fundamental gates.

    .. math:: U(\phi) = \begin{bmatrix}
                1 & 0 & 0 & 0 \\
                0 & \cos(\phi/2) & -\sin(\phi/2) & 0 \\
                0 & \sin(\phi/2) & \cos(\phi/2) & 0 \\
                0 & 0 & 0 & 1
            \end{bmatrix}.

    The cost for implementing this transformation is given by:

    .. code-block:: bash

        0: ──T†──H───S─╭X──RZ-─╭X──S†──H──T─┤
        1: ──T†──S†──H─╰●──RY──╰●──H───S──T─┤

Returns:
    list[`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * precision (float): error threshold for clifford plus T decomposition of this operation

### `resource_rep`

```python
def resource_rep(cls, precision: float | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    precision (float, optional): error threshold for clifford plus T decomposition of this operation

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation
