---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/qasm_import/_parser.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/qasm_import/_parser.py
license: Apache-2.0
---

## `Qasm`

```python
class Qasm
```

Qasm stores the final result of the Qasm parsing.

### `__init__`

```python
def __init__(self, supported_format: bool, qelib1_include: bool, qregs: dict, cregs: dict, input_params: dict[str, str], circuit: Circuit)
```

Initializes Qasm.

Attributes:
    qelib1Include: defines whether the Quantum Experience standard header
        is present or not.
    supportedFormat: defines if it has a supported format or not.
    qregs: quantum registers.
    cregs: classical registers.
    circuit: circuit.

## `QasmGateStatement`

```python
class QasmGateStatement
```

Specifies how to convert a call to an OpenQASM gate
to a list of `cirq.GateOperation`s.

Has the responsibility to validate the arguments
and parameters of the call and to generate a list of corresponding
`cirq.GateOperation`s in the `on` method.

### `__init__`

```python
def __init__(self, qasm_gate: str, cirq_gate: ops.Gate | Callable[[list[float]], ops.Gate], num_params: int, num_args: int)
```

Initializes a Qasm gate statement.

Args:
    qasm_gate: The symbol of the QASM gate.
    cirq_gate: The gate class on the cirq side.
    num_params: The number of params taken by this gate.
    num_args: The number of qubits (used in validation) this
        gate takes.

## `CustomGate`

```python
class CustomGate
```

Represents an invocation of a user-defined gate.

The custom gate definition is encoded here as a `FrozenCircuit`, and the
arguments (params and qubits) of the specific invocation of that gate are
stored here too. When `on` is called, we create a CircuitOperation, mapping
the qubits and params to the values provided.

## `QasmParser`

```python
class QasmParser
```

Parser for QASM strings.

Example:

    qasm = "OPENQASM 2.0; qreg q1[2]; CX q1[0], q1[1];"
    parsedQasm = QasmParser().parse(qasm)

### `__init__`

```python
def __init__(self) -> None
```

Initializes the Qasm parser.

Attributes:
    gate_set: The gates available to use in the circuit, including those from
        libraries, and user-defined ones.
    circuit: A Cirq Circuit object.
    qregs: Quantum registers.
    cregs: Classical registers.
    in_custom_gate_scope: This is set to True when the parser is in the middle
        of parsing a custom gate definition.
    custom_gate_scoped_params: The params declared within the current custom
        gate definition. Empty if not in custom gate scope.
    custom_gate_scoped_qubits: The qubits declared within the current custom
        gate definition. Empty if not in custom gate scope.
    input_params: The input parameters mapped from name to type.
    qelibinc: Boolean indicating whether the Quantum Experience standard header
        is present or not.
    supported_format: Boolean indicating whether the format is supported.
    format_version: The OpenQASM version string.

### `p_start`

```python
def p_start(self, p)
```

start : qasm

### `p_qasm_format_only`

```python
def p_qasm_format_only(self, p)
```

qasm : format

### `p_qasm_no_format_specified_error`

```python
def p_qasm_no_format_specified_error(self, p)
```

qasm : QELIBINC
| STDGATESINC
| circuit

### `p_qasm_include`

```python
def p_qasm_include(self, p)
```

qasm : qasm QELIBINC

### `p_qasm_include_stdgates`

```python
def p_qasm_include_stdgates(self, p)
```

qasm : qasm STDGATESINC

### `p_qasm_circuit`

```python
def p_qasm_circuit(self, p)
```

qasm : qasm circuit

### `p_format`

```python
def p_format(self, p)
```

format : FORMAT_SPEC

### `p_circuit_reg`

```python
def p_circuit_reg(self, p)
```

circuit : new_reg circuit

### `p_circuit_gate_or_measurement_or_if`

```python
def p_circuit_gate_or_measurement_or_if(self, p)
```

circuit :  circuit gate_op
|  circuit measurement
|  circuit reset
|  circuit if

### `p_circuit_input_decl`

```python
def p_circuit_input_decl(self, p)
```

circuit : input_decl circuit

### `p_circuit_empty`

```python
def p_circuit_empty(self, p)
```

circuit : empty

### `p_circuit_gate_def`

```python
def p_circuit_gate_def(self, p)
```

circuit : gate_def

### `p_new_reg`

```python
def p_new_reg(self, p)
```

new_reg : QREG ID '[' NATURAL_NUMBER ']' ';'
| QUBIT '[' NATURAL_NUMBER ']' ID ';'
| QUBIT ID ';'
| CREG ID '[' NATURAL_NUMBER ']' ';'
| BIT '[' NATURAL_NUMBER ']' ID ';'
| BIT ID ';'

### `p_gate_op_no_params`

```python
def p_gate_op_no_params(self, p)
```

gate_op :  ID qargs

### `p_gate_op_with_params`

```python
def p_gate_op_with_params(self, p)
```

gate_op :  ID '(' params ')' qargs

### `p_params_multiple`

```python
def p_params_multiple(self, p)
```

params : expr ',' params

### `p_params_single`

```python
def p_params_single(self, p)
```

params : expr

### `p_input_type`

```python
def p_input_type(self, p)
```

input_type : FLOAT
| ANGLE

### `p_input_decl`

```python
def p_input_decl(self, p)
```

input_decl : INPUT input_type '[' NATURAL_NUMBER ']' ID ';'

### `p_expr_term`

```python
def p_expr_term(self, p)
```

expr : term

### `p_expr_identifier`

```python
def p_expr_identifier(self, p)
```

expr : ID

### `p_expr_parens`

```python
def p_expr_parens(self, p)
```

expr : '(' expr ')'

### `p_expr_function_call`

```python
def p_expr_function_call(self, p)
```

expr : ID '(' expr ')'

### `p_expr_unary`

```python
def p_expr_unary(self, p)
```

expr : '-' expr
| '+' expr

### `p_expr_binary`

```python
def p_expr_binary(self, p)
```

expr : expr '*' expr
| expr '/' expr
| expr '+' expr
| expr '-' expr
| expr '^' expr

### `p_term`

```python
def p_term(self, p)
```

term : NUMBER
| NATURAL_NUMBER

### `p_pi`

```python
def p_pi(self, p)
```

term : PI

### `p_args_multiple`

```python
def p_args_multiple(self, p)
```

qargs : qarg ',' qargs

### `p_args_single`

```python
def p_args_single(self, p)
```

qargs : qarg ';'

### `p_quantum_arg_register`

```python
def p_quantum_arg_register(self, p)
```

qarg : ID

### `p_classical_arg_register`

```python
def p_classical_arg_register(self, p)
```

carg : ID

### `p_quantum_arg_bit`

```python
def p_quantum_arg_bit(self, p)
```

qarg : ID '[' NATURAL_NUMBER ']'

### `p_classical_arg_bit`

```python
def p_classical_arg_bit(self, p)
```

carg : ID '[' NATURAL_NUMBER ']'

### `p_measurement`

```python
def p_measurement(self, p)
```

measurement : MEASURE qarg ARROW carg ';'
| carg '=' MEASURE qarg ';'

### `p_reset`

```python
def p_reset(self, p)
```

reset : RESET qarg ';'

### `p_condition_list_single`

```python
def p_condition_list_single(self, p)
```

condition_list : carg EQ NATURAL_NUMBER

### `p_condition_list_and`

```python
def p_condition_list_and(self, p)
```

condition_list : condition_list AND carg EQ NATURAL_NUMBER

### `p_if`

```python
def p_if(self, p)
```

if : IF '(' condition_list ')' gate_op

### `p_gate_params_multiple`

```python
def p_gate_params_multiple(self, p)
```

gate_params : ID ',' gate_params

### `p_gate_params_single`

```python
def p_gate_params_single(self, p)
```

gate_params : ID

### `p_gate_qubits_multiple`

```python
def p_gate_qubits_multiple(self, p)
```

gate_qubits : ID ',' gate_qubits

### `p_gate_qubits_single`

```python
def p_gate_qubits_single(self, p)
```

gate_qubits : ID

### `p_gate_ops`

```python
def p_gate_ops(self, p)
```

gate_ops : gate_op gate_ops

### `p_gate_ops_empty`

```python
def p_gate_ops_empty(self, p)
```

gate_ops : empty

### `p_gate_def_parameterized`

```python
def p_gate_def_parameterized(self, p)
```

gate_def : GATE ID '(' gate_params ')' gate_qubits '{' gate_ops '}'

### `p_gate_def`

```python
def p_gate_def(self, p)
```

gate_def : GATE ID gate_qubits '{' gate_ops '}'

### `p_empty`

```python
def p_empty(self, p)
```

empty :
