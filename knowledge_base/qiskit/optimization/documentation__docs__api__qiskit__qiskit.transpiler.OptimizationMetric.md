---
framework: qiskit
api_version: 1a3b8eb3e102
doc_type: optimization
source_path: docs/api/qiskit/qiskit.transpiler.OptimizationMetric.mdx
source_url: https://github.com/Qiskit/documentation/blob/1a3b8eb3e102668f9612ac64c80f384b28683681/docs/api/qiskit/qiskit.transpiler.OptimizationMetric.mdx
license: CC-BY-SA-4.0
---

# OptimizationMetric

<Class id="qiskit.transpiler.OptimizationMetric" isDedicatedPage={true} github="https://github.com/Qiskit/qiskit/tree/stable/2.5/qiskit/transpiler/optimization_metric.py#L21-L35" signature="qiskit.transpiler.OptimizationMetric(*values)" modifiers="class">
  Bases: [`Enum`](https://docs.python.org/3/library/enum.html#enum.Enum)

  Optimization metric considered during transpilation.

  The metric [`COUNT_2Q`](#qiskit.transpiler.OptimizationMetric.COUNT_2Q "qiskit.transpiler.OptimizationMetric.COUNT_2Q") targets optimizing the two-qubit gate count of the output circuit. This is generally the preferred choice for near-term execution.

  The metric [`COUNT_T`](#qiskit.transpiler.OptimizationMetric.COUNT_T "qiskit.transpiler.OptimizationMetric.COUNT_T") targets optimizing the T-count of the output circuit when the circuit is transpiled into the Clifford+T basis set.

  ## Attributes

  ### COUNT\_2Q

  <Attribute id="qiskit.transpiler.OptimizationMetric.COUNT_2Q">
    Default value: `1`

    The transpilation is optimized towards minimizing the 2q-count.
  </Attribute>

  ### COUNT\_T

  <Attribute id="qiskit.transpiler.OptimizationMetric.COUNT_T">
    Default value: `2`

    The transpilation is optimized towards the T-count.
  </Attribute>
</Class>
