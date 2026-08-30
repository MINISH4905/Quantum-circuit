---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/controlflow/__init__.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/controlflow/__init__.py
license: Apache-2.0
---

## Module `qiskit/circuit/controlflow/__init__.py`

Instruction sub-classes for dynamic circuits.

## `get_control_flow_name_mapping`

```python
def get_control_flow_name_mapping()
```

Return a dictionary mapping the names of control-flow operations
to their corresponding classes."

Examples:

    .. code-block:: python

        from qiskit.circuit import get_control_flow_name_mapping

        ctrl_flow_name_map = get_control_flow_name_mapping()
        if_else_object = ctrl_flow_name_map["if_else"]

        print(if_else_object)

    .. code-block:: text

        <class 'qiskit.circuit.controlflow.if_else.IfElseOp'>
