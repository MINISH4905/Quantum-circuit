---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qaoa/mixers.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qaoa/mixers.py
license: Apache-2.0
---

## Module `pennylane/qaoa/mixers.py`

Methods for constructing QAOA mixer Hamiltonians.

## `x_mixer`

```python
def x_mixer(wires: Iterable | Wires)
```

Creates a basic Pauli-X mixer Hamiltonian.

This Hamiltonian is defined as:

.. math:: H_M \ = \ \displaystyle\sum_{i} X_{i},

where :math:`i` ranges over all wires, and :math:`X_i`
denotes the Pauli-X operator on the :math:`i`-th wire.

This is mixer is used in *A Quantum Approximate Optimization Algorithm*
by Edward Farhi, Jeffrey Goldstone, Sam Gutmann [`arXiv:1411.4028 <https://arxiv.org/abs/1411.4028>`__].

Args:
    wires (Iterable or Wires): The wires on which the Hamiltonian is applied

Returns:
    Hamiltonian: Mixer Hamiltonian

**Example**

The mixer Hamiltonian can be called as follows:

>>> from pennylane import qaoa
>>> wires = range(3)
>>> mixer_h = qaoa.x_mixer(wires)
>>> print(mixer_h)
1 * X(0) + 1 * X(1) + 1 * X(2)

## `xy_mixer`

```python
def xy_mixer(graph: nx_Graph | rx.PyGraph)
```

Creates a generalized SWAP/XY mixer Hamiltonian.

This mixer Hamiltonian is defined as:

.. math:: H_M \ = \ \frac{1}{2} \displaystyle\sum_{(i, j) \in E(G)} X_i X_j \ + \ Y_i Y_j,

for some graph :math:`G`. :math:`X_i` and :math:`Y_i` denote the Pauli-X and Pauli-Y operators on the :math:`i`-th
wire respectively.

This mixer was introduced in *From the Quantum Approximate Optimization Algorithm
to a Quantum Alternating Operator Ansatz* by Stuart Hadfield, Zhihui Wang, Bryan O'Gorman,
Eleanor G. Rieffel, Davide Venturelli, and Rupak Biswas `Algorithms 12.2 (2019) <https://doi.org/10.3390/a12020034>`__.

Args:
    graph (nx.Graph or rx.PyGraph): A graph defining the collections of wires on which the Hamiltonian acts.

Returns:
    Hamiltonian: Mixer Hamiltonian

**Example**

The mixer Hamiltonian can be called as follows:

>>> from pennylane import qaoa
>>> from networkx import Graph
>>> graph = Graph([(0, 1), (1, 2)])
>>> mixer_h = qaoa.xy_mixer(graph)
>>> print(mixer_h)
  (0.5) [X0 X1]
+ (0.5) [Y0 Y1]
+ (0.5) [X1 X2]
+ (0.5) [Y1 Y2]

>>> import rustworkx as rx
>>> graph = rx.PyGraph()
>>> graph.add_nodes_from([0, 1, 2])
>>> graph.add_edges_from([(0, 1, ""), (1, 2, "")])
>>> mixer_h = xy_mixer(graph)
>>> print(mixer_h)
  (0.5) [X0 X1]
+ (0.5) [Y0 Y1]
+ (0.5) [X1 X2]
+ (0.5) [Y1 Y2]

## `bit_flip_mixer`

```python
def bit_flip_mixer(graph: nx_Graph | rx.PyGraph, b: int)
```

Creates a bit-flip mixer Hamiltonian.

This mixer is defined as:

.. math:: H_M \ = \ \displaystyle\sum_{v \in V(G)} \frac{1}{2^{d(v)}} X_{v}
          \displaystyle\prod_{w \in N(v)} (\mathbb{I} \ + \ (-1)^b Z_w)

where :math:`V(G)` is the set of vertices of some graph :math:`G`, :math:`d(v)` is the
`degree <https://en.wikipedia.org/wiki/Degree_(graph_theory)>`__ of vertex :math:`v`, and
:math:`N(v)` is the `neighbourhood <https://en.wikipedia.org/wiki/Neighbourhood_(graph_theory)>`__
of vertex :math:`v`. In addition, :math:`Z_v` and :math:`X_v`
are the Pauli-Z and Pauli-X operators on vertex :math:`v`, respectively,
and :math:`\mathbb{I}` is the identity operator.

This mixer was introduced in `Hadfield et al. (2019) <https://doi.org/10.3390/a12020034>`__.

Args:
     graph (nx.Graph or rx.PyGraph): A graph defining the collections of wires on which the Hamiltonian acts.
     b (int): Either :math:`0` or :math:`1`. When :math:`b=0`, a bit flip is performed on
         vertex :math:`v` only when all neighbouring nodes are in state :math:`|0\rangle`.
         Alternatively, for :math:`b=1`, a bit flip is performed only when all the neighbours of
         :math:`v` are in the state :math:`|1\rangle`.

Returns:
    Hamiltonian: Mixer Hamiltonian

**Example**

The mixer Hamiltonian can be called as follows:

>>> from pennylane import qaoa
>>> from networkx import Graph
>>> graph = Graph([(0, 1), (1, 2)])
>>> mixer_h = qaoa.bit_flip_mixer(graph, 0)
>>> mixer_h
(
    0.5 * X(0)
  + 0.5 * (X(0) @ Z(1))
  + 0.25 * X(1)
  + 0.25 * (X(1) @ Z(2))
  + 0.25 * (X(1) @ Z(0))
  + 0.25 * (X(1) @ Z(0) @ Z(2))
  + 0.5 * X(2)
  + 0.5 * (X(2) @ Z(1))
)

>>> import rustworkx as rx
>>> graph = rx.PyGraph()
>>> graph.add_nodes_from([0, 1, 2])
>>> graph.add_edges_from([(0, 1, ""), (1, 2, "")])
>>> mixer_h = qaoa.bit_flip_mixer(graph, 0)
>>> print(mixer_h)
(
    0.5 * X(0)
  + 0.5 * (X(0) @ Z(1))
  + 0.25 * X(1)
  + 0.25 * (X(1) @ Z(2))
  + 0.25 * (X(1) @ Z(0))
  + 0.25 * (X(1) @ Z(0) @ Z(2))
  + 0.5 * X(2)
  + 0.5 * (X(2) @ Z(1))
)
