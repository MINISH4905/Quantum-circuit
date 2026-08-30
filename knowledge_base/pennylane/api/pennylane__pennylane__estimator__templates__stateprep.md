---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/templates/stateprep.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/templates/stateprep.py
license: Apache-2.0
---

## Module `pennylane/estimator/templates/stateprep.py`

Resource operators for state preparation templates.

## `UniformStatePrep`

```python
class UniformStatePrep(ResourceOperator)
```

Resource class for preparing a uniform superposition.

This operation prepares a uniform superposition over a given number of
basis states. The uniform superposition is defined as:

.. math::

    \frac{1}{\sqrt{l}} \sum_{i=0}^{l} |i\rangle

where :math:`l` is the number of states.

This operation uses ``Hadamard`` gates to create the uniform superposition when
the number of states is a power of two. If the number of states is not a power of two,
the amplitude amplification technique defined in
`arXiv:1805.03662 <https://arxiv.org/abs/1805.03662>`_ is used.

Args:
    num_states (int): the number of states in the uniform superposition
    wires (WiresLike | None): the wires the operation acts on

Resources:
    The resources are obtained from Figure 12 in `arXiv:1805.03662 <https://arxiv.org/abs/1805.03662>`_.
    The circuit uses amplitude amplification to prepare a uniform superposition over :math:`l`
    basis states.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> unif_state_prep = qre.UniformStatePrep(10)
>>> print(qre.estimate(unif_state_prep))
--- Resources: ---
Total wires: 5
    algorithmic wires: 4
    allocated wires: 1
    zero state: 1
    any state: 0
Total gates : 124
'Toffoli': 4,
'T': 88,
'CNOT': 4,
'X': 12,
'Hadamard': 16

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_states (int): the number of states over which the uniform superposition is being prepared

### `resource_rep`

```python
def resource_rep(cls, num_states: int) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, num_states: int) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list represents a gate and the
number of times it occurs in the circuit.

Args:
    num_states (int): the number of states over which the uniform superposition is being prepared

Resources:
    The resources are obtained from Figure 12 in `arXiv:1805.03662 <https://arxiv.org/abs/1805.03662>`_.
    The circuit uses amplitude amplification to prepare a uniform superposition over :math:`l` basis states.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of
    ``GateCount`` objects, where each object represents a specific quantum gate and the
    number of times it appears in the decomposition.

## `AliasSampling`

```python
class AliasSampling(ResourceOperator)
```

Resource class for preparing a state using coherent alias sampling.

Args:
    num_coeffs (int): the number of unique coefficients in the state
    precision (float): the precision with which the coefficients are loaded
    wires (WiresLike | None): the wires the operation acts on

Resources:
    The resources are obtained from Section III D in `arXiv:1805.03662 <https://arxiv.org/abs/1805.03662>`_.
    The circuit uses coherent alias sampling to prepare a state with the given coefficients.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> alias_sampling = qre.AliasSampling(num_coeffs=100)
>>> print(qre.estimate(alias_sampling))
--- Resources: ---
Total wires: 133
    algorithmic wires: 7
    allocated wires: 126
    zero state: 58
    any state: 68
Total gates : 3.796E+3
'Toffoli': 174,
'T': 88,
'CNOT': 2.600E+3,
'X': 398,
'Hadamard': 536

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_coeffs (int): the number of unique coefficients in the state
        * precision (float): the precision with which the coefficients are loaded

### `resource_rep`

```python
def resource_rep(cls, num_coeffs: int, precision: float | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, num_coeffs: int, precision: float | None=None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list represents a gate and the
number of times it occurs in the circuit.

Args:
    num_coeffs (int): the number of unique coefficients in the state
    precision (float): the precision with which the coefficients are loaded

Resources:
    The resources are obtained from Section III D in `arXiv:1805.03662 <https://arxiv.org/abs/1805.03662>`_.
    The circuit uses coherent alias sampling to prepare a state with the given coefficients.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of
    ``GateCount`` objects, where each object represents a specific quantum gate and the
    number of times it appears in the decomposition.

## `MPSPrep`

```python
class MPSPrep(ResourceOperator)
```

Resource class for the MPSPrep template.

The resource operation for preparing an initial state from a matrix product state (MPS)
representation.

Args:
    num_mps_matrices (int): the number of matrices in the MPS representation
    max_bond_dim (int): the bond dimension of the MPS representation
    precision (float | None): the precision used when loading the MPS matricies
    wires (WiresLike | None): the wires the operation acts on

Resources:
    The resources for MPSPrep rely on a decomposition which uses the generic
    :class:`~.pennylane.estimator.QubitUnitary`. This decomposition is based on
    the routine described in `arXiv:2310.18410 <https://arxiv.org/abs/2310.18410>`_.

.. seealso:: :class:`~.MPSPrep`

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> mps = qre.MPSPrep(num_mps_matrices=10, max_bond_dim=2**3)
>>> print(qre.estimate(mps, gate_set={"CNOT", "RZ", "RY"}))
--- Resources: ---
 Total wires: 13
    algorithmic wires: 10
    allocated wires: 3
         zero state: 3
         any state: 0
 Total gates : 2.820E+3
  'RZ': 1.258E+3,
  'RY': 788,
  'CNOT': 774

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_mps_matrices (int): the number of matrices in the MPS representation
        * max_bond_dim (int): the bond dimension of the MPS representation
        * precision (float | None): the precision used when loading the
          MPS matrices

### `resource_rep`

```python
def resource_rep(cls, num_mps_matrices: int, max_bond_dim: int, precision: float | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    num_mps_matrices (int): the number of matrices in the MPS representation
    max_bond_dim (int): the bond dimension of the MPS representation
    precision (float | None): the precision used when loading the MPS matrices

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, num_mps_matrices: int, max_bond_dim: int, precision: float | None=None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    num_mps_matrices (int): the number of matrices in the MPS representation
    max_bond_dim (int): the bond dimension of the MPS representation
    precision (float | None): the precision used when loading
        the MPS matrices

Resources:
    The resources for MPSPrep are estimated according to the decomposition, which uses the generic
    :class:`~.pennylane.estimator.QubitUnitary`. The decomposition is based on
    the routine described in `arXiv:2310.18410 <https://arxiv.org/abs/2310.18410>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of
    ``GateCount`` objects, where each object represents a specific quantum gate and the
    number of times it appears in the decomposition.

## `QROMStatePreparation`

```python
class QROMStatePreparation(ResourceOperator)
```

Resource class for the QROMStatePreparation template.

This operation implements the state preparation method described
in `arXiv:0208112 <https://arxiv.org/abs/quant-ph/0208112>`_, using
:class:`~.pennylane.estimator.QROM` to dynamically load the rotation angles.

.. note::

    This decomposition assumes an appropriately sized phase gradient state is available.
    Users should ensure the cost of constructing such a state has been accounted for.
    See also :class:`~.pennylane.pennylane.estimator.PhaseGradient`.

Args:
    num_state_qubits (int): number of qubits required to represent the statevector
    precision (float): the precision threshold for loading in the binary representation
        of the rotation angles
    positive_and_real (bool): indicates whether or not the coefficients of the statevector are all real
        and positive
    select_swap_depths (int | Iterable(int) | None): A parameter of :code:`QROM`
        used to trade-off extra qubits for reduced circuit depth.
        Can be ``None``, ``1`` or a positive integer power of two.
        Defaults to ``None``, which internally corresponds to the optimal depth.
    wires (WiresLike | None): The wires on which to prepare the target state. This excludes any
        additional qubits allocated during the decomposition (via select-swap).

Resources:
    The resources for QROMStatePreparation are computed according to the decomposition described
    in `arXiv:0208112 <https://arxiv.org/abs/quant-ph/0208112>`_, using
    :class:`~.pennylane.estimator.QROM` to dynamically load the rotation angles.
    These rotations gates are implemented using an in-place controlled-adder operation
    (see figure 4. of `arXiv:2409.07332 <https://arxiv.org/abs/2409.07332>`_) to a phase gradient state.

.. seealso:: :class:`~.QROMStatePreparation`

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> qrom_prep = qre.QROMStatePreparation(num_state_qubits=5, precision=1e-3)
>>> print(qre.estimate(qrom_prep))
--- Resources: ---
 Total wires: 28
   algorithmic wires: 5
   allocated wires: 23
     zero state: 23
     any state: 0
 Total gates : 2.505E+3
   'Toffoli': 236,
   'CNOT': 1.181E+3,
   'X': 236,
   'Z': 12,
   'S': 24,
   'Hadamard': 816

.. details::
    :title: Usage Details

    This operation uses the :code:`QROM` subroutine to dynamically load the rotation angles.

    >>> import pennylane.estimator as qre
    >>> gate_set = {"QROM", "Hadamard", "CNOT", "T", "Adjoint(QROM)"}
    >>> qrom_prep = qre.QROMStatePreparation(
    ...     num_state_qubits = 4,
    ...     precision = 1e-2,
    ...     select_swap_depths = 1,
    ... )
    >>> res = qre.estimate(qrom_prep, gate_set)
    >>> print(res)
    --- Resources: ---
     Total wires: 21
        algorithmic wires: 4
        allocated wires: 17
             zero state: 17
             any state: 0
     Total gates : 2.680E+3
      'QROM': 5,
      'Adjoint(QROM)': 5,
      'T': 1.832E+3,
      'CNOT': 580,
      'Hadamard': 258

    The ``precision`` argument is used to allocate the target wires in the underlying QROM
    operations. It corresponds to the precision with which the rotation angles of the
    template are encoded. This means that the binary representation of the angle is truncated up to
    the :math:`m`-th digit, where :math:`m` is the number of precision wires allocated. See  Eq. 5
    in `arXiv:0208112 <https://arxiv.org/abs/quant-ph/0208112>`_ for more details.

    The ``select_swap_depths`` parameter allows a user to configure the ``select_swap_depth`` of
    each individual :class:`~.pennylane.estimator.QROM` used. The
    ``select_swap_depths`` argument can be one of :code:`(int, None, Iterable(int, None))`.

    If an integer or :code:`None` is passed (the default value for this parameter is 1), then that
    is used as the ``select_swap_depth`` for all :code:`QROM` operations in the resource decomposition.

    >>> print(res.gate_breakdown())
    Adjoint(QROM) total: 5
        Adjoint(QROM) {'base_cmpr_op': CompressedResourceOp(QROM, num_wires=9, params={'num_bit_flips':4, 'num_bitstrings':1, 'restored':False, 'select_swap_depth':1, 'size_bitstring':9})}: 1
        Adjoint(QROM) {'base_cmpr_op': CompressedResourceOp(QROM, num_wires=10, params={'num_bit_flips':9, 'num_bitstrings':2, 'restored':False, 'select_swap_depth':1, 'size_bitstring':9})}: 1
        Adjoint(QROM) {'base_cmpr_op': CompressedResourceOp(QROM, num_wires=11, params={'num_bit_flips':18, 'num_bitstrings':4, 'restored':False, 'select_swap_depth':1, 'size_bitstring':9})}: 1
        Adjoint(QROM) {'base_cmpr_op': CompressedResourceOp(QROM, num_wires=12, params={'num_bit_flips':36, 'num_bitstrings':8, 'restored':False, 'select_swap_depth':1, 'size_bitstring':9})}: 1
        Adjoint(QROM) {'base_cmpr_op': CompressedResourceOp(QROM, num_wires=13, params={'num_bit_flips':72, 'num_bitstrings':16, 'restored':False, 'select_swap_depth':1, 'size_bitstring':9})}: 1
    QROM total: 5
        QROM {'num_bit_flips': 4, 'num_bitstrings': 1, 'restored': False, 'select_swap_depth': 1, 'size_bitstring': 9}: 1
        QROM {'num_bit_flips': 9, 'num_bitstrings': 2, 'restored': False, 'select_swap_depth': 1, 'size_bitstring': 9}: 1
        QROM {'num_bit_flips': 18, 'num_bitstrings': 4, 'restored': False, 'select_swap_depth': 1, 'size_bitstring': 9}: 1
        QROM {'num_bit_flips': 36, 'num_bitstrings': 8, 'restored': False, 'select_swap_depth': 1, 'size_bitstring': 9}: 1
        QROM {'num_bit_flips': 72, 'num_bitstrings': 16, 'restored': False, 'select_swap_depth': 1, 'size_bitstring': 9}: 1
    T total: 1.832E+3
    CNOT total: 580
    Hadamard total: 258

    Alternatively, we can configure each value independently by specifying a list. Note the size
    of this list should be :code:`num_state_qubits + 1` (or :code:`num_state_qubits` if the state
    is positive and real).

    >>> qrom_prep = qre.QROMStatePreparation(
    ...     num_state_qubits = 4,
    ...     precision = 1e-2,
    ...     select_swap_depths = [1, None, 1, 1, None],
    ... )
    >>> res = qre.estimate(qrom_prep, gate_set)
    >>> print(res.gate_breakdown())
    Adjoint(QROM) total: 5
        Adjoint(QROM) {'base_cmpr_op': CompressedResourceOp(QROM, num_wires=9, params={'num_bit_flips':4, 'num_bitstrings':1, 'restored':False, 'select_swap_depth':1, 'size_bitstring':9})}: 1
        Adjoint(QROM) {'base_cmpr_op': CompressedResourceOp(QROM, num_wires=10, params={'num_bit_flips':9, 'num_bitstrings':2, 'restored':False, 'select_swap_depth':None, 'size_bitstring':9})}: 1
        Adjoint(QROM) {'base_cmpr_op': CompressedResourceOp(QROM, num_wires=11, params={'num_bit_flips':18, 'num_bitstrings':4, 'restored':False, 'select_swap_depth':1, 'size_bitstring':9})}: 1
        Adjoint(QROM) {'base_cmpr_op': CompressedResourceOp(QROM, num_wires=12, params={'num_bit_flips':36, 'num_bitstrings':8, 'restored':False, 'select_swap_depth':1, 'size_bitstring':9})}: 1
        Adjoint(QROM) {'base_cmpr_op': CompressedResourceOp(QROM, num_wires=13, params={'num_bit_flips':72, 'num_bitstrings':16, 'restored':False, 'select_swap_depth':None, 'size_bitstring':9})}: 1
    QROM total: 5
        QROM {'num_bit_flips': 4, 'num_bitstrings': 1, 'restored': False, 'select_swap_depth': 1, 'size_bitstring': 9}: 1
        QROM {'num_bit_flips': 9, 'num_bitstrings': 2, 'restored': False, 'select_swap_depth': None, 'size_bitstring': 9}: 1
        QROM {'num_bit_flips': 18, 'num_bitstrings': 4, 'restored': False, 'select_swap_depth': 1, 'size_bitstring': 9}: 1
        QROM {'num_bit_flips': 36, 'num_bitstrings': 8, 'restored': False, 'select_swap_depth': 1, 'size_bitstring': 9}: 1
        QROM {'num_bit_flips': 72, 'num_bitstrings': 16, 'restored': False, 'select_swap_depth': None, 'size_bitstring': 9}: 1
    T total: 1.832E+3
    CNOT total: 580
    Hadamard total: 258

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_state_qubits (int): number of qubits required to represent the state-vector
        * precision (float): the precision threshold for loading in the binary representation
          of the rotation angles
        * positive_and_real (bool): flag that the coefficients of the statevector are all real
          and positive
        * selswap_depths (int | Iterable(int) | None): a parameter of :code:`QROM`
          used to trade-off extra qubits for reduced circuit depth

### `resource_rep`

```python
def resource_rep(cls, num_state_qubits: int, precision: float | None=None, positive_and_real: bool=False, selswap_depths=1) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    num_state_qubits (int): number of qubits required to represent the state-vector
    precision (float): the precision threshold for loading in the binary representation
        of the rotation angles
    positive_and_real (bool): flag that the coefficients of the statevector are all real
        and positive
    selswap_depths (int | Iterable(int) | None): a parameter of :code:`QROM`
        used to trade-off extra qubits for reduced circuit depth

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `controlled_ry_resource_decomp`

```python
def controlled_ry_resource_decomp(cls, num_state_qubits: int, positive_and_real: bool, precision: float | None=None, selswap_depths=1) -> list[GateCount]
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
    :class:`~.pennylane.estimator.QROM` to dynamically load the rotation angles.
    Controlled-RY (and phase shifts) gates are used to apply all of the rotations coherently.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of
    ``GateCount`` objects, where each object represents a specific quantum gate and the
    number of times it appears in the decomposition.

### `resource_decomp`

```python
def resource_decomp(cls, num_state_qubits: int, positive_and_real: bool, precision: float | None=None, selswap_depths=1) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

.. note::

    This decomposition assumes an appropriately sized phase gradient state is available.
    Users should ensure the cost of constructing such a state has been accounted for.
    See also :class:`~.pennylane.pennylane.estimator.PhaseGradient`.

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
    :class:`~.pennylane.estimator.QROM` to dynamically load the rotation angles.
    These rotations gates are implmented using an inplace controlled-adder operation
    (see figure 4. of `arXiv:2409.07332 <https://arxiv.org/abs/2409.07332>`_) to phase gradient.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of
    ``GateCount`` objects, where each object represents a specific quantum gate and the
    number of times it appears in the decomposition.

## `PrepTHC`

```python
class PrepTHC(ResourceOperator)
```

Resource class for preparing the state for tensor hypercontracted (THC) Hamiltonian.

This operator customizes the Prepare circuit based on the structure of THC Hamiltonian.

Args:
    thc_ham (:class:`~pennylane.estimator.compact_hamiltonian.THCHamiltonian`): a tensor hypercontracted
        Hamiltonian for which the state is being prepared
    coeff_precision (int): The number of bits used to represent the precision for loading
        the coefficients of Hamiltonian. The default value is set to ``15`` bits.
    select_swap_depth (int | None): A parameter of :class:`~.pennylane.estimator.templates.subroutines.QROM`
        used to trade-off extra wires for reduced circuit depth. Defaults to :code:`None`, which internally determines the optimal depth.
    wires (WiresLike | None): the wires on which the operator acts

Resources:
    The resources are calculated based on Figures 3 and 4 in `arXiv:2011.03494 <https://arxiv.org/abs/2011.03494>`_

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> thc_ham = qre.THCHamiltonian(num_orbitals=20, tensor_rank=40)
>>> res = qre.estimate(qre.PrepTHC(thc_ham, coeff_precision=15))
>>> print(res)
--- Resources: ---
 Total wires: 166
   algorithmic wires: 72
   allocated wires: 94
     zero state: 94
     any state: 0
 Total gates : 1.494E+4
   'Toffoli': 467,
   'CNOT': 1.307E+4,
   'X': 599,
   'Hadamard': 797

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * thc_ham (:class:`~.pennylane.estimator.compact_hamiltonian.THCHamiltonian`): a tensor hypercontracted
          Hamiltonian for which the state is being prepared
        * coeff_precision (int): The number of bits used to represent the precision for loading
          the coefficients of Hamiltonian. The default value is set to ``15`` bits.
        * select_swap_depth (int | None): A parameter of :class:`~.pennylane.estimator.templates.QROM`
          used to trade-off extra wires for reduced circuit depth. Defaults to :code:`None`, which internally determines the optimal depth.

### `resource_rep`

```python
def resource_rep(cls, thc_ham: THCHamiltonian, coeff_precision: int=15, select_swap_depth: int | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    thc_ham (:class:`~pennylane.estimator.compact_hamiltonian.THCHamiltonian`): a tensor hypercontracted
        Hamiltonian for which the state is being prepared
    coeff_precision (int): The number of bits used to represent the precision for loading
        the coefficients of Hamiltonian. The default value is set to ``15`` bits.
    select_swap_depth (int | None): A parameter of :class:`~.pennylane.estimator.templates.QROM`
        used to trade-off extra wires for reduced circuit depth. Defaults to :code:`None`, which internally determines the optimal depth.
Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, thc_ham: THCHamiltonian, coeff_precision: int=15, select_swap_depth: int | None=None) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object represents a quantum gate
and the number of times it occurs in the decomposition.

Args:
    thc_ham (:class:`~pennylane.estimator.compact_hamiltonian.THCHamiltonian`): a tensor hypercontracted
        Hamiltonian for which the walk operator is being created
    coeff_precision (int): The number of bits used to represent the precision for loading
        the coefficients of the Hamiltonian. The default value is set to ``15`` bits.
    select_swap_depth (int | None): A parameter of :class:`~.pennylane.estimator.templates.QROM`
        used to trade-off extra qubits for reduced circuit depth. Defaults to :code:`None`, which internally determines the optimal depth.

Resources:
    The resources are calculated based on Figures 3 and 4 in `arXiv:2011.03494 <https://arxiv.org/abs/2011.03494>`_

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources of the adjoint of the operator. Each object represents a quantum gate
and the number of times it occurs in the decomposition.

Args:
    target_resource_params(dict): A dictionary containing the resource parameters of the target operator.

Resources:
    The resources are calculated based on Figures 3 and 4 in `arXiv:2011.03494 <https://arxiv.org/abs/2011.03494>`_

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.
