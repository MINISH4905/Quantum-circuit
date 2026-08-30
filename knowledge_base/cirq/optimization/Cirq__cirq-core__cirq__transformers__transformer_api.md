---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/transformer_api.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/transformer_api.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/transformer_api.py`

Defines the API for circuit transformers in Cirq.

## `LogLevel`

```python
class LogLevel(enum.Enum)
```

Different logging resolution options for `cirq.TransformerLogger`.

The enum values of the logging levels are used to filter the stored logs when printing.
In general, a logging level `X` includes all logs stored at a level >= 'X'.

Args:
    ALL:     All levels. Used to filter logs when printing.
    DEBUG:   Designates fine-grained informational events that are most useful to debug /
             understand in-depth any unexpected behavior of the transformer.
    INFO:    Designates informational messages that highlight the actions of a transformer.
    WARNING: Designates unwanted or potentially harmful situations.
    NONE:    No levels. Used to filter logs when printing.

## `TransformerLogger`

```python
class TransformerLogger
```

Base Class for transformer logging infrastructure. Defaults to text-based logging.

The logger implementation should be stateful, s.t.:
    - Each call to `register_initial` registers a new transformer stage and initial circuit.
    - Each subsequent call to `log` should store additional logs corresponding to the stage.
    - Each call to `register_final` should register the end of the currently active stage.

The logger assumes that
    - Transformers are run sequentially.
    - Nested transformers are allowed, in which case the behavior would be similar to
      doing a depth-first search on the graph of transformers -- i.e. the top level transformer
      would end (i.e. receive a `register_final` call) once all nested transformers (i.e. all
      `register_initial` calls received while the top level transformer was active) have
      finished (i.e. corresponding `register_final` calls have also been received).
    - This behavior can be simulated by maintaining a stack of currently active stages and
      adding data from `log` calls to the stage at the top of the stack.

The `LogLevel`s can be used to control the input processing and output resolution of the logs.

### `__init__`

```python
def __init__(self) -> None
```

Initializes TransformerLogger.

### `register_initial`

```python
def register_initial(self, circuit: cirq.AbstractCircuit, transformer_name: str) -> None
```

Register the beginning of a new transformer stage.

Args:
    circuit: Input circuit to the new transformer stage.
    transformer_name: Name of the new transformer stage.

### `log`

```python
def log(self, *args: str, level: LogLevel=LogLevel.INFO) -> None
```

Log additional metadata corresponding to the currently active transformer stage.

Args:
    *args: The additional metadata to log.
    level: Logging level to control the amount of metadata that gets put into the context.

Raises:
    ValueError: If there's no active transformer on the stack.

### `register_final`

```python
def register_final(self, circuit: cirq.AbstractCircuit, transformer_name: str) -> None
```

Register the end of the currently active transformer stage.

Args:
    circuit: Final transformed output circuit from the transformer stage.
    transformer_name: Name of the (currently active) transformer stage which ends.

Raises:
    ValueError: If `transformer_name` is different from currently active transformer name.

### `show`

```python
def show(self, level: LogLevel=LogLevel.INFO) -> None
```

Show the stored logs >= level in the desired format.

Args:
    level: The logging level to filter the logs with. The method shows all logs with a
    `LogLevel` >= `level`.

## `NoOpTransformerLogger`

```python
class NoOpTransformerLogger(TransformerLogger)
```

All calls to this logger are a no-op

## `TransformerContext`

```python
class TransformerContext
```

Stores common configurable options for transformers.

Args:
    logger: `cirq.TransformerLogger` instance, which is a stateful logger used for logging
            the actions of individual transformer stages. The same logger instance should be
            shared across different transformer calls.
    tags_to_ignore: Tuple of tags which should be ignored while applying transformations on a
            circuit. Transformers should not transform any operation marked with a tag that
            belongs to this tuple. Note that any instance of a Hashable type (like `str`,
            `cirq.VirtualTag` etc.) is a valid tag.
    deep: If true, the transformer should be recursively applied to all sub-circuits wrapped
            inside circuit operations.

## `TRANSFORMER`

```python
class TRANSFORMER(Protocol)
```

Protocol class defining the Transformer API for circuit transformers in Cirq.

Any callable that satisfies the `cirq.TRANSFORMER` contract, i.e. takes a `cirq.AbstractCircuit`
and `cirq.TransformerContext` and returns a transformed `cirq.AbstractCircuit`, is a valid
transformer in Cirq.

Note that transformers can also accept additional arguments as `**kwargs`, with default values
specified for each keyword argument. A transformer could be a function, for example:

>>> def convert_to_cz(
...     circuit: cirq.AbstractCircuit,
...     *,
...     context: cirq.TransformerContext | None = None,
...     atol: float = 1e-8,
... ) -> cirq.Circuit:
...     ...

Or it could be a class that implements `__call__` with the same API, for example:

>>> class ConvertToSqrtISwaps:
...     def __init__(self):
...         ...
...     def __call__(
...         self,
...         circuit: cirq.AbstractCircuit,
...         *,
...         context: cirq.TransformerContext | None = None,
...      ) -> cirq.AbstractCircuit:
...         ...

## `transformer`

```python
def transformer(cls_or_func: Any=None, *, add_deep_support: bool=False) -> Any
```

Decorator to verify API and append logging functionality to transformer functions & classes.

A transformer is a callable that takes as inputs a `cirq.AbstractCircuit` and
`cirq.TransformerContext`, and returns another `cirq.AbstractCircuit` without
modifying the input circuit. A transformer could be a function, for example:

>>> @cirq.transformer
... def convert_to_cz(
...    circuit: cirq.AbstractCircuit, *, context: cirq.TransformerContext | None = None
... ) -> cirq.Circuit:
...    ...

Or it could be a class that implements `__call__` with the same API, for example:

>>> @cirq.transformer
... class ConvertToSqrtISwaps:
...    def __init__(self):
...        ...
...    def __call__(
...        self,
...        circuit: cirq.AbstractCircuit,
...        *,
...        context: cirq.TransformerContext | None = None,
...    ) -> cirq.Circuit:
...        ...

Note that transformers which take additional parameters as `**kwargs`, with default values
specified for each keyword argument, are also supported. For example:

>>> @cirq.transformer
... def convert_to_sqrt_iswap(
...     circuit: cirq.AbstractCircuit,
...     *,
...     context: cirq.TransformerContext | None = None,
...     atol: float = 1e-8,
...     sqrt_iswap_gate: cirq.ISwapPowGate = cirq.SQRT_ISWAP_INV,
...     cleanup_operations: bool = True,
... ) -> cirq.Circuit:
...     pass

Args:
    cls_or_func: The callable class or function to be decorated.
    add_deep_support: If True, the decorator adds the logic to first apply the
        decorated transformer on subcircuits wrapped inside `cirq.CircuitOperation`s
        before applying it on the top-level circuit, if context.deep is True.

Returns:
    Decorated class / function which includes additional logging boilerplate.
