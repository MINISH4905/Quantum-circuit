---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/hidden_linear_function.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/hidden_linear_function.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/hidden_linear_function.py`

Hidden Linear Function circuit.

## `HiddenLinearFunction`

```python
class HiddenLinearFunction(QuantumCircuit)
```

Circuit to solve the hidden linear function problem.

The 2D Hidden Linear Function problem is determined by a 2D adjacency
matrix A, where only elements that are nearest-neighbor on a grid have
non-zero entries. Each row/column corresponds to one binary variable
:math:`x_i`.

The hidden linear function problem is as follows:

Consider the quadratic form

.. math::

    q(x) = \sum_{i,j=1}^{n}{x_i x_j} ~(\mathrm{mod}~ 4)

and restrict :math:`q(x)` onto the nullspace of A. This results in a linear
function.

.. math::

    2 \sum_{i=1}^{n}{z_i x_i} ~(\mathrm{mod}~ 4)  \forall  x \in \mathrm{Ker}(A)

and the goal is to recover this linear function (equivalently a vector
:math:`[z_0, ..., z_{n-1}]`). There can be multiple solutions.

In [1] it is shown that the present circuit solves this problem
on a quantum computer in constant depth, whereas any corresponding
solution on a classical computer would require circuits that grow
logarithmically with :math:`n`. Thus this circuit is an example
of quantum advantage with shallow circuits.

Reference Circuit:

.. plot::
    :alt: Diagram illustrating the previously described circuit.

    from qiskit.circuit.library import HiddenLinearFunction
    from qiskit.visualization.library import _generate_circuit_library_visualization
    A = [[1, 1, 0], [1, 0, 1], [0, 1, 1]]
    circuit = HiddenLinearFunction(A)
    _generate_circuit_library_visualization(circuit)

References:

[1] S. Bravyi, D. Gosset, R. Koenig, Quantum Advantage with Shallow Circuits, 2017.
`arXiv:1704.00690 <https://arxiv.org/abs/1704.00690>`_

### `__init__`

```python
def __init__(self, adjacency_matrix: list | np.ndarray) -> None
```

Create new HLF circuit.

Args:
    adjacency_matrix: a symmetric n-by-n list of 0-1 lists.
        n will be the number of qubits.

Raises:
    CircuitError: If A is not symmetric.

## `hidden_linear_function`

```python
def hidden_linear_function(adjacency_matrix: list | np.ndarray) -> QuantumCircuit
```

Circuit to solve the hidden linear function problem.

The 2D Hidden Linear Function problem is determined by a 2D adjacency
matrix A, where only elements that are nearest-neighbor on a grid have
non-zero entries. Each row/column corresponds to one binary variable
:math:`x_i`.

The hidden linear function problem is as follows:

Consider the quadratic form

.. math::

    q(x) = \sum_{i,j=1}^{n}{x_i x_j} ~(\mathrm{mod}~ 4)

and restrict :math:`q(x)` onto the nullspace of A. This results in a linear
function.

.. math::

    2 \sum_{i=1}^{n}{z_i x_i} ~(\mathrm{mod}~ 4)  \forall  x \in \mathrm{Ker}(A)

and the goal is to recover this linear function (equivalently a vector
:math:`[z_0, ..., z_{n-1}]`). There can be multiple solutions.

In [1] it is shown that the present circuit solves this problem
on a quantum computer in constant depth, whereas any corresponding
solution on a classical computer would require circuits that grow
logarithmically with :math:`n`. Thus this circuit is an example
of quantum advantage with shallow circuits.

Reference Circuit:

.. plot::
   :alt: Circuit diagram output by the previous code.
   :include-source:

   from qiskit.circuit.library import hidden_linear_function
   A = [[1, 1, 0], [1, 0, 1], [0, 1, 1]]
   circuit = hidden_linear_function(A)
   circuit.draw('mpl')

Args:
    adjacency_matrix: a symmetric n-by-n list of 0-1 lists.
        n will be the number of qubits.

Raises:
    CircuitError: If A is not symmetric.

Reference:

[1] S. Bravyi, D. Gosset, R. Koenig, Quantum Advantage with Shallow Circuits, 2017.
`arXiv:1704.00690 <https://arxiv.org/abs/1704.00690>`_
