---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/evolution/qdrift.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/evolution/qdrift.py
license: Apache-2.0
---

## Module `qiskit/synthesis/evolution/qdrift.py`

QDrift Class

## `QDrift`

```python
class QDrift(ProductFormula)
```

The QDrift Trotterization method, which selects each term in the
Trotterization randomly, with a probability proportional to its weight. Based on the work
of Earl Campbell in Ref. [1].

References:
    [1]: E. Campbell, "A random compiler for fast Hamiltonian simulation" (2018).
    `arXiv:quant-ph/1811.08017 <https://arxiv.org/abs/1811.08017>`_

### `__init__`

```python
def __init__(self, reps: int=1, insert_barriers: bool=False, cx_structure: str='chain', atomic_evolution: Callable[[QuantumCircuit, qiskit.quantum_info.Pauli | SparsePauliOp, float], None] | None=None, seed: int | None=None, wrap: bool=False, preserve_order: bool=True, *, atomic_evolution_sparse_observable: bool=False) -> None
```

Args:
    reps: The number of times to repeat the Trotterization circuit.
    insert_barriers: Whether to insert barriers between the atomic evolutions.
    cx_structure: How to arrange the CX gates for the Pauli evolutions, can be
        ``"chain"``, where next neighbor connections are used, or ``"fountain"``, where all
        qubits are connected to one. This only takes effect when
        ``atomic_evolution is None``.
    atomic_evolution: A function to apply the evolution of a single
        :class:`~.quantum_info.Pauli`, or :class:`.SparsePauliOp` of only commuting terms,
        to a circuit. The function takes in three arguments: the circuit to append the
        evolution to, the Pauli operator to evolve, and the evolution time. By default, a
        single Pauli evolution is decomposed into a chain of ``CX`` gates and a single
        ``RZ`` gate.
    seed: An optional seed for reproducibility of the random sampling process.
    wrap: Whether to wrap the atomic evolutions into custom gate objects. This only takes
        effect when ``atomic_evolution is None``.
    preserve_order: If ``False``, allows reordering the terms of the operator to
        potentially yield a shallower evolution circuit. Not relevant
        when synthesizing operator with a single term.
    atomic_evolution_sparse_observable: If a custom ``atomic_evolution`` is passed,
        which does not yet support :class:`.SparseObservable`\ s as input, set this
        argument to ``False`` to automatically apply a conversion to :class:`.SparsePauliOp`.
        This argument is supported until Qiskit 2.2, at which point all atomic evolutions
        are required to support :class:`.SparseObservable`\ s as input.
