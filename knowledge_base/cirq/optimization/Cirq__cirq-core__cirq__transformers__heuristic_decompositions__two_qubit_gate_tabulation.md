---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/heuristic_decompositions/two_qubit_gate_tabulation.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/heuristic_decompositions/two_qubit_gate_tabulation.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/heuristic_decompositions/two_qubit_gate_tabulation.py`

Attempt to tabulate single qubit gates required to generate a target 2Q gate
with a product A k A.

## `TwoQubitGateTabulationResult`

```python
class TwoQubitGateTabulationResult(NamedTuple)
```

Represents a compilation of a target 2-qubit with respect to a base
gate.

This object encodes the relationship between 4x4 unitary operators

U_target ~ k_N · U_base · k_{N-1} · ... · k_1 · U_base · k_0

where U_target, U_base are 2-local and k_j are 1-local.

Attributes:
    base_gate: 4x4 unitary denoting U_base above.
    target_gate: 4x4 unitary denoting U_target above.
    local_unitaries: Sequence of 2-tuples
        $(k_{00}, k_{01}), (k_{10}, k_{11}) \ldots$ where
        $k_j = k_{j0} \otimes k_{j1}$ in the product above.
        Each $k_{j0}, k_{j1}$ is a 2x2 unitary.
    actual_gate: 4x4 unitary denoting the right hand side above, ideally
        equal to U_target.
    success: Whether actual_gate is expected to be close to U_target.

## `TwoQubitGateTabulation`

```python
class TwoQubitGateTabulation
```

A 2-qubit gate compiler based on precomputing/tabulating gate products.

### `compile_two_qubit_gate`

```python
def compile_two_qubit_gate(self, unitary: np.ndarray) -> TwoQubitGateTabulationResult
```

Compute single qubit gates required to compile a desired unitary.

Given a desired unitary U, this computes the sequence of 1-local gates
$k_j$ such that the product

$k_{n-1} A k_{n-2} A ... k_1 A k_0$

is close to U. Here A is the base_gate of the tabulation.

Args:
    unitary: Unitary (U above) to compile.

Returns:
    A TwoQubitGateTabulationResult object encoding the required local
    unitaries and resulting product above.

## `two_qubit_gate_product_tabulation`

```python
def two_qubit_gate_product_tabulation(base_gate: np.ndarray, max_infidelity: float, *, sample_scaling: int=50, allow_missed_points: bool=True, random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> TwoQubitGateTabulation
```

Generate a TwoQubitGateTabulation for a base two qubit unitary.

Args:
    base_gate: The base gate of the tabulation.
    max_infidelity: Sets the desired density of tabulated product unitaries.
        The typical nearest neighbor Euclidean spacing (of the KAK vectors)
        will be on the order of $\sqrt{max\_infidelity}$. Thus the number of
        tabulated points will scale as $max\_infidelity^{-3/2}$.
    sample_scaling: Relative number of random gate products to use in the
        tabulation. The total number of random local unitaries scales as
        ~ $max\_infidelity^{-3/2} * sample\_scaling$. Must be positive.
    random_state: Random state or random state seed.
    allow_missed_points: If True, the tabulation is allowed to conclude
        even if not all points in the Weyl chamber are expected to be
        compilable using 2 or 3 base gates. Otherwise, an error is raised
        in this case.

Returns:
    A TwoQubitGateTabulation object used to compile new two-qubit gates from
    products of the base gate with 1-local unitaries.

Raises:
    ValueError: If `allow_missing_points` is False and not all the points
        in the Weyl chamber are compilable using 2 or 3 base gates.
