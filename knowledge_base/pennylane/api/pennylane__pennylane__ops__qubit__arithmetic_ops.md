---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/qubit/arithmetic_ops.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/qubit/arithmetic_ops.py
license: Apache-2.0
---

## Module `pennylane/ops/qubit/arithmetic_ops.py`

This submodule contains the discrete-variable quantum operations that perform
arithmetic operations on their input states.

## `QubitCarry`

```python
class QubitCarry(Operation)
```

QubitCarry(wires)
Apply the ``QubitCarry`` operation to four input wires.

This operation performs the transformation:

.. math::
    |a\rangle |b\rangle |c\rangle |d\rangle \rightarrow |a\rangle |b\rangle |b\oplus c\rangle |bc \oplus d\oplus (b\oplus c)a\rangle

.. figure:: ../../_static/ops/QubitCarry.svg
    :align: center
    :width: 60%
    :target: javascript:void(0);

See `here <https://arxiv.org/abs/quant-ph/0008033v1>`__ for more information.

.. note::
    The first wire should be used to input a carry bit from previous operations. The final wire
    holds the carry bit of this operation and the input state on this wire should be
    :math:`|0\rangle`.

**Details:**

* Number of wires: 4
* Number of parameters: 0

Args:
    wires (Sequence[int]): the wires the operation acts on

**Example**

The ``QubitCarry`` operation maps the state :math:`|0110\rangle` to :math:`|0101\rangle`, where
the last qubit denotes the carry value:

.. code-block:: python

    import itertools

    input_bitstring = (0, 1, 1, 0)

    @qp.qnode(qp.device("default.qubit"))
    def circuit(basis_state):
        qp.BasisState(basis_state, wires=[0, 1, 2, 3])
        qp.QubitCarry(wires=[0, 1, 2, 3])
        return qp.probs(wires=[0, 1, 2, 3])

    probs =  circuit(input_bitstring)
    probs_indx = np.argwhere(probs == 1).flatten()[0]
    bitstrings = list(itertools.product(range(2), repeat=4))
    output_bitstring = bitstrings[probs_indx]

The output bitstring is

>>> output_bitstring
(0, 1, 0, 1)

The action of ``QubitCarry`` is to add wires ``1`` and ``2``. The modulo-two result is output
in wire ``2`` with a carry value output in wire ``3``. In this case, :math:`1 \oplus 1 = 0` with
a carry, so we have:

>>> bc_sum = output_bitstring[2]
>>> bc_sum
0
>>> carry = output_bitstring[3]
>>> carry
1

### `compute_matrix`

```python
def compute_matrix() -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.QubitCarry.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.QubitCarry.compute_matrix())
[[1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0]
 [0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0]
 [0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0]
 [0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0]
 [0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0]
 [0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0]
 [0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0]
 [0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0]
 [0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0]
 [0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0]
 [0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0]
 [0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0]
 [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1]
 [0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0]
 [0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0]
 [0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0]]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.QubitCarry.decomposition`.

Args:
    wires (Iterable[Any], Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition of the operator

**Example:**

>>> qp.QubitCarry.compute_decomposition((0,1,2,4))
[Toffoli(wires=[1, 2, 4]), CNOT(wires=[1, 2]), Toffoli(wires=[0, 2, 4])]

## `QubitSum`

```python
class QubitSum(Operation)
```

QubitSum(wires)
Apply a ``QubitSum`` operation on three input wires.

This operation performs the following transformation:

.. math::
    |a\rangle |b\rangle |c\rangle \rightarrow |a\rangle |b\rangle |a\oplus b\oplus c\rangle


.. figure:: ../../_static/ops/QubitSum.svg
    :align: center
    :width: 40%
    :target: javascript:void(0);

See `here <https://arxiv.org/abs/quant-ph/0008033v1>`__ for more information.

**Details:**

* Number of wires: 3
* Number of parameters: 0

Args:
    wires (Sequence[int]): the wires the operation acts on

**Example**

The ``QubitSum`` operation maps the state :math:`|010\rangle` to :math:`|011\rangle`, with the
final wire holding the modulo-two sum of the first two wires:

.. code-block:: python

    import itertools

    input_bitstring = (0, 1, 0)

    @qp.qnode(qp.device("default.qubit"))
    def circuit(basis_state):
        qp.BasisState(basis_state, wires = [0, 1, 2])
        qp.QubitSum(wires=[0, 1, 2])
        return qp.probs(wires=[0, 1, 2])

    probs = circuit(input_bitstring)
    probs_indx = np.argwhere(probs == 1).flatten()[0]
    bitstrings = list(itertools.product(range(2), repeat=3))
    output_bitstring = bitstrings[probs_indx]

The output bitstring is

>>> output_bitstring
(0, 1, 1)

The action of ``QubitSum`` is to add wires ``0``, ``1``, and ``2``. The modulo-two result is
output in wire ``2``. In this case, :math:`0 \oplus 1 \oplus 0 = 1`, so we have:

>>> output_bitstring[2]
1

### `compute_matrix`

```python
def compute_matrix() -> np.ndarray
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.QubitSum.matrix`

Returns:
    ndarray: matrix

**Example**

>>> print(qp.QubitSum.compute_matrix())
[[1 0 0 0 0 0 0 0]
 [0 1 0 0 0 0 0 0]
 [0 0 0 1 0 0 0 0]
 [0 0 1 0 0 0 0 0]
 [0 0 0 0 0 1 0 0]
 [0 0 0 0 1 0 0 0]
 [0 0 0 0 0 0 1 0]
 [0 0 0 0 0 0 0 1]]

### `compute_decomposition`

```python
def compute_decomposition(wires: WiresLike) -> qp.operation.Operator
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.QubitSum.decomposition`.

Args:
    wires (Iterable[Any], Wires): wires that the operator acts on

Returns:
    list[Operator]: decomposition of the operator

**Example:**

>>> qp.QubitSum.compute_decomposition((0,1,2))
[CNOT(wires=[1, 2]), CNOT(wires=[0, 2])]

## `IntegerComparator`

```python
class IntegerComparator(Operation)
```

IntegerComparator(value, geq, wires)
Apply a controlled Pauli X gate using integer comparison as the condition.

Given a basis state :math:`\vert n \rangle`, where :math:`n` is a positive integer, and a fixed positive
integer :math:`L`, flip a target qubit if :math:`n \geq L`. Alternatively, the flipping condition can
be :math:`n < L`.

**Details:**

* Number of wires: Any (the operation can act on any number of wires)
* Number of parameters: 1
* Gradient recipe: None

.. note::

    This operation has one parameter: ``value``. However, ``value`` is simply an integer that is required to define
    the condition upon which a Pauli X gate is applied to the target wire. Given that, IntegerComparator has a
    gradient of zero; ``value`` is a non-differentiable parameter.

Args:
    value (int): The value :math:`L` that the state's decimal representation is compared against.
    geq (bool): If set to ``True``, the comparison made will be :math:`n \geq L`. If ``False``, the comparison
        made will be :math:`n < L`.
    wires (Union[Wires, Sequence[int], or int]): Control wire(s) followed by a single target wire where
        the operation acts on.

**Example**

>>> dev = qp.device("default.qubit", wires=3)
>>> @qp.qnode(dev)
... def circuit(state, value, geq):
...     qp.BasisState(np.array(state), wires=range(3))
...     qp.IntegerComparator(value, geq=geq, wires=range(3))
...     return qp.state()
>>> circuit([1, 0, 1], 1, True).reshape(2, 2, 2)[1, 0, 0]
np.complex128(1+0j)
>>> circuit([0, 1, 0], 3, False).reshape(2, 2, 2)[0, 1, 1]
np.complex128(1+0j)

### `compute_matrix`

```python
def compute_matrix(control_wires: WiresLike, value: int | None=None, geq: bool=True, **kwargs) -> TensorLike
```

Representation of the operator as a canonical matrix in the computational basis (static method).

The canonical matrix is the textbook matrix representation that does not consider wires.
Implicitly, this assumes that the wires of the operator correspond to the global wire order.

.. seealso:: :meth:`~.IntegerComparator.matrix`

Args:
    control_wires (Union[Wires, Sequence[int], or int]): wires to place controls on
    value (int): The value :math:`L` that the state's decimal representation is compared against.
    geq (bool): If set to `True`, the comparison made will be :math:`n \geq L`. If `False`, the comparison
        made will be :math:`n < L`.

Returns:
   tensor_like: matrix representation

**Example**

>>> print(qp.IntegerComparator.compute_matrix(control_wires=[0, 1], value=2))
[[1. 0. 0. 0. 0. 0. 0. 0.]
 [0. 1. 0. 0. 0. 0. 0. 0.]
 [0. 0. 1. 0. 0. 0. 0. 0.]
 [0. 0. 0. 1. 0. 0. 0. 0.]
 [0. 0. 0. 0. 0. 1. 0. 0.]
 [0. 0. 0. 0. 1. 0. 0. 0.]
 [0. 0. 0. 0. 0. 0. 0. 1.]
 [0. 0. 0. 0. 0. 0. 1. 0.]]
>>> print(qp.IntegerComparator.compute_matrix(control_wires=[0, 1], value=2, geq=False))
[[0. 1. 0. 0. 0. 0. 0. 0.]
 [1. 0. 0. 0. 0. 0. 0. 0.]
 [0. 0. 0. 1. 0. 0. 0. 0.]
 [0. 0. 1. 0. 0. 0. 0. 0.]
 [0. 0. 0. 0. 1. 0. 0. 0.]
 [0. 0. 0. 0. 0. 1. 0. 0.]
 [0. 0. 0. 0. 0. 0. 1. 0.]
 [0. 0. 0. 0. 0. 0. 0. 1.]]

### `compute_decomposition`

```python
def compute_decomposition(value: int, wires: WiresLike, geq: bool=True, work_wires: WiresLike | None=None, **kwargs) -> list[qp.operation.Operator]
```

Representation of the operator as a product of other operators (static method).

.. math:: O = O_1 O_2 \dots O_n.

.. seealso:: :meth:`~.IntegerComparator.decomposition`.

Args:
    value (int): The value :math:`L` that the state's decimal representation is compared against.
    geq (bool): If set to ``True``, the comparison made will be :math:`n \geq L`. If ``False``, the comparison
        made will be :math:`n < L`.
    wires (Union[Wires, Sequence[int], or int]): Control wire(s) followed by a single target wire where
        the operation acts on.

Returns:
    list[Operator]: decomposition into lower level operations

**Example:**

>>> print(qp.draw(qp.IntegerComparator.compute_decomposition)(4, wires=[0, 1, 2, 3]))
0: ─╭●────╭●────╭●────┤
1: ─├●──X─├●────├●──X─┤
2: ─│─────├●──X─├●──X─┤
3: ─╰X────╰X────╰X────┤
