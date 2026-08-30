---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/gauge_compiling/multi_moment_gauge_compiling.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/gauge_compiling/multi_moment_gauge_compiling.py
license: Apache-2.0
---

## Module `cirq-core/cirq/transformers/gauge_compiling/multi_moment_gauge_compiling.py`

Defines the abstraction for multi-moment gauge compiling as a cirq transformer.

## `MultiMomentGaugeTransformer`

```python
class MultiMomentGaugeTransformer(abc.ABC)
```

A gauge transformer that wraps target blocks of moments with single-qubit gates.

In detail, a "gauging moment" of single-qubit gates is inserted before a target block of
moments. These gates are then commuted through the block, resulting in a corresponding
moment of gates after it.

    q₀: ... ───LG0───╭───────────╮────RG0───...
                     │           │
    q₁: ... ───LG1───┤  moments  ├────RG1───...
                     │   to be   │
    q₂: ... ───LG2───┤ gauged on ├────RG2───...
                     │           │
    q₃: ... ───LG3───╰───────────╯────RG3───...

Attributes:
    target: The target gate, gate family or gateset, must exist in each of the moment in
      the "moments to be gauged".
    supported_gates: The gates that are supported in the "moments to be gauged".

### `sample_left_moment`

```python
def sample_left_moment(self, active_qubits: frozenset[ops.Qid], prng: np.random.Generator) -> circuits.Moment
```

Samples a random single-qubit moment to be inserted before the target block.

Args:
    active_qubits: The qubits on which the sampled gates should be applied.
    prng: A pseudorandom number generator.

Returns:
    The sampled moment.

### `gauge_on_moments`

```python
def gauge_on_moments(self, moments_to_gauge: list[circuits.Moment], prng: np.random.Generator) -> list[circuits.Moment]
```

Gauges a block of moments.

Args:
    moments_to_gauge: A list of moments to be gauged.
    prng: A pseudorandom number generator.

Returns:
    A list of moments after gauging.

### `is_target_moment`

```python
def is_target_moment(self, moment: circuits.Moment, context: transformer_api.TransformerContext | None=None) -> bool
```

Checks if a moment is a target for gauging.

A moment is a target moment if it contains at least one target op and
all its operations are supported by this transformer.

### `__call__`

```python
def __call__(self, circuit: circuits.AbstractCircuit, *, context: transformer_api.TransformerContext | None=None, rng_or_seed: np.random.Generator | int | None=None) -> circuits.AbstractCircuit
```

Apply the transformer to the given circuit.

Args:
    circuit: The circuit to transform.
    context: `cirq.TransformerContext` storing common configurable options for transformers.
    prng: A pseudorandom number generator.

Returns:
    The transformed circuit.

Raises:
    ValueError: if the TransformerContext has deep=True.
