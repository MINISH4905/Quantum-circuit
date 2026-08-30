---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/pauli/pauli_interface.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/pauli/pauli_interface.py
license: Apache-2.0
---

## Module `pennylane/pauli/pauli_interface.py`

Utility functions to interact with and extract information from Pauli words and Pauli sentences.

## `pauli_word_prefactor`

```python
def pauli_word_prefactor(observable)
```

If the operator provided is a valid Pauli word (i.e a single term which may be a tensor product
of pauli operators), then this function extracts the prefactor.

Args:
    observable (~.Operator): the operator to be examined

Returns:
    Union[int, float, complex]: The scaling/phase coefficient of the Pauli word.

Raises:
    ValueError: If an operator is provided that is not a valid Pauli word.

**Example**

>>> pauli_word_prefactor(qp.Identity(0))
1
>>> pauli_word_prefactor(qp.X(0) @ qp.Y(1))
1.0
>>> pauli_word_prefactor(qp.X(0) @ qp.Y(0))
1j
