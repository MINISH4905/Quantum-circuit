---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/ghz/fidelity.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/ghz/fidelity.py
license: Apache-2.0
---

## `int_to_stabilizer`

```python
def int_to_stabilizer(which_stabilizer: int, qubits: Sequence[ops.Qid], basis_ops: Sequence[ops.PauliString]) -> ops.PauliString
```

A mapping from the integers [0, ..., 2**num_qubits - 1] to GHZ stabilizers.

First, `which_stabilizer` is converted to binary. The binary digits indicate whether
the given basis stabilizer is present. The basis stabilizers, in order, are
Z0*Z1, Z1*Z2, ..., Z(N-2)*Z(N-1), X0*X1*...*X(N-1).

Args:
    which_stabilizer: The integer to convert to a stabilizer operator.
    qubits: The qubits in the GHZ state.
    basis_ops: A choice of len(qubits) independent stabilizers.

Returns:
    The stabilizer operator.

## `generate_stabilizers`

```python
def generate_stabilizers(stabilizer_ints: Sequence[int], qubits: Sequence[ops.Qid]) -> list[ops.PauliString]
```

Generate a list of stabilizers from a sequence of stabilizer integers.

Args:
    stabilizer_ints: The integers from which to generate the stabilizers.
    qubits: The qubits in the GHZ state.

Returns:
    The list of stabilizers.

## `measure_ghz_fidelity`

```python
def measure_ghz_fidelity(circuit: circuits.Circuit, num_z_type: int, num_x_type: int, rng: np.random.Generator, sampler: work.Sampler, pauli_repetitions: int=10000, readout_repetitions: int=10000, num_random_bitstrings: int=30) -> GHZFidelityResult
```

Randomly sample z-type and x-type stabilizers of the GHZ state and measure them with and
    without readout error mitigation.

Args:
    circuit: The circuit that prepares the GHZ state.
    num_z_type: The number of z-type stabilizers (all measured simultaneously)
    num_x_type: The number of x-type stabilizers
    sampler: The simulator or hardware sampler on which to run.
    rng: The random number generator to use.
    pauli_repetitions: The number of repetitions to use for measuring stabilizers.
    readout_repetitions: The number of repetitions to use for benchmarking readout
        (for readout error mitigation).
    num_random_bitstrings: The number of random bitstrings for readout benchmarking
        (for readout error mitigation). Set to 0 to skip readout benchmarking.

## `GHZFidelityResult`

```python
class GHZFidelityResult
```

A class for storing and analyzing the results of a GHZ fidelity benchmarking experiment.

### `compute_z_type_fidelity`

```python
def compute_z_type_fidelity(self, mitigated: bool=True) -> tuple[float, float]
```

Compute the z-type fidelity and statistical uncertainty.

Args:
    mitigated: Whether to apply readout error mitigation.

Returns:
    Return the average of the z-type stabilizers and the uncertainty of the average.

### `compute_x_type_fidelity`

```python
def compute_x_type_fidelity(self, mitigated: bool=True) -> tuple[float, float]
```

Compute the x-type fidelity and statistical uncertainty.

Args:
    mitigated: Whether to apply readout error mitigation.

Returns:
    Return the average of the x-type stabilizers and the uncertainty of the average.

### `compute_fidelity`

```python
def compute_fidelity(self, mitigated: bool=True) -> tuple[float, float]
```

Compute the fidelity and statistical uncertainty.

Args:
    mitigated: Whether to apply readout error mitigation.

Returns:
    Return the average of the stabilizers and the uncertainty of the average.
