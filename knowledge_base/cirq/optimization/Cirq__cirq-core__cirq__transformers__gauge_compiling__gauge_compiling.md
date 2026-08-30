---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/gauge_compiling/gauge_compiling.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/gauge_compiling/gauge_compiling.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/gauge_compiling/gauge_compiling.py`

Creates the abstraction for gauge compiling as a cirq transformer.

## `Gauge`

```python
class Gauge(abc.ABC)
```

A gauge replaces a two qubit gate with an equivalent subcircuit.
0: pre_q0───────two_qubit_gate───────post_q0
                    |
1: pre_q1───────two_qubit_gate───────post_q1

The Gauge class in general represents a family of closely related gauges
(e.g. random z-rotations); Use `sample` method to get a specific gauge.

### `weight`

```python
def weight(self) -> float
```

Returns the relative frequency for selecting this gauge.

### `sample`

```python
def sample(self, gate: ops.Gate, prng: np.random.Generator) -> ConstantGauge
```

Returns a ConstantGauge sampled from a family of gauges.

Args:
    gate: The two qubit gate to replace.
    prng: A numpy random number generator.

Returns:
    A ConstantGauge.

## `ConstantGauge`

```python
class ConstantGauge(Gauge)
```

A gauge that replaces a two qubit gate with a constant gauge.

### `pre`

```python
def pre(self) -> tuple[tuple[ops.Gate, ...], tuple[ops.Gate, ...]]
```

A tuple (ops to apply to q0, ops to apply to q1).

### `post`

```python
def post(self) -> tuple[tuple[ops.Gate, ...], tuple[ops.Gate, ...]]
```

A tuple (ops to apply to q0, ops to apply to q1).

### `on`

```python
def on(self, q0: ops.Qid, q1: ops.Qid) -> ops.Operation
```

Returns the operation that replaces the two qubit gate.

## `SameGateGauge`

```python
class SameGateGauge(Gauge)
```

Same as ConstantGauge but the new two-qubit gate equals the old gate.

## `TwoQubitGateSymbolizer`

```python
class TwoQubitGateSymbolizer
```

Parameterizes two qubit gates with symbols.

Attributes:
    symbolizer: A callable that takes a two-qubit gate and a sequence of symbols,
        and returns a tuple containing the parameterized gate and a dictionary
        mapping symbol names to their values.
    n_symbols: The number of symbols to use for parameterization.

### `__call__`

```python
def __call__(self, two_qubit_gate: ops.Gate, symbols: Sequence[sympy.Symbol]) -> tuple[ops.Gate, dict[str, Real]]
```

Symbolizes a two qubit gate to a parameterized gate.

Args:
    two_qubit_gate: The 2 qubit gate to be symbolized.
    symbols: A sequence of sympy symbols to use for parameterization.

Returns:
    A tuple containing the parameterized gate and a dictionary mapping
    symbol names to their values.

Raises:
    ValueError: If the provided symbols do not match the expected number.

## `GaugeSelector`

```python
class GaugeSelector
```

Samples a gauge from a list of gauges.

### `__call__`

```python
def __call__(self, prng: np.random.Generator) -> Gauge
```

Randomly selects a gauge with probability proportional to its weight.
