---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/symbolize.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/symbolize.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/symbolize.py`

Transformers that symbolize operations.

## `symbolize_single_qubit_gates_by_indexed_tags`

```python
def symbolize_single_qubit_gates_by_indexed_tags(circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None=None, symbolize_tag: SymbolizeTag=SymbolizeTag(prefix='TO-PHXZ')) -> cirq.Circuit
```

Symbolizes single qubit operations by indexed tags prefixed by symbolize_tag.prefix.

Example:
    >>> from cirq import transformers
    >>> q0, q1 = cirq.LineQubit.range(2)
    >>> c = cirq.Circuit(
    ...         cirq.X(q0).with_tags("phxz_0"),
    ...         cirq.CZ(q0,q1),
    ...         cirq.Y(q0).with_tags("phxz_1"),
    ...         cirq.X(q0))
    >>> print(c)
    0: ───X[phxz_0]───@───Y[phxz_1]───X───
                      │
    1: ───────────────@───────────────────
    >>> new_circuit = cirq.symbolize_single_qubit_gates_by_indexed_tags(
    ...     c, symbolize_tag=transformers.SymbolizeTag(prefix="phxz"))
    >>> print(new_circuit)
    0: ───PhXZ(a=a0,x=x0,z=z0)───@───PhXZ(a=a1,x=x1,z=z1)───X───
                                 │
    1: ──────────────────────────@──────────────────────────────

Args:
    circuit: Input circuit to apply the transformations on. The input circuit is not mutated.
    context: `cirq.TransformerContext` storing common configurable options for transformers.
    symbolize_tag: The tag info used to symbolize the phxz gate. Prefix is required.

Returns:
    Copy of the transformed input circuit.
