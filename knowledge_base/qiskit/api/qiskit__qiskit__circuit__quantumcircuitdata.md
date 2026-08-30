---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/quantumcircuitdata.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/quantumcircuitdata.py
license: Apache-2.0
---

## Module `qiskit/circuit/quantumcircuitdata.py`

A wrapper class for the purposes of validating modifications to
QuantumCircuit.data while maintaining the interface of a python list.

## `QuantumCircuitData`

```python
class QuantumCircuitData(MutableSequence)
```

A wrapper class for the purposes of validating modifications to
QuantumCircuit.data while maintaining the interface of a python list.

### `sort`

```python
def sort(self, *args, **kwargs)
```

In-place stable sort. Accepts arguments of list.sort.

### `copy`

```python
def copy(self)
```

Returns a shallow copy of instruction list.
