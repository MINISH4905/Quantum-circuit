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


def _build_deterministic_steps(circuit: QuantumCircuitModel) -> list[TutorStep]:
    ordered = sorted(circuit.operations, key=lambda op: (op.timeStep, op.id))
    steps = []
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

        gate_info = GATE_DEFINITIONS.get(op.gate, {})
        action = gate_info.get("definition", f"Applies {name} gate.").split(".")[0] + "."

        steps.append(TutorStep(
            step=i + 1,
            gate=name,
            qubits=qubits_str,
            action=action,
            stateAfter="(see simulation results)",
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
            explanation=f"{circuit_summary}\n{simulation_summary}",
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
