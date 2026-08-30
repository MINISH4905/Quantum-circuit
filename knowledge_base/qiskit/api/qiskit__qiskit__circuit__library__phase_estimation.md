---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/phase_estimation.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/phase_estimation.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/phase_estimation.py`

Phase estimation circuit.

## `PhaseEstimation`

```python
class PhaseEstimation(QuantumCircuit)
```

Phase Estimation circuit.

In the Quantum Phase Estimation (QPE) algorithm [1, 2, 3], the Phase Estimation circuit is used
to estimate the phase :math:`\phi` of an eigenvalue :math:`e^{2\pi i\phi}` of a unitary operator
:math:`U`, provided with the corresponding eigenstate :math:`|\psi\rangle`.
That is

.. math::

    U|\psi\rangle = e^{2\pi i\phi} |\psi\rangle

This estimation (and thereby this circuit) is a central routine to several well-known
algorithms, such as Shor's algorithm or Quantum Amplitude Estimation.

References:

[1] Kitaev, A. Y. (1995). Quantum measurements and the Abelian Stabilizer Problem. 1–22.
`quant-ph/9511026 <https://arxiv.org/abs/quant-ph/9511026>`_

[2] Michael A. Nielsen and Isaac L. Chuang. 2011.
Quantum Computation and Quantum Information: 10th Anniversary Edition (10th ed.).
Cambridge University Press, New York, NY, USA.

[3] Qiskit
`textbook <https://github.com/Qiskit/textbook/blob/main/notebooks/ch-algorithms/
quantum-phase-estimation.ipynb>`_

### `__init__`

```python
def __init__(self, num_evaluation_qubits: int, unitary: QuantumCircuit, iqft: QuantumCircuit | None=None, name: str='QPE') -> None
```

Args:
    num_evaluation_qubits: The number of evaluation qubits.
    unitary: The unitary operation :math:`U` which will be repeated and controlled.
    iqft: An inverse Quantum Fourier Transform, per default the inverse of
        :class:`~qiskit.circuit.library.QFT` is used. Note that the QFT should not include
        the usual swaps!
    name: The name of the circuit.

.. note::

    The inverse QFT should not include a swap of the qubit order.

Reference Circuit:

.. plot::
    :alt: Diagram illustrating the previously described circuit.

    from qiskit.circuit import QuantumCircuit
    from qiskit.circuit.library import PhaseEstimation
    from qiskit.visualization.library import _generate_circuit_library_visualization
    unitary = QuantumCircuit(2)
    unitary.x(0)
    unitary.y(1)
    circuit = PhaseEstimation(3, unitary)
    _generate_circuit_library_visualization(circuit)

## `phase_estimation`

```python
def phase_estimation(num_evaluation_qubits: int, unitary: QuantumCircuit | Gate, name: str='QPE') -> QuantumCircuit
```

Phase Estimation circuit.

In the Quantum Phase Estimation (QPE) algorithm [1, 2, 3], the Phase Estimation circuit is used
to estimate the phase :math:`\phi` of an eigenvalue :math:`e^{2\pi i\phi}` of a unitary operator
:math:`U`, provided with the corresponding eigenstate :math:`|\psi\rangle`.
That is

.. math::

    U|\psi\rangle = e^{2\pi i\phi} |\psi\rangle

This estimation (and thereby this circuit) is a central routine to several well-known
algorithms, such as Shor's algorithm or Quantum Amplitude Estimation.

Args:
    num_evaluation_qubits: The number of evaluation qubits.
    unitary: The unitary operation :math:`U` which will be repeated and controlled. This
        can either be a :class:`.QuantumCircuit` or a :class:`.Gate`. Passing gates can often
        be more performant, as it allows calling optimized control and power subroutines.
    name: The name of the output circuit.

Reference Circuit:

.. plot::
   :alt: A phase estimation circuit.
   :include-source:

   from qiskit.circuit.library import phase_estimation, PauliEvolutionGate
   from qiskit.quantum_info import SparsePauliOp

   hamiltonian = SparsePauliOp(["ZZ", "IX", "XI"])
   evo = PauliEvolutionGate(hamiltonian, time=0.1)  # implements exp(-itH)

   circuit = phase_estimation(3, evo)  # QPE for the evolution operator
   circuit.draw("mpl")

References:

[1] Kitaev, A. Y. (1995). Quantum measurements and the Abelian Stabilizer Problem. 1–22.
`quant-ph/9511026 <https://arxiv.org/abs/quant-ph/9511026>`_

[2] Michael A. Nielsen and Isaac L. Chuang. 2011.
Quantum Computation and Quantum Information: 10th Anniversary Edition (10th ed.).
Cambridge University Press, New York, NY, USA.

[3] Qiskit `textbook <https://github.com/Qiskit/textbook/blob/main/notebooks/ch-algorithms/
quantum-phase-estimation.ipynb>`_
