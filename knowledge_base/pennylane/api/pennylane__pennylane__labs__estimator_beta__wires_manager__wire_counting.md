---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/labs/estimator_beta/wires_manager/wire_counting.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/estimator_beta/wires_manager/wire_counting.py
license: Apache-2.0
---

## Module `pennylane/labs/estimator_beta/wires_manager/wire_counting.py`

This module contains the core logic for wire management.

## `estimate_wires_from_circuit`

```python
def estimate_wires_from_circuit(circuit_as_lst: Iterable[ResourceOperator | Operator | MeasurementProcess | MarkQubits], gate_set: set | None=None, config: LabsResourceConfig | None=None, zeroed: int=0, any_state: int=0)
```

Determine the number of auxiliary qubits needed to decompose the operators
of a quantum circuit into a specific ``gate_set`` with a given ``config``.

Args:
    circuit_as_lst (Iterable[ResourceOperator | Operator | MeasurementProcess | MarkQubits]): A quantum circuit
        represented by a list of circuit elements (operators, measurements, etc.).
    gate_set (set[str] | None): A set of names (strings) of the fundamental operators to count
        throughout the quantum workflow. If not provided, the default gate set will be used,
        i.e., ``{'Toffoli', 'T', 'CNOT', 'X', 'Y', 'Z', 'S', 'Hadamard'}``.
    config (LabsResourceConfig | None): configurations for the resource estimation pipeline
    zeroed (int): The number of additional auxiliary wires, prepared in the
        zero state, that can be used as part of the decomposition.
    any_state (int): The number of additional auxiliary wires, prepared in
        any state, that can be used as part of the decomposition.

Returns:
    tuple(int, int, int): The number of qubits used as part of the decomposition. The first integer
    represents the number of qubits required to define the circuit (before decomposition). The remaining
    two integers represent the number of auxiliary qubits required as we decompose the circuit. They are
    separated according to their quantum state at the end of the workflow (``any_state``, ``zeroed``).

Raises:
    ValueError: if more qubits were deallocated than initially allocated

## `estimate_wires_from_resources`

```python
def estimate_wires_from_resources(workflow: Resources, gate_set: set | None=None, config: LabsResourceConfig | None=None, zeroed: int=0, any_state: int=0)
```

Determine the number of auxiliary qubits needed to decompose the operators
in a :class:`~.pennylane.estimator.resources_base.Resources` object into a specific ``gate_set`` with a given ``config``.

Args:
    workflow (:class:`~.pennylane.estimator.resources_base.Resources`): the collection of gates and counts to be further decomposed
    gate_set (set[str] | None): A set of names (strings) of the fundamental operators to count
        throughout the quantum workflow. If not provided, the default gate set will be used,
        i.e., ``{'Toffoli', 'T', 'CNOT', 'X', 'Y', 'Z', 'S', 'Hadamard'}``.
    config (LabsResourceConfig | None): configurations for the resource estimation pipeline
    zeroed (int): The number of additional auxiliary wires, prepared in the
        zero state, that can be used as part of the decomposition.
    any_state (int): The number of additional auxiliary wires, prepared in
        any state, that can be used as part of the decomposition.

Returns:
    tuple(int, int): The number of auxiliary qubits used as part of the decomposition. They are
    separated according to their quantum state at the end of the workflow (``any_state``, ``zeroed``).

Raises:
    ValueError: if more qubits were deallocated than initially allocated
