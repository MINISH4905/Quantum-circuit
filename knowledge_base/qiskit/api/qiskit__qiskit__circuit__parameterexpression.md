---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/parameterexpression.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/parameterexpression.py
license: Apache-2.0
---

## Module `qiskit/circuit/parameterexpression.py`

ParameterExpression Class to enable creating simple expressions of Parameters.

## `op_code_to_method`

```python
def op_code_to_method(op_code: OpCode | int) -> str
```

Return the method name for a given op_code.

## `sympify`

```python
def sympify(expression)
```

Return symbolic expression as a raw Sympy object.

.. note::

    This is for interoperability only.  Qiskit will not accept or work with raw Sympy or
    Symengine expressions in its parameters, because they do not contain the tracking
    information used in circuit-parameter binding and assignment.
