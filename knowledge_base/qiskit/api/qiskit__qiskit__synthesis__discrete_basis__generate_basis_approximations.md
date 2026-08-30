---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/discrete_basis/generate_basis_approximations.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/discrete_basis/generate_basis_approximations.py
license: Apache-2.0
---

## Module `qiskit/synthesis/discrete_basis/generate_basis_approximations.py`

Functions to generate the basic approximations of single qubit gates for Solovay-Kitaev.

## `generate_basic_approximations`

```python
def generate_basic_approximations(basis_gates: list[str | Gate], depth: int, filename: str | None=None) -> list[GateSequence]
```

Generates a list of :class:`GateSequence`\ s with the gates in ``basis_gates``.

Args:
    basis_gates: The gates from which to create the sequences of gates.
    depth: The maximum depth of the approximations.
    filename: If provided, the basic approximations are stored in this file.

Returns:
    List of :class:`GateSequence`\ s using the gates in ``basis_gates``.

Raises:
    ValueError: If ``basis_gates`` contains an invalid gate identifier.
