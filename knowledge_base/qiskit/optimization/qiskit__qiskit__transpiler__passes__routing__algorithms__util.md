---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/routing/algorithms/util.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/routing/algorithms/util.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/routing/algorithms/util.py`

Utility functions shared between permutation functionality.

## `swap_permutation`

```python
def swap_permutation(swaps: Iterable[Iterable[Swap[_K]]], mapping: MutableMapping[_K, _V], allow_missing_keys: bool=False) -> None
```

Given a circuit of swaps, apply them to the permutation (in-place).

Args:
  swaps: param mapping: A mapping of Keys to Values, where the Keys are being swapped.
  mapping: The permutation to have swaps applied to.
  allow_missing_keys: Whether to allow swaps of missing keys in mapping.

## `permutation_circuit`

```python
def permutation_circuit(swaps: Iterable[list[Swap[_V]]]) -> PermutationCircuit
```

Produce a circuit description of a list of swaps.
    With a given permutation and permuter you can compute the swaps using the permuter function
    then feed it into this circuit function to obtain a circuit description.
Args:
  swaps: An iterable of swaps to perform.
Returns:
  A MappingCircuit with the circuit and a mapping of node to qubit in the circuit.
