---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/quantum_volume.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/quantum_volume.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/quantum_volume.py`

Quantum Volume model circuit.

## `QuantumVolume`

```python
class QuantumVolume(QuantumCircuit)
```

A quantum volume model circuit.

The model circuits are random instances of circuits used to measure
the Quantum Volume metric, as introduced in [1].

The model circuits consist of layers of Haar random
elements of SU(4) applied between corresponding pairs
of qubits in a random bipartition.

Reference Circuit:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import QuantumVolume
   circuit = QuantumVolume(5, 6, seed=10)
   circuit.draw('mpl')

Expanded Circuit:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import QuantumVolume
   from qiskit.visualization.library import _generate_circuit_library_visualization
   circuit = QuantumVolume(5, 6, seed=10, classical_permutation=False)
   _generate_circuit_library_visualization(circuit.decompose())

References:

[1] A. Cross et al. Validating quantum computers using
randomized model circuits, Phys. Rev. A 100, 032328 (2019).
`arXiv:1811.12926 <https://arxiv.org/abs/1811.12926>`__

### `__init__`

```python
def __init__(self, num_qubits: int, depth: int | None=None, seed: int | np.random.Generator | None=None, classical_permutation: bool=True, *, flatten: bool=False) -> None
```

Args:
    num_qubits: number of active qubits in model circuit.
    depth: layers of SU(4) operations in model circuit.
    seed: Random number generator or generator seed.
    classical_permutation: use classical permutations at every layer,
        rather than quantum.
    flatten: If ``False`` (the default), construct a circuit that contains a single
        instruction, which in turn has the actual volume structure.  If ``True``, construct
        the volume structure directly.

## `quantum_volume`

```python
def quantum_volume(num_qubits: int, depth: int | None=None, seed: int | np.random.Generator | None=None) -> QuantumCircuit
```

A quantum volume model circuit.

The model circuits are random instances of circuits used to measure
the Quantum Volume metric, as introduced in [1].

The model circuits consist of layers of Haar random
elements of SU(4) applied between corresponding pairs
of qubits in a random bipartition.

This function is multithreaded and will launch a thread pool with threads equal to the number
of CPUs by default. You can tune the number of threads with the ``RAYON_NUM_THREADS``
environment variable. For example, setting ``RAYON_NUM_THREADS=4`` would limit the thread pool
to 4 threads.

Args:
    num_qubits: The number qubits to use for the generated circuit.
    depth: The number of layers for the generated circuit. If this
        is not specified it will default to ``num_qubits`` layers.
    seed: An optional RNG seed used for generating the random SU(4)
        matrices used in the output circuit. This can be either an
        integer or a numpy generator. If an integer is specified it must
        be an value between 0 and 2**64 - 1.

Reference Circuit:

.. plot::
   :alt: Diagram illustrating the previously described circuit.

   from qiskit.circuit.library import quantum_volume
   circuit = quantum_volume(5, 6, seed=10)
   circuit.draw('mpl')

References:

[1] A. Cross et al. Validating quantum computers using
randomized model circuits, Phys. Rev. A 100, 032328 (2019).
`arXiv:1811.12926 <https://arxiv.org/abs/1811.12926>`__
