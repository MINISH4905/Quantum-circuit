---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/fixed_point.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/fixed_point.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/fixed_point.py`

Check if a property reached a fixed point.

## `FixedPoint`

```python
class FixedPoint(AnalysisPass)
```

Check if a property reached a fixed point.

A dummy analysis pass that checks if a property reached a fixed point.
The result is saved in ``property_set['<property_to_check>_fixed_point']``
as a boolean.

An optional ``getter`` callable can be provided to derive a value from the
property set instead of reading a single key directly. This is useful
when convergence should be checked on a combination of properties (e.g. a
tuple consisting of size and t-count)::

    def get_size_and_t_count(property_set):
        return (
            property_set["size"],
            property_set["count_ops"].get("t", 0) + property_set["count_ops"].get("tdg", 0)
        )

    FixedPoint("size_and_t_count", get_size_and_t_count)

### `__init__`

```python
def __init__(self, property_to_check: str, getter: Callable[[PropertySet], Any] | None=None) -> None
```

Args:
    property_to_check: The name used to key the fixed-point result in the property
        set under ``property_set['<property_to_check>_fixed_point']``.
        When ``getter`` is ``None``, this name is also used as a key to
        read the corresponding value from the property set.
    getter: Optional callable that takes the property set as input and
        returns the value to track. When ``None`` (default), the value
        ``property_set[property_to_check]`` is used for tracking purposes.

### `run`

```python
def run(self, dag: DAGCircuit) -> None
```

Run the FixedPoint pass on ``dag``.
