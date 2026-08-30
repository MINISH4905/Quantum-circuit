---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/interop/quirk/cells/arithmetic_cells.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/interop/quirk/cells/arithmetic_cells.py
license: Apache-2.0
---

## `QuirkArithmeticGate`

```python
class QuirkArithmeticGate(ops.ArithmeticGate)
```

Applies arithmetic to a target and some inputs.

Implements Quirk-specific implicit effects like assuming that the presence
of an 'r' input implies modular arithmetic.

In Quirk, modular operations have no effect on values larger than the
modulus. This convention is used because unitarity forces *some* convention
on out-of-range values (they cannot simply disappear or raise exceptions),
and the simplest is to do nothing. This call handles ensuring that happens,
and ensuring the new target register value is normalized modulo the modulus.

### `__init__`

```python
def __init__(self, identifier: str, target: Sequence[int], inputs: Sequence[Sequence[int] | int])
```

Inits QuirkArithmeticGate.

Args:
    identifier: The quirk identifier string for this operation.
    target: The target qubit register.
    inputs: Qubit registers, which correspond to the qid shape of the
        qubits from which the input will be read, or classical
        constants, that determine what happens to the target.

Raises:
    ValueError: If the target is too small for a modular operation with
        too small modulus.
