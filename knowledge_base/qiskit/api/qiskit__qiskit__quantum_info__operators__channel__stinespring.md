---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/quantum_info/operators/channel/stinespring.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/quantum_info/operators/channel/stinespring.py
license: Apache-2.0
---

## Module `qiskit/quantum_info/operators/channel/stinespring.py`

Stinespring representation of a Quantum Channel.

## `Stinespring`

```python
class Stinespring(QuantumChannel)
```

Stinespring representation of a quantum channel.

The Stinespring representation of a quantum channel :math:`\mathcal{E}`
is a rectangular matrix :math:`A` such that the evolution of a
:class:`~qiskit.quantum_info.DensityMatrix` :math:`\rho` is given by

.. math::

    \mathcal{E}(ρ) = \mbox{Tr}_2\left[A ρ A^\dagger\right]

where :math:`\mbox{Tr}_2` is the :func:`partial_trace` over subsystem 2.

A general operator map :math:`\mathcal{G}` can also be written using the
generalized Stinespring representation which is given by two matrices
:math:`A`, :math:`B` such that

.. math::

    \mathcal{G}(ρ) = \mbox{Tr}_2\left[A ρ B^\dagger\right]

See reference [1] for further details.

References:
    1. C.J. Wood, J.D. Biamonte, D.G. Cory, *Tensor networks and graphical calculus
       for open quantum systems*, Quant. Inf. Comp. 15, 0579-0811 (2015).
       `arXiv:1111.6950 [quant-ph] <https://arxiv.org/abs/1111.6950>`_

### `__init__`

```python
def __init__(self, data: QuantumCircuit | circuit.instruction.Instruction | BaseOperator | np.ndarray, input_dims: int | tuple | None=None, output_dims: int | tuple | None=None)
```

Initialize a quantum channel Stinespring operator.

Args:
    data: data to initialize superoperator.
    input_dims: the input subsystem dimensions.
    output_dims: the output subsystem dimensions.

Raises:
    QiskitError: if input data cannot be initialized as
                 a list of Kraus matrices.

Additional Information:
    If the input or output dimensions are None, they will be
    automatically determined from the input data. This can fail for the
    Stinespring operator if the output dimension cannot be automatically
    determined.

### `is_cptp`

```python
def is_cptp(self, atol=None, rtol=None)
```

Return True if completely-positive trace-preserving.
