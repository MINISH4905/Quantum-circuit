---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/synthesis/ross_selinger_plugin.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/synthesis/ross_selinger_plugin.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/synthesis/ross_selinger_plugin.py`

==============================
Ross-Selinger Synthesis Plugin
==============================

.. autosummary::
   :toctree: ../stubs/

   RossSelingerSynthesis

## `RossSelingerSynthesis`

```python
class RossSelingerSynthesis(UnitarySynthesisPlugin)
```

A Ross-Selinger Qiskit unitary synthesis plugin.

The algorithm is described in [1]. The source code (in Rust) is available at
https://github.com/qiskit-community/rsgridsynth.

This plugin is invoked by :func:`~.compiler.transpile` when the ``unitary_synthesis_method``
parameter is set to ``"gridsynth"``.

This plugin supports customization and additional parameters can be passed to the plugin
by passing a dictionary as the ``unitary_synthesis_plugin_config`` parameter of
the :func:`~qiskit.compiler.transpile` function.

Supported parameters in the dictionary:

epsilon (f64):
    The allowed approximation error.

References:

[1] Neil J. Ross, Peter Selinger, Optimal ancilla-free Clifford+T approximation of z-rotations,
    `arXiv:1403.2975 <https://arxiv.org/pdf/1403.2975>`_

### `max_qubits`

```python
def max_qubits(self)
```

Maximum number of supported qubits is ``1``.

### `min_qubits`

```python
def min_qubits(self)
```

Minimum number of supported qubits is ``1``.

### `supports_natural_direction`

```python
def supports_natural_direction(self)
```

The plugin does not support natural direction, it does not assume
bidirectional two qubit gates.

### `supports_pulse_optimize`

```python
def supports_pulse_optimize(self)
```

The plugin does not support optimization of pulses.

### `supports_gate_lengths`

```python
def supports_gate_lengths(self)
```

The plugin does not support gate lengths.

### `supports_gate_errors`

```python
def supports_gate_errors(self)
```

The plugin does not support gate errors.

### `supported_bases`

```python
def supported_bases(self)
```

The plugin does not support bases for synthesis.

### `supports_basis_gates`

```python
def supports_basis_gates(self)
```

The plugin does not support basis gates. By default it synthesizes to the
``["h", "s", "t", "x"]`` gate basis.

### `supports_coupling_map`

```python
def supports_coupling_map(self)
```

The plugin does not support coupling maps.

### `run`

```python
def run(self, unitary, **options)
```

Run the Ross-Selinger synthesis plugin on the given unitary.
