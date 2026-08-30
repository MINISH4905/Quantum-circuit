---
framework: cirq
api_version: v1.7.0
doc_type: api
source_path: cirq-core/cirq/contrib/acquaintance/executor.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/contrib/acquaintance/executor.py
license: Apache-2.0
---

## `ExecutionStrategy`

```python
class ExecutionStrategy(metaclass=abc.ABCMeta)
```

Tells `StrategyExecutorTransformer` how to execute an acquaintance strategy.

An execution strategy tells `StrategyExecutorTransformer` how to execute
an acquaintance strategy, i.e. what gates to implement at the available
acquaintance opportunities.

### `device`

```python
def device(self) -> cirq.Device
```

The device for which the executed acquaintance strategy should be
valid.

### `initial_mapping`

```python
def initial_mapping(self) -> LogicalMapping
```

The initial mapping of logical indices to qubits.

### `get_operations`

```python
def get_operations(self, indices: Sequence[LogicalIndex], qubits: Sequence[cirq.Qid]) -> cirq.OP_TREE
```

Gets the logical operations to apply to qubits.

### `__call__`

```python
def __call__(self, *args, **kwargs)
```

Returns the final mapping of logical indices to qubits after
executing an acquaintance strategy.

## `StrategyExecutorTransformer`

```python
class StrategyExecutorTransformer
```

Executes an acquaintance strategy.

### `__init__`

```python
def __init__(self, execution_strategy: ExecutionStrategy) -> None
```

Initializes transformer.

Args:
    execution_strategy: The `ExecutionStrategy` to execute.

Raises:
    ValueError: if execution_strategy is None.

### `__call__`

```python
def __call__(self, circuit: circuits.AbstractCircuit, context: cirq.TransformerContext | None=None) -> circuits.Circuit
```

Executes an acquaintance strategy using cirq.map_operations_and_unroll and
mutates initial mapping.

Args:
    circuit: `cirq.Circuit` input circuit to transform.
    context: `cirq.TransformerContext` storing common configurable
      options for transformers.

Returns:
    A copy of the modified circuit after executing an acquaintance
      strategy on all instances of AcquaintanceOpportunityGate

## `AcquaintanceOperation`

```python
class AcquaintanceOperation(ops.GateOperation)
```

Represents an a acquaintance opportunity between a particular set of
logical indices on a particular set of physical qubits.

## `GreedyExecutionStrategy`

```python
class GreedyExecutionStrategy(ExecutionStrategy)
```

A greedy execution strategy.

When an acquaintance opportunity is reached, all gates acting on those
qubits in any order are inserted.

### `__init__`

```python
def __init__(self, gates: LogicalGates, initial_mapping: LogicalMapping, device: cirq.Device | None=None) -> None
```

Inits GreedyExecutionStrategy.

Args:
    gates: The gates to insert.
    initial_mapping: The initial mapping of qubits to logical indices.
    device: The device upon which to execute the strategy.

Raises:
    NotImplementedError: If not all gates are of the same arity.

### `canonicalize_gates`

```python
def canonicalize_gates(gates: LogicalGates) -> dict[frozenset, LogicalGates]
```

Canonicalizes a set of gates by the qubits they act on.

Takes a set of gates specified by ordered sequences of logical
indices, and groups those that act on the same qubits regardless of
order.
