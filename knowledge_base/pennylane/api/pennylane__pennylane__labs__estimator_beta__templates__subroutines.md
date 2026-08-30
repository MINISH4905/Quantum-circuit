---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/estimator_beta/templates/subroutines.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/estimator_beta/templates/subroutines.py
license: Apache-2.0
---

## Module `pennylane/labs/estimator_beta/templates/subroutines.py`

Resource operators for PennyLane subroutine templates.

## `selectpaulirot_controlled_resource_decomp`

```python
def selectpaulirot_controlled_resource_decomp(num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources of the controlled version of the :class:`~pennylane.estimator.templates.SelectPauliRot` operator.
Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

Resources:
    The resources are obtained from the construction scheme given in `Möttönen and Vartiainen
    (2005), Fig 7a <https://arxiv.org/abs/quant-ph/0504100>`_. Specifically, the resources
    for an :math:`n` qubit unitary are given as :math:`2^{n}` instances of the :code:`CNOT`
    gate and :math:`2^{n}` instances of the controlled single qubit rotation gate (:code:`RX`,
    :code:`RY` or :code:`RZ`) depending on the :code:`rot_axis`.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `qft_phase_grad_resource_decomp`

```python
def qft_phase_grad_resource_decomp(num_wires) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

.. note::

    This decomposition assumes an appropriately sized phase gradient state is available.
    Users should ensure the cost of constructing such a state has been accounted for.
    See also :class:`~.pennylane.estimator.templates.PhaseGradient`.

Args:
    num_wires (int): the number of qubits the operation acts upon

Resources:
    The resources are obtained as presented in the article
    `Turning Gradients into Additions into QFTs <https://algassert.com/post/1620>`_.
    Specifically, following the figure titled "8 qubit Quantum Fourier Transform with gradient shifts"

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `aqft_resource_decomp`

```python
def aqft_resource_decomp(order, num_wires) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    order (int): the maximum number of controlled phase shifts to which the operation is truncated
    num_wires (int): the number of qubits the operation acts upon

Resources:
    The resources are obtained from (Fig. 4) `arXiv:1803.04933 <https://arxiv.org/abs/1803.04933>`_
    excluding the gate cost of preparing the phase gradient state. The phased Toffoli gates and the
    classical measure-and-reset (Fig. 2) are accounted for as :code:`TemporaryAND` operations.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `select_thc_resource_decomp`

```python
def select_thc_resource_decomp(thc_ham: qre.THCHamiltonian, num_batches: int=1, rotation_precision: int=15, select_swap_depth: int | None=None) -> list[GateCount]
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

## `select_thc_controlled_resource_decomp`

```python
def select_thc_controlled_resource_decomp(num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict) -> list[GateCount]
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

## `qrom_state_preparation_resource_decomp`

```python
def qrom_state_preparation_resource_decomp(num_state_qubits: int, positive_and_real: bool, precision: float | None=None, selswap_depths=1) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    num_state_qubits (int): number of qubits required to represent the state-vector
    positive_and_real (bool): Flag that the coefficients of the statevector are all real
        and positive.
    precision (float): The precision threshold for loading in the binary representation
        of the rotation angles.
    selswap_depths (int | Iterable(int) | None): A parameter of :code:`QROM`
        used to trade-off extra qubits for reduced circuit depth.

Resources:
    The resources for QROMStatePreparation are according to the decomposition as described
    in `arXiv:0208112 <https://arxiv.org/abs/quant-ph/0208112>`_, using
    :class:`~.pennylane.labs.estimator_beta.templates.subroutines.LabsQROM` to dynamically
    load the rotation angles. Controlled-RY (and phase shifts) gates are used to apply all of
    the rotations coherently.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of
    ``GateCount`` objects, where each object represents a specific quantum gate and the
    number of times it appears in the decomposition.

## `qrom_state_preparation_phase_grad_resource_decomp`

```python
def qrom_state_preparation_phase_grad_resource_decomp(num_state_qubits: int, positive_and_real: bool, precision: float | None=None, selswap_depths=1) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

.. note::

    This decomposition assumes an appropriately sized phase gradient state is available.
    Users should ensure the cost of constructing such a state has been accounted for.
    See also :class:`~.pennylane.estimator.PhaseGradient`.

Args:
    num_state_qubits (int): number of qubits required to represent the state-vector
    positive_and_real (bool): Flag that the coefficients of the statevector are all real
        and positive.
    precision (float): The precision threshold for loading in the binary representation
        of the rotation angles.
    selswap_depths (int | Iterable(int) | None): A parameter of :code:`QROM`
        used to trade-off extra qubits for reduced circuit depth.

Resources:
    The resources for QROMStatePreparation are according to the decomposition as described
    in `arXiv:0208112 <https://arxiv.org/abs/quant-ph/0208112>`_, using
    :class:`~.pennylane.labs.estimator_beta.templates.subroutines.LabsQROM` to dynamically
    load the rotation angles. These rotations gates are implemented using an inplace
    controlled-adder operation (see Figure 4. of `arXiv:2409.07332 <https://arxiv.org/abs/2409.07332>`_)
    to phase gradient.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of
    ``GateCount`` objects, where each object represents a specific quantum gate and the
    number of times it appears in the decomposition.

## `LabsQROM`

```python
class LabsQROM(ResourceOperator)
```

Resource class for the Quantum Read-Only Memory (QROM) template.

Args:
    num_bitstrings (int): the number of bitstrings that are to be encoded
    size_bitstring (int): the length of each bitstring
    num_bit_flips (int | None): The total number of :math:`1`'s in the dataset. Defaults to
        :code:`(num_bitstrings * size_bitstring) // 2`, which is half the dataset.
    borrow_qubits (bool): Determine whether the auxiliary qubits should be borrowed (higher gate
        cost) or freshly allocated (higher qubit cost). Defaults to :code:`True`.
    select_swap_depth (int | None): A parameter :math:`\lambda` that determines
        if data will be loaded in parallel by adding more rows following Figure 1.C of
        `Low et al. (2024) <https://arxiv.org/pdf/1812.00954>`_. Can be :code:`None`,
        :code:`1` or a positive integer power of two. Defaults to ``None``, which sets the
        depth that minimizes T-gate count.
    wires (WiresLike | None): The wires the operation acts on (control and target), excluding
        any additional qubits allocated during the decomposition (e.g select-swap wires).

Resources:
    The resources for QROM are derived from Appendix A, B from `Berry et al. (2019)
    <https://arxiv.org/abs/1902.02134>`_.

    * :code:`borrow_qubits=True`: Uses the borrowed qubit decomposition from Figure 4 of Appendix A in
      `Berry et al. (2019) <https://arxiv.org/abs/1902.02134>`_.

    * :code:`borrow_qubits=False`: Uses the clean qubit decomposition from Appendix B in
      `Berry et al. (2019) <https://arxiv.org/abs/1902.02134>`_.

.. seealso::
    The associated PennyLane operation :class:`~.pennylane.QROM` and the resource operator
    :class:`~.pennylane.estimator.templates.subroutines.QROM`.

**Example**

The resources for this operation are computed using:

>>> import pennylane.labs.estimator_beta as qre
>>> qrom = qre.LabsQROM(
...     num_bitstrings=10,
...     size_bitstring=4,
... )
>>> print(qre.estimate(qrom))
--- Resources: ---
Total wires: 11
    algorithmic wires: 8
    allocated wires: 3
    zero state: 3
    any state: 0
Total gates : 86
'Toffoli': 8,
'CNOT': 36,
'X': 18,
'Hadamard': 24

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_bitstrings (int): the number of bitstrings that are to be encoded
        * size_bitstring (int): the length of each bitstring
        * num_bit_flips (int | None): The total number of :math:`1`'s in the dataset.
          Defaults to :code:`(num_bitstrings * size_bitstring) // 2`, which is half the
          dataset.
        * borrow_qubits (bool): Determine whether the auxiliary qubits should be borrowed
          (higher gate cost) or freshly allocated (higher qubit cost). Defaults to :code:`True`.
        * select_swap_depth (int | None): A parameter :math:`\lambda` that
          determines if data will be loaded in parallel by adding more rows following
          Figure 1.C of `Low et al. (2024) <https://arxiv.org/pdf/1812.00954>`_. Can be
          :code:`None`, :code:`1` or a positive integer power of two. Defaults to None,
          which sets the depth that minimizes T-gate count.

### `resource_rep`

```python
def resource_rep(cls, num_bitstrings: int, size_bitstring: int, num_bit_flips: int | None=None, borrow_qubits: bool=True, select_swap_depth: int | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    num_bitstrings (int): the number of bitstrings that are to be encoded
    size_bitstring (int): the length of each bitstring
    num_bit_flips (int | None): The total number of :math:`1`'s in the dataset. Defaults to
        :code:`(num_bitstrings * size_bitstring) // 2`, which is half the dataset.
    borrow_qubits (bool): Determine whether the auxiliary qubits should be borrowed (higher gate
        cost) or freshly allocated (higher qubit cost). Defaults to :code:`True`.
    select_swap_depth (int | None): A parameter :math:`\lambda` that determines
        if data will be loaded in parallel by adding more rows following Figure 1.C of
        `Low et al. (2024) <https://arxiv.org/pdf/1812.00954>`_. Can be :code:`None`,
        :code:`1` or a positive integer power of two. Defaults to ``None``, which sets the
        depth that minimizes T-gate count.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, num_bitstrings: int, size_bitstring: int, num_bit_flips: int | None=None, borrow_qubits: bool=True, select_swap_depth: int | None=None) -> list[GateCount]
```

Returns a list of ``GateCount`` objects representing the operator's resources.

Args:
    num_bitstrings (int): the number of bitstrings that are to be encoded
    size_bitstring (int): the length of each bitstring
    num_bit_flips (int | None): The total number of :math:`1`'s in the dataset. Defaults to
        :code:`(num_bitstrings * size_bitstring) // 2`, which is half the dataset.
    borrow_qubits (bool): Determine whether the auxiliary qubits should be borrowed (higher gate
        cost) or freshly allocated (higher qubit cost). Defaults to :code:`True`.
    select_swap_depth (int | None): A parameter :math:`\lambda` that determines
        if data will be loaded in parallel by adding more rows following Figure 1.C of
        `Low et al. (2024) <https://arxiv.org/pdf/1812.00954>`_. Can be :code:`None`,
        :code:`1` or a positive integer power of two. Defaults to ``None``, which sets the
        depth that minimizes T-gate count.

Resources:
    The resources for QROM are derived from Appendix A, B from `Berry et al. (2019)
    <https://arxiv.org/abs/1902.02134>`_.

    * :code:`borrow_qubits=True`: Uses the borrowed qubit decomposition from Figure 4 of Appendix A in
      `Berry et al. (2019) <https://arxiv.org/abs/1902.02134>`_.

    * :code:`borrow_qubits=False`: Uses the clean qubit decomposition from Appendix B in
      `Berry et al. (2019) <https://arxiv.org/abs/1902.02134>`_.

    Note: we use the unary iterator trick to implement the ``Select``. This
    implementation assumes we have access to :math:`n - 1` additional
    work qubits, where :math:`n = \left\lceil \log_{2}(N) \right\rceil` and :math:`N` is
    the number of batches of unitaries to select.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects,
    where each object represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `single_controlled_res_decomp`

```python
def single_controlled_res_decomp(cls, num_bitstrings: int, size_bitstring: int, num_bit_flips: int | None=None, select_swap_depth: int | None=None, borrow_qubits: bool=True)
```

The resource decomposition for LabsQROM controlled on a single wire.

Args:
    num_bitstrings (int): the number of bitstrings that are to be encoded
    size_bitstring (int): the length of each bitstring
    num_bit_flips (int | None): The total number of :math:`1`'s in the dataset. Defaults to
        :code:`(num_bitstrings * size_bitstring) // 2`, which is half the dataset.
    borrow_qubits (bool): Determine whether the auxiliary qubits should be borrowed (higher gate
        cost) or freshly allocated (higher qubit cost). Defaults to :code:`True`.
    select_swap_depth (int | None): A parameter :math:`\lambda` that determines
        if data will be loaded in parallel by adding more rows following Figure 1.C of
        `Low et al. (2024) <https://arxiv.org/pdf/1812.00954>`_. Can be :code:`None`,
        :code:`1` or a positive integer power of two. Defaults to ``None``, which sets the
        depth that minimizes T-gate count.

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
    target_resource_params (dict): A dictionary containing the resource parameters of the target operator.

Resources:
    The resources for QROM are derived from Appendix A, B from `Berry et al. (2019)
    <https://arxiv.org/abs/1902.02134>`_.

    * :code:`borrow_qubits=True`: Uses the borrowed qubit decomposition from Figure 4 of Appendix A in
      `Berry et al. (2019) <https://arxiv.org/abs/1902.02134>`_.

    * :code:`borrow_qubits=False`: Uses the clean qubit decomposition from Appendix B in
      `Berry et al. (2019) <https://arxiv.org/abs/1902.02134>`_.

    Note: we use the single-controlled unary iterator trick to implement the ``Select``. This
    implementation assumes we have access to :math:`n` additional work qubits,
    where :math:`n = \lceil \log_{2}(N) \rceil` and :math:`N` is the number of batches of
    unitaries to select.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `qrom_clean_auxiliary_adjoint_resource_decomp`

```python
def qrom_clean_auxiliary_adjoint_resource_decomp(cls, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources of the adjoint of the operator.

Args:
    target_resource_params(dict): A dictionary containing the resource parameters of the target operator.

Resources:
    This is an alternate decomposition for the adjoint of QROM which uses a measurement and phase
    fixup algorithm. This decomposition requires one clean auxiliary qubit. The resources are
    based on Figure 7 in Appendix C of `Berry et al. (2019) <https://arxiv.org/abs/1902.02134>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears in the decomposition.

### `qrom_dirty_auxiliary_adjoint_resource_decomp`

```python
def qrom_dirty_auxiliary_adjoint_resource_decomp(cls, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources of the adjoint of the operator.

Args:
    target_resource_params(dict): A dictionary containing the resource parameters of the target operator.

Resources:
    This is an alternate decomposition for the adjoint of QROM which uses a measurement and phase
    fixup algorithm. This decomposition requires one borrowed auxiliary qubit. The resources are
    based on Figure 7 in Appendix C of `Berry et al. (2019) <https://arxiv.org/abs/1902.02134>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears in the decomposition.

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params: dict | None=None) -> list[GateCount]
```

Returns a list representing the resources of the adjoint of the operator.

Args:
    target_resource_params(dict): A dictionary containing the resource parameters of the target operator.

Resources:
    This is an alternate decomposition for the adjoint of QROM which uses a measurement and phase
    fixup algorithm. This decomposition requires one clean auxiliary qubit. The resources are
    based on Figure 7 in Appendix C of `Berry et al. (2019) <https://arxiv.org/abs/1902.02134>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears in the decomposition.
