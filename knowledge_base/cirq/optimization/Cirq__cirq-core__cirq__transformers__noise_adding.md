---
framework: cirq
api_version: v1.7.0
doc_type: optimization
source_path: cirq-core/cirq/transformers/noise_adding.py
source_url: https://github.com/quantumlib/Cirq/blob/de651a7886d1a1383d595f95f36b93ed3ea91685/cirq-core/cirq/transformers/noise_adding.py
license: Apache-2.0
---

## `DepolarizingNoiseTransformer`

```python
class DepolarizingNoiseTransformer
```

Add local depolarizing noise after two-qubit gates in a specified circuit. More specifically,
with probability p, append a random non-identity two-qubit Pauli operator after each specified
two-qubit gate.

Attrs:
    p: The probability with which to add noise.
    target_gate: Add depolarizing noise after this type of gate

### `__init__`

```python
def __init__(self, p: float | Mapping[tuple[ops.Qid, ops.Qid], float], target_gate: ops.Gate=ops.CZ)
```

Initialize the depolarizing noise transformer with some depolarizing probability and
target gate.

Args:
    p: The depolarizing probability, either a single float or a mapping from pairs of qubits
       to floats.
   target_gate: The gate after which to add depolarizing noise.

Raises:
    TypeError: If `p` is not either be a float or a mapping from sorted qubit pairs to
               floats.

### `__call__`

```python
def __call__(self, circuit: circuits.AbstractCircuit, rng: np.random.Generator | None=None, *, context: transformer_api.TransformerContext | None=None)
```

Apply the transformer to the given circuit.

Args:
    circuit: The circuit to add noise to.
    context: Not used; to satisfy transformer API.

Returns:
    The transformed circuit.
