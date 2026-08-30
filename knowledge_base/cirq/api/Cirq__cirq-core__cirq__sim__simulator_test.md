---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/simulator_test.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/simulator_test.py
license: Apache-2.0
---

## Module `cirq-core/cirq/sim/simulator_test.py`

Tests for simulator.py

## `FakeSimulatesSamples`

```python
class FakeSimulatesSamples(SimulatesSamples)
```

A SimulatesSamples that returns specified values from _run.

## `SimulatesIntermediateStateImpl`

```python
class SimulatesIntermediateStateImpl(Generic[TStepResult, TSimulationState], SimulatesIntermediateState[TStepResult, SimulationTrialResult, TSimulationState], metaclass=abc.ABCMeta)
```

A SimulatesIntermediateState that uses the default SimulationTrialResult type.
