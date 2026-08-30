---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/state_preparations/superposition.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/state_preparations/superposition.py
license: Apache-2.0
---

## Module `pennylane/templates/state_preparations/superposition.py`

Contains the Superposition template.

## `order_states`

```python
def order_states(basis_states: list[list[int]]) -> dict[tuple[int], tuple[int]]
```

This function maps a given list of :math:`m` computational basis states to the first
:math:`m` computational basis states, except for input states that are among the first
:math:`m` computational basis states, which are mapped to themselves.

Args:
    basis_states (list[list[int]]): sequence of :math:`m` basis states to be mapped.
        Each state is a sequence of 0s and 1s.

Returns:
    dict[tuple[int], tuple[int]]: dictionary mapping basis states to the first :math:`m` basis
    states, except for fixed points (states in the input that already were among the
    first :math:`m` basis states).

**Example**

For instance, a given list of :math:`[s_0, s_1, ..., s_m]` where :math:`s` is a basis
state of length :math:`4` will be mapped as
:math:`\{s_0: |0000\rangle, s_1: |0001\rangle, s_2: |0010\rangle, \dots\}`.

>>> basis_states = [[1, 1, 0, 0], [1, 0, 1, 0], [0, 1, 0, 1], [1, 0, 0, 1]]
>>> order_states(basis_states)
{(1, 1, 0, 0): (0, 0, 0, 0),
    (1, 0, 1, 0): (0, 0, 0, 1),
    (0, 1, 0, 1): (0, 0, 1, 0),
    (1, 0, 0, 1): (0, 0, 1, 1)}

If a state in ``basis_states`` is one of the first :math:`m` basis states,
this state will be mapped to itself, i.e. it will be a fixed point of the mapping.

>>> basis_states = [[1, 1, 0, 0], [0, 1, 0, 1], [0, 0, 0, 1], [1, 0, 0, 1]]
>>> order_states(basis_states)
{(0, 0, 0, 1): (0, 0, 0, 1),
    (1, 1, 0, 0): (0, 0, 0, 0),
    (0, 1, 0, 1): (0, 0, 1, 0),
    (1, 0, 0, 1): (0, 0, 1, 1)}

## `Superposition`

```python
class Superposition(Operation)
```

Prepare a superposition of computational basis states.

Given a list of :math:`m` coefficients :math:`c_i` and basic states :math:`|b_i\rangle`,
this operator prepares the state:

.. math::

    |\phi\rangle = \sum_i^m c_i |b_i\rangle.

See the Details section for more information about the decomposition.

Args:
    coeffs (tensor-like[float]): normalized coefficients of the superposition
    bases (tensor-like[int]): basis states of the superposition
    wires (Sequence[int]): wires that the operator acts on
    work_wire (Union[Wires, int, str]): the auxiliary wire used for the permutation

**Example**

.. code-block:: python

    import pennylane as qp
    import numpy as np

    coeffs = np.sqrt(np.array([1/3, 1/3, 1/3]))
    bases = np.array([[1, 1, 1], [0, 1, 0], [0, 0, 0]])
    wires = [0, 1, 2]
    work_wire = 3

    dev = qp.device('default.qubit')
    @qp.qnode(dev)
    def circuit():
        qp.Superposition(coeffs, bases, wires, work_wire)
        return qp.probs(wires)

>>> print(circuit()) # doctest: +SKIP
[0.3333 0.     0.3333 0.     0.     0.     0.     0.3333]


.. details::
    :title: Details

    The input superposition state , :math:`|\phi\rangle = \sum_i^m c_i |b_i\rangle`, is implemented in two steps. First, the coefficients :math:`c_i` are used to prepares the state:

    .. math::

        |\phi\rangle = \sum_i^m c_i |i\rangle,

    where :math:`|i\rangle` is a computational basis states and :math:`m` is the number of terms
    in the superposition. This is done using the
    :class:`~.StatePrep` template in the fisrt :math:`\lceil \log_2 m \rceil` qubits. Note that the number of qubits depends on the number of terms in the superposition, which helps to reduce the complexity of the operation.

    The second step permutes the basis states prepared previously to
    the target basis states:

    .. math::

        |i\rangle \rightarrow |b_i\rangle.

    This block maps the elements one by one using an auxiliary qubit.
    This can be done in three separate steps:

    1. By using a multi-controlled NOT gate, check if the input state is :math:`|i\rangle` and
    store the information in the auxiliary qubit. If the state is :math:`|i\rangle` the auxiliary
    qubit will be in the :math:`|1\rangle` state.

    2. If the auxiliary qubit is in the :math:`|1\rangle` state, the input state is modified by applying
    ``X`` gates to the bits that are different between :math:`|i\rangle` and :math:`|b_i\rangle`.

    3. By using a multi-controlled ``NOT`` gate, check if the final state is :math:`|b_i\rangle` and
    return the auxiliary qubit back to :math:`|0\rangle` state.

    Applying all these together prepares the desired superposition:

    .. math::

        |\phi\rangle = \sum_i^m c_i |b_i\rangle.

    The decomposition has a complexity that grows linearly with the number of terms in the superposition,
    unlike other methods such as :class:`~.MottonenStatePreparation` that grows exponentially
    with the number of qubits.

### `compute_decomposition`

```python
def compute_decomposition(coeffs, bases, wires, work_wire)
```

Representation of the operator as a product of other operators.

Args:
    coeffs (tensor-like[float]): normalized coefficients of the superposition
    bases (tensor-like[int]): basis states of the superposition
    wires (Sequence[int]): wires that the operator acts on
    work_wire (Union[Wires, int, str]): the auxiliary wire used for the permutation

Returns:
    list[.Operator]: Decomposition of the operator

**Example**

>>> ops = qp.Superposition(np.sqrt([1/2, 1/2]), [[1, 1], [0, 0]], [0, 1], 2).decomposition()
>>> from pprint import pprint
>>> pprint(ops)
[StatePrep(array([0.707..., 0.707...]), wires=[1]),
MultiControlledX(wires=[0, 1, 2], control_values=[False, True]),
CNOT(wires=[2, 0]),
Toffoli(wires=[0, 1, 2])]

### `bases`

```python
def bases(self)
```

List of basis states :math:`|b_i\rangle`.

### `work_wire`

```python
def work_wire(self)
```

The auxiliary wire used for the permutation.

### `coeffs`

```python
def coeffs(self)
```

List of coefficients :math:`c_i`.
