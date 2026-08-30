---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/channel/chi.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/channel/chi.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/channel/chi.py`

Chi-matrix representation of a Quantum Channel.

## `Chi`

```python
class Chi(QuantumChannel)
```

Pauli basis Chi-matrix representation of a quantum channel.

The Chi-matrix representation of an :math:`n`-qubit quantum channel
:math:`\mathcal{E}` is a matrix :math:`\chi` such that the evolution of a
:class:`~qiskit.quantum_info.DensityMatrix` :math:`\rho` is given by

.. math::

    \mathcal{E}(ρ) = \frac{1}{2^n} \sum_{i, j} \chi_{i,j} P_i ρ P_j

where :math:`[P_0, P_1, ..., P_{4^{n}-1}]` is the :math:`n`-qubit Pauli basis in
lexicographic order. It is related to the :class:`Choi` representation by a change
of basis of the Choi-matrix into the Pauli basis. The :math:`\frac{1}{2^n}`
in the definition above is a normalization factor that arises from scaling the
Pauli basis to make it orthonormal.

See reference [1] for further details.

References:
    1. C.J. Wood, J.D. Biamonte, D.G. Cory, *Tensor networks and graphical calculus
       for open quantum systems*, Quant. Inf. Comp. 15, 0579-0811 (2015).
       `arXiv:1111.6950 [quant-ph] <https://arxiv.org/abs/1111.6950>`_

### `__init__`

```python
def __init__(self, data: QuantumCircuit | circuit.instruction.Instruction | BaseOperator | np.ndarray, input_dims: int | tuple | None=None, output_dims: int | tuple | None=None)
```

Initialize a quantum channel Chi-matrix operator.

Args:
    data: data to initialize superoperator.
    input_dims: the input subsystem dimensions.
    output_dims: the output subsystem dimensions.

Raises:
    QiskitError: if input data is not an N-qubit channel or
                 cannot be initialized as a Chi-matrix.

Additional Information:
    If the input or output dimensions are None, they will be
    automatically determined from the input data. The Chi matrix
    representation is only valid for N-qubit channels.
