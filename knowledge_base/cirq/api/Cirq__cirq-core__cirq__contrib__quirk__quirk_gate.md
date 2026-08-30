---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/quirk/quirk_gate.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/quirk/quirk_gate.py
license: Apache-2.0
---

## `QuirkOp`

```python
class QuirkOp
```

An operation as understood by Quirk's parser.

Basically just a series of text identifiers for each qubit, and some rules
for how things can be combined.

### `__init__`

```python
def __init__(self, *keys: Any, can_merge: bool=True) -> None
```

Inits QuirkOp.

Args:
    *keys: The JSON object(s) that each qubit is turned into when
        explaining a gate to Quirk. For example, a CNOT is turned into
        the keys ["•", "X"].

        Note that, when keys terminates early, it is implied that later
        qubits should use the same key as the last key.
    can_merge: Whether or not it is safe to merge a column containing
        this operation into a column containing other operations. For
        example, this is not safe if the column contains a control
        because the control would also apply to the other column's
        gates.
