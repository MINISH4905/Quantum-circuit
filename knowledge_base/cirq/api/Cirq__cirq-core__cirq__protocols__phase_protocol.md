---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/protocols/phase_protocol.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/protocols/phase_protocol.py
license: Apache-2.0
---

## `SupportsPhase`

```python
class SupportsPhase(Protocol)
```

An effect that can be phased around the Z axis of target qubits.

## `phase_by`

```python
def phase_by(val, phase_turns, qubit_index, default=RaiseTypeErrorIfNotProvided)
```

Returns a phased version of the effect.

For example, an X gate phased by 90 degrees would be a Y gate.
This works by calling `val`'s _phase_by_ method and returning
the result.

Args:
    val: The value to describe with a unitary matrix.
    phase_turns: The amount to phase the gate, in fractions of a whole
        turn. Multiply by 2π to get radians.
    qubit_index: The index of the target qubit the phasing applies to. For
        operations this is the index of the qubit within the operation's
        qubit list. For gates it's the index of the qubit within the tuple
        of qubits taken by the gate's `on` method.
    default: The default value to return if `val` can't be phased. If not
        specified, an error is raised when `val` can't be phased.

Returns:
    If `val` has a _phase_by_ method and its result is not NotImplemented,
    that result is returned. Otherwise, the function will return the
    default value provided or raise a TypeError if none was provided.

Raises:
    TypeError:
        `val` doesn't have a _phase_by_ method (or that method returned
        NotImplemented) and no `default` was specified.
