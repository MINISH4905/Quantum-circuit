---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/primitives/base/estimator_result_v1.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/primitives/base/estimator_result_v1.py
license: Apache-2.0
---

## Module `qiskit/primitives/base/estimator_result_v1.py`

Estimator V1 result class

## `EstimatorResult`

```python
class EstimatorResult(_BasePrimitiveResultV1)
```

Result of Estimator V1.

.. code-block:: python

    result = estimator.run(circuits, observables, params).result()

where the i-th elements of ``result`` correspond to the circuit and observable given by
``circuits[i]``, ``observables[i]``, and the parameter values bounds by ``params[i]``.
For example, ``results.values[i]`` gives the expectation value, and ``result.metadata[i]``
is a metadata dictionary for this circuit and parameters.

Args:
    values (np.ndarray): The array of the expectation values.
    metadata (list[dict]): List of the metadata.
