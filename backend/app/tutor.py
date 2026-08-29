"""
Orchestrates the AI tutor: takes an already-simulated circuit, runs
deterministic checks, and asks the LLM provider to generate a structured
pedagogical response. Falls back to deterministic analysis when no LLM is
configured or the request fails.
"""

from __future__ import annotations

import math

from qiskit.quantum_info import Statevector

from .gate_registry import GATES
from .llm_provider import LLMNotConfiguredError, LLMProviderError, TutorLLMProvider
from .models import QuantumCircuitModel
from .tutor_checks import analyze_circuit
from .tutor_models import (
    TutorAnalyzeResponse,
    TutorGateDefinition,
    TutorStep,
    TutorWarning,
)

GATE_DEFINITIONS: dict[str, dict] = {
    "h": {
        "gate": "Hadamard (H)",
        "definition": "Creates an equal superposition by mapping |0⟩ to (|0⟩+|1⟩)/√2 and |1⟩ to (|0⟩−|1⟩)/√2. It is its own inverse.",
        "matrix": "[[1/√2, 1/√2], [1/√2, −1/√2]]",
    },
    "x": {
        "gate": "Pauli-X (NOT)",
        "definition": "Flips the qubit state: maps |0⟩ to |1⟩ and |1⟩ to |0⟩. Equivalent to a classical NOT gate.",
        "matrix": "[[0, 1], [1, 0]]",
    },
    "y": {
        "gate": "Pauli-Y",
        "definition": "Rotates the qubit by π around the Y-axis of the Bloch sphere, mapping |0⟩ to i|1⟩ and |1⟩ to −i|0⟩.",
        "matrix": "[[0, −i], [i, 0]]",
    },
    "z": {
        "gate": "Pauli-Z",
        "definition": "Applies a phase flip: leaves |0⟩ unchanged and maps |1⟩ to −|1⟩. Changes the relative phase without affecting measurement probabilities in the computational basis.",
        "matrix": "[[1, 0], [0, −1]]",
    },
    "s": {
        "gate": "S (Phase)",
        "definition": "Applies a π/2 phase shift to |1⟩. It is the square root of Z: applying S twice equals Z.",
        "matrix": "[[1, 0], [0, i]]",
    },
    "t": {
        "gate": "T (π/8)",
        "definition": "Applies a π/4 phase shift to |1⟩. It is the square root of S: applying T twice equals S.",
        "matrix": "[[1, 0], [0, e^(iπ/4)]]",
    },
    "rx": {
        "gate": "RX (X-rotation)",
        "definition": "Rotates the qubit by angle θ around the X-axis of the Bloch sphere. RX(π) = X, RX(π/2) creates superposition with a phase.",
    },
    "ry": {
        "gate": "RY (Y-rotation)",
        "definition": "Rotates the qubit by angle θ around the Y-axis of the Bloch sphere. RY(π) = Y (up to phase), RY(π/2) creates real-valued superposition.",
    },
    "rz": {
        "gate": "RZ (Z-rotation)",
        "definition": "Rotates the qubit by angle θ around the Z-axis of the Bloch sphere. Only changes the relative phase, never the measurement probabilities.",
    },
    "cx": {
        "gate": "CNOT (CX)",
        "definition": "A two-qubit gate: flips the target qubit if and only if the control qubit is |1⟩. When the control is in superposition, it creates entanglement.",
    },
    "cz": {
        "gate": "Controlled-Z (CZ)",
        "definition": "A two-qubit gate: applies a Z (phase flip) to the target qubit if and only if the control qubit is |1⟩. Symmetric — swapping control and target gives the same result.",
    },
    "swap": {
        "gate": "SWAP",
        "definition": "Exchanges the quantum states of two qubits. If q0=|ψ⟩ and q1=|φ⟩, after SWAP: q0=|φ⟩ and q1=|ψ⟩.",
    },
    "measure": {
        "gate": "Measurement",
        "definition": "Collapses the qubit into |0⟩ or |1⟩ with probabilities determined by the statevector amplitudes. This is irreversible — it destroys superposition.",
    },
}

ALGORITHM_PATTERNS: list[dict] = [
    {
        "name": "Bell State Preparation",
        "description": "Creates a maximally entangled pair (|00⟩+|11⟩)/√2 using H then CNOT.",
        "match": lambda ops, n: n == 2 and _has_sequence(ops, ["h", "cx"]),
    },
    {
        "name": "GHZ State",
        "description": "Generalizes the Bell state to 3+ qubits: (|00…0⟩+|11…1⟩)/√2 using H followed by a chain of CNOTs.",
        "match": lambda ops, n: n >= 3 and _has_sequence(ops, ["h"] + ["cx"] * (n - 1)),
    },
    {
        "name": "Uniform Superposition",
        "description": "Puts all qubits into equal superposition using H gates, creating 2^n equally likely outcomes.",
        "match": lambda ops, n: n >= 1 and all(op.gate == "h" for op in ops if op.gate != "measure") and sum(1 for op in ops if op.gate == "h") == n,
    },
]


def _has_sequence(ops: list, gate_ids: list[str]) -> bool:
    non_measure = [op.gate for op in ops if op.gate != "measure"]
    if len(non_measure) != len(gate_ids):
        return False
    return all(a == b for a, b in zip(non_measure, gate_ids))


def _detect_algorithm(circuit: QuantumCircuitModel) -> str:
    ordered = sorted(circuit.operations, key=lambda op: (op.timeStep, op.id))
    for pattern in ALGORITHM_PATTERNS:
        if pattern["match"](ordered, circuit.qubits):
            return f"{pattern['name']} — {pattern['description']}"
    return "Custom circuit — no standard algorithm detected."


_AN_GATE_IDS = frozenset({"h", "x", "s", "rx", "ry", "rz"})


def _step_effect(gate_id: str, targets: list[int], controls: list[int],
                 index: int, total: int, next_gate: str | None) -> str:
    t0 = targets[0]

    if gate_id == "h":
        if next_gate in ("cx", "cz"):
            return f"This puts q{t0} into superposition, preparing it for entanglement in the next step."
        if next_gate == "measure":
            return f"This creates a 50/50 superposition — the following measurement will give a random outcome."
        return f"This puts q{t0} into an equal superposition of |0⟩ and |1⟩."

    if gate_id == "x":
        if index < total // 2:
            return f"This initializes q{t0} to the |1⟩ state."
        return f"This flips q{t0}, toggling between |0⟩ and |1⟩."

    if gate_id == "y":
        return f"This rotates q{t0} around the Y-axis, flipping it with a phase change."

    if gate_id == "z":
        return f"This applies a phase flip on q{t0} — the |1⟩ component gets a sign change."

    if gate_id == "s":
        return f"This adds a π/2 phase shift to q{t0}."

    if gate_id == "t":
        return f"This adds a π/4 phase shift to q{t0}."

    if gate_id in ("rx", "ry", "rz"):
        axis = gate_id[1].upper()
        return f"This rotates q{t0} around the {axis}-axis by the given angle."

    if gate_id == "cx" and controls:
        return (
            f"This flips q{t0} when q{controls[0]} is |1⟩. "
            f"If q{controls[0]} is in superposition, this entangles the two qubits."
        )

    if gate_id == "cz" and controls:
        return f"This applies a phase flip to q{t0} when q{controls[0]} is |1⟩, creating phase-based entanglement."

    if gate_id == "swap" and len(targets) >= 2:
        return f"This exchanges the quantum states of q{targets[0]} and q{targets[1]}."

    if gate_id == "measure":
        return f"This collapses q{t0} to either |0⟩ or |1⟩ and records the classical result."

    return f"This applies the {gate_id.upper()} operation to the target qubit(s)."


def _build_step_instruction(op, name: str, controls: list[int], targets: list[int],
                            index: int, total: int, next_gate: str | None) -> str:
    article = "an" if op.gate in _AN_GATE_IDS else "a"

    if index == 0:
        prefix = "Start by placing"
    elif op.gate == "measure":
        prefix = "Finally, add"
    else:
        prefix = "Next, place"

    if controls:
        where = f"with control on q{controls[0]} and target on q{targets[0]}"
    elif op.gate == "swap" and len(targets) >= 2:
        where = f"between q{targets[0]} and q{targets[1]}"
    elif len(targets) >= 2:
        where = f"on q{targets[0]} and q{targets[1]}"
    else:
        where = f"on q{targets[0]}"

    placement = f"{prefix} {article} {name} gate {where}."
    effect = _step_effect(op.gate, targets, controls, index, total, next_gate)
    return f"{placement} {effect}"


def _build_deterministic_steps(circuit: QuantumCircuitModel) -> list[TutorStep]:
    ordered = sorted(circuit.operations, key=lambda op: (op.timeStep, op.id))
    steps = []
    total = len(ordered)
    for i, op in enumerate(ordered):
        gate = GATES.get(op.gate)
        name = gate.qiskit_name.upper() if gate else op.gate.upper()
        if op.parameters:
            angle = op.parameters[0]
            if abs(angle - math.pi) < 0.01:
                name += "(π)"
            elif abs(angle - math.pi / 2) < 0.01:
                name += "(π/2)"
            elif abs(angle - math.pi / 4) < 0.01:
                name += "(π/4)"
            else:
                name += f"({angle:.3f})"

        controls = op.controls or []
        targets = op.targets
        if controls:
            qubits_str = f"q{controls[0]} → q{targets[0]}"
        elif len(targets) == 2:
            qubits_str = f"q{targets[0]} ↔ q{targets[1]}"
        else:
            qubits_str = f"q{targets[0]}"

        next_gate = ordered[i + 1].gate if i + 1 < total else None
        action = _build_step_instruction(op, name, controls, targets, i, total, next_gate)

        steps.append(TutorStep(
            step=i + 1,
            gate=name,
            qubits=qubits_str,
            action=action,
            stateAfter="(see simulation results)",
            opId=op.id,
        ))
    return steps


def _build_gate_definitions(circuit: QuantumCircuitModel) -> list[TutorGateDefinition]:
    seen = set()
    defs = []
    for op in circuit.operations:
        if op.gate not in seen and op.gate in GATE_DEFINITIONS:
            seen.add(op.gate)
            info = GATE_DEFINITIONS[op.gate]
            defs.append(TutorGateDefinition(
                gate=info["gate"],
                definition=info["definition"],
                matrix=info.get("matrix"),
            ))
    return defs


def _circuit_summary(circuit: QuantumCircuitModel) -> str:
    if not circuit.operations:
        return f"{circuit.qubits} qubit(s), {circuit.classicalBits} classical bit(s), no gates placed yet."

    ordered = sorted(circuit.operations, key=lambda op: (op.timeStep, op.id))
    lines = [f"{circuit.qubits} qubit(s), {circuit.classicalBits} classical bit(s). Gates in time order:"]
    for op in ordered:
        gate = GATES.get(op.gate)
        name = gate.qiskit_name.upper() if gate else op.gate.upper()
        controls = f", controls=q{op.controls}" if op.controls else ""
        params = ""
        if op.parameters:
            readable = []
            for p in op.parameters:
                if abs(p - math.pi) < 0.01:
                    readable.append("π")
                elif abs(p - math.pi / 2) < 0.01:
                    readable.append("π/2")
                elif abs(p - math.pi / 4) < 0.01:
                    readable.append("π/4")
                elif abs(p + math.pi) < 0.01:
                    readable.append("-π")
                else:
                    readable.append(f"{p:.4f}")
            params = f", params=[{', '.join(readable)}]"
        lines.append(f"  step {op.timeStep}: {name}(targets=q{op.targets}{controls}{params})")
    return "\n".join(lines)


def _simulation_summary(sv: Statevector, bloch: list[dict], num_qubits: int) -> str:
    probs = sv.probabilities_dict()
    top = sorted(probs.items(), key=lambda kv: -kv[1])[:8]
    prob_line = ", ".join(f"|{bits}⟩: {p * 100:.1f}%" for bits, p in top) if top else "(no measurable outcomes)"

    sv_data = sv.data
    amp_lines = []
    for i, amp in enumerate(sv_data):
        mag = abs(amp)
        if mag > 1e-6:
            bits = format(i, f"0{num_qubits}b")
            phase = math.degrees(math.atan2(amp.imag, amp.real))
            amp_lines.append(f"  |{bits}⟩: amplitude={amp.real:.4f}{amp.imag:+.4f}i, prob={mag**2*100:.1f}%, phase={phase:.1f}°")

    bloch_lines = []
    for b in bloch:
        if b["pure"]:
            theta_pi = b["theta"] / math.pi if b["theta"] else 0
            phi_pi = b["phi"] / math.pi if b["phi"] else 0
            bloch_lines.append(
                f"q{b['qubit']}: θ={theta_pi:.3f}π rad, φ={phi_pi:.3f}π rad (pure state, on Bloch sphere surface)"
            )
        else:
            bloch_lines.append(
                f"q{b['qubit']}: mixed/entangled state (Bloch vector length r={b['r']:.3f}, inside the sphere)"
            )

    parts = [f"Measurement probabilities: {prob_line}"]
    if amp_lines:
        parts.append("Statevector amplitudes:\n" + "\n".join(amp_lines))
    parts.append("Bloch sphere states: " + "; ".join(bloch_lines))

    return "\n".join(parts)


def _fallback_optimization(issues: list[str], circuit: QuantumCircuitModel) -> str:
    if issues:
        return issues[0]
    if not circuit.operations:
        return "Add gates to build a circuit."
    has_measure = any(op.gate == "measure" for op in circuit.operations)
    if not has_measure:
        return "Add measurement gates to see classical output from this circuit."
    return "Circuit looks good — no obvious optimizations detected."


def _statevector_to_dirac(sv: Statevector, num_qubits: int) -> str:
    terms = []
    for i, amp in enumerate(sv.data):
        mag = abs(amp)
        if mag < 1e-6:
            continue
        bits = format(i, f"0{num_qubits}b")
        if abs(mag - 1.0) < 1e-6:
            if abs(amp.real - 1.0) < 1e-6:
                terms.append(f"|{bits}⟩")
            elif abs(amp.real + 1.0) < 1e-6:
                terms.append(f"-|{bits}⟩")
            elif abs(amp.imag - 1.0) < 1e-6:
                terms.append(f"i|{bits}⟩")
            elif abs(amp.imag + 1.0) < 1e-6:
                terms.append(f"-i|{bits}⟩")
            else:
                phase = math.atan2(amp.imag, amp.real)
                terms.append(f"e^(i{phase:.2f})|{bits}⟩")
        else:
            if abs(mag - 1 / math.sqrt(2)) < 1e-4:
                coeff = ""
            else:
                coeff = f"{mag:.3f}·"
            if amp.real > 1e-6 and abs(amp.imag) < 1e-6:
                terms.append(f"{coeff}|{bits}⟩")
            elif amp.real < -1e-6 and abs(amp.imag) < 1e-6:
                terms.append(f"-{coeff}|{bits}⟩")
            elif abs(amp.real) < 1e-6 and amp.imag > 1e-6:
                terms.append(f"i·{coeff}|{bits}⟩")
            elif abs(amp.real) < 1e-6 and amp.imag < -1e-6:
                terms.append(f"-i·{coeff}|{bits}⟩")
            else:
                terms.append(f"({amp.real:.3f}{amp.imag:+.3f}i)|{bits}⟩")

    if not terms:
        return "|" + "0" * num_qubits + "⟩"

    result = terms[0]
    for t in terms[1:]:
        if t.startswith("-"):
            result += f" - {t[1:]}"
        else:
            result += f" + {t}"

    non_zero = sum(1 for amp in sv.data if abs(amp) > 1e-6)
    if non_zero > 1 and all(
        abs(abs(amp) - 1 / math.sqrt(non_zero)) < 1e-4
        for amp in sv.data if abs(amp) > 1e-6
    ):
        result = f"({result})/√{non_zero}"
    return result


def _build_deterministic_explanation(
    circuit: QuantumCircuitModel,
    sv: Statevector,
    bloch: list[dict],
    algorithm: str,
) -> str:
    if not circuit.operations:
        return (
            f"This is an empty {circuit.qubits}-qubit circuit with no gates. "
            "All qubits start in the |0⟩ state. Add gates to explore quantum operations."
        )

    ordered = sorted(circuit.operations, key=lambda op: (op.timeStep, op.id))
    non_measure = [op for op in ordered if op.gate != "measure"]
    gate_names = []
    for op in non_measure:
        gate = GATES.get(op.gate)
        name = gate.qiskit_name.upper() if gate else op.gate.upper()
        if name not in gate_names:
            gate_names.append(name)
    gate_list = ", ".join(gate_names) if gate_names else "no"

    parts = []

    if not algorithm.startswith("Custom"):
        algo_name = algorithm.split("—")[0].strip() if "—" in algorithm else algorithm.split(".")[0].strip()
        parts.append(
            f"This {circuit.qubits}-qubit circuit implements {algo_name} "
            f"using {gate_list} gate{'s' if len(gate_names) != 1 else ''}."
        )
    else:
        parts.append(
            f"This {circuit.qubits}-qubit circuit uses {gate_list} "
            f"gate{'s' if len(gate_names) != 1 else ''} across "
            f"{len(ordered)} operation{'s' if len(ordered) != 1 else ''}."
        )

    state_str = _statevector_to_dirac(sv, circuit.qubits)
    parts.append(f"The final quantum state is {state_str}.")

    probs = sv.probabilities_dict()
    top = sorted(probs.items(), key=lambda kv: -kv[1])[:4]
    if top:
        outcomes = ", ".join(f"|{bits}⟩ at {p * 100:.1f}%" for bits, p in top if p > 1e-6)
        if outcomes:
            parts.append(f"The most likely measurement outcomes are: {outcomes}.")

    has_superposition = any(0.01 < abs(amp) ** 2 < 0.99 for amp in sv.data)
    has_entanglement = any(not b["pure"] for b in bloch)

    phenomena = []
    if has_superposition:
        phenomena.append("superposition (qubits exist in multiple states simultaneously)")
    if has_entanglement:
        entangled_qubits = [f"q{b['qubit']}" for b in bloch if not b["pure"]]
        phenomena.append(
            f"entanglement ({', '.join(entangled_qubits)} "
            f"{'are' if len(entangled_qubits) > 1 else 'is'} entangled — "
            "measuring one instantly determines the other)"
        )
    if phenomena:
        parts.append(f"Key quantum phenomena: {'; '.join(phenomena)}.")

    return " ".join(parts)


def build_tutor_response(
    circuit: QuantumCircuitModel,
    sv: Statevector,
    bloch: list[dict],
    provider: TutorLLMProvider,
) -> TutorAnalyzeResponse:
    issues = analyze_circuit(circuit)
    circuit_summary = _circuit_summary(circuit)
    simulation_summary = _simulation_summary(sv, bloch, circuit.qubits)

    det_steps = _build_deterministic_steps(circuit)
    det_gate_defs = _build_gate_definitions(circuit)
    det_algorithm = _detect_algorithm(circuit)

    llm_output = None
    if provider.is_configured():
        try:
            llm_output = provider.generate(
                circuit_summary=circuit_summary,
                simulation_summary=simulation_summary,
                detected_issues=issues,
            )
        except (LLMNotConfiguredError, LLMProviderError):
            llm_output = None

    if llm_output is None:
        return TutorAnalyzeResponse(
            explanation=_build_deterministic_explanation(circuit, sv, bloch, det_algorithm),
            steps=det_steps,
            gateDefinitions=det_gate_defs,
            algorithm=det_algorithm,
            warning=TutorWarning(detected=bool(issues), message=" ".join(issues)),
            optimization=_fallback_optimization(issues, circuit),
            source="deterministic",
        )

    llm_steps = [
        TutorStep(**s) for s in llm_output.steps
    ] if llm_output.steps else det_steps

    llm_gate_defs = [
        TutorGateDefinition(**g) for g in llm_output.gate_definitions
    ] if llm_output.gate_definitions else det_gate_defs

    detected = bool(issues) or llm_output.warning_detected
    return TutorAnalyzeResponse(
        explanation=llm_output.explanation,
        steps=llm_steps,
        gateDefinitions=llm_gate_defs,
        algorithm=llm_output.algorithm or det_algorithm,
        warning=TutorWarning(detected=detected, message=llm_output.warning_message or " ".join(issues)),
        optimization=llm_output.optimization,
        source="llm",
    )
