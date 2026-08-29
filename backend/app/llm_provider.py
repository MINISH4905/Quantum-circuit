"""
LLM provider interface for the AI tutor. `TutorLLMProvider` is a small
Protocol so tutor.py never depends on a specific vendor SDK — swap in a
different implementation of the same interface to use another provider
without touching tutor.py or main.py.

Default provider: Groq (https://groq.com) serving llama-3.3-70b-versatile
via their cloud API. Requires a GROQ_API_KEY environment variable.
"""

from __future__ import annotations

import json
import os
from typing import Protocol

GROQ_DEFAULT_MODEL = "llama-3.3-70b-versatile"

TUTOR_JSON_SCHEMA = {
    "type": "object",
    "properties": {
        "explanation": {"type": "string"},
        "steps": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "step": {"type": "integer"},
                    "gate": {"type": "string"},
                    "qubits": {"type": "string"},
                    "action": {"type": "string"},
                    "stateAfter": {"type": "string"},
                },
                "required": ["step", "gate", "qubits", "action", "stateAfter"],
            },
        },
        "gateDefinitions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "gate": {"type": "string"},
                    "definition": {"type": "string"},
                    "matrix": {"type": "string"},
                },
                "required": ["gate", "definition"],
            },
        },
        "algorithm": {"type": "string"},
        "warningDetected": {"type": "boolean"},
        "warningMessage": {"type": "string"},
        "optimization": {"type": "string"},
    },
    "required": [
        "explanation",
        "steps",
        "gateDefinitions",
        "algorithm",
        "warningDetected",
        "warningMessage",
        "optimization",
    ],
    "additionalProperties": False,
}

TUTOR_SYSTEM_PROMPT = """\
You are a quantum computing tutor embedded in a visual circuit editor for beginners and \
intermediate learners. You receive the EXACT circuit (gates, qubits, time steps), its EXACT \
simulated results (statevector probabilities and Bloch sphere data), and any issues found by an \
automated rule-based checker. Ground EVERY claim strictly in this data — never invent gates, \
qubits, probabilities, or behavior not present.

Respond ONLY with a JSON object containing these fields:

1. "explanation" (string, 3-5 sentences):
   - Start by naming what the circuit does in plain English (e.g. "This circuit creates a Bell \
state — a maximally entangled pair of qubits.").
   - Reference the exact gates and qubits from the input.
   - Explain the key quantum phenomena at work (superposition, entanglement, interference, phase \
kickback, etc.) with a one-sentence definition the FIRST time each concept appears.
   - Tie the explanation to the simulation results: mention the actual probabilities or Bloch \
sphere states given.

2. "steps" (array of objects — one per gate/operation in time order):
   These steps are LAB INSTRUCTIONS — a learner should be able to rebuild this entire circuit \
from scratch by following them sequentially. Each step tells the learner what to place and why.
   Each step has:
   - "step": integer (1-based)
   - "gate": the gate name (e.g. "H", "CNOT", "RX(π/4)")
   - "qubits": which qubits it acts on (e.g. "q0", "q0 → q1")
   - "action": a lab-style instruction with two parts: (1) a placement directive telling the \
learner which gate to drag onto which qubit, and (2) one sentence explaining WHY this step \
matters and what it achieves in the context of the circuit. Use positional language: \
"Start by placing…" for step 1, "Next, place…" for middle steps, "Finally, add…" for \
measurement steps. \
(e.g. "Start by placing an H gate on q0. This puts q0 into superposition, preparing it for \
entanglement in the next step.")
   - "stateAfter": the quantum state after this step in Dirac notation \
(e.g. "(|00⟩ + |10⟩)/√2" or "|11⟩"). Use exact amplitudes from the simulation when possible.

3. "gateDefinitions" (array of objects — one per UNIQUE gate type used in this circuit):
   Each definition has:
   - "gate": gate name (e.g. "Hadamard (H)")
   - "definition": 1-2 sentence precise definition (e.g. "The Hadamard gate creates an equal \
superposition by mapping |0⟩ to (|0⟩+|1⟩)/√2 and |1⟩ to (|0⟩-|1⟩)/√2.")
   - "matrix" (optional): the matrix representation as a string (e.g. "[[1/√2, 1/√2], [1/√2, -1/√2]]")

4. "algorithm" (string):
   - If the circuit matches a known quantum algorithm or pattern, name it and give a one-sentence \
description. Known patterns: Bell state preparation, GHZ state, quantum teleportation, Deutsch \
algorithm, Bernstein-Vazirani, QFT, Grover diffusion, phase estimation, swap test, superdense \
coding, quantum error correction, variational circuit.
   - If it doesn't match any known pattern, say "Custom circuit — no standard algorithm detected."

5. "warningDetected" (boolean) and "warningMessage" (string):
   - If the automated checker found issues: set warningDetected=true, rewrite each issue as a \
clear, encouraging sentence explaining WHY it's a problem and HOW to fix it.
   - If the checker found nothing and you don't see a clear conceptual mistake in the data: set \
warningDetected=false and warningMessage="".
   - NEVER invent warnings. Only flag issues you can prove from the given circuit and results.

6. "optimization" (string):
   - Give exactly ONE concrete, actionable suggestion specific to THIS circuit.
   - Examples: "Remove the redundant H-H pair on q0", "Add measurements to see classical output", \
"Replace the three CNOT gates with a single Toffoli", "This 3-qubit circuit could be reduced to \
2 qubits."
   - If the circuit is empty, say "Add gates to build a circuit."
   - If the circuit is already minimal, say so clearly.

PRECISION RULES:
- Use Dirac notation (|0⟩, |1⟩, |+⟩, |−⟩) for states.
- Write rotation angles as fractions of π when applicable (π/2, π/4, not 1.5708).
- For entangled states, explicitly note which qubits are entangled and what that means \
for measurement correlation.
- When describing probabilities, use percentages matching the simulation data (e.g. "50.0%").
- If a qubit's Bloch vector has r < 1, explain it's in a mixed state due to entanglement.
"""


class LLMNotConfiguredError(RuntimeError):
    """Raised when generate() is called but no provider credentials are set."""


class LLMProviderError(RuntimeError):
    """Raised when the provider is configured but the request itself failed
    (network error, malformed response, etc.)."""


class TutorLLMOutput:
    __slots__ = (
        "explanation",
        "steps",
        "gate_definitions",
        "algorithm",
        "warning_detected",
        "warning_message",
        "optimization",
    )

    def __init__(
        self,
        explanation: str,
        warning_detected: bool,
        warning_message: str,
        optimization: str,
        steps: list[dict] | None = None,
        gate_definitions: list[dict] | None = None,
        algorithm: str = "",
    ):
        self.explanation = explanation
        self.steps = steps or []
        self.gate_definitions = gate_definitions or []
        self.algorithm = algorithm
        self.warning_detected = warning_detected
        self.warning_message = warning_message
        self.optimization = optimization


class TutorLLMProvider(Protocol):
    def is_configured(self) -> bool: ...

    def generate(
        self, *, circuit_summary: str, simulation_summary: str, detected_issues: list[str]
    ) -> TutorLLMOutput: ...

    def warm_up(self) -> None: ...


def _build_user_prompt(circuit_summary: str, simulation_summary: str, detected_issues: list[str]) -> str:
    issues_block = "\n".join(f"- {issue}" for issue in detected_issues) if detected_issues else "(none found)"
    return (
        f"=== CIRCUIT ===\n{circuit_summary}\n\n"
        f"=== SIMULATION RESULTS ===\n{simulation_summary}\n\n"
        f"=== AUTOMATED CHECKER FINDINGS ===\n{issues_block}\n\n"
        "Analyze this circuit. Respond with the JSON object described in your instructions."
    )


class GroqTutorProvider:
    """Cloud LLM via Groq (https://groq.com) — requires a GROQ_API_KEY
    environment variable. Uses Groq's OpenAI-compatible chat completions API
    with JSON mode for structured output.

    Default model: llama-3.3-70b-versatile (fast inference via Groq's LPU).
    Override with the GROQ_MODEL env var."""

    def __init__(self, api_key: str | None = None, model: str | None = None, timeout: float = 30.0):
        self._api_key = api_key or os.environ.get("GROQ_API_KEY", "")
        self._model = model or os.environ.get("GROQ_MODEL", GROQ_DEFAULT_MODEL)
        self._timeout = timeout

    def is_configured(self) -> bool:
        return bool(self._api_key)

    def warm_up(self) -> None:
        pass

    def generate(
        self, *, circuit_summary: str, simulation_summary: str, detected_issues: list[str]
    ) -> TutorLLMOutput:
        if not self._api_key:
            raise LLMNotConfiguredError(
                "GROQ_API_KEY environment variable is not set. "
                "Get a free key at https://console.groq.com/keys"
            )

        import httpx

        payload = {
            "model": self._model,
            "messages": [
                {"role": "system", "content": TUTOR_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": _build_user_prompt(circuit_summary, simulation_summary, detected_issues),
                },
            ],
            "temperature": 0.15,
            "max_tokens": 2048,
            "response_format": {"type": "json_object"},
        }

        try:
            resp = httpx.post(
                "https://api.groq.com/openai/v1/chat/completions",
                json=payload,
                headers={
                    "Authorization": f"Bearer {self._api_key}",
                    "Content-Type": "application/json",
                },
                timeout=self._timeout,
            )
            resp.raise_for_status()
            body = resp.json()
        except httpx.HTTPStatusError as exc:
            error_detail = ""
            try:
                error_detail = exc.response.json().get("error", {}).get("message", "")
            except Exception:
                pass
            raise LLMProviderError(
                f"Groq API returned {exc.response.status_code}: {error_detail or str(exc)}"
            ) from exc
        except httpx.HTTPError as exc:
            raise LLMProviderError(f"Groq request failed: {exc}") from exc
        except json.JSONDecodeError as exc:
            raise LLMProviderError(f"Groq returned a non-JSON response: {exc}") from exc

        try:
            text = body["choices"][0]["message"]["content"]
            data = json.loads(text)
            return TutorLLMOutput(
                explanation=data["explanation"],
                steps=data.get("steps", []),
                gate_definitions=data.get("gateDefinitions", []),
                algorithm=data.get("algorithm", ""),
                warning_detected=bool(data["warningDetected"]),
                warning_message=data.get("warningMessage", ""),
                optimization=data.get("optimization", ""),
            )
        except (KeyError, IndexError, json.JSONDecodeError) as exc:
            raise LLMProviderError(f"Unexpected Groq response shape: {exc}") from exc
