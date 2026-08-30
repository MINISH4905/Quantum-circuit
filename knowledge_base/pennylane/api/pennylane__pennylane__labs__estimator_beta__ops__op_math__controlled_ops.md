---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/estimator_beta/ops/op_math/controlled_ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/estimator_beta/ops/op_math/controlled_ops.py
license: Apache-2.0
---

## Module `pennylane/labs/estimator_beta/ops/op_math/controlled_ops.py`

Resource operators for controlled operations

## `ch_resource_decomp`

```python
def ch_resource_decomp() -> list[GateCount | Allocate | Deallocate]
```

Returns a list of :class:`~.pennylane.estimator.resource_operator.GateCount` objects representing the resources of the :class:`~.pennylane.estimator.ops.op_math.controlled_ops.CH` operator.

Resources:
    The resources are derived from the following identities:

    .. math::

        \begin{align}
            \hat{H} &= \hat{R}_{y}(\frac{\pi}{4}) \cdot \hat{Z}  \cdot \hat{R}_{y}(\frac{-\pi}{4}), \\
            \hat{Z} &= \hat{H} \cdot \hat{X}  \cdot \hat{H}.
        \end{align}

    Specifically, the resources are defined as two ``RY``, two ``Hadamard`` and one ``CNOT`` gates.

    Decomposing the :math:`\hat{R}_y(\pm\frac{\pi}{4})` rotations into the Clifford+T basis and substituting yields:

    .. math::

        \begin{align}
            \hat{H} &= (S H T H S^\dagger) \cdot \hat{Z} \cdot (S H T^\dagger H S^\dagger) \\
                    &= S H T \cdot (\hat{H} \hat{Z} \hat{H}) \cdot T^\dagger H S^\dagger \\
                    &= S H T \cdot \hat{X} \cdot T^\dagger H S^\dagger
        \end{align}

    The final resources are: 2 ``Hadamard``, 1 ``T``, 1 ``Adjoint(T)``,
    1 ``S``, 1 ``Adjoint(S)``, and 1 ``CNOT``.

Returns:
    list[:class:`~.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `ch_toffoli_based_resource_decomp`

```python
def ch_toffoli_based_resource_decomp() -> list[GateCount | Allocate | Deallocate]
```

Returns a list representing the resources of the :class:`~.estimator.ops.op_math.controlled_ops.CH` operator.

.. note::

    This operation assumes a :doc:`catalytic T state <demo:demos/tutorial_magic_state_distillation>` is available.
    Users should ensure the cost of constructing such a state has been accounted for.

Resources:
    The resources are derived from Figure 17 in `arXiv:2011.03494 <https://arxiv.org/pdf/2011.03494>`_.

Returns:
    list[:class:`~.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `mcx_many_clean_aux_resource_decomp`

```python
def mcx_many_clean_aux_resource_decomp(num_ctrl_wires: int, num_zero_ctrl: int) -> list[GateCount | Allocate | Deallocate]
```

Returns a list representing the resources of the operator.

Args:
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in the :math:`|0\rangle` state

Resources:
    The resources are obtained based on the unary iteration technique described in
    `Babbush et al. (2018) <https://arxiv.org/pdf/1805.03662>`_. Specifically, the
    resources are defined as the following rules:

    * If there are no control qubits, treat the operation as a :class:`~.pennylane.estimator.ops.X` gate.

    * If there is only one control qubit, treat the resources as a :class:`~.pennylane.estimator.ops.CNOT` gate.

    * If there are two control qubits, treat the resources as a :class:`~.pennylane.estimator.ops.Toffoli` gate.

    * If there are three or more control qubits (:math:`n`), the resources are obtained based on the unary
      iteration technique described in `Babbush et al. (2018) <https://arxiv.org/pdf/1805.03662>`_.
      Specifically, it requires :math:`n - 2` clean qubits, and produces :math:`n - 2` pairs of elbow gates and
      a single :class:`~.pennylane.estimator.ops.Toffoli`.

Returns:
    list[:class:`~.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `mcx_one_clean_aux_resource_decomp`

```python
def mcx_one_clean_aux_resource_decomp(num_ctrl_wires: int, num_zero_ctrl: int) -> list[GateCount | Allocate | Deallocate]
```

Returns a list representing the resources of the operator.

Args:
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in the :math:`|0\rangle` state

Resources:
    The resources are obtained based on the unary iteration technique described in
    `Khattar and Gidney, (2024) <https://arxiv.org/abs/2407.17966>`_. Specifically, the
    resources are defined as the following rules:

    * If there are no control qubits, treat the operation as a :class:`~.pennylane.estimator.ops.X` gate.

    * If there is only one control qubit, treat the resources as a :class:`~.pennylane.estimator.ops.CNOT` gate.

    * If there are two control qubits, treat the resources as a :class:`~.pennylane.estimator.ops.Toffoli` gate.

    * If there are three or more control qubits (:math:`n`), the resources are obtained based on the conditionally clean technique described in `Khattar and Gidney, (2024) <https://arxiv.org/abs/2407.17966>`_. Specifically, it requires :math:`1` clean qubit, and produces :math:`2n - 3` :class:`~.pennylane.estimator.ops.Toffoli` gates.

Returns:
    list[:class:`~.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `mcx_one_dirty_aux_resource_decomp`

```python
def mcx_one_dirty_aux_resource_decomp(num_ctrl_wires: int, num_zero_ctrl: int) -> list[GateCount | Allocate | Deallocate]
```

Returns a list representing the resources of the operator.

Args:
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in the :math:`|0\rangle` state

Resources:
    The resources are obtained based on the unary iteration technique described in
    `Khattar and Gidney, (2024) <https://arxiv.org/abs/2407.17966>`_. Specifically, the
    resources are defined as the following rules:

    * If there are no control qubits, treat the operation as a :class:`~.pennylane.estimator.ops.X` gate.

    * If there is only one control qubit, treat the resources as a :class:`~.pennylane.estimator.ops.CNOT` gate.

    * If there are two control qubits, treat the resources as a :class:`~.pennylane.estimator.ops.Toffoli` gate.

    * If there are three or more control qubits (:math:`n`), the resources are obtained based on the conditionally clean technique described in `Khattar and Gidney, (2024) <https://arxiv.org/abs/2407.17966>`_. Specifically, it requires :math:`1` dirty qubit, and produces :math:`4n - 8` :class:`~.pennylane.estimator.ops.Toffoli` gates.

Returns:
    list[:class:`~.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.
