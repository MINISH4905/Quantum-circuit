---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/boolean_hamiltonian.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/boolean_hamiltonian.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/boolean_hamiltonian.py`

Represents Boolean functions as a series of CNOT and rotation gates. The Boolean functions are
passed as Sympy expressions and then turned into an optimized set of gates.

References:
[1] On the representation of Boolean and real functions as Hamiltonians for quantum computing
    by Stuart Hadfield, https://arxiv.org/abs/1804.09130
[2] https://www.youtube.com/watch?v=AOKM9BkweVU is a useful intro
[3] https://github.com/rsln-s/IEEE_QW_2020/blob/master/Slides.pdf
[4] Efficient Quantum Circuits for Diagonal Unitaries Without Ancillas by Jonathan Welch, Daniel
    Greenbaum, Sarah Mostame, and Alán Aspuru-Guzik, https://arxiv.org/abs/1306.3991

## `BooleanHamiltonianGate`

```python
class BooleanHamiltonianGate(raw_types.Gate)
```

A gate that represents evolution due to a Hamiltonian from a set of Boolean functions.

This gate constructs a diagonal gate in the computational basis that encodes in its
phases classical functions.

The gate is specified by a list of parameters, $[x_0, x_1, \dots, x_{n-1}]$, a
list of boolean expressions that are functions of these parameters,
$[f_0(x_0,\dots,x_{n-1}), f_1(x_0,\dots,x_{n-1}), \dots f_{p-1}(x_0,\dots,x_{n-1})]$
and an angle $t$. For these parameters the gate is

$$
\sum_{x=0}^{2^n-1} e^{i \frac{t}{2} \sum_{k=0}^{p-1}f_k(x_0,\dots,x_{n-1})} |x\rangle\langle x|
$$

### `__init__`

```python
def __init__(self, parameter_names: Sequence[str], boolean_strs: Sequence[str], theta: float)
```

Builds a BooleanHamiltonianGate.

For each element of a sequence of Boolean expressions, the code first transforms it into a
polynomial of Pauli Zs that represent that particular expression. Then, we sum all the
polynomials, thus making a function that goes from a series to Boolean inputs to an integer
that is the number of Boolean expressions that are true.

For example, if we were using this gate for the unweighted max-cut problem that is typically
used to demonstrate the QAOA algorithm, there would be one Boolean expression per edge. Each
Boolean expression would be true iff the vertices on that are in different cuts (i.e. it's)
an XOR.

Then, we compute exp(-j * theta * polynomial), which is unitary because the polynomial is
Hermitian.

Args:
    parameter_names: The names of the inputs to the expressions.
    boolean_strs: The list of Sympy-parsable Boolean expressions.
    theta: The evolution time (angle) for the Hamiltonian
