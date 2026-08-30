---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/routing/commuting_2q_gate_routing/pauli_2q_evolution_commutation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/routing/commuting_2q_gate_routing/pauli_2q_evolution_commutation.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/routing/commuting_2q_gate_routing/pauli_2q_evolution_commutation.py`

An analysis pass to find evolution gates in which the Paulis commute.

## `FindCommutingPauliEvolutions`

```python
class FindCommutingPauliEvolutions(TransformationPass)
```

Finds :class:`.PauliEvolutionGate` objects where the operators, that are evolved, all commute.

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Check for :class:`.PauliEvolutionGate` objects where the summands all commute.

Args:
    dag: The DAG circuit in which to look for the commuting evolutions.

Returns:
    The dag in which :class:`.PauliEvolutionGate` objects made of commuting two-qubit Paulis
    have been replaced with :class:`.Commuting2qBlocks`` gate instructions. These gates
    contain nodes of two-qubit :class:`.PauliEvolutionGate` objects.

### `single_qubit_terms_only`

```python
def single_qubit_terms_only(operator: SparsePauliOp) -> bool
```

Determine if the Paulis are made of single qubit terms only.

Args:
    operator: The operator to check if it consists only of single qubit terms.

Returns:
    True if the operator consists of only single qubit terms (like ``IIX + IZI``),
    and False otherwise.

### `summands_commute`

```python
def summands_commute(operator: SparsePauliOp) -> bool
```

Check if all summands in the evolved operator commute.

Args:
    operator: The operator to check if all its summands commute.

Returns:
    True if all summands commute, False otherwise.
