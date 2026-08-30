---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/converters/__init__.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/converters/__init__.py
license: Apache-2.0
---

## Module `qiskit/converters/__init__.py`

=============================================
Circuit Converters (:mod:`qiskit.converters`)
=============================================

.. currentmodule:: qiskit.converters

QuantumCircuit -> circuit components
====================================

.. autofunction:: circuit_to_instruction
.. autofunction:: circuit_to_gate

QuantumCircuit <-> DagCircuit
=============================

.. autofunction:: circuit_to_dag
.. autofunction:: dag_to_circuit

QuantumCircuit <-> DagDependency
================================

.. autofunction:: dagdependency_to_circuit
.. autofunction:: circuit_to_dagdependency

DagCircuit <-> DagDependency
============================

.. autofunction:: dag_to_dagdependency
.. autofunction:: dagdependency_to_dag

## `isinstanceint`

```python
def isinstanceint(obj)
```

Like isinstance(obj,int), but with casting. Except for strings.

## `isinstancelist`

```python
def isinstancelist(obj)
```

Like isinstance(obj, list), but with casting. Except for strings and dicts.
