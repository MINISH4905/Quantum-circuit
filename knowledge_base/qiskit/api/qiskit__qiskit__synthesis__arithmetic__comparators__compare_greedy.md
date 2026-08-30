---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/arithmetic/comparators/compare_greedy.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/arithmetic/comparators/compare_greedy.py
license: Apache-2.0
---

## Module `qiskit/synthesis/arithmetic/comparators/compare_greedy.py`

Integer comparator based on an exponential number of multi-controlled gates.

## `synth_integer_comparator_greedy`

```python
def synth_integer_comparator_greedy(num_state_qubits: int, value: int, geq: bool=True) -> QuantumCircuit
```

Implement an integer comparison based on value-by-value comparison.

For ``value`` smaller than ``2 ** (num_state_qubits - 1)`` this circuit implements
``value`` multi-controlled gates with control states 0, 1, ..., ``value - 1``, such that
the target qubit is flipped if the qubit state represents any of the allowed values.
For ``value`` larger than that, ``geq`` is flipped. This implementation can
require an exponential number of gates. If auxiliary qubits are available, the implementation
provided by :func:`.synth_integer_comparator_2s` is more efficient.

Args:
    num_state_qubits: The number of qubits encoding the value to compare to.
    value: The value to compare to.
    geq: If ``True`` flip the target bit if the qubit state is :math:`\geq` than the value,
        otherwise implement :math:`<`.

Returns:
    A circuit implementing the integer comparator.
