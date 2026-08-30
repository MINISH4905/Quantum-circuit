---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/estimator_beta/templates/state_prep.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/estimator_beta/templates/state_prep.py
license: Apache-2.0
---

## Module `pennylane/labs/estimator_beta/templates/state_prep.py`

This module contains resource operators for state preparation templates.

## `LabsMottonenStatePreparation`

```python
class LabsMottonenStatePreparation(ResourceOperator)
```

Resource class for Mottonen state preparation.

Args:
    num_wires (int): the number of wires the operation acts on
    wires (WiresLike | None): the wires the operation acts on

Resources:
    Resources are described in `Mottonen et al. (2008) <https://arxiv.org/pdf/quant-ph/0407010>`_.
    The resources are defined as :math:`2^{n+2} - 5` :class:`~.pennylane.estimator.ops.qubit.RZ` gates and
    :math:`2^{n+2} - 4n - 4` :class:`~.pennylane.estimator.ops.op_math.CNOT` gates.

**Example**

The resources for this operation are computed using:

>>> import pennylane.labs.estimator_beta as qre
>>> mottonen_state = qre.MottonenStatePreparation(10)
>>> gate_set = {"RZ", "CNOT"}
>>> print(qre.estimate(mottonen_state, gate_set=gate_set))
--- Resources: ---
 Total wires: 10
   algorithmic wires: 10
   allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 1.841E+5
   'RZ': 4.091E+3,
   'CNOT': 4.052E+3

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_wires (int): the number of wires that the operation acts on

### `resource_rep`

```python
def resource_rep(cls, num_wires: int) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, num_wires: int)
```

Returns a list representing the resources of the operator. Each object in the list represents a gate and the
number of times it occurs in the circuit.

Args:
    num_wires (int): the number of wires that the operation acts on

Resources:
    Resources are described in `Mottonen et al. (2008) <https://arxiv.org/pdf/quant-ph/0407010>`_.
    The resources are defined as :math:`2^{n+2} - 5` :class:`~.pennylane.estimator.ops.qubit.RZ` gates and
    :math:`2^{n+2} - 4n - 4` :class:`~.pennylane.estimator.ops.op_math.CNOT` gates.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `LabsCosineWindow`

```python
class LabsCosineWindow(ResourceOperator)
```

Resource class for preparing an initial state with a cosine wave function.

The wave function is defined below where :math:`m` is the number of wires.

.. math::

    |\psi\rangle = \sqrt{2^{1-m}} \sum_{k=0}^{2^m-1} \cos(\frac{\pi k}{2^m} - \frac{\pi}{2}) |k\rangle,

.. note::

    The wave function is shifted by :math:`\frac{\pi}{2}` units so that the window is centered.

Args:
    num_wires (int): the number of wires the operation acts on
    wires (WiresLike | None): the wires the operation acts on

Resources:
    The resources were obtained from Figure 6 in `arXiv:2110.09590 <https://arxiv.org/pdf/2110.09590>`_.

.. seealso:: :class:`~.CosineWindow`

**Example**

The resources for this operation are computed using:

>>> import pennylane.labs.estimator_beta as qre
>>> cosine_state = qre.CosineWindow(5)
>>> print(qre.estimate(cosine_state))
--- Resources: ---
 Total wires: 5
   algorithmic wires: 5
   allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 1.616E+3
   'T': 1.584E+3,
   'CNOT': 26,
   'Hadamard': 6

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_wires (int): the number of wires that the operation acts on

### `resource_rep`

```python
def resource_rep(cls, num_wires: int) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, num_wires: int)
```

Returns a list representing the resources of the operator. Each object in the list represents a gate and the
number of times it occurs in the circuit.

Args:
    num_wires (int): the number of wires that the operation acts on

Resources:
    The resources were obtained from Figure 6 in `arXiv:2110.09590 <https://arxiv.org/pdf/2110.09590>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `LabsSumOfSlatersPrep`

```python
class LabsSumOfSlatersPrep(ResourceOperator)
```

Resource class for preparing an initial state with the sum-of-Slaters technique.

The operation prepares an arbitrary state

.. math::

    |\psi\rangle = \sum_{l \in L} c_l |l \rangle

Args:
    num_coeffs (int): number of coefficients of the sparse state to prepare.
    num_wires (int): number of wires on which the state is being prepared.
    num_bits (int | None): number of bits that is sufficient to uniquely identify every Slater determinant in the
        target state, as defined in Sec. III A of `Fomichev et al., PRX Quantum 5, 040339 <https://doi.org/10.1103/PRXQuantum.5.040339>`__.
    stateprep_op (ResourceOperator | None): An optional argument to set the subroutine used to perform the condensed state preparation. If :code:`None`
        is provided, the resources will be computed assuming the condensed state preparation is performed using
        :class:`~.pennylane.labs.estimator_beta.templates.state_prep.LabsMottonenStatePreparation`.
    select_swap_depth (int | None): A parameter of :class:`~.pennylane.labs.estimator_beta.templates.subroutines.LabsQROM` used to trade-off extra qubits for reduced circuit depth.
    wires (WiresLike | None): the wires the operation acts on

Resources:
    The resources were obtained from Sec. III A of
    `Fomichev et al., PRX Quantum 5, 040339 <https://doi.org/10.1103/PRXQuantum.5.040339>`__.

.. seealso:: :class:`~.SumOfSlatersPrep`

**Example**

The resources for this operation are computed using:

>>> import pennylane.labs.estimator_beta as qre
>>> sos_state = qre.SumOfSlatersPrep(num_coeffs=100, num_wires=10)
>>> print(qre.estimate(sos_state))
--- Resources: ---
 Total wires: 32
   algorithmic wires: 10
   allocated wires: 22
     zero state: 22
     any state: 0
 Total gates : 2.909E+4
   'Toffoli': 949,
   'T': 2.231E+4,
   'CNOT': 2.204E+3,
   'X': 1.107E+3,
   'Hadamard': 2.520E+3

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_coeffs(int): number of coefficients of the sparse state to prepare
        * num_wires (int): the number of wires that the state is being prepared on
        * num_bits (int | None): number of bits that is sufficient to uniquely identify
          every Slater determinant in the target state, as defined in Sec. III A of
          `Fomichev et al., PRX Quantum 5, 040339 <https://doi.org/10.1103/PRXQuantum.5.040339>`__.
        * stateprep_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp` | None): An optional argument to
          set the subroutine used to perform the condensed state preparation. If :code:`None` is provided, the resources will be computed
          assuming the condensed state preparation is performed using :class:`~.pennylane.labs.estimator_beta.templates.state_prep.LabsMottonenStatePreparation`.
        * select_swap_depth (int | None): A parameter of :class:`~.pennylane.estimator.templates.subroutines.QROM` used to trade-off extra qubits for reduced circuit depth.

### `resource_rep`

```python
def resource_rep(cls, num_coeffs: int, num_wires: int, num_bits: int | None=None, stateprep_cmpr_op: CompressedResourceOp | None=None, select_swap_depth: int | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, num_coeffs: int, num_wires: int, num_bits: int | None=None, stateprep_cmpr_op: CompressedResourceOp | None=None, select_swap_depth: int | None=None)
```

Returns a list representing the resources of the operator. Each object in the list represents a gate and the
number of times it occurs in the circuit.

Args:
    num_coeffs(int): number of coefficients of the sparse state to prepare
    num_wires (int): the number of wires the state is being prepared on
    num_bits (int | None): number of bits that is sufficient to uniquely identify every
        Slater determinant in the target state, as defined in Sec. III A of
        `Fomichev et al., PRX Quantum 5, 040339 <https://doi.org/10.1103/PRXQuantum.5.040339>`__.
    stateprep_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp` | None): An optional argument to set the subroutine used to
        perform the condensed state preparation. If :code:`None`
        is provided, the resources will be computed assuming the condensed state preparation is performed
        using :class:`~.pennylane.labs.estimator_beta.templates.state_prep.LabsMottonenStatePreparation`.
    select_swap_depth (int | None): A parameter of :class:`~.pennylane.labs.estimator_beta.templates.subroutines.LabsQROM` used to trade-off extra qubits for reduced circuit depth.

Resources:
    The resources were obtained from Sec. III A of
    `Fomichev et al., PRX Quantum 5, 040339 <https://doi.org/10.1103/PRXQuantum.5.040339>`__.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.
