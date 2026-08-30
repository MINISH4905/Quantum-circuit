---
framework: qiskit
api_version: 2.5.2
doc_type: optimization
source_path: qiskit/transpiler/preset_passmanagers/generate_preset_pass_manager.py
source_url: https://github.com/Qiskit/qiskit/blob/c1c01ada399af13e495c27b9b22b4ff942bbad7e/qiskit/transpiler/preset_passmanagers/generate_preset_pass_manager.py
license: Apache-2.0
---

## Module `qiskit/transpiler/preset_passmanagers/generate_preset_pass_manager.py`

Preset pass manager generation function

## `generate_preset_pass_manager`

```python
def generate_preset_pass_manager(optimization_level: int=2, backend: Backend | None=None, target: Target | None=None, basis_gates: list[str] | None=None, coupling_map: CouplingMap | list | None=None, initial_layout: Layout | list[int]=None, layout_method: str | None=None, routing_method: str | None=None, translation_method: str | None=None, scheduling_method: str | None=None, approximation_degree: float | None=1.0, seed_transpiler: int | None=None, unitary_synthesis_method: str='default', unitary_synthesis_plugin_config: dict | None=None, hls_config: HLSConfig | None=None, init_method: str | None=None, optimization_method: str | None=None, dt: float | None=None, qubits_initially_zero: bool=True, *, _skip_target=False)
```

Generate a preset :class:`~.PassManager`

This function is used to quickly generate a preset pass manager. Preset pass
managers are the default pass managers used by the :func:`~.transpile`
function. This function provides a convenient and simple method to construct
a standalone :class:`~.PassManager` object that mirrors what the :func:`~.transpile`
function internally builds and uses.

The target constraints for the pass manager construction can be specified through a :class:`.Target`
instance, a :class:`.BackendV2` instance, or via loose constraints
(``basis_gates``, ``coupling_map``, or ``dt``).
The order of priorities for target constraints works as follows: if a ``target``
input is provided, it will take priority over any ``backend`` input or loose constraints.
If a ``backend`` is provided together with any loose constraint
from the list above, the loose constraint will take priority over the corresponding backend
constraint. This behavior is summarized in the table below. The first column
in the table summarizes the potential user-provided constraints, and each cell shows whether
the priority is assigned to that specific constraint input or another input
(`target`/`backend(V1)`/`backend(V2)`).

============================ ========= ========================
User Provided                target    backend(V2)
============================ ========= ========================
**basis_gates**              target    basis_gates
**coupling_map**             target    coupling_map
**dt**                       target    dt
============================ ========= ========================

.. note::

    When the target basis consists of Clifford+T gates, this function constructs
    a specialized Clifford+T transpiler pipeline, see
    :func:`.generate_preset_clifford_t_pass_manager` for more detailed documentation. Arguments
    that apply only to transpiling into continuous basis sets are ignored in this flow.
    For example, the ``"unitary_synthesis_method"`` is not taken into account when synthesizing
    single-qubit unitaries into a Clifford+T sequence.

Args:
    optimization_level: The optimization level to generate a
        :class:`~.StagedPassManager` for. By default optimization level 2
        is used if this is not specified. This can be 0, 1, 2, or 3. Higher
        levels generate potentially more optimized circuits, at the expense
        of longer transpilation time:

            * 0: no optimization
            * 1: light optimization
            * 2: heavy optimization
            * 3: even heavier optimization

    backend: An optional backend object which can be used as the
        source of the default values for the ``basis_gates``,
        ``coupling_map``, and ``target``. If any of those other arguments
        are specified in addition to ``backend`` they will take precedence
        over the value contained in the backend.
    target: The :class:`~.Target` representing a backend compilation
        target. The following attributes will be inferred from this
        argument if they are not set: ``coupling_map`` and ``basis_gates``.
    basis_gates: List of basis gate names to unroll to
        (e.g: ``['u1', 'u2', 'u3', 'cx']``).
    coupling_map: Directed graph represented a coupling
        map. Multiple formats are supported:

        #. ``CouplingMap`` instance
        #. List, must be given as an adjacency matrix, where each entry
           specifies all directed two-qubit interactions supported by backend,
           e.g: ``[[0, 1], [0, 3], [1, 2], [1, 5], [2, 5], [4, 1], [5, 3]]``
    initial_layout: Initial position of virtual qubits on
        physical qubits.
    layout_method: The :class:`~.Pass` to use for choosing initial qubit
        placement. Valid choices are ``'trivial'``, ``'dense'``,
        and ``'sabre'``, representing :class:`~.TrivialLayout`, :class:`~.DenseLayout` and
        :class:`~.SabreLayout` respectively. This can also
        be the external plugin name to use for the ``layout`` stage of the output
        :class:`~.StagedPassManager`. You can see a list of installed plugins by using
        :func:`~.list_stage_plugins` with ``"layout"`` for the ``stage_name`` argument.
    routing_method: The pass to use for routing qubits on the
        architecture. Valid choices are ``'basic'``, ``'lookahead'``,
        ``'sabre'``, and ``'none'`` representing :class:`~.BasicSwap`,
        :class:`~.LookaheadSwap`, :class:`~.SabreSwap`, and
        erroring if routing is required respectively. This can also be the external plugin
        name to use for the ``routing`` stage of the output :class:`~.StagedPassManager`.
        You can see a list of installed plugins by using :func:`~.list_stage_plugins` with
        ``"routing"`` for the ``stage_name`` argument.
    translation_method: The method to use for translating gates to
        basis gates. Valid choices ``'translator'``, ``'synthesis'`` representing
        :class:`~.BasisTranslator`, and :class:`~.UnitarySynthesis` respectively. This can
        also be the external plugin name to use for the ``translation`` stage of the output
        :class:`~.StagedPassManager`. You can see a list of installed plugins by using
        :func:`~.list_stage_plugins` with ``"translation"`` for the ``stage_name`` argument.
    scheduling_method: The pass to use for scheduling instructions. Valid choices
        are ``'alap'`` and ``'asap'``. This can also be the external plugin name to use
        for the ``scheduling`` stage of the output :class:`~.StagedPassManager`. You can
        see a list of installed plugins by using :func:`~.list_stage_plugins` with
        ``"scheduling"`` for the ``stage_name`` argument.
    approximation_degree: Heuristic dial used for circuit approximation, where
        ``1.0`` means no approximation (up to numerical tolerance) and ``0.0``
        means the maximum approximation. If ``target`` is available, a value of ``None``
        indicates that approximation is allowed up to the reported error rate for an operation
        in the target.
    seed_transpiler: Sets random seed for the stochastic parts of
        the transpiler. If it is not specified here it can also be specified via an environment
        variable: ``QISKIT_TRANSPILER_SEED`` or in a user configuration file. The priority
        order is: this argument, then the environment variable, and finally the user
        configuration option. So setting this argument will take precedence over the other
        methods of setting a seed.
    unitary_synthesis_method (str): The name of the unitary synthesis
        method to use. By default ``'default'`` is used. You can see a list of
        installed plugins with :func:`.unitary_synthesis_plugin_names`.
    unitary_synthesis_plugin_config: An optional configuration dictionary
        that will be passed directly to the unitary synthesis plugin. By
        default this setting will have no effect as the default unitary
        synthesis method does not take custom configuration. This should
        only be necessary when a unitary synthesis plugin is specified with
        the ``unitary_synthesis_method`` argument. As this is custom for each
        unitary synthesis plugin refer to the plugin documentation for how
        to use this option.
    hls_config: An optional configuration class :class:`~.HLSConfig`
        that will be passed directly to :class:`~.HighLevelSynthesis` transformation pass.
        This configuration class allows to specify for various high-level objects
        the lists of synthesis algorithms and their parameters.
    init_method: The plugin name to use for the ``init`` stage of
        the output :class:`~.StagedPassManager`. By default an external
        plugin is not used. You can see a list of installed plugins by
        using :func:`~.list_stage_plugins` with ``"init"`` for the stage
        name argument.
    optimization_method: The plugin name to use for the
        ``optimization`` stage of the output
        :class:`~.StagedPassManager`. By default an external
        plugin is not used. You can see a list of installed plugins by
        using :func:`~.list_stage_plugins` with ``"optimization"`` for the
        ``stage_name`` argument.
    dt: Backend sample time (resolution) in seconds.
        If ``None`` (default) and a backend is provided, ``backend.dt`` is used.
    qubits_initially_zero: Indicates whether the input circuit is
            zero-initialized.

Returns:
    StagedPassManager: The preset pass manager for the given options

Raises:
    ValueError: if an invalid value for ``optimization_level`` is passed in.

## `generate_preset_clifford_t_pass_manager`

```python
def generate_preset_clifford_t_pass_manager(optimization_level: int=2, target: Target | None=None, basis_gates: list[str] | None=None, coupling_map: CouplingMap | list | None=None, initial_layout: Layout | list[int]=None, approximation_degree: float | None=1.0, seed_transpiler: int | None=None, unitary_synthesis_method: str='default', unitary_synthesis_plugin_config: dict | None=None, hls_config: HLSConfig | None=None, dt: float | None=None, qubits_initially_zero: bool=True, rz_synthesis_config: dict | None=None) -> StagedPassManager
```

Generate a preset Clifford+T :class:`~.StagedPassManager`.

This function provides a convenient way to construct a preset pass manager for
Clifford+T compilation. We recommend using this function instead of :func:`~.transpile` or
:func:`~.generate_preset_pass_manager` with a Clifford+T basis, as it exposes
arguments specifically tailored for Clifford+T compilations.

The target constraints for the pass manager construction can be specified through a :class:`.Target`
instance, or via loose constraints (``basis_gates``, ``coupling_map``, or ``dt``).

If basis gates are not specified (neither via ``target`` nor via ``basis_gates``), then basis gates
default to all of the Clifford+T gates in Qiskit. Note, however, that if basis gates are specified
but do not represent a Clifford+T basis, then an error will be raised.

Examples:
    Generate and use a simple Clifford+T pass manager::

        from qiskit.circuit import QuantumCircuit
        from qiskit.transpiler import generate_preset_clifford_t_pass_manager

        qc = QuantumCircuit(1)
        qc.rz(2.3579, 0)

        pm = generate_preset_clifford_t_pass_manager()
        qct = pm.run(qc)

    Various options are configurable; see the arguments documentation for more detail::

        rz_synthesis_config = {
            "rz_synthesis_error": 1e-4,
            "rz_cache_error": 1e-5,
        }

        basis_gates = ["cx", "s", "sdg", "h", "t", "tdg"]
        pm = generate_preset_clifford_t_pass_manager(
            rz_synthesis_config=rz_synthesis_config,
            basis_gates=basis_gates,
            optimization_level=3,
        )

Args:
    optimization_level: The optimization level to generate a
        :class:`~.StagedPassManager` for. By default optimization level 2
        is used if this is not specified. This can be 0, 1, 2, or 3. Higher
        levels generate potentially more optimized circuits, at the expense
        of potentially longer transpilation time.
    target: The :class:`~.Target` representing a compilation
        target. The following attributes will be inferred from this
        argument if they are not set: ``coupling_map`` and ``basis_gates``.
    basis_gates: List of basis gate names to unroll to (e.g: ``['cx', 's', 'sx', 't', 'tdg']``).
        If both ``target`` and ``basis_gates`` are ``None``, ``basis_gates`` will be set
        to all of the standard Clifford gates together with ``'t'`` and ``'tdg'``.
    coupling_map: Directed graph represented a coupling
        map. Multiple formats are supported:

        #. ``CouplingMap`` instance
        #. List, must be given as an adjacency matrix, where each entry
           specifies all directed two-qubit interactions supported by backend,
           e.g: ``[[0, 1], [0, 3], [1, 2], [1, 5], [2, 5], [4, 1], [5, 3]]``
    dt: Target sample time (resolution) in seconds.
        If ``None`` (default) and a target is provided, ``target.dt`` is used.
    initial_layout: Initial position of virtual qubits on
        physical qubits.
    approximation_degree: Heuristic dial used for circuit approximation, where
        ``1.0`` means no approximation (up to numerical tolerance) and ``0.0``
        means the maximum approximation. If ``target`` is available, a value of ``None``
        indicates that approximation is allowed up to the reported error rate for an operation
        in the target.
    seed_transpiler: Sets random seed for the stochastic parts of
        the transpiler. If it is not specified here it can also be specified via an environment
        variable: ``QISKIT_TRANSPILER_SEED`` or in a user configuration file. The priority
        order is: this argument, then the environment variable, and finally the user
        configuration option. So setting this argument will take precedence over the other
        methods of setting a seed.
    unitary_synthesis_method: The name of the unitary synthesis
        method to use. By default ``'default'`` is used. You can see a list of
        installed plugins with :func:`.unitary_synthesis_plugin_names`.
    unitary_synthesis_plugin_config: An optional configuration dictionary
        that will be passed directly to the unitary synthesis plugin. By
        default this setting will have no effect as the default unitary
        synthesis method does not take custom configuration. This should
        only be necessary when a unitary synthesis plugin is specified with
        the ``unitary_synthesis_method`` argument. As this is custom for each
        unitary synthesis plugin refer to the plugin documentation for how
        to use this option.
    hls_config: An optional configuration class :class:`~.HLSConfig`
        that will be passed directly to :class:`~.HighLevelSynthesis` transformation pass.
        This configuration class allows to specify for various high-level objects
        the lists of synthesis algorithms and their parameters.
    qubits_initially_zero: Indicates whether the input circuit is
        zero-initialized.
    rz_synthesis_config: An optional configuration class to use for
        :class:`~qiskit.transpiler.passes.SynthesizeRZRotations` pass.
        Specifies how to synthesize RZ rotations in the circuit.

Returns:
    StagedPassManager: The preset pass manager for the given options.

Raises:
    TranspilerError: if a basis other than Clifford+T is specified.
    ValueError: if an invalid value for ``optimization_level`` is passed in.
