---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/target_gatesets/compilation_target_gateset.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/target_gatesets/compilation_target_gateset.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/target_gatesets/compilation_target_gateset.py`

Base class for creating custom target gatesets which can be used for compilation.

## `create_transformer_with_kwargs`

```python
def create_transformer_with_kwargs(transformer: cirq.TRANSFORMER, **kwargs) -> cirq.TRANSFORMER
```

Method to capture additional keyword arguments to transformers while preserving mypy type.

Returns a `cirq.TRANSFORMER` which, when called with a circuit and transformer context, is
equivalent to calling `transformer(circuit, context=context, **kwargs)`. It is often useful to
capture keyword arguments of a transformer before passing them as an argument to an API that
expects `cirq.TRANSFORMER`. For example:

>>> def run_transformers(transformers: list[cirq.TRANSFORMER]):
...     circuit = cirq.Circuit(cirq.X(cirq.q(0)))
...     context = cirq.TransformerContext()
...     for transformer in transformers:
...         transformer(circuit, context=context)
...
>>> transformers: list[cirq.TRANSFORMER] = []
>>> transformers.append(
...     cirq.create_transformer_with_kwargs(
...         cirq.expand_composite, no_decomp=lambda op: cirq.num_qubits(op) <= 2
...     )
... )
>>> transformers.append(cirq.create_transformer_with_kwargs(cirq.merge_k_qubit_unitaries, k=2))
>>> run_transformers(transformers)


Args:
     transformer: A `cirq.TRANSFORMER` for which additional kwargs should be captured.
     **kwargs: The keyword arguments which should be captured and passed to `transformer`.

Returns:
    A `cirq.TRANSFORMER` method `transformer_with_kwargs`, s.t. executing
    `transformer_with_kwargs(circuit, context=context)` is equivalent to executing
    `transformer(circuit, context=context, **kwargs)`.

Raises:
    SyntaxError: if **kwargs contain a 'context'.

## `CompilationTargetGateset`

```python
class CompilationTargetGateset(ops.Gateset, metaclass=abc.ABCMeta)
```

Abstract base class to create gatesets that can be used as targets for compilation.

An instance of this type can be passed to transformers like `cirq.optimize_for_target_gateset`,
which can transform any given circuit to contain gates accepted by this gateset.

### `__init__`

```python
def __init__(self, *gates: type[cirq.Gate] | cirq.Gate | cirq.GateFamily, name: str | None=None, unroll_circuit_op: bool=True, preserve_moment_structure: bool=True, reorder_operations: bool=False)
```

Initializes CompilationTargetGateset.

Args:
    *gates: A list of `cirq.Gate` subclasses / `cirq.Gate` instances /
        `cirq.GateFamily` instances to initialize the Gateset.
    name: (Optional) Name for the Gateset. Useful for description.
    unroll_circuit_op: If True, `cirq.CircuitOperation` is recursively
        validated by validating the underlying `cirq.Circuit`.
    preserve_moment_structure: Whether to preserve the moment structure of the
        circuit during compilation or not.
    reorder_operations: Whether to attempt to reorder the operations in order to reduce
        circuit depth or not (can be True only if preserve_moment_structure=False).
Raises:
    ValueError: If both reorder_operations and preserve_moment_structure are True.

### `num_qubits`

```python
def num_qubits(self) -> int
```

Maximum number of qubits on which a gate from this gateset can act upon.

### `decompose_to_target_gateset`

```python
def decompose_to_target_gateset(self, op: cirq.Operation, moment_idx: int) -> DecomposeResult
```

Method to rewrite the given operation using gates from this gateset.

Args:
    op: `cirq.Operation` to be rewritten using gates from this gateset.
    moment_idx: Moment index where the given operation `op` occurs in a circuit.

Returns:
    - An equivalent `cirq.OP_TREE` implementing `op` using gates from this gateset.
    - `None` or `NotImplemented` if does not know how to decompose `op`.

### `preprocess_transformers`

```python
def preprocess_transformers(self) -> list[cirq.TRANSFORMER]
```

List of transformers which should be run before decomposing individual operations.

### `postprocess_transformers`

```python
def postprocess_transformers(self) -> list[cirq.TRANSFORMER]
```

List of transformers which should be run after decomposing individual operations.

## `TwoQubitCompilationTargetGateset`

```python
class TwoQubitCompilationTargetGateset(CompilationTargetGateset)
```

Abstract base class to create two-qubit target gatesets.

This base class can be used to create two-qubit compilation target gatesets. It automatically
implements the logic to

    1. Apply `self.preprocess_transformers` to the input circuit, which by default will:
        a) Expand composite gates acting on > 2 qubits using `cirq.expand_composite`.
        b) Merge connected components of 1 & 2 qubit unitaries into tagged
            `cirq.CircuitOperation` using `cirq.merge_k_qubit_unitaries`.

    2. Apply `self.decompose_to_target_gateset` to rewrite each operation (including merged
    connected components from 1b) using gates from this gateset.
        a) Uses `self._decompose_single_qubit_operation`, `self._decompose_two_qubit_operation`
           and `self._decompose_multi_qubit_operation` to figure out how to rewrite (merged
           connected components of) operations using only gates from this gateset.
        b) A merged connected component containing only 1 & 2q gates from this gateset is
           replaced with a more efficient rewrite using `self._decompose_two_qubit_operation`
           iff the rewritten op-tree is lesser number of 2q interactions.

        Replace connected components with inefficient implementations (higher number of 2q
           interactions) with efficient rewrites to minimize total number of 2q interactions.

    3. Apply `self.postprocess_transformers` to the transformed circuit, which by default will:
        a) Apply `cirq.merge_single_qubit_moments_to_phxz` to preserve moment structure (eg:
           alternating layers of single/two qubit gates).
        b) Apply `cirq.drop_negligible_operations` and `cirq.drop_empty_moments` to minimize
           circuit depth.

Derived classes should simply implement `self._decompose_two_qubit_operation` abstract method
and provide analytical decomposition of any 2q unitary using gates from the target gateset.
