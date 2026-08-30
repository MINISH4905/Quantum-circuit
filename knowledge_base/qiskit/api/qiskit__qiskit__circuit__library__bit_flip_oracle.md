---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/bit_flip_oracle.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/bit_flip_oracle.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/bit_flip_oracle.py`

Bit-flip Oracle object.

## `BitFlipOracleGate`

```python
class BitFlipOracleGate(Gate)
```

Implements a bit-flip oracle

The Bit-flip Oracle Gate object constructs circuits for any arbitrary
input logical expressions. A logical expression is composed of logical operators
`&` (logical `AND`), `|` (logical  `OR`),
`~` (logical  `NOT`), and `^` (logical  `XOR`).
as well as symbols for literals (variables).
For example, `'a & b'`, and `(v0 | ~v1) & (~v2 & v3)`
are both valid string representation of boolean logical expressions.

A bit-flip oracle for a boolean function `f(x)` performs the following
quantum operation:

.. math::

        |x\rangle|y\rangle \mapsto |x\rangle|f(x)\oplus y\rangle

For convenience, this oracle, in addition to parsing arbitrary logical expressions,
also supports input strings in the `DIMACS CNF format
<https://web.archive.org/web/20190325181937/https://www.satcompetition.org/2009/format-benchmarks2009.html>`__,
which is the standard format for specifying SATisfiability (SAT) problem instances in
`Conjunctive Normal Form (CNF) <https://en.wikipedia.org/wiki/Conjunctive_normal_form>`__,
which is a conjunction of one or more clauses, where a clause is a disjunction of one
or more literals.
See :meth:`qiskit.circuit.library.bit_flip_oracle.BitFlipOracleGate.from_dimacs_file`.

From 16 variables on, possible performance issues should be expected when using the
default synthesizer.

### `__init__`

```python
def __init__(self, expression: str | BooleanExpression, var_order: list[str] | None=None, label: str | None=None) -> None
```

Args:
    expression: A Python-like boolean expression string or a `BooleanExpression` object.
    var_order: A list with the order in which variables will be created.
       (default: by appearance)
    label: A label for the gate to display in visualizations. Per default, the label is
        set to display the textual representation of the boolean expression (truncated if needed)

### `from_dimacs_file`

```python
def from_dimacs_file(cls, filename: str) -> BitFlipOracleGate
```

Create a BitFlipOracleGate from the string in the DIMACS format.

It is possible to build a BitFlipOracleGate from a file in `DIMACS CNF format
<https://web.archive.org/web/20190325181937/https://www.satcompetition.org/2009/format-benchmarks2009.html>`__,
which is the standard format for specifying SATisfiability (SAT) problem instances in
`Conjunctive Normal Form (CNF) <https://en.wikipedia.org/wiki/Conjunctive_normal_form>`__,
which is a conjunction of one or more clauses, where a clause is a disjunction of one
or more literals.

The following is an example of a CNF expressed in the DIMACS format:

.. code:: text

  c DIMACS CNF file with 3 satisfying assignments: 1 -2 3, -1 -2 -3, 1 2 -3.
  p cnf 3 5
  -1 -2 -3 0
  1 -2 3 0
  1 2 -3 0
  1 -2 -3 0
  -1 2 3 0

The first line, following the `c` character, is a comment. The second line specifies that
the CNF is over three boolean variables --- let us call them  :math:`x_1, x_2, x_3`, and
contains five clauses.  The five clauses, listed afterwards, are implicitly joined by the
logical `AND` operator, :math:`\land`, while the variables in each clause, represented by
their indices, are implicitly disjoined by the logical `OR` operator, :math:`\lor`. The
:math:`-` symbol preceding a boolean variable index corresponds to the logical `NOT`
operator, :math:`\lnot`. Character `0` (zero) marks the end of each clause.  Essentially,
the code above corresponds to the following CNF:

:math:`(\lnot x_1 \lor \lnot x_2 \lor \lnot x_3)
\land (x_1 \lor \lnot x_2 \lor x_3)
\land (x_1 \lor x_2 \lor \lnot x_3)
\land (x_1 \lor \lnot x_2 \lor \lnot x_3)
\land (\lnot x_1 \lor x_2 \lor x_3)`.


Args:
    filename: A file in DIMACS format.

Returns:
    BitFlipOracleGate: A quantum gate with a bit-flip oracle.
