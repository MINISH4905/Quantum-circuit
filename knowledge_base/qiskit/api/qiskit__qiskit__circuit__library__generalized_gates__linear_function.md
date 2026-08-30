---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/generalized_gates/linear_function.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/generalized_gates/linear_function.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/generalized_gates/linear_function.py`

Linear Function.

## `LinearFunction`

```python
class LinearFunction(Gate)
```

A linear reversible circuit on n qubits.

Internally, a linear function acting on n qubits is represented
as a n x n matrix of 0s and 1s in numpy array format.

A linear function can be synthesized into CX and SWAP gates using the Patel–Markov–Hayes
algorithm, as implemented in :func:`~qiskit.synthesis.synth_cnot_count_full_pmh`
based on reference [1].

For efficiency, the internal n x n matrix is stored in the format expected
by cnot_synth, which is the big-endian (and not the little-endian) bit-ordering convention.

Example:
 
The circuit

.. code-block:: text

    q_0: ──■──
         ┌─┴─┐
    q_1: ┤ X ├
         └───┘
    q_2: ─────

is represented by a 3x3 linear matrix

.. math::

        \begin{pmatrix}
            1 & 0 & 0 \\
            1 & 1 & 0 \\
            0 & 0 & 1
        \end{pmatrix}


References:

[1] Ketan N. Patel, Igor L. Markov, and John P. Hayes,
Optimal synthesis of linear reversible circuits,
Quantum Inf. Comput. 8(3) (2008).
`Online at umich.edu. <https://web.eecs.umich.edu/~imarkov/pubs/jour/qic08-cnot.pdf>`_

### `__init__`

```python
def __init__(self, linear: list[list[bool]] | np.ndarray[bool] | QuantumCircuit | LinearFunction | PermutationGate | Clifford, validate_input: bool=False) -> None
```

Args:
    linear: data from which a linear function can be constructed. It can be either a
        nxn matrix (describing the linear transformation), a permutation (which is a
        special case of a linear function), another linear function, a clifford (when
        it corresponds to a linear function), or a quantum circuit composed of
        linear gates (CX and SWAP) and other objects described above, including
        nested subcircuits.

    validate_input: if True, performs more expensive input validation checks,
        such as checking that a given n x n matrix is invertible.

Raises:
    CircuitError: if the input is invalid:
        either the input matrix is not square or not invertible,
        or the input quantum circuit contains non-linear objects
        (for example, a Hadamard gate, or a Clifford that does
        not correspond to a linear function).

### `inverse`

```python
def inverse(self, annotated: bool=False) -> LinearFunction
```

Returns the inverse of this linear function.

Args:
    annotated: when set to ``True``, this is typically used to return an
        :class:`.AnnotatedOperation` with an inverse modifier set instead of a concrete
        :class:`.Gate`. However, for this class this argument is ignored as the inverse
        of this gate is always a :class:`.LinearFunction`.

### `__eq__`

```python
def __eq__(self, other)
```

Check if two linear functions represent the same matrix.

### `validate_parameter`

```python
def validate_parameter(self, parameter)
```

Parameter validation

### `synthesize`

```python
def synthesize(self)
```

Synthesizes the linear function into a quantum circuit.

Returns:
    QuantumCircuit: A circuit implementing the evolution.

### `linear`

```python
def linear(self)
```

Returns the n x n matrix representing this linear function.

### `original_circuit`

```python
def original_circuit(self)
```

Returns the original circuit used to construct this linear function
(including None, when the linear function is not constructed from a circuit).

### `is_permutation`

```python
def is_permutation(self) -> bool
```

Returns whether this linear function is a permutation,
that is whether every row and every column of the n x n matrix
has exactly one 1.

### `permutation_pattern`

```python
def permutation_pattern(self)
```

This method first checks if a linear function is a permutation and raises a
`qiskit.circuit.exceptions.CircuitError` if not. In the case that this linear function
is a permutation, returns the permutation pattern.

### `extend_with_identity`

```python
def extend_with_identity(self, num_qubits: int, positions: list[int]) -> LinearFunction
```

Extend linear function to a linear function over nq qubits,
with identities on other subsystems.

Args:
    num_qubits: number of qubits of the extended function.

    positions: describes the positions of original qubits in the extended
        function's qubits.

Returns:
    LinearFunction: extended linear function.

### `mat_str`

```python
def mat_str(self)
```

Return string representation of the linear function
viewed as a matrix with 0/1 entries.

### `function_str`

```python
def function_str(self)
```

Return string representation of the linear function
viewed as a linear transformation.
