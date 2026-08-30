---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/synthesis/evolution/product_formula.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/synthesis/evolution/product_formula.py
license: Apache-2.0
---

## Module `qiskit/synthesis/evolution/product_formula.py`

A product formula base for decomposing non-commuting operator exponentials.

## `ProductFormula`

```python
class ProductFormula(EvolutionSynthesis)
```

Product formula base class for the decomposition of non-commuting operator exponentials.

:obj:`.LieTrotter` and :obj:`.SuzukiTrotter` inherit from this class.

### `__init__`

```python
def __init__(self, order: int, reps: int=1, insert_barriers: bool=False, cx_structure: str='chain', atomic_evolution: Callable[[QuantumCircuit, qiskit.quantum_info.Pauli | SparsePauliOp, float], None] | None=None, wrap: bool=False, preserve_order: bool=True, *, atomic_evolution_sparse_observable: bool=False) -> None
```

Args:
    order: The order of the product formula.
    reps: The number of time steps.
    insert_barriers: Whether to insert barriers between the atomic evolutions.
    cx_structure: How to arrange the CX gates for the Pauli evolutions, can be
        ``"chain"``, where next neighbor connections are used, or ``"fountain"``,
        where all qubits are connected to one. This only takes effect when
        ``atomic_evolution is None``.
    atomic_evolution: A function to apply the evolution of a single
        :class:`~.quantum_info.Pauli`, or :class:`.SparsePauliOp` of only commuting terms,
        to a circuit. The function takes in three arguments: the circuit to append the
        evolution to, the Pauli operator to evolve, and the evolution time. By default, a
        single Pauli evolution is decomposed into a chain of ``CX`` gates and a single
        ``RZ`` gate.
    wrap: Whether to wrap the atomic evolutions into custom gate objects. Note that setting
        this to ``True`` is slower than ``False``. This only takes effect when
        ``atomic_evolution is None``.
    preserve_order: If ``False``, allows reordering the terms of the operator to
        potentially yield a shallower evolution circuit. Not relevant
        when synthesizing operator with a single term.
    atomic_evolution_sparse_observable: If a custom ``atomic_evolution`` is passed,
        which does not yet support :class:`.SparseObservable`\ s as input, set this
        argument to ``False`` to automatically apply a conversion to :class:`.SparsePauliOp`.
        This argument is supported until Qiskit 2.2, at which point all atomic evolutions
        are required to support :class:`.SparseObservable`\ s as input.

### `expand`

```python
def expand(self, evolution: PauliEvolutionGate) -> list[tuple[str, tuple[int], ParameterValueType]]
```

Apply the product formula to expand the Hamiltonian in the evolution gate.

Args:
    evolution: The :class:`.PauliEvolutionGate`, whose Hamiltonian we expand.

Returns:
    A list of Pauli rotations in a sparse format, where each element is
    ``(paulistring, qubits, coefficient)``. For example, the Lie-Trotter expansion
    of ``H = XI + ZZ`` would return ``[("X", [1], 1), ("ZZ", [0, 1], 1)]``.

### `synthesize`

```python
def synthesize(self, evolution: PauliEvolutionGate) -> QuantumCircuit
```

Synthesize a :class:`.PauliEvolutionGate`.

Args:
    evolution: The evolution gate to synthesize.

Returns:
    QuantumCircuit: A circuit implementing the evolution.

### `settings`

```python
def settings(self) -> dict[str, typing.Any]
```

Return the settings in a dictionary, which can be used to reconstruct the object.

Returns:
    A dictionary containing the settings of this product formula.

Raises:
    NotImplementedError: If a custom atomic evolution is set, which cannot be serialized.

## `real_or_fail`

```python
def real_or_fail(value, tol=100)
```

Return real if close, otherwise fail. Unbound parameters are left unchanged.

Based on NumPy's ``real_if_close``, i.e. ``tol`` is in terms of machine precision for float.

## `reorder_paulis`

```python
def reorder_paulis(paulis: Sequence[SparsePauliLabel], strategy: rx.ColoringStrategy=rx.ColoringStrategy.Saturation) -> list[SparsePauliLabel]
```

Creates an equivalent operator by reordering terms in order to yield a
shallower circuit after evolution synthesis. The original operator remains
unchanged.

This method works in three steps. First, a graph is constructed, where the
nodes are the terms of the operator and where two nodes are connected if
their terms act on the same qubit (for example, the terms :math:`IXX` and
:math:`IYI` would be connected, but not :math:`IXX` and :math:`YII`). Then,
the graph is colored.  Two terms with the same color thus do not act on the
same qubit, and in particular, their evolution subcircuits can be run in
parallel in the greater evolution circuit of ``paulis``.

This method is deterministic and invariant under permutation of the Pauli
term in ``paulis``.

Args:
    paulis: The operator whose terms to reorder.
    strategy: The coloring heuristic to use, see ``ColoringStrategy`` [#].
        Default is ``ColoringStrategy.Saturation``.

.. [#] https://www.rustworkx.org/apiref/rustworkx.ColoringStrategy.html#coloringstrategy

## `wrap_custom_atomic_evolution`

```python
def wrap_custom_atomic_evolution(atomic_evolution, support_sparse_observable)
```

Wrap a custom atomic evolution into compatible format for the product formula.

This includes an inplace action, i.e. the signature is (circuit, operator, time) and
ensuring that ``SparseObservable``\ s are supported.
