---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/merge_single_qubit_gates.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/merge_single_qubit_gates.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/merge_single_qubit_gates.py`

Transformer passes to combine adjacent single-qubit rotations.

## `merge_single_qubit_gates_to_phased_x_and_z`

```python
def merge_single_qubit_gates_to_phased_x_and_z(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, atol: float=1e-08) -> cirq.Circuit
```

Replaces runs of single qubit rotations with `cirq.PhasedXPowGate` and `cirq.ZPowGate`.

Specifically, any run of non-parameterized single-qubit unitaries will be replaced by an
optional PhasedX operation followed by an optional Z operation.

Args:
    circuit: Input circuit to transform. It will not be modified.
    context: `cirq.TransformerContext` storing common configurable options for transformers.
    atol: Absolute tolerance to angle error. Larger values allow more negligible gates to be
        dropped, smaller values increase accuracy.

Returns:
    Copy of the transformed input circuit.

## `merge_single_qubit_gates_to_phxz`

```python
def merge_single_qubit_gates_to_phxz(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, merge_tags_fn: Callable[[cirq.CircuitOperation], list[Hashable]] | None=None, atol: float=1e-08) -> cirq.Circuit
```

Replaces runs of single qubit rotations with a single optional `cirq.PhasedXZGate`.

Specifically, any run of non-parameterized single-qubit unitaries will be replaced by an
optional PhasedXZ.

Args:
    circuit: Input circuit to transform. It will not be modified.
    context: `cirq.TransformerContext` storing common configurable options for transformers.
    merge_tags_fn: A callable returns the tags to be added to the merged operation.
    atol: Absolute tolerance to angle error. Larger values allow more negligible gates to be
        dropped, smaller values increase accuracy.

Returns:
    Copy of the transformed input circuit.

## `merge_single_qubit_moments_to_phxz`

```python
def merge_single_qubit_moments_to_phxz(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, atol: float=1e-08) -> cirq.Circuit
```

Merges adjacent moments with only 1-qubit rotations to a single moment with PhasedXZ gates.

Args:
    circuit: Input circuit to transform. It will not be modified.
    context: `cirq.TransformerContext` storing common configurable options for transformers.
    atol: Absolute tolerance to angle error. Larger values allow more negligible gates to be
        dropped, smaller values increase accuracy.

Returns:
    Copy of the transformed input circuit.

## `merge_single_qubit_gates_to_phxz_symbolized`

```python
def merge_single_qubit_gates_to_phxz_symbolized(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, sweep: Sweep, atol: float=1e-08) -> tuple[cirq.Circuit, Sweep]
```

Merges consecutive single qubit gates as PhasedXZ Gates. Symbolizes if any of
  the consecutive gates is symbolized.

Example:
    >>> q0, q1 = cirq.LineQubit.range(2)
    >>> c = cirq.Circuit(                    cirq.X(q0),                    cirq.CZ(q0,q1)**sympy.Symbol("cz_exp"),                    cirq.Y(q0)**sympy.Symbol("y_exp"),                    cirq.X(q0))
    >>> print(c)
    0: ───X───@──────────Y^y_exp───X───
              │
    1: ───────@^cz_exp─────────────────
    >>> new_circuit, new_sweep = cirq.merge_single_qubit_gates_to_phxz_symbolized(                c, sweep=cirq.Zip(cirq.Points(key="cz_exp", points=[0, 1]),                                  cirq.Points(key="y_exp",  points=[0, 1])))
    >>> print(new_circuit)
    0: ───PhXZ(a=-1,x=1,z=0)───@──────────PhXZ(a=a0,x=x0,z=z0)───
                               │
    1: ────────────────────────@^cz_exp──────────────────────────
    >>> assert new_sweep[0] == cirq.ParamResolver({'a0': -1, 'x0': 1, 'z0': 0, 'cz_exp': 0})
    >>> assert new_sweep[1] == cirq.ParamResolver({'a0': -0.5, 'x0': 0, 'z0': -1, 'cz_exp': 1})

Args:
    circuit: Input circuit to transform. It will not be modified.
    context: `cirq.TransformerContext` storing common configurable options for transformers.
    sweep: Sweep of the symbols in the input circuit. An updated Sweep will be returned
        based on the transformation.
    atol: Absolute tolerance to angle error. Larger values allow more negligible gates to be
        dropped, smaller values increase accuracy.

Returns:
    Copy of the transformed input circuit.
