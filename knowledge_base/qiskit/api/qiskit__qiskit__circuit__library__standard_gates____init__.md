---
framework: qiskit
api_version: 2.5.2
doc_type: api
source_path: qiskit/circuit/library/standard_gates/__init__.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/circuit/library/standard_gates/__init__.py
license: Apache-2.0
---

## Module `qiskit/circuit/library/standard_gates/__init__.py`

Standard gates

## `get_standard_gate_name_mapping`

```python
def get_standard_gate_name_mapping()
```

Return a dictionary mapping the name of standard gates and instructions to an object for
that name.

Examples:

    .. code-block:: python

        from qiskit.circuit.library import get_standard_gate_name_mapping

        gate_name_map = get_standard_gate_name_mapping()
        cx_object = gate_name_map["cx"]

        print(cx_object)
        print(type(cx_object))

    .. code-block:: text

        Instruction(name='cx', num_qubits=2, num_clbits=0, params=[])
        _SingletonCXGate
