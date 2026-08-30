---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/phox/utils.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/phox/utils.py
license: Apache-2.0
---

## Module `pennylane/labs/phox/utils.py`

Utility functions for generating gates, observables, and analyzing circuits for the Phox simulator.

## `create_local_gates`

```python
def create_local_gates(n_qubits: int, max_weight: int=2) -> dict[int, list[list[int]]]
```

Generates a gate dictionary for the Phox simulator containing all gates whose
generators have Pauli weight less or equal to max_weight.

Each gate is assigned a unique parameter index.

Args:
    n_qubits (int): The number of qubits.
    max_weight (int): Maximum Pauli weight of gate generators.

Returns:
    dict[int, list[list[int]]]: Gate structure mapping parameter indices to qubit lists.

## `create_lattice_gates`

```python
def create_lattice_gates(rows: int, cols: int, distance: int=1, max_weight: int=2, periodic: bool=False) -> dict[int, list[list[int]]]
```

Generates gates based on nearest-neighbor interactions on a 2D lattice.

Args:
    rows (int): Lattice height.
    cols (int): Lattice width.
    distance (int): Maximum graph distance to consider for interactions.
    max_weight (int): Maximum weight of the generators.
    periodic (bool): Whether to use periodic boundary conditions.

Returns:
    dict[int, list[list[int]]]: Gate structure.

## `create_random_gates`

```python
def create_random_gates(n_qubits: int, n_gates: int, min_weight: int=1, max_weight: int=2, seed: int=None) -> dict[int, list[list[int]]]
```

Generates a dictionary of random gates.

Args:
    n_qubits (int): Total number of qubits.
    n_gates (int): Number of gates to generate.
    min_weight (int): Minimum weight of a gate.
    max_weight (int): Maximum weight of a gate.
    seed (int): Random seed.

Returns:
    dict[int, list[list[int]]]: Gate structure.

## `generate_pauli_observables`

```python
def generate_pauli_observables(n_qubits: int, orders: list[int]=(1,), bases: list[str]=('Z',)) -> list[list[int]]
```

Generates a batch of Pauli observables represented as integers (I=0, X=1, Y=2, Z=3).

Args:
    n_qubits (int): Number of qubits.
    orders (list[int]): Orders of interactions to generate (e.g., [1, 2] for one-body and two-body).
    bases (list[str]): Pauli bases to use ('X', 'Y', 'Z').

Returns:
    list[list[int]]: A list of observables mapped to ints.
                     Example for 2 qubits, order 1, base Z: [[3, 0], [0, 3]]
