---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/templates/subroutines/qchem/all_singles_doubles.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/qchem/all_singles_doubles.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/qchem/all_singles_doubles.py`

Contains the AllSinglesDoubles template.

## `AllSinglesDoubles`

```python
class AllSinglesDoubles(Operation)
```

Builds a quantum circuit to prepare correlated states of molecules
by applying all :class:`~.pennylane.SingleExcitation` and
:class:`~.pennylane.DoubleExcitation` operations to
the initial Hartree-Fock state.

The template initializes the :math:`n`-qubit system to encode
the input Hartree-Fock state and applies the particle-conserving
:class:`~.pennylane.SingleExcitation` and
:class:`~.pennylane.DoubleExcitation` operations which are implemented as
`Givens rotations <https://en.wikipedia.org/wiki/Givens_rotation>`_ that act
on the subspace of two and four qubits, respectively. The total number of
excitation gates and the indices of the qubits they act on are obtained
using the :func:`~.excitations` function.

For example, the quantum circuit for the case of two electrons and six qubits
is sketched in the figure below:

|

.. figure:: ../../_static/templates/subroutines/all_singles_doubles.png
    :align: center
    :width: 70%
    :target: javascript:void(0);

|

In this case, we have four single and double excitations that preserve the total-spin
projection of the Hartree-Fock state. The :class:`~.pennylane.SingleExcitation` gate
:math:`G` act on the qubits ``[0, 2], [0, 4], [1, 3], [1, 5]`` as indicated by the
squares, while the :class:`~.pennylane.DoubleExcitation` operation :math:`G^{(2)}` is
applied to the qubits ``[0, 1, 2, 3], [0, 1, 2, 5], [0, 1, 2, 4], [0, 1, 4, 5]``.

The resulting unitary conserves the number of particles and prepares the
:math:`n`-qubit system in a superposition of the initial Hartree-Fock state and
other states encoding multiply-excited configurations.

Args:
    weights (TensorLike): size ``(len(singles) + len(doubles),)`` tensor containing the
        angles entering the :class:`~.pennylane.SingleExcitation` and
        :class:`~.pennylane.DoubleExcitation` operations, in that order
    wires (WiresLike): wires that the template acts on
    hf_state (Sequence[int]): Length ``len(wires)`` occupation-number vector representing the
        Hartree-Fock state. ``hf_state`` is used to initialize the wires.
    singles (Sequence[tuple[int, int]] | None): An optional sequence of lists with the indices of the two qubits
        the :class:`~.pennylane.SingleExcitation` operations act on
    doubles (Sequence[tuple[int, int, int, int]] | None): An optional sequence of lists with the indices of the four qubits
        the :class:`~.pennylane.DoubleExcitation` operations act on

.. details::
    :title: Usage Details

    Notice that:

    #. The number of wires has to be equal to the number of spin orbitals included in
       the active space.

    #. The single and double excitations can be generated with the function
       :func:`~.excitations`. See example below.

    An example of how to use this template is shown below:

    .. code-block:: python

        import pennylane as qp
        import numpy as np

        electrons = 2
        qubits = 4

        # Define the HF state
        hf_state = qp.qchem.hf_state(electrons, qubits)

        # Generate all single and double excitations
        singles, doubles = qp.qchem.excitations(electrons, qubits)

        # Define the device
        dev = qp.device('default.qubit', wires=qubits)

        wires = range(qubits)

        @qp.qnode(dev)
        def circuit(weights, hf_state, singles, doubles):
            qp.templates.AllSinglesDoubles(weights, wires, hf_state, singles, doubles)
            return qp.expval(qp.Z(0))

        # Evaluate the QNode for a given set of parameters
        params = np.random.normal(0, np.pi, len(singles) + len(doubles))
        circuit(params, hf_state, singles=singles, doubles=doubles)

### `compute_decomposition`

```python
def compute_decomposition(weights, wires, hf_state, singles, doubles)
```

Representation of the operator as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.



.. seealso:: :meth:`~.AllSinglesDoubles.decomposition`.

Args:
    weights (tensor_like): size ``(len(singles) + len(doubles),)`` tensor containing the
        angles entering the :class:`~.pennylane.SingleExcitation` and
        :class:`~.pennylane.DoubleExcitation` operations, in that order
    wires (Any or Iterable[Any]): wires that the BasisState operator acts on
    hf_state (array[int]): Length ``len(wires)`` occupation-number vector representing the
        Hartree-Fock state. ``hf_state`` is used to initialize the wires.
    singles (Sequence[Sequence]): sequence of lists with the indices of the two qubits
        the :class:`~.pennylane.SingleExcitation` operations act on
    doubles (Sequence[Sequence]): sequence of lists with the indices of the four qubits
        the :class:`~.pennylane.DoubleExcitation` operations act on
Returns:
    list[.Operator]: decomposition of the operator

### `shape`

```python
def shape(singles, doubles)
```

Returns the expected shape of the tensor that contains the circuit parameters.

Args:
    singles (Sequence[Sequence]): sequence of lists with the indices of the two qubits
        the :class:`~.pennylane.SingleExcitation` operations act on
    doubles (Sequence[Sequence]): sequence of lists with the indices of the four qubits
        the :class:`~.pennylane.DoubleExcitation` operations act on

Returns:
    tuple(int): shape of the tensor containing the circuit parameters
