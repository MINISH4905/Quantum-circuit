---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/check_map.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/check_map.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/check_map.py`

Check if a DAG circuit is already mapped to a coupling map.

## `CheckMap`

```python
class CheckMap(AnalysisPass)
```

Check if a DAG circuit is already mapped to a coupling map.

Check if a DAGCircuit is mapped to ``coupling_map`` by checking that all
2-qubit interactions are laid out to be on adjacent qubits in the global coupling
map of the device, setting the property set field (either specified with ``property_set_field``
or the default ``is_swap_mapped``) to ``True`` or ``False`` accordingly. Note this does not
validate directionality of the connectivity between  qubits. If you need to check gates are
implemented in a native direction for a target use the :class:`~.CheckGateDirection` pass
instead.

### `__init__`

```python
def __init__(self, coupling_map, property_set_field=None)
```

CheckMap initializer.

Args:
    coupling_map (Union[CouplingMap, Target]): Directed graph representing a coupling map.
    property_set_field (str): An optional string to specify the property set field to
        store the result of the check. If not provided the result is stored in
        the property set field ``"is_swap_mapped"``.

### `run`

```python
def run(self, dag)
```

Run the CheckMap pass on `dag`.

If ``dag`` is mapped to the configured :class:`.Target`, the property whose name is
specified in ``self.property_set_field`` is set to ``True`` (or to ``False`` otherwise).

Args:
    dag (DAGCircuit): DAG to map.
