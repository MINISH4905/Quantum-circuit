---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/analytical_decompositions/two_qubit_to_fsim.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/analytical_decompositions/two_qubit_to_fsim.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/analytical_decompositions/two_qubit_to_fsim.py`

Utility methods for decomposing two-qubit unitaries into FSim gates.

## `decompose_two_qubit_interaction_into_four_fsim_gates`

```python
def decompose_two_qubit_interaction_into_four_fsim_gates(interaction: cirq.SupportsUnitary | np.ndarray, *, fsim_gate: cirq.FSimGate | cirq.ISwapPowGate, qubits: Sequence[cirq.Qid] | None=None) -> cirq.Circuit
```

Decomposes operations into an FSimGate near theta=pi/2, phi=0.

This decomposition is guaranteed to use exactly four of the given FSim
gates. It works by decomposing into two B gates and then decomposing each
B gate into two of the given FSim gate.

This decomposition only works for FSim gates with a theta (iswap angle)
between 3/8π and 5/8π (i.e. within 22.5° of maximum strength) and a
phi (cphase angle) between -π/4 and +π/4 (i.e. within 45° of minimum
strength).

Args:
    interaction: The two qubit operation to synthesize. This can either be
        a cirq object (such as a gate, operation, or circuit) or a raw numpy
        array specifying the 4x4 unitary matrix.
    fsim_gate: The only two qubit gate that is permitted to appear in the
        output. Must satisfy 3/8π < phi < 5/8π and abs(theta) < pi/4.
    qubits: The qubits that the resulting operations should apply the
        desired interaction to. If not set then defaults to either the
        qubits of the given interaction (if it is a `cirq.Operation`) or
        else to `cirq.LineQubit.range(2)`.

Returns:
    A list of operations implementing the desired two qubit unitary. The
    list will include four operations of the given fsim gate, various single
    qubit operations, and a global phase operation.

Raises:
    ValueError: If the `fsim_gate` has invalid angles or is parameterized, or
        if the supplied target to synthesize acts on more than two qubits.
