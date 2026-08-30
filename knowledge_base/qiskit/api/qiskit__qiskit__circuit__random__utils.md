---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/random/utils.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/random/utils.py
license: Apache-2.0
---

## Module `qiskit/circuit/random/utils.py`

Utility functions for generating random circuits.

## `random_circuit_from_graph`

```python
def random_circuit_from_graph(interaction_graph, min_2q_gate_per_edge=1, max_operands=2, measure=False, conditional=False, reset=False, seed=None, insert_1q_oper=True, prob_conditional=0.1, prob_reset=0.1)
```

Generate random circuit of arbitrary size and form which strictly respects the interaction
graph passed as argument. Interaction Graph is a graph G=(V, E) where V are the qubits in the
circuit, and, E is the set of two-qubit gate interactions between two particular qubits in the
circuit.

This function will generate a random circuit by randomly selecting 1Q and 2Q gates from the set
of standard gates in :mod:`qiskit.circuit.library.standard_gates`. The user can attach a numerical
value as a metadata to the edge of the graph indicating the edge weight for that particular edge,
These edge weights would be normalized to the probabilities of the edges getting selected.
If all the edge weights are passed as `None`, then the probability of each qubit-pair of getting
selected is set to 1/N, where `N` is the number of edges in the `interaction_graph` passed in,
i.e each edge is drawn uniformly. If any weight of an edge is set as zero, that particular
edge will not be included in the output circuit.

Passing a list of tuples of control qubit, target qubit and associated probability is also
acceptable as a way to specify an interaction graph.

If numerical values are present as probabilities but some/any are None, or negative, when
`max_operands=2` this will raise a ValueError.

If `max_operands` is set to 1, then there are no 2Q operations, so no need to take care
of the edges, in such case the function will return a circuit from the `random_circuit` function,
which would be passed with the `max_operands` as 1.

If `max_operands` is set to 2, then in every while-iteration 2Q gates are chosen randomly, and
qubit-pairs which exist in the input interaction graph are also chosen randomly based on the
probability attached to the qubit-pair. Then in a for-iteration 2Q gates are applied to the
randomly chosen qubit-pairs with the aim to reach the count of 2Q on any qubit-pair to
`min_2q_gate_per_edge` criteria as soon as possible within a particular iteration. Now, if
some qubits are still idle after applying 2Q gates for that particular iteration, then randomly
chosen 1Q gates are applied to those idle qubits if `insert_1q_oper` is set to True.

Example:

.. plot::
   :alt: Pass in interaction graph and minimum 2Q gate per edge as a bare minimum.
   :include-source:

   from qiskit.circuit.random.utils import random_circuit_from_graph
   import rustworkx as rx
   pydi_graph = rx.PyDiGraph()
   pydi_graph.add_nodes_from(range(7))
   cp_map = [(0, 1, 0.18), (1, 2, 0.15), (2, 3, 0.15), (3, 4, 0.22), (4, 5, 0.13), (5, 6, 0.17)]
   pydi_graph.add_edges_from(cp_map)
   # cp_map can be passed in directly as interaction_graph
   qc = random_circuit_from_graph(pydi_graph, min_2q_gate_per_edge=2, seed=12345)
   qc.draw(output='mpl')

Args:
    interaction_graph (PyGraph | PyDiGraph | List[Tuple[int, int, float]]): Interaction Graph
    min_2q_gate_per_edge (int): Minimum number of times every qubit-pair must be used
        in the random circuit. (optional, default:1)
    max_operands (int): maximum qubit operands of each gate(should be 1 or 2)
        (optional, default:2)
    measure (bool): if True, measure all qubits at the end. (optional, default: False)
    conditional (bool): if True, insert middle measurements and conditionals.
        (optional, default: False)
    reset (bool): if True, insert middle resets. (optional, default: False)
    seed (int): sets random seed. (If `None`, a random seed is chosen) (optional)
    insert_1q_oper (bool): Insert 1Q operations to the circuit. (optional, default: True)
    prob_conditional (float): Probability less than 1.0, this is used to control the occurrence
        of conditionals in the circuit. (optional, default: 0.1)
    prob_reset (float): Probability less than 1.0, this is used to control the occurrence of
        reset in the circuit. (optional, default: 0.1)

Returns:
    QuantumCircuit: constructed circuit

Raises:
    CircuitError: When `max_operands` is not 1 or 2.
    CircuitError: When `max_operands` is set to 1, but no 1Q operations are allowed by setting
        `insert_1q_oper` to false.
    CircuitError: When the interaction graph has no edges, so only 1Q gates are possible in
        the circuit, but `insert_1q_oper` is set to False.
    CircuitError: When an invalid interaction graph object is passed.
    ValueError: Given `max_operands=2`, when any edge have probability `None` but not all, or any
        of the probabilities are negative.

## `random_circuit`

```python
def random_circuit(num_qubits, depth, max_operands=4, measure=False, conditional=False, reset=False, seed=None, num_operand_distribution: dict | None=None)
```

Generate random circuit of arbitrary size and form.

This function will generate a random circuit by randomly selecting gates
from the set of standard gates in :mod:`qiskit.circuit.library.standard_gates`. For example:

.. plot::
   :alt: Circuit diagram output by the previous code.
   :include-source:

   from qiskit.circuit.random import random_circuit

   circ = random_circuit(2, 2, measure=True)
   circ.draw(output='mpl')

Args:
    num_qubits (int): number of quantum wires
    depth (int): layers of operations (i.e. critical path length)
    max_operands (int): maximum qubit operands of each gate (between 1 and 4)
    measure (bool): if True, measure all qubits at the end
    conditional (bool): if True, insert middle measurements and conditionals
    reset (bool): if True, insert middle resets
    seed (int): sets random seed (optional)
    num_operand_distribution (dict): a distribution of gates that specifies the ratio
        of 1-qubit, 2-qubit, 3-qubit, ..., n-qubit gates in the random circuit. Expect a
        deviation from the specified ratios that depends on the size of the requested
        random circuit. (optional)

Returns:
    QuantumCircuit: constructed circuit

Raises:
    CircuitError: when invalid options given

## `random_clifford_circuit`

```python
def random_clifford_circuit(num_qubits, num_gates, gates='all', seed=None)
```

Generate a pseudo-random Clifford circuit.

This function will generate a Clifford circuit by randomly selecting the chosen amount of Clifford
gates from the set of standard gates in :mod:`qiskit.circuit.library.standard_gates`. For example:

.. plot::
   :alt: Circuit diagram output by the previous code.
   :include-source:

   from qiskit.circuit.random import random_clifford_circuit

   circ = random_clifford_circuit(num_qubits=2, num_gates=6)
   circ.draw(output='mpl')

Args:
    num_qubits (int): number of quantum wires.
    num_gates (int): number of gates in the circuit.
    gates (list[str]): optional list of Clifford gate names to randomly sample from.
        If ``"all"`` (default), use all Clifford gates in the standard library.
    seed (int | np.random.Generator): sets random seed/generator (optional).

Returns:
    QuantumCircuit: constructed circuit
