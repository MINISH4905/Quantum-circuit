---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/qcut/kahypar.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/qcut/kahypar.py
license: Apache-2.0
---

## Module `pennylane/qcut/kahypar.py`

Functions for partitioning a graph using KaHyPar.

## `kahypar_cut`

```python
def kahypar_cut(graph, num_fragments: int, imbalance: int=None, edge_weights: None | list[int | float]=None, node_weights: None | list[int | float]=None, fragment_weights: None | list[int | float]=None, hyperwire_weight: int=1, seed: int=None, config_path: None | str | Path=None, trial: None | int=None, verbose: bool=False) -> list[tuple[Operation, Any]]
```

Calls `KaHyPar <https://kahypar.org/>`__ to partition a graph.

.. warning::
    Requires KaHyPar to be installed separately. For Linux and Mac users,
    KaHyPar can be installed using ``pip install kahypar``. Windows users
    can follow the instructions
    `here <https://kahypar.org>`__ to compile from source.

Args:
    graph (nx.MultiDiGraph): The graph to be partitioned.
    num_fragments (int): Desired number of fragments.
    imbalance (int): Imbalance factor of the partitioning. Defaults to KaHyPar's determination.
    edge_weights (List[Union[int, float]]): Weights for edges. Defaults to unit-weighted edges.
    node_weights (List[Union[int, float]]): Weights for nodes. Defaults to unit-weighted nodes.
    fragment_weights (List[Union[int, float]]): Maximum size constraints by fragment. Defaults
        to no such constraints, with ``imbalance`` the only parameter affecting fragment sizes.
    hyperwire_weight (int): Weight on the artificially appended hyperedges representing wires.
        Setting it to 0 leads to no such insertion. If greater than 0, hyperedges will be
        appended with the provided weight, to encourage the resulting fragments to cluster gates
        on the same wire together. Defaults to 1.
    seed (int): KaHyPar's seed. Defaults to the seed in the config file which defaults to -1,
        i.e. unfixed seed.
    config_path (str): KaHyPar's ``.ini`` config file path. Defaults to its SEA20 paper config.
    trial (int): trial id for summary label creation. Defaults to ``None``.
    verbose (bool): Flag for printing KaHyPar's output summary. Defaults to ``False``.

Returns:
    List[Union[int, Any]]: List of cut edges.

**Example**

Consider the following 2-wire circuit with one CNOT gate connecting the wires:

.. code-block:: python

    ops = [
        qp.RX(0.432, wires=0),
        qp.RY(0.543, wires="a"),
        qp.CNOT(wires=[0, "a"]),
        qp.RZ(0.240, wires=0),
        qp.RZ(0.133, wires="a"),
        qp.RX(0.432, wires=0),
        qp.RY(0.543, wires="a"),
    ]
    measurements = [qp.expval(qp.Z(0))]
    tape = qp.tape.QuantumTape(ops, measurements)

We can let KaHyPar automatically find the optimal edges to place cuts:

>>> graph = qp.qcut.tape_to_graph(tape)
>>> cut_edges = qp.qcut.kahypar_cut(
...     graph=graph,
...     num_fragments=2,
... )
>>> cut_edges
[(Wrapped(CNOT(wires=[0, 'a'])), Wrapped(RZ(0.24, wires=[0])), 0)]
