---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/channel/ptm.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/channel/ptm.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/channel/ptm.py`

Pauli Transfer Matrix (PTM) representation of a Quantum Channel.

## `PTM`

```python
class PTM(QuantumChannel)
```

Pauli Transfer Matrix (PTM) representation of a Quantum Channel.

The PTM representation of an :math:`n`-qubit quantum channel
:math:`\mathcal{E}` is an :math:`n`-qubit :class:`SuperOp` :math:`R`
defined with respect to vectorization in the Pauli basis instead of
column-vectorization. The elements of the PTM :math:`R` are
given by

.. math::

    R_{i,j} = \frac{1}{2^n} \mbox{Tr}\left[P_i \mathcal{E}(P_j) \right]

where :math:`[P_0, P_1, ..., P_{4^{n}-1}]` is the :math:`n`-qubit Pauli basis in
lexicographic order.

Evolution of a :class:`~qiskit.quantum_info.DensityMatrix`
:math:`\rho` with respect to the PTM is given by

.. math::

    |\mathcal{E}(\rho)\rangle\!\rangle_P = S_P |\rho\rangle\!\rangle_P

where :math:`|A\rangle\!\rangle_P` denotes vectorization in the Pauli basis
:math:`\langle i | A\rangle\!\rangle_P = \sqrt{\frac{1}{2^n}} \mbox{Tr}[P_i A]`.

See reference [1] for further details.

References:
    1. C.J. Wood, J.D. Biamonte, D.G. Cory, *Tensor networks and graphical calculus
       for open quantum systems*, Quant. Inf. Comp. 15, 0579-0811 (2015).
       `arXiv:1111.6950 [quant-ph] <https://arxiv.org/abs/1111.6950>`_

### `__init__`

```python
def __init__(self, data: QuantumCircuit | circuit.instruction.Instruction | BaseOperator | np.ndarray, input_dims: int | tuple | None=None, output_dims: int | tuple | None=None)
```

Initialize a PTM quantum channel operator.

Args:
    data: data to initialize superoperator.
    input_dims: the input subsystem dimensions.
    output_dims: the output subsystem dimensions.

Raises:
    QiskitError: if input data is not an N-qubit channel or
                 cannot be initialized as a PTM.

Additional Information:
    If the input or output dimensions are None, they will be
    automatically determined from the input data. The PTM
    representation is only valid for N-qubit channels.
