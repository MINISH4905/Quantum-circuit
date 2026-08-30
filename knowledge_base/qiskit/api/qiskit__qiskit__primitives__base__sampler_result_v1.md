---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/base/sampler_result_v1.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/base/sampler_result_v1.py
license: Apache-2.0
---

## Module `qiskit/primitives/base/sampler_result_v1.py`

Sampler V1 result class

## `SamplerResult`

```python
class SamplerResult(_BasePrimitiveResultV1)
```

Result of Sampler V1.

.. code-block:: python

    result = sampler.run(circuits, params).result()

where the i-th elements of ``result`` correspond to the circuit given by ``circuits[i]``,
and the parameter values bounds by ``params[i]``.
For example, ``results.quasi_dists[i]`` gives the quasi-probabilities of bitstrings, and
``result.metadata[i]`` is a metadata dictionary for this circuit and parameters.

Args:
    quasi_dists (list[QuasiDistribution]): List of the quasi-probabilities.
    metadata (list[dict]): List of the metadata.
