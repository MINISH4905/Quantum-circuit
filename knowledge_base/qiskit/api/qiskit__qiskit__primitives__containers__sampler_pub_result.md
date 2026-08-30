---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/containers/sampler_pub_result.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/containers/sampler_pub_result.py
license: Apache-2.0
---

## Module `qiskit/primitives/containers/sampler_pub_result.py`

Sampler Pub result class

## `SamplerPubResult`

```python
class SamplerPubResult(PubResult)
```

Result of Sampler Pub.

This is a :class:`.SamplerV2`-specific subclass of :class:`.PubResult` that adds helper methods
to deal with the bit-array like :class:`.BitArray` data directly (implicitly going via the
:class:`.DataBin` in :attr:`data`).  See :class:`.PubResult` for more documentation on how to
use this class.

### `join_data`

```python
def join_data(self, names: Iterable[str] | None=None) -> BitArray | np.ndarray
```

Join data from many registers into one data container.

Data is joined along the bits axis. For example, for :class:`~.BitArray` data, this corresponds
to bitstring concatenation.

Args:
    names: Which registers to join. Their order is maintained, for example, given
        ``["alpha", "beta"]``, the data from register ``alpha`` is placed to the left of the
        data from register ``beta``. When ``None`` is given, this value is set to the
        ordered list of register names, which will have been preserved from the input circuit
        order.

Returns:
    Joint data.

Raises:
    ValueError: If specified names are empty.
    ValueError: If specified name does not exist.
    TypeError: If specified data comes from incompatible types.
