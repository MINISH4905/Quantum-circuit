---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/testing/consistent_act_on.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/testing/consistent_act_on.py
license: Apache-2.0
---

## `state_vector_has_stabilizer`

```python
def state_vector_has_stabilizer(state_vector: np.ndarray, stabilizer: cirq.DensePauliString) -> bool
```

Checks that the state_vector is stabilized by the given stabilizer.

The stabilizer should not modify the value of the state_vector, up to the
global phase.

Args:
    state_vector: An input state vector. Is not mutated by this function.
    stabilizer: A potential stabilizer of the above state_vector as a
      DensePauliString.

Returns:
    Whether the stabilizer stabilizes the supplied state.

## `assert_all_implemented_act_on_effects_match_unitary`

```python
def assert_all_implemented_act_on_effects_match_unitary(val: Any, assert_tableau_implemented: bool=False, assert_ch_form_implemented: bool=False) -> None
```

Uses val's effect on final_state_vector to check act_on(val)'s behavior.

Checks that act_on with CliffordTableau or StabilizerStateCHForm behaves
consistently with act_on through final state vector. Does not work with
Operations or Gates expecting non-qubit Qids. If either of the
assert_*_implemented args is true, fails if the corresponding method is not
implemented for the test circuit.

Args:
    val: A gate or operation that may be an input to protocols.act_on.
    assert_tableau_implemented: asserts that protocols.act_on() works with
      val and CliffordTableauSimulationState inputs.
    assert_ch_form_implemented: asserts that protocols.act_on() works with
      val and StabilizerChFormSimulationState inputs.
