---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/paulistring/clifford_target_gateset.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/paulistring/clifford_target_gateset.py
license: Apache-2.0
---

## `CliffordTargetGateset`

```python
class CliffordTargetGateset(transformers.TwoQubitCompilationTargetGateset)
```

Target gateset containing CZ + Meas + SingleQubitClifford / PauliStringPhasor gates.

### `__init__`

```python
def __init__(self, *, single_qubit_target: SingleQubitTarget=SingleQubitTarget.PAULI_STRING_PHASORS_AND_CLIFFORDS, atol: float=1e-08)
```

Initializes CliffordTargetGateset

Args:
    single_qubit_target: Specifies the decomposition strategy for single qubit gates.
        SINGLE_QUBIT_CLIFFORDS: Decompose all single qubit gates to
            `cirq.SingleQubitCliffordGate`.
        PAULI_STRING_PHASORS_AND_CLIFFORDS: Accept both `cirq.SingleQubitCliffordGate` and
            `cirq.PauliStringPhasorGate`; but decompose unknown gates into
            `cirq.PauliStringPhasorGate`.
        PAULI_STRING_PHASORS: Decompose all single qubit gates to
            `cirq.PauliStringPhasorGate`.
    atol: A limit on the amount of absolute error introduced by the decomposition.

### `postprocess_transformers`

```python
def postprocess_transformers(self) -> list[cirq.TRANSFORMER]
```

List of transformers which should be run after decomposing individual operations.
