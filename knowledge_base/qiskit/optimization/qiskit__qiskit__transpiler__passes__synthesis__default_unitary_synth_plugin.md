---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/synthesis/default_unitary_synth_plugin.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/synthesis/default_unitary_synth_plugin.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/synthesis/default_unitary_synth_plugin.py`

================================
Default Unitary Synthesis Plugin
================================

The default unitary synthesis plugin defines the default algorithm used by
:class:`.UnitarySynthesis` transpiler pass to synthesize unitary
gates in the circuit. Its behavior depends on the number of qubits in the
target unitary and the target basis.

Continuous basis sets
---------------------

When the target basis is continuous (i.e. not Clifford+T), the plugin uses the
following decompositions:

* 1-qubit gates: Euler angle decompositions (see :class:`.OneQubitEulerDecomposer`).
* 2-qubit gates: KAK/Cartan decompositions (see :class:`.TwoQubitBasisDecomposer`,
  :class:`.TwoQubitControlledUDecomposer`, :class:`.XXDecomposer`).
* 3+ qubit gates: Quantum Shannon Decomposition, see :func:`.qs_decomposition`.

For 1- and 2-qubit gates, the plugin uses the basis error information from the target
to select the decomposition that maximizes the expected fidelity.

Clifford+T basis sets
---------------------

When the target basis is Clifford+T, the plugin uses the Solovay-Kitaev algorithm (see
:class:`.SolovayKitaevDecomposition`) to approximate 1-qubit unitaries. The
settings used to create basic approximations are ``basis_gates=["h", "t", "tdg"]``,
``depth=12`` and ``recursion_degree=5``, and were chosen empirically to balance
approximation quality with computational cost. To use Solovay-Kitaev with custom parameters,
or to avoid recomputing approximations for multiple circuits, you can invoke
:class:`.SolovayKitaevSynthesis` unitary synthesis plugin instead of this default plugin.

At present, Qiskit does not include algorithms for approximating 2+ qubit unitaries
directly in the Clifford+T basis set. Therefore, the preset pass manager first decomposes
such gates into ``["cx", "u"]`` basis, and then applies Solovay-Kitaev to the resulting
1-qubit unitary gates.

.. autosummary::
   :toctree: ../stubs/

   DefaultUnitarySynthesis

## `DefaultUnitarySynthesis`

```python
class DefaultUnitarySynthesis(plugin.UnitarySynthesisPlugin)
```

The default unitary synthesis plugin.
