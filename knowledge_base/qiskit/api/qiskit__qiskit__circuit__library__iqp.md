---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/iqp.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/iqp.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/iqp.py`

Instantaneous quantum polynomial circuit.

## `IQP`

```python
class IQP(QuantumCircuit)
```

Instantaneous quantum polynomial (IQP) circuit.

The circuit consists of a column of Hadamard gates,
a column of powers of T gates,
a sequence of powers of CS gates (up to
:math:`\frac{n^2-n}{2}` of them),
and a final column of Hadamard gates, as introduced in [1].

The circuit is parameterized by an n x n interactions matrix.
The powers of each T gate are given by the diagonal elements
of the interactions matrix. The powers of the CS gates are
given by the upper triangle of the interactions matrix.

Reference Circuit:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import IQP
   A = [[6, 5, 3], [5, 4, 5], [3, 5, 1]]
   circuit = IQP(A)
   circuit.draw('mpl')

Expanded Circuit:

.. plot::
    :alt: Diagram illustrating the previously described circuit.

    from qiskit.circuit.library import IQP
    from qiskit.visualization.library import _generate_circuit_library_visualization
    A = [[6, 5, 3], [5, 4, 5], [3, 5, 1]]
    circuit = IQP(A)
    _generate_circuit_library_visualization(circuit.decompose())

References:

[1] M. J. Bremner et al. Average-case complexity versus approximate
simulation of commuting quantum computations,
Phys. Rev. Lett. 117, 080501 (2016).
`arXiv:1504.07999 <https://arxiv.org/abs/1504.07999>`_

### `__init__`

```python
def __init__(self, interactions: list | np.ndarray) -> None
```

Create IQP circuit.

Args:
    interactions: input n-by-n symmetric matrix.

Raises:
    CircuitError: if the input is not a symmetric matrix.

## `iqp`

```python
def iqp(interactions: Sequence[Sequence[int]]) -> QuantumCircuit
```

Instantaneous quantum polynomial time (IQP) circuit.

The circuit consists of a column of Hadamard gates, a column of powers of T gates,
a sequence of powers of CS gates (up to :math:`\frac{n^2-n}{2}` of them), and a final column of
Hadamard gates, as introduced in [1].

The circuit is parameterized by an :math:`n \times n` interactions matrix. The powers of each
T gate are given by the diagonal elements of the interactions matrix. The powers of the CS gates
are given by the upper triangle of the interactions matrix.

Reference Circuit:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import iqp
   A = [[6, 5, 3], [5, 4, 5], [3, 5, 1]]
   circuit = iqp(A)
   circuit.draw("mpl")

Expanded Circuit:

    .. plot::
       :alt: Diagram illustrating the previously described circuit.

       from qiskit.circuit.library import iqp
       from qiskit.visualization.library import _generate_circuit_library_visualization
       A = [[6, 5, 3], [5, 4, 5], [3, 5, 1]]
       circuit = iqp(A)
       _generate_circuit_library_visualization(circuit)

References:

[1] M. J. Bremner et al. Average-case complexity versus approximate
simulation of commuting quantum computations,
Phys. Rev. Lett. 117, 080501 (2016).
`arXiv:1504.07999 <https://arxiv.org/abs/1504.07999>`_

Args:
    interactions: The interactions as symmetric square matrix. If ``None``, then the
        ``num_qubits`` argument must be set and a random IQP circuit will be generated.

Returns:
    An IQP circuit.

## `random_iqp`

```python
def random_iqp(num_qubits: int, seed: int | None=None) -> QuantumCircuit
```

A random instantaneous quantum polynomial time (IQP) circuit.

See :func:`iqp` for more details on the IQP circuit.

Example:

.. plot::
   :alt: Circuit diagram output by the previous code.
   :include-source:

   from qiskit.circuit.library import random_iqp

   circuit = random_iqp(3)
   circuit.draw("mpl")

Args:
    num_qubits: The number of qubits in the circuit.
    seed: A seed for the random number generator, in case the interactions matrix is
        randomly generated.

Returns:
    An IQP circuit.
