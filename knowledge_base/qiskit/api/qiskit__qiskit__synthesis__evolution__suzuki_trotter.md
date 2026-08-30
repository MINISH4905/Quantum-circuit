---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/evolution/suzuki_trotter.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/evolution/suzuki_trotter.py
license: Apache-2.0
---

## Module `qiskit/synthesis/evolution/suzuki_trotter.py`

The Suzuki-Trotter product formula.

## `SuzukiTrotter`

```python
class SuzukiTrotter(ProductFormula)
```

The (higher order) Suzuki-Trotter product formula.

The Suzuki-Trotter formulas improve the error of the Lie-Trotter approximation.
For example, the second order decomposition is

.. math::

    e^{A + B} \approx e^{B/2} e^{A} e^{B/2}.

Higher order decompositions are based on recursions, see Ref. [1] for more details.

In this implementation, the operators are provided as sum terms of a Pauli operator.
For example, in the second order Suzuki-Trotter decomposition we approximate

.. math::

    e^{-it(XI + ZZ)} = e^{-it/2 XI}e^{-it ZZ}e^{-it/2 XI} + \mathcal{O}(t^3).

References:
    [1]: D. Berry, G. Ahokas, R. Cleve and B. Sanders,
    "Efficient quantum algorithms for simulating sparse Hamiltonians" (2006).
    `arXiv:quant-ph/0508139 <https://arxiv.org/abs/quant-ph/0508139>`_
    [2]: N. Hatano and M. Suzuki,
    "Finding Exponential Product Formulas of Higher Orders" (2005).
    `arXiv:math-ph/0506007 <https://arxiv.org/pdf/math-ph/0506007.pdf>`_

### `__init__`

```python
def __init__(self, order: int=2, reps: int=1, insert_barriers: bool=False, cx_structure: str='chain', atomic_evolution: Callable[[QuantumCircuit, qiskit.quantum_info.Pauli | SparsePauliOp, float], None] | None=None, wrap: bool=False, preserve_order: bool=True, *, atomic_evolution_sparse_observable: bool=False) -> None
```

Args:
    order: The order of the product formula.
    reps: The number of time steps.
    insert_barriers: Whether to insert barriers between the atomic evolutions.
    cx_structure: How to arrange the CX gates for the Pauli evolutions, can be ``"chain"``,
        where next neighbor connections are used, or ``"fountain"``, where all qubits are
        connected to one. This only takes effect when ``atomic_evolution is None``.
    atomic_evolution: A function to apply the evolution of a single
        :class:`~.quantum_info.Pauli`, or :class:`.SparsePauliOp` of only commuting terms,
        to a circuit. The function takes in three arguments: the circuit to append the
        evolution to, the Pauli operator to evolve, and the evolution time. By default, a
        single Pauli evolution is decomposed into a chain of ``CX`` gates and a single
        ``RZ`` gate.
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

Raises:
    ValueError: If order is not even

### `expand`

```python
def expand(self, evolution: PauliEvolutionGate) -> list[tuple[str, list[int], ParameterValueType]]
```

Expand the Hamiltonian into a Suzuki-Trotter sequence of sparse gates.

For example, the Hamiltonian ``H = IX + ZZ`` for an evolution time ``t`` and
1 repetition for an order 2 formula would get decomposed into a list of 3-tuples
containing ``(pauli, indices, rz_rotation_angle)``, that is:

.. code-block:: text

    ("X", [0], t), ("ZZ", [0, 1], 2t), ("X", [0], t)

Note that the rotation angle contains a factor of 2, such that the evolution
of a Pauli :math:`P` over time :math:`t`, which is :math:`e^{itP}`, is represented
by ``(P, indices, 2 * t)``.

For ``N`` repetitions, this sequence would be repeated ``N`` times and the coefficients
divided by ``N``.

Args:
    evolution: The evolution gate to expand.

Returns:
    The Pauli network implementing the Trotter expansion.

## `real_or_fail`

```python
def real_or_fail(value, tol=100)
```

Return real if close, otherwise fail. Unbound parameters are left unchanged.

Based on NumPy's ``real_if_close``, i.e. ``tol`` is in terms of machine precision for float.
