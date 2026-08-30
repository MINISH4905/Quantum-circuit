---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/preset_passmanagers/common.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/preset_passmanagers/common.py
license: Apache-2.0
---

## Module `qiskit/transpiler/preset_passmanagers/common.py`

Common preset passmanager generators.

## `generate_control_flow_options_check`

```python
def generate_control_flow_options_check(layout_method=None, routing_method=None, translation_method=None, optimization_method=None, scheduling_method=None, basis_gates=(), target=None)
```

Generate a pass manager that, when run on a DAG that contains control flow, fails with an
error message explaining the invalid options, and what could be used instead.

Returns:
    PassManager: a pass manager that populates the ``contains_x`` properties for each of the
    control-flow operations, and raises an error if any of the given options do not support
    control flow, but a circuit with control flow is given.

## `generate_error_on_control_flow`

```python
def generate_error_on_control_flow(message)
```

Get a pass manager that always raises an error if control flow is present in a given
circuit.

## `if_has_control_flow_else`

```python
def if_has_control_flow_else(if_present, if_absent)
```

Generate a pass manager that will run the passes in ``if_present`` if the given circuit
has control-flow operations in it, and those in ``if_absent`` if it doesn't.

## `generate_unroll_3q`

```python
def generate_unroll_3q(target: Target | None, basis_gates: list[str] | None=None, approximation_degree: float | None=None, unitary_synthesis_method: str='default', unitary_synthesis_plugin_config: dict | None=None, hls_config: HLSConfig | None=None, qubits_initially_zero: bool=True, optimization_metric: OptimizationMetric=OptimizationMetric.COUNT_2Q)
```

Generate an unroll >3q :class:`~qiskit.transpiler.PassManager`

Args:
    target: the :class:`~.Target` object representing the backend
    basis_gates: A list of str gate names that represent the basis
        gates on the backend target.
    approximation_degree: Heuristic dial used for circuit approximation, where
        ``1.0`` means no approximation (up to numerical tolerance) and ``0.0``
        means the maximum approximation. If ``target`` is available, a value of
        ``None`` indicates that approximation is allowed up to the reported error
        rate for an operation in the target.
    unitary_synthesis_method (str): The unitary synthesis method to use. You can see
        a list of installed plugins with :func:`.unitary_synthesis_plugin_names`.
    unitary_synthesis_plugin_config: The optional dictionary plugin
        configuration, this is plugin specific refer to the specified plugin's
        documentation for how to use.
    hls_config: An optional configuration class to use for
        :class:`~qiskit.transpiler.passes.HighLevelSynthesis` pass.
        Specifies how to synthesize various high-level objects.
    qubits_initially_zero: Indicates whether the input circuit is
        zero-initialized.
    optimization_metric: the :class:`~.OptimizationMetric` object
        that defines the metric used when optimizing the unrolling.

Returns:
    PassManager: The unroll 3q or more pass manager

## `generate_embed_passmanager`

```python
def generate_embed_passmanager(coupling_map)
```

Generate a layout embedding :class:`~qiskit.transpiler.PassManager`

This is used to generate a :class:`~qiskit.transpiler.PassManager` object
that can be used to expand and apply an initial layout to a circuit

Args:
    coupling_map (Union[CouplingMap, Target]): The coupling map for the backend to embed
        the circuit to.
Returns:
    PassManager: The embedding passmanager that assumes the layout property
        set has been set in earlier stages

## `generate_routing_passmanager`

```python
def generate_routing_passmanager(routing_pass, target, coupling_map=None, vf2_call_limit=None, seed_transpiler=-1, check_trivial=False, use_barrier_before_measurement=True, vf2_max_trials=None)
```

Generate a routing :class:`~qiskit.transpiler.PassManager`

Args:
    routing_pass (TransformationPass): The pass which will perform the
        routing
    target (Target): the :class:`~.Target` object representing the backend
    coupling_map (CouplingMap): The coupling map of the backend to route
        for
    vf2_call_limit (int): The internal call limit for the vf2 post layout
        pass. If this is ``None`` or ``0`` the vf2 post layout will not be
        run.
    seed_transpiler (int): Sets random seed for the stochastic parts of
        the transpiler. This is currently only used for :class:`.VF2PostLayout` and the
        default value of ``-1`` is strongly recommended (which is no randomization).
        If a value of ``None`` is provided this will seed from system
        entropy.
    check_trivial (bool): If set to true this will condition running the
        :class:`~.VF2PostLayout` pass after routing on whether a trivial
        layout was tried and was found to not be perfect. This is only
        needed if the constructed pass manager runs :class:`~.TrivialLayout`
        as a first layout attempt and uses it if it's a perfect layout
        (as is the case with preset pass manager level 1).
    use_barrier_before_measurement (bool): If true (the default) the
        :class:`~.BarrierBeforeFinalMeasurements` transpiler pass will be run prior to the
        specified pass in the ``routing_pass`` argument.
    vf2_max_trials (int): The maximum number of trials to run VF2 when
        evaluating the vf2 post layout
        pass. If this is ``None`` or ``0`` the vf2 post layout will not be run.
Returns:
    PassManager: The routing pass manager

## `generate_pre_op_passmanager`

```python
def generate_pre_op_passmanager(target=None, coupling_map=None, remove_reset_in_zero=False)
```

Generate a pre-optimization loop :class:`~qiskit.transpiler.PassManager`

This pass manager will check to ensure that directionality from the coupling
map is respected.

Args:
    target (Target): the :class:`~.Target` object representing the backend
    coupling_map (CouplingMap): The coupling map to use
    remove_reset_in_zero (bool): If ``True`` include the remove reset in
        zero pass in the generated PassManager
Returns:
    PassManager: The pass manager

## `generate_translation_passmanager`

```python
def generate_translation_passmanager(target: Target | None, basis_gates: list[str] | None=None, method: str='translator', approximation_degree: float | None=None, coupling_map: CouplingMap | None=None, unitary_synthesis_method: str='default', unitary_synthesis_plugin_config: dict | None=None, hls_config: HLSConfig | None=None, qubits_initially_zero: bool=True)
```

Generate a basis translation :class:`~qiskit.transpiler.PassManager`

Args:
    target: the :class:`~.Target` object representing the backend
    basis_gates: A list of str gate names that represent the basis
        gates on the backend target
    method: The basis translation method to use
    approximation_degree: Heuristic dial used for circuit approximation, where
        ``1.0`` means no approximation (up to numerical tolerance) and ``0.0``
        means the maximum approximation. If ``target`` is available, a value of
        ``None`` indicates that approximation is allowed up
        to the reported error rate for an operation in the target.
    coupling_map: the coupling map of the backend
        in case synthesis is done on a physical circuit. The
        directionality of the coupling_map will be taken into
        account if pulse_optimize is True/None and natural_direction
        is True/None.
    unitary_synthesis_method: The unitary synthesis method to use. You can
        see a list of installed plugins with :func:`.unitary_synthesis_plugin_names`.
    unitary_synthesis_plugin_config: The optional dictionary plugin
        configuration, this is plugin specific refer to the specified plugin's
        documentation for how to use.
    hls_config: An optional configuration class to use for
        :class:`~qiskit.transpiler.passes.HighLevelSynthesis` pass.
        Specifies how to synthesize various high-level objects.
    qubits_initially_zero: Indicates whether the input circuit is
        zero-initialized.

Returns:
    PassManager: The basis translation pass manager

Raises:
    TranspilerError: If the ``method`` kwarg is not a valid value

## `generate_scheduling`

```python
def generate_scheduling(instruction_durations, scheduling_method, timing_constraints, target=None)
```

Generate a post optimization scheduling :class:`~qiskit.transpiler.PassManager`

Args:
    instruction_durations (dict): The dictionary of instruction durations
    scheduling_method (str): The scheduling method to use, can either be
        ``'asap'``/``'as_soon_as_possible'`` or
        ``'alap'``/``'as_late_as_possible'``
    timing_constraints (TimingConstraints): Hardware time alignment restrictions.
    target (Target): The :class:`~.Target` object representing the backend

Returns:
    PassManager: The scheduling pass manager

Raises:
    TranspilerError: If the ``scheduling_method`` kwarg is not a valid value

## `get_vf2_limits`

```python
def get_vf2_limits(optimization_level: int, layout_method: str | None=None, initial_layout: Layout | None=None, exact_match: bool=False) -> VF2Limits
```

Get the VF2 limits for VF2-based layout passes.

Returns:
    VF2Limits: A namedtuple with optional elements
    ``call_limit`` and ``max_trials``.

## `is_clifford_t_basis`

```python
def is_clifford_t_basis(basis_gates=None, target=None) -> bool
```

Checks whether the given basis set can be considered as Clifford+T.

For this we require that:
1. The set only contains Clifford+T gates,
2. The set contains either T or Tdg gate or both.

In particular, these conditions guarantee that the empty basis set
is not considered as Clifford+T.
