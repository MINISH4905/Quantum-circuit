# Ingestion summary

Generated 2026-08-30T06:52:41.365725+00:00

## File counts

| Framework | concept | api | error | optimization | total |
|---|---:|---:|---:|---:|---:|
| qiskit | 58 | 534 | 39 | 334 | 965 |
| cirq | 88 | 366 | 19 | 77 | 550 |
| pennylane | 375 | 602 | 37 | 59 | 1073 |

**Total files collected: 2588**

## Pinned sources

| Repo | Ref | Kind | Commit | License |
|---|---|---|---|---|
| `qiskit/documentation` | `1a3b8eb3e102668f9612ac64c80f384b28683681` | commit | `1a3b8eb3e102` | CC-BY-SA-4.0 |
| `Qiskit/qiskit` | `2.5.2` | tag | `c1c01ada399a` | Apache-2.0 |
| `quantumlib/Cirq` | `v1.7.0` | tag | `de651a7886d1` | Apache-2.0 |
| `PennyLaneAI/pennylane` | `v0.45.1` | tag | `5f61ce25df3c` | Apache-2.0 |
| `PennyLaneAI/qml` | `cf4629f869bf4dbc8ce0f9a5a3256eda138c7bbb` | commit | `cf4629f869bf` | Apache-2.0 |

## Skipped and failed files

None — every candidate file was collected.

## How Python modules are classified

Each Python module gets a **primary** `doc_type`, by this precedence:

1. **error** — the module is named for exceptions (`exceptions.py`,
   `errors.py`), or every public class derives from an exception *and*
   the module exposes no public functions. The function check matters:
   `cirq/linalg/transformations.py` defines ~30 public functions and one
   `EntangledStateError`, and a classes-only rule mislabelled the whole
   module as `error`.
2. **optimization** — the path sits under a transpiler-pass, transformer
   or optimizer module.
3. **api** — everything else.

### Companion error files

Exception and validation docstrings frequently live inside ordinary API
modules rather than a dedicated `exceptions.py`. Restricting `error/` to
exception-only modules left it nearly empty — Cirq defines just three
exception classes in `cirq-core` and documents only one of them.

So a module whose primary type is not `error` **also** emits a companion
file into `error/` containing just its exception classes and `validate_*`
callables. Nothing is merged: each output file still derives from exactly
one source file, so the one-output-per-source rule holds. This is why the
same filename can appear in both `api/` and `error/`.

Modules that produced a companion `error/` file:

77 file(s). Listed per framework:

<details><summary>qiskit (26)</summary>

- `Qiskit/qiskit:qiskit/circuit/annotated_operation.py`
- `Qiskit/qiskit:qiskit/circuit/controlflow/_builder_utils.py`
- `Qiskit/qiskit:qiskit/circuit/delay.py`
- `Qiskit/qiskit:qiskit/circuit/gate.py`
- `Qiskit/qiskit:qiskit/circuit/instruction.py`
- `Qiskit/qiskit:qiskit/circuit/library/data_preparation/state_preparation.py`
- `Qiskit/qiskit:qiskit/circuit/library/generalized_gates/diagonal.py`
- `Qiskit/qiskit:qiskit/circuit/library/generalized_gates/isometry.py`
- `Qiskit/qiskit:qiskit/circuit/library/generalized_gates/linear_function.py`
- `Qiskit/qiskit:qiskit/circuit/library/generalized_gates/mcg_up_to_diagonal.py`
- `Qiskit/qiskit:qiskit/circuit/library/generalized_gates/permutation.py`
- `Qiskit/qiskit:qiskit/circuit/library/generalized_gates/uc.py`
- `Qiskit/qiskit:qiskit/circuit/library/generalized_gates/unitary.py`
- `Qiskit/qiskit:qiskit/circuit/library/graph_state.py`
- `Qiskit/qiskit:qiskit/circuit/library/hamiltonian_gate.py`
- `Qiskit/qiskit:qiskit/circuit/library/pauli_evolution.py`
- `Qiskit/qiskit:qiskit/primitives/base/validation_v1.py`
- `Qiskit/qiskit:qiskit/primitives/containers/bindings_array.py`
- `Qiskit/qiskit:qiskit/primitives/containers/estimator_pub.py`
- `Qiskit/qiskit:qiskit/primitives/containers/observables_array.py`
- `Qiskit/qiskit:qiskit/primitives/containers/sampler_pub.py`
- `Qiskit/qiskit:qiskit/providers/basic_provider/basic_simulator.py`
- `Qiskit/qiskit:qiskit/quantum_info/operators/op_shape.py`
- `Qiskit/qiskit:qiskit/transpiler/passes/layout/full_ancilla_allocation.py`
- `Qiskit/qiskit:qiskit/transpiler/passes/scheduling/padding/context_aware_dynamical_decoupling.py`
- `Qiskit/qiskit:qiskit/visualization/circuit/text.py`

</details>

<details><summary>cirq (19)</summary>

- `quantumlib/Cirq:cirq-core/cirq/contrib/paulistring/pauli_string_measurement_with_readout_mitigation.py`
- `quantumlib/Cirq:cirq-core/cirq/contrib/shuffle_circuits/shuffle_circuits_with_readout_benchmarking.py`
- `quantumlib/Cirq:cirq-core/cirq/devices/device.py`
- `quantumlib/Cirq:cirq-core/cirq/devices/noise_model.py`
- `quantumlib/Cirq:cirq-core/cirq/devices/thermal_noise_model.py`
- `quantumlib/Cirq:cirq-core/cirq/linalg/transformations.py`
- `quantumlib/Cirq:cirq-core/cirq/ops/control_values.py`
- `quantumlib/Cirq:cirq-core/cirq/ops/gateset.py`
- `quantumlib/Cirq:cirq-core/cirq/ops/pauli_string.py`
- `quantumlib/Cirq:cirq-core/cirq/ops/raw_types.py`
- `quantumlib/Cirq:cirq-core/cirq/protocols/apply_mixture_protocol.py`
- `quantumlib/Cirq:cirq-core/cirq/protocols/mixture_protocol.py`
- `quantumlib/Cirq:cirq-core/cirq/qis/clifford_tableau.py`
- `quantumlib/Cirq:cirq-core/cirq/qis/states.py`
- `quantumlib/Cirq:cirq-core/cirq/sim/density_matrix_utils.py`
- `quantumlib/Cirq:cirq-core/cirq/transformers/analytical_decompositions/pauli_string_decomposition.py`
- `quantumlib/Cirq:cirq-core/cirq/transformers/dynamical_decoupling.py`
- `quantumlib/Cirq:cirq-core/cirq/transformers/target_gatesets/compilation_target_gateset.py`
- `quantumlib/Cirq:cirq-core/cirq/value/probability.py`

</details>

<details><summary>pennylane (32)</summary>

- `PennyLaneAI/pennylane:pennylane/control_flow/_loop_abstract_axes.py`
- `PennyLaneAI/pennylane:pennylane/data/attributes/operator/_wires.py`
- `PennyLaneAI/pennylane:pennylane/data/base/mapper.py`
- `PennyLaneAI/pennylane:pennylane/data/data_manager/__init__.py`
- `PennyLaneAI/pennylane:pennylane/data/data_manager/graphql.py`
- `PennyLaneAI/pennylane:pennylane/decomposition/resources.py`
- `PennyLaneAI/pennylane:pennylane/devices/capabilities.py`
- `PennyLaneAI/pennylane:pennylane/devices/default_clifford.py`
- `PennyLaneAI/pennylane:pennylane/devices/execution_config.py`
- `PennyLaneAI/pennylane:pennylane/devices/legacy_facade.py`
- `PennyLaneAI/pennylane:pennylane/devices/preprocess.py`
- `PennyLaneAI/pennylane:pennylane/estimator/compact_hamiltonian.py`
- `PennyLaneAI/pennylane:pennylane/fourier/visualize.py`
- `PennyLaneAI/pennylane:pennylane/ftqc/conditional_measure.py`
- `PennyLaneAI/pennylane:pennylane/gradients/gradient_transform.py`
- `PennyLaneAI/pennylane:pennylane/io/qasm_interpreter.py`
- `PennyLaneAI/pennylane:pennylane/labs/dla/variational_kak.py`
- `PennyLaneAI/pennylane:pennylane/labs/trotter_error/fragments/vibrational_fragments.py`
- `PennyLaneAI/pennylane:pennylane/labs/trotter_error/fragments/vibronic_fragments.py`
- `PennyLaneAI/pennylane:pennylane/labs/trotter_error/realspace/realspace_coefficients.py`
- `PennyLaneAI/pennylane:pennylane/noise/add_noise.py`
- `PennyLaneAI/pennylane:pennylane/ops/op_math/condition.py`
- `PennyLaneAI/pennylane:pennylane/ops/qubit/observables.py`
- `PennyLaneAI/pennylane:pennylane/ops/qutrit/parametric_ops.py`
- `PennyLaneAI/pennylane:pennylane/optimize/rotosolve.py`
- `PennyLaneAI/pennylane:pennylane/pauli/conversion.py`
- `PennyLaneAI/pennylane:pennylane/qcut/cutstrategy.py`
- `PennyLaneAI/pennylane:pennylane/tape/tape.py`
- `PennyLaneAI/pennylane:pennylane/templates/state_preparations/state_prep_mps.py`
- `PennyLaneAI/pennylane:pennylane/templates/subroutines/time_evolution/trotter.py`
- `PennyLaneAI/pennylane:pennylane/workflow/construct_batch.py`
- `PennyLaneAI/pennylane:pennylane/workflow/resolution.py`

</details>

