---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passes/synthesis/unitary_synthesis.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passes/synthesis/unitary_synthesis.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passes/synthesis/unitary_synthesis.py`

Unitary Synthesis Transpiler Pass

## `UnitarySynthesis`

```python
class UnitarySynthesis(TransformationPass)
```

Synthesize gates according to their basis gates.

### `__init__`

```python
def __init__(self, basis_gates: list[str] | None=None, approximation_degree: float | None=1.0, coupling_map: CouplingMap | None=None, pulse_optimize: bool | None=None, natural_direction: bool | None=None, synth_gates: list[str] | None=None, method: str='default', min_qubits: int=0, plugin_config: dict | None=None, target: Target | None=None, fallback_on_default: bool=False)
```

Synthesize unitaries over some basis gates.

This pass can approximate unitaries given some
gate fidelities (via ``target``).
More approximation can be forced by setting a heuristic dial
``approximation_degree``.

This pass is multithreaded when the default synthesis plugin is used
and will potentially launch a thread pool with threads equal to the
number of CPUs by default. You can tune the number of threads with
the ``RAYON_NUM_THREADS`` environment variable. For example, setting
``RAYON_NUM_THREADS=4`` would limit the thread pool to 4 threads.

Args:
    basis_gates: List of gate names to target. If this is
        not specified the ``target`` argument must be used. If both this
        and the ``target`` are specified the value of ``target`` will
        be used and this will be ignored.
    approximation_degree: Heuristic dial used for circuit approximation
        (1.0=no approximation, 0.0=maximal approximation). Approximation can
        make the synthesized circuit cheaper at the cost of straying from
        the original unitary. If ``None``, approximation is done based on gate fidelities.
    coupling_map: The coupling map of the target
        in case synthesis is done on a physical circuit. The
        directionality of the coupling_map will be taken into
        account if ``pulse_optimize`` is ``True``/``None`` and ``natural_direction``
        is ``True``/``None``.
    pulse_optimize: Whether to optimize pulses during
        synthesis. A value of ``None`` will attempt it but fall
        back if it does not succeed. A value of ``True`` will raise
        an error if pulse-optimized synthesis does not succeed.
    natural_direction: Whether to apply synthesis considering
        directionality of 2-qubit gates. Only applies when
        ``pulse_optimize`` is ``True`` or ``None``. The natural direction is
        determined by first checking to see whether the
        coupling map is unidirectional.  If there is no
        coupling map or the coupling map is bidirectional,
        the gate direction with the shorter
        duration from the target properties will be used. If
        set to True, and a natural direction can not be
        determined, raises :class:`.TranspilerError`. If set to None, no
        exception will be raised if a natural direction can
        not be determined.
    synth_gates: List of gates to synthesize. If None and
        ``pulse_optimize`` is False or None, default to
        ``['unitary']``. If ``None`` and ``pulse_optimize == True``,
        default to ``['unitary', 'swap']``
    method: The unitary synthesis method plugin to use.
    min_qubits: The minimum number of qubits in the unitary to synthesize. If this is set
        and the unitary is less than the specified number of qubits it will not be
        synthesized.
    plugin_config: Optional extra configuration arguments (as a ``dict``)
        which are passed directly to the specified unitary synthesis
        plugin. By default, this will have no effect as the default
        plugin has no extra arguments. Refer to the documentation of
        your unitary synthesis plugin on how to use this.
    target: The optional :class:`~.Target` for the target device the pass
        is compiling for. If specified this will supersede the values
        set for ``basis_gates`` and ``coupling_map``.
    fallback_on_default: Specifies whether the default synthesis method should be used
        in the case that a non-default synthesis ``method`` is specified but is either
        unable to synthesize the operation or the synthesized circuit does not conform
        to the target.

Raises:
    TranspilerError: if ``method`` was specified but is not found in the
        installed plugins list. The list of installed plugins can be queried with
        :func:`~qiskit.transpiler.passes.synthesis.plugin.unitary_synthesis_plugin_names`

### `run`

```python
def run(self, dag: DAGCircuit) -> DAGCircuit
```

Run the UnitarySynthesis pass on ``dag``.

Args:
    dag: input dag.

Returns:
    Output dag with UnitaryGates synthesized to target basis.
