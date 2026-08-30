---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/quantikz/circuit_to_latex_quantikz_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/quantikz/circuit_to_latex_quantikz_test.py
license: Apache-2.0
---

## `test_empty_circuit_raises_value_error`

```python
def test_empty_circuit_raises_value_error()
```

Test that an empty circuit raises a ValueError.

## `test_circuit_no_qubits_raises_value_error`

```python
def test_circuit_no_qubits_raises_value_error()
```

Test that a circuit with no qubits raises a ValueError.

## `test_basic_circuit_conversion`

```python
def test_basic_circuit_conversion()
```

Test a simple circuit conversion to LaTeX.

## `test_parameter_display`

```python
def test_parameter_display()
```

Test that gate parameters are correctly displayed or hidden.

## `test_custom_gate_name_map`

```python
def test_custom_gate_name_map()
```

Test custom gate name mapping.

## `test_wire_labels`

```python
def test_wire_labels()
```

Test different wire labeling options.

## `test_custom_preamble_and_postamble`

```python
def test_custom_preamble_and_postamble()
```

Test custom preamble and postamble injection.

## `test_quantikz_options`

```python
def test_quantikz_options()
```

Test global quantikz options.

## `test_float_precision_exponents`

```python
def test_float_precision_exponents()
```

Test formatting of floating-point exponents.

## `test_misc_gates`

```python
def test_misc_gates() -> None
```

Tests gates that have special handling.
