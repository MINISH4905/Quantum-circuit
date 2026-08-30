---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/quimb/grid_circuits.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/quimb/grid_circuits.py
license: Apache-2.0
---

## `get_grid_moments`

```python
def get_grid_moments(problem_graph: nx.Graph, two_qubit_gate=cirq.ZZPowGate) -> Iterator[cirq.Moment]
```

Yield moments on a grid.

The moments will contain `two_qubit_gate` on the edges of the provided
graph in the order of (horizontal from even columns, horizontal from odd
columns, vertical from even rows, vertical from odd rows)

Args:
    problem_graph: A NetworkX graph (probably generated from
        `nx.grid_2d_graph(width, height)` whose nodes are (row, col)
        indices and whose edges optionally have a "weight" property which
        will be provided to the `exponent` argument of `two_qubit_gate`.
    two_qubit_gate: The two qubit gate to use. Should have `exponent`
        and `global_shift` arguments.

## `simplify_expectation_value_circuit`

```python
def simplify_expectation_value_circuit(circuit_sand: cirq.Circuit) -> None
```

For low weight operators on low-degree circuits, we can simplify
the circuit representation of an expectation value.

In particular, this should be used on `circuit_for_expectation_value`
circuits. It will merge single- and two-qubit gates from the "forwards"
and "backwards" parts of the circuit outside of the operator's lightcone.

This might be too slow in practice and you can just use quimb to simplify
things for you.
