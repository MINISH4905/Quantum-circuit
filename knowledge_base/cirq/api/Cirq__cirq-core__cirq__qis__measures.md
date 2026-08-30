---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/qis/measures.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/qis/measures.py
license: Apache-2.0
---

## Module `cirq-core/cirq/qis/measures.py`

Measures on and between quantum states and operations.

## `fidelity`

```python
def fidelity(state1: cirq.QUANTUM_STATE_LIKE, state2: cirq.QUANTUM_STATE_LIKE, qid_shape: tuple[int, ...] | None=None, validate: bool=True, atol: float=1e-07) -> float
```

Fidelity of two quantum states.

The fidelity of two density matrices ρ and σ is defined as:

$$
    trace(\sqrt{\sqrt{\rho} \hspace{0.5em} \sigma \sqrt{\rho}})^2
$$

The given states can be state vectors or density matrices.

Args:
    state1: The first state.
    state2: The second state.
    qid_shape: The qid shape of the given states.
    validate: Whether to check if the given states are valid quantum states.
    atol: Absolute numerical tolerance to use for validation.

Returns:
    The value of the fidelity, as a float.

Raises:
    ValueError: The qid shape of the given states was not specified and
        could not be inferred.
    ValueError: Invalid quantum state.

## `von_neumann_entropy`

```python
def von_neumann_entropy(state: cirq.QUANTUM_STATE_LIKE, qid_shape: tuple[int, ...] | None=None, validate: bool=True, atol: float=1e-07) -> float
```

Calculates the von Neumann entropy of a quantum state in bits.

The Von Neumann entropy is defined as $ - trace( \rho ln \rho)$, for
a density matrix $\rho$.  This gives the amount of entropy in 'ebits'
(bits of bipartite entanglement).

If `state` is a square matrix, it is assumed to be a density matrix rather
than a (pure) state tensor.

Args:
    state: The quantum state.
    qid_shape: The qid shape of the given state.
    validate: Whether to check if the given state is a valid quantum state.
    atol: Absolute numerical tolerance to use for validation.

Returns:
    The calculated von Neumann entropy.

Raises:
    ValueError: Invalid quantum state.

References:
    https://en.wikipedia.org/wiki/Von_Neumann_entropy

## `entanglement_fidelity`

```python
def entanglement_fidelity(operation: cirq.SupportsKraus) -> float
```

Returns entanglement fidelity of a given quantum channel.

Entanglement fidelity $F_e$ of a quantum channel $E: L(H) \to L(H)$ is the overlap between
the maximally entangled state $|\phi\rangle = \frac{1}{\sqrt{dim H}} \sum_i|i\rangle|i\rangle$
and the state obtained by sending one half of $|\phi\rangle$ through the channel $E$, i.e.

    $$
    F_e = \langle\phi|(E \otimes I)(|\phi\rangle\langle\phi|)|\phi\rangle
    $$

where $I: L(H) \to L(H)$ is the identity map.

Args:
    operation: Quantum channel whose entanglement fidelity is to be computed.
Returns:
    Entanglement fidelity of the channel represented by operation.
