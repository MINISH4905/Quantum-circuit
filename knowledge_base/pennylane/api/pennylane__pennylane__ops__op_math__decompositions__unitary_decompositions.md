---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/ops/op_math/decompositions/unitary_decompositions.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/ops/op_math/decompositions/unitary_decompositions.py
license: Apache-2.0
---

## Module `pennylane/ops/op_math/decompositions/unitary_decompositions.py`

This module defines decomposition functions for unitary matrices.

## `one_qubit_decomposition`

```python
def one_qubit_decomposition(U, wire, rotations='ZYZ', return_global_phase=False)
```

Decompose a one-qubit unitary :math:`U` in terms of elementary operations.

Any one qubit unitary operation can be implemented up to a global phase by composing
RX, RY, and RZ gates. Currently supported values for ``rotations`` are "rot", "ZYZ",
"XYX", "XZX", and "ZXZ".

Args:
    U (tensor): A :math:`2 \times 2` unitary matrix.
    wire (Union[Wires, Sequence[int] or int]): The wire on which to apply the operation.
    rotations (str): A string defining the sequence of rotations to decompose :math:`U` into.
    return_global_phase (bool): Whether to return the global phase as a ``qp.GlobalPhase(-alpha)``
        as the last element of the returned list of operations.

Returns:
    list[Operation]: A list of gates which when applied in the order of appearance in the list
        is equivalent to the unitary :math:`U` up to a global phase. If ``return_global_phase=True``,
        the global phase is returned as the last element of the list.

**Example**

>>> from pprint import pprint
>>> U = np.array([[1, 1], [1, -1]]) / np.sqrt(2)  # Hadamard
>>> decomp = qp.ops.one_qubit_decomposition(U, 0, rotations='ZYZ', return_global_phase=True)
>>> pprint(decomp)
[RZ(np.float64(3.14159...), wires=[0]),
 RY(np.float64(1.57079...), wires=[0]),
 RZ(np.float64(0.0), wires=[0]),
 GlobalPhase(np.float64(-1.57079...), wires=[])]
>>> decomp = qp.ops.one_qubit_decomposition(U, 0, rotations='XZX', return_global_phase=True)
>>> pprint(decomp)
[RX(np.float64(1.57079...), wires=[0]),
 RZ(np.float64(1.57079...), wires=[0]),
 RX(np.float64(1.57079...), wires=[0]),
 GlobalPhase(np.float64(-1.57079...), wires=[])]

## `two_qubit_decomposition`

```python
def two_qubit_decomposition(U, wires)
```

Decompose a two-qubit unitary :math:`U` in terms of elementary operations.

It is known that an arbitrary two-qubit operation can be implemented using a
maximum of 3 CNOTs. This transform first determines the required number of
CNOTs, then decomposes the operator into a circuit with a fixed form.  These
decompositions are based a number of works by Shende, Markov, and Bullock
`(1) <https://arxiv.org/abs/quant-ph/0308033>`__, `(2)
<https://arxiv.org/abs/quant-ph/0308045v3>`__, `(3)
<https://web.eecs.umich.edu/~imarkov/pubs/conf/spie04-2qubits.pdf>`__,
though we note that many alternative decompositions are possible.

For the 3-CNOT case, we recover the following circuit, which is Figure 2 in
reference (1) above:

.. figure:: ../../_static/two_qubit_decomposition_3_cnots.svg
    :align: center
    :width: 70%
    :target: javascript:void(0);

where :math:`A, B, C, D` are :math:`SU(2)` operations, and the rotation angles are
computed based on features of the input unitary :math:`U`.

For the 2-CNOT case, the decomposition is based on the
real-trace criterion of Proposition III.3 in reference (2).
Whenever :math:`trace(\gamma(U))` has real coefficients (equivalently :math:`trace(\gamma(U))` ∈ R),
the decomposition uses exactly two CNOT gates.

For a single CNOT, we have a CNOT surrounded by one :math:`SU(2)` per wire on each
side.  The special case of no CNOTs simply returns a tensor product of two
:math:`SU(2)` operations.

This decomposition can be applied automatically to all two-qubit
:class:`~.QubitUnitary` operations using the
:func:`~pennylane.transforms.unitary_to_rot` transform.

.. warning::

    This decomposition will not be differentiable in the ``unitary_to_rot``
    transform if the matrix being decomposed depends on parameters with
    respect to which we would like to take the gradient.  See the
    documentation of :func:`~pennylane.transforms.unitary_to_rot` for
    explicit examples of the differentiable and non-differentiable cases.

Args:
    U (tensor): A :math:`4 \times 4` unitary matrix.
    wires (Union[Wires, Sequence[int] or int]): The wires on which to apply the operation.

Returns:
    list[Operation]: A list of operations that represent the decomposition
    of the matrix U.

**Example**

Suppose we create a random element of :math:`U(4)`, and would like to decompose it
into elementary gates in our circuit.

>>> from scipy.stats import unitary_group
>>> U = unitary_group.rvs(4, random_state=42)

We can compute its decompositon like so:

>>> from pprint import pprint
>>> decomp = qp.ops.two_qubit_decomposition(np.array(U), wires=[0, 1])
>>> pprint(decomp) # doctest: +SKIP
[QubitUnitary(array([[ 0.35935497-0.35945703j, -0.81150079+0.28830732j],
       [ 0.81150079+0.28830732j,  0.35935497+0.35945703j]]), wires=[0]),
 QubitUnitary(array([[ 0.73465919-0.15696895j,  0.51629531-0.41118825j],
       [-0.51629531-0.41118825j,  0.73465919+0.15696895j]]), wires=[1]),
 CNOT(wires=[1, 0]),
 RZ(np.float64(0.028408953417448358), wires=[0]),
 RY(np.float64(0.6226823676455966), wires=[1]),
 CNOT(wires=[0, 1]),
 RY(np.float64(-0.7259987841675299), wires=[1]),
 CNOT(wires=[1, 0]),
 QubitUnitary(array([[ 0.85429569-0.34743933j,  0.14569083+0.35810469j],
       [-0.14569083+0.35810469j,  0.85429569+0.34743933j]]), wires=[0]),
 QubitUnitary(array([[-0.30052527-0.4826478j ,  0.74833925-0.34164898j],
       [-0.74833925-0.34164898j, -0.30052527+0.4826478j ]]), wires=[1]),
 GlobalPhase(np.float64(0.07394316416802127), wires=[])]

## `multi_qubit_decomposition`

```python
def multi_qubit_decomposition(U, wires)
```

Decompose a multi-qubit unitary :math:`U` in terms of elementary operations.

The n-qubit unitary :math:`U`, with :math:`n > 1`, is decomposed into four (:math:`n-1`)-qubit
unitaries (:class:`~.QubitUnitary`) and three multiplexers (:class:`~.SelectPauliRot`)
using the cosine-sine decomposition.
This implementation is based on `arXiv:quant-ph/0504100 <https://arxiv.org/pdf/quant-ph/0504100>`__.

Args:
    U (tensor): A :math:`2^n \times 2^n` unitary matrix with :math:`n > 1`.
    wires (Union[Wires, Sequence[int] or int]): The wires on which to apply the operation.

Returns:
    list[Operation]: A list of operations that represent the decomposition
    of the matrix U.

**Example**

.. code-block:: pycon

    >>> matrix_target = qp.matrix(qp.QFT([0,1,2]))
    >>> ops = qp.ops.multi_qubit_decomposition(matrix_target, [0,1,2])
    >>> matrix_decomposition = qp.matrix(qp.prod(*ops[::-1]), wire_order = [0,1,2])
    >>> print([op.name for op in ops])
    ['QubitUnitary', 'SelectPauliRot', 'QubitUnitary', 'SelectPauliRot', 'QubitUnitary', 'SelectPauliRot', 'QubitUnitary']
    >>> print(np.allclose(matrix_decomposition, matrix_target))
    True

## `make_one_qubit_unitary_decomposition`

```python
def make_one_qubit_unitary_decomposition(su2_rule, su2_resource, name='')
```

Wrapper around a naive one-qubit decomposition rule that adds a global phase.

## `two_qubit_decomp_rule`

```python
def two_qubit_decomp_rule(U, wires, **__)
```

The decomposition rule for a two-qubit unitary.

## `multi_qubit_decomp_rule`

```python
def multi_qubit_decomp_rule(U, wires, **__)
```

The decomposition rule for a multi-qubit unitary.
