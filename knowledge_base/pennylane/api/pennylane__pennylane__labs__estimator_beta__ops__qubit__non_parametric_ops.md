---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/estimator_beta/ops/qubit/non_parametric_ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/estimator_beta/ops/qubit/non_parametric_ops.py
license: Apache-2.0
---

## Module `pennylane/labs/estimator_beta/ops/qubit/non_parametric_ops.py`

Resource operators for non parametric single qubit operations.

## `hadamard_controlled_resource_decomp`

```python
def hadamard_controlled_resource_decomp(num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict | None=None) -> list[GateCount | qre.Allocate | qre.Deallocate]
```

Returns a list representing the resources for a controlled version of the :class:`~.pennylane.estimator.ops.qubit.non_parametric_ops.Hadamard` operator.

Args:
    num_ctrl_wires (int): the number of qubits the
        operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are
        controlled when in the :math:`|0\rangle` state
    target_resource_params (dict | None): A dictionary containing the resource parameters
        of the target operator.

Resources:
    For a single control wire, the cost is a single instance of ``CH``.
    Two additional ``X`` gates are used to flip the control qubit if it is zero-controlled.
    In the case where multiple controlled wires are provided, the resources are derived from
    the following identities:

    .. math::

        \begin{align}
            \hat{H} &= \hat{R}_{y}(\frac{\pi}{4}) \cdot \hat{Z}  \cdot \hat{R}_{y}(\frac{-\pi}{4}), \\
            \hat{Z} &= \hat{H} \cdot \hat{X}  \cdot \hat{H}.
        \end{align}

    Specifically, the resources are given by two ``RY`` gates, two
    ``Hadamard`` gates and a ``X`` gate. By replacing the
    ``X`` gate with ``MultiControlledX`` gate, we obtain a
    controlled-version of this identity.

    Decomposing the :math:`\hat{R}_y(\pm\frac{\pi}{4})` rotations into the Clifford+T basis and substituting yields:

    .. math::

        \begin{align}
            \hat{H} &= (S H T H S^\dagger) \cdot \hat{Z} \cdot (S H T^\dagger H S^\dagger) \\
                    &= S H T \cdot (\hat{H} \hat{Z} \hat{H}) \cdot T^\dagger H S^\dagger \\
                    &= S H T \cdot \hat{X} \cdot T^\dagger H S^\dagger
        \end{align}

    The final resources are: 2 ``Hadamard``, 1 ``T``, 1 ``Adjoint(T)``,
    1 ``S``, 1 ``Adjoint(S)``, and 1 ``MultiControlledX`` controlled on ``num_ctrl_wires``.


Returns:
    list[:class:`~.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `hadamard_toffoli_based_controlled_decomp`

```python
def hadamard_toffoli_based_controlled_decomp(num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict | None=None) -> list[GateCount | qre.Allocate | qre.Deallocate]
```

Returns a list representing the resources for a controlled version of the :class:`~.pennylane.estimator.ops.qubit.non_parametric_ops.Hadamard` operator.

.. note::

    This operation assumes a :doc:`catalytic T state <demo:demos/tutorial_magic_state_distillation>` is available.
    Users should ensure the cost of constructing such a state has been accounted for.

Args:
    num_ctrl_wires (int): the number of qubits the
        operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are
        controlled when in the :math:`|0\rangle` state
    target_resource_params (dict | None): A dictionary containing the resource parameters
        of the target operator.

Resources:
    The resources are derived from Figure 17 in `arXiv:2011.03494 <https://arxiv.org/pdf/2011.03494>`_.

Returns:
    list[:class:`~.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.
