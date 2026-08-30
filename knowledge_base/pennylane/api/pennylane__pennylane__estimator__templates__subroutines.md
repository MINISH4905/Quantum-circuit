---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/estimator/templates/subroutines.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/estimator/templates/subroutines.py
license: Apache-2.0
---

## Module `pennylane/estimator/templates/subroutines.py`

Resource operators for PennyLane subroutine templates.

## `OutOfPlaceSquare`

```python
class OutOfPlaceSquare(ResourceOperator)
```

Resource class for the OutofPlaceSquare gate.

Args:
    register_size (int): the size of the input register
    wires (Sequence[int], None): the wires the operation acts on

Resources:
    The resources are obtained from appendix G, lemma 7 in `PRX Quantum, 2, 040332 (2021)
    <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.040332>`_. Specifically,
    the resources are given as :math:`(n - 1)^2` Toffoli gates, and :math:`n` CNOT gates, where
    :math:`n` is the size of the input register.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> out_square = qre.OutOfPlaceSquare(register_size=3)
>>> print(qre.estimate(out_square))
--- Resources: ---
Total wires: 9
    algorithmic wires: 9
    allocated wires: 0
    zero state: 0
    any state: 0
Total gates : 7
'Toffoli': 4,
'CNOT': 3

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * register_size (int): the size of the input register

### `resource_rep`

```python
def resource_rep(cls, register_size: int)
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    register_size (int): the size of the input register

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, register_size)
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    register_size (int): the size of the input register

Resources:
    The resources are obtained from appendix G, lemma 7 in `PRX Quantum, 2, 040332 (2021)
    <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.040332>`_. Specifically,
    the resources are given as :math:`(n - 1)^2` Toffoli gates, and :math:`n` CNOT gates.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `IQP`

```python
class IQP(ResourceOperator)
```

Resource class for the Instantaneous Quantum Polynomial (IQP) template.

Args:
    num_wires (int): the number of qubits the operation acts upon
    pattern (list[list[list[int]]]): Specification of the trainable gates. Each element of gates corresponds to a
        unique trainable parameter. Each sublist specifies the generators to which that parameter applies.
        Generators are specified by listing the qubits on which an X operator acts.
    spin_sym (bool, optional): If True, the circuit is equivalent to one where the initial state
        :math:`\frac{1}{\sqrt(2)}(|00\dots0> + |11\dots1>)` is used in place of :math:`|00\dots0>`.
    wires (Sequence[int], optional): the wires the operation acts on

**Example:**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> iqp = qre.IQP(num_wires=4, pattern=[[[0]], [[1]], [[2]], [[3]]])
>>> print(qre.estimate(iqp))
--- Resources: ---
 Total wires: 4
   algorithmic wires: 4
   allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 184
   'T': 176,
   'CNOT': 0,
   'Hadamard': 8

.. seealso:: :class:`~.IQP`

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_wires (int): the number of qubits the operation acts upon

### `resource_rep`

```python
def resource_rep(cls, num_wires, pattern, spin_sym) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    num_wires (int): the number of qubits the operation acts upon
    pattern (list[list[list[int]]]): Specification of the trainable gates. Each element of gates corresponds to a
        unique trainable parameter. Each sublist specifies the generators to which that parameter applies.
        Generators are specified by listing the qubits on which an X operator acts.
    spin_sym (bool, optional): If True, the circuit is equivalent to one where the initial state
        :math:`\frac{1}{\sqrt(2)}(|00\dots0> + |11\dots1>)` is used in place of :math:`|00\dots0>`.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, num_wires, pattern, spin_sym) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    num_wires (int): the number of qubits the operation acts upon
    pattern (list[list[list[int]]]): Specification of the trainable gates. Each element of gates corresponds to a
        unique trainable parameter. Each sublist specifies the generators to which that parameter applies.
        Generators are specified by listing the qubits on which an X operator acts.
    spin_sym (bool, optional): If True, the circuit is equivalent to one where the initial state
        :math:`\frac{1}{\sqrt(2)}(|00\dots0> + |11\dots1>)` is used in place of :math:`|00\dots0>`.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `tracking_name`

```python
def tracking_name(num_wires, pattern, spin_sym) -> str
```

Returns the tracking name built with the operator's parameters.

## `SelectOnlyQRAM`

```python
class SelectOnlyQRAM(ResourceOperator)
```

Resource class for SelectOnlyQRAM.

Args:
    data (TensorLike | Sequence[str]):
        The classical memory array to retrieve values from.
    num_wires (int):
        The number of qubits the operation acts upon.
    num_control_wires (int):
        The number of ``control_wires``.
    num_select_wires (int):
        The number of ``select_wires``.
    control_wires (WiresLike, optional):
        The register that stores the index for the entry of the classical data we want to
        access.
    target_wires (WiresLike, optional):
        The register in which the classical data gets loaded. The size of this register must
        equal each bitstring length in ``bitstrings``.
    select_wires (WiresLike, optional):
        Wires used to perform the selection.
    select_value (int, optional):
        If provided, only entries whose select bits match this value are loaded.
        The ``select_value`` must be an integer in :math:`[0, 2^{\texttt{len(select_wires)}}]`,
        and cannot be used if no ``select_wires`` are provided.

Raises:
    ValueError: if the number of wires provided does not match ``num_wires``

Resources:
    The resources are obtained from the SelectOnlyQRAM implementation in PennyLane.

.. seealso:: :class:`~.SelectOnlyQRAM`

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * data (TensorLike | Sequence[str]): the classical memory array to retrieve values from
        * num_wires (int): the number of qubits the operation acts upon
        * select_value (int or None): if provided, only entries whose select bits match this value are loaded
        * num_select_wires (int): the number of ``select_wires``
        * num_control_wires (int): the number of ``control_wires``

### `resource_rep`

```python
def resource_rep(cls, data, num_wires, select_value, num_select_wires, num_control_wires)
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    data (TensorLike | Sequence[str]): the classical memory array to retrieve values from
    num_wires (int): the number of qubits the operation acts upon
    select_value (int or None): if provided, only entries whose select bits match this value are loaded
    num_select_wires (int): the number of ``select_wires``
    num_control_wires (int): the number of ``control_wires``

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, data, num_wires, num_select_wires, num_control_wires, select_value=None)
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    data (TensorLike | Sequence[str]): the classical memory array to retrieve values from
    num_wires (int): the number of qubits the operation acts upon
    select_value (int or None): if provided, only entries whose select bits match this value are loaded
    num_select_wires (int): the number of ``select_wires``
    num_control_wires (int): the number of ``control_wires``

Resources:
    The resources are obtained from the SelectOnlyQRAM implementation in PennyLane.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
        represents a specific quantum gate and the number of times it appears in the decomposition.

### `tracking_name`

```python
def tracking_name(data, num_wires, select_value, num_select_wires, num_control_wires) -> str
```

Returns the tracking name built with the operator's parameters.

## `PhaseGradient`

```python
class PhaseGradient(ResourceOperator)
```

Resource class for the PhaseGradient gate.

This operation prepares the phase gradient state
:math:`\frac{1}{\sqrt{2^b}} \cdot \sum_{k=0}^{2^b - 1} e^{-i2\pi \frac{k}{2^b}}\ket{k}`, where
:math:`b` is the number of qubits. The equation is taken from page 4 of
`C. Gidney, Quantum 2, 74, (2018) <https://quantum-journal.org/papers/q-2018-06-18-74/>`_.

Args:
    num_wires (int | None): the number of wires to prepare in the phase gradient state
    wires (Sequence[int], None): the wires the operation acts on

Resources:
    The phase gradient state is defined as an equal superposition of phase shifts where each shift
    is progressively more precise. This is achieved by applying Hadamard gates to each qubit and
    then applying Z-rotations to each qubit with progressively smaller rotation angle. The first
    three rotations can be compiled to a Z-gate, S-gate and a T-gate.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> phase_grad = qre.PhaseGradient(num_wires=5)
>>> gate_set={"Z", "S", "T", "RZ", "Hadamard"}
>>> print(qre.estimate(phase_grad, gate_set))
--- Resources: ---
Total wires: 5
    algorithmic wires: 5
    allocated wires: 0
    zero state: 0
    any state: 0
Total gates : 10
'RZ': 2,
'T': 1,
'Z': 1,
'S': 1,
'Hadamard': 5

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_wires (int): the number of qubits to prepare in the phase gradient state

### `resource_rep`

```python
def resource_rep(cls, num_wires) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    num_wires (int): the number of qubits to prepare in the phase gradient state

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, num_wires: int)
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    num_wires (int): the number of qubits to prepare in the phase gradient state

Resources:
    The resources are obtained by construction. The phase gradient state is defined as an
    equal superposition of phase shifts where each shift is progressively more precise. This
    is achieved by applying Hadamard gates to each qubit and then applying Z-rotations to each
    qubit with progressively smaller rotation angle. The first three rotations can be compiled to
    a Z-gate, S-gate and a T-gate.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `OutMultiplier`

```python
class OutMultiplier(ResourceOperator)
```

Resource class for the OutMultiplier gate.

Args:
    a_num_wires (int): the size of the first input register
    b_num_wires (int): the size of the second input register
    wires (Sequence[int], None): the wires the operation acts on

Resources:
    The resources are obtained from appendix G, lemma 10 in `PRX Quantum, 2, 040332 (2021)
    <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.040332>`_.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.OutMultiplier`.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> out_mul = qre.OutMultiplier(4, 4)
>>> print(qre.estimate(out_mul))
--- Resources: ---
Total wires: 16
    algorithmic wires: 16
    allocated wires: 0
    zero state: 0
    any state: 0
Total gates : 140
'Toffoli': 28,
'CNOT': 28,
'Hadamard': 84

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * a_num_wires (int): the size of the first input register
        * b_num_wires (int): the size of the second input register

### `resource_rep`

```python
def resource_rep(cls, a_num_wires, b_num_wires) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    a_num_wires (int): the size of the first input register
    b_num_wires (int): the size of the second input register

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, a_num_wires, b_num_wires) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    a_num_wires (int): the size of the first input register
    b_num_wires (int): the size of the second input register

Resources:
    The resources are obtained from appendix G, lemma 10 in `PRX Quantum, 2, 040332 (2021)
    <https://journals.aps.org/prxquantum/abstract/10.1103/PRXQuantum.2.040332>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `SemiAdder`

```python
class SemiAdder(ResourceOperator)
```

Resource class for the SemiAdder gate.

Args:
    max_register_size (int): the size of the larger of the two registers being added together
    wires (Sequence[int], None): the wires the operation acts on

Resources:
    The resources are obtained from figures 1 and 2 in `Gidney (2018)
    <https://quantum-journal.org/papers/q-2018-06-18-74/pdf/>`_.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.SemiAdder`.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> semi_add = qre.SemiAdder(max_register_size=4)
>>> print(qre.estimate(semi_add))
--- Resources: ---
Total wires: 11
    algorithmic wires: 8
    allocated wires: 3
    zero state: 3
    any state: 0
Total gates : 30
'Toffoli': 3,
'CNOT': 18,
'Hadamard': 9

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * max_register_size (int): the size of the larger of the two registers being added together

### `resource_rep`

```python
def resource_rep(cls, max_register_size)
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    max_register_size (int): the size of the larger of the two registers being added together

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, max_register_size: int)
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    max_register_size (int): the size of the larger of the two registers being added together

Resources:
    The resources are obtained from figures 1 and 2 in `Gidney (2018)
    <https://quantum-journal.org/papers/q-2018-06-18-74/pdf/>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict)
```

Returns a list representing the resources of the operator. Each object in the list represents a gate and the
number of times it occurs in the circuit.

Args:
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): dictionary containing the size of the larger of the two registers being added together

Resources:
    The resources are obtained from figure 4a in `Gidney (2018)
    <https://quantum-journal.org/papers/q-2018-06-18-74/pdf/>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `ControlledSequence`

```python
class ControlledSequence(ResourceOperator)
```

Resource class for the ControlledSequence gate.

This operator represents a sequence of controlled gates, one for each control wire, with the
base operator raised to decreasing powers of 2.

Args:
    base (:class:`~.pennylane.estimator.resource_operator.ResourceOperator`): The operator to repeatedly
        apply in a controlled fashion.
    num_control_wires (int): the number of controlled wires to run the sequence over
    wires (Sequence[int], None): the wires the operation acts on

Resources:
    The resources are obtained as a direct result of the definition of the operator:

    .. code-block:: bash

        0: ──╭●───────────────┤
        1: ──│────╭●──────────┤
        2: ──│────│────╭●─────┤
        t: ──╰U⁴──╰U²──╰U¹────┤

.. seealso:: The associated PennyLane operation :class:`~.pennylane.ControlledSequence`

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> ctrl_seq = qre.ControlledSequence(
...     base = qre.RX(),
...     num_control_wires = 3,
... )
>>> gate_set={"CRX"}
>>> print(qre.estimate(ctrl_seq, gate_set))
--- Resources: ---
Total wires: 4
    algorithmic wires: 4
    allocated wires: 0
    zero state: 0
    any state: 0
Total gates : 3
'CRX': 3

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * base_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
          to the operator that we will be applying controlled powers of.
        * num_ctrl_wires (int): the number of controlled wires to run the sequence over

### `resource_rep`

```python
def resource_rep(cls, base_cmpr_op: CompressedResourceOp, num_ctrl_wires: int) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    base_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
        to the operator that we will be applying controlled powers of.
    num_ctrl_wires (int): the number of controlled wires to run the sequence over

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, base_cmpr_op, num_ctrl_wires)
```

Returns a list representing the resources of the operator. Each object in the list represents a gate and the
number of times it occurs in the circuit.

Args:
    base_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
        to the operator that we will be applying controlled powers of.
    num_ctrl_wires (int): the number of controlled wires to run the sequence over

Resources:
    The resources are obtained as a direct result of the definition of the operator:

    .. code-block:: bash

        0: ──╭●───────────────┤
        1: ──│────╭●──────────┤
        2: ──│────│────╭●─────┤
        t: ──╰U⁴──╰U²──╰U¹────┤

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `QPE`

```python
class QPE(ResourceOperator)
```

Resource class for QuantumPhaseEstimation (QPE).

Args:
    base (:class:`~.pennylane.estimator.resource_operator.ResourceOperator`): the phase estimation operator
    num_estimation_wires (int): the number of wires used for measuring out the phase
    adj_qft_op (:class:`~.pennylane.estimator.resource_operator.ResourceOperator` | None): An optional
        argument to set the subroutine used to perform the adjoint QFT operation.
    wires (Sequence[int], None): the wires the operation acts on

Resources:
    The resources are obtained from the standard decomposition of QPE as presented
    in (Section 5.2) `Nielsen, M.A. and Chuang, I.L. (2011) Quantum Computation and Quantum
    Information <https://www.cambridge.org/highereducation/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE#overview>`_.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.QuantumPhaseEstimation`.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> gate_set = {"Hadamard", "Adjoint(QFT(5))", "CRX"}
>>> qpe = qre.QPE(qre.RX(precision=1e-3), 5)
>>> print(qre.estimate(qpe, gate_set))
--- Resources: ---
 Total wires: 6
    algorithmic wires: 6
    allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 11
  'CRX': 5,
  'Adjoint(QFT(5))': 1,
  'Hadamard': 5

.. details::
    :title: Usage Details

    Additionally, we can customize the implementation of the QFT operator we wish to use within
    the textbook QPE algorithm. This allows users to optimize the implementation of QPE by using
    more efficient implementations of the QFT.

    For example, consider the cost using the default :class:`~.pennylane.estimator.templates.QFT` implementation below:

    >>> import pennylane.estimator as qre
    >>> qpe = qre.QPE(qre.RX(precision=1e-3), 5, adj_qft_op=None)
    >>> print(qre.estimate(qpe))
    --- Resources: ---
     Total wires: 6
        algorithmic wires: 6
        allocated wires: 0
             zero state: 0
             any state: 0
     Total gates : 1.586E+3
      'T': 1.530E+3,
      'CNOT': 36,
      'Hadamard': 20

    Now we use the :class:`~.pennylane.estimator.templates.AQFT`:

    >>> aqft = qre.AQFT(order=3, num_wires=5)
    >>> adj_aqft = qre.Adjoint(aqft)
    >>> qpe = qre.QPE(qre.RX(precision=1e-3), 5, adj_qft_op=adj_aqft)
    >>> print(qre.estimate(qpe))
    --- Resources: ---
     Total wires: 8
        algorithmic wires: 6
         allocated wires: 2
         zero state: 2
        any state: 0
    Total gates : 321
     'Toffoli': 7,
     'T': 222,
     'CNOT': 34,
     'X': 4,
     'Z': 8,
     'S': 8,
     'Hadamard': 38

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * base_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
          to the phase estimation operator.
        * num_estimation_wires (int): the number of wires used for measuring out the phase
        * adj_qft_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp` | None]): An optional compressed
          resource operator, corresponding to the adjoint QFT routine. If :code:`None`, the
          default :class:`~.pennylane.estimator.templates.subroutines.QFT` will be used.

### `resource_rep`

```python
def resource_rep(cls, base_cmpr_op: CompressedResourceOp, num_estimation_wires: int, adj_qft_cmpr_op: CompressedResourceOp=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    base_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
        to the phase estimation operator.
    num_estimation_wires (int): the number of wires used for measuring out the phase
    adj_qft_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp` | None): An optional compressed
        resource operator, corresponding to the adjoint QFT routine. If :code:`None`, the
        default :class:`~.pennylane.estimator.templates.subroutines.QFT` will be used.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, base_cmpr_op: CompressedResourceOp, num_estimation_wires: int, adj_qft_cmpr_op: CompressedResourceOp | None=None)
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    base_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
        to the phase estimation operator.
    num_estimation_wires (int): the number of wires used for measuring out the phase
    adj_qft_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp` | None): An optional compressed
        resource operator, corresponding to the adjoint QFT routine. If :code:`None`, the
        default :class:`~.pennylane.estimator.templates.subroutines.QFT` will be used.

Resources:
    The resources are obtained from the standard decomposition of QPE as presented
    in (section 5.2) `Nielsen, M.A. and Chuang, I.L. (2011) Quantum Computation and Quantum
    Information <https://www.cambridge.org/highereducation/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE#overview>`_.

### `tracking_name`

```python
def tracking_name(base_cmpr_op: CompressedResourceOp, num_estimation_wires: int, adj_qft_cmpr_op: CompressedResourceOp | None=None) -> str
```

Returns the tracking name built with the operator's parameters.

## `IterativeQPE`

```python
class IterativeQPE(ResourceOperator)
```

Resource class for Iterative Quantum Phase Estimation (IQPE).

Args:
    base (:class:`~.pennylane.estimator.resource_operator.ResourceOperator`): the phase estimation operator
    num_iter (int): the number of mid-circuit measurements performed to read out the phase

Resources:
    The resources are obtained following the construction from `arXiv:0610214v3 <https://arxiv.org/abs/quant-ph/0610214v3>`_.

.. seealso:: :func:`~.pennylane.iterative_qpe`

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> gate_set = {"Hadamard", "CRX", "PhaseShift"}
>>> iqpe = qre.IterativeQPE(qre.RX(), 5)
>>> print(qre.estimate(iqpe, gate_set))
--- Resources: ---
Total wires: 2
    algorithmic wires: 1
    allocated wires: 1
    zero state: 1
    any state: 0
Total gates : 25
'CRX': 5,
'PhaseShift': 10,
'Hadamard': 10

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * base_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
          to the phase estimation operator.
        * num_iter (int): the number of mid-circuit measurements made to read out the phase

### `resource_rep`

```python
def resource_rep(cls, base_cmpr_op: CompressedResourceOp, num_iter: int) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    base_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
        to the phase estimation operator.
    num_iter (int): the number of mid-circuit measurements made to read out the phase

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, base_cmpr_op, num_iter)
```

Returns a list representing the resources of the operator. Each object in the list represents a gate and the
number of times it occurs in the circuit.

Args:
    base_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed resource operator, corresponding
        to the phase estimation operator.
    num_iter (int): the number of mid-circuit measurements made to read out the phase

Resources:
    The resources are obtained following the construction from `arXiv:0610214v3
    <https://arxiv.org/abs/quant-ph/0610214v3>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `UnaryIterationQPE`

```python
class UnaryIterationQPE(ResourceOperator)
```

Resource class for Quantum Phase Estimation (QPE) using the unary iteration
technique.

This form of QPE, as described in `arXiv.2011.03494 <https://arxiv.org/pdf/2011.03494>`_,
requires the unitary operator to be a quantum walk operator constructed from ``Select`` and ``Prepare``
subroutines. In this approach, unary iteration is used to construct successive powers of the walk operator,
which reduces :class:`~.pennylane.estimator.ops.qubit.non_parametric_ops.T` and
:class:`~.pennylane.estimator.ops.op_math.controlled_ops.Toffoli` gate counts in their decomposition at the cost of
increasing the number of auxiliary qubits required.

For a detailed explanation of unary iteration, see
`here <https://pennylane.ai/compilation/unary-iteration>`_. Note that users can also provide
a custom adjoint Quantum Fourier Transform (QFT) implementation, which can be used to further
optimize the resource requirements.

Args:
    walk_op (:class:`~.pennylane.estimator.resource_operator.ResourceOperator`): the quantum
        walk operator to apply the phase estimation protocol on
    num_iterations (int): The total number of times the quantum walk operator
        is applied in order to reach a target precision in the eigenvalue estimate.
    adj_qft_op (:class:`~.pennylane.estimator.resource_operator.ResourceOperator` | None): An optional
        argument to set the subroutine used to perform the adjoint QFT operation.
    wires (WiresLike | None): the wires the operation acts on

Resources:
    The resources are obtained from Figure 2. in Section III of `arXiv.2011.03494 <https://arxiv.org/pdf/2011.03494>`_.

Raises:
    ValueError: ``num_iterations`` must be an integer greater than zero
    TypeError: ``walk_op`` must be an instance of
        :class:`~.pennylane.estimator.templates.subroutines.Qubitization` or
        :class:`~.pennylane.estimator.templates.qubitize.QubitizeTHC`

.. seealso:: Related PennyLane operation :class:`~.pennylane.QuantumPhaseEstimation` and explanation of `Unary Iteration <https://pennylane.ai/compilation/unary-iteration>`_.

**Example**

The resources for this operation are computed as follows:

>>> import pennylane.estimator as qre
>>> thc_ham = qre.THCHamiltonian(num_orbitals=20, tensor_rank=40)
>>> num_iter, walk_op = (11, qre.QubitizeTHC(thc_ham))
>>> res = qre.estimate(qre.UnaryIterationQPE(walk_op, num_iter))
>>> print(res)
--- Resources: ---
 Total wires: 402
   algorithmic wires: 101
   allocated wires: 301
     zero state: 301
     any state: 0
 Total gates : 5.821E+5
   'Toffoli': 3.546E+4,
   'T': 792,
   'CNOT': 4.262E+5,
   'X': 1.833E+4,
   'Z': 475,
   'S': 880,
   'Hadamard': 9.995E+4

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * cmpr_walk_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`):
          A compressed resource operator corresponding to the quantum walk operator
          to apply the phase estimation protocol on.
        * num_iterations (int): The total number of times the quantum walk operator
          is applied in order to reach a target precision in the eigenvalue
          estimate.
        * adj_qft_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp` | None):
          An optional compressed resource operator corresponding to the adjoint QFT routine.
          If :code:`None`, the default :class:`~.pennylane.estimator.templates.subroutines.QFT`
          will be used.

### `resource_rep`

```python
def resource_rep(cls, cmpr_walk_op: CompressedResourceOp, num_iterations: int, adj_qft_cmpr_op: CompressedResourceOp | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    cmpr_walk_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`):
        A compressed resource operator corresponding to the quantum walk operator
        to apply the phase estimation protocol on.
    num_iterations (int): The total number of times the quantum walk operator
        is applied in order to reach a target precision in the eigenvalue estimate.
    adj_qft_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp` | None):
        An optional compressed resource operator corresponding to the adjoint QFT routine.
        If :code:`None`, the default :class:`~.pennylane.estimator.templates.subroutines.QFT`
        will be used.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, cmpr_walk_op: CompressedResourceOp, num_iterations: int, adj_qft_cmpr_op: CompressedResourceOp | None=None) -> list[GateCount | Allocate | Deallocate]
```

Returns the resources for Quantum Phase Estimation implemented using unary iteration.

Args:
    cmpr_walk_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`):
        A compressed resource operator corresponding to the quantum walk operator
        to apply the phase estimation protocol on.
    num_iterations (int): The total number of times the quantum walk operator
        is applied in order to reach a target precision in the eigenvalue estimate.
    adj_qft_cmpr_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp` | None):
        An optional compressed resource operator corresponding to the adjoint QFT routine.
        If :code:`None`, the default :class:`~.pennylane.estimator.templates.subroutines.QFT`
        will be used.

Resources:
    The resources are obtained from Figure 2. in Section III of `arXiv.2011.03494 <https://arxiv.org/pdf/2011.03494>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `tracking_name`

```python
def tracking_name(cmpr_walk_op: CompressedResourceOp, num_iterations: int, adj_qft_cmpr_op: CompressedResourceOp | None=None) -> str
```

Returns the tracking name built with the operator's parameters.

## `QFT`

```python
class QFT(ResourceOperator)
```

Resource class for QFT.

Args:
    num_wires (int | None): the number of qubits the operation acts upon
    wires (Sequence[int], None): the wires the operation acts on

Resources:
    The resources are obtained from the standard decomposition of QFT as presented
    in (chapter 5) `Nielsen, M.A. and Chuang, I.L. (2011) Quantum Computation and Quantum Information
    <https://www.cambridge.org/highereducation/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE#overview>`_.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.QFT`.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> qft = qre.QFT(3)
>>> gate_set = {"SWAP", "Hadamard", "ControlledPhaseShift"}
>>> print(qre.estimate(qft, gate_set))
--- Resources: ---
Total wires: 3
    algorithmic wires: 3
    allocated wires: 0
    zero state: 0
    any state: 0
Total gates : 7
'SWAP': 1,
'ControlledPhaseShift': 3,
'Hadamard': 3

.. details::
    :title: Usage Details

    This operation provides an alternative decomposition method when an appropriately sized
    phase gradient state is available. This decomposition can be used as a custom decomposition
    using the operation's ``phase_grad_resource_decomp`` method and the
    :class:`~.pennylane.estimator.resource_config.ResourceConfig` class. See the
    following example for more details.

    >>> import pennylane.estimator as qre
    >>> config = qre.ResourceConfig()
    >>> config.set_decomp(qre.QFT, qre.QFT.phase_grad_resource_decomp)
    >>> print(qre.estimate(qre.QFT(3), config=config))
    --- Resources: ---
    Total wires: 4
        algorithmic wires: 3
        allocated wires: 1
        zero state: 1
        any state: 0
    Total gates : 17
    'Toffoli': 5,
    'CNOT': 6,
    'Hadamard': 6

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_wires (int): the number of qubits the operation acts upon

### `resource_rep`

```python
def resource_rep(cls, num_wires) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    num_wires (int): the number of qubits the operation acts upon

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, num_wires) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    num_wires (int): the number of qubits the operation acts upon

Resources:
    The resources are obtained from the standard decomposition of QFT as presented
    in (Chapter 5) `Nielsen, M.A. and Chuang, I.L. (2011) Quantum Computation and Quantum Information
    <https://www.cambridge.org/highereducation/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE#overview>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `phase_grad_resource_decomp`

```python
def phase_grad_resource_decomp(cls, num_wires) -> list[GateCount]
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

### `tracking_name`

```python
def tracking_name(num_wires) -> str
```

Returns the tracking name built with the operator's parameters.

## `AQFT`

```python
class AQFT(ResourceOperator)
```

Resource class for the Approximate QFT.

.. note::

    This operation assumes an appropriately sized phase gradient state is available.
    Users should ensure the cost of constructing such a state has been accounted for.
    See also :class:`~.pennylane.estimator.templates.PhaseGradient`.

Args:
    order (int): the maximum number of controlled phase shifts per qubit to which the operation is truncated
    num_wires (int | None): the number of qubits the operation acts upon
    wires (Sequence[int], None): the wires the operation acts on

Resources:
    The resources are obtained from (Fig. 4) of `arXiv:1803.04933, <https://arxiv.org/abs/1803.04933>`_
    excluding the allocation and instantiation of the phase gradient state. The phased :code:`Toffoli`
    gates and the classical measure-and-reset (Fig. 2) are accounted for as :code:`TemporaryAND`
    operations.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.AQFT`.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> aqft = qre.AQFT(order=2, num_wires=3)
>>> gate_set = {"SWAP", "Hadamard", "T", "CNOT"}
>>> print(qre.estimate(aqft, gate_set))
--- Resources: ---
Total wires: 4
    algorithmic wires: 3
    allocated wires: 1
    zero state: 1
    any state: 0
Total gates : 57
'SWAP': 1,
'T': 40,
'CNOT': 9,
'Hadamard': 7

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * order (int): the maximum number of controlled phase shifts to which the operation is truncated
        * num_wires (int): the number of qubits the operation acts upon

### `resource_rep`

```python
def resource_rep(cls, order, num_wires) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    order (int): the maximum number of controlled phase shifts to truncate
    num_wires (int): the number of qubits the operation acts upon

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, order, num_wires) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    order (int): the maximum number of controlled phase shifts to which the operation is truncated
    num_wires (int): the number of qubits the operation acts upon

Resources:
    The resources are obtained from (Fig. 4) `arXiv:1803.04933 <https://arxiv.org/abs/1803.04933>`_
    excluding the allocation and instantiation of the phase gradient state. The phased Toffoli
    gates and the classical measure-and-reset (Fig. 2) are accounted for as :code:`TemporaryAND`
    operations.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `tracking_name`

```python
def tracking_name(order, num_wires) -> str
```

Returns the tracking name built with the operator's parameters.

## `BasisRotation`

```python
class BasisRotation(ResourceOperator)
```

Resource class for the BasisRotation gate.

Args:
    dim (int | None): The dimensions of the input matrix specifying the basis transformation.
        This is equivalent to the number of rows or columns of the matrix.
    wires (Sequence[int], None): the wires the operation acts on, should be equal to the dimension

Resources:
    The resources are obtained from the construction scheme given in `Optica, 3, 1460 (2016)
    <https://opg.optica.org/optica/fulltext.cfm?uri=optica-3-12-1460&id=355743>`_. Specifically,
    the resources are given as :math:`N \times (N - 1) / 2` instances of the
    ``SingleExcitation`` gate, and :math:`N \times (1 + (N - 1) / 2)`
    instances of the ``PhaseShift`` gate, where :math:`N` is the dimensions of the input matrix.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.BasisRotation`.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> basis_rot = qre.BasisRotation(dim = 5)
>>> print(qre.estimate(basis_rot))
--- Resources: ---
Total wires: 5
    algorithmic wires: 5
    allocated wires: 0
    zero state: 0
    any state: 0
Total gates : 1.740E+3
'T': 1.580E+3,
'CNOT': 20,
'Z': 40,
'S': 60,
'Hadamard': 40

### `resource_decomp`

```python
def resource_decomp(cls, dim) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    dim (int): The dimensions of the input :code:`unitary_matrix`. This is computed
        as the number of columns of the matrix.

Resources:
    The resources are obtained from the construction scheme given in `Optica, 3, 1460 (2016)
    <https://opg.optica.org/optica/fulltext.cfm?uri=optica-3-12-1460&id=355743>`_. Specifically,
    the resources are given as :math:`N * (N - 1) / 2` instances of the
    ``SingleExcitation`` gate, and :math:`N * (1 + (N - 1) / 2)` instances
    of the ``PhaseShift`` gate, where :math:`N` is the dimensions of the input matrix.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * dim (int): The dimensions of the input :code:`unitary_matrix`. This is computed as the number of columns of the matrix.

### `resource_rep`

```python
def resource_rep(cls, dim) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    dim (int): The dimensions of the input :code:`unitary_matrix`. This is computed
        as the number of columns of the matrix.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `tracking_name`

```python
def tracking_name(dim) -> str
```

Returns the tracking name built with the operator's parameters.

## `HybridQRAM`

```python
class HybridQRAM(ResourceOperator)
```

Resource class for HybridQRAM.

Args:
    data (TensorLike | Sequence[str]):
        The classical memory to retrieve values from.
    num_wires (int):
        The number of qubits the operation acts upon.
    num_select_wires (int):
        The number of "select" bits taken from ``control_wires``.
    num_control_wires (int):
        The number of ``control_wires`` including select and tree control wires.
    control_wires (WiresLike):
        The register that stores the index for the entry of the classical data we want to
        access.
    target_wires (WiresLike):
        The register in which the classical data gets loaded. The size of this register must
        equal each bitstring length in ``bitstrings``.
    work_wires (WiresLike):
        The additional wires required to funnel the desired entry of ``bitstrings`` into the
        ``target_wires`` register. The ``work_wires`` register includes the signal, bus,
        direction, left port and right port wires in that order for a tree of depth
        :math:`(n-k)`. For more details, consult
        `section 3 of arXiv:2306.03242 <https://arxiv.org/abs/2306.03242>`__.

Raises:
    ValueError: if the number of wires provided does not match ``num_wires``

Resources:
    The resources are obtained from the HybridQRAM implementation in PennyLane. Please find more
    details about the algorithm in `Systems Architecture for Quantum Random Access Memory <https://arxiv.org/abs/2306.03242>`_.

.. seealso:: :class:`~.HybridQRAM`

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters.
        * data (TensorLike | Sequence[str]): the classical memory to retrieve values from
        * num_wires (int): the number of qubits the operation acts upon
        * num_select_wires (int): the number of select wires
        * num_tree_control_wires (int): the number of ``work_wires`` minus the number of select wires

### `resource_rep`

```python
def resource_rep(cls, data, num_wires, num_select_wires, num_tree_control_wires)
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    data (TensorLike | Sequence[str]): the classical memory to retrieve values from
    num_wires (int): the number of qubits the operation acts upon
    num_select_wires (int): the number of select wires
    num_tree_control_wires (int): the number of ``work_wires`` minus the number of select wires

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, data, num_wires, num_select_wires, num_tree_control_wires)
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    data (TensorLike | Sequence[str]): the classical memory to retrieve values from
    num_wires (int): the number of qubits the operation acts upon
    num_select_wires (int): the number of select wires
    num_tree_control_wires (int): the number of ``work_wires`` minus the number of select wires

Resources:
    The resources are obtained from the HybridQRAM implementation in PennyLane. Please find more
    details about the algorithm in `Systems Architecture for Quantum Random Access Memory <https://arxiv.org/abs/2306.03242>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
        represents a specific quantum gate and the number of times it appears in the decomposition.

### `tracking_name`

```python
def tracking_name(data, num_wires, num_select_wires, num_tree_control_wires) -> str
```

Returns the tracking name built with the operator's parameters.

## `BBQRAM`

```python
class BBQRAM(ResourceOperator)
```

Resource class for BBQRAM.

Args:
    num_bitstrings (int): the size of the classical memory array to retrieve values from
    size_bitstring (int): the length of the individual bitstrings in the classical memory
    num_bit_flips (int): the number of 1s in the classical memory
    num_wires (int): the number of qubits the operation acts upon
    control_wires (WiresLike): The register that stores the index for the entry of the classical data we want to
        access.
    target_wires (WiresLike):
        The register in which the classical data gets loaded. The size of this register must
        equal each bitstring length in ``bitstrings``.
    work_wires (WiresLike): The additional wires required to funnel the desired entry of ``bitstrings`` into the
        target register.

Raises:
    ValueError: if the number of wires provided does not match ``num_wires``

Resources:
    The resources are obtained from the BBQRAM implementation in PennyLane. The original publication of
    the algorithm can be found in `Quantum Random Access Memory <https://arxiv.org/abs/0708.1879>`_.

.. seealso:: :class:`~.BBQRAM`

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * num_wires (int): the number of qubits the operation acts upon
        * num_bitstrings (int): the size of the classical memory array to retrieve values from
        * size_bitstring (int): the length of the individual bitstrings in the classical memory
        * num_bit_flips (int): the number of 1s in the classical memory

### `resource_rep`

```python
def resource_rep(cls, num_bitstrings, size_bitstring, num_bit_flips, num_wires)
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    num_bitstrings (int): the size of the classical memory array to retrieve values from
    size_bitstring (int): the length of the individual bitstrings in the classical memory
    num_bit_flips (int): the number of 1s in the classical memory
    num_wires (int): the number of qubits the operation acts upon

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, num_bitstrings, size_bitstring, num_bit_flips, num_wires)
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    num_bitstrings (int): the size of the classical memory array to retrieve values from
    size_bitstring (int): the length of the individual bitstrings in the classical memory
    num_bit_flips (int): the number of 1s in the classical memory
    num_wires (int): the number of qubits the operation acts upon

Resources:
    The resources are obtained from the BBQRAM implementation in PennyLane. The original publication of
    the algorithm can be found in `Quantum Random Access Memory <https://arxiv.org/abs/0708.1879>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
        represents a specific quantum gate and the number of times it appears
        in the decomposition.

### `tracking_name`

```python
def tracking_name(num_bitstrings, size_bitstring, num_bit_flips, num_wires) -> str
```

Returns the tracking name built with the operator's parameters.

## `Select`

```python
class Select(ResourceOperator)
```

Resource class for the Select gate.

Args:
    ops (list[:class:`~.pennylane.estimator.resource_operator.ResourceOperator`]): the set of operations to select over
    wires (Sequence[int], None): The wires the operation acts on. If :code:`ops`
        provide wire labels, then this is just the set of control wire labels. Otherwise, it
        also includes the target wire labels of the selected operators.

Resources:
    The resources are based on the analysis in `Babbush et al. (2018) <https://arxiv.org/pdf/1805.03662>`_ section III.A,
    'Unary Iteration and Indexed Operations'. See Figures 4, 6, and 7.

.. seealso:: The corresponding PennyLane operation :class:`~.pennylane.Select`.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> ops = [qre.X(), qre.Y(), qre.Z()]
>>> select_op = qre.Select(ops=ops)
>>> print(qre.estimate(select_op))
--- Resources: ---
Total wires: 4
    algorithmic wires: 3
    allocated wires: 1
    zero state: 1
    any state: 0
Total gates : 24
'Toffoli': 2,
'CNOT': 7,
'X': 4,
'Z': 1,
'S': 2,
'Hadamard': 8

### `resource_decomp`

```python
def resource_decomp(cls, cmpr_ops, num_wires)
```

The resources for a select implementation taking advantage of the unary iterator trick.

Args:
    cmpr_ops (list[:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`]): The list of operators, in the compressed
        representation, to be applied according to the selected qubits.
    num_wires (int): The number of wires the operation acts on. This is a sum of the
        control wires (:math:`\lceil(log_{2}(N))\rceil`) required and the number wires
        targeted by the :code:`ops`.

Resources:
    The resources are based on the analysis in `Babbush et al. (2018) <https://arxiv.org/pdf/1805.03662>`_ section III.A,
    'Unary Iteration and Indexed Operations'. See Figures 4, 6, and 7.

    Note: This implementation assumes we have access to :math:`n - 1` additional work qubits,
    where :math:`n = \left\lceil log_{2}(N) \right\rceil` and :math:`N` is the number of batches of unitaries
    to select.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `textbook_resources`

```python
def textbook_resources(cmpr_ops) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list represents a gate and the
number of times it occurs in the circuit.

Args:
    cmpr_ops (list[:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`]): The list of operators, in the compressed
        representation, to be applied according to the selected qubits.
    num_wires (int): The number of wires the operation acts on. This is a sum of the
        control wires (:math:`\lceil(log_{2}(N))\rceil`) required and the number wires
        targeted by the :code:`ops`.

Resources:
    The resources correspond directly to the definition of the operation. Specifically,
    for each operator in :code:`cmpr_ops`, the cost is given as a controlled version of the operator
    controlled on the associated bitstring.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * cmpr_ops (list[:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`]): The list of operators, in the compressed representation, to be applied according to the selected qubits.
        * num_wires (int): The number of wires the operation acts on. This is a sum of the
          control wires (:math:`\lceil(log_{2}(N))\rceil`) required and the number wires
          targeted by the :code:`ops`.

### `resource_rep`

```python
def resource_rep(cls, cmpr_ops, num_wires: WiresLike=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    cmpr_ops (list[:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`]): The list of operators, in the compressed
        representation, to be applied according to the selected qubits.
    num_wires (int): An optional parameter representing the number of wires the operation
        acts on. This is a sum of the control wires (:math:`\lceil(log_{2}(N))\rceil`)
        required and the number of wires targeted by the :code:`ops`.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

## `QROM`

```python
class QROM(ResourceOperator)
```

Resource class for the Quantum Read-Only Memory (QROM) template.

Args:
    num_bitstrings (int): the number of bitstrings that are to be encoded
    size_bitstring (int): the length of each bitstring
    num_bit_flips (int | None): The total number of :math:`1`'s in the dataset. Defaults to
        :code:`(num_bitstrings * size_bitstring) // 2`, which is half the dataset.
    restored (bool): Determine if allocated qubits should be reset after the computation
        (at the cost of higher gate counts). Defaults to :code:`True`.
    select_swap_depth (int | None): A parameter :math:`\lambda` that determines
        if data will be loaded in parallel by adding more rows following Figure 1.C of
        `Low et al. (2024) <https://arxiv.org/pdf/1812.00954>`_. Can be :code:`None`,
        :code:`1` or a positive integer power of two. Defaults to ``None``, which sets the
        depth that minimizes T-gate count.
    wires (WiresLike | None): The wires the operation acts on (control and target), excluding
        any additional qubits allocated during the decomposition (e.g select-swap wires).

Resources:
    The resources for QROM are derived from the following references:

    * :code:`restored=False`: Uses the Select-Swap tree decomposition from Figure 1.C of
      `Low et al. (2018) <https://arxiv.org/abs/1812.00954>`_, further optimized using the
      measurement-based uncomputation technique described in
      `Berry et al. (2019) <https://arxiv.org/abs/1902.02134>`__.

    * :code:`restored=True`: Uses the standard QROM resource accounting from Figure 4 of
      `Berry et al. (2019) <https://arxiv.org/abs/1902.02134>`__.

.. seealso:: The associated PennyLane operation :class:`~.pennylane.QROM`

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> qrom = qre.QROM(
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
Total gates : 85
'Toffoli': 8,
'CNOT': 36,
'X': 17,
'Hadamard': 24

### `resource_decomp`

```python
def resource_decomp(cls, num_bitstrings: int, size_bitstring: int, num_bit_flips: int | None=None, select_swap_depth: int | None=None, restored: bool=True) -> list[GateCount]
```

Returns a list of ``GateCount`` objects representing the operator's resources.

Args:
    num_bitstrings (int): the number of bitstrings that are to be encoded
    size_bitstring (int): the length of each bitstring
    num_bit_flips (int | None): The total number of :math:`1`'s in the dataset. Defaults to
        :code:`(num_bitstrings * size_bitstring) // 2`, which is half the dataset.
    select_swap_depth (int | None): A parameter :math:`\lambda` that determines
        if data will be loaded in parallel by adding more rows following Figure 1.C of
        `Low et al. (2024) <https://arxiv.org/pdf/1812.00954>`_. Can be :code:`None`,
        :code:`1` or a positive integer power of two. Defaults to ``None``, which sets the
        depth that minimizes T-gate count.
    restored (bool): Determine if allocated qubits should be reset after the computation
        (at the cost of higher gate counts). Defaults to :code:`True`.

Resources:
    The resources for QROM are derived from the following references:

    * :code:`restored=False`: Uses the Select-Swap tree decomposition from Figure 1.C of
      `Low et al. (2018) <https://arxiv.org/abs/1812.00954>`_, further optimized using the
      measurement-based uncomputation technique described in
      `Berry et al. (2019) <https://arxiv.org/abs/1902.02134>`__.

    * :code:`restored=True`: Uses the standard QROM resource accounting from Figure 4 of
      `Berry et al. (2019) <https://arxiv.org/abs/1902.02134>`__.

    Note: we use the unary iterator trick to implement the ``Select``. This
    implementation assumes we have access to :math:`n - 1` additional
    work qubits, where :math:`n = \left\lceil \log_{2}(N) \right\rceil` and :math:`N` is
    the number of batches of unitaries to select.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `single_controlled_res_decomp`

```python
def single_controlled_res_decomp(cls, num_bitstrings: int, size_bitstring: int, num_bit_flips: int | None=None, select_swap_depth: int | None=None, restored: bool=True)
```

The resource decomposition for QROM controlled on a single wire.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires: int, num_zero_ctrl: int, target_resource_params: dict)
```

Returns a list representing the resources for a controlled version of the operator.

Args:
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in the :math:`|0\rangle` state
    target_resource_params (dict): A dictionary containing the resource parameters of the target operator.

Resources:
    The resources for QROM are taken from the following two papers:
    `Low et al. (2024) <https://arxiv.org/pdf/1812.00954>`_ (Figure 1.C) for
    :code:`restored = False` and `Berry et al. (2019) <https://arxiv.org/pdf/1902.02134>`_
    (Figure 4) for :code:`restored = True`.

    Note: we use the single-controlled unary iterator trick to implement the ``Select``. This
    implementation assumes we have access to :math:`n` additional work qubits,
    where :math:`n = \lceil \log_{2}(N) \rceil` and :math:`N` is the number of batches of
    unitaries to select.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

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
        * restored (bool): Determine if allocated qubits should be reset after the
          computation (at the cost of higher gate counts). Defaults to :code:`True`.
        * select_swap_depth (int | None): A parameter :math:`\lambda` that
          determines if data will be loaded in parallel by adding more rows following
          Figure 1.C of `Low et al. (2024) <https://arxiv.org/pdf/1812.00954>`_. Can be
          :code:`None`, :code:`1` or a positive integer power of two. Defaults to None,
          which sets the depth that minimizes T-gate count.

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources of the adjoint of the operator. Each object represents a quantum gate
and the number of times it occurs in the decomposition.

Args:
    target_resource_params(dict): A dictionary containing the resource parameters of the target operator.

Resources:
    This resources are based on Appendix C of `arXiv:1902.02134 <https://arxiv.org/abs/1902.02134>`_.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `resource_rep`

```python
def resource_rep(cls, num_bitstrings: int, size_bitstring: int, num_bit_flips: int | None=None, restored: bool=True, select_swap_depth: int | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    num_bitstrings (int): the number of bitstrings that are to be encoded
    size_bitstring (int): the length of each bitstring
    num_bit_flips (int | None): The total number of :math:`1`'s in the dataset. Defaults to
        :code:`(num_bitstrings * size_bitstring) // 2`, which is half the dataset.
    restored (bool): Determine if allocated qubits should be reset after the computation
        (at the cost of higher gate counts). Defaults to :code:`True`.
    select_swap_depth (int | None): A parameter :math:`\lambda` that determines
        if data will be loaded in parallel by adding more rows following Figure 1.C of
        `Low et al. (2024) <https://arxiv.org/pdf/1812.00954>`_. Can be :code:`None`,
        :code:`1` or a positive integer power of two. Defaults to ``None``, which sets the
        depth that minimizes T-gate count.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

## `SelectPauliRot`

```python
class SelectPauliRot(ResourceOperator)
```

Resource class for the uniformly controlled rotation gate.

Args:
    rot_axis (str): the rotation axis used in the multiplexer
    num_ctrl_wires (int): the number of control wires of the multiplexer
    precision (float | None): the precision used in the single qubit rotations
    wires (WiresLike, None): the wires the operation acts on

Resources:
    The resources are obtained from the construction scheme given in `Möttönen and Vartiainen
    (2005), Fig 7a <https://arxiv.org/abs/quant-ph/0504100>`_. Specifically, the resources
    for an :math:`n` qubit unitary are given as :math:`2^{n}` instances of the :code:`CNOT`
    gate and :math:`2^{n}` instances of the single qubit rotation gate (:code:`RX`,
    :code:`RY` or :code:`RZ`) depending on the :code:`rot_axis`.

.. seealso:: The associated PennyLane operation :class:`~.pennylane.SelectPauliRot`.

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> mltplxr = qre.SelectPauliRot(
...     rot_axis = "Y",
...     num_ctrl_wires = 4,
...     precision = 1e-3,
... )
>>> print(qre.estimate(mltplxr, gate_set=['RY','CNOT']))
--- Resources: ---
Total wires: 5
    algorithmic wires: 5
    allocated wires: 0
    zero state: 0
    any state: 0
Total gates : 32
'RY': 16,
'CNOT': 16

### `resource_params`

```python
def resource_params(self)
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * rot_axis (str): the rotation axis used in the multiplexer
        * num_ctrl_wires (int): the number of control wires of the multiplexer
        * precision (float): the precision used in the single qubit rotations

### `resource_rep`

```python
def resource_rep(cls, num_ctrl_wires, rot_axis, precision=None)
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    rot_axis (str): the rotation axis used in the multiplexer
    num_ctrl_wires (int): the number of control wires of the multiplexer
    precision (float | None): the precision used in the single qubit rotations

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, num_ctrl_wires, rot_axis, precision)
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    rot_axis (str): the rotation axis used in the multiplexer
    num_ctrl_wires (int): the number of control wires of the multiplexer
    precision (float): the precision used in the single qubit rotations

Resources:
    The resources are obtained from the construction scheme given in `Möttönen and Vartiainen
    (2005), Fig 7a <https://arxiv.org/abs/quant-ph/0504100>`_. Specifically, the resources
    for an :math:`n` qubit unitary are given as :math:`2^{n}` instances of the :code:`CNOT`
    gate and :math:`2^{n}` instances of the single qubit rotation gate (:code:`RX`,
    :code:`RY` or :code:`RZ`) depending on the :code:`rot_axis`.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `phase_grad_resource_decomp`

```python
def phase_grad_resource_decomp(cls, num_ctrl_wires, rot_axis, precision)
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    rot_axis (str): the rotation axis used in the multiplexer
    num_ctrl_wires (int): the number of control wires of the multiplexer
    precision (float): the precision used in the single qubit rotations

Resources:
    The resources are obtained from the construction scheme given in `O'Brien and Sünderhauf
    (2025), Fig 4 <https://arxiv.org/pdf/2409.07332>`_. Specifically, the resources
    use two :class:`~.pennylane.estimator.templates.subroutines.QROM`s to digitally load and unload
    the phase angles up to some precision. These are then applied using a single controlled
    :class:`~.pennylane.estimator.templates.subroutines.SemiAdder`.

    .. note::

        This method assumes a phase gradient state is prepared on an auxiliary register.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of GateCount objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

## `Reflection`

```python
class Reflection(ResourceOperator)
```

Resource class for the Reflection operator. Apply a reflection about a state :math:`|\Psi\rangle`.

This operator works by providing an operation, :math:`U`, that prepares the desired state, :math:`\vert \Psi \rangle`,
that we want to reflect about. We can also provide a reflection angle :math:`\alpha`
to define the operation in a more generic form:

.. math::

   R(U, \alpha) = -I + (1 - e^{i\alpha}) |\Psi\rangle \langle \Psi|

Args:
    num_wires (int | None): The number of wires the operator acts on. If ``None`` is provided, the
        number of wires are inferred from the ``U`` operator.
    U (:class:`~.pennylane.estimator.resource_operator.ResourceOperator` | None): the operator that prepares the state :math:`|\Psi\rangle`
    alpha (float | None): the angle of the operator, should be between :math:`[0, 2\pi]`. Default is :math:`\pi`.
    wires (WiresLike | None): The wires the operation acts on.

Resources:
    The resources are derived from the decomposition :math:`R(U, \alpha) = U R(\alpha) U^\dagger`.
    The center block :math:`R(\alpha) = -I + (1 - e^{i\alpha})|0\rangle\langle 0|` is implemented
    using a multi-controlled ``PhaseShift``.

    In the special case where :math:`\alpha = \pi`, the ``PhaseShift`` becomes a ``Z`` gate.
    If :math:`\alpha = 0` or :math:`\alpha = 2\pi`, the center block cancels out, leaving :math:`-I`.
    The cost for :math:`-I` is calculated as :math:`X Z X Z = -I`.

Raises:
    ValueError: if ``alpha`` is not a float within the range ``[0, 2pi]``
    ValueError: if at least one of ``num_wires`` or ``U`` is not provided
    ValueError: if the wires provided don't match the number of wires expected by the operator

.. seealso:: :class:`~.pennylane.Reflection`

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> U = qre.Hadamard(wires=0)
>>> ref_op = qre.Reflection(U=U, alpha=0.1)
>>> print(qre.estimate(ref_op))
--- Resources: ---
 Total wires: 1
   algorithmic wires: 1
   allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 52
   'T': 44,
   'X': 4,
   'Z': 2,
   'Hadamard': 2

### `resource_decomp`

```python
def resource_decomp(cls, num_wires: int | None=None, alpha: float=math.pi, cmpr_U: CompressedResourceOp | None=None)
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    num_wires (int): number of wires the operator acts on
    alpha (float): the angle of the operator, default is :math:`\pi`
    cmpr_U (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): the operator that prepares the state :math:`|\Psi\rangle`

Resources:
    The resources are derived from the decomposition :math:`R(U, \alpha) = U R(\alpha) U^\dagger`.
    The center block :math:`R(\alpha)` is implemented as a multi-controlled ``PhaseShift`` sandwiched
    by ``X`` gates on the target wire.

    If :math:`\alpha = \pi`, the phase shift is replaced by a ``Z`` gate.
    If :math:`\alpha = 0` or :math:`\alpha = 2\pi`, the operator simplifies to :math:`-I`,
    which costs :math:`X Z X Z`.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params)
```

Returns a list representing the resources for the adjoint of the operator.

Args:
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

Resources:
    ``Reflection`` operators are always self-inverse operators. This together with the fact
    that this is a unitary operator implies that it is self-adjoint.

Returns:
    list[:class:`~.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires, num_zero_ctrl, target_resource_params)
```

Returns a list representing the resources for a controlled version of the operator.

Args:
    num_ctrl_wires (int): the number of qubits the operation is controlled on
    num_zero_ctrl (int): the number of control qubits, that are controlled when in
        the :math:`|0\rangle` state
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

Resources:
    The controlled decomposition simplifies by observing that :math:`R(U, \alpha) = U R(\alpha) U^\dagger`
    is a change of basis. Thus, we only need to control the center block :math:`R(\alpha)`,
    not the :math:`U` or :math:`U^\dagger` operations.

    Controlling :math:`R(\alpha)` involves controlling the global phase :math:`-I` and the
    multi-controlled ``PhaseShift``. The global phase :math:`-I` is controlled using
    :math:`MCX \cdot Z \cdot MCX \cdot Z`.

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
        * num_wires (int | None): number of wires the operator acts on
        * alpha (float | None): the angle of the operator, default is :math:`\pi`
        * cmpr_U (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp` | None): the operator that prepares the
          state :math:`|\Psi\rangle`

### `resource_rep`

```python
def resource_rep(cls, num_wires: int | None=None, alpha: float=math.pi, cmpr_U: CompressedResourceOp | None=None) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute a resource estimation.

Args:
    num_wires (int): number of wires the operator acts on
    alpha (float): the angle of the operator, default is :math:`\pi`
    cmpr_U (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): the operator that prepares the state :math:`|\Psi\rangle`

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

## `Qubitization`

```python
class Qubitization(ResourceOperator)
```

Resource class for the Qubitization operator. The operator is also referred to as the Quantum Walk operator.

The operator is constructed by encoding a Hamiltonian, written as a linear combination of unitaries, into a block encoding (see Figure 1 in
`arXiv:1805.03662 <https://arxiv.org/abs/1805.03662>`_).

.. math::
    Q =  \text{Prep}_{H}(2|0\rangle\langle 0| - I)\text{Prep}_{H}^{\dagger} \text{Sel}_{H}.

Args:
    prep_op (:class:`~.pennylane.estimator.resource_operator.ResourceOperator`): the operator that prepares the coefficients of the LCU
    select_op (:class:`~.pennylane.estimator.resource_operator.ResourceOperator`): the operator that selectively applies the unitaries of the LCU
    wires (WiresLike | None): the wires the operation acts on

Resources:
    The resources are obtained from Equation 9 in `Babbush et al. (2018) <https://arxiv.org/abs/1805.03662>`_.
    Specifically, the walk operator is defined as :math:`W = R \cdot S`, where :math:`R` is a reflection about the state prepared by
    the ``Prepare`` operator, and :math:`S` is the ``Select`` operator. The cost is therefore one ``Select`` and one ``Reflection``.

Raises:
    ValueError: if the wires provided don't match the number of wires expected by the operator

**Example**

The resources for this operation are computed using:

>>> import pennylane.estimator as qre
>>> prep_op = qre.Hadamard(wires=0)
>>> select_op = qre.Z(wires=0)
>>> qw_op = qre.Qubitization(prep_op, select_op)
>>> print(qre.estimate(qw_op))
--- Resources: ---
 Total wires: 1
   algorithmic wires: 1
   allocated wires: 0
     zero state: 0
     any state: 0
 Total gates : 10
   'X': 4,
   'Z': 4,
   'Hadamard': 2

### `resource_decomp`

```python
def resource_decomp(cls, prep_op: CompressedResourceOp, select_op: CompressedResourceOp)
```

Returns a list representing the resources of the operator. Each object in the list
represents a gate and the number of times it occurs in the circuit.

Args:
    prep_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed representation for the operator that prepares
        the coefficients of the LCU.
    select_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed representation for the operator that selectively
        applies the unitaries of the LCU.

Resources:
    The resources are obtained from Equation 9 in `Babbush et al. (2018) <https://arxiv.org/abs/1805.03662>`_.
    Specifically, the walk operator is defined as :math:`W = R \cdot S`, where :math:`R` is a reflection about the state prepared by
    the ``Prepare`` operator, and :math:`S` is the ``Select`` operator.

Returns:
    list[:class:`~.pennylane.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params)
```

Returns a list representing the resources for the adjoint of the operator.

Args:
    target_resource_params (dict): A dictionary containing the resource parameters
        of the target operator.

Resources:
    ``Reflection`` operators are self-adjoint, and the ``Select`` operator is also self-adjoint.
    Thus the adjoint of this operator has the same resources, just applied in reverse order.

Returns:
    list[:class:`~.estimator.resource_operator.GateCount`]: A list of ``GateCount`` objects, where each object
    represents a specific quantum gate and the number of times it appears
    in the decomposition.

### `controlled_resource_decomp`

```python
def controlled_resource_decomp(cls, num_ctrl_wires, num_zero_ctrl, target_resource_params)
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
    The resources are obtained directly from Figure 1 in
    `Babbush et al. (2018) <https://arxiv.org/abs/1805.03662>`_.

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
        * prep_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): a compressed representation for the operator that
          prepares the coefficients of the LCU
        * select_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): a compressed representation for the operator that
          selectively applies the unitaries of the LCU

### `resource_rep`

```python
def resource_rep(cls, prep_op: CompressedResourceOp, select_op: CompressedResourceOp) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    prep_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed representation for the operator that prepares
        the coefficients of the LCU.
    select_op (:class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`): A compressed representation for the operator that selectively
        applies the unitaries of the LCU.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation
