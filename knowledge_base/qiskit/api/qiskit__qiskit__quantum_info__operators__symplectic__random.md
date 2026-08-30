---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/symplectic/random.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/symplectic/random.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/symplectic/random.py`

Random symplectic operator functions

## `random_pauli`

```python
def random_pauli(num_qubits: int, group_phase: bool=False, seed: int | np.random.Generator | None=None) -> Pauli
```

Return a random :class:`Pauli`.

Args:
    num_qubits: The number of qubits.
    group_phase: Optional. If ``True`` generate random phase.
                 Otherwise the phase will be set so that the
                 Pauli coefficient is +1 (default: ``False``).
    seed: Optional. Set a fixed seed or generator for RNG.

Returns:
    A random Pauli.

## `random_pauli_list`

```python
def random_pauli_list(num_qubits: int, size: int=1, seed: int | np.random.Generator | None=None, phase: bool=True) -> PauliList
```

Return a random :class:`PauliList`.

Args:
    num_qubits: The number of qubits.
    size: Optional. The length of the Pauli list (Default: 1).
    seed: Optional. Set a fixed seed or generator for RNG.
    phase: Optional. If ``True`` the Pauli phases are randomized, otherwise the phases are fixed
        to 0 (Default: ``True``).

Returns:
    A random :class:`PauliList`.

## `random_clifford`

```python
def random_clifford(num_qubits: int, seed: int | np.random.Generator | None=None) -> Clifford
```

Return a random Clifford operator.

The Clifford is sampled using the method of Reference [1].

Args:
    num_qubits: The number of qubits for the Clifford.
    seed: Optional. Set a fixed seed or generator for RNG.

Returns:
    A random Clifford operator.

References:

[1] S. Bravyi and D. Maslov (2020). Hadamard-free circuits expose the structure of the
Clifford group. `arXiv:2003.09412 <https://arxiv.org/abs/2003.09412>`__
