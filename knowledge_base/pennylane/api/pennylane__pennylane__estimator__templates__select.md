---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/templates/select.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/templates/select.py
license: Apache-2.0
---

## Module `pennylane/estimator/templates/select.py`

Resource operators for select templates.

## `SelectTHC`

```python
class SelectTHC(ResourceOperator)
```

Resource class for creating the custom ``Select`` operator for tensor hypercontracted (THC)
Hamiltonian.

.. note::

        This decomposition assumes that an appropriately sized phase gradient state is available.
        Users should ensure that the cost of constructing this state has been accounted for.
        See also :class:`~.pennylane.estimator.templates.subroutines.PhaseGradient`.

Args:
    thc_ham (:class:`~pennylane.estimator.compact_hamiltonian.THCHamiltonian`): A tensor hypercontracted
        Hamiltonian on which this ``Select`` operator is being applied.
    num_batches (int): The number of batches for loading Givens rotation angles
        into temporary quantum registers. Must be less than the number of orbitals in ``thc_ham``.
        The default value of ``1`` loads all angles in one batch.
    rotation_precision (int): The number of bits used to represent the precision for loading
        the rotation angles for basis rotation. The default value is set to ``15`` bits.
    select_swap_depth (int | None): A parameter of :class:`~.pennylane.estimator.templates.subroutines.QROM`
        used to trade off extra wires for reduced circuit depth. Defaults to :code:`None`, in which
        case, the ``select_swap_depth`` is set to the optimal depth that minimizes the total
        ``T``-gate count.
    wires (WiresLike | None): the wires on which the operator acts

Raises:
    TypeError: If ``thc_ham`` is not a :class:`~pennylane.estimator.compact_hamiltonian.THCHamiltonian`.
    TypeError: If ``rotation_precision`` is not a positive integer.
    ValueError: If ``num_batches`` is not a positive integer or is greater than or equal
        to the number of orbitals in ``thc_ham``.
    ValueError: If the number of provided ``wires`` does not match the calculated
        ``num_wires`` required for the operation.

Resources:
    The resources are calculated based on Figure 5 in `arXiv:2011.03494 <https://arxiv.org/abs/2011.03494>`_ and
    Figure 4 in `arXiv:2501.06165 <https://arxiv.org/abs/2501.06165>`_.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> thc_ham = qre.THCHamiltonian(num_orbitals=20, tensor_rank=40)
>>> res = qre.estimate(qre.SelectTHC(thc_ham, rotation_precision=15))
>>> print(res)
--- Resources: ---
 Total wires: 356
   algorithmic wires: 58
   allocated wires: 298
     zero state: 298
     any state: 0
 Total gates : 3.336E+4
   'Toffoli': 2.249E+3,
   'CNOT': 2.344E+4,
   'X': 392,
   'Z': 41,
   'S': 80,
   'Hadamard': 7.160E+3

Let's also see how the resources change when more batches are used for the rotations:

>>> res = qre.estimate(qre.SelectTHC(thc_ham, num_batches=2, rotation_precision=15))
>>> print(res)
--- Resources: ---
 Total wires: 221
   algorithmic wires: 58
   allocated wires: 163
     zero state: 163
     any state: 0
 Total gates : 3.461E+4
   'Toffoli': 2.345E+3,
   'CNOT': 2.438E+4,
   'X': 582,
   'Z': 45,
   'S': 80,
   'Hadamard': 7.178E+3

We can see that by batching the rotations, the number of allocated wires decreases
at the cost of an increased number of Toffoli gates.

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * thc_ham (:class:`~.pennylane.estimator.compact_hamiltonian.THCHamiltonian`): a tensor hypercontracted
          Hamiltonian on which this ``Select`` operator is being applied
        * num_batches (int): The number of batches for loading Givens rotation angles
          into temporary quantum registers. Must be less than the number of orbitals in ``thc_ham``.
          The default value of ``1`` loads all angles in one batch.
        * rotation_precision (int): The number of bits used to represent the precision for loading
          the rotation angles for basis rotation. The default value is set to ``15`` bits.
        * select_swap_depth (int | None): A parameter of :class:`~.pennylane.estimator.templates.subroutines.QROM`
          used to trade off extra wires for reduced circuit depth. Defaults to :code:`None`, in which
          case, the ``select_swap_depth`` is set to the optimal depth that minimizes the total
          ``T``-gate count.

### `resource_rep`

```python
def resource_rep(cls, thc_ham: THCHamiltonian, num_batches: int=1, rotation_precision: int=15, select_swap_depth: int | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    thc_ham (:class:`~pennylane.estimator.compact_hamiltonian.THCHamiltonian`): A tensor hypercontracted
        Hamiltonian on which this ``Select`` operator is being applied.
    num_batches (int): The number of batches for loading Givens rotation angles
        into temporary quantum registers. Must be less than the number of orbitals in ``thc_ham``.
        The default value of ``1`` loads all angles in one batch.
    rotation_precision (int): The number of bits used to represent the precision for loading
        the rotation angles for basis rotation. The default value is set to ``15`` bits.
    select_swap_depth (int | None): A parameter of :class:`~.pennylane.estimator.templates.subroutines.QROM`
        used to trade off extra wires for reduced circuit depth. Defaults to :code:`None`, in which
        case, the ``select_swap_depth`` is set to the optimal depth that minimizes the total
        ``T``-gate count.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, thc_ham: THCHamiltonian, num_batches: int=1, rotation_precision: int=15, select_swap_depth: int | None=None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a quantum gate
and the number of times it occurs in the decomposition.

.. note::

    This decomposition assumes that an appropriately sized phase gradient state is available.
    Users should ensure that the cost of constructing this state has been accounted for.
    See also :class:`~.pennylane.estimator.templates.subroutines.PhaseGradient`.

Args:
    thc_ham (:class:`~pennylane.estimator.compact_hamiltonian.THCHamiltonian`): A tensor hypercontracted
        Hamiltonian on which this ``Select`` operator is being applied.
    num_batches (int): The number of batches for loading Givens rotation angles
        into temporary quantum registers. Must be less than the number of orbitals in ``thc_ham``.
        The default value of ``1`` loads all angles in one batch.
    rotation_precision (int): The number of bits used to represent the precision for loading
        the rotation angles for basis rotation. The default value is set to ``15`` bits.
    select_swap_depth (int | None): A parameter of :class:`~.pennylane.estimator.templates.subroutines.QROM`
        used to trade off extra wires for reduced circuit depth. Defaults to :code:`None`, in which
        case, the ``select_swap_depth`` is set to the optimal depth that minimizes the total
        ``T``-gate count.

Resources:
    The resources are calculated based on Figure 5 in `arXiv:2011.03494 <https://arxiv.org/abs/2011.03494>`_ and
    Figure 4 in `arXiv:2501.06165 <https://arxiv.org/abs/2501.06165>`_.

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
    See also :class:`~.pennylane.estimator.templates.subroutines.PhaseGradient`.

Args:
    num_ctrl_wires (int): the number of wires the operation is controlled on
    num_zero_ctrl (int): the number of control wires, that are controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): A dictionary containing the resource parameters of the target operator.

Resources:
    The resources are calculated based on Figure 5 in `arXiv:2011.03494 <https://arxiv.org/abs/2011.03494>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `SelectPauli`

```python
class SelectPauli(ResourceOperator)
```

Resource class for the ``Select`` operation used with a Hamiltonian expressed as a linear
combination of unitaries (LCU) where each unitary is a Pauli word.

Args:
    pauli_ham (:class:`~pennylane.estimator.compact_hamiltonian.PauliHamiltonian`): A Hamiltonian
        expressed as a linear combination of Pauli words, over which ``Select`` is applied.
    wires (WiresLike | None): the wires the operation acts on

Resources:
    The resources are based on the analysis in `Babbush et al. (2018) <https://arxiv.org/pdf/1805.03662>`_, Section III.A,
    'Unary Iteration and Indexed Operations', and Figures 4, 6, and 7.

    Note: This implementation assumes we have access to :math:`n - 1` additional auxiliary qubits,
    where :math:`n = \left\lceil log_{2}(N) \right\rceil` and :math:`N` is the number of batches of unitaries
    to select.

Raises:
    TypeError: If the input ``pauli_ham`` isn't an instance of
        :class:`~pennylane.estimator.compact_hamiltonian.PauliHamiltonian`.
    ValueError: if the wires provided don't match the number of wires expected by the operator

.. seealso:: :class:`~.pennylane.Select`

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> pauli_ham = qre.PauliHamiltonian(num_qubits=4, pauli_terms={"XY": 1, "Z": 2})
>>> select_pauli = qre.SelectPauli(pauli_ham)
>>> print(qre.estimate(select_pauli))
--- Resources: ---
 Total wires: 7
   algorithmic wires: 6
   allocated wires: 1
     zero state: 1
     any state: 0
 Total gates : 27
   'Toffoli': 2,
   'CNOT': 8,
   'X': 4,
   'Z': 1,
   'S': 2,
   'Hadamard': 10

### `resource_decomp`

```python
def resource_decomp(cls, pauli_ham: PauliHamiltonian) -> list[GateCount]
```

The resources for a select implementation taking advantage of the unary iterator trick.

Args:
    pauli_ham (:class:`~pennylane.estimator.compact_hamiltonian.PauliHamiltonian`): A Hamiltonian
        expressed as a linear combination of Pauli words, over which ``Select`` is applied.

Resources:
    The resources are based on the analysis in `Babbush et al. (2018) <https://arxiv.org/pdf/1805.03662>`_, Section III.A,
    'Unary Iteration and Indexed Operations', and Figures 4, 6, and 7.

    Note: This implementation assumes we have access to :math:`n - 1` additional auxiliary qubits,
    where :math:`n = \left\lceil log_{2}(N) \right\rceil` and :math:`N` is the number of batches of unitaries
    to select.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
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
    Because each target operation is self-adjoint, the resources of the adjoint operation are
    the same as the original operation (up to some re-ordering of the application of the gates).

Returns:
    list[:class:`~.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
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

Resources:
    The resources are based on the analysis in `Babbush et al. (2018) <https://arxiv.org/pdf/1805.03662>`_, Section III.A,
    'Unary Iteration and Indexed Operations'. See Figures 4, 6, and 7. This presents the cost of
    a single qubit controlled ``Select`` operator. In the case of multiple control wires, we use one
    additional auxiliary qubit and two multi-controlled ``X`` gates.

    Note: This implementation assumes we have access to :math:`n` additional auxiliary qubits,
    where :math:`n = \left\lceil log_{2}(N) \right\rceil` and :math:`N` is the number of batches of unitaries
    to select.

Returns:
    list[:class:`~.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * pauli_ham (:class:`~pennylane.estimator.compact_hamiltonian.PauliHamiltonian`): A
          Hamiltonian expressed as a linear combination of Pauli words, over which ``Select``
          is applied.

### `resource_rep`

```python
def resource_rep(cls, pauli_ham: PauliHamiltonian) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    pauli_ham (:class:`~pennylane.estimator.compact_hamiltonian.PauliHamiltonian`): A Hamiltonian
        expressed as a linear combination of Pauli words, over which ``Select`` is applied.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation
