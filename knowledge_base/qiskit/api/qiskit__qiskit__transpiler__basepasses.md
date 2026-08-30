---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/transpiler/basepasses.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/basepasses.py
license: Apache-2.0
---

## Module `qiskit/transpiler/basepasses.py`

Base transpiler passes.

## `MetaPass`

```python
class MetaPass(abc.ABCMeta)
```

Metaclass for transpiler passes.

Enforces the creation of some fields in the pass while allowing passes to
override ``__init__``.

## `BasePass`

```python
class BasePass(GenericPass[DAGCircuit, DAGCircuit], metaclass=MetaPass)
```

Base class for transpiler passes.

### `run`

```python
def run(self, dag: DAGCircuit)
```

Run a pass on the DAGCircuit. This is implemented by the pass developer.

Args:
    dag: the dag on which the pass is run.

Raises:
    NotImplementedError: when this is left unimplemented for a pass.

### `is_transformation_pass`

```python
def is_transformation_pass(self)
```

Check if the pass is a transformation pass.

If the pass is a TransformationPass, that means that the pass can manipulate the DAG,
but cannot modify the property set (but it can be read).

### `is_analysis_pass`

```python
def is_analysis_pass(self)
```

Check if the pass is an analysis pass.

If the pass is an AnalysisPass, that means that the pass can analyze the DAG and write
the results of that analysis in the property set. Modifications on the DAG are not allowed
by this kind of pass.

### `__call__`

```python
def __call__(self, circuit: QuantumCircuit, property_set: PropertySet | dict | None=None) -> QuantumCircuit
```

Runs the pass on circuit.

Args:
    circuit: The dag on which the pass is run.
    property_set: Input/output property set. An analysis pass might change the property set
        in-place.  If not given, the existing ``property_set`` attribute of the pass will
        be used (if set).

Returns:
    If a transformation pass, the resulting QuantumCircuit.
    If analysis pass, the input circuit.

## `AnalysisPass`

```python
class AnalysisPass(BasePass)
```

An analysis pass: change property set, not DAG.

## `TransformationPass`

```python
class TransformationPass(BasePass)
```

A transformation pass: change DAG, not property set.
