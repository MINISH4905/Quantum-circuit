---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/fourier_checking.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/fourier_checking.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/fourier_checking.py`

Fourier checking circuit.

## `FourierChecking`

```python
class FourierChecking(QuantumCircuit)
```

Fourier checking circuit.

The circuit for the Fourier checking algorithm, introduced in [1],
involves a layer of Hadamards, the function :math:`f`, another layer of
Hadamards, the function :math:`g`, followed by a final layer of Hadamards.
The functions :math:`f` and :math:`g` are classical functions realized
as phase oracles (diagonal operators with {-1, 1} on the diagonal).

The probability of observing the all-zeros string is :math:`p(f,g)`.
The algorithm solves the promise Fourier checking problem,
which decides if f is correlated with the Fourier transform
of g, by testing if :math:`p(f,g) <= 0.01` or :math:`p(f,g) >= 0.05`,
promised that one or the other of these is true.

The functions :math:`f` and :math:`g` are currently implemented
from their truth tables but could be represented concisely and
implemented efficiently for special classes of functions.

Fourier checking is a special case of :math:`k`-fold forrelation [2].

References:

[1] S. Aaronson, BQP and the Polynomial Hierarchy, 2009 (Section 3.2).
`arXiv:0910.4698 <https://arxiv.org/abs/0910.4698>`_

[2] S. Aaronson, A. Ambainis, Forrelation: a problem that
optimally separates quantum from classical computing, 2014.
`arXiv:1411.5729 <https://arxiv.org/abs/1411.5729>`_

### `__init__`

```python
def __init__(self, f: Sequence[int], g: Sequence[int]) -> None
```

Create Fourier checking circuit.

Args:
    f: truth table for f, length 2**n list of {1,-1}.
    g: truth table for g, length 2**n list of {1,-1}.

Raises:
    CircuitError: if the inputs f and g are not valid.

Reference Circuit:
    .. plot::
       :alt: Diagram illustrating the previously described circuit.

       from qiskit.circuit.library import FourierChecking
       from qiskit.visualization.library import _generate_circuit_library_visualization
       f = [1, -1, -1, -1]
       g = [1, 1, -1, -1]
       circuit = FourierChecking(f, g)
       _generate_circuit_library_visualization(circuit)

## `fourier_checking`

```python
def fourier_checking(f: Sequence[int], g: Sequence[int]) -> QuantumCircuit
```

Fourier checking circuit.

The circuit for the Fourier checking algorithm, introduced in [1],
involves a layer of Hadamards, the function :math:`f`, another layer of
Hadamards, the function :math:`g`, followed by a final layer of Hadamards.
The functions :math:`f` and :math:`g` are classical functions realized
as phase oracles (diagonal operators with {-1, 1} on the diagonal).

The probability of observing the all-zeros string is :math:`p(f,g)`.
The algorithm solves the promise Fourier checking problem,
which decides if f is correlated with the Fourier transform
of g, by testing if :math:`p(f,g) <= 0.01` or :math:`p(f,g) >= 0.05`,
promised that one or the other of these is true.

The functions :math:`f` and :math:`g` are currently implemented
from their truth tables but could be represented concisely and
implemented efficiently for special classes of functions.

Fourier checking is a special case of :math:`k`-fold forrelation [2].

Reference Circuit:

.. plot::
   :alt: Circuit diagram output by the previous code.
   :include-source:

   from qiskit.circuit.library import fourier_checking
   circuit = fourier_checking([1, -1, -1, -1], [1, 1, -1, -1])
   circuit.draw('mpl')

References:

[1] S. Aaronson, BQP and the Polynomial Hierarchy, 2009 (Section 3.2).
`arXiv:0910.4698 <https://arxiv.org/abs/0910.4698>`_

[2] S. Aaronson, A. Ambainis, Forrelation: a problem that
optimally separates quantum from classical computing, 2014.
`arXiv:1411.5729 <https://arxiv.org/abs/1411.5729>`_
