---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/ops/tags.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/ops/tags.py
license: Apache-2.0
---

## Module `cirq-core/cirq/ops/tags.py`

Canonical tags for the TaggedOperation class.

## `VirtualTag`

```python
class VirtualTag
```

A `cirq.TaggedOperation` tag indicating that the operation is virtual.

Virtual operations are ones that do not correspond to some physical signal sent
to the quantum computer. An example of such an operation is a Z rotation gates
where the gate is not enacted in the circuit, but instead is tracked in software.
Another example is noise that has been added to a gate to make it appear as
a noisy gate in a `cirq.NoiseModel`.

Operations marked with this tag are presumed to have zero duration of their
own, although they may have a non-zero duration if run in the same Moment
as a non-virtual operation.

## `RoutingSwapTag`

```python
class RoutingSwapTag
```

A 'cirq.TaggedOperation' tag indicated that the operation is an inserted SWAP.

A RoutingSwapTag is meant to be used to distinguish SWAP operations that are inserted during
a routing procedure and SWAP operations that are part of the original circuit before routing.
