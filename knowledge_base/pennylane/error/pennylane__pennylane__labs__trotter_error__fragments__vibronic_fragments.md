---
framework: pennylane
api_version: v0.45.1
doc_type: error
source_path: pennylane/labs/trotter_error/fragments/vibronic_fragments.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/labs/trotter_error/fragments/vibronic_fragments.py
license: Apache-2.0
---

## Error surface of `pennylane/labs/trotter_error/fragments/vibronic_fragments.py`

### Validation

## `_validate_input`

```python
def _validate_input(states: int, modes: int, freqs: np.ndarray, taylor_coeffs: Sequence[np.ndarray]) -> None
```

Validate that the shapes of the harmonic frequencies and the Taylor coefficients are correct.
