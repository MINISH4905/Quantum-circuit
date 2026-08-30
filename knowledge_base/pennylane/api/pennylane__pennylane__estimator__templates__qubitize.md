---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/templates/qubitize.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/templates/qubitize.py
license: Apache-2.0
---

## Module `pennylane/estimator/templates/qubitize.py`

Resource operators for PennyLane subroutine templates.

## `QubitizeTHC`

```python
class QubitizeTHC(ResourceOperator)
```

Resource class for qubitization of tensor hypercontracted Hamiltonian.

.. note::

        This decomposition assumes that an appropriately sized phase gradient state is available.
        Users should ensure that the cost of constructing this state has been accounted for.
        See also :class:`~.pennylane.estimator.templates.PhaseGradient`.

Args:
    thc_ham (:class:`~.pennylane.estimator.compact_hamiltonian.THCHamiltonian`): A tensor hypercontracted
        Hamiltonian for which the walk operator is being created.
    prep_op (:class:`~.pennylane.estimator.resource_operator.ResourceOperator` | None): An optional
        resource operator, corresponding to the prepare routine. If :code:`None`, the
        default :class:`~.pennylane.estimator.templates.stateprep.PrepTHC` will be used.
    select_op (:class:`~.pennylane.estimator.resource_operator.ResourceOperator` | None): An optional
        resource operator, corresponding to the select routine. If :code:`None`, the
        default :class:`~.pennylane.estimator.templates.select.SelectTHC` will be used.
    coeff_precision (int | None): The number of bits used to represent the precision for loading
        the coefficients of Hamiltonian.
    rotation_precision (int | None): The number of bits used to represent the precision for loading
        the rotation angles for :code:`select_op`.
    wires (WiresLike | None): the wires on which the operator acts

Resources:
    The resources are calculated based on `arXiv:2011.03494 <https://arxiv.org/abs/2011.03494>`_

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> thc_ham = qre.THCHamiltonian(num_orbitals=20, tensor_rank=40)
>>> prep = qre.PrepTHC(thc_ham, coeff_precision=20, select_swap_depth=2)
>>> res = qre.estimate(qre.QubitizeTHC(thc_ham, prep_op=prep))
>>> print(res)
--- Resources: ---
 Total wires: 400
   algorithmic wires: 102
   allocated wires: 298
     zero state: 298
     any state: 0
 Total gates : 5.617E+4
   'Toffoli': 3.501E+3,
   'CNOT': 4.031E+4,
   'X': 2.231E+3,
   'Z': 41,
   'S': 80,
   'Hadamard': 1.001E+4

.. details::
    :title: Usage Details

    **Precision Precedence**

    The :code:`coeff_precision` and :code:`rotation_precision` arguments are used to determine
    the number of bits for loading the coefficients and the rotation angles, respectively.
    The final value is determined by the following precedence:

    * If provided, the values from :code:`coeff_precision` and :code:`rotation_precision` are used.
    * If :code:`coeff_precision` or :code:`rotation_precision` are not provided or are set to `None`,
      the precisions from :code:`prep_op` and :code:`select_op` take precedence.
    * If both of the above are not specified, the default value of ``15`` bits is used.

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * thc_ham (:class:`~pennylane.estimator.compact_hamiltonian.THCHamiltonian`): A tensor hypercontracted
          Hamiltonian for which the walk operator is being created.
        * prep_op (:class:`~pennylane.estimator.resource_operator.CompressedResourceOp` | None): An optional compressed
          resource operator, corresponding to the prepare routine. If :code:`None`, the
          default :class:`~.pennylane.estimator.templates.PrepTHC` will be used.
        * select_op (:class:`~pennylane.estimator.resource_operator.CompressedResourceOp` | None): An optional compressed
          resource operator, corresponding to the select routine. If :code:`None`, the
          default :class:`~.pennylane.estimator.templates.SelectTHC` will be used.
        * coeff_precision (int | None): The number of bits used to represent the precision for loading
          the coefficients of Hamiltonian.
        * rotation_precision (int | None): The number of bits used to represent the precision for loading
          the rotation angles.

### `resource_rep`

```python
def resource_rep(cls, thc_ham: THCHamiltonian, prep_op: CompressedResourceOp | None=None, select_op: CompressedResourceOp | None=None, coeff_precision: int | None=None, rotation_precision: int | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    thc_ham (:class:`~pennylane.estimator.compact_hamiltonian.THCHamiltonian`): A tensor hypercontracted
        Hamiltonian for which the walk operator is being created.
    prep_op (:class:`~pennylane.estimator.resource_operator.CompressedResourceOp` | None): An optional compressed
        resource operator, corresponding to the prepare routine. If :code:`None`, the
        default :class:`~.pennylane.estimator.tempaltes.PrepTHC` will be used.
    select_op (:class:`~pennylane.estimator.resource_operator.CompressedResourceOp` | None): An optional compressed
        resource operator, corresponding to the select routine. If :code:`None`, the
        default :class:`~.pennylane.estimator.templates.SelectTHC` will be used.
    coeff_precision (int | None): The number of bits used to represent the precision for loading
        the coefficients of Hamiltonian.
    rotation_precision (int | None): The number of bits used to represent the precision for loading
        the rotation angles.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, thc_ham: THCHamiltonian, prep_op: CompressedResourceOp | None=None, select_op: CompressedResourceOp | None=None, coeff_precision: int | None=None, rotation_precision: int | None=None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a quantum gate
and the number of times it occurs in the decomposition.

.. note::

    This decomposition assumes that an appropriately sized phase gradient state is available.
    Users should ensure that the cost of constructing this state has been accounted for.
    See also :class:`~.pennylane.estimator.templates.PhaseGradient`.

Args:
    thc_ham (:class:`~pennylane.estimator.compact_hamiltonian.THCHamiltonian`): a tensor hypercontracted
        Hamiltonian for which the walk operator is being created
    prep_op (:class:`~pennylane.estimator.resource_operator.CompressedResourceOp` | None): An optional compressed
        resource operator, corresponding to the prepare routine. If :code:`None`, the
        default :class:`~.pennylane.estimator.templates.PrepTHC` will be used.
    select_op (:class:`~pennylane.estimator.resource_operator.CompressedResourceOp` | None): An optional compressed
        resource operator, corresponding to the select routine. If :code:`None`, the
        default :class:`~.pennylane.estimator.templates.SelectTHC` will be used.
    coeff_precision (int | None): The number of bits used to represent the precision for loading
        the coefficients of Hamiltonian.
    rotation_precision (int | None): The number of bits used to represent the precision for loading
        the rotation angles for basis rotation.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources for the controlled version of the operator.

.. note::

    This decomposition assumes that an appropriately sized phase gradient state is available.
    Users should ensure that the cost of constructing this state has been accounted for.
    See also :class:`~.pennylane.estimator.templates.PhaseGradient`.

Args:
    num_ctrl_wires (int): the number of wires the operation is controlled on
    num_zero_ctrl (int): the number of control wires, that are controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): A dictionary containing the resource params of the target operator.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.
