---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/tape/operation_recorder.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/tape/operation_recorder.py
license: Apache-2.0
---

## Module `pennylane/tape/operation_recorder.py`

This module contains the :class:`OperationRecorder`.

## `OperationRecorder`

```python
class OperationRecorder(QuantumScript, AnnotatedQueue)
```

A template and quantum function inspector,
allowing easy introspection of operators that have been
applied without requiring a QNode.

**Example**:

The OperationRecorder is a context manager. Executing templates
or quantum functions stores applied operators in the
recorder, which can then be printed.

>>> shape = qp.templates.StronglyEntanglingLayers.shape(n_layers=1, n_wires=2)
>>> weights = np.random.random(shape)
>>> with OperationRecorder() as rec: # doctest: +SKIP
...    qp.templates.StronglyEntanglingLayers(weights, wires=[0, 1])


Alternatively, the :attr:`~.OperationRecorder.queue` attribute can be used
to directly access the applied :class:`~.Operation` and :class:`~.Operator`
objects.

### `__getitem__`

```python
def __getitem__(self, key)
```

Overrides the default because OperationRecorder is both a QuantumScript and an AnnotatedQueue.

If key is an int, the caller is likely indexing the backing QuantumScript. Otherwise, the
caller is likely indexing the backing AnnotatedQueue.
