"""
Orchestrates the AI tutor: takes an already-simulated circuit (reusing the
exact same run_statevector/compute_bloch_angles calls /simulate uses — no
duplicate simulation), runs the deterministic checks, and asks the LLM
provider to phrase the explanation/warning/optimization. If no provider is
configured (or the request fails), degrades gracefully to a deterministic
response instead of erroring — see tutor_models.TutorAnalyzeResponse.source.
"""

from __future__ import annotations

from qiskit.quantum_info import Statevector

from .gate_registry import GATES
from .llm_provider import LLMNotConfiguredError, LLMProviderError, TutorLLMProvider
from .models import QuantumCircuitModel
from .tutor_checks import analyze_circuit
from .tutor_models import TutorAnalyzeResponse, TutorWarning


def _circuit_summary(circuit: QuantumCircuitModel) -> str:
    if not circuit.operations:
        return f"{circuit.qubits} qubit(s), {circuit.classicalBits} classical bit(s), no gates placed yet."

    ordered = sorted(circuit.operations, key=lambda op: (op.timeStep, op.id))
    lines = [f"{circuit.qubits} qubit(s), {circuit.classicalBits} classical bit(s). Gates in time order:"]
    for op in ordered:
        gate = GATES.get(op.gate)
        name = gate.qiskit_name.upper() if gate else op.gate.upper()
        controls = f", controls=q{op.controls}" if op.controls else ""
        params = f", params={op.parameters}" if op.parameters else ""
        lines.append(f"  step {op.timeStep}: {name}(targets=q{op.targets}{controls}{params})")
    return "\n".join(lines)


def _simulation_summary(sv: Statevector, bloch: list[dict]) -> str:
    probs = sv.probabilities_dict()
    top = sorted(probs.items(), key=lambda kv: -kv[1])[:8]
    prob_line = ", ".join(f"|{bits}>: {p * 100:.1f}%" for bits, p in top) if top else "(no measurable outcomes)"

    bloch_lines = []
    for b in bloch:
        if b["pure"]:
            bloch_lines.append(f"q{b['qubit']}: theta={b['theta']:.2f}rad phi={b['phi']:.2f}rad (pure state)")
        else:
            bloch_lines.append(f"q{b['qubit']}: mixed/entangled (Bloch vector length r={b['r']:.2f})")

    return f"Exact outcome probabilities: {prob_line}\nPer-qubit Bloch state: " + "; ".join(bloch_lines)


def _fallback_optimization(issues: list[str]) -> str:
    if issues:
        return issues[0]
    return (
        "No obvious optimization found by the rule-based checks — configure ANTHROPIC_API_KEY "
        "on the backend for AI-generated suggestions."
    )


def build_tutor_response(
    circuit: QuantumCircuitModel,
    sv: Statevector,
    bloch: list[dict],
    provider: TutorLLMProvider,
) -> TutorAnalyzeResponse:
    issues = analyze_circuit(circuit)
    circuit_summary = _circuit_summary(circuit)
    simulation_summary = _simulation_summary(sv, bloch)

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
            warning=TutorWarning(detected=bool(issues), message=" ".join(issues)),
            optimization=_fallback_optimization(issues),
            source="deterministic",
        )

    # Deterministic findings are never silently dropped, even if the LLM
    # doesn't surface them itself — reliability over eloquence.
    detected = bool(issues) or llm_output.warning_detected
    return TutorAnalyzeResponse(
        explanation=llm_output.explanation,
        warning=TutorWarning(detected=detected, message=llm_output.warning_message or " ".join(issues)),
        optimization=llm_output.optimization,
        source="llm",
    )
