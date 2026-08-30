---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/n_local/two_local.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/n_local/two_local.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/n_local/two_local.py`

The two-local gate circuit.

## `TwoLocal`

```python
class TwoLocal(NLocal)
```

The two-local circuit.

The two-local circuit is a parameterized circuit consisting of alternating rotation layers and
entanglement layers. The rotation layers are single qubit gates applied on all qubits.
The entanglement layer uses two-qubit gates to entangle the qubits according to a strategy set
using ``entanglement``. Both the rotation and entanglement gates can be specified as
string (e.g. ``'ry'`` or ``'cx'``), as gate-type (e.g. ``RYGate`` or ``CXGate``) or
as QuantumCircuit (e.g. a 1-qubit circuit or 2-qubit circuit).

A set of default entanglement strategies is provided:

* ``'full'`` entanglement is where each qubit is entangled with all the others.
* ``'linear'`` entanglement is qubit :math:`i` entangled with qubit :math:`i + 1`,
  for all :math:`i \in \{0, 1, ... , n - 2\}`, where :math:`n` is the total number of qubits.
* ``'reverse_linear'`` entanglement is qubit :math:`i` entangled with qubit :math:`i + 1`,
  for all :math:`i \in \{n-2, n-3, ... , 1, 0\}`, where :math:`n` is the total number of qubits.
  Note that if ``entanglement_blocks = 'cx'`` then this option provides the same unitary as
  ``'full'`` with fewer entangling gates.
* ``'pairwise'`` entanglement is one layer where qubit :math:`i` is entangled with qubit
  :math:`i + 1`, for all even values of :math:`i`, and then a second layer where qubit :math:`i`
  is entangled with qubit :math:`i + 1`, for all odd values of :math:`i`.
* ``'circular'`` entanglement is linear entanglement but with an additional entanglement of the
  first and last qubit before the linear part.
* ``'sca'`` (shifted-circular-alternating) entanglement is a generalized and modified version
  of the proposed circuit 14 in `Sim et al. <https://arxiv.org/abs/1905.10876>`__.
  It consists of circular entanglement where the 'long' entanglement connecting the first with
  the last qubit is shifted by one each block.  Furthermore the role of control and target
  qubits are swapped every block (therefore alternating).

The entanglement can further be specified using an entangler map, which is a list of index
pairs, such as

>>> entangler_map = [(0, 1), (1, 2), (2, 0)]

If different entanglements per block should be used, provide a list of entangler maps.
See the examples below on how this can be used.

>>> entanglement = [entangler_map_layer_1, entangler_map_layer_2, ... ]

Barriers can be inserted in between the different layers for better visualization using the
``insert_barriers`` attribute.

For each parameterized gate a new parameter is generated using a
:class:`~qiskit.circuit.library.ParameterVector`. The name of these parameters can be chosen
using the ``parameter_prefix``.

Examples:

    >>> two = TwoLocal(3, 'ry', 'cx', 'linear', reps=2, insert_barriers=True)
    >>> print(two.decompose())  # decompose the layers into standard gates
         ┌──────────┐ ░            ░ ┌──────────┐ ░            ░ ┌──────────┐
    q_0: ┤ Ry(θ[0]) ├─░───■────────░─┤ Ry(θ[3]) ├─░───■────────░─┤ Ry(θ[6]) ├
         ├──────────┤ ░ ┌─┴─┐      ░ ├──────────┤ ░ ┌─┴─┐      ░ ├──────────┤
    q_1: ┤ Ry(θ[1]) ├─░─┤ X ├──■───░─┤ Ry(θ[4]) ├─░─┤ X ├──■───░─┤ Ry(θ[7]) ├
         ├──────────┤ ░ └───┘┌─┴─┐ ░ ├──────────┤ ░ └───┘┌─┴─┐ ░ ├──────────┤
    q_2: ┤ Ry(θ[2]) ├─░──────┤ X ├─░─┤ Ry(θ[5]) ├─░──────┤ X ├─░─┤ Ry(θ[8]) ├
         └──────────┘ ░      └───┘ ░ └──────────┘ ░      └───┘ ░ └──────────┘

    >>> two = TwoLocal(3, ['ry','rz'], 'cz', 'full', reps=1, insert_barriers=True, flatten=True)
    >>> qc = QuantumCircuit(3)
    >>> qc &= two
    >>> print(qc.draw())
         ┌──────────┐┌──────────┐ ░           ░ ┌──────────┐ ┌──────────┐
    q_0: ┤ Ry(θ[0]) ├┤ Rz(θ[3]) ├─░──■──■─────░─┤ Ry(θ[6]) ├─┤ Rz(θ[9]) ├
         ├──────────┤├──────────┤ ░  │  │     ░ ├──────────┤┌┴──────────┤
    q_1: ┤ Ry(θ[1]) ├┤ Rz(θ[4]) ├─░──■──┼──■──░─┤ Ry(θ[7]) ├┤ Rz(θ[10]) ├
         ├──────────┤├──────────┤ ░     │  │  ░ ├──────────┤├───────────┤
    q_2: ┤ Ry(θ[2]) ├┤ Rz(θ[5]) ├─░─────■──■──░─┤ Ry(θ[8]) ├┤ Rz(θ[11]) ├
         └──────────┘└──────────┘ ░           ░ └──────────┘└───────────┘

    >>> entangler_map = [[0, 1], [1, 2], [2, 0]]  # circular entanglement for 3 qubits
    >>> two = TwoLocal(3, 'x', 'crx', entangler_map, reps=1, flatten=True)
    >>> print(two)  # note: no barriers inserted this time!
            ┌───┐                             ┌──────────┐┌───┐
    q_0: |0>┤ X ├─────■───────────────────────┤ Rx(θ[2]) ├┤ X ├
            ├───┤┌────┴─────┐            ┌───┐└─────┬────┘└───┘
    q_1: |0>┤ X ├┤ Rx(θ[0]) ├─────■──────┤ X ├──────┼──────────
            ├───┤└──────────┘┌────┴─────┐└───┘      │     ┌───┐
    q_2: |0>┤ X ├────────────┤ Rx(θ[1]) ├───────────■─────┤ X ├
            └───┘            └──────────┘                 └───┘

    >>> entangler_map = [[0, 3], [0, 2]]  # entangle the first and last two-way
    >>> two = TwoLocal(4, [], 'cry', entangler_map, reps=1, flatten=True)
    >>> circuit = two.compose(two)
    >>> print(circuit.draw())  # note, that the parameters are the same!
    q_0: ─────■───────────■───────────■───────────■──────
              │           │           │           │
    q_1: ─────┼───────────┼───────────┼───────────┼──────
              │      ┌────┴─────┐     │      ┌────┴─────┐
    q_2: ─────┼──────┤ Ry(θ[1]) ├─────┼──────┤ Ry(θ[1]) ├
         ┌────┴─────┐└──────────┘┌────┴─────┐└──────────┘
    q_3: ┤ Ry(θ[0]) ├────────────┤ Ry(θ[0]) ├────────────
         └──────────┘            └──────────┘

    >>> layer_1 = [(0, 1), (0, 2)]
    >>> layer_2 = [(1, 2)]
    >>> two = TwoLocal(3, 'x', 'cx', [layer_1, layer_2], reps=2, insert_barriers=True,
    ... flatten=True)
    >>> print(two)
         ┌───┐ ░            ░ ┌───┐ ░       ░ ┌───┐
    q_0: ┤ X ├─░───■────■───░─┤ X ├─░───────░─┤ X ├
         ├───┤ ░ ┌─┴─┐  │   ░ ├───┤ ░       ░ ├───┤
    q_1: ┤ X ├─░─┤ X ├──┼───░─┤ X ├─░───■───░─┤ X ├
         ├───┤ ░ └───┘┌─┴─┐ ░ ├───┤ ░ ┌─┴─┐ ░ ├───┤
    q_2: ┤ X ├─░──────┤ X ├─░─┤ X ├─░─┤ X ├─░─┤ X ├
         └───┘ ░      └───┘ ░ └───┘ ░ └───┘ ░ └───┘

### `__init__`

```python
def __init__(self, num_qubits: int | None=None, rotation_blocks: str | type | qiskit.circuit.Instruction | QuantumCircuit | list[str | type | qiskit.circuit.Instruction | QuantumCircuit] | None=None, entanglement_blocks: str | type | qiskit.circuit.Instruction | QuantumCircuit | list[str | type | qiskit.circuit.Instruction | QuantumCircuit] | None=None, entanglement: str | list[list[int]] | Callable[[int], list[int]]='full', reps: int=3, skip_unentangled_qubits: bool=False, skip_final_rotation_layer: bool=False, parameter_prefix: str='θ', insert_barriers: bool=False, initial_state: QuantumCircuit | None=None, name: str='TwoLocal', flatten: bool | None=None) -> None
```

Args:
    num_qubits: The number of qubits of the two-local circuit.
    rotation_blocks: The gates used in the rotation layer. Can be specified via the name of
        a gate (e.g. ``'ry'``) or the gate type itself (e.g. :class:`.RYGate`).
        If only one gate is provided, the same gate is applied to each qubit.
        If a list of gates is provided, all gates are applied to each qubit in the provided
        order.
        See the Examples section for more detail.
    entanglement_blocks: The gates used in the entanglement layer. Can be specified in
        the same format as ``rotation_blocks``.
    entanglement: Specifies the entanglement structure. Can be a string (``'full'``,
        ``'linear'``, ``'reverse_linear'``, ``'circular'`` or ``'sca'``),
        a list of integer-pairs specifying the indices
        of qubits entangled with one another, or a callable returning such a list provided with
        the index of the entanglement layer.
        Default to ``'full'`` entanglement.
        Note that if ``entanglement_blocks = 'cx'``, then ``'full'`` entanglement provides the
        same unitary as ``'reverse_linear'`` but the latter option has fewer entangling gates.
        See the Examples section for more detail.
    reps: Specifies how often a block consisting of a rotation layer and entanglement
        layer is repeated.
    skip_unentangled_qubits: If ``True``, the single qubit gates are only applied to qubits
        that are entangled with another qubit. If ``False``, the single qubit gates are applied
        to each qubit in the ansatz. Defaults to ``False``.
    skip_final_rotation_layer: If ``False``, a rotation layer is added at the end of the
        ansatz. If ``True``, no rotation layer is added.
    parameter_prefix: The parameterized gates require a parameter to be defined, for which
        we use instances of :class:`~qiskit.circuit.Parameter`. The name of each parameter will
        be this specified prefix plus its index.
    insert_barriers: If ``True``, barriers are inserted in between each layer. If ``False``,
        no barriers are inserted. Defaults to ``False``.
    initial_state: A :class:`.QuantumCircuit` object to prepend to the circuit.
    name: The name to use for the generated circuit.
    flatten: Set this to ``True`` to output a flat circuit instead of nesting it inside multiple
        layers of gate objects. By default currently the contents of
        the output circuit will be wrapped in nested objects for
        cleaner visualization. However, if you're using this circuit
        for anything besides visualization its **strongly** recommended
        to set this flag to ``True`` to avoid a large performance
        overhead for parameter binding.

### `get_entangler_map`

```python
def get_entangler_map(self, rep_num: int, block_num: int, num_block_qubits: int) -> Sequence[Sequence[int]]
```

Overloading to handle the special case of 1 qubit where the entanglement are ignored.
