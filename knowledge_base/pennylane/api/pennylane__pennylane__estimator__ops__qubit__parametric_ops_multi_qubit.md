---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/ops/qubit/parametric_ops_multi_qubit.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/ops/qubit/parametric_ops_multi_qubit.py
license: Apache-2.0
---

## Module `pennylane/estimator/ops/qubit/parametric_ops_multi_qubit.py`

Resource operators for parametric multi qubit operations.

## `MultiRZ`

```python
class MultiRZ(ResourceOperator)
```

Resource class for the MultiRZ gate.

Args:
    num_wires (int | None): the number of wires the operation acts upon
    precision (float | None): error threshold for the Clifford + T decomposition of this operation
    wires (WiresLike | None): the wires the operation acts on

Resources:
    The resources come from Section VIII (Figure 3) of `The Bravyi-Kitaev transformation for
    quantum computation of electronic structure <https://arxiv.org/abs/1208.5986>`_ paper.

    Specifically, the resources are given by one ``RZ`` gate and a cascade of
    :math:`2 \times (n - 1)` ``CNOT`` gates where :math:`n` is the number of qubits
    the gate acts on.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.MultiRZ`.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> multi_rz = qre.MultiRZ(num_wires=3)
>>> gate_set = {"CNOT", "RZ"}
>>>
>>> print(qp.estimator.estimate(multi_rz, gate_set))
--- Resources: ---
 Total wires: 3
    algorithmic wires: 3
    allocated wires: 0
         zero state: 0
         any state: 0
 Total gates : 5
  'RZ': 1,
  'CNOT': 4

### `resource_decomp`

```python
def resource_decomp(cls, num_wires: int, precision: float | None=None) -> list[GateCount]
```

Returns a list representing the resources for a controlled version of the operator.

Args:
    num_wires (int): the number of qubits the operation acts upon
    precision (float): error threshold for the Clifford + T decomposition of this operation

Resources:
    The resources come from Section VIII (Figure 3) of `The Bravyi-Kitaev transformation for
    quantum computation of electronic structure <https://arxiv.org/abs/1208.5986>`_ paper.

    Specifically, the resources are given by one ``RZ`` gate and a cascade of
    :math:`2 \times (n - 1)` ``CNOT`` gates where :math:`n` is the number of qubits
    the gate acts on.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_wires (int): the number of qubits the operation acts upon
        * precision (float): error threshold for the Clifford + T decomposition of this operation

### `resource_rep`

```python
def resource_rep(cls, num_wires: int, precision: float | None=None)
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    num_wires (int): the number of qubits the operation acts upon
    precision (float): error threshold for the Clifford + T decomposition of this operation

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for the adjoint of the operator.

Args:
    target_resource_params (dict): A dictionary containing the resource parameters of the target operator

Resources:
    The adjoint of this operator just changes the sign of the phase, thus
    the resources of the adjoint operation results in the original operation.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict | None=None) -> list[GateCount]
```

Returns a list representing the resources for a controlled version of the operator.

Args:
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): A dictionary containing the resource parameters of the target operator

Resources:
    The resources are derived from the following identity. If an operation :math:`\hat{A}`
    can be expressed as :math:`\hat{A} \ = \ \hat{U} \cdot \hat{B} \cdot \hat{U}^{\dagger}`
    then the controlled operation :math:`C\hat{A}` can be expressed as:

    .. math:: C\hat{A} \ = \ \hat{U} \cdot C\hat{B} \cdot \hat{U}^{\dagger}

    Specifically, the resources are one multi-controlled RZ-gate and a cascade of
    :math:`2 * (n - 1)` ``CNOT`` gates where :math:`n` is the number of qubits
    the gate acts on.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `pow_resource_decomp`

```python
def pow_resource_decomp(cls, pow_z: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for an operator raised to a power.

Args:
    pow_z (int): the power that the operator is being raised to
    target_resource_params (dict): A dictionary containing the resource parameters of the target operator.

Resources:
    Taking arbitrary powers of a general rotation produces a sum of rotations.
    The resources simplify to just one total multi-RZ rotation.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `PauliRot`

```python
class PauliRot(ResourceOperator)
```

Resource class for an arbitrary Pauli word rotation operation.

Args:
    pauli_string (str): a string describing the Pauli operators that define the rotation
    precision (float | None): error threshold for the Clifford + T decomposition of the operation
    wires (WiresLike | None): the wire the operation acts on

Resources:
    The resources are computed based on Section VIII (Figures 3 and 4) of
    `The Bravyi-Kitaev transformation for quantum computation of electronic structure
    <https://arxiv.org/abs/1208.5986>`_, in combination with the following identities:

    .. math::

        \begin{align}
            \hat{X} &= \hat{H} \cdot \hat{Z} \cdot \hat{H}, \\
            \hat{Y} &= \hat{S} \cdot \hat{H} \cdot \hat{Z} \cdot \hat{H} \cdot \hat{S}^{\dagger}.
        \end{align}

    Note that when the :code:`pauli_string` is a single Pauli operator (:code:`X, Y, Z, Identity`),
    the cost is the associated single-qubit rotation (i.e., :code:`RX, RY, RZ, GlobalPhase`). If the
    :code:`pauli_string` is :code:`XX`, the resources are one :code:`RX` gate at the specified
    precision and two :code:`CNOT` gates. If the :code:`pauli_string` is :code:`YY`, the
    resources are one :code:`RY` gate at the specified precision and two :code:`CY` gates.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.PauliRot`.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> pr = qre.PauliRot(pauli_string="XYZ")
>>> print(qre.estimate(pr))
--- Resources: ---
 Total wires: 3
    algorithmic wires: 3
    allocated wires: 0
         zero state: 0
         any state: 0
 Total gates : 55
  'T': 44,
  'CNOT': 4,
  'Z': 1,
  'S': 2,
  'Hadamard': 4

### `resource_decomp`

```python
def resource_decomp(cls, pauli_string: str, precision: float | None=None) -> list[GateCount]
```

Returns a list of GateCount objects representing the operator's resources.

Args:
    pauli_string (str): a string describing the Pauli operators that define the rotation
    precision (float | None): error threshold for the Clifford + T decomposition of this operation

Resources:
    The resources are computed based on Section VIII (Figures 3 and 4) of
    `The Bravyi-Kitaev transformation for quantum computation of electronic structure
    <https://arxiv.org/abs/1208.5986>`_, in combination with the following identities:

    .. math::

        \begin{align}
            \hat{X} &= \hat{H} \cdot \hat{Z} \cdot \hat{H}, \\
            \hat{Y} &= \hat{S} \cdot \hat{H} \cdot \hat{Z} \cdot \hat{H} \cdot \hat{S}^{\dagger}.
        \end{align}

    Note that when the :code:`pauli_string` is a single Pauli operator (:code:`X, Y, Z, Identity`),
    the cost is the associated single-qubit rotation (i.e., :code:`RX, RY, RZ, GlobalPhase`). If the
    :code:`pauli_string` is :code:`XX`, the resources are one :code:`RX` gate at the specified
    precision and two :code:`CNOT` gates. If the :code:`pauli_string` is :code:`YY`, the
    resources are one :code:`RY` gate at the specified precision and two :code:`CY` gates.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * pauli_string (str): a string describing the Pauli operators that define the rotation
        * precision (float): error threshold for the Clifford + T decomposition of this operation

### `resource_rep`

```python
def resource_rep(cls, pauli_string: str, precision: float | None=None)
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    pauli_string (str): a string describing the Pauli operators that define the rotation
    precision (float | None): error threshold for the Clifford + T decomposition of this operation

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`:: the operator in a compressed representation

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for the adjoint of the operator.

Args:
    target_resource_params (dict): A dictionary containing the resource parameters of the target operator

Resources:
    The adjoint of this operator just changes the sign of the phase, thus
    the resources of the adjoint operation results in the original operation.

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
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): A dictionary containing the resource parameters of the target operator

Resources:
    When the :code:`pauli_string` is a single Pauli operator (:code:`X, Y, Z, Identity`)
    the cost is the associated controlled single qubit rotation gate: (:code:`CRX`,
    :code:`CRY`, :code:`CRZ`, controlled-\ :code:`GlobalPhase`).

    The resources are derived from the following identity. If an operation :math:`\hat{A}`
    can be expressed as :math:`\hat{A} \ = \ \hat{U} \cdot \hat{B} \cdot \hat{U}^{\dagger}`
    then the controlled operation :math:`C\hat{A}` can be expressed as:

    .. math:: C\hat{A} \ = \ \hat{U} \cdot C\hat{B} \cdot \hat{U}^{\dagger}

    Specifically, the resources are one multi-controlled RZ-gate and a cascade of
    :math:`2 \times (n - 1)` :code:`CNOT` gates where :math:`n` is the number of qubits
    the gate acts on. Additionally, for each :code:`X` gate in the Pauli word we conjugate by
    a pair of :code:`Hadamard` gates, and for each :code:`Y` gate in the Pauli word
    we conjugate by a pair of :code:`Hadamard` and a pair of :code:`S` gates.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `pow_resource_decomp`

```python
def pow_resource_decomp(cls, pow_z: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for an operator raised to a power.

Args:
    pow_z (int): the power that the operator is being raised to
    target_resource_params (dict): A dictionary containing the resource parameters of the target operator.

Resources:
    Taking arbitrary powers of a general rotation produces a sum of rotations.
    The resources simplify to just one total Pauli rotation.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `PCPhase`

```python
class PCPhase(ResourceOperator)
```

A resource operator representing a projector-controlled phase gate.

This gate applies a complex phase :math:`e^{i\phi}` to the first ``dim``
basis vectors of the input state while applying a complex phase :math:`e^{-i \phi}`
to the remaining basis vectors. For example, consider the 2-qubit case where ``dim = 3``:

.. math:: \Pi(\phi) = \begin{bmatrix}
            e^{i\phi} & 0 & 0 & 0 \\
            0 & e^{i\phi} & 0 & 0 \\
            0 & 0 & e^{i\phi} & 0 \\
            0 & 0 & 0 & e^{-i\phi}
        \end{bmatrix}.

This can also be written as :math:`\Pi(\phi) = \exp(i\phi(2\Pi-\mathbb{I}_N))`, where
:math:`N=2^n` is the Hilbert space dimension for :math:`n` qubits and :math:`\Pi` is
the diagonal projector with ``dim`` ones and ``N-dim`` zeros.

Args:
    num_wires (int): the number of wires this operator acts on
    dim (int): the dimension of the target subspace
    rotation_precision (float | None): The error threshold for the approximate Clifford + T
        decomposition of the :class:`~pennylane.estimator.ops.qubit.parametric_ops_single_qubit.PhaseShift` gates used to implement this operation.
    wires (WiresLike | None): the wire the operation acts on

Resources:
    The resources are derived from the decomposition of the generator :math:`G` of the
    ``PCPhase`` gate into multiple projectors, which generate (multi-controlled) ``PhaseShift`` gates,
    potentially complemented with (non-controlled) ``X`` gates and/or a global phase.
    The generator is given as :math:`G = 2 \Pi - \mathbb{I}_N`, where :math:`\Pi` is a projector.
    The projector :math:`\Pi` is decomposed into sums and differences of powers of two,
    which correspond to multi-controlled :class:`~pennylane.estimator.ops.qubit.parametric_ops_single_qubit.PhaseShift` gates.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.PCPhase`.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> pc_phase = qre.PCPhase(num_wires=2, dim=2, rotation_precision=1e-5)
>>> print(qre.estimate(pc_phase))
--- Resources: ---
 Total wires: 2
   algorithmic wires: 2
   allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 28
   'T': 28

### `resource_decomp`

```python
def resource_decomp(cls, num_wires: int, dim: int, rotation_precision: float | None=None) -> list[GateCount]
```

Returns a list of GateCount objects representing the operator's resources.

Args:
    num_wires (int): the number of wires this operator acts on
    dim (int): the dimension of the target subspace
    rotation_precision (float | None): The error threshold for the approximate Clifford + T
        decomposition of the :class:`~pennylane.estimator.ops.qubit.parametric_ops_single_qubit.PhaseShift` gates used to implement this operation.

Resources:
    The resources are derived from the decomposition of the generator :math:`G` of the
    ``PCPhase`` gate into multiple projectors, which generate (multi-controlled) :class:`~pennylane.estimator.ops.qubit.parametric_ops_single_qubit.PhaseShift` gates,
    potentially complemented with (non-controlled) ``X`` gates and/or a global phase.
    The generator is given as :math:`G = 2 \Pi - \mathbb{I}_N`, where :math:`\Pi` is a projector.
    The projector :math:`\Pi` is decomposed into sums and differences of powers of two,
    which correspond to multi-controlled :class:`~pennylane.estimator.ops.qubit.parametric_ops_single_qubit.PhaseShift` gates.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_wires (int): the number of wires this operator acts on
        * dim (int): the dimension of the target subspace
        * rotation_precision(float | None): The error threshold for the approximate Clifford + T
          decomposition of the :class:`~pennylane.estimator.ops.qubit.parametric_ops_single_qubit.PhaseShift` gates used to implement this operation.

### `resource_rep`

```python
def resource_rep(cls, num_wires: int, dim: int, rotation_precision: float | None=None)
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    num_wires (int): the number of wires this operator acts on
    dim (int): the dimension of the target subspace
    rotation_precision(float | None): The error threshold for the approximate Clifford + T
        decomposition of the :class:`~pennylane.estimator.ops.qubit.parametric_ops_single_qubit.PhaseShift` gates used to implement this operation.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation
