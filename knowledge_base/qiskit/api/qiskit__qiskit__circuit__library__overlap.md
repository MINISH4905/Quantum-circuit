---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/overlap.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/overlap.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/overlap.py`

Unitary overlap circuit.

## `UnitaryOverlap`

```python
class UnitaryOverlap(QuantumCircuit)
```

Circuit that returns the overlap between two unitaries :math:`U_2^{\dag} U_1`.

The input quantum circuits must represent unitary operations, since they must be invertible.
If the inputs will have parameters, they are replaced by :class:`.ParameterVector`\s with
names `"p1"` (for circuit ``unitary1``) and `"p2"` (for circuit ``unitary_2``) in the output
circuit.

This circuit is usually employed in computing the fidelity:

.. math::

    \left|\langle 0| U_2^{\dag} U_1|0\rangle\right|^{2}

by computing the probability of being in the all-zeros bit-string, or equivalently,
the expectation value of projector :math:`|0\rangle\langle 0|`.

Example::

    import numpy as np
    from qiskit.circuit.library import EfficientSU2, UnitaryOverlap
    from qiskit.primitives import Sampler

    # get two circuit to prepare states of which we compute the overlap
    circuit = EfficientSU2(2, reps=1)
    unitary1 = circuit.assign_parameters(np.random.random(circuit.num_parameters))
    unitary2 = circuit.assign_parameters(np.random.random(circuit.num_parameters))

    # create the overlap circuit
    overlap = UnitaryOverlap(unitary1, unitary2)

    # sample from the overlap
    sampler = Sampler(options={"shots": 100})
    result = sampler.run(overlap).result()

    # the fidelity is the probability to measure 0
    fidelity = result.quasi_dists[0].get(0, 0)

### `__init__`

```python
def __init__(self, unitary1: QuantumCircuit, unitary2: QuantumCircuit, prefix1: str='p1', prefix2: str='p2', insert_barrier: bool=False)
```

Args:
    unitary1: Unitary acting on the ket vector.
    unitary2: Unitary whose inverse operates on the bra vector.
    prefix1: The name of the parameter vector associated to ``unitary1``,
        if it is parameterized. Defaults to ``"p1"``.
    prefix2: The name of the parameter vector associated to ``unitary2``,
        if it is parameterized. Defaults to ``"p2"``.
    insert_barrier: Whether to insert a barrier between the two unitaries.

Raises:
    CircuitError: Number of qubits in ``unitary1`` and ``unitary2`` does not match.
    CircuitError: Inputs contain measurements and/or resets.

## `unitary_overlap`

```python
def unitary_overlap(unitary1: QuantumCircuit, unitary2: QuantumCircuit, prefix1: str='p1', prefix2: str='p2', insert_barrier: bool=False) -> QuantumCircuit
```

Circuit that returns the overlap between two unitaries :math:`U_2^{\dag} U_1`.

The input quantum circuits must represent unitary operations, since they must be invertible.
If the inputs will have parameters, they are replaced by :class:`.ParameterVector`\s with
names `"p1"` (for circuit ``unitary1``) and `"p2"` (for circuit ``unitary_2``) in the output
circuit.

This circuit is usually employed in computing the fidelity:

.. math::

    \left|\langle 0| U_2^{\dag} U_1|0\rangle\right|^{2}

by computing the probability of being in the all-zeros bit-string, or equivalently,
the expectation value of projector :math:`|0\rangle\langle 0|`.

Reference Circuit:

.. plot::
    :alt: Circuit diagram output by the previous code.
    :include-source:

    import numpy as np
    from qiskit.circuit.library import efficient_su2, unitary_overlap

    # get two circuit to prepare states of which we compute the overlap
    circuit = efficient_su2(2, reps=1)
    unitary1 = circuit.assign_parameters(np.random.random(circuit.num_parameters))
    unitary2 = circuit.assign_parameters(np.random.random(circuit.num_parameters))

    # create the overlap circuit
    overlap = unitary_overlap(unitary1, unitary2)
    overlap.draw('mpl')

Args:
    unitary1: Unitary acting on the ket vector.
    unitary2: Unitary whose inverse operates on the bra vector.
    prefix1: The name of the parameter vector associated to ``unitary1``,
        if it is parameterized. Defaults to ``"p1"``.
    prefix2: The name of the parameter vector associated to ``unitary2``,
        if it is parameterized. Defaults to ``"p2"``.
    insert_barrier: Whether to insert a barrier between the two unitaries.

Raises:
    CircuitError: Number of qubits in ``unitary1`` and ``unitary2`` does not match.
    CircuitError: Inputs contain measurements and/or resets.
