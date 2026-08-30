---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/acquaintance/gates.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/acquaintance/gates.py
license: Apache-2.0
---

## `AcquaintanceOpportunityGate`

```python
class AcquaintanceOpportunityGate(ops.Gate, ops.InterchangeableQubitsGate)
```

Represents an acquaintance opportunity. An acquaintance opportunity is
essentially a placeholder in a swap network that may later be replaced with
a logical gate.

## `acquaint_insides`

```python
def acquaint_insides(swap_gate: cirq.Gate, acquaintance_gate: cirq.Operation, qubits: Sequence[cirq.Qid], before: bool, layers: Layers, mapping: dict[ops.Qid, int]) -> None
```

Acquaints each of the qubits with another set specified by an
acquaintance gate.

Args:
    qubits: The list of qubits of which half are individually acquainted
        with another list of qubits.
    layers: The layers to put gates into.
    acquaintance_gate: The acquaintance gate that acquaints the end qubit
        with another list of qubits.
    before: Whether the acquainting is done before the shift.
    swap_gate: The gate used to swap logical indices.
    mapping: The mapping from qubits to logical indices. Used to keep track
        of the effect of inside-acquainting swaps.

## `acquaint_and_shift`

```python
def acquaint_and_shift(parts: tuple[list[cirq.Qid], list[cirq.Qid]], layers: Layers, acquaintance_size: int | None, swap_gate: cirq.Gate, mapping: dict[ops.Qid, int]) -> None
```

Acquaints and shifts a pair of lists of qubits. The first part is
acquainted with every qubit individually in the second part, and vice
versa. Operations are grouped into several layers:
    * prior_interstitial: The first layer of acquaintance gates.
    * prior: The combination of acquaintance gates and swaps that acquaints
        the inner halves.
    * intra: The shift gate.
    * post: The combination of acquaintance gates and swaps that acquaints
        the outer halves.
    * posterior_interstitial: The last layer of acquaintance gates.

Args:
    parts: The two lists of qubits to acquaint.
    layers: The layers to put gates into.
    acquaintance_size: The number of qubits to acquaint at a time. If None,
        after each pair of parts is shifted the union thereof is
        acquainted.
    swap_gate: The gate used to swap logical indices.
    mapping: The mapping from qubits to logical indices. Used to keep track
        of the effect of inside-acquainting swaps.

## `SwapNetworkGate`

```python
class SwapNetworkGate(PermutationGate)
```

A single gate representing a generalized swap network.

Args:
    part_lens: An sequence indicating the sizes of the parts in the
        partition defining the swap network.
    acquaintance_size: An int indicating the locality of the logical gates
        desired; used to keep track of this while nesting. If 0, no
        acquaintance gates are inserted. If None, after each pair of parts
        is shifted the union thereof is acquainted.
    swap_gate: The gate used to swap logical indices.

Attributes:
    part_lens: See above.
    acquaintance_size: See above.
    swap_gate: The gate used to swap logical indices.
