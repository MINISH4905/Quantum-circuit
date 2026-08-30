---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/scheduling/scheduling/set_io_latency.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/scheduling/scheduling/set_io_latency.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/scheduling/scheduling/set_io_latency.py`

Set classical IO latency information to circuit.

## `SetIOLatency`

```python
class SetIOLatency(AnalysisPass)
```

Set IOLatency information to the input circuit.

The ``clbit_write_latency`` and ``conditional_latency`` are added to
the property set of pass manager. This information can be shared among the passes
that perform scheduling on instructions acting on classical registers.

Once these latencies are added to the property set, this information
is also copied to the output circuit object as protected attributes,
so that it can be utilized outside the transpilation,
for example, the timeline visualization can use latency to accurately show
time occupation by instructions on the classical registers.

### `__init__`

```python
def __init__(self, clbit_write_latency: int=0, conditional_latency: int=0)
```

Create pass with latency information.

Args:
    clbit_write_latency: A control flow constraint. Because standard superconducting
        quantum processor implement dispersive QND readout, the actual data transfer
        to the clbit happens after the round-trip stimulus signal is buffered
        and discriminated into quantum state.
        The interval ``[t0, t0 + clbit_write_latency]`` is regarded as idle time
        for clbits associated with the measure instruction.
        This defaults to 0 dt which is identical to Qiskit Pulse scheduler.
    conditional_latency: A control flow constraint. This value represents
        a latency of reading a classical register for the conditional operation.
        The gate operation occurs after this latency. This appears as a delay
        in front of the DAGOpNode of the gate.
        This defaults to 0 dt.

### `run`

```python
def run(self, dag: DAGCircuit)
```

Add IO latency information.

Args:
    dag: Input DAG circuit.
