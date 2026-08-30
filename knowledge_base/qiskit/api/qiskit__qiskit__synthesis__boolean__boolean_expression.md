---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/boolean/boolean_expression.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/boolean/boolean_expression.py
license: Apache-2.0
---

## Module `qiskit/synthesis/boolean/boolean_expression.py`

A class for parsing and synthesizing boolean expressions

## `TruthTable`

```python
class TruthTable
```

A simple implementation of a truth table for a boolean function

The truth table is built from a callable which takes an assignment, which
is a tuple of boolean values of a fixed given length (the number of bits
of the truth table) and returns a boolean value.

For a number of bits at most `EXPLICIT_REP_THRESHOLD` the values of the table
are explicitly computed and stored. Otherwise, the values are computed on the fly
and stored in a dictionary.

### `all_assignments`

```python
def all_assignments(self) -> list[tuple[bool]]
```

Return an ordered list of all assignments, ordered from right to left
i.e. 000, 100, 010, 110, 001, 101, 011, 111

## `BooleanExpression`

```python
class BooleanExpression
```

A Boolean Expression

### `__init__`

```python
def __init__(self, expression: str, var_order: list | None=None) -> None
```

Args:
    expression (str): The logical expression string.
    name (str): Optional. Instruction gate name. Otherwise part of the expression is
       going to be used.
    var_order(list): A list with the order in which variables will be created.
       (default: by appearance)

### `simulate`

```python
def simulate(self, bitstring: str | tuple) -> bool
```

Evaluate the expression on a bitstring.

This evaluation is done classically.

Args:
    bitstring: The bitstring for which to evaluate,
    either as a string of 0 and 1 or a tuple of booleans.

Returns:
    bool: result of the evaluation.

### `truth_table`

```python
def truth_table(self) -> dict
```

Generates the full truth table for the expression
Returns:
    dict: A dictionary mapping boolean assignments to the boolean result

### `synth`

```python
def synth(self, circuit_type: str='bit')
```

Synthesize the logic network into a :class:`~qiskit.circuit.QuantumCircuit`.
There are two common types of circuits for a boolean function :math:`f(x)`:

1. **Bit-flip oracles** which compute:

 .. math::

    |x\rangle|y\rangle |-> |x\rangle|f(x)\oplusy\rangle

2. **Phase-flip** oracles which compute:

 .. math::

    |x\rangle |-> (-1)^{f(x)}|x\rangle

By default the bit-flip oracle is generated.

Args:
    circuit_type: which type of oracle to create, 'bit' or 'phase' flip oracle.
Returns:
    QuantumCircuit: A circuit implementing the logic network.
Raises:
    ValueError: If ``circuit_type`` is not either 'bit' or 'phase'.

### `from_dimacs`

```python
def from_dimacs(dimacs: str)
```

Create a BooleanExpression from a string in the DIMACS format.
Args:
    dimacs : A string in DIMACS format.

Returns:
    BooleanExpression: A gate for the input string

Raises:
    ValueError: If the string is not formatted according to DIMACS rules

### `from_dimacs_file`

```python
def from_dimacs_file(filename: str)
```

Create a BooleanExpression from a file in the DIMACS format.
Args:
    filename: A file in DIMACS format.

Returns:
    BooleanExpression: A gate for the input string

Raises:
    FileNotFoundError: If filename is not found.
