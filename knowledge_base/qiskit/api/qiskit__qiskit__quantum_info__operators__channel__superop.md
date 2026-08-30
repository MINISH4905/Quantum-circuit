---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/channel/superop.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/channel/superop.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/channel/superop.py`

Superoperator representation of a Quantum Channel.

## `SuperOp`

```python
class SuperOp(QuantumChannel)
```

Superoperator representation of a quantum channel.

The Superoperator representation of a quantum channel :math:`\mathcal{E}`
is a matrix :math:`S` such that the evolution of a
:class:`~qiskit.quantum_info.DensityMatrix` :math:`\rho` is given by

.. math::

    |\mathcal{E}(\rho)\rangle\!\rangle = S |\rho\rangle\!\rangle

where the double-ket notation :math:`|A\rangle\!\rangle` denotes a vector
formed by stacking the columns of the matrix :math:`A`
*(column-vectorization)*.

See reference [1] for further details.

References:
    1. C.J. Wood, J.D. Biamonte, D.G. Cory, *Tensor networks and graphical calculus
       for open quantum systems*, Quant. Inf. Comp. 15, 0579-0811 (2015).
       `arXiv:1111.6950 [quant-ph] <https://arxiv.org/abs/1111.6950>`_

### `__init__`

```python
def __init__(self, data: QuantumCircuit | circuit.instruction.Instruction | BaseOperator | np.ndarray, input_dims: tuple | None=None, output_dims: tuple | None=None)
```

Initialize a quantum channel Superoperator operator.

Args:
    data: data to initialize superoperator.
    input_dims: the input subsystem dimensions.
    output_dims: the output subsystem dimensions.

Raises:
    QiskitError: if input data cannot be initialized as a
                 superoperator.

Additional Information:
    If the input or output dimensions are None, they will be
    automatically determined from the input data. If the input data is
    a Numpy array of shape (4**N, 4**N) qubit systems will be used. If
    the input operator is not an N-qubit operator, it will assign a
    single subsystem with dimension specified by the shape of the input.
