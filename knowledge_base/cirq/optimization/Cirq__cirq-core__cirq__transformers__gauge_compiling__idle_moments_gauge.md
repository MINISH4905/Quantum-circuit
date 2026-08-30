---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/gauge_compiling/idle_moments_gauge.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/gauge_compiling/idle_moments_gauge.py
license: Apache-2.0
---

## `IdleMomentsGauge`

```python
class IdleMomentsGauge
```

A transformer that inserts identity-preserving "gauge" gates around idle qubit moments.

This transformer identifies sequences of consecutive idle moments on a single qubit
that meet a `min_length` threshold. For each such sequence, it inserts a randomly
selected gate `G` from `gauges` at the start of the idle period and its inverse `G^-1`
at the end. This ensures the logical circuit behavior remains unchanged ($G \cdot G^{-1} = I$).

The primary goal is to introduce specific structure into idle periods, which is
useful for experiments.

Attributes:
    min_length: Minimum number of consecutive idle moments for a gauge to be applied (>= 1).

    gauges: A sequence of `cirq.Gate` objects to randomly select from.
        Can be a custom tuple or a string alias:
        - `"pauli"`: Uses single-qubit Pauli gates (I, X, Y, Z).
        - `"clifford"`: Uses all 24 single-qubit Clifford gates.

    gauge_beginning: If `True`, applies a gauge to idle moments at the circuit's start,
        before any other qubit operation. Defaults to `False`.

    gauge_ending: If `True`, applies a gauge to idle moments at the circuit's end,
        after the last qubit operation. Defaults to `False`.

### `__call__`

```python
def __call__(self, circuit: cirq.AbstractCircuit, *, context: transformer_api.TransformerContext | None=None, rng_or_seed: np.random.Generator | int | None=None)
```

Apply the IdleMomentGauge transformer.

Args:
    circuit: The circuit to process.
    context: The TransformerContext.
    rng_or_seed: The source of randomness.

Returns:
    A transformed circuit.

Raises:
    ValueError: if the TransformerContext has deep=True.
