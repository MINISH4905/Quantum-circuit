---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/work/observable_settings.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/work/observable_settings.py
license: Apache-2.0
---

## `InitObsSetting`

```python
class InitObsSetting
```

A pair of initial state and observable.

Usually, given a circuit you want to iterate through many
InitObsSettings to vary the initial state preparation and output
observable.

## `zeros_state`

```python
def zeros_state(qubits: Iterable[cirq.Qid])
```

Return the ProductState that is |00..00> on all qubits.

## `observables_to_settings`

```python
def observables_to_settings(observables: Iterable[cirq.PauliString], qubits: Iterable[cirq.Qid]) -> Iterator[InitObsSetting]
```

Transform an observable to an InitObsSetting initialized in the
all-zeros state.
