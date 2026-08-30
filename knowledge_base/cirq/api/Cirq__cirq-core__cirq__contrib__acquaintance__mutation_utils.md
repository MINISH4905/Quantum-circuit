---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/acquaintance/mutation_utils.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/acquaintance/mutation_utils.py
license: Apache-2.0
---

## `rectify_acquaintance_strategy`

```python
def rectify_acquaintance_strategy(circuit: cirq.Circuit, acquaint_first: bool=True) -> None
```

Splits moments so that they contain either only acquaintance or permutation gates.

Orders resulting moments so that the first one is of the same type as the previous one.

Args:
    circuit: The acquaintance strategy to rectify.
    acquaint_first: Whether to make acquaintance moment first in when
    splitting the first mixed moment.

Raises:
    TypeError: If the circuit is not an acquaintance strategy.

## `replace_acquaintance_with_swap_network`

```python
def replace_acquaintance_with_swap_network(circuit: cirq.Circuit, qubit_order: Sequence[cirq.Qid], acquaintance_size: int | None=0, swap_gate: cirq.Gate=ops.SWAP) -> bool
```

Replace every rectified moment with acquaintance gates with a generalized swap network.

The generalized swap network has a partition given by the acquaintance gates in that moment
(and singletons for the free qubits). Accounts for reversing effect of swap networks.

Args:
    circuit: The acquaintance strategy.
    qubit_order: The qubits, in order, on which the replacing swap network
        gate acts on.
    acquaintance_size: The acquaintance size of the new swap network gate.
    swap_gate: The gate used to swap logical indices.

Returns: Whether or not the overall effect of the inserted swap network
    gates is to reverse the order of the qubits, i.e. the parity of the
    number of swap network gates inserted.

Raises:
    TypeError: circuit is not an acquaintance strategy.

## `ExposeAcquaintanceGates`

```python
class ExposeAcquaintanceGates
```

Decomposes permutation gates that provide acquaintance opportunities.
