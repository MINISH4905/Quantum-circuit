---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/channel/kraus.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/channel/kraus.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/channel/kraus.py`

Kraus representation of a Quantum Channel.

## `Kraus`

```python
class Kraus(QuantumChannel)
```

Kraus representation of a quantum channel.

For a quantum channel :math:`\mathcal{E}`, the Kraus representation is
given by a set of matrices :math:`[A_0,...,A_{K-1}]` such that the
evolution of a :class:`~qiskit.quantum_info.DensityMatrix`
:math:`\rho` is given by

.. math::

    \mathcal{E}(\rho) = \sum_{i=0}^{K-1} A_i \rho A_i^\dagger

A general operator map :math:`\mathcal{G}` can also be written using the
generalized Kraus representation which is given by two sets of matrices
:math:`[A_0,...,A_{K-1}]`, :math:`[B_0,...,B_{K-1}]` such that

.. math::

    \mathcal{G}(\rho) = \sum_{i=0}^{K-1} A_i \rho B_i^\dagger

See reference [1] for further details.

References:
    1. C.J. Wood, J.D. Biamonte, D.G. Cory, *Tensor networks and graphical calculus
       for open quantum systems*, Quant. Inf. Comp. 15, 0579-0811 (2015).
       `arXiv:1111.6950 [quant-ph] <https://arxiv.org/abs/1111.6950>`_

### `__init__`

```python
def __init__(self, data: QuantumCircuit | circuit.instruction.Instruction | BaseOperator | np.ndarray, input_dims: tuple | None=None, output_dims: tuple | None=None)
```

Initialize a quantum channel Kraus operator.

Args:
    data: data to initialize superoperator.
    input_dims: the input subsystem dimensions.
    output_dims: the output subsystem dimensions.

Raises:
    QiskitError: if input data cannot be initialized as a list of Kraus matrices.

Additional Information:
    If the input or output dimensions are None, they will be
    automatically determined from the input data. If the input data is
    a list of Numpy arrays of shape :math:`(2^N,\,2^N)` qubit systems will be
    used. If the input does not correspond to an N-qubit channel, it
    will assign a single subsystem with dimension specified by the
    shape of the input.

### `data`

```python
def data(self)
```

Return list of Kraus matrices for channel.

### `is_cptp`

```python
def is_cptp(self, atol=None, rtol=None)
```

Return True if completely-positive trace-preserving.
