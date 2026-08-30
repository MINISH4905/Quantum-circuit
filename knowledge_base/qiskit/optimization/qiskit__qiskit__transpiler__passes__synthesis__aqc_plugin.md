---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/synthesis/aqc_plugin.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/synthesis/aqc_plugin.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/synthesis/aqc_plugin.py`

====================
AQC Synthesis Plugin
====================

.. autosummary::
   :toctree: ../stubs/

   AQCSynthesisPlugin

## `AQCSynthesisPlugin`

```python
class AQCSynthesisPlugin(UnitarySynthesisPlugin)
```

An AQC-based Qiskit unitary synthesis plugin.

This plugin is invoked by :func:`~.compiler.transpile` when the ``unitary_synthesis_method``
parameter is set to ``"aqc"``.

This plugin supports customization and additional parameters can be passed to the plugin
by passing a dictionary as the ``unitary_synthesis_plugin_config`` parameter of
the :func:`~qiskit.compiler.transpile` function.

Supported parameters in the dictionary:

network_layout (str)
    Type of network geometry, one of {``"sequ"``, ``"spin"``, ``"cart"``, ``"cyclic_spin"``,
    ``"cyclic_line"``}. Default value is ``"spin"``.

connectivity_type (str)
    type of inter-qubit connectivity, {``"full"``, ``"line"``, ``"star"``}.  Default value
    is ``"full"``.

depth (int)
    depth of the CNOT-network, i.e. the number of layers, where each layer consists of a
    single CNOT-block.

optimizer (:class:`~.Minimizer`)
    An implementation of the ``Minimizer`` protocol to be used in the optimization process.

seed (int)
    A random seed.

initial_point (:class:`~numpy.ndarray`)
    Initial values of angles/parameters to start the optimization process from.

### `max_qubits`

```python
def max_qubits(self)
```

Maximum number of supported qubits is ``14``.

### `min_qubits`

```python
def min_qubits(self)
```

Minimum number of supported qubits is ``3``.

### `supports_natural_direction`

```python
def supports_natural_direction(self)
```

The plugin does not support natural direction,
it assumes bidirectional two qubit gates.

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

The plugin does not support basis gates and by default it synthesizes a circuit using
``["rx", "ry", "rz", "cx"]`` gate basis.

### `supports_coupling_map`

```python
def supports_coupling_map(self)
```

The plugin does not support coupling maps.
