---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/quimb/state_vector.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/quimb/state_vector.py
license: Apache-2.0
---

## `circuit_to_tensors`

```python
def circuit_to_tensors(circuit: cirq.Circuit, qubits: Sequence[cirq.Qid] | None=None, initial_state: int | None=0) -> tuple[list[qtn.Tensor], dict[cirq.Qid, int], None]
```

Given a circuit, construct a tensor network representation.

Indices are named "i{i}_q{x}" where i is a time index and x is a
qubit index.

Args:
    circuit: The circuit containing operations that implement the
        cirq.unitary() protocol.
    qubits: A list of qubits in the circuit.
    initial_state: Either `0` corresponding to the |0..0> state, in
        which case the tensor network will represent the final
        state vector; or `None` in which case the starting indices
        will be left open and the tensor network will represent the
        circuit unitary.
Returns:
    tensors: A list of quimb Tensor objects
    qubit_frontier: A mapping from qubit to time index at the end of
        the circuit. This can be used to deduce the names of the free
        tensor indices.
    positions: Currently None. May be changed in the future to return
        a suitable mapping for tn.graph()'s `fix` argument. Currently,
        `fix=None` will draw the resulting tensor network using a spring
        layout.

Raises:
    ValueError: If the ihitial state is anything other than that
        corresponding to the |0> state.

## `tensor_state_vector`

```python
def tensor_state_vector(circuit: cirq.Circuit, qubits: Sequence[cirq.Qid] | None=None) -> np.ndarray
```

Given a circuit contract a tensor network into a final state vector.

## `tensor_unitary`

```python
def tensor_unitary(circuit: cirq.Circuit, qubits: Sequence[cirq.Qid] | None=None) -> np.ndarray
```

Given a circuit contract a tensor network into a dense unitary
of the circuit.

## `circuit_for_expectation_value`

```python
def circuit_for_expectation_value(circuit: cirq.Circuit, pauli_string: cirq.PauliString) -> cirq.Circuit
```

Sandwich a PauliString operator between a forwards and backwards
copy of a circuit.

This is a circuit representation of the expectation value of an operator
<A> = <psi|A|psi> = <0|U^dag A U|0>. You can either extract the 0..0
amplitude of the final state vector (assuming starting from the |0..0>
state or extract the [0, 0] entry of the unitary matrix of this combined
circuit.

## `tensor_expectation_value`

```python
def tensor_expectation_value(circuit: cirq.Circuit, pauli_string: cirq.PauliString, max_ram_gb=16, tol=1e-06) -> float
```

Compute an expectation value for an operator and a circuit via tensor
contraction.

This will give up if it looks like the computation will take too much RAM.
