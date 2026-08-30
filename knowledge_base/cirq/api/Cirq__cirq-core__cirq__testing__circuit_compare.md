---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/circuit_compare.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/circuit_compare.py
license: Apache-2.0
---

## `assert_circuits_with_terminal_measurements_are_equivalent`

```python
def assert_circuits_with_terminal_measurements_are_equivalent(actual: circuits.AbstractCircuit, reference: circuits.AbstractCircuit, atol: float=1e-08) -> None
```

Determines if two circuits have equivalent effects.

The circuits can contain measurements, but the measurements must be at the
end of the circuit. Circuits are equivalent if, for all possible inputs,
their outputs (classical bits for lines terminated with measurement and
qubits for lines without measurement) are observationally indistinguishable
up to a tolerance. Note that under this definition of equivalence circuits
that differ solely in the overall phase of the post-measurement state of
measured qubits are considered equivalent.

For example, applying an extra Z gate to an unmeasured qubit changes the
effect of a circuit. But inserting a Z gate operation just before a
measurement does not.

Args:
    actual: The circuit that was actually computed by some process.
    reference: A circuit with the correct function.
    atol: Absolute error tolerance.

## `assert_same_circuits`

```python
def assert_same_circuits(actual: circuits.AbstractCircuit, expected: circuits.AbstractCircuit) -> None
```

Asserts that two circuits are identical, with a descriptive error.

Args:
    actual: A circuit computed by some code under test.
    expected: The circuit that should have been computed.

## `assert_circuits_have_same_unitary_given_final_permutation`

```python
def assert_circuits_have_same_unitary_given_final_permutation(actual: circuits.AbstractCircuit, expected: circuits.AbstractCircuit, qubit_map: dict[ops.Qid, ops.Qid]) -> None
```

Asserts two circuits have the same unitary up to a final permutation of qubits.

Args:
    actual: A circuit computed by some code under test.
    expected: The circuit that should have been computed.
    qubit_map: the permutation of qubits from the beginning to the end of the circuit.

Raises:
    ValueError: if 'qubit_map' is not a mapping from the qubits in 'actual' to themselves.
    ValueError: if 'qubit_map' does not have the same set of keys and values.

## `assert_has_diagram`

```python
def assert_has_diagram(actual: circuits.AbstractCircuit | circuits.Moment, desired: str, **kwargs) -> None
```

Determines if a given circuit has the desired text diagram.

Args:
    actual: The circuit that was actually computed by some process.
    desired: The desired text diagram as a string. Newlines at the
        beginning and whitespace at the end are ignored.
    **kwargs: Keyword arguments to be passed to actual.to_text_diagram().

## `assert_has_consistent_apply_unitary`

```python
def assert_has_consistent_apply_unitary(val: Any, *, atol: float=1e-08) -> None
```

Tests whether a value's _apply_unitary_ is correct.

Contrasts the effects of the value's `_apply_unitary_` with the
matrix returned by the value's `_unitary_` method.

Args:
    val: The value under test. Should have a `__pow__` method.
    atol: Absolute error tolerance.

## `assert_has_consistent_apply_channel`

```python
def assert_has_consistent_apply_channel(val: Any, *, atol: float=1e-08) -> None
```

Tests whether a value's _apply_channel_ is correct.

Contrasts the effects of the value's `_apply_channel_` with the superoperator calculated from
the Kraus components returned by the value's `_kraus_` method.

Args:
    val: The value under test. Should have a `__pow__` method.
    atol: Absolute error tolerance.

## `assert_has_consistent_apply_unitary_for_various_exponents`

```python
def assert_has_consistent_apply_unitary_for_various_exponents(val: Any, *, exponents=(0, 1, -1, 0.5, 0.25, -0.5, 0.1, sympy.Symbol('s'))) -> None
```

Tests whether a value's _apply_unitary_ is correct.

Contrasts the effects of the value's `_apply_unitary_` with the
matrix returned by the value's `_unitary_` method. Attempts this after
attempting to raise the value to several exponents.

Args:
    val: The value under test. Should have a `__pow__` method.
    exponents: The exponents to try. Defaults to a variety of special and
        arbitrary angles, as well as a parameterized angle (a symbol). If
        the value's `__pow__` returns `NotImplemented` for any of these,
        they are skipped.

## `assert_has_consistent_qid_shape`

```python
def assert_has_consistent_qid_shape(val: Any) -> None
```

Tests whether a value's `_qid_shape_` and `_num_qubits_` are correct and
consistent.

Verifies that the entries in the shape are all positive integers and the
length of shape equals `_num_qubits_` (and also equals `len(qubits)` if
`val` has `qubits`.

Args:
    val: The value under test. Should have `_qid_shape_` and/or
        `num_qubits_` methods. Can optionally have a `qubits` property.
