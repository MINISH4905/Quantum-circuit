---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/state_preparations/mottonen.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/state_preparations/mottonen.py
license: Apache-2.0
---

## Module `pennylane/templates/state_preparations/mottonen.py`

Contains the MottonenStatePreparation template.

## `gray_code`

```python
def gray_code(rank)
```

Generates the
`Gray code <https://en.wikipedia.org/wiki/Gray_code>`__
of given rank, as numeric output.

Args:
    rank (int): rank of the Gray code (i.e. number of bits)

Returns:
    np.ndarray[int]: Array of ``2**rank`` integers that make up the Gray code.

## `compute_theta`

```python
def compute_theta(alpha: TensorLike, num_qubits: int | None=None)
```

Maps the input angles ``alpha`` of the multi-controlled rotations decomposition of a
uniformly controlled rotation to the rotation angles used in the
`Gray code <https://en.wikipedia.org/wiki/Gray_code>`__ implementation.
This function uses the fact that the transformation given by Eq. (3) in
`Möttönen et al. (2004) <https://arxiv.org/abs/quant-ph/0407010>`_ is equal to a Walsh-Hadamard
transform followed by some permutations, which can be expressed as a ladder of CNOT gates
applied to the angles, when interpreting them as a quantum state.

Args:
    alpha (tensor_like): The array or tensor to be transformed. Must have a length that
        is a power of two.
    num_qubits (int): Number of qubits. If not given, it will be computed from ``alpha``.
        If given, it should match the trailing dimension of ``alpha``.

Returns:
    tensor_like: The transformed tensor with the same shape as the input ``alpha``.

Due to the execution of the transform as a sequence of tensor multiplications
with shapes ``(2, 2), (2, 2,... 2)->(2, 2,... 2)``, the theoretical scaling of this
method is the same as the one for the
`Fast Walsh-Hadamard transform <https://en.wikipedia.org/wiki/Fast_Walsh-Hadamard_transform>`__:
On :math:`n` qubits, there are :math:`n` calls to ``tensordot``, each multiplying a ``(2, 2)``
matrix to a ``(2,)*num_qubits`` vector, with a single axis being contracted. This means
that there are :math:`n` operations with a floating point operation count of
``4 * 2**(num_qubits-1)``, where ``4`` is the cost of a single ``(2, 2) @ (2,)`` contraction
and ``2**(n-1)`` is the number of copies due to the non-contracted :math:`n-1` axes.
Due to the large internal speedups of compiled matrix multiplication and compatibility
with autodifferentiation frameworks, the approach taken here is favourable over a manual
realization of the FWHT unless memory limitations restrict the creation of intermediate
arrays, which would make in-place techniques favourable.

Similarly, the permutation can be applied by contracting the angles with the reshaped CNOT
matrix.

## `MottonenStatePreparation`

```python
class MottonenStatePreparation(Operation)
```

Prepares an arbitrary state on the given wires using a decomposition into gates developed
by `Möttönen et al. (2004) <https://arxiv.org/abs/quant-ph/0407010>`_.

The state is prepared via a sequence
of uniformly controlled rotations. A uniformly controlled rotation on a target qubit is
composed from all possible controlled rotations on the qubit and can be used to address individual
elements of the state vector.

In the work of Möttönen et al., inverse state preparation
is executed by first equalizing the phases of the state vector via uniformly controlled Z rotations,
and then rotating the now real state vector into the direction of the state :math:`|0\rangle` via
uniformly controlled Y rotations.

This code is adapted from code written by Carsten Blank for PennyLane-Qiskit.

.. warning::

    Due to non-trivial classical processing of the state vector,
    this template is not always fully differentiable.

Args:
    state_vector (tensor_like): Input array of shape ``(2^n,)``, where ``n`` is the number of wires
        the state preparation acts on. The input array must be normalized.
    wires (Iterable): wires that the template acts on

Example:

    ``MottonenStatePreparation`` creates any arbitrary state on the given wires depending on the input state vector.

    .. code-block:: python

        dev = qp.device('default.qubit', wires=3)

        @qp.qnode(dev)
        def circuit(state):
            qp.MottonenStatePreparation(state_vector=state, wires=range(3))
            return qp.state()

        state = np.array([1, 2j, 3, 4j, 5, 6j, 7, 8j])
        state = state / np.linalg.norm(state)

        print(qp.draw(circuit, level="device", max_length=80)(state))

    .. code-block::

        0: ──RY(2.35)─╭●───────────╭●──────────────╭●────────────────────────╭●
        1: ──RY(2.09)─╰X──RY(0.21)─╰X─╭●───────────│────────────╭●───────────│─
        2: ──RY(1.88)─────────────────╰X──RY(0.10)─╰X──RY(0.08)─╰X──RY(0.15)─╰X

        ──╭●────────╭●────╭●────╭●─╭GlobalPhase(-0.79)─┤ ╭State
        ──╰X────────╰X─╭●─│──╭●─│──├GlobalPhase(-0.79)─┤ ├State
        ───RZ(1.57)────╰X─╰X─╰X─╰X─╰GlobalPhase(-0.79)─┤ ╰State

    The state preparation can be checked by running:

    >>> print(np.allclose(state, circuit(state)))
    True

### `compute_decomposition`

```python
def compute_decomposition(state_vector, wires, **_)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.MottonenStatePreparation.decomposition`.

Args:
    state_vector (tensor_like): Normalized state vector of shape ``(2^len(wires),)``
    wires (Any or Iterable[Any]): wires that the operator acts on

Returns:
    list[.Operator]: decomposition of the operator

**Example**

>>> state_vector = torch.tensor([0.5, 0.5, 0.5, 0.5])
>>> ops = qp.MottonenStatePreparation.compute_decomposition(state_vector, wires=["a", "b"])
>>> from pprint import pprint
>>> pprint(ops)
[RY(tensor(1.5708, dtype=torch.float64), wires=['a']),
RY(tensor(1.5708, dtype=torch.float64), wires=['b']),
CNOT(wires=['a', 'b']),
CNOT(wires=['a', 'b'])]
