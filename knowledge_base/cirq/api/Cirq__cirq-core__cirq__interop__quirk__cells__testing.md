---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/interop/quirk/cells/testing.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/interop/quirk/cells/testing.py
license: Apache-2.0
---

## `assert_url_to_circuit_returns`

```python
def assert_url_to_circuit_returns(json_text: str, circuit: cirq.Circuit | None=None, *, unitary: np.ndarray | None=None, diagram: str | None=None, output_amplitudes_from_quirk: list[dict[str, float]] | None=None, maps: dict[int, int] | None=None) -> None
```

Assert that `quirk_url_to_circuit` functions correctly.

Args:
    json_text: The part of the quirk URL after "#circuit=".
    circuit: The optional expected circuit. If specified and not
        equal to the parsed circuit, an assertion fails.
    unitary: The optional expected unitary of the circuit. If specified
        and the parsed circuit has a different unitary, an assertion fails.
    diagram: The optional expected circuit diagram. If specified and the
        parsed circuit has a different diagram, an assertion fails.
    output_amplitudes_from_quirk: Optional data copied from Quirk's "export
        simulation data" function, for comparison to Cirq's simulator
        results. If specified and the output from the simulation differs
        from this data (after accounting for differences in endian-ness),
        an assertion fails.
    maps: Optional dictionary of test computational basis input states and
        the output computational basis state that they should be mapped to.
        If any state is mapped to the wrong thing, an assertion fails. Note
        that the states are specified using Quirk's little endian
        convention, meaning that the last bit of a binary literal will refer
        to the last qubit's value instead of vice versa.
