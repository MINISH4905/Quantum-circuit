---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/ops/qubit/parametric_ops_single_qubit.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/ops/qubit/parametric_ops_single_qubit.py
license: Apache-2.0
---

## Module `pennylane/estimator/ops/qubit/parametric_ops_single_qubit.py`

Resource operators for parametric single qubit operations.

## `PhaseShift`

```python
class PhaseShift(ResourceOperator)
```

Resource class for the PhaseShift gate.

Args:
    precision (float | None): The error threshold for the Clifford + T decomposition
        of this operation. The default value is ``None`` which corresponds to using the
        ``precision`` stated in the ``ResourceConfig``.
    wires (Any or Wires | None): The wires the operation acts on.

Resources:
    The phase shift gate is equivalent to a Z-rotation up to some global phase,
    as defined from the following identity:

    .. math:: R_\phi(\phi) = e^{i\phi/2}R_z(\phi) = \begin{bmatrix}
                1 & 0 \\
                0 & e^{i\phi}
            \end{bmatrix}.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.PhaseShift`.

**Example**

The resources for this operation are computed as:

>>> qp.estimator.PhaseShift.resource_decomp()
[(1 x RZ), (1 x GlobalPhase)]

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * precision (float | None): the number of qubits the operation is controlled on

### `resource_rep`

```python
def resource_rep(cls, precision: float | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the operator that are needed to compute the resources.

Args:
    precision (float | None): The error threshold for the Clifford + T decomposition of this operation.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: A compressed representation of the operator.

### `resource_decomp`

```python
def resource_decomp(cls, precision: float | None=None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a quantum gate
and the number of times it occurs in the decomposition.

Keyword Args:
    precision (float): error threshold for the Clifford + T decomposition of this operation

Resources:
    The phase shift gate is equivalent to a Z-rotation upto some global phase,
    as defined in the following identity:

    .. math:: R_\phi(\phi) = e^{i\phi/2}R_z(\phi) = \begin{bmatrix}
                1 & 0 \\
                0 & e^{i\phi}
            \end{bmatrix}.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for the adjoint of the operator.

Args:
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

Resources:
    The adjoint of a phase shift operator just changes the sign of the phase, thus
    the resources of the adjoint operation are same as the original operation.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for a controlled version of the operator.

Args:
    num_ctrl_wires (int): the number of qubits the
        operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are
        controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

### `pow_resource_decomp`

```python
def pow_resource_decomp(cls, pow_z: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for an operator raised to a power.

Args:
    pow_z (int): the power that the operator is being raised to
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

Resources:
    Taking arbitrary powers of a phase shift produces a sum of shifts.
    The resources simplify to just one total phase shift operator.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `RX`

```python
class RX(ResourceOperator)
```

Resource class for the RX gate.

Args:
    precision (float | None): The error threshold for the Clifford + T decomposition
        of this operation. The default value is ``None`` which corresponds to using the
        ``precision`` stated in the ``ResourceConfig``.
    wires (Any or Wires | None): The wires the operation acts on.

Resources:
    A single qubit rotation gate can be approximately synthesised from Clifford and T gates. The
    resources are approximating the gate with a series of T gates. The expected T-count is taken
    from the "Simulation Results" section of `Efficient Synthesis of Universal Repeat-Until-Success
    Circuits <https://arxiv.org/abs/1404.5320>`_. The cost is given as:

    .. math:: T_{count} \approx 1.149 \times log_{2}(\frac{1}{\epsilon}) + 9.2

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.RX`.

**Example**

The resources for this operation are computed using:

>>> qp.estimator.RX.resource_decomp(precision=1e-4)
[(24 x T)]

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * precision (float | None): the number of qubits the operation is controlled on

### `resource_rep`

```python
def resource_rep(cls, precision: float | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the operator that are needed to compute the resources.

Args:
    precision (float | None): The error threshold for the Clifford + T decomposition of this operation.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: A compressed representation of the operator.

### `resource_decomp`

```python
def resource_decomp(cls, precision: float | None=None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a quantum gate
and the number of times it occurs in the decomposition.

Keyword Args:
    precision (float): error threshold for the Clifford + T decomposition of this operation

Resources:
    A single qubit rotation gate can be approximately synthesised from Clifford and T gates. The
    resources are approximating the gate with a series of T gates. The expected T-count is taken
    from the "Simulation Results" section of `Eﬃcient Synthesis of Universal Repeat-Until-Success
    Circuits <https://arxiv.org/abs/1404.5320>`_. The cost is given as:

    .. math:: T_{count} \approx 1.149 \times log_{2}(\frac{1}{\epsilon}) + 9.2

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for the adjoint of the operator.

Args:
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

Resources:
    The adjoint of a single qubit rotation changes the sign of the rotation angle,
    thus the resources of the adjoint operation result in the original operation.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for a controlled version of the operator.

Args:
    num_ctrl_wires (int): the number of qubits the
        operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are
        controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

### `pow_resource_decomp`

```python
def pow_resource_decomp(cls, pow_z: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for an operator raised to a power.

Args:
    pow_z (int): the power that the operator is being raised to
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

Resources:
    Taking arbitrary powers of a single qubit rotation produces a sum of rotations.
    The resources simplify to just one total single qubit rotation.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `RY`

```python
class RY(ResourceOperator)
```

Resource class for the RY gate.

Args:
    precision (float | None): The error threshold for the Clifford + T decomposition
        of this operation. The default value is ``None`` which corresponds to using the
        ``precision`` stated in the ``ResourceConfig``.
    wires (Any or Wires | None): The wires the operation acts on.

Resources:
    A single qubit rotation gate can be approximately synthesised from Clifford and T gates. The
    resources are approximating the gate with a series of T gates. The expected T-count is taken
    from the "Simulation Results" section of `Efficient Synthesis of Universal Repeat-Until-Success
    Circuits <https://arxiv.org/abs/1404.5320>`_. The cost is given as:

    .. math:: T_{count} \approx 1.149 \times log_{2}(\frac{1}{\epsilon}) + 9.2

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.RY`.

**Example**

The resources for this operation are computed using:

>>> qp.estimator.RY.resource_decomp(precision=1e-4)
[(24 x T)]

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * precision (float | None): the number of qubits the operation is controlled on

### `resource_rep`

```python
def resource_rep(cls, precision: float | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the operator that are needed to compute the resources.

Args:
    precision (float | None): The error threshold for the Clifford + T decomposition of this operation.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: A compressed representation of the operator.

### `resource_decomp`

```python
def resource_decomp(cls, precision: float | None=None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a quantum gate
and the number of times it occurs in the decomposition.

Keyword Args:
    precision (float): error threshold for the Clifford + T decomposition of this operation

Resources:
    A single qubit rotation gate can be approximately synthesised from Clifford and T gates. The
    resources are approximating the gate with a series of T gates. The expected T-count is taken
    from the "Simulation Results" section of `Efficient Synthesis of Universal Repeat-Until-Success
    Circuits <https://arxiv.org/abs/1404.5320>`_. The cost is given as:

    .. math:: T_{count} \approx 1.149 \times log_{2}(\frac{1}{\epsilon}) + 9.2

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for the adjoint of the operator.

Args:
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

Resources:
    The adjoint of a single qubit rotation changes the sign of the rotation angle,
    thus the resources of the adjoint operation result in the original operation.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for a controlled version of the operator.

Args:
    num_ctrl_wires (int): the number of qubits the
        operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are
        controlled when in the :math:`|0\rangle` state

### `pow_resource_decomp`

```python
def pow_resource_decomp(cls, pow_z: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for an operator raised to a power.

Args:
    pow_z (int): the power that the operator is being raised to
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

Resources:
    Taking arbitrary powers of a single qubit rotation produces a sum of rotations.
    The resources simplify to just one total single qubit rotation.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `RZ`

```python
class RZ(ResourceOperator)
```

Resource class for the RZ gate.

Args:
    precision (float | None): The error threshold for the Clifford + T decomposition
        of this operation. The default value is ``None`` which corresponds to using the
        ``precision`` stated in the ``ResourceConfig``.
    wires (Any or Wires | None): The wires the operation acts on.

Resources:
    A single qubit rotation gate can be approximately synthesised from Clifford and T gates. The
    resources are approximating the gate with a series of T gates. The expected T-count is taken
    from the "Simulation Results" section of `Eﬃcient Synthesis of Universal Repeat-Until-Success
    Circuits <https://arxiv.org/abs/1404.5320>`_. The cost is given as:

    .. math:: T_{count} \approx 1.149 \times log_{2}(\frac{1}{\epsilon}) + 9.2

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.RZ`.

**Example**

The resources for this operation are computed using:

>>> qp.estimator.RZ.resource_decomp(precision=1e-4)
[(24 x T)]

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * precision (float | None): the number of qubits the operation is controlled on

### `resource_rep`

```python
def resource_rep(cls, precision: float | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the operator that are needed to compute the resources.

Args:
    precision (float | None): The error threshold for the Clifford + T decomposition of this operation.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: A compressed representation of the operator.

### `resource_decomp`

```python
def resource_decomp(cls, precision: float | None=None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a quantum gate
and the number of times it occurs in the decomposition.

Resources:
    A single qubit rotation gate can be approximately synthesised from Clifford and T gates. The
    resources are approximating the gate with a series of T gates. The expected T-count is taken
    from the "Simulation Results" section of `Eﬃcient Synthesis of Universal Repeat-Until-Success
    Circuits <https://arxiv.org/abs/1404.5320>`_. The cost is given as:

    .. math:: T_{count} \approx 1.149 \times log_{2}(\frac{1}{\epsilon}) + 9.2

Args:
    precision (float): error threshold for the Clifford + T decomposition of this operation

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for the adjoint of the operator.

Args:
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

Resources:
    The adjoint of a single qubit rotation changes the sign of the rotation angle,
    thus the resources of the adjoint operation result in the original operation.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for a controlled version of the operator.

Args:
    num_ctrl_wires (int): the number of qubits the
        operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are
        controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

### `pow_resource_decomp`

```python
def pow_resource_decomp(cls, pow_z: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for an operator raised to a power.

Args:
    pow_z (int): the power that the operator is being raised to
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

Resources:
    Taking arbitrary powers of a single qubit rotation produces a sum of rotations.
    The resources simplify to just one total single qubit rotation.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `Rot`

```python
class Rot(ResourceOperator)
```

Resource class for the Rot gate.

Args:
    precision (float | None): The error threshold for the Clifford + T decomposition
        of this operation. The default value is ``None`` which corresponds to using the
        ``precision`` stated in the ``ResourceConfig``.
    wires (Any or Wires | None): The wires the operation acts on.

Resources:
    The resources are obtained according to the definition of the ``Rot`` gate:

    .. math:: \hat{R}(\omega, \theta, \phi) = \hat{RZ}(\omega) \cdot \hat{RY}(\theta) \cdot \hat{RZ}(\phi).

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.Rot`.

**Example**

The resources for this operation are computed using:

>>> qp.estimator.Rot.resource_decomp()
[(1 x RY), (2 x RZ)]

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * precision (float | None): the number of qubits the operation is controlled on

### `resource_rep`

```python
def resource_rep(cls, precision: float | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the operator that are needed to compute the resources.

Args:
    precision (float | None): The error threshold for the Clifford + T decomposition of this operation.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: A compressed representation of the operator.

### `resource_decomp`

```python
def resource_decomp(cls, precision: float | None=None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a quantum gate
and the number of times it occurs in the decomposition.

Resources:
    The resources are obtained according to the definition of the ``Rot`` gate:

    .. math:: \hat{R}(\omega, \theta, \phi) = \hat{RZ}(\omega) \cdot \hat{RY}(\theta) \cdot \hat{RZ}(\phi).

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for the adjoint of the operator.

Resources:
    The adjoint of a general single qubit rotation changes the sign of the rotation angles,
    thus the resources of the adjoint operation are same as the original operation.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for a controlled version of the operator.

Args:
    num_ctrl_wires (int): the number of qubits the
        operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are
        controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

### `pow_resource_decomp`

```python
def pow_resource_decomp(cls, pow_z: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for an operator raised to a power.

Args:
    pow_z (int): the power that the operator is being raised to
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

Resources:
    Taking arbitrary powers of a general single qubit rotation produces a sum of rotations.
    The resources simplify to just one total single qubit rotation.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.
