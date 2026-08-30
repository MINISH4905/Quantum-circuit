---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/passmanager_config.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/passmanager_config.py
license: Apache-2.0
---

## Module `qiskit/transpiler/passmanager_config.py`

Pass Manager Configuration class.

## `PassManagerConfig`

```python
class PassManagerConfig
```

Pass Manager Configuration.

### `__init__`

```python
def __init__(self, initial_layout: Layout | None=None, basis_gates: list[str] | None=None, coupling_map: CouplingMap | None=None, layout_method: str | None=None, routing_method: str | None=None, translation_method: str | None=None, scheduling_method: str | None=None, instruction_durations: InstructionDurations | None=None, approximation_degree: float | None=None, seed_transpiler: int | None=None, timing_constraints: TimingConstraints | None=None, unitary_synthesis_method: str='default', unitary_synthesis_plugin_config: dict | None=None, target: Target | None=None, hls_config: HLSConfig | None=None, init_method: str | None=None, optimization_method: str | None=None, qubits_initially_zero: bool=True)
```

Initialize a PassManagerConfig object

Args:
    initial_layout: Initial position of virtual qubits on
        physical qubits.
    basis_gates: List of basis gate names to unroll to.
    coupling_map: Directed graph representing a coupling
        map.
    layout_method: the pass to use for choosing initial qubit
        placement. This will be the plugin name if an external layout stage
        plugin is being used.
    routing_method: the pass to use for routing qubits on the
        architecture. This will be a plugin name if an external routing stage
        plugin is being used.
    translation_method: the pass to use for translating gates to
        basis_gates. This will be a plugin name if an external translation stage
        plugin is being used.
    scheduling_method: the pass to use for scheduling instructions. This will
        be a plugin name if an external scheduling stage plugin is being used.
    instruction_durations: Dictionary of duration
        (in dt) for each instruction.
    approximation_degree: Heuristic dial used for circuit approximation, where
        ``1.0`` means no approximation (up to numerical tolerance) and ``0.0``
        means the maximum approximation. If ``target`` is available, a value of ``None``
        indicates that approximation is allowed up to the reported error rate for an operation
        in the target.
    seed_transpiler: Sets random seed for the stochastic parts of
        the transpiler.
    timing_constraints: Hardware time alignment restrictions.
    unitary_synthesis_method: The string method to use for the
        :class:`~qiskit.transpiler.passes.UnitarySynthesis` pass. Will
        search installed plugins for a valid method. You can see a list of
        installed plugins with :func:`.unitary_synthesis_plugin_names`.
    unitary_synthesis_plugin_config: The configuration dictionary that will
        be passed to the specified unitary synthesis plugin. Refer to
        the plugin documentation for how to use this.
    target: The backend target
    hls_config: An optional configuration class to use for
        :class:`~qiskit.transpiler.passes.HighLevelSynthesis` pass.
        Specifies how to synthesize various high-level objects.
    init_method: The plugin name for the init stage plugin to use
    optimization_method: The plugin name for the optimization stage plugin
        to use.
    qubits_initially_zero: Indicates whether the input circuit is
        zero-initialized.

### `from_backend`

```python
def from_backend(cls, backend, _skip_target=False, **pass_manager_options)
```

Construct a configuration based on a backend and user input.

This method automatically generates a PassManagerConfig object based on the backend's
features. User options can be used to overwrite the configuration.

Args:
    backend (BackendV2): The backend that provides the configuration.
    pass_manager_options: User-defined option-value pairs.

Returns:
    PassManagerConfig: The configuration generated based on the arguments.

Raises:
    AttributeError: If the backend does not support a `configuration()` method.

## `PassManagerCliffordTConfig`

```python
class PassManagerCliffordTConfig
```

Pass Manager Configuration for Clifford+T transpilation.

### `__init__`

```python
def __init__(self, initial_layout: Layout | None=None, basis_gates: list[str] | None=None, coupling_map: CouplingMap | None=None, instruction_durations: InstructionDurations | None=None, approximation_degree: float | None=None, seed_transpiler: int | None=None, timing_constraints: TimingConstraints | None=None, unitary_synthesis_method: str='default', unitary_synthesis_plugin_config: dict | None=None, target: Target | None=None, hls_config: HLSConfig | None=None, qubits_initially_zero: bool=True, rz_synthesis_config: dict | None=None, *, _routing_disabled: bool=False)
```

Args:
    initial_layout: Initial position of virtual qubits on
        physical qubits.
    basis_gates: List of basis gate names to unroll to.
    coupling_map: Directed graph representing a coupling
        map.
    instruction_durations: Dictionary of duration
        (in dt) for each instruction.
    approximation_degree: Heuristic dial used for circuit approximation, where
        ``1.0`` means no approximation (up to numerical tolerance) and ``0.0``
        means the maximum approximation. If ``target`` is available, a value of ``None``
        indicates that approximation is allowed up to the reported error rate for an operation
        in the target.
    seed_transpiler: Sets random seed for the stochastic parts of
        the transpiler.
    timing_constraints: Hardware time alignment restrictions.
    unitary_synthesis_method: The string method to use for the
        :class:`~qiskit.transpiler.passes.UnitarySynthesis` pass. Will
        search installed plugins for a valid method. You can see a list of
        installed plugins with :func:`.unitary_synthesis_plugin_names`.
    unitary_synthesis_plugin_config: The configuration dictionary that will
        be passed to the specified unitary synthesis plugin. Refer to
        the plugin documentation for how to use this.
    target: The backend target.
    hls_config: An optional configuration class to use for
        :class:`~qiskit.transpiler.passes.HighLevelSynthesis` pass.
        Specifies how to synthesize various high-level objects.
    qubits_initially_zero: Indicates whether the input circuit is
        zero-initialized.
    rz_synthesis_config: An optional configuration class to use for
        :class:`~qiskit.transpiler.passes.SynthesizeRZRotations` pass.
        Specifies how to synthesize RZ rotations in the circuit.
