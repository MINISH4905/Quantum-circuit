---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/estimator_beta/ops/qubit/parametric_ops_multi_qubit.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/estimator_beta/ops/qubit/parametric_ops_multi_qubit.py
license: Apache-2.0
---

## Module `pennylane/labs/estimator_beta/ops/qubit/parametric_ops_multi_qubit.py`

Resource operators for parametric multi qubit operations.

## `paulirot_controlled_resource_decomp`

```python
def paulirot_controlled_resource_decomp(num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for a controlled version of the :class:`~pennylane.estimator.ops.qubit.PauliRot` operator.

Args:
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): A dictionary containing the resource parameters of the target operator

Resources:

    The resources are computed based on Section VIII (Figures 3 and 4) of
    `The Bravyi-Kitaev transformation for quantum computation of electronic structure
    <https://arxiv.org/abs/1208.5986>`_, in combination with the following identities:

    When the :code:`pauli_string` is a single Pauli operator (:code:`X, Y, Z, Identity`)
    the cost is the associated controlled single qubit rotation gate: (:code:`CRX`,
    :code:`CRY`, :code:`CRZ`, controlled- :code:`GlobalPhase`).

    The resources are derived from the following identity. If an operation :math:`\hat{A}`
    can be expressed as :math:`\hat{A} \ = \ \hat{U} \cdot \hat{B} \cdot \hat{U}^{\dagger}`
    then the controlled operation :math:`C\hat{A}` can be expressed as:

    .. math:: C\hat{A} \ = \ \hat{U} \cdot C\hat{B} \cdot \hat{U}^{\dagger}

    Specifically, the resources are one multi-controlled RZ-gate and a cascade of
    :math:`2 \times (n - 1)` :code:`CNOT` gates where :math:`n` is the number of qubits
    the gate acts on. Additionally, for each :code:`X` gate in the Pauli word we conjugate by
    a pair of :code:`Hadamard` gates, and for each :code:`Y` gate in the Pauli word
    we conjugate by a pair of :code:`Hadamard` and a pair of :code:`S` gates.

    if the :code:`pauli_string` is :code:`XX`, :code:`YY` or :code:`ZZ` the cost is a multi-controlled version of the associated rotation gate
    (:code:`RX`, :code:`RY`, :code:`RZ` respectively) and 2 :code:`CNOT` gates.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.
