---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/estimator_beta/templates/comparators.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/estimator_beta/templates/comparators.py
license: Apache-2.0
---

## Module `pennylane/labs/estimator_beta/templates/comparators.py`

Resource operators for PennyLane comparison templates.

## `OutOfPlaceIntegerComparator`

```python
class OutOfPlaceIntegerComparator(ResourceOperator)
```

Resource class for an out-of-place integer comparator.

Compares an n-bit quantum register :math:`|x\rangle` against a classical
integer :math:`L`, storing the result :math:`x < L` (or :math:`x \geq L`)
in a dedicated output qubit.

The circuit computes the borrow chain of the subtraction :math:`x - L`.
The n - 1 intermediate borrow qubits are kept dirty after the
forward pass, enabling the inverse to be performed with Clifford gates
only (0 Toffoli cost).

Args:
    value (int): The value :math:`L` that the state’s decimal representation is compared against.
    register_size (int): size of the register for basis state
    geq (bool): If set to ``True``, the comparison made will be :math:`n \geq L`. If
        ``False``, the comparison made will be :math:`n \lt L`.
    wires (WiresLike | None): The wires the operation acts on.

Resources:
    The resources are computed based on Figure 6 of Appendix E in
    `Su et al. (2021) <https://arxiv.org/abs/2105.12767>`_. This decomposition
    is useful when extra auxiliary wires are available and an inverse of the operation is required in the same circuit.

    The resources are as follows: `register_size - 1` ``TemporaryAND`` gates, `register_size - 1` ``CNOT`` gates, and the number of ``X``
    gates depend on the number of ones in binary representation of the value we are comparing to. There are also `register_size - 1`
    auxiliary qubits that are allocated in the circuit and are deallocated by its adjoint.

**Example**

The resources for this operation are computed using:

>>> import pennylane.labs.estimator_beta as qre
>>> comparator = qre.OutOfPlaceIntegerComparator(value=11, register_size=4, geq=False)
>>> print(qre.estimate(comparator))
--- Resources: ---
 Total wires: 8
   algorithmic wires: 5
   allocated wires: 3
     zero state: 0
     any state: 3
 Total gates : 17
   'Toffoli': 3,
   'CNOT': 4,
   'X': 10

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * value (int): The value :math:`L` that the state’s decimal representation is compared against.
        * register_size (int): size of the register for basis state
        * geq (bool): If set to ``True``, the comparison made will be :math:`n \geq L`. If
          ``False``, the comparison made will be :math:`n \lt L`.

### `resource_rep`

```python
def resource_rep(cls, value: int, register_size: int, geq: bool=False) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    value (int): The value :math:`L` that the state’s decimal representation is compared against.
    register_size (int): size of the register for basis state
    geq (bool): If set to ``True``, the comparison made will be :math:`n \geq L`. If
        ``False``, the comparison made will be :math:`n \lt L`.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, value: int, register_size: int, geq: bool=False) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list represents a gate and the
number of times it occurs in the circuit.

Args:
    value (int): The value :math:`L` that the state’s decimal representation is compared against.
    register_size (int): size of the register for basis state
    geq (bool): If set to ``True``, the comparison made will be :math:`n \geq L`. If
        ``False``, the comparison made will be :math:`n \lt L`.

Resources:
    The resources are computed based on Figure 6 of Appendix E in
    `Su et al. (2021) <https://arxiv.org/abs/2105.12767>`_. This decomposition
    is useful when extra auxiliary wires are available and an inverse of the operation is required in the same circuit.

    The resources are as follows: `register_size - 1` ``TemporaryAND`` gates, `register_size - 1` ``CNOT`` gates, and the number of ``X``
    gates depend on the number of ones in binary representation of the value we are comparing to. There are also `register_size - 1`
    auxiliary qubits that are allocated in the circuit and are deallocated by its adjoint.


Returns:
    list[GateCount]: A list of gate counts representing the resources of the operator.

### `adjoint_resource_decomp`

```python
def adjoint_resource_decomp(cls, target_resource_params: dict) -> list[GateCount]
```

Returns a list representing the resources of the adjoint of the operator. Each object in the list represents a gate and the
number of times it occurs in the circuit.

Args:
    target_resource_params (dict): Dictionary containing the resource parameters of the target operator.

Resources:
    The resources are computed based on Figure 6 of Appendix E in
    `Su et al. (2021) <https://arxiv.org/abs/2105.12767>`_. This decomposition
    is useful when extra auxiliary wires are available and an inverse of the operation is required in the same circuit.

    The resources are as follows: `register_size - 1` ``TemporaryAND`` gates, `register_size - 1` ``CNOT`` gates, and the number of ``X``
    gates depend on the number of ones in binary representation of the value we are comparing to. There are also `register_size - 1`
    auxiliary qubits that are allocated in the circuit and are deallocated by its adjoint.


Returns:
    list[GateCount]: A list of gate counts representing the resources of the adjoint of the operator.

## `RegisterEquality`

```python
class RegisterEquality(ResourceOperator)
```

Resource class for testing the equality of two quantum registers.

Compares two n-bit quantum registers :math:`|i\rangle` and :math:`|j\rangle`,
storing the result (:math:`i == j`) in a dedicated output qubit.

The circuit computes the bitwise XOR of the two registers
using CNOTs, then uses a ``TemporaryAND`` cascade to flag whether
all XOR results are zero (i.e., the registers are equal).

Args:
    register_size (int): Number of qubits n in each register.
    wires (WiresLike | None): The wires the operation acts on.

Resources:
    The circuit computes the bitwise XOR of the two registers using
    CNOTs, then checks whether all results are zero via a Toffoli
    cascade. The circuit is represented as:

    .. code-block:: bash

        0: ─╭●──────────┤
        1: ─│──╭●───────┤
        2: ─│──│──╭●────┤
        3: ─╰X─│──│──╭○─┤
        4: ────╰X─│──├○─┤
        5: ───────╰X─├○─┤
        6: ──────────╰X─┤  <Z>

    Note that the state of the second register is not preserved after this operation and it needs to be uncomputed if it is needed later in the circuit.

**Example**

The resources for this operation are computed using:

>>> import pennylane.labs.estimator_beta as qre
>>> comparator = qre.RegisterEquality(register_size=3)
>>> print(qre.estimate(comparator))
--- Resources: ---
 Total wires: 8
   algorithmic wires: 7
   allocated wires: 1
     zero state: 1
     any state: 0
 Total gates : 12
   'Toffoli': 2,
   'CNOT': 4,
   'X': 3,
   'Hadamard': 3

### `resource_params`

```python
def resource_params(self) -> dict
```

Returns a dictionary containing the minimal information needed to compute the resources.

Returns:
    dict: A dictionary containing the resource parameters:
        * register_size (int): size of the registers for basis state

### `resource_rep`

```python
def resource_rep(cls, register_size: int) -> CompressedResourceOp
```

Returns a compressed representation containing only the parameters of
the Operator that are needed to compute the resources.

Args:
    register_size (int): Number of qubits n in each register.

Returns:
    :class:`~.pennylane.estimator.resource_operator.CompressedResourceOp`: the operator in a compressed representation

### `resource_decomp`

```python
def resource_decomp(cls, register_size: int) -> list[GateCount]
```

Returns a list representing the resources of the operator. Each object in the list represents a gate and the
number of times it occurs in the circuit.

Args:
    register_size (int): Number of qubits n in each register.

Resources:
    The circuit computes the bitwise XOR of the two registers using
    CNOTs, then checks whether all results are zero via a Toffoli
    cascade. The circuit is represented as:

    .. code-block:: bash

        0: ─╭●──────────┤
        1: ─│──╭●───────┤
        2: ─│──│──╭●────┤
        3: ─╰X─│──│──╭○─┤
        4: ────╰X─│──├○─┤
        5: ───────╰X─├○─┤
        6: ──────────╰X─┤  <Z>

    Note that the state of the second register is not preserved after this operation and it needs to be uncomputed if it is needed later in the circuit.

Returns:
    list[GateCount]: A list of gate counts representing the resources of the operator.
