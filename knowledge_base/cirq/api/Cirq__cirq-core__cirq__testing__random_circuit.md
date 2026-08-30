---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/random_circuit.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/random_circuit.py
license: Apache-2.0
---

## `random_circuit`

```python
def random_circuit(qubits: Sequence[cirq.Qid] | int, n_moments: int, op_density: float, gate_domain: dict[ops.Gate, int] | None=None, random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> circuits.Circuit
```

Generates a random circuit.

Args:
    qubits: If a sequence of qubits, then these are the qubits that
        the circuit should act on. Because the qubits on which an
        operation acts are chosen randomly, not all given qubits
        may be acted upon. If an int, then this number of qubits will
        be automatically generated, and the qubits will be
        `cirq.NamedQubits` with names given by the integers in
        `range(qubits)`.
    n_moments: The number of moments in the generated circuit.
    op_density: The probability that a gate is selected to operate on
        randomly selected qubits. Note that this is not the expected number
        of qubits that are acted on, since there are cases where the
        number of qubits that a gate acts on does not evenly divide the
        total number of qubits.
    gate_domain: The set of gates to choose from, specified as a dictionary
        where each key is a gate and the value of the key is the number of
        qubits the gate acts on. If not provided, the default gate domain is
        {X, Y, Z, H, S, T, CNOT, CZ, SWAP, ISWAP, CZPowGate()}. Only gates
        which act on a number of qubits less than len(qubits) (or qubits if
        provided as an int) are selected from the gate domain.
    random_state: Random state or random state seed.

Raises:
    ValueError:
        * op_density is not in (0, 1].
        * gate_domain is empty.
        * qubits is an int less than 1 or an empty sequence.

Returns:
    The randomly generated Circuit.

## `random_two_qubit_circuit_with_czs`

```python
def random_two_qubit_circuit_with_czs(num_czs: int=3, q0: cirq.Qid | None=None, q1: cirq.Qid | None=None, random_state: cirq.RANDOM_STATE_OR_SEED_LIKE=None) -> circuits.Circuit
```

Creates a random two qubit circuit with the given number of CNOTs.

The resulting circuit will have `num_cnots` number of CNOTs that will be
surrounded by random `PhasedXPowGate` instances on both qubits.

Args:
     num_czs: the number of CNOTs to be guaranteed in the circuit
     q0: the first qubit the circuit should operate on
     q1: the second qubit the circuit should operate on
     random_state: an optional random seed
Returns:
     the random two qubit circuit
