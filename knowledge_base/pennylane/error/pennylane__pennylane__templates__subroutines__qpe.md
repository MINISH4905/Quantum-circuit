---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/templates/subroutines/qpe.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/templates/subroutines/qpe.py
license: Apache-2.0
---

## Module `pennylane/templates/subroutines/qpe.py`

Contains the QuantumPhaseEstimation template.

## `QuantumPhaseEstimation`

```python
class QuantumPhaseEstimation(ErrorOperation)
```

Performs the
`quantum phase estimation <https://en.wikipedia.org/wiki/Quantum_phase_estimation_algorithm>`__
circuit.

Given a unitary matrix :math:`U`, this template applies the circuit for quantum phase
estimation. The unitary is applied to the qubits specified by ``target_wires`` and :math:`n`
qubits are used for phase estimation as specified by ``estimation_wires``.

.. figure:: ../../_static/templates/subroutines/qpe.svg
    :align: center
    :width: 60%
    :target: javascript:void(0);

Args:
    unitary (array or Operator): the phase estimation unitary, specified as a matrix or an
        :class:`~.Operator`
    target_wires (Union[Wires, Sequence[int], or int]): the target wires to apply the unitary.
        If the unitary is specified as an operator, the target wires should already have been
        defined as part of the operator. In this case, target_wires should not be specified.
    estimation_wires (Union[Wires, Sequence[int], or int]): the wires to be used for phase
        estimation

Raises:
    QuantumFunctionError: if the ``target_wires`` and ``estimation_wires`` share a common
        element, or if ``target_wires`` are specified for an operator unitary.

.. details::
    :title: Usage Details

    This circuit can be used to perform the standard quantum phase estimation algorithm, consisting
    of the following steps:

    #. Prepare ``target_wires`` in a given state. If ``target_wires`` are prepared in an eigenstate
       of :math:`U` that has corresponding eigenvalue :math:`e^{2 \pi i \theta}` with phase
       :math:`\theta \in [0, 1)`, this algorithm will measure :math:`\theta`. Other input states can
       be prepared more generally.
    #. Apply the ``QuantumPhaseEstimation`` circuit.
    #. Measure ``estimation_wires`` using :func:`~.probs`, giving a probability distribution over
       measurement outcomes in the computational basis.
    #. Find the index of the largest value in the probability distribution and divide that number by
       :math:`2^{n}`. This number will be an estimate of :math:`\theta` with an error that decreases
       exponentially with the number of qubits :math:`n`.

    Note that if :math:`\theta \in (-1, 0]`, we can estimate the phase by again finding the index
    :math:`i` found in step 4 and calculating :math:`\theta \approx \frac{1 - i}{2^{n}}`. An example
    of this case is below.

    Consider the matrix corresponding to a rotation from an :class:`~.RX` gate:

    .. code-block:: python

        import pennylane as qp
        from pennylane.templates import QuantumPhaseEstimation
        from pennylane import numpy as np

        phase = 5
        target_wires = [0]
        unitary = qp.RX(phase, wires=0).matrix()

    The ``phase`` parameter can be estimated using ``QuantumPhaseEstimation``. An example is
    shown below using a register of five phase-estimation qubits:

    .. code-block:: python

        n_estimation_wires = 5
        estimation_wires = range(1, n_estimation_wires + 1)

        dev = qp.device("default.qubit", wires=n_estimation_wires + 1)

        @qp.qnode(dev)
        def circuit():
            # Start in the |+> eigenstate of the unitary
            qp.Hadamard(wires=target_wires)

            QuantumPhaseEstimation(
                unitary,
                target_wires=target_wires,
                estimation_wires=estimation_wires,
            )

            return qp.probs(estimation_wires)

        phase_estimated = np.argmax(circuit()) / 2 ** n_estimation_wires

        # Need to rescale phase due to convention of RX gate
        phase_estimated = 4 * np.pi * (1 - phase_estimated)

    We can also perform phase estimation on an operator. Note that since operators are defined
    with target wires, the target wires should not be provided for the QPE.

    .. code-block:: python


        # use the product to specify compound operators
        unitary = qp.RX(np.pi / 2, wires=[0]) @ qp.CNOT(wires=[0, 1])
        eigenvector = np.array([-1/2, -1/2, 1/2, 1/2])

        n_estimation_wires = 5
        estimation_wires = range(2, n_estimation_wires + 2)
        target_wires = [0, 1]

        dev = qp.device("default.qubit", wires=n_estimation_wires + 2)

        @qp.qnode(dev)
        def circuit():
            qp.StatePrep(eigenvector, wires=target_wires)
            QuantumPhaseEstimation(
                unitary,
                estimation_wires=estimation_wires,
            )
            return qp.probs(estimation_wires)

        phase_estimated = np.argmax(circuit()) / 2 ** n_estimation_wires

### `target_wires`

```python
def target_wires(self)
```

The target wires of the QPE

### `estimation_wires`

```python
def estimation_wires(self)
```

The estimation wires of the QPE

### `error`

```python
def error(self)
```

The QPE error computed from the spectral norm error of the input unitary operator.

**Example**

>>> class CustomOP(qp.resource.ErrorOperation):
...    def error(self):
...       return qp.resource.SpectralNormError(0.005)
>>> Op = CustomOP(wires=[0])
>>> QPE = QuantumPhaseEstimation(Op, estimation_wires = range(1, 5))
>>> QPE.error()
SpectralNormError(0.075)

### `compute_decomposition`

```python
def compute_decomposition(*_, unitary, estimation_wires, **__)
```

Representation of the QPE circuit as a product of other operators.

.. math:: O = O_1 O_2 \dots O_n.


.. seealso:: :meth:`~.QuantumPhaseEstimation.decomposition`.

Args:
    wires (Any or Iterable[Any]): wires that the QPE circuit acts on
    unitary (Operator): the phase estimation unitary, specified as an operator
    target_wires (Any or Iterable[Any]): the target wires to apply the unitary
    estimation_wires (Any or Iterable[Any]): the wires to be used for phase estimation

Returns:
    list[.Operator]: decomposition of the operator
