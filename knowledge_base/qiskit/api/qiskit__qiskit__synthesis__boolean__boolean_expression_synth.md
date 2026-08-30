---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/boolean/boolean_expression_synth.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/boolean/boolean_expression_synth.py
license: Apache-2.0
---

## Module `qiskit/synthesis/boolean/boolean_expression_synth.py`

Circuit synthesizers and related classes for boolean expressions

## `EsopGenerator`

```python
class EsopGenerator
```

Generates an ESOP (Exclusive-sum-of-products) representation
for a boolean function given by its truth table

### `clause_diff`

```python
def clause_diff(self, clause1, clause2)
```

The indices of variables where the clauses differ

### `combine_and_optimize`

```python
def combine_and_optimize(self, clauses_1, clauses_2)
```

Combining clauses of distance 1 until no more combinations can be performed

### `generate_esop`

```python
def generate_esop(self, assignment)
```

Recursively generates an ESOP for a partially determined boolean expression
'assignment' is a partial assignment to the expression's variables

## `synth_phase_oracle_from_esop`

```python
def synth_phase_oracle_from_esop(esop, num_qubits)
```

Generates a phase oracle for the boolean function f given in ESOP (Exclusive sum of products) form
esop is of the form ('01-1', '11-0', ...) etc
where 1 is the variable, 0 is negated variable and - is don't care

## `synth_bit_oracle_from_esop`

```python
def synth_bit_oracle_from_esop(esop, num_qubits)
```

Generates a bit-flip oracle for the boolean function f given in ESOP (Exclusive sum of products) form
esop is of the form ('01-1', '11-0', ...) etc
where 1 is the variable, 0 is negated variable and - is don't care
