---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/n_local/pauli_two_design.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/n_local/pauli_two_design.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/n_local/pauli_two_design.py`

The Random Pauli circuit class.

## `pauli_two_design`

```python
def pauli_two_design(num_qubits: int, reps: int=3, seed: int | None=None, insert_barriers: bool=False, parameter_prefix: str='θ', name: str='PauliTwoDesign') -> QuantumCircuit
```

Construct a Pauli 2-design ansatz.

This class implements a particular form of a 2-design circuit [1], which is frequently studied
in quantum machine learning literature, such as, e.g., the investigation of Barren plateaus in
variational algorithms [2].

The circuit consists of alternating rotation and entanglement layers with
an initial layer of :math:`\sqrt{H} = RY(\pi/4)` gates.
The rotation layers contain single qubit Pauli rotations, where the axis is chosen uniformly
at random to be X, Y or Z. The entanglement layers are comprised of pairwise CZ gates
with a total depth of 2.

For instance, the circuit could look like this:

.. parsed-literal::

         ┌─────────┐┌──────────┐       ░ ┌──────────┐       ░  ┌──────────┐
    q_0: ┤ RY(π/4) ├┤ RZ(θ[0]) ├─■─────░─┤ RY(θ[4]) ├─■─────░──┤ RZ(θ[8]) ├
         ├─────────┤├──────────┤ │     ░ ├──────────┤ │     ░  ├──────────┤
    q_1: ┤ RY(π/4) ├┤ RZ(θ[1]) ├─■──■──░─┤ RY(θ[5]) ├─■──■──░──┤ RX(θ[9]) ├
         ├─────────┤├──────────┤    │  ░ ├──────────┤    │  ░ ┌┴──────────┤
    q_2: ┤ RY(π/4) ├┤ RX(θ[2]) ├─■──■──░─┤ RY(θ[6]) ├─■──■──░─┤ RX(θ[10]) ├
         ├─────────┤├──────────┤ │     ░ ├──────────┤ │     ░ ├───────────┤
    q_3: ┤ RY(π/4) ├┤ RZ(θ[3]) ├─■─────░─┤ RX(θ[7]) ├─■─────░─┤ RY(θ[11]) ├
         └─────────┘└──────────┘       ░ └──────────┘       ░ └───────────┘

Examples:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:

    from qiskit.circuit.library import pauli_two_design
    circuit = pauli_two_design(4, reps=2, seed=5, insert_barriers=True)
    circuit.draw("mpl")

Args:
    num_qubits: The number of qubits of the Pauli Two-Design circuit.
    reps: Specifies how often a block consisting of a rotation layer and entanglement
        layer is repeated.
    seed: The seed for randomly choosing the axes of the Pauli rotations.
    parameter_prefix: The prefix used for the rotation parameters.
    insert_barriers: If ``True``, barriers are inserted in between each layer. If ``False``,
        no barriers are inserted. Defaults to ``False``.
    name: The circuit name.

Returns:
    A Pauli 2-design circuit.

References:

[1] Nakata et al., Unitary 2-designs from random X- and Z-diagonal unitaries.
`arXiv:1502.07514 <https://arxiv.org/pdf/1502.07514.pdf>`_

[2] McClean et al., Barren plateaus in quantum neural network training landscapes.
`arXiv:1803.11173 <https://arxiv.org/pdf/1803.11173.pdf>`_

## `PauliTwoDesign`

```python
class PauliTwoDesign(TwoLocal)
```

The Pauli Two-Design ansatz.

This class implements a particular form of a 2-design circuit [1], which is frequently studied
in quantum machine learning literature, such as the investigation of barren plateaus in
variational algorithms [2].

The circuit consists of alternating rotation and entanglement layers with
an initial layer of :math:`\sqrt{H} = RY(\pi/4)` gates.
The rotation layers contain single qubit Pauli rotations, where the axis is chosen uniformly
at random to be X, Y or Z. The entanglement layers are comprised of pairwise CZ gates
with a total depth of 2.

For instance, the circuit could look like this (but note that choosing a different seed
yields different Pauli rotations).

.. code-block:: text

         ┌─────────┐┌──────────┐       ░ ┌──────────┐       ░  ┌──────────┐
    q_0: ┤ RY(π/4) ├┤ RZ(θ[0]) ├─■─────░─┤ RY(θ[4]) ├─■─────░──┤ RZ(θ[8]) ├
         ├─────────┤├──────────┤ │     ░ ├──────────┤ │     ░  ├──────────┤
    q_1: ┤ RY(π/4) ├┤ RZ(θ[1]) ├─■──■──░─┤ RY(θ[5]) ├─■──■──░──┤ RX(θ[9]) ├
         ├─────────┤├──────────┤    │  ░ ├──────────┤    │  ░ ┌┴──────────┤
    q_2: ┤ RY(π/4) ├┤ RX(θ[2]) ├─■──■──░─┤ RY(θ[6]) ├─■──■──░─┤ RX(θ[10]) ├
         ├─────────┤├──────────┤ │     ░ ├──────────┤ │     ░ ├───────────┤
    q_3: ┤ RY(π/4) ├┤ RZ(θ[3]) ├─■─────░─┤ RX(θ[7]) ├─■─────░─┤ RY(θ[11]) ├
         └─────────┘└──────────┘       ░ └──────────┘       ░ └───────────┘

Examples:

    .. plot::
       :alt: Circuit diagram output by the previous code.
       :include-source:

       from qiskit.circuit.library import PauliTwoDesign
       circuit = PauliTwoDesign(4, reps=2, seed=5, insert_barriers=True)
       circuit.draw('mpl')

.. seealso::

    The :func:`.pauli_two_design` function constructs the functionally same circuit, but faster.

References:

    [1]: Nakata et al., Unitary 2-designs from random X- and Z-diagonal unitaries.
        `arXiv:1502.07514 <https://arxiv.org/pdf/1502.07514.pdf>`_

    [2]: McClean et al., Barren plateaus in quantum neural network training landscapes.
         `arXiv:1803.11173 <https://arxiv.org/pdf/1803.11173.pdf>`_

### `__init__`

```python
def __init__(self, num_qubits: int | None=None, reps: int=3, seed: int | None=None, insert_barriers: bool=False, name: str='PauliTwoDesign')
```

Args:
    num_qubits: The number of qubits of the Pauli Two-Design circuit.
    reps: Specifies how often a block consisting of a rotation layer and entanglement
        layer is repeated.
    seed: The seed for randomly choosing the axes of the Pauli rotations.
    insert_barriers: If ``True``, barriers are inserted in between each layer. If ``False``,
        no barriers are inserted. Defaults to ``False``.
    name: The name to use for the generated circuit.

### `num_parameters_settable`

```python
def num_parameters_settable(self) -> int
```

Return the number of settable parameters.

Returns:
    The number of possibly distinct parameters.
