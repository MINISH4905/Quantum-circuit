---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/utils/minimum_point.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/utils/minimum_point.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/utils/minimum_point.py`

Check if the DAG has reached a relative semi-stable point over previous runs.

## `MinimumPoint`

```python
class MinimumPoint(TransformationPass)
```

Check if the DAG has reached a relative semi-stable point over previous runs

This pass is similar to the :class:`~.FixedPoint` transpiler pass and is intended
primarily to be used to set a loop break condition in the property set.
However, unlike the :class:`~.FixedPoint` class which only sets the
condition if 2 consecutive runs have the same value property set value
this pass is designed to find a local minimum and use that instead. This
pass is designed for an optimization loop where a fixed point may never
get reached (for example if synthesis is used and there are multiple
equivalent outputs for some cases).

This pass will track the state of fields in the property set over its past
executions and set a boolean field when either a fixed point is reached
over the backtracking depth or selecting the minimum value found if the
backtracking depth is reached. To do this it stores a deep copy of the
current minimum DAG in the property set and when ``backtrack_depth`` number
of executions is reached since the last minimum the output dag is set to
that copy of the earlier minimum.

Fields used by this pass in the property set are (all relative to the ``prefix``
argument):

* ``{prefix}_minimum_point_state`` - Used to track the state of the minimum point search
* ``{prefix}_minimum_point`` - This value gets set to ``True`` when either a fixed point
    is reached over the ``backtrack_depth`` executions, or ``backtrack_depth`` was exceeded
    and an earlier minimum is restored.

### `__init__`

```python
def __init__(self, property_set_list, prefix, backtrack_depth=5)
```

Initialize an instance of this pass

Args:
    property_set_list (list): A list of property set keys that will
        be used to evaluate the local minimum. The values of these
        property set keys will be used as a tuple for comparison
    prefix (str): The prefix to use for the property set key that is used
        for tracking previous evaluations
    backtrack_depth (int): The maximum number of entries to store. If
        this number is reached and the next iteration doesn't have
        a decrease in the number of values the minimum of the previous
        n will be set as the output dag and ``minimum_point`` will be set to
        ``True`` in the property set

### `run`

```python
def run(self, dag)
```

Run the MinimumPoint pass on `dag`.
