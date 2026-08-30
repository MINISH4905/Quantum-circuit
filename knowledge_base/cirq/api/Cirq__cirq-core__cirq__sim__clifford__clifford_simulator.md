---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/sim/clifford/clifford_simulator.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/sim/clifford/clifford_simulator.py
license: Apache-2.0
---

## Module `cirq-core/cirq/sim/clifford/clifford_simulator.py`

An efficient simulator for Clifford circuits.

Allowed operations include:
    - X,Y,Z,H,S,CNOT,CZ
    - measurements in the computational basis

The quantum state is specified in two forms:
    1. In terms of stabilizer generators. These are a set of n Pauli operators
    {S_1,S_2,...,S_n} such that S_i |psi> = |psi>.

    This implementation is based on Aaronson and Gottesman,
    2004 (arXiv:quant-ph/0406196).

    2. In the CH-form defined by Bravyi et al, 2018 (arXiv:1808.00128).
    This representation keeps track of overall phase and enables access
    to state vector amplitudes.

## `CliffordSimulator`

```python
class CliffordSimulator(simulator_base.SimulatorBase['cirq.CliffordSimulatorStepResult', 'cirq.CliffordTrialResult', 'cirq.StabilizerChFormSimulationState'])
```

An efficient simulator for Clifford circuits.

### `__init__`

```python
def __init__(self, seed: cirq.RANDOM_STATE_OR_SEED_LIKE=None, split_untangled_states: bool=False)
```

Creates instance of `CliffordSimulator`.

Args:
    seed: The random seed to use for this simulator.
    split_untangled_states: Optimizes simulation by running separable
        states independently and merging those states at the end.

### `is_supported_operation`

```python
def is_supported_operation(op: cirq.Operation) -> bool
```

Checks whether given operation can be simulated by this simulator.

## `CliffordSimulatorStepResult`

```python
class CliffordSimulatorStepResult(simulator_base.StepResultBase['cirq.StabilizerChFormSimulationState'])
```

A `StepResult` that includes `StateVectorMixin` methods.

### `__init__`

```python
def __init__(self, sim_state: cirq.SimulationStateBase[clifford.StabilizerChFormSimulationState])
```

Results of a step of the simulator.
Attributes:
    sim_state: The qubit:SimulationState lookup for this step.

## `CliffordState`

```python
class CliffordState
```

A state of the Clifford simulation.

The state is stored using Bravyi's CH-form which allows access to the full
state vector (including phase).

Gates and measurements are applied to each representation in O(n^2) time.

### `__str__`

```python
def __str__(self) -> str
```

Return the state vector string representation of the state.
