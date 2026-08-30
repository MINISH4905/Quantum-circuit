---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/quimb/density_matrix.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/quimb/density_matrix.py
license: Apache-2.0
---

## `circuit_to_density_matrix_tensors`

```python
def circuit_to_density_matrix_tensors(circuit: cirq.Circuit, qubits: Sequence[cirq.Qid] | None=None) -> tuple[list[qtn.Tensor], dict[cirq.Qid, int], dict[tuple[str, str], tuple[float, float]]]
```

Given a circuit with mixtures or channels, construct a tensor network
representation of the density matrix.

This assumes you start in the |0..0><0..0| state. Indices are named
"nf{i}_q{x}" and "nb{i}_q{x}" where i is a time index and x is a
qubit index. nf- and nb- refer to the "forwards" and "backwards"
copies of the circuit. Kraus indices are named "k{j}" where j is an
independent "kraus" internal index which you probably never need to access.

Args:
    circuit: The circuit containing operations that support the
        cirq.unitary() or cirq.kraus() protocols.
    qubits: The qubits in the circuit. The `positions` return argument
        will position qubits according to their index in this list.

Returns:
    tensors: A list of Quimb Tensor objects
    qubit_frontier: A mapping from qubit to time index at the end of
        the circuit. This can be used to deduce the names of the free
        tensor indices.
    positions: A positions dictionary suitable for passing to tn.graph()'s
        `fix` argument to draw the resulting tensor network similar to a
        quantum circuit.

Raises:
    ValueError: If an op is encountered that cannot be converted.

## `tensor_density_matrix`

```python
def tensor_density_matrix(circuit: cirq.Circuit, qubits: Sequence[cirq.Qid] | None=None) -> np.ndarray
```

Given a circuit with mixtures or channels, contract a tensor network
representing the resultant density matrix.

Note: If the circuit contains 6 qubits or fewer, we use a bespoke
contraction ordering that corresponds to the "normal" in-time contraction
ordering. Otherwise, the contraction order determination could take
longer than doing the contraction. Your mileage may vary and benchmarking
is encouraged for your particular problem if performance is important.
