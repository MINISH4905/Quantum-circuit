---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/act_on_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/act_on_protocol.py
license: Apache-2.0
---

## `SupportsActOn`

```python
class SupportsActOn(Protocol)
```

An object that explicitly specifies how to act on simulator states.

## `SupportsActOnQubits`

```python
class SupportsActOnQubits(Protocol)
```

An object that explicitly specifies how to act on specific qubits.

## `act_on`

```python
def act_on(action: Any, sim_state: cirq.SimulationStateBase, qubits: Sequence[cirq.Qid] | None=None, *, allow_decompose: bool=True) -> None
```

Applies an action to a state argument.

For example, the action may be a `cirq.Operation` and the state argument may
represent the internal state of a state vector simulator (a
`cirq.StateVectorSimulationState`).

For non-operations, the `qubits` argument must be explicitly supplied.

The action is applied by first checking if `action._act_on_` exists and
returns `True` (instead of `NotImplemented`) for the given object. Then
fallback strategies specified by the state argument via `_act_on_fallback_`
are attempted. If those also fail, the method fails with a `TypeError`.

Args:
    action: The operation, gate, or other to apply to the state tensor.
    sim_state: A mutable state object that should be modified by the
        action. May specify an `_act_on_fallback_` method to use in case
        the action doesn't recognize it.
    qubits: The sequence of qubits to use when applying the action.
    allow_decompose: Defaults to True. Forwarded into the
        `_act_on_fallback_` method of `sim_state`. Determines if
        decomposition should be used or avoided when attempting to act
        `action` on `sim_state`. Used by internal methods to avoid
        redundant decompositions.

Returns:
    Nothing. Results are communicated by editing `sim_state`.

Raises:
    ValueError: If called on an operation and supplied qubits, if not called
        on an operation and no qubits are supplied, or if `_act_on_` or
         `_act_on_fallback_` returned something other than `True` or
         `NotImplemented`.
    TypeError: Failed to act `action` on `sim_state`.
