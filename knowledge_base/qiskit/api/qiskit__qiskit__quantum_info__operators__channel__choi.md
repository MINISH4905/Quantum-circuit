---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/channel/choi.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/channel/choi.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/channel/choi.py`

Choi-matrix representation of a Quantum Channel.

## `Choi`

```python
class Choi(QuantumChannel)
```

Choi-matrix representation of a Quantum Channel.

The Choi-matrix representation of a quantum channel :math:`\mathcal{E}`
is a matrix

.. math::

    \Lambda = \sum_{i,j} |i\rangle\!\langle j|\otimes
                \mathcal{E}\left(|i\rangle\!\langle j|\right)

Evolution of a :class:`~qiskit.quantum_info.DensityMatrix`
:math:`\rho` with respect to the Choi-matrix is given by

.. math::

    \mathcal{E}(\rho) = \mbox{Tr}_{1}\left[\Lambda
                        (\rho^T \otimes \mathbb{I})\right]

where :math:`\mbox{Tr}_1` is the :func:`partial_trace` over subsystem 1.

See reference [1] for further details.

References:
    1. C.J. Wood, J.D. Biamonte, D.G. Cory, *Tensor networks and graphical calculus
       for open quantum systems*, Quant. Inf. Comp. 15, 0579-0811 (2015).
       `arXiv:1111.6950 [quant-ph] <https://arxiv.org/abs/1111.6950>`_

### `__init__`

```python
def __init__(self, data: QuantumCircuit | circuit.instruction.Instruction | BaseOperator | np.ndarray, input_dims: int | tuple | None=None, output_dims: int | tuple | None=None)
```

Initialize a quantum channel Choi matrix operator.

Args:
    data: data to initialize superoperator.
    input_dims: the input subsystem dimensions.
    output_dims: the output subsystem dimensions.

Raises:
    QiskitError: if input data cannot be initialized as a
                 Choi matrix.

Additional Information:
    If the input or output dimensions are None, they will be
    automatically determined from the input data. If the input data is
    a Numpy array of shape (4**N, 4**N) qubit systems will be used. If
    the input operator is not an N-qubit operator, it will assign a
    single subsystem with dimension specified by the shape of the input.
