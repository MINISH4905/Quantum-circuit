---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/optimization/two_qubit_peephole.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/optimization/two_qubit_peephole.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/optimization/two_qubit_peephole.py`

A transpiler pass to optimize 2q blocks in a circuit.

## `TwoQubitPeepholeOptimization`

```python
class TwoQubitPeepholeOptimization(TransformationPass)
```

Unified two qubit unitary peephole optimization

This transpiler pass is designed to perform two qubit unitary peephole
optimization. This pass finds all the 2 qubit blocks in the circuit,
computes the unitary of that block, and then synthesizes that unitary.
If the synthesized two qubit unitary is "better" than the original
subcircuit that subcircuit is used to replace the original. The heuristic
used to determine if it's better first looks at the two qubit gate count
in the circuit, and prefers the synthesis with fewer two qubit gates, if
the two qubit gate counts are the same then it looks at the estimated
fidelity of the circuit and picks the subcircuit with higher estimated
fidelity, and finally if needed it picks the subcircuit with the fewest
total gates.

In case the target is overcomplete the pass will try all the
decomposers supported for all the gates supported on a given qubit.
The decomposition that has the best expected performance using the above
heuristic will be selected and used to replace the block.

This pass is designed to be run on a physical circuit and the details of
operations on a given qubit is assumed to be the hardware qubit from the
target. However, the output of the pass might not use hardware operations,
specifically single qubit gates might be emitted outside the target's supported
operations, typically only if a parameterized gate supported by the
:class:`.TwoQubitControlledUDecomposer` is used for synthesis. As such if running
this pass in a physical optimization stage (such as :ref:`transpiler-preset-stage-optimization`)
this should be paired with passes such as :class:`.BasisTranslator` and/or
:class:`.Optimize1qGatesDecomposition` to ensure that these errant single qubit
gates are replaced with hardware supported operations prior to exiting the stage.

This pass is multithreaded, and will perform the analysis in parallel
and use all the cores available on your local system. You can refer to
the `configuration guide <https://docs.quantum.ibm.com/guides/configure-qiskit-local>`__
for details on how to control the threading behavior for Qiskit more broadly
which will also control this pass

This pass is similar in functionality to running :class:`.ConsolidateBlocks`
and :class:`.UnitarySynthesis` sequentially in your pass manager. However,
this pass offers improved runtime performance by performing the synthesis in
parallel. It also has improved heuristics enabled by doing the optimization in
a single step which can result in better quality output, especially in cases
of overcomplete and/or heterogeneous targets. However, these heuristics and this
pass as a whole are only valid for physical circuits. Additionally, unlike
:class:`.UnitarySynthesis` pass this does not use :ref:`unitary-synth-plugin`.
This is a tradeoff for performance and it forgoes the pluggability exposed
via that interface. Internally it currently only uses the :class:`.TwoQubitBasisDecomposer`
and :class:`.TwoQubitControlledUDecomposer` for synthesizing the two qubit unitaries.
You should not use this pass if you need to use the pluggable interface and the ability
to use different synthesis algorithms, instead you should use a combination of
:class:`.ConsolidateBlocks` and :class:`.UnitarySynthesis` to leverage the plugin
mechanism in :class:`.UnitarySynthesis`.

.. plot::
  :include-source:
  :alt: Optimized circuit

  from qiskit.circuit import QuantumCircuit
  from qiskit.transpiler.passes import TwoQubitPeepholeOptimization
  from qiskit.providers.fake_provider import GenericBackendV2

  # Build an unoptimized 2 qubit circuit
  unoptimized = QuantumCircuit(2)
  for i in range(10):
    if i % 2:
      unoptimized.cx(0, 1)
    else:
      unoptimized.cx(1, 0)
  # Generate a target with random error rates
  backend = GenericBackendV2(2, ["u", "cx"], coupling_map=[[0, 1], [1, 0]])
  # Instantiate pass
  peephole_pass = TwoQubitPeepholeOptimization(backend.target)
  # Run pass and visualize output
  optimized = peephole_pass(unoptimized)
  optimized.draw("mpl")

### `__init__`

```python
def __init__(self, target: Target, approximation_degree: float | None=1.0)
```

Initialize the pass

Args:
    target: The target to run the pass for
    approximation_degree: heuristic dial used for circuit approximation (1.0=no
        approximation, 0.0=maximal approximation). Approximation can decrease the number
        of gates used in the synthesized unitaries smaller at the cost of straying from the
        original unitary. If ``None``, approximation is done based on gate fidelities
        specified in the ``target``.
