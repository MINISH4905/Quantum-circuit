---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/acquaintance/__init__.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/acquaintance/__init__.py
license: Apache-2.0
---

## Module `cirq-core/cirq/contrib/acquaintance/__init__.py`

Tools for creating and using acquaintance strategies.

In quantum circuit compilation, an "acquaintance strategy" refers to a systematic
routing or swapping algorithm designed to bring specific logical qubits into close
physical proximity on a hardware processor so they can interact.

On near-term physical quantum hardware, qubits have restricted connectivity and can
typically only execute gates with their immediate physical neighbors. If a quantum
algorithm requires an operation between qubits that are physically far apart on the
chip, the compiler must insert a sequence of SWAP gates to move them next to each
other.

An "acquaintance opportunity" is defined as the exact moment when the required
target logical qubits are successfully brought together on adjacent physical
qubits. An acquaintance strategy is the overarching algorithmic plan---often using
linear swap networks or permutation logic---that ensures all the required
combinations of qubits get "acquainted" over the course of the circuit's execution.

Within the Cirq contrib module for acquaintance, the following are some key
elements of the implementation:

*   `AcquaintanceOperation`: An operation representing an "acquaintance opportunity"
    between a set of logical qubits on specific physical qubits.

•   `StrategyExecutor` and `StrategyExecutorTransformer`: Classes responsible for
    executing a defined acquaintance strategy on a given circuit.

•   Various strategies: The module provided different strategies for creating the
    necessary swap networks to bring qubits together, such as
    `cubic_acquaintance_strategy` and `quartic_paired_acquaintance_strategy`.

See https://arxiv.org/abs/1905.05118 for a paper detailing acquaintance strategies.
