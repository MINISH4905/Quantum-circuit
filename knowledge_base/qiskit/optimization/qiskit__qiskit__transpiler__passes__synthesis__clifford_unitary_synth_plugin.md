---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/synthesis/clifford_unitary_synth_plugin.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/synthesis/clifford_unitary_synth_plugin.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/synthesis/clifford_unitary_synth_plugin.py`

=================================
Clifford Unitary Synthesis Plugin
=================================

.. autosummary::
   :toctree: ../stubs/

   CliffordUnitarySynthesis

## `CliffordUnitarySynthesis`

```python
class CliffordUnitarySynthesis(UnitarySynthesisPlugin)
```

A Clifford unitary synthesis plugin.

The plugin is invoked by the :class:`.UnitarySynthesis` transpiler pass
when the parameter ``method`` is set to ``"clifford"``.

The plugin checks if the given unitary can be represented by a Clifford,
in which case it returns a circuit implementing this unitary and
consisting only of Clifford gates.

In addition, the parameter ``plugin_config`` of :class:`.UnitarySynthesis`
can be used to pass the following plugin-specific parameters:

* min_qubits: the minimum number of qubits to consider (the default value is 1).

* max_qubits: the maximum number of qubits to consider (the default value is 3).

### `run`

```python
def run(self, unitary, **options)
```

Run the CliffordUnitarySynthesis plugin on the given unitary.
